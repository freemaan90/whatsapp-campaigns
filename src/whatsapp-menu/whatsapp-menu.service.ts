import { Injectable } from '@nestjs/common';
import { Appointment } from 'src/appointment/appointment.entity';
import { AppointmentService } from 'src/appointment/appointment.service';
import { getSenderName } from 'src/common/utils/helpers';
import { ConversationStateService } from 'src/conversation-state/conversation-state.service';
import { WhatsappService } from 'src/whatsapp/whatsapp.service';

@Injectable()
export class WhatsappMenuService {
  constructor(
    private whatsAppService: WhatsappService,
    private readonly stateService: ConversationStateService,
    private appointmentService: AppointmentService,
  ) {}

  async handleMenuOption(to: string, option: string) {
    let response;

    switch (option) {
      case 'option_1':
        await this.stateService.setAppointmentState(to, { step: 'name' });
        response = 'Por favor, ingresa tu nombre: ';
        break;

      case 'option_2':
        const appointments = await this.appointmentService.findByPhone(to);

        if (appointments.length === 0) {
          response = 'No encontramos reservas asociadas a tu número.';
          break;
        }

        response = this.formatAppointments(appointments);
        break;

      case 'option_3':
        await this.sendLocation(to);
        await this.sendContact(to);
        response = 'Te esperamos en nuestra sucursal';
        break;

      default:
        response = 'Lo siento, no entendí tu selección';
        break;
    }

    await this.whatsAppService.sendMessage(to, response);
  }

  async sendWelcomeMenu(to: string) {
    const menuMessage = `Elige una opción`;
    const buttons = [
      { type: 'reply', reply: { id: 'option_1', title: 'Agendar' } },
      { type: 'reply', reply: { id: 'option_2', title: 'Consultar' } },
      { type: 'reply', reply: { id: 'option_3', title: 'Ubicación' } },
    ];

    await this.whatsAppService.sendInteractiveButtons(to, menuMessage, buttons);
  }

  async sendWelcomeMessage(to: string, messageId: string, senderInfo: any) {
    const senderName = getSenderName(senderInfo);
    const message = `Bienvenido a MEDPET, ¿en qué puedo ayudarte hoy?`;
    const welcomeMessage = `Hola ${senderName}, ${message}`;
    await this.whatsAppService.sendMessage(to, welcomeMessage, messageId);
  }

  async sendContact(to: string) {
    const contact = {
      addresses: [
        {
          street: '123 Calle de las Mascotas',
          city: 'Ciudad',
          state: 'Estado',
          zip: '12345',
          country: 'País',
          country_code: 'PA',
          type: 'WORK',
        },
      ],
      emails: [{ email: 'contacto@medpet.com', type: 'WORK' }],
      name: {
        formatted_name: 'MedPet Contacto',
        first_name: 'MedPet',
        last_name: 'Contacto',
      },
      org: {
        company: 'MedPet',
        department: 'Atención al Cliente',
        title: 'Representante',
      },
      phones: [{ phone: '+1234567890', wa_id: '1234567890', type: 'WORK' }],
      urls: [{ url: 'https://www.medpet.com', type: 'WORK' }],
    };

    await this.whatsAppService.sendContactMessage(to, contact);
  }

  async sendLocation(to: string) {
    const latitude = -32.966896;
    const longitud = -60.654808;
    const name = 'Frederico';
    const address = 'Galvez 1889, Rosario, Santa Fe';

    await this.whatsAppService.sendLocationMessage(
      to,
      latitude,
      longitud,
      name,
      address,
    );
  }

  // -----------------------------
  //   APPOINTMENT FLOW (Redis)
  // -----------------------------
  async handleAppointmentFlow(to: string, message: string) {
    const state = await this.stateService.getAppointmentState(to);
    let response;

    switch (state?.step) {
      case 'name':
        await this.stateService.setAppointmentState(to, {
          ...state,
          name: message,
          step: 'petName',
        });
        response = 'Gracias, ¿cuál es el nombre de tu mascota?';
        break;

      case 'petName':
        await this.stateService.setAppointmentState(to, {
          ...state,
          petName: message,
          step: 'petType',
        });
        response =
          '¿Qué tipo de mascota es? (por ejemplo: perro, gato, hurón, etc.)';
        break;

      case 'petType':
        await this.stateService.setAppointmentState(to, {
          ...state,
          petType: message,
          step: 'reason',
        });
        response = '¿Cuál es el motivo de tu consulta?';
        break;

      case 'reason':
        await this.stateService.setAppointmentState(to, {
          ...state,
          reason: message,
          step: 'date',
        });
        response =
          'Perfecto. ¿Qué fecha te gustaría reservar? (Ej: 15/02/2025)';
        break;

      case 'date':
        const parsedDate = this.parseDate(message);
        if (!parsedDate) {
          response = 'La fecha no es válida. Usa formato DD/MM/AAAA.';
          break;
        }

        await this.stateService.setAppointmentState(to, {
          ...state,
          date: parsedDate,
          step: 'time',
        });

        response = 'Perfecto. ¿Qué hora te gustaría reservar? (Ej: 14:30)';
        break;

      case 'time':
        const parsedTime = this.parseTime(message);
        if (!parsedTime) {
          response = 'La hora no es válida. Usa formato HH:mm.';
          break;
        }

        // Validar disponibilidad
        const isFree = await this.appointmentService.isAvailable(
          state.date,
          parsedTime,
        );

        if (!isFree) {
          response = 'Ese horario ya está reservado. Elige otro horario.';
          break;
        }

        await this.stateService.setAppointmentState(to, {
          ...state,
          time: parsedTime,
        });

        response = await this.completeAppointment(to);
        break;

      default:
        response = 'No entendí tu respuesta, volvamos a empezar.';
        await this.stateService.clearState(to);
        break;
    }

    await this.whatsAppService.sendMessage(to, response);
  }

  async completeAppointment(to: string) {
    const appointment = await this.stateService.getAppointmentState(to);

    await this.appointmentService.create({
      phone: to,
      name: appointment.name,
      petName: appointment.petName,
      petType: appointment.petType,
      reason: appointment.reason,
      date: appointment.date, // ← string
      time: appointment.time, // ← string
    });

    await this.stateService.clearState(to);

    const userData = [
      to,
      appointment.name,
      appointment.petName,
      appointment.petType,
      appointment.reason,
      new Date().toISOString(),
    ];


    return `Gracias por agendar tu cita.
          Resumen de la cita:
          - Nombre: ${appointment.name}
          - Mascota: ${appointment.petName}
          - Tipo: ${appointment.petType}
          - Motivo: ${appointment.reason}
          - Fecha: ${appointment.date}
          - Hora: ${appointment.time}

        Nos pondremos en contacto contigo pronto para confirmar fecha y hora.`;
  }

  // -----------------------------
  //   ASSISTANT FLOW (Redis)
  // -----------------------------
  async hadleAssistandFlow(to: string, message: string) {
    const state = await this.stateService.getAssistantState(to);
    let response;

    if (state?.step === 'question') {
      // response = await geminiAiService(message);
      response = 'Estoy procesando tu consulta...';
    }

    await this.stateService.clearState(to);

    const menuMessage = '¿La respuesta fue de tu ayuda?';
    const buttons = [
      { type: 'reply', reply: { id: 'option_4', title: 'Sí, gracias' } },
      {
        type: 'reply',
        reply: { id: 'option_5', title: 'Hacer otra pregunta' },
      },
    ];

    await this.whatsAppService.sendMessage(to, response);
    await this.whatsAppService.sendInteractiveButtons(to, menuMessage, buttons);
  }
  
  parseTime(input: string): string | null {
    // Formato HH:mm
    const regex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    if (!regex.test(input)) return null;

    return input; // válido
  }
  parseDate(input: string): string | null {
    // Formato esperado: DD/MM/YYYY
    const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    const match = input.match(regex);

    if (!match) return null;

    const [_, day, month, year] = match;
    const date = new Date(`${year}-${month}-${day}`);

    if (isNaN(date.getTime())) return null;

    return date.toISOString();
  }
  formatAppointments(appointments: Appointment[]) {
    let msg = 'Estas son tus reservas:\n\n';

    for (const a of appointments) {
      msg += `📅 *${a.date}* a las *${a.time}*\n`;
      msg += `🐾 Mascota: ${a.petName}\n`;
      msg += `🔎 Motivo: ${a.reason}\n\n`;
    }

    return msg;
  }
}

import { Injectable } from '@nestjs/common';
import { getSenderName } from 'src/common/utils/helpers';
import { ConversationStateService } from 'src/conversation-state/conversation-state.service';
import { GoogleSheetsService } from 'src/google-sheets/google-sheets.service';
import { WhatsappService } from 'src/whatsapp/whatsapp.service';

@Injectable()
export class WhatsappMenuService {
  constructor(
    private whatsAppService: WhatsappService,
    private googleSheetsService: GoogleSheetsService,
    private readonly stateService: ConversationStateService,
  ) {}

  async handleMenuOption(to: string, option: string) {
    let response;

    switch (option) {
      case 'option_1':
        await this.stateService.setAppointmentState(to, { step: 'name' });
        response = 'Por favor, ingresa tu nombre: ';
        break;

      case 'option_2':
        await this.stateService.setAssistantState(to, { step: 'question' });
        response = 'Realiza tu consulta';
        break;

      case 'option_3':
        await this.sendLocation(to);
        response = 'Te esperamos en nuestra sucursal';
        break;

      case 'option_6':
        response =
          'Si esto es una emergencia te invitamos a llamar a nuestra linea de atencion';
        await this.sendContact(to);
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

    await this.stateService.clearState(to);

    const userData = [
      to,
      appointment.name,
      appointment.petName,
      appointment.petType,
      appointment.reason,
      new Date().toISOString(),
    ];

    this.googleSheetsService.appendToSheets(userData);

    return `Gracias por agendar tu cita.
Resumen de la cita:
- Nombre: ${appointment.name}
- Mascota: ${appointment.petName}
- Tipo: ${appointment.petType}
- Motivo: ${appointment.reason}

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
      { type: 'reply', reply: { id: 'option_6', title: 'Emergencia' } },
    ];

    await this.whatsAppService.sendMessage(to, response);
    await this.whatsAppService.sendInteractiveButtons(to, menuMessage, buttons);
  }
}

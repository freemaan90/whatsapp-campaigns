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
        this.stateService.setAppointmentState(to,{step:'name'})
        response = 'Por favor, ingresa tu nombre: ';
        break;
      case 'option_2':
        this.stateService.setAssistandState(to,{step:'question'})
        response = 'Realiza tu consulta';
        break;
      case 'option_3':
        await this.sendLocation(to);
        response = 'Te esperamos en nuestra sucursal';
        break;

      case 'option_6':
        response =
          'Si esto es una emergencia te invitamos a llamar a nuestra linea de atencion';
        this.sendContact(to);
        break;
      default:
        response = 'Lo siento, no entendi tu seleccion';
        break;
    }
    await this.whatsAppService.sendMessage(to, response);
  }

  async sendWelcomeMenu(to: string) {
    const menuMessage = `Elige una opcion`;
    const buttons = [
      {
        type: 'reply',
        reply: {
          id: 'option_1',
          title: 'Agendar',
        },
      },
      {
        type: 'reply',
        reply: {
          id: 'option_2',
          title: 'Consultar',
        },
      },
      {
        type: 'reply',
        reply: {
          id: 'option_3',
          title: 'Ubicacion',
        },
      },
    ];
    await this.whatsAppService.sendInteractiveButtons(to, menuMessage, buttons);
  }
  async sendWelcomeMessage(to: string, messageId: string, senderInfo: any) {
    const senderName = getSenderName(senderInfo);
    const message = `Bienvenido a MEDPET, En que puedo ayudarte hoy?`;
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
          country: 'PaÃ­s',
          country_code: 'PA',
          type: 'WORK',
        },
      ],
      emails: [
        {
          email: 'contacto@medpet.com',
          type: 'WORK',
        },
      ],
      name: {
        formatted_name: 'MedPet Contacto',
        first_name: 'MedPet',
        last_name: 'Contacto',
        middle_name: '',
        suffix: '',
        prefix: '',
      },
      org: {
        company: 'MedPet',
        department: 'AtenciÃ³n al Cliente',
        title: 'Representante',
      },
      phones: [
        {
          phone: '+1234567890',
          wa_id: '1234567890',
          type: 'WORK',
        },
      ],
      urls: [
        {
          url: 'https://www.medpet.com',
          type: 'WORK',
        },
      ],
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

  async handleAppointmentFlow(to: string, message) {
    const state = this.stateService.getAppointmentState(to)
    let response;

    switch (state.step) {
      case 'name':
        state.name = message;
        state.step = 'petName';
        response = 'Gracias, cual es el nombre de tu mascota?';
        break;
      case 'petName':
        state.petName = message;
        state.step = 'petType';
        response =
          'Que tipo de mascota es? (por ejemplo: perro, gato, huron, etc..)';
        break;
      case 'petType':
        state.petType = message;
        state.step = 'reason';
        response = 'Cual es el motivo de tu consuta?';
        break;
      case 'reason':
        state.reason = message;
        response = this.completeAppointment(to);
        break;
    }
    await this.whatsAppService.sendMessage(to, response);
  }
  completeAppointment(to: string) {
    const appointmet = this.stateService.getAppointmentState(to)
    this.stateService.clearAppointmentState(to)
    const userData = [
      to,
      appointmet.name,
      appointmet.petName,
      appointmet.petType,
      appointmet.reason,
      new Date().toISOString(),
    ];

    this.googleSheetsService.appendToSheets(userData);
    return `Gracias por agendar tu cita
      Resumen de la cita:
      Nombre: ${appointmet.name}
      Nombre de la mascota: ${appointmet.petName}
      Tipo de mascota: ${appointmet.petType}
      Motivo de la consulta: ${appointmet.reason}
      Fecha de la consulta: ${appointmet.date}
  
      Nos pondremos en contacto contigo pronto, para confirmar la fecha y hora de tu cita.
      `;
  }

  async hadleAssistandFlow(to: string, message: any) {
    const state = this.stateService.getAssistandState(to);
    let response;

    const menuMessage = 'La respuesta fue de tu ayuda?';
    const buttons = [
      {
        type: 'reply',
        reply: {
          id: 'option_4',
          title: 'Si, Gracias',
        },
      },
      {
        type: 'reply',
        reply: {
          id: 'option_5',
          title: 'Hacer otra pregunta',
        },
      },
      {
        type: 'reply',
        reply: {
          id: 'option_6',
          title: 'Emergencia',
        },
      },
    ];

    if (state.step === 'question') {
      // response = await geminiAiService(message);
    }

    this.stateService.clearAssistandState(to)
    await this.whatsAppService.sendMessage(to, response);
    await this.whatsAppService.sendInteractiveButtons(to, menuMessage, buttons);
  }
}

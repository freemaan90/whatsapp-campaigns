import { Injectable } from '@nestjs/common';
import { SendTextMessageDto } from './dto/send-text-message.dto';
import { ConfigService } from '@nestjs/config';
import { HttpRequestService } from 'src/http-request/http-request.service';
import {
  getSenderName,
  isGreeting,
  normalizePhoneNumber,
} from 'src/common/utils/helpers';
import { WhatsappService } from 'src/whatsapp/whatsapp.service';
import { GoogleSheetsService } from '../google-sheets/google-sheets.service';
import { Contact } from 'src/interfaces/WhatsappStatusWebhook.interfaces';

@Injectable()
export class WhatsappMessagesService {
  private appointmentState: Record<string, any> = {};
  private assistandState: Record<string, any> = {};
  
  constructor(
    private configService: ConfigService,
    private readonly httpRequest: HttpRequestService,
    private whatsAppService: WhatsappService,
    private googleSheetsService: GoogleSheetsService,
  ) {}

  async sendTextMessage({ to, text }: SendTextMessageDto) {
    const data = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to,
      type: 'text',
      text: {
        preview_url: false,
        body: text,
      },
    };
    const baseURL = `${this.configService.get('BASE_URL')}/v24.0/${this.configService.get('BUSINESS_PHONE')}/messages`;
    const headers = {
      Authorization: `Bearer ${this.configService.get('API_TOKEN')}`,
    };
    return this.httpRequest.post(baseURL, data, headers);
  }

  async handleIncomingMessage(message: any, senderInfo: Contact) {
    
    const phoneNumber = normalizePhoneNumber(message.from);
    if (message?.type === 'text') {
      const incomingMessage = message.text.body.toLowerCase().trim();
      if (isGreeting(incomingMessage)) {
        await this.sendWelcomeMessage(phoneNumber, message.id, senderInfo);
        await this.sendWelcomeMenu(phoneNumber);
      } else if (
        ['document', 'image', 'audio', 'video'].includes(incomingMessage)
      ) {
        await this.sendMedia(phoneNumber, incomingMessage);
      } else if (this.appointmentState[phoneNumber]) {
        this.handleAppointmentFlow(phoneNumber, incomingMessage);
      } else if (this.assistandState[phoneNumber]) {
        await this.hadleAssistandFlow(phoneNumber, incomingMessage);
      } else {
        const option = message.interactive.button_reply.id;
        await this.handleMenuOption(phoneNumber, option);
      }
      await this.whatsAppService.markAsRead(message.id);
    } else if (message?.type === 'interactive') {
      const option = message?.interactive?.button_reply?.id
        .toLowerCase()
        .trim();
      await this.handleMenuOption(phoneNumber, option);
      await this.whatsAppService.markAsRead(message.id);
    }
  }

  async hadleAssistandFlow(to:string, message:any) {
    const state = this.assistandState[to];
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

    delete this.assistandState[to];
    await this.whatsAppService.sendMessage(to, response);
    await this.whatsAppService.sendInteractiveButtons(to, menuMessage, buttons);
  }

  async handleAppointmentFlow(to:string, message) {
    const state = this.appointmentState[to];
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
  async handleMenuOption(to:string, option) {
    let response;
    switch (option) {
      case 'option_1':
        this.appointmentState[to] = { step: 'name' };
        response = 'Por favor, ingresa tu nombre: ';
        break;
      case 'option_2':
        this.assistandState[to] = { step: 'question' };
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
  async sendMedia(to: string, option: any) {
    let mediaUrl;
    let caption;
    let type;
    switch (option) {
      case 'video':
        mediaUrl = 'https://s3.amazonaws.com/gndx.dev/medpet-video.mp4';
        caption = '¡Esto es una video!';
        type = 'video';
        break;
      case 'document':
        mediaUrl = 'https://s3.amazonaws.com/gndx.dev/medpet-file.pdf';
        caption = '¡Esto es un PDF!';
        type = 'document';
        break;

      case 'audio':
        mediaUrl = 'https://s3.amazonaws.com/gndx.dev/medpet-audio.aac';
        caption = 'Bienvenido';
        type = 'audio';
        break;

      case 'image':
        mediaUrl = 'https://s3.amazonaws.com/gndx.dev/medpet-imagen.png';
        caption = '¡Esto es una Imagen!';
        type = 'image';
        break;

      default:
        break;
    }

    await this.whatsAppService.sendMediaMessage(to, type, mediaUrl, caption);
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

  async sendContact(to:string) {
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

  async sendLocation(to:string) {
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

  completeAppointment(to: string) {
    const appointmet = this.appointmentState[to];
    delete this.appointmentState[to];
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
}

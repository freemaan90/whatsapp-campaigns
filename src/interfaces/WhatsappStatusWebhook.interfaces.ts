export interface WhatsappStatusWebhook {
  object: 'whatsapp_business_account';
  entry: Entry[];
}

export interface Entry {
  id: string;
  changes: Change[];
}

export interface Change {
  value: ChangeValue;
  field: string; // normalmente "messages"
}

export interface ChangeValue {
  messaging_product: 'whatsapp';
  metadata: Metadata;
  messages: Message[];   // 👈 aquí
  contacts: Contact[];   // 👈 aquí
  statuses: Status[];
}

export interface Metadata {
  display_phone_number: string;
  phone_number_id: string;
}

export interface Message {
  from: string; // número del remitente
  id: string;   // ID del mensaje (wamid...)
  timestamp: string;
  type: string; // "text", "image", "interactive", etc.
  text: {
    body: string;
  };
  interactive: {
    type: string;
    button_reply: {
      id: string;
      title: string;
    };
    list_reply: {
      id: string;
      title: string;
      description: string;
    };
  };
  image: {
    id: string;
    mime_type: string;
    sha256: string;
  };
  audio: {
    id: string;
    mime_type: string;
    sha256: string;
  };
  video: {
    id: string;
    mime_type: string;
    sha256: string;
  };
  document: {
    id: string;
    filename: string;
    mime_type: string;
    sha256: string;
  };
}

export interface Contact {
  profile: {
    name: string;
  };
  wa_id: string; // número de WhatsApp en formato internacional
}

export interface Status {
  id: string;
  status: string; // ej: "read", "delivered"
  timestamp: string;
  recipient_id: string;
  pricing: Pricing;
}

export interface Pricing {
  billable: boolean;
  pricing_model: string;
  category: string;
  type: string;
}
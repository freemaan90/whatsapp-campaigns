export interface ConversationState {
  appointmentState?: any;
  assistantState?: any;
  step?: string;
  [key: string]: any; // opcional, si querés flexibilidad
}
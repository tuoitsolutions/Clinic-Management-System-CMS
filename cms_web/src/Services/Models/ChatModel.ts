interface ChatModel {
  chat_id?: string;
  chat_name?: string;
  messages?: Array<ChatMessage>;
  handleSendMessage?: () => any;
}

export interface ChatMessage {
  sender_name?: string;
  sender_message?: string;
  sender_time?: string;
  send_img?: any;
}

export default ChatModel;

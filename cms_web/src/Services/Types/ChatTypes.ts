import ChatModel from "../Models/ChatModel";

export type ChatReducerTypes = {
  type: "set_chat_boxes";
  chat_boxes: Array<ChatModel>;
};

export interface ChatReducerModel {
  chat_boxes?: Array<ChatModel>;
}

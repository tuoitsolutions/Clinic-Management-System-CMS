import { Dispatch } from "react";
import ChatModel from "../Models/ChatModel";
import { ChatReducerTypes } from "../Types/ChatTypes";

const SetChatBoxes =
  (chat_boxes: Array<ChatModel>) =>
  async (dispatch: Dispatch<ChatReducerTypes>) => {
    try {
      dispatch({
        type: "set_chat_boxes",
        chat_boxes: chat_boxes,
      });
    } catch (error) {
      console.error(`action error`, error);
    }
  };

export default {
  SetChatBoxes,
};

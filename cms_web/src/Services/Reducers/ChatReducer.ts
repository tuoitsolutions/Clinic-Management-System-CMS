import { ChatReducerModel, ChatReducerTypes } from "../Types/ChatTypes";

const defaultState: ChatReducerModel = {
  chat_boxes: [],
};

const ChatReducer = (
  state: ChatReducerModel = defaultState,
  action: ChatReducerTypes
): ChatReducerModel => {
  switch (action.type) {
    case "set_chat_boxes": {
      return {
        ...state,
        chat_boxes: action.chat_boxes,
      };
    }

    default:
      return state;
  }
};

export default ChatReducer;

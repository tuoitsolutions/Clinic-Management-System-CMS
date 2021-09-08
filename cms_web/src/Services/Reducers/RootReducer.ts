import { combineReducers } from "redux";

import UserReducer from "./UserReducer";
import PageReducer from "./PageReducer";
import DefaultValuesReducer from "./DefaultValuesReducer";
import ChatReducer from "./ChatReducer";
import ConsultRequestReducer from "./ConsultRequestReducer";

const RootReducer = combineReducers({
  UserReducer,
  PageReducer,
  DefaultValuesReducer,
  ChatReducer,
  ConsultRequestReducer,
});

export default RootReducer;

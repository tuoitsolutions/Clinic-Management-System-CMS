import { combineReducers } from "redux";

import UserReducer from "./UserReducer";
import PageReducer from "./PageReducer";
import DefaultValuesReducer from "./DefaultValuesReducer";
import ChatReducer from "./ChatReducer";

const RootReducer = combineReducers({
  UserReducer,
  PageReducer,
  DefaultValuesReducer,
  ChatReducer,
});

export default RootReducer;

import { combineReducers } from "redux";

import UserReducer from "./UserReducer";
import PageReducer from "./PageReducer";
import DefaultValuesReducer from "./DefaultValuesReducer";

const RootReducer = combineReducers({
  UserReducer,
  PageReducer,
  DefaultValuesReducer,
});

export default RootReducer;

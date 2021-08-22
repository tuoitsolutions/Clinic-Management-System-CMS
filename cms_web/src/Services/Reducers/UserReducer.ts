import { UserReducerModel, UserReducerTypes } from "../Types/UserTypes";

const defaultState: UserReducerModel = {
  fetch_user: false,
};

const UserReducer = (
  state: UserReducerModel = defaultState,
  action: UserReducerTypes
): UserReducerModel => {
  switch (action.type) {
    case "set_user": {
      return {
        ...state,
        user: action.user,
      };
    }

    case "set_fetch_user": {
      return {
        ...state,
        fetch_user: action.fetch_user,
      };
    }

    case "set_online_users": {
      return {
        ...state,
        online_users: action.online_users,
      };
    }

    case "set_admin_socket_con": {
      return {
        ...state,
        admin_socket_con: action.admin_socket_con,
      };
    }

    default:
      return state;
  }
};

export default UserReducer;

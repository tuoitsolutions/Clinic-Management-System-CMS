import UserEntity from "../Entities/UserEntity";
import { OnlineUserModel } from "../Models/UserModel";

export type UserReducerTypes =
  | {
      type: "set_user";
      user: UserEntity;
    }
  | {
      type: "set_fetch_user";
      fetch_user: boolean;
    }
  | {
      type: "set_online_users";
      online_users: Array<OnlineUserModel>;
    }
  | {
      type: "set_admin_socket_con";
      admin_socket_con: any;
    };

export interface UserReducerModel {
  user?: UserEntity;
  fetch_user?: boolean;
  online_users?: Array<OnlineUserModel>;
  admin_socket_con?: any;
}

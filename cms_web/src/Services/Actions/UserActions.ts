import { Dispatch } from "react";
import UserApi from "../Api/UserApi";
import ResponseModel from "../Models/ServerResponseModel";
import { OnlineUserModel } from "../Models/UserModel";
import { UserReducerTypes } from "../Types/UserTypes";

export const setCurrentUserAction =
  () => async (dispatch: Dispatch<UserReducerTypes>) => {
    try {
      dispatch({
        type: "set_fetch_user",
        fetch_user: true,
      });
      const response: ResponseModel = await UserApi.currentUserApi();

      console.log(`response`, response);

      if (response.success) {
        dispatch({
          type: "set_user",
          user: response.data,
        });
      }
      dispatch({
        type: "set_fetch_user",
        fetch_user: false,
      });
    } catch (error) {}
  };

export const setOnlineUsers =
  (onlineUsers: Array<OnlineUserModel>) =>
  async (dispatch: Dispatch<UserReducerTypes>) => {
    try {
      dispatch({
        type: "set_online_users",
        online_users: onlineUsers,
      });
    } catch (error) {}
  };

export const setAdminSocketCon =
  (currCon: any) => async (dispatch: Dispatch<UserReducerTypes>) => {
    try {
      dispatch({
        type: "set_admin_socket_con",
        admin_socket_con: currCon,
      });
    } catch (error) {}
  };

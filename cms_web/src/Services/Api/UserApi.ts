import { PostFetch } from "../../Hooks/UseFetch";
import ResponseModel from "../Models/ServerResponseModel";
import { AuthUserPayload } from "../Payloads/AuthUserPayloads";

const BASE = `api/user/`;

const currentUserApi = async (): Promise<ResponseModel> => {
  const response = await PostFetch(BASE + "currentUser", null);
  return response;
};

const authUserApi = async (user: AuthUserPayload): Promise<ResponseModel> => {
  const response = await PostFetch(BASE + "login", user);
  return response;
};

const GetUserResidentDtls = async (): Promise<ResponseModel> => {
  const response = await PostFetch(BASE + "GetUserResidentDtls", null);
  return response;
};

const GetUserResidentPic = async (): Promise<ResponseModel> => {
  const response = await PostFetch(BASE + "GetUserResidentPic", null);
  return response;
};

export default {
  currentUserApi,
  authUserApi,
  GetUserResidentDtls,
  GetUserResidentPic,
};

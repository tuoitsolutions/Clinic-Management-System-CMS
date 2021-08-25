import { PostFetch } from "../../Hooks/UseFetch";
import ConsultReqChatEntity from "../Entities/ConsultChatEntity";
import ResponseModel from "../Models/ServerResponseModel";

const BASE = `api/ConsultChat/`;

const JoinConsultChat = async (
  payload: ConsultReqChatEntity
): Promise<ResponseModel> => {
  const response = await PostFetch(BASE + "JoinConsultChat", payload);
  return response;
};

const LeaveConsultChat = async (
  payload: ConsultReqChatEntity
): Promise<ResponseModel> => {
  const response = await PostFetch(BASE + "LeaveConsultChat", payload);
  return response;
};

const InsertConsultChat = async (
  payload: ConsultReqChatEntity
): Promise<ResponseModel> => {
  const response = await PostFetch(BASE + "InsertConsultChat", payload);
  return response;
};
const GetConsultChat = async (id: string): Promise<ResponseModel> => {
  const response = await PostFetch(BASE + "GetConsultChat", {
    value: id,
  });
  return response;
};

export default {
  InsertConsultChat,
  JoinConsultChat,
  LeaveConsultChat,
  GetConsultChat,
};

import { PostFetch } from "../../Hooks/UseFetch";
import ConsultProcEntity from "../Entities/ConsultProcEntity";
import { PaginationModel } from "../Models/PaginationModel";
import ResponseModel from "../Models/ServerResponseModel";

const BASE = `api/ConsultProc/`;

const InsertConsultProc = async (
  payload: ConsultProcEntity
): Promise<ResponseModel> => {
  const response = await PostFetch(BASE + "InsertConsultProc", payload);
  return response;
};

const UpdateConsultProc = async (
  payload: ConsultProcEntity
): Promise<ResponseModel> => {
  const response = await PostFetch(BASE + "UpdateConsultProc", payload);
  return response;
};

const GetTableConsultProc = async (
  payload: PaginationModel
): Promise<ResponseModel> => {
  const response = await PostFetch(BASE + "GetTableConsultProc", payload);
  return response;
};

const GetConsultProcByConsultProcPk = async (
  id?: number
): Promise<ResponseModel> => {
  const response = await PostFetch(BASE + "GetConsultProcByConsultProcPk", {
    value: id,
  });
  return response;
};

export default {
  InsertConsultProc,
  UpdateConsultProc,
  GetTableConsultProc,
  GetConsultProcByConsultProcPk,
};

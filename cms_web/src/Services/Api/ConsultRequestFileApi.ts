import { FormDataPostFetch, PostFetch } from "../../Hooks/UseFetch";
import ConsultRequestFileEntity from "../Entities/ConsultRequestFileEntity";
import { PaginationModel } from "../Models/PaginationModel";
import ResponseModel from "../Models/ServerResponseModel";

const BASE = `api/ConsultReqFile/`;

const GetTableConsultReqFile = async (
  payload: PaginationModel
): Promise<ResponseModel> => {
  const response = await PostFetch(BASE + "GetTableConsultReqFile", payload);
  return response;
};

const GetConsultReqFileByPk = async (
  cr_file_pk: number
): Promise<ResponseModel> => {
  const response = await PostFetch(BASE + "GetConsultReqFileByPk", {
    value: cr_file_pk,
  });
  return response;
};

const InsertConsultFile = async (payload: FormData): Promise<ResponseModel> => {
  const response = await FormDataPostFetch(BASE + "InsertConsultFile", payload);
  return response;
};

const UpdateConsultFile = async (
  payload: ConsultRequestFileEntity
): Promise<ResponseModel> => {
  const response = await PostFetch(BASE + "UpdateConsultFile", payload);
  return response;
};

export default {
  GetTableConsultReqFile,
  GetConsultReqFileByPk,
  InsertConsultFile,
  UpdateConsultFile,
};

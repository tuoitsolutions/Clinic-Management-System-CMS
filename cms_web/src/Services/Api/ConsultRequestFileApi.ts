import { PostFetch } from "../../Hooks/UseFetch";
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

export default {
  GetTableConsultReqFile,
  GetConsultReqFileByPk,
};

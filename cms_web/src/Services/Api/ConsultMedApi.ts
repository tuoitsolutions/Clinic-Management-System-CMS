import { PostFetch } from "../../Hooks/UseFetch";
import ConsultMedEntity from "../Entities/ConsultMedEntity";
import { PaginationModel } from "../Models/PaginationModel";
import ResponseModel from "../Models/ServerResponseModel";

const BASE = `api/ConsultMed/`;

const InsertConsultMed = async (
  payload: ConsultMedEntity
): Promise<ResponseModel> => {
  const response = await PostFetch(BASE + "InsertConsultMed", payload);
  return response;
};

const UpdateConsultMed = async (
  payload: ConsultMedEntity
): Promise<ResponseModel> => {
  const response = await PostFetch(BASE + "UpdateConsultMed", payload);
  return response;
};

const GetTableConsultMed = async (
  payload: PaginationModel
): Promise<ResponseModel> => {
  const response = await PostFetch(BASE + "GetTableConsultMed", payload);
  return response;
};

const GetConsultMedByConsultMedPk = async (
  id?: number
): Promise<ResponseModel> => {
  const response = await PostFetch(BASE + "GetConsultMedByConsultMedPk", {
    value: id,
  });
  return response;
};

const PreviewMedPrescrip = async (id: string): Promise<ResponseModel> => {
  const response = await PostFetch(BASE + "PreviewMedPrescrip", {
    value: id,
  });
  return response;
};

const EmailMedPrescrip = async (
  payload: ConsultMedEntity
): Promise<ResponseModel> => {
  const response = await PostFetch(BASE + "EmailMedPrescrip", payload);
  return response;
};

export default {
  InsertConsultMed,
  UpdateConsultMed,
  GetTableConsultMed,
  GetConsultMedByConsultMedPk,
  PreviewMedPrescrip,
  EmailMedPrescrip,
};

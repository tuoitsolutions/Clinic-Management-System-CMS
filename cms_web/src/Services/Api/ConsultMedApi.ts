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

export default {
  InsertConsultMed,
  UpdateConsultMed,
  GetTableConsultMed,
  GetConsultMedByConsultMedPk,
};

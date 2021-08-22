import { PostFetch } from "../../Hooks/UseFetch";
import ConsultImmuneEntity from "../Entities/ConsultImmuneEntity";
import { PaginationModel } from "../Models/PaginationModel";
import ResponseModel from "../Models/ServerResponseModel";

const BASE = `api/ConsultImmune/`;

const InsertConsultImmune = async (
  payload: ConsultImmuneEntity
): Promise<ResponseModel> => {
  const response = await PostFetch(BASE + "InsertConsultImmune", payload);
  return response;
};

const UpdateConsultImmune = async (
  payload: ConsultImmuneEntity
): Promise<ResponseModel> => {
  const response = await PostFetch(BASE + "UpdateConsultImmune", payload);
  return response;
};

const GetTableConsultImmune = async (
  payload: PaginationModel
): Promise<ResponseModel> => {
  const response = await PostFetch(BASE + "GetTableConsultImmune", payload);
  return response;
};

const GetConsultImmuneByConsultImmunePk = async (
  id?: number
): Promise<ResponseModel> => {
  const response = await PostFetch(BASE + "GetConsultImmuneByConsultImmunePk", {
    value: id,
  });
  return response;
};

export default {
  InsertConsultImmune,
  UpdateConsultImmune,
  GetTableConsultImmune,
  GetConsultImmuneByConsultImmunePk,
};

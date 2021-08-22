import { PostFetch } from "../../Hooks/UseFetch";
import ConsultMedProbEntity from "../Entities/ConsultMedProbEntity";
import { PaginationModel } from "../Models/PaginationModel";
import ResponseModel from "../Models/ServerResponseModel";

const BASE = `api/ConsultMedProb/`;

const InsertConsultMedProb = async (
  payload: ConsultMedProbEntity
): Promise<ResponseModel> => {
  const response = await PostFetch(BASE + "InsertConsultMedProb", payload);
  return response;
};

const UpdateConsultMedProb = async (
  payload: ConsultMedProbEntity
): Promise<ResponseModel> => {
  const response = await PostFetch(BASE + "UpdateConsultMedProb", payload);
  return response;
};

const GetTableConsultMedProb = async (
  payload: PaginationModel
): Promise<ResponseModel> => {
  const response = await PostFetch(BASE + "GetTableConsultMedProb", payload);
  return response;
};

const GetConsultMedProbByConsultMedProbPk = async (
  id?: number
): Promise<ResponseModel> => {
  const response = await PostFetch(
    BASE + "GetConsultMedProbByConsultMedProbPk",
    {
      value: id,
    }
  );
  return response;
};

export default {
  InsertConsultMedProb,
  UpdateConsultMedProb,
  GetTableConsultMedProb,
  GetConsultMedProbByConsultMedProbPk,
};

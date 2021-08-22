import { PostFetch } from "../../Hooks/UseFetch";
import ConsultAllergyEntity from "../Entities/ConsultAllergyEntity";
import { PaginationModel } from "../Models/PaginationModel";
import ResponseModel from "../Models/ServerResponseModel";

const BASE = `api/ConsultAllergy/`;

const InsertConsultAllergy = async (
  payload: ConsultAllergyEntity
): Promise<ResponseModel> => {
  const response = await PostFetch(BASE + "InsertConsultAllergy", payload);
  return response;
};

const UpdateConsultAllergy = async (
  payload: ConsultAllergyEntity
): Promise<ResponseModel> => {
  const response = await PostFetch(BASE + "UpdateConsultAllergy", payload);
  return response;
};

const GetTableConsultAllergy = async (
  payload: PaginationModel
): Promise<ResponseModel> => {
  const response = await PostFetch(BASE + "GetTableConsultAllergy", payload);
  return response;
};

const GetConsultAllergyByConsultAllergyPk = async (
  id?: number
): Promise<ResponseModel> => {
  const response = await PostFetch(
    BASE + "GetConsultAllergyByConsultAllergyPk",
    {
      value: id,
    }
  );
  return response;
};

export default {
  InsertConsultAllergy,
  UpdateConsultAllergy,
  GetTableConsultAllergy,
  GetConsultAllergyByConsultAllergyPk,
};

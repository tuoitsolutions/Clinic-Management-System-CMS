import { PostFetch } from "../../Hooks/UseFetch";
import ConsultVitalSignEntity from "../Entities/ConsultVitalSignEntity";
import { PaginationModel } from "../Models/PaginationModel";
import ResponseModel from "../Models/ServerResponseModel";

const BASE = `api/ConsultVitalSign/`;

const InsertConsultVitalSign = async (
  payload: ConsultVitalSignEntity
): Promise<ResponseModel> => {
  const response = await PostFetch(BASE + "InsertConsultVitalSign", payload);
  return response;
};

const UpdateConsultVitalSign = async (
  payload: ConsultVitalSignEntity
): Promise<ResponseModel> => {
  const response = await PostFetch(BASE + "UpdateConsultVitalSign", payload);
  return response;
};

const GetTableConsultVitalSign = async (
  payload: PaginationModel
): Promise<ResponseModel> => {
  const response = await PostFetch(BASE + "GetTableConsultVitalSign", payload);
  return response;
};

const GetConsultVitalSignByConsultVitalSignPk = async (
  id?: number
): Promise<ResponseModel> => {
  const response = await PostFetch(
    BASE + "GetConsultVitalSignByConsultVitalSignPk",
    {
      value: id,
    }
  );
  return response;
};

export default {
  InsertConsultVitalSign,
  UpdateConsultVitalSign,
  GetTableConsultVitalSign,
  GetConsultVitalSignByConsultVitalSignPk,
};

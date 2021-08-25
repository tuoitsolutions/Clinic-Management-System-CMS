import { PostFetch } from "../../Hooks/UseFetch";
import ResponseModel from "../Models/ServerResponseModel";

const BASE = `api/HospPatient/`;

const GetHosPatientById = async (id?: number): Promise<ResponseModel> => {
  const response = await PostFetch(BASE + "GetHosPatientById", {
    value: id,
  });
  return response;
};

export default {
  GetHosPatientById,
};

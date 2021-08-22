import { PostFetch } from "../../Hooks/UseFetch";
import ResponseModel from "../Models/ServerResponseModel";

const BASE = `api/def/`;

const getHospitalNameApi = async (): Promise<ResponseModel> => {
  const response = await PostFetch(BASE + "getHospitalName", null);
  return response;
};

const getHospitalTaglineApi = async (): Promise<ResponseModel> => {
  const response = await PostFetch(BASE + "getHospitalTagline", null);
  return response;
};

const getHospitalLogoApi = async (): Promise<ResponseModel> => {
  const response = await PostFetch(BASE + "getHospitalLogo", null);
  return response;
};

export default {
  getHospitalNameApi,
  getHospitalTaglineApi,
  getHospitalLogoApi,
};

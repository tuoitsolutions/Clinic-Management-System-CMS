import { PostFetch } from "../../Hooks/UseFetch";
import ResponseModel from "../Models/ServerResponseModel";

const BASE = `api/defval/`;

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

const GetConsultDefRegion = async (): Promise<ResponseModel> => {
  const response = await PostFetch(BASE + "GetConsultDefRegion", null);
  return response;
};

const GetConsultDefZipcode = async (): Promise<ResponseModel> => {
  const response = await PostFetch(BASE + "GetConsultDefZipcode", null);
  return response;
};

export default {
  getHospitalNameApi,
  getHospitalTaglineApi,
  getHospitalLogoApi,
  GetConsultDefRegion,
  GetConsultDefZipcode,
};

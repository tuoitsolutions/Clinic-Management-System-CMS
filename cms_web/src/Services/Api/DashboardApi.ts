import { PostFetch } from "../../Hooks/UseFetch";
import ResponseModel from "../Models/ServerResponseModel";

const BASE = `api/dashboard/`;

const GetTotalForApproval = async (): Promise<ResponseModel> => {
  const response = await PostFetch(BASE + "GetTotalForApproval", null);
  return response;
};

const GetTotalPaid = async (): Promise<ResponseModel> => {
  const response = await PostFetch(BASE + "GetTotalPaid", null);
  return response;
};

const GetTotalStarted = async (): Promise<ResponseModel> => {
  const response = await PostFetch(BASE + "GetTotalStarted", null);
  return response;
};

const GetTotalEnded = async (): Promise<ResponseModel> => {
  const response = await PostFetch(BASE + "GetTotalEnded", null);
  return response;
};

const GetFinishConsult = async (): Promise<ResponseModel> => {
  const response = await PostFetch(BASE + "GetFinishConsult", null);
  return response;
};

const GetLatestConsultReqUserDept = async (): Promise<ResponseModel> => {
  const response = await PostFetch(BASE + "GetLatestConsultReqUserDept", null);
  return response;
};
const GetLatestConsultForResident = async (): Promise<ResponseModel> => {
  const response = await PostFetch(BASE + "GetLatestConsultForResident", null);
  return response;
};

const GetLatestConsultReqOtherDept = async (): Promise<ResponseModel> => {
  const response = await PostFetch(BASE + "GetLatestConsultReqOtherDept", null);
  return response;
};

const GetLatestDeptTranLog = async (): Promise<ResponseModel> => {
  const response = await PostFetch(BASE + "GetLatestDeptTranLog", null);
  return response;
};

const GetCharity = async (): Promise<ResponseModel> => {
  const response = await PostFetch(BASE + "GetCharity", null);
  return response;
};

const GetConsultPerDept = async (): Promise<ResponseModel> => {
  const response = await PostFetch(BASE + "GetConsultPerDept", null);
  return response;
};

export default {
  GetTotalForApproval,
  GetTotalPaid,
  GetTotalStarted,
  GetTotalEnded,
  GetFinishConsult,
  GetLatestConsultReqUserDept,
  GetLatestConsultReqOtherDept,
  GetLatestDeptTranLog,
  GetCharity,
  GetConsultPerDept,
  GetLatestConsultForResident,
};

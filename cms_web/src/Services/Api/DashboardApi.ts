import { PostFetch } from "../../Hooks/UseFetch";
import ResponseModel from "../Models/ServerResponseModel";

const BASE = `api/dashboard/`;

const TotalEarning = async (): Promise<ResponseModel> => {
  const response = await PostFetch(BASE + "TotalEarning", null);
  return response;
};

const TotalConsult = async (): Promise<ResponseModel> => {
  const response = await PostFetch(BASE + "TotalConsult", null);
  return response;
};
const TotalHospPatient = async (): Promise<ResponseModel> => {
  const response = await PostFetch(BASE + "TotalHospPatient", null);
  return response;
};
const TotalHospResident = async (): Promise<ResponseModel> => {
  const response = await PostFetch(BASE + "TotalHospResident", null);
  return response;
};
const TotalDept = async (): Promise<ResponseModel> => {
  const response = await PostFetch(BASE + "TotalDept", null);
  return response;
};

const ChartDeptEarning = async (): Promise<ResponseModel> => {
  const response = await PostFetch(BASE + "ChartDeptEarning", null);
  return response;
};

const ChartDailyEarning30days = async (): Promise<ResponseModel> => {
  const response = await PostFetch(BASE + "ChartDailyEarning30days", null);
  return response;
};

const StatsConsult = async (): Promise<ResponseModel> => {
  const response = await PostFetch(BASE + "StatsConsult", null);
  return response;
};

const TopResident = async (): Promise<ResponseModel> => {
  const response = await PostFetch(BASE + "TopResident", null);
  return response;
};

const TodayForApprovalConsult = async (): Promise<ResponseModel> => {
  const response = await PostFetch(BASE + "TodayForApprovalConsult", null);
  return response;
};

export default {
  TotalEarning,
  TotalConsult,
  TotalHospPatient,
  TotalHospResident,
  TotalDept,
  ChartDeptEarning,
  ChartDailyEarning30days,
  StatsConsult,
  TopResident,
  TodayForApprovalConsult,
};

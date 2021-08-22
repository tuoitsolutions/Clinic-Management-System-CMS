import { PostFetch } from "../../Hooks/UseFetch";
import DeptResidentEntity from "../Entities/DeptResidentEntity";
import { PaginationModel } from "../Models/PaginationModel";
import ResponseModel from "../Models/ServerResponseModel";

const BASE = `api/deptresident/`;

const InsertDeptResident = async (
  payload: DeptResidentEntity
): Promise<ResponseModel> => {
  const response = await PostFetch(BASE + "InsertDeptResident", payload);
  return response;
};

const UpdateDeptResident = async (
  payload: DeptResidentEntity
): Promise<ResponseModel> => {
  const response = await PostFetch(BASE + "UpdateDeptResident", payload);
  return response;
};

const GetTableDeptResident = async (
  payload: PaginationModel
): Promise<ResponseModel> => {
  const response = await PostFetch(BASE + "GetTableDeptResident", payload);
  return response;
};

const GetDeptResidentByDeptResidentPk = async (
  id?: number
): Promise<ResponseModel> => {
  const response = await PostFetch(BASE + "GetDeptResidentByDeptResidentPk", {
    value: id,
  });
  return response;
};

export default {
  InsertDeptResident,
  UpdateDeptResident,
  GetTableDeptResident,
  GetDeptResidentByDeptResidentPk,
};

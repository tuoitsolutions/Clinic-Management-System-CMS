import { PostFetch } from "../../Hooks/UseFetch";
import DepartmentEntity from "../Entities/DepartmentEntity";
import { PaginationModel } from "../Models/PaginationModel";
import ResponseModel from "../Models/ServerResponseModel";

const BASE = `api/department/`;

const InsertDepartment = async (
  payload: DepartmentEntity
): Promise<ResponseModel> => {
  const response = await PostFetch(BASE + "InsertDepartment", payload);
  return response;
};

const UpdateDepartment = async (
  payload: DepartmentEntity
): Promise<ResponseModel> => {
  const response = await PostFetch(BASE + "UpdateDepartment", payload);
  return response;
};

const GetTableDepartment = async (
  payload: PaginationModel
): Promise<ResponseModel> => {
  const response = await PostFetch(BASE + "GetTableDepartment", payload);
  return response;
};

const GetDepartmentByDepartmentPk = async (
  id?: number
): Promise<ResponseModel> => {
  const response = await PostFetch(BASE + "GetDepartmentByDepartmentPk", {
    value: id,
  });
  return response;
};

const IsDeptCutOff = async (dept_pk?: string): Promise<ResponseModel> => {
  const response = await PostFetch(BASE + "IsDeptCutOff", {
    value: dept_pk,
  });
  return response;
};

export default {
  InsertDepartment,
  UpdateDepartment,
  GetTableDepartment,
  GetDepartmentByDepartmentPk,
  IsDeptCutOff,
};

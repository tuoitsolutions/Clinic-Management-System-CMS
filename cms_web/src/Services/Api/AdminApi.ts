import { FormDataPostFetch, PostFetch } from "../../Hooks/UseFetch";
import AdminEntity from "../Entities/AdminEntity";
import { PaginationModel } from "../Models/PaginationModel";
import ResponseModel from "../Models/ServerResponseModel";

const BASE = `api/admin/`;

const InsertAdmin = async (payload: FormData): Promise<ResponseModel> => {
  const response = await FormDataPostFetch(BASE + "InsertAdmin", payload);
  return response;
};

const UpdateAdmin = async (payload: FormData): Promise<ResponseModel> => {
  const response = await FormDataPostFetch(BASE + "UpdateAdmin", payload);
  return response;
};
const ResetAdminPassword = async (
  payload: AdminEntity
): Promise<ResponseModel> => {
  const response = await PostFetch(BASE + "ResetAdminPassword", payload);
  return response;
};

const GetTableAdmin = async (
  payload: PaginationModel
): Promise<ResponseModel> => {
  const response = await PostFetch(BASE + "GetTableAdmin", payload);
  return response;
};

const GetAdminByAdminPk = async (admin_pk?: number): Promise<ResponseModel> => {
  const response = await PostFetch(BASE + "GetAdminByAdminPk", {
    value: admin_pk,
  });
  return response;
};

export default {
  InsertAdmin,
  UpdateAdmin,
  GetTableAdmin,
  GetAdminByAdminPk,
  ResetAdminPassword,
};

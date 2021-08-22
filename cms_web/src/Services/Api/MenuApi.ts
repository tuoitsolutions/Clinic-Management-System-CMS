import { FormDataPostFetch, PostFetch } from "../../Hooks/UseFetch";
import { PaginationModel } from "../Models/PaginationModel";
import ResponseModel from "../Models/ServerResponseModel";

const BASE = `api/menu/`;

const GetAllMenu = async (payload: PaginationModel): Promise<ResponseModel> => {
  const response = await PostFetch(BASE + "GetAllMenu", payload);
  return response;
};

const GetSingleMenuById = async (pk: string): Promise<ResponseModel> => {
  const response = await PostFetch(BASE + "GetSingleMenuById", {
    value: pk,
  });
  return response;
};
const GetMenuOptions = async (): Promise<ResponseModel> => {
  const response = await PostFetch(BASE + "GetMenuOptions", {});
  return response;
};

const InsertMenu = async (payload: FormData): Promise<ResponseModel> => {
  const response = await FormDataPostFetch(BASE + "InsertMenu", payload);
  return response;
};

const UpdateMenu = async (payload: FormData): Promise<ResponseModel> => {
  const response = await FormDataPostFetch(BASE + "UpdateMenu", payload);
  return response;
};

const GetTransacMenu = async (
  payload: PaginationModel
): Promise<ResponseModel> => {
  const response = await PostFetch(BASE + "GetTransacMenu", payload);
  return response;
};

export default {
  GetAllMenu,
  GetSingleMenuById,
  GetMenuOptions,
  InsertMenu,
  UpdateMenu,
  GetTransacMenu,
};

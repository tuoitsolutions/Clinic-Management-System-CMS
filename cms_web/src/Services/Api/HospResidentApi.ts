import { FormDataPostFetch, PostFetch } from "../../Hooks/UseFetch";
import DepartmentEntity from "../Entities/DepartmentEntity";
import { PaginationModel } from "../Models/PaginationModel";
import ResponseModel from "../Models/ServerResponseModel";

const BASE = `api/hospresident/`;

const InsertHospResident = async (
  payload: FormData
): Promise<ResponseModel> => {
  const response = await FormDataPostFetch(
    BASE + "InsertHospResident",
    payload
  );
  return response;
};

const UpdateHospResident = async (
  payload: FormData
): Promise<ResponseModel> => {
  const response = await FormDataPostFetch(
    BASE + "UpdateHospResident",
    payload
  );
  return response;
};

const GetTableHospResident = async (
  payload: PaginationModel
): Promise<ResponseModel> => {
  const response = await PostFetch(BASE + "GetTableHospResident", payload);
  return response;
};

const GetHospResidentByHospResidentPk = async (
  id?: number
): Promise<ResponseModel> => {
  const response = await PostFetch(BASE + "GetHospResidentByHospResidentPk", {
    value: id,
  });
  return response;
};

export default {
  InsertHospResident,
  UpdateHospResident,
  GetTableHospResident,
  GetHospResidentByHospResidentPk,
};

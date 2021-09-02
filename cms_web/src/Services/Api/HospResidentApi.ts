import { FormDataPostFetch, PostFetch } from "../../Hooks/UseFetch";
import DepartmentEntity from "../Entities/DepartmentEntity";
import HospResidentEntity from "../Entities/HospResidentEntity";
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
const UpdateResidentESign = async (
  payload: FormData
): Promise<ResponseModel> => {
  const response = await FormDataPostFetch(
    BASE + "UpdateResidentESign",
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

const PreviewResidentPic = async (id?: number): Promise<ResponseModel> => {
  const response = await PostFetch(BASE + "PreviewResidentPic", {
    value: id,
  });
  return response;
};

const PreviewResidentESign = async (
  payload?: HospResidentEntity
): Promise<ResponseModel> => {
  const response = await PostFetch(BASE + "PreviewResidentESign", payload);
  return response;
};

export default {
  InsertHospResident,
  UpdateHospResident,
  GetTableHospResident,
  GetHospResidentByHospResidentPk,
  PreviewResidentPic,
  UpdateResidentESign,
  PreviewResidentESign,
};

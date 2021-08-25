import { PostFetch } from "../../Hooks/UseFetch";
import ResponseModel from "../Models/ServerResponseModel";

const BASE = `api/library/`;

const DoctorSpecialtyOptions = async (): Promise<ResponseModel> => {
  const response = await PostFetch(BASE + "DoctorSpecialtyOptions", null);
  return response;
};

const GetHospResidentOptions = async (
  dept_pk: number
): Promise<ResponseModel> => {
  const response = await PostFetch(BASE + "GetHospResidentOptions", {
    value: dept_pk,
  });
  return response;
};

const RegionOptions = async (): Promise<ResponseModel> => {
  const response = await PostFetch(BASE + "RegionOptions", null);
  return response;
};

const ProvinceOptions = async (id: string): Promise<ResponseModel> => {
  const response = await PostFetch(BASE + "ProvinceOptions", {
    value: id,
  });
  return response;
};

const CityMunOptions = async (id: string): Promise<ResponseModel> => {
  const response = await PostFetch(BASE + "CityMunOptions", {
    value: id,
  });
  return response;
};

const BarangayOptions = async (id: string): Promise<ResponseModel> => {
  const response = await PostFetch(BASE + "BarangayOptions", {
    value: id,
  });
  return response;
};

const NationalityOptions = async (): Promise<ResponseModel> => {
  const response = await PostFetch(BASE + "NationalityOptions", null);
  return response;
};

const ReligionOptions = async (): Promise<ResponseModel> => {
  const response = await PostFetch(BASE + "ReligionOptions", null);
  return response;
};

const GetDepartmentOptions = async (): Promise<ResponseModel> => {
  const response = await PostFetch(BASE + "GetDepartmentOptions", null);
  return response;
};

const GetDeptResidentOptions = async (id: string): Promise<ResponseModel> => {
  const response = await PostFetch(BASE + "GetDeptResidentOptions", {
    value: id,
  });
  return response;
};

const HospitalPatientOptions = async (): Promise<ResponseModel> => {
  const response = await PostFetch(BASE + "HospitalPatientOptions", null);
  return response;
};

export default {
  DoctorSpecialtyOptions,
  GetHospResidentOptions,
  RegionOptions,
  ProvinceOptions,
  CityMunOptions,
  BarangayOptions,
  NationalityOptions,
  ReligionOptions,
  GetDepartmentOptions,
  GetDeptResidentOptions,
  HospitalPatientOptions,
};

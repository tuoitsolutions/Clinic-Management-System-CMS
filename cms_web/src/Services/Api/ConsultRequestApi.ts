import { FormDataPostFetch, PostFetch } from "../../Hooks/UseFetch";
import ConsultRequestEntity, {
  SendMessagePayload,
} from "../Entities/ConsultRequestEntity";
import HospPatientEntity from "../Entities/HospPatientEntity";
import OtpEntity from "../Entities/OtpEntity";
import { PaginationModel } from "../Models/PaginationModel";
import ResponseModel from "../Models/ServerResponseModel";

const BASE = `api/consultrequest/`;

const InsertConsultRequest = async (
  payload: FormData
): Promise<ResponseModel> => {
  const response = await FormDataPostFetch(
    BASE + "InsertConsultRequest",
    payload
  );
  return response;
};

const GetTableConsultRequest = async (
  payload: PaginationModel
): Promise<ResponseModel> => {
  const response = await PostFetch(BASE + "GetTableConsultRequest", payload);
  return response;
};

const GetTablePatConsultHistory = async (
  payload: PaginationModel
): Promise<ResponseModel> => {
  const response = await PostFetch(BASE + "GetTablePatConsultHistory", payload);
  return response;
};

const GetConsultReqByPk = async (hash_key: string): Promise<ResponseModel> => {
  const response = await PostFetch(BASE + "GetConsultReqByPk", {
    value: hash_key,
  });
  return response;
};
const SendPaymentLink = async (
  consult_req_pk: string
): Promise<ResponseModel> => {
  const response = await PostFetch(BASE + "SendPaymentLink", {
    value: consult_req_pk,
  });
  return response;
};
const DeclineConsultRequest = async (
  payload: SendMessagePayload
): Promise<ResponseModel> => {
  const response = await PostFetch(BASE + "DeclineConsultRequest", payload);
  return response;
};

const IsPayLinkExpired = async (hash_key: string): Promise<ResponseModel> => {
  const response = await PostFetch(BASE + "IsPayLinkExpired", {
    value: hash_key,
  });

  return response;
};

const IsPayOtpVerified = async (hash_key: string): Promise<ResponseModel> => {
  const response = await PostFetch(BASE + "IsPayOtpVerified", {
    value: hash_key,
  });
  return response;
};

const VerifyPayOtp = async (payload: OtpEntity): Promise<ResponseModel> => {
  const response = await PostFetch(BASE + "VerifyPayOtp", payload);
  return response;
};
const ResendPayOtp = async (payload: OtpEntity): Promise<ResponseModel> => {
  const response = await PostFetch(BASE + "ResendPayOtp", payload);
  return response;
};
const PreviewConsultSoa = async (
  consult_req_pk: string
): Promise<ResponseModel> => {
  const response = await PostFetch(BASE + "PreviewConsultSoa", {
    value: consult_req_pk,
  });
  return response;
};
const EmailConsultRequestSoa = async (
  payload: ConsultRequestEntity
): Promise<ResponseModel> => {
  const response = await PostFetch(BASE + "EmailConsultRequestSoa", payload);
  return response;
};

const AssignDeptConsult = async (
  payload: ConsultRequestEntity
): Promise<ResponseModel> => {
  const response = await PostFetch(BASE + "AssignDeptConsult", payload);
  return response;
};

const ChangeConsultationCost = async (
  payload: ConsultRequestEntity
): Promise<ResponseModel> => {
  const response = await PostFetch(BASE + "ChangeConsultationCost", payload);
  return response;
};

const StartConsultation = async (
  payload: HospPatientEntity
): Promise<ResponseModel> => {
  const response = await PostFetch(BASE + "StartConsultation", payload);
  return response;
};

const MapConsultationToPatient = async (
  payload: HospPatientEntity
): Promise<ResponseModel> => {
  const response = await PostFetch(BASE + "MapConsultationToPatient", payload);
  return response;
};

const GetCosultLinkInfo = async (hash_key: string): Promise<ResponseModel> => {
  const response = await PostFetch(BASE + "GetCosultLinkInfo", {
    value: hash_key,
  });
  return response;
};
const AuthenticateConsultLink = async (
  payload: ConsultRequestEntity
): Promise<ResponseModel> => {
  const response = await PostFetch(BASE + "AuthenticateConsultLink", payload);
  return response;
};

const IsConsultLinkAuthenticated = async (
  payload: ConsultRequestEntity
): Promise<ResponseModel> => {
  const response = await PostFetch(
    BASE + "IsConsultLinkAuthenticated",
    payload
  );
  return response;
};

const EndConsult = async (
  payload: ConsultRequestEntity
): Promise<ResponseModel> => {
  const response = await PostFetch(BASE + "EndConsult", payload);
  return response;
};

const TakeOverConsult = async (
  payload: ConsultRequestEntity
): Promise<ResponseModel> => {
  const response = await PostFetch(BASE + "TakeOverConsult", payload);
  return response;
};

export default {
  InsertConsultRequest,
  GetTableConsultRequest,
  GetConsultReqByPk,
  SendPaymentLink,
  DeclineConsultRequest,
  IsPayLinkExpired,
  IsPayOtpVerified,
  VerifyPayOtp,
  ResendPayOtp,
  PreviewConsultSoa,
  EmailConsultRequestSoa,
  AssignDeptConsult,
  ChangeConsultationCost,
  StartConsultation,
  MapConsultationToPatient,
  AuthenticateConsultLink,
  IsConsultLinkAuthenticated,
  GetCosultLinkInfo,
  EndConsult,
  TakeOverConsult,
  GetTablePatConsultHistory,
};

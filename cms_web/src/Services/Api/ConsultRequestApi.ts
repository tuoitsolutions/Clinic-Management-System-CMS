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
const GetPaymentConsultInfo = async (
  hash_key: string
): Promise<ResponseModel> => {
  const response = await PostFetch(BASE + "GetPaymentConsultInfo", {
    value: hash_key,
  });
  return response;
};

const GetAssignResidentOnlineConsult = async (
  hash_key: string
): Promise<ResponseModel> => {
  const response = await PostFetch(BASE + "GetAssignResidentOnlineConsult", {
    value: hash_key,
  });
  return response;
};

const GetPublicOnlineConsult = async (
  hash_key: string
): Promise<ResponseModel> => {
  const response = await PostFetch(BASE + "GetPublicOnlineConsult", {
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

const UndeclineConsultRequest = async (
  payload: SendMessagePayload
): Promise<ResponseModel> => {
  const response = await PostFetch(BASE + "UndeclineConsultRequest", payload);
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

const PreviewMedCert = async (
  consult_req_pk: string
): Promise<ResponseModel> => {
  const response = await PostFetch(BASE + "PreviewMedCert", {
    value: consult_req_pk,
  });
  return response;
};
const EmailMedCert = async (
  payload: ConsultRequestEntity
): Promise<ResponseModel> => {
  const response = await PostFetch(BASE + "EmailMedCert", payload);
  return response;
};

const TransferConsultDept = async (
  payload: ConsultRequestEntity
): Promise<ResponseModel> => {
  const response = await PostFetch(BASE + "TransferConsultDept", payload);
  return response;
};

const SetEstSchedule = async (
  payload: ConsultRequestEntity
): Promise<ResponseModel> => {
  const response = await PostFetch(BASE + "SetEstSchedule", payload);
  return response;
};
const ChangeCharityTag = async (
  payload: ConsultRequestEntity
): Promise<ResponseModel> => {
  const response = await PostFetch(BASE + "ChangeCharityTag", payload);
  return response;
};

const SavePatientDiagnosis = async (
  payload: ConsultRequestEntity
): Promise<ResponseModel> => {
  const response = await PostFetch(BASE + "SavePatientDiagnosis", payload);
  return response;
};

const SendConsultLink = async (
  consult_req_pk: string
): Promise<ResponseModel> => {
  const response = await PostFetch(BASE + "SendConsultLink", {
    value: consult_req_pk,
  });
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

const SetConsultAsPaid = async (
  payload: ConsultRequestEntity
): Promise<ResponseModel> => {
  const response = await PostFetch(BASE + "SetConsultAsPaid", payload);
  return response;
};

const GetConsultPatPic = async (hash_key: string): Promise<ResponseModel> => {
  const response = await PostFetch(BASE + "GetConsultPatPic", {
    value: hash_key,
  });
  return response;
};

const UpdateConsultPatPic = async (
  form_data: FormData
): Promise<ResponseModel> => {
  const response = await FormDataPostFetch(
    BASE + "UpdateConsultPatPic",
    form_data
  );
  return response;
};

const GetConsultDocNotes = async (hash_key: string): Promise<ResponseModel> => {
  const response = await PostFetch(BASE + "GetConsultDocNotes", {
    value: hash_key,
  });
  return response;
};
const PreviewRequesterPic = async (
  hash_key: string
): Promise<ResponseModel> => {
  const response = await PostFetch(BASE + "PreviewRequesterPic", {
    value: hash_key,
  });
  return response;
};

const UpdateConsultDocNotes = async (
  payload: ConsultRequestEntity
): Promise<ResponseModel> => {
  const response = await PostFetch(BASE + "UpdateConsultDocNotes", payload);
  return response;
};

const UpdateConsultDtls = async (
  payload: ConsultRequestEntity
): Promise<ResponseModel> => {
  const response = await PostFetch(BASE + "UpdateConsultDtls", payload);
  return response;
};

const SendConsultSms = async (
  payload: ConsultRequestEntity
): Promise<ResponseModel> => {
  const response = await PostFetch(BASE + "SendConsultSms", payload);
  return response;
};

const SendConsultEmail = async (
  payload: ConsultRequestEntity
): Promise<ResponseModel> => {
  const response = await PostFetch(BASE + "SendConsultEmail", payload);
  return response;
};

export default {
  InsertConsultRequest,
  GetTableConsultRequest,
  GetConsultReqByPk,
  SendPaymentLink,
  DeclineConsultRequest,
  UndeclineConsultRequest,
  IsPayLinkExpired,
  IsPayOtpVerified,
  VerifyPayOtp,
  ResendPayOtp,
  PreviewConsultSoa,
  EmailConsultRequestSoa,
  TransferConsultDept,
  SetEstSchedule,
  ChangeCharityTag,
  SendConsultLink,
  ChangeConsultationCost,
  StartConsultation,
  MapConsultationToPatient,
  AuthenticateConsultLink,
  IsConsultLinkAuthenticated,
  GetCosultLinkInfo,
  EndConsult,
  TakeOverConsult,
  GetTablePatConsultHistory,
  SetConsultAsPaid,
  GetConsultPatPic,
  UpdateConsultPatPic,
  GetConsultDocNotes,
  PreviewRequesterPic,
  UpdateConsultDocNotes,
  UpdateConsultDtls,
  SendConsultSms,
  SendConsultEmail,
  GetAssignResidentOnlineConsult,
  GetPublicOnlineConsult,
  GetPaymentConsultInfo,
  SavePatientDiagnosis,
  PreviewMedCert,
  EmailMedCert,
};

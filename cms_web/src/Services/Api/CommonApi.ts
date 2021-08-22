import { PostFetch } from "../../Hooks/UseFetch";
import OtpEntity from "../Entities/OtpEntity";
import ResponseModel from "../Models/ServerResponseModel";

const BASE = `api/common/`;

const GenerateOtp = async (payload: OtpEntity): Promise<ResponseModel> => {
  const response = await PostFetch(BASE + "GenerateOtp", payload);
  return response;
};

export default {
  GenerateOtp,
};

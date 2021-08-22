import { PostFetch } from "../../Hooks/UseFetch";
import ResponseModel from "../Models/ServerResponseModel";
import axios from "axios";
import PaymongoModel from "../Models/PaymongoModel";
import { PaginationModel } from "../Models/PaginationModel";
const BASE = `api/paymongo/`;

const EWalletCreateSource = async (payload: any): Promise<ResponseModel> => {
  const response = await PostFetch(BASE + "EWalletCreateSource", payload);
  return response;
};
const CreatePaymentIntent = async (payload: any): Promise<ResponseModel> => {
  const response = await PostFetch(BASE + "CreatePaymentIntent", payload);
  return response;
};

const CreatePaymongoPaymentMethod = async (
  payload: PaymongoModel,
  pm_public_key: string
): Promise<ResponseModel> => {
  try {
    const response = await axios.post(
      "https://api.paymongo.com/v1/payment_methods",
      JSON.stringify(payload),
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Basic ${pm_public_key}`,
        },
      }
    );

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    const paymongo_errors = error?.response?.data?.errors;

    console.log(`paymongo_errors`, paymongo_errors);
    if (!!paymongo_errors) {
      if (paymongo_errors instanceof Array) {
        return {
          success: false,
          paymongo_errors: paymongo_errors,
        };
      }
    } else {
      return {
        success: false,
        message: error,
      };
    }
  }
};

const AttachPaymentIntent = async (
  payment_intent_client_key: string,
  payment_method_id: string,
  public_key: string
): Promise<ResponseModel> => {
  try {
    var paymentIntentId = payment_intent_client_key.split("_client")[0];

    const response = await axios.post(
      "https://api.paymongo.com/v1/payment_intents/" +
        paymentIntentId +
        "/attach",
      JSON.stringify({
        data: {
          attributes: {
            client_key: payment_intent_client_key,
            payment_method: payment_method_id,
          },
        },
      }),
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Basic ${public_key}`,
        },
      }
    );

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    const paymongo_errors = error?.response?.data?.errors;

    console.log(`error attach`, error?.response);

    console.log(`paymongo_errors`, paymongo_errors);
    if (!!paymongo_errors) {
      if (paymongo_errors instanceof Array) {
        return {
          success: false,
          paymongo_errors: paymongo_errors,
        };
      }
    } else {
      return {
        success: false,
        message: error,
      };
    }
  }
};

const ReattachPaymentIntent = async (
  payment_intent_client_key: string,
  payment_method_id: string,
  public_key: string
): Promise<ResponseModel> => {
  try {
    var paymentIntentId = payment_intent_client_key.split("_client")[0];

    const response = await axios.get(
      "https://api.paymongo.com/v1/payment_intents/" +
        paymentIntentId +
        "?client_key=" +
        payment_intent_client_key,
      // JSON.stringify({
      //   data: {
      //     attributes: {
      //       client_key: payment_intent_client_key,
      //       payment_method: payment_method_id,
      //     },
      //   },
      // }),
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Basic ${public_key}`,
        },
      }
    );

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    const paymongo_errors = error?.response?.data?.errors;

    console.log(`error attach`, error?.response);

    console.log(`paymongo_errors`, paymongo_errors);
    if (!!paymongo_errors) {
      if (paymongo_errors instanceof Array) {
        return {
          success: false,
          paymongo_errors: paymongo_errors,
        };
      }
    } else {
      return {
        success: false,
        message: error,
      };
    }
  }
};

//RECORDS
const GetTablePaymongoLog = async (
  payload: PaginationModel
): Promise<ResponseModel> => {
  const response = await PostFetch(BASE + "GetTablePaymongoLog", payload);
  return response;
};

export default {
  EWalletCreateSource,
  AttachPaymentIntent,
  CreatePaymongoPaymentMethod,
  CreatePaymentIntent,
  ReattachPaymentIntent,
  GetTablePaymongoLog,
};

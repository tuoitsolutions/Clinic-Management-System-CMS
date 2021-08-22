import { Dispatch } from "react";
import DefaultValuesApi from "../Api/DefaultValuesApi";
import ResponseModel from "../Models/ServerResponseModel";
import { DefaultValuesReducerTypes } from "../Types/DefaultValuesTypes";

const setHospitalNameAction = () => async (
  dispatch: Dispatch<DefaultValuesReducerTypes>
) => {
  try {
    dispatch({
      type: "set_fetch_hospital_name",
      fetch_hospital_name: true,
    });
    const response: ResponseModel = await DefaultValuesApi.getHospitalNameApi();
    dispatch({
      type: "set_fetch_hospital_name",
      fetch_hospital_name: false,
    });
    if (response.success) {
      dispatch({
        type: "set_hospital_name",
        hospital_name: response.data,
      });
    }
  } catch (error) {
    console.error(`action error`, error);
  }
};

const setHospitalTaglineAction = () => async (
  dispatch: Dispatch<DefaultValuesReducerTypes>
) => {
  try {
    dispatch({
      type: "set_fetch_hospital_tagline",
      fetch_hospital_tagline: true,
    });
    const response: ResponseModel = await DefaultValuesApi.getHospitalTaglineApi();
    dispatch({
      type: "set_fetch_hospital_tagline",
      fetch_hospital_tagline: false,
    });
    if (response.success) {
      dispatch({
        type: "set_hospital_tagline",
        hospital_tagline: response.data,
      });
    }
  } catch (error) {
    console.error(`action error`, error);
  }
};

const setHospitalLogoAction = () => async (
  dispatch: Dispatch<DefaultValuesReducerTypes>
) => {
  try {
    dispatch({
      type: "set_fetch_hospital_logo",
      fetch_hospital_logo: true,
    });
    const response: ResponseModel = await DefaultValuesApi.getHospitalLogoApi();
    dispatch({
      type: "set_fetch_hospital_logo",
      fetch_hospital_logo: false,
    });
    if (response.success) {
      dispatch({
        type: "set_hospital_logo",
        hospital_logo: response.data,
      });
    }
  } catch (error) {
    console.error(`action error`, error);
  }
};

export default {
  setHospitalNameAction,
  setHospitalTaglineAction,
  setHospitalLogoAction,
};

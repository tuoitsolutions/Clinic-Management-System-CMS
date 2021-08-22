import {
  DefaultValuesReducerModel,
  DefaultValuesReducerTypes,
} from "../Types/DefaultValuesTypes";

const defaultState: DefaultValuesReducerModel = {
  fetch_hospital_logo: false,
  fetch_hospital_tagline: false,
  fetch_hospital_name: false,
  hospital_logo: " ",
  hospital_name: " ",
  hospital_tagline: " ",
};

const DefaultValuesReducer = (
  state: DefaultValuesReducerModel = defaultState,
  action: DefaultValuesReducerTypes
): DefaultValuesReducerModel => {
  switch (action.type) {
    case "set_fetch_hospital_name": {
      return {
        ...state,
        fetch_hospital_name: action.fetch_hospital_name,
      };
    }
    case "set_hospital_name": {
      return {
        ...state,
        hospital_name: action.hospital_name,
      };
    }

    case "set_fetch_hospital_tagline": {
      return {
        ...state,
        fetch_hospital_tagline: action.fetch_hospital_tagline,
      };
    }
    case "set_hospital_tagline": {
      return {
        ...state,
        hospital_tagline: action.hospital_tagline,
      };
    }

    case "set_fetch_hospital_logo": {
      return {
        ...state,
        fetch_hospital_logo: action.fetch_hospital_logo,
      };
    }
    case "set_hospital_logo": {
      return {
        ...state,
        hospital_logo: action.hospital_logo,
      };
    }

    default:
      return state;
  }
};

export default DefaultValuesReducer;

export type DefaultValuesReducerTypes =
  | {
      type: "set_hospital_name";
      hospital_name: string;
    }
  | {
      type: "set_fetch_hospital_name";
      fetch_hospital_name: boolean;
    }
  | {
      type: "set_hospital_tagline";
      hospital_tagline: string;
    }
  | {
      type: "set_fetch_hospital_tagline";
      fetch_hospital_tagline: boolean;
    }
  | {
      type: "set_hospital_logo";
      hospital_logo: string;
    }
  | {
      type: "set_fetch_hospital_logo";
      fetch_hospital_logo: boolean;
    };

export interface DefaultValuesReducerModel {
  hospital_name?: string;
  fetch_hospital_name: boolean;
  hospital_tagline?: string;
  fetch_hospital_tagline: boolean;
  hospital_logo?: string;
  fetch_hospital_logo: boolean;
}

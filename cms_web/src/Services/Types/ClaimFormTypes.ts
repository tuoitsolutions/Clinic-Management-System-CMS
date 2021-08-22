import { ClaimFormModel } from "../Models/ClaimFormModel";

export type ClaimFormReducerTypes =
  | {
      type: "set_claim_form";
      claim_form: ClaimFormModel;
    }
  | {
      type: "set_fetch_claim_form";
      fetch_claim_form: boolean;
    }
  | {
      type: "set_error_claim_form";
      error_claim_form: string;
    };

export interface ClaimFormReducerModel {
  claim_form?: ClaimFormModel;
  fetch_claim_form?: boolean;
  error_claim_form?: string;
}

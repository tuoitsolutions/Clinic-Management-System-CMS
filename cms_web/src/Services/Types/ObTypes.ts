import { ObModel } from "../Models/ObModel";

export type ObReducerTypes =
  | {
      type: "set_pat_ob";
      pat_ob: ObModel;
    }
  | {
      type: "set_fetch_pat_ob";
      fetch_pat_ob: boolean;
    };

export interface ObReducerModel {
  pat_ob?: ObModel;
  fetch_pat_ob: boolean;
}

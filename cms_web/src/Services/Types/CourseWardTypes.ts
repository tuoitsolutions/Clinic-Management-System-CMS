import { CourseWardModel } from "../Models/CourseWardModel";

export type CourseWardReducerTypes =
  | {
      type: "set_tbl_pat_course_ward";
      tbl_pat_course_ward: Array<CourseWardModel>;
    }
  | {
      type: "set_fetch_tbl_pat_course_ward";
      fetch_tbl_pat_course_ward: boolean;
    };

export interface CourseWardReducerModel {
  tbl_pat_course_ward?: Array<CourseWardModel>;
  fetch_tbl_pat_course_ward: boolean;
}

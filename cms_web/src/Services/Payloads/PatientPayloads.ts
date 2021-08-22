import { SortPayload } from "./SortPayload";

export interface GetAdmittedPatientPayload {
  page: number;
  limit: number;
  sort: SortPayload;
  search: SearchAdmittedPatientPayload;
}

export interface SearchAdmittedPatientPayload {
  search: string;
  encodedfrom: Date;
  encodedto: Date;
}

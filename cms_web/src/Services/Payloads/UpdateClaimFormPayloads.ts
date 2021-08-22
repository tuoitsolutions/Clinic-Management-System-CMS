export interface UpdateClaimFormPayload {
  patno?: string;
  patient_type: "INPATIENT" | "PATIENT";
  cf_clin_sum_payload?: CfClinSumPayload;
  cf_vital_sign_payload?: CfVitalSignPayload;
  cf_ob_payload?: CfObPayload;
  cf_pertinent_payload?: Array<CfPertinentPayload>;
  cf_physical_exam_payload?: Array<CfPhysicalExamPayload>;
}

export interface CfClinSumPayload {
  chiefcomplaint?: string;
  pasthistory?: string;
  briefhistory?: string;
  admdiagnosis?: string;
  patno?: string;
  gensurvey?: "AWAKE" | "ALTERED";
}

export interface CfVitalSignPayload {
  bloodpresure?: string;
  bp1?: number;
  bp2?: number;
  heartrate?: number;
  resrate?: number;
  temperature?: number;
  height?: number;
  weight?: number;
  bmi?: number;
  updatedby?: string;
}
export interface CfObPayload {
  isapplicable?: boolean;
  lmp?: Date;
  gravidity?: number;
  parity?: number;
  fullterm?: number;
  premature?: number;
  abortion?: number;
  livingchildren?: number;
}

export interface CfPertinentPayload {
  perkey?: number;
  pecodefound?: number;
  patno?: string;
  petag?: string;
  pecode?: number;
  pedesc?: string;
  peothersremarks?: string;
  encodedby?: string;
}
export interface CfPhysicalExamPayload {
  pekey?: number;
  pecodefound?: number;
  patno?: string;
  petag?: string;
  pecode?: number;
  pedesc?: string;
  peothersremarks?: string;
  encodedby?: string;
}

export interface CourseFormValidityInterface {
  course_ward: boolean;
  clin_sum: boolean;
  pertinent: boolean;
  ob: boolean;
  vital_sign: boolean;
  physical_exam: boolean;
}

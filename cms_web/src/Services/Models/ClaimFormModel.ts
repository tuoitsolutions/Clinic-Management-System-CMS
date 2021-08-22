import { ClinicalSummaryModel } from "./ClinicalSummaryModel";
import { CourseWardModel } from "./CourseWardModel";
import { MedicineModel } from "./MedicineModel";
import { ObModel } from "./ObModel";
import { PertinentModel } from "./PertinentModel";
import { PhysicalExamModel } from "./PhysicalExamModel";
import { VitalSignModel } from "./VitalSignModel";

export interface ClaimFormModel {
  clinical_summary: ClinicalSummaryModel;
  vital_signs: VitalSignModel;
  ob: ObModel;
  medicine: Array<MedicineModel>;
  pertinent_signs: Array<PertinentModel>;
  physical_exam: Array<PhysicalExamModel>;
  patient_type: "PATIENT" | "INPATIENT";
  patno: string;
}

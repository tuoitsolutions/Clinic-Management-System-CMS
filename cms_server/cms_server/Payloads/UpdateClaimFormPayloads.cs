using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace claim_form_server.Payloads
{
    public static class UpdateClaimFormPayloads
    {
        public class UpdateClaimFormPayload
        {
            [Required]
            [Display(Name = "Patient")]
            public string patno { get; set; }
            public CfClinSumPayload cf_clin_sum_payload { get; set; }
            public CfVitalSignPayload cf_vital_sign_payload { get; set; }
            public CfObPayload cf_ob_payload { get; set; }
            public List<CfPertinentPayload> cf_pertinent_payload { get; set; }
            public List<CfPhysicalExamPayload> cf_physical_exam_payload { get; set; }
        }


        public class CfClinSumPayload
        {
            [Required]
            [Display(Name = "Admission Diagnosis")]
            public string admdiagnosis { get; set; }

            [Required]
            [Display(Name = "History of Patient Illness")]
            public string briefhistory { get; set; }

            [Required]
            [Display(Name = "Chief Complaint")]
            public string chiefcomplaint { get; set; }
            [Required]

            [Display(Name = "Past History")]
            public string pasthistory { get; set; }

            [Required]
            [Display(Name = "General Survey")]
            public string gensurvey { get; set; }

            public string patno { get; set; }
        }


        public class CfVitalSignPayload
        {
            [Required]
            [Display(Name = "Blood Pressure")]
            public string bloodpresure { get; set; }
            [Required]
            [Display(Name = "Heart Rate")]
            public float heartrate { get; set; }
            [Required]
            [Display(Name = "Respiratory Rate")]
            public float resrate { get; set; }
            [Required]
            [Display(Name = "Temperature")]
            public float temperature { get; set; }

            [Required]
            [Display(Name = "Height")]
            public float height { get; set; }

            [Required]
            [Display(Name = "Weight")]
            public float weight { get; set; }

            [Required]
            [Display(Name = "Body Max Index")]
            public float bmi { get; set; }
            public string updatedby { get; set; }
            public string patno { get; set; }
        }

        public class CfObPayload
        {
            [Required]
            public bool isapplicable { get; set; }
            public DateTime? lmp { get; set; }
            public int? gravidity { get; set; }
            public int? parity { get; set; }
            public int? fullterm { get; set; }
            public int? premature { get; set; }
            public int? abortion { get; set; }
            public int? livingchildren { get; set; }
            public string patno { get; set; }
        }

        public class CfCourseWardPayload
        {
            public int? cwkey { get; set; }
            public string patno { get; set; }
            [Required]
            public DateTime cwdate { get; set; }
            [Required]
            public string cworder_action { get; set; }
            public string encodedby { get; set; }
        }

        public class CfPertinentPayload
        {
            public int? perkey { get; set; }
            public string patno { get; set; }
            public string petag { get; set; }
            public int? pecode { get; set; }
            public int? pecodefound { get; set; }
            public string pedesc { get; set; }
            public string peothersremarks { get; set; }
            public string encodedby { get; set; }
        }

        public class CfPhysicalExamPayload
        {
            public int? pekey { get; set; }
            public string patno { get; set; }
            public string petag { get; set; }
            public int? pecodefound { get; set; }
            public int? pecode { get; set; }
            public string pedesc { get; set; }
            public string peothersremarks { get; set; }
            public string encodedby { get; set; }
        }
    }
}

using System;
using System.ComponentModel.DataAnnotations;

namespace claim_form_server.Payloads
{
    public static class CourseWardPayloads
    {

        public class AddCourseWardPayload
        {

            [Required]
            [Display(Name = "Patient Number")]
            public string patno { get; set; }

            [Required]
            [Display(Name = "Course Date")]
            public DateTime cwdate { get; set; }

            [Required]
            [Display(Name = "Course Action")]
            public string cworder_action { get; set; }
            public string encodedby { get; set; }

        }

        public class RemoveCourseWardPayload
        {
            [Required]
            [Display(Name = "Course Ward Id")]
            public string cwkey { get; set; }
            [Required]
            [Display(Name = "Patient Number")]
            public string patno { get; set; }
        }

        public class UpdateCourseWardPayload
        {
            [Required]
            [Display(Name = "Course Ward Id")]
            public string cwkey { get; set; }

            [Required]
            [Display(Name = "Patient Number")]
            public string patno { get; set; }

            [Required]
            [Display(Name = "Course Date")]
            public DateTime cwdate { get; set; }

            [Required]
            [Display(Name = "Course Action")]
            public string cworder_action { get; set; }
            public string encodedby { get; set; }
        }
    }
}

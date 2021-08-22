import { Grid } from "@material-ui/core";
import React, { FC, memo } from "react";
import DropzoneFieldHookForm from "../../Component/HookForm/DropzoneFieldHookForm";
import TextFieldHookForm from "../../Component/HookForm/TextFieldHookForm";

interface IStepConsultInfo {
  step: number;
}

const StepConsultInfo: FC<IStepConsultInfo> = memo(({ step }) => {
  return (
    <div className="tab-container">
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextFieldHookForm
            name="chief_complaint"
            label="Cheif Complaint"
            fullWidth
            multiline
            rows={2}
            required
            placeholder="Write the chief complaint here"
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <TextFieldHookForm
            name="symptoms"
            label="Symptoms"
            fullWidth
            multiline
            rows={2}
            required
            placeholder="Write the symptoms here"
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <TextFieldHookForm
            name="notes"
            label="Notes or Othere Remarks"
            fullWidth
            multiline
            rows={2}
            placeholder="Write the notes or other remarks here"
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <DropzoneFieldHookForm
            name="attach_req_files"
            disabled={step !== 2}
            label="Kindly drop/upload a picture or pdf of your procedure prescription here."
            accept={"image/*,.pdf"}
            multiple={true}
            maxFiles={3}
          />
        </Grid>
      </Grid>
    </div>
  );
});

export default StepConsultInfo;

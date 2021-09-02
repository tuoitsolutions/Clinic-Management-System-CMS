import { FormHelperText, Grid } from "@material-ui/core";
import React, { FC, memo } from "react";
import AutocompleteHookForm from "../../Component/HookForm/AutocompleteHookForm";
import DropzoneFieldHookForm from "../../Component/HookForm/DropzoneFieldHookForm";
import MultiRadioFieldHookForm from "../../Component/HookForm/MultiRadioFieldHookForm";
import SingleCheckboxHookForm from "../../Component/HookForm/SingleCheckboxHookForm";
import TextFieldHookForm from "../../Component/HookForm/TextFieldHookForm";
import { OptionItemModel } from "../../Services/Models/OptionModel";

interface IStepConsultInfo {
  step: number;
  dept_options: Array<OptionItemModel>;
}

const StepConsultInfo: FC<IStepConsultInfo> = memo(({ step, dept_options }) => {
  return (
    <div className="tab-container">
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <div style={{ color: "#2196f3", fontSize: `.6em`, opacity: 0.7 }}>
            This is only applicable for a charity patient of the hospital. (If
            akcnowledged, no payment link will be sent)
          </div>
          <MultiRadioFieldHookForm
            name="is_charity"
            label="Are you a charity patient?"
            row
            size="small"
            radio_items={[
              { label: "Yes", value: "y" },
              { label: "No", value: "n" },
            ]}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <AutocompleteHookForm
            name="assign_dept_pk"
            label="Choose the department for this consultation?"
            options={dept_options}
            defaultValue=""
            InputLabelProps={{
              shrink: true,
            }}
            placeholder="Choose the department for this consultation?"
            required
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextFieldHookForm
            name="chief_complaint"
            label="Chief Complaint"
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

        <Grid item xs={12} md={6}>
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
            label="Notes and/or Other Remarks"
            fullWidth
            multiline
            rows={2}
            placeholder="Write the notes and/or other remarks here"
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <SingleCheckboxHookForm
            label={
              <span>
                I have read and agreed to the{" "}
                <a href="/privacy-policy" target="__blank" className="link">
                  Privacy Policy
                </a>
                .
              </span>
            }
            name="is_agree_priv_pol"
            size="small"
          />
        </Grid>

        <Grid item xs={12}>
          <DropzoneFieldHookForm
            name="attach_req_files"
            disabled={step !== 2}
            label="You can drop at most three (3) files (images,PDFs only) that are related to this consultation here."
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

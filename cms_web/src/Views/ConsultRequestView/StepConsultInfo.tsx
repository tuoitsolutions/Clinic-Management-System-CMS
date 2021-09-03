import { FormHelperText, Grid, Grow, useTheme } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import React, { FC, memo, useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import AutocompleteHookForm from "../../Component/HookForm/AutocompleteHookForm";
import DropzoneFieldHookForm from "../../Component/HookForm/DropzoneFieldHookForm";
import MultiRadioFieldHookForm from "../../Component/HookForm/MultiRadioFieldHookForm";
import SingleCheckboxHookForm from "../../Component/HookForm/SingleCheckboxHookForm";
import TextFieldHookForm from "../../Component/HookForm/TextFieldHookForm";
import DepartmentApi from "../../Services/Api/DepartmentApi";
import { OptionItemModel } from "../../Services/Models/OptionModel";

interface IStepConsultInfo {
  step: number;
  dept_options: Array<OptionItemModel>;
}

const StepConsultInfo: FC<IStepConsultInfo> = memo(({ step, dept_options }) => {
  const { control, errors, watch } = useFormContext();
  const theme = useTheme();
  const [dept_cut_off_msg, set_dept_cut_off_msg] = useState("");

  const assign_dept_pk = watch("assign_dept_pk", false);

  useEffect(() => {
    let mounted = true;
    async function fetchData() {
      const response = await DepartmentApi.IsDeptCutOff(assign_dept_pk);
      set_dept_cut_off_msg(response.data);
    }

    mounted && assign_dept_pk && fetchData();

    return () => {
      mounted = false;
    };
  }, [assign_dept_pk]);

  //IsDeptCutOff
  return (
    <div className="tab-container">
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Grow in={!!dept_cut_off_msg}>
            <Alert
              severity="warning"
              style={{
                fontSize: `.6em`,
                fontWeight: 400,
                margin: `.3em 0`,
                padding: "0 .5em",
              }}
            >
              {dept_cut_off_msg}
            </Alert>
          </Grow>
          {/* {!!dept_cut_off_msg && (
            <Alert
              severity="warning"
              style={{
                fontSize: `.6em`,
                fontWeight: 400,
                margin: `.3em 0`,
                padding: "0 .5em",
              }}
            >
              {dept_cut_off_msg}
            </Alert>
          )} */}
          <AutocompleteHookForm
            name="assign_dept_pk"
            label="Department"
            options={dept_options}
            defaultValue=""
            InputLabelProps={{
              shrink: true,
            }}
            placeholder="Choose the consultation hospital department"
            required
          />
        </Grid>

        <Grid item xs={12}>
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

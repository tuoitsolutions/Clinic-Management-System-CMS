import { Grid } from "@material-ui/core";
import React, { FC, memo } from "react";
import AutocompleteHookForm from "../../Component/HookForm/AutocompleteHookForm";
import DateFieldHookForm from "../../Component/HookForm/DateFieldHookForm";
import MultiRadioFieldHookForm from "../../Component/HookForm/MultiRadioFieldHookForm";
import PhotoHookForm from "../../Component/HookForm/PhotoHookForm";
import TextFieldHookForm from "../../Component/HookForm/TextFieldHookForm";
import { OptionItemModel } from "../../Services/Models/OptionModel";

interface IStepPersonalInfo {
  nationality_options: Array<OptionItemModel>;
  religion_options: Array<OptionItemModel>;
}

const StepPersonalInfo: FC<IStepPersonalInfo> = memo(
  ({ nationality_options, religion_options }) => {
    return (
      <div className="tab-container">
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Grid container justify="center">
              <Grid item>
                <PhotoHookForm
                  label="Patient's Picture"
                  height={130}
                  width={130}
                  name="attach_profile_pic"
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={6} md={2}>
            <TextFieldHookForm
              name="prefix"
              label="Prefix"
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              placeholder="Enter prefix"
            />
          </Grid>
          <Grid item xs={12} md={5}>
            <TextFieldHookForm
              label="First Name"
              name="first_name"
              type="text"
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              placeholder="Enter first name"
              required
            />
          </Grid>
          <Grid item xs={12} md={5}>
            <TextFieldHookForm
              name="middle_name"
              type="text"
              label="Middle Name"
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              placeholder="Enter middle name"
            />
          </Grid>
          <Grid item xs={12} md={5}>
            <TextFieldHookForm
              name="last_name"
              type="text"
              label="Last Name"
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              placeholder="Enter last name"
              required
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <TextFieldHookForm
              name="suffix"
              label="Suffix"
              fullWidth
              placeholder="Enter suffix"
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12} md={5}>
            <MultiRadioFieldHookForm
              name="gender"
              label="Gender"
              row
              size="small"
              required
              radio_items={[
                { label: "Male", value: "m" },
                { label: "Female", value: "f" },
              ]}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <DateFieldHookForm
              type="date"
              name="birth_date"
              label="Date of Birth"
              InputLabelProps={{
                shrink: true,
              }}
              clearable
              disableFuture={true}
              fullWidth
              autoOk
              required
              placeholder="Enter birth date"
              mask="__/__/____"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <AutocompleteHookForm
              label="Civil Status"
              name="cs_pk"
              options={[
                { label: "Annulled", id: "A" },
                { label: "Child", id: "C" },
                { label: "Divorced", id: "D" },
                { label: "Married", id: "M" },
                { label: "Widower", id: "R" },
                { label: "Single", id: "S" },
                { label: "Widow", id: "W" },
              ]}
              defaultValue=""
              InputLabelProps={{
                shrink: true,
              }}
              placeholder="Select civil status"
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <AutocompleteHookForm
              label="Nationality"
              name="nat_pk"
              options={nationality_options}
              defaultValue=""
              InputLabelProps={{
                shrink: true,
              }}
              placeholder="Select nationality"
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <AutocompleteHookForm
              label="Religion"
              name="rel_pk"
              options={religion_options}
              defaultValue=""
              InputLabelProps={{
                shrink: true,
              }}
              placeholder="Select religion"
              required
            />
          </Grid>{" "}
        </Grid>
      </div>
    );
  }
);

export default StepPersonalInfo;

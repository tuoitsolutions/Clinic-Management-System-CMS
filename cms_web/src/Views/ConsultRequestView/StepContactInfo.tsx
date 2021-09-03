import { Grid } from "@material-ui/core";
import React, { FC, memo } from "react";
import { useFormContext } from "react-hook-form";
import AutocompleteHookForm from "../../Component/HookForm/AutocompleteHookForm";
import TextFieldHookForm from "../../Component/HookForm/TextFieldHookForm";
import MaskedPhoneNumber from "../../Component/Mask/MaskedPhoneNumber";
import { OptionItemModel } from "../../Services/Models/OptionModel";

interface IStepContactInfo {
  region_options: Array<OptionItemModel>;
  prov_options: Array<OptionItemModel>;
  citymun_options: Array<OptionItemModel>;
  brgy_options: Array<OptionItemModel>;
  loading_prov_options: boolean;
  loading_citymun_options: boolean;
  loading_brgy_options: boolean;
}

const StepContactInfo: FC<IStepContactInfo> = memo(
  ({
    region_options,
    prov_options,
    citymun_options,
    brgy_options,
    loading_prov_options,
    loading_citymun_options,
    loading_brgy_options,
  }) => {
    const { setValue } = useFormContext();

    return (
      <div className="tab-container">
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextFieldHookForm
              name="email"
              label="Email Address"
              type="email"
              fullWidth
              required
              placeholder="Enter email address"
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextFieldHookForm
              label="Mobile Number"
              name="mob_no"
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              required
              InputProps={{
                inputComponent: MaskedPhoneNumber,
              }}
              placeholder="Enter mobile number"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <AutocompleteHookForm
              label="Region"
              name="region_pk"
              options={region_options}
              defaultValue=""
              InputLabelProps={{
                shrink: true,
              }}
              placeholder="Enter region"
              required
              disabled
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <AutocompleteHookForm
              label="Province"
              name="prov_pk"
              options={prov_options}
              loading={loading_prov_options}
              defaultValue=""
              placeholder="Enter province"
              InputLabelProps={{
                shrink: true,
              }}
              required
              onChangeCallback={(val) => {
                setValue("citymun_pk", "", {
                  shouldDirty: true,
                  shouldValidate: true,
                });
                setValue("brgy_pk", "", {
                  shouldDirty: true,
                  shouldValidate: true,
                });
              }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <AutocompleteHookForm
              label="City/Municipality"
              name="citymun_pk"
              defaultValue=""
              placeholder="Enter city/municipality"
              InputLabelProps={{
                shrink: true,
              }}
              required
              options={citymun_options}
              loading={loading_citymun_options}
              onChangeCallback={(val) => {
                setValue("brgy_pk", "", {
                  shouldDirty: true,
                  shouldValidate: true,
                });
              }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <AutocompleteHookForm
              label="Barangay"
              name="brgy_pk"
              defaultValue=""
              InputLabelProps={{
                shrink: true,
              }}
              placeholder="Enter barangay"
              required
              options={brgy_options}
              loading={loading_brgy_options}
            />
          </Grid>

          <Grid item xs={12} md={10}>
            <TextFieldHookForm
              name="line1"
              label="Building/Lot/Block & Street/Subd."
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              placeholder="Enter building/lot/block and street/subd."
              required
            />
          </Grid>

          <Grid item xs={12} md={2}>
            <TextFieldHookForm
              name="zip_code"
              label="Zip Code"
              fullWidth
              placeholder="Enter zip code"
              InputLabelProps={{
                shrink: true,
              }}
              disabled
            />
          </Grid>
        </Grid>
      </div>
    );
  }
);

export default StepContactInfo;

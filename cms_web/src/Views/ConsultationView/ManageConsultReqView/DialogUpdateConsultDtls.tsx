import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Grid } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import moment from "moment";
import React, { FC, memo, useCallback, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import * as yup from "yup";
import BodyLoader from "../../../Component/BodyLoader";
import FormDialog from "../../../Component/FormDialog/FormDialog";
import AutocompleteHookForm from "../../../Component/HookForm/AutocompleteHookForm";
import DateFieldHookForm from "../../../Component/HookForm/DateFieldHookForm";
import MultiRadioFieldHookForm from "../../../Component/HookForm/MultiRadioFieldHookForm";
import TextFieldHookForm from "../../../Component/HookForm/TextFieldHookForm";
import MaskedPhoneNumber from "../../../Component/Mask/MaskedPhoneNumber";
import {
  closePageLoading,
  setGeneralPrompt,
  setPageSnackbar,
  showPageLoading,
} from "../../../Services/Actions/PageActions";
import ConsultRequestApi from "../../../Services/Api/ConsultRequestApi";
import DefaultValuesApi from "../../../Services/Api/DefaultValuesApi";
import LibraryApi from "../../../Services/Api/LibraryApi";
import ConsultRequestEntity from "../../../Services/Entities/ConsultRequestEntity";

interface IDialogUpdateConsultDtls {
  open: boolean;
  handleCloseDialog: () => void;
  successCallback: () => void;
  consult_info: ConsultRequestEntity;
}

const form_schema = yup.object({
  first_name: yup.string().nullable().required().label("First Name"),
  middle_name: yup.string().nullable().label("Middle Name"),
  last_name: yup.string().nullable().required().label("Last Name"),
  suffix: yup.string().nullable().label("Suffix"),
  prefix: yup.string().nullable().label("Prefix"),
  gender: yup.string().nullable().required().label("Gender"),
  birth_date: yup
    .date()
    .typeError("Invalid Date Format (MM/DD/YYYY)")
    .nullable()
    .required()
    .label("Date of Birth"),
  cs_pk: yup.string().nullable().required().label("Civil Status"),
  nat_pk: yup.string().nullable().required().label("Nationality"),
  rel_pk: yup.string().nullable().required().label("Religion"),
  mob_no: yup
    .string()
    .nullable()
    .required()
    .label("Mobile Number")
    .matches(
      /^(\+639)\d{9}$/,
      "Mobile number must be a valid philippine mobile number"
    ),
  email: yup.string().nullable().required().email().label("Email Address"),
  line1: yup
    .string()
    .nullable()
    .required()
    .label("Building/Lot/Block & Street/Subd."),
  region_pk: yup.string().nullable().required().label("Region"),
  prov_pk: yup.string().nullable().required().label("Province"),
  citymun_pk: yup.string().nullable().required().label("City/Municipality"),
  brgy_pk: yup.string().nullable().required().label("Barangay"),
  zip_code: yup.string().nullable().required().label("Zip Code"),
  chief_complaint: yup.string().nullable().required().label("Chief Complaint"),
  symptoms: yup.string().nullable().required().label("Symptoms"),
  notes: yup.string().nullable().label("Notes"),
});

const DialogUpdateConsultDtls: FC<IDialogUpdateConsultDtls> = memo(
  ({ consult_info, ...props }) => {
    const dispatch = useDispatch();

    const form_instance = useForm<any>({
      resolver: yupResolver(form_schema),
      mode: "onChange",
      defaultValues: {
        ...consult_info,
        birth_date: moment(consult_info.birth_date).format(),
      },
    });

    const region_pk = form_instance.watch("region_pk", false);
    const prov_pk = form_instance.watch("prov_pk", false);
    const citymun_pk = form_instance.watch("citymun_pk", false);

    const [loading_initial_data, set_loading_initial_data] =
      useState<boolean>(false);

    const [loading_province_options, set_loading_province_options] =
      useState<boolean>(false);

    const [loading_city_mun_options, set_loading_city_mun_options] =
      useState<boolean>(false);
    const [loading_brgy_options, set_loading_brgy_options] =
      useState<boolean>(false);

    const [error_message, set_error_message] = useState("");

    const [region_options, set_region_options] = useState<Array<any>>([]);
    const [province_options, set_province_options] = useState<Array<any>>([]);
    const [city_mun_options, set_city_mun_options] = useState<Array<any>>([]);
    const [barangay_options, set_barangay_options] = useState<Array<any>>([]);
    const [nationality_options, set_nationality_options] = useState<Array<any>>(
      []
    );
    const [religion_options, set_religion_options] = useState<Array<any>>([]);

    const handleSubmitForm = useCallback(
      async (payload: ConsultRequestEntity) => {
        payload.consult_req_pk = consult_info?.consult_req_pk;
        payload.birth_date = moment(payload.birth_date).format();

        if (!!payload.consult_req_pk) {
          dispatch(
            setGeneralPrompt({
              open: true,
              custom_title: `Are you sure that you want to save the changes of the consultation details?`,
              continue_callback: async () => {
                dispatch(
                  showPageLoading({
                    show: true,
                    loading_message:
                      "Saving changes, thank you for your patience.",
                  })
                );
                const response = await ConsultRequestApi.UpdateConsultDtls(
                  payload
                );
                dispatch(closePageLoading());
                dispatch(
                  setPageSnackbar(
                    response?.message?.toString(),
                    response.success ? "success" : "error"
                  )
                );
                if (response.success) {
                  if (typeof props.successCallback === "function") {
                    props.successCallback();
                  }
                  props.handleCloseDialog();
                }
              },
            })
          );
        }
      },
      [consult_info]
    );

    useEffect(() => {
      let mounted = true;

      async function fetchData() {
        set_loading_initial_data(true);
        const region_response = await LibraryApi.RegionOptions();
        const nationality_response = await LibraryApi.NationalityOptions();
        const religion_response = await LibraryApi.ReligionOptions();
        const def_reg_res = await DefaultValuesApi.GetConsultDefRegion();
        const def_zipcode_res = await DefaultValuesApi.GetConsultDefZipcode();

        if (
          region_response.success &&
          nationality_response.success &&
          religion_response.success &&
          def_reg_res.success &&
          def_zipcode_res.success
        ) {
          mounted && set_region_options(region_response.data);
          mounted && set_nationality_options(nationality_response.data);
          mounted && set_religion_options(religion_response.data);

          const zip_code = def_zipcode_res.data;
          const region_pk = def_reg_res.data;

          mounted &&
            form_instance.reset({
              ...consult_info,
              zip_code: zip_code,
              region_pk: region_pk,
            });
        } else {
          mounted &&
            set_error_message(
              "Sorry, it looks like we are unable to fetch the some data."
            );
        }

        mounted && set_loading_initial_data(false);
      }

      mounted && !!consult_info && fetchData();

      return () => {
        mounted = false;
      };
    }, [consult_info]);

    useEffect(() => {
      let mounted = true;
      async function fetchData() {
        set_loading_province_options(true);
        const province_response = await LibraryApi.ProvinceOptions(region_pk);
        if (province_response.success) {
          mounted && set_province_options(province_response.data);
        } else {
          mounted &&
            set_error_message(
              "Sorry, it looks like we are unable to fetch the some data."
            );
        }
        set_loading_province_options(false);
      }

      mounted && fetchData();

      return () => {
        mounted = false;
      };
    }, [region_pk]);

    useEffect(() => {
      let mounted = true;
      async function fetchData() {
        set_loading_city_mun_options(true);
        const city_mun_response = await LibraryApi.CityMunOptions(prov_pk);
        if (city_mun_response.success) {
          mounted && set_city_mun_options(city_mun_response.data);
        } else {
          mounted &&
            set_error_message(
              "Sorry, it looks like we are unable to fetch the some data."
            );
        }
        set_loading_city_mun_options(false);
      }

      mounted && fetchData();

      return () => {
        mounted = false;
      };
    }, [prov_pk]);

    useEffect(() => {
      let mounted = true;
      async function fetchData() {
        set_loading_brgy_options(true);
        const brgy_response = await LibraryApi.BarangayOptions(citymun_pk);
        if (brgy_response.success) {
          mounted && set_barangay_options(brgy_response.data);
        } else {
          mounted &&
            set_error_message(
              "Sorry, it looks like we are unable to fetch the some data."
            );
        }
        set_loading_brgy_options(false);
      }

      mounted && fetchData();

      return () => {
        mounted = false;
      };
    }, [citymun_pk]);

    return (
      <>
        <FormDialog
          title="Update Patient Personal and Contact Details"
          open={props.open}
          handleClose={props.handleCloseDialog}
          minWidth={800}
          body={
            <div>
              {loading_initial_data ? (
                <BodyLoader />
              ) : !!error_message ? (
                <Alert severity="error">{error_message}</Alert>
              ) : (
                <FormProvider {...form_instance}>
                  <form
                    onSubmit={form_instance.handleSubmit(handleSubmitForm)}
                    noValidate
                    id="form_instance"
                  >
                    <div
                      style={{
                        margin: `1em`,
                      }}
                    >
                      <Grid container spacing={3}>
                        <Grid item xs={12}>
                          <Grid container spacing={3}>
                            <Grid item xs={12}>
                              <div className="ctnr-title-container">
                                <Grid
                                  container
                                  spacing={1}
                                  alignContent="center"
                                  alignItems="center"
                                >
                                  <Grid item xs={12}>
                                    <div className="ctnr-title">
                                      <div className="main">
                                        Personal Details
                                      </div>
                                    </div>
                                  </Grid>
                                </Grid>
                              </div>
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
                            <Grid item xs={12} md={4}>
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
                            <Grid item xs={12} md={4}>
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
                            <Grid item xs={12} md={4}>
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
                            <Grid item xs={12} md={3}>
                              <MultiRadioFieldHookForm
                                name="gender"
                                label="Gender"
                                row
                                size="small"
                                radio_items={[
                                  { label: "Male", value: "m" },
                                  { label: "Female", value: "f" },
                                ]}
                              />
                            </Grid>
                            <Grid item xs={12} md={3}>
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
                                placeholder="Enter birth date"
                                mask="__/__/____"
                              />
                            </Grid>
                            <Grid item xs={12} md={4}>
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
                            <Grid item xs={12} md={4}>
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
                            <Grid item xs={12} md={4}>
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
                        </Grid>

                        <Grid item xs={12}>
                          <Grid container spacing={3}>
                            <Grid item xs={12}>
                              <div className="ctnr-title-container">
                                <Grid
                                  container
                                  spacing={1}
                                  alignContent="center"
                                  alignItems="center"
                                >
                                  <Grid item xs={12}>
                                    <div className="ctnr-title">
                                      <div className="main">
                                        Contact Details
                                      </div>
                                    </div>
                                  </Grid>
                                </Grid>
                              </div>
                            </Grid>
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
                            <Grid item xs={12} md={4}>
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

                            <Grid item xs={12}>
                              <Grid container spacing={3}>
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

                                <Grid item xs={12} md={5}>
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

                                <Grid item xs={12} md={5}>
                                  <AutocompleteHookForm
                                    label="Province"
                                    name="prov_pk"
                                    options={province_options}
                                    loading={loading_province_options}
                                    defaultValue=""
                                    placeholder="Enter province"
                                    InputLabelProps={{
                                      shrink: true,
                                    }}
                                    required
                                    onChangeCallback={(val) => {
                                      form_instance.setValue("citymun_pk", "", {
                                        shouldDirty: true,
                                        shouldValidate: true,
                                      });
                                      form_instance.setValue("brgy_pk", "", {
                                        shouldDirty: true,
                                        shouldValidate: true,
                                      });
                                    }}
                                  />
                                </Grid>

                                <Grid item xs={12} md={5}>
                                  <AutocompleteHookForm
                                    label="City/Municipality"
                                    name="citymun_pk"
                                    defaultValue=""
                                    placeholder="Enter city/municipality"
                                    InputLabelProps={{
                                      shrink: true,
                                    }}
                                    required
                                    options={city_mun_options}
                                    loading={loading_city_mun_options}
                                    onChangeCallback={(val) => {
                                      form_instance.setValue("brgy_pk", "", {
                                        shouldDirty: true,
                                        shouldValidate: true,
                                      });
                                    }}
                                  />
                                </Grid>

                                <Grid item xs={12} md={5}>
                                  <AutocompleteHookForm
                                    label="Barangay"
                                    name="brgy_pk"
                                    defaultValue=""
                                    InputLabelProps={{
                                      shrink: true,
                                    }}
                                    placeholder="Enter barangay"
                                    required
                                    options={barangay_options}
                                    loading={loading_brgy_options}
                                  />
                                </Grid>

                                <Grid item xs={12}>
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
                              </Grid>
                            </Grid>
                          </Grid>
                        </Grid>

                        <Grid item xs={12}>
                          <Grid container spacing={3}>
                            <Grid item xs={12}>
                              <div className="ctnr-title-container">
                                <Grid
                                  container
                                  spacing={1}
                                  alignContent="center"
                                  alignItems="center"
                                >
                                  <Grid item xs={12}>
                                    <div className="ctnr-title">
                                      <div className="main">
                                        Consultation Details
                                      </div>
                                    </div>
                                  </Grid>
                                </Grid>
                              </div>
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
                          </Grid>
                        </Grid>
                      </Grid>
                    </div>
                  </form>
                </FormProvider>
              )}
            </div>
          }
          actions={
            <>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                form="form_instance"
                disabled={loading_initial_data}
              >
                Save Changes
              </Button>
              <Button
                variant="contained"
                color="secondary"
                type="reset"
                disabled={loading_initial_data}
                onClick={async () => {
                  form_instance.reset(consult_info);
                }}
              >
                Reset
              </Button>
            </>
          }
        />
      </>
    );
  }
);

export default DialogUpdateConsultDtls;

/* <Grid item xs={12} md={6}>
<AutocompleteHookForm
  name="assign_dept_pk"
  label="Department"
  options={dept_options}
  defaultValue=""
  InputLabelProps={{
    shrink: true,
  }}
  placeholder="Choose the department for this consultation"
  required
/>
</Grid>

<Grid item xs={12} md={6}>
<AutocompleteHookForm
  name="assign_res_pk"
  label="Assigned Resident"
  fullWidth={true}
  InputLabelProps={{
    shrink: true,
  }}
  options={dept_resident_options}
  loading={fetch_dept_resident_options}
  disabled={fetch_dept_resident_options}
/>
</Grid>

<Grid item xs={12} sm={3}>
<DateFieldHookForm
  name="exp_start_date"
  label="Expected Start Date"
  InputLabelProps={{
    shrink: true,
  }}
  type="date"
  disablePast
/>
</Grid>

<Grid item xs={12} sm={3}>
<DateFieldHookForm
  name="exp_start_time"
  label="Expected Start Time"
  InputLabelProps={{
    shrink: true,
  }}
  type="time"
  disablePast
/>
</Grid> */

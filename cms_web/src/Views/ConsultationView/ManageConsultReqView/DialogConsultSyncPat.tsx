import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Grid } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import React, { FC, memo, useCallback, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import * as yup from "yup";
import BodyLoader from "../../../Component/BodyLoader";
import FormDialog from "../../../Component/FormDialog/FormDialog";
import AutocompleteHookForm from "../../../Component/HookForm/AutocompleteHookForm";
import DateFieldHookForm from "../../../Component/HookForm/DateFieldHookForm";
import TextFieldHookForm from "../../../Component/HookForm/TextFieldHookForm";
import MaskedPhoneNumber from "../../../Component/Mask/MaskedPhoneNumber";
import ConsultRequestActions from "../../../Services/Actions/ConsultRequestActions";
import {
  closePageLoading,
  setGeneralPrompt,
  setPageSnackbar,
  showPageLoading,
} from "../../../Services/Actions/PageActions";
import ConsultRequestApi from "../../../Services/Api/ConsultRequestApi";
import HospPatientApi from "../../../Services/Api/HospPatientApi";
import LibraryApi from "../../../Services/Api/LibraryApi";
import ConsultRequestEntity from "../../../Services/Entities/ConsultRequestEntity";
import HospPatientEntity from "../../../Services/Entities/HospPatientEntity";
import { RootStore } from "../../../Services/Store";

interface IDialogConsultSyncPat {
  successCallback: () => void;
  selected_record: ConsultRequestEntity;
}

const form_structure = {
  hospital_no: {
    name: "hospital_no",
    label: "Hospital Number",
  },
  prefix: {
    name: "prefix",
    label: "Prefix",
  },
  first_name: {
    name: "first_name",
    label: "First Name",
  },
  middle_name: {
    name: "middle_name",
    label: "Middle Name",
  },
  last_name: {
    name: "last_name",
    label: "Last Name",
  },
  suffix: {
    name: "suffix",
    label: "Suffix",
  },
  birth_date: {
    name: "birth_date",
    label: "Birth Date",
  },
  birth_place: {
    name: "birth_place",
    label: "Birth Place",
  },
  cs_pk: {
    name: "cs_pk",
    label: "Civil Status",
  },
  nat_pk: {
    name: "nat_pk",
    label: "Nationality",
  },
  rel_pk: {
    name: "rel_pk",
    label: "Religion",
  },
  email: {
    name: "email",
    label: "Email",
  },
  mob_no: {
    name: "mob_no",
    label: "Mobile Number",
  },
  line1: {
    name: "line1",
    label: "Line 1",
  },
  // line2: {
  //   name: "line2",
  //   label: "Line 2",
  // },
  brgy_pk: {
    name: "brgy_pk",
    label: "Barangay",
  },
  citymun_pk: {
    name: "citymun_pk",
    label: "City/Municipality",
  },
  prov_pk: {
    name: "prov_pk",
    label: "Province",
  },
  region_pk: {
    name: "region_pk",
    label: "Region",
  },
  zip_code: {
    name: "zip_code",
    label: "Zip Code",
  },
};

const form_schema = yup.object({
  hospital_no: yup
    .string()
    .required()
    .nullable()
    .label(form_structure.hospital_no.label),
  prefix: yup.string().nullable().label(form_structure.prefix.label),
  first_name: yup
    .string()
    .required()
    .nullable()
    .label(form_structure.first_name.label),
  middle_name: yup.string().nullable().label(form_structure.middle_name.label),
  last_name: yup
    .string()
    .required()
    .nullable()
    .label(form_structure.last_name.label),
  suffix: yup.string().nullable().label(form_structure.suffix.label),
  birth_date: yup
    .string()
    .required()
    .nullable()
    .label(form_structure.birth_date.label),
  birth_place: yup.string().nullable().label(form_structure.birth_place.label),
  cs_pk: yup.string().required().nullable().label(form_structure.cs_pk.label),
  nat_pk: yup.string().required().nullable().label(form_structure.nat_pk.label),
  rel_pk: yup.string().required().nullable().label(form_structure.rel_pk.label),
  email: yup.string().required().nullable().label(form_structure.email.label),
  mob_no: yup.string().required().nullable().label(form_structure.mob_no.label),
  line1: yup.string().required().nullable().label(form_structure.line1.label),
  // line2: yup.string().required().nullable().label(form_structure.line2.label),
  brgy_pk: yup
    .string()
    .required()
    .nullable()
    .label(form_structure.brgy_pk.label),
  citymun_pk: yup
    .string()
    .required()
    .nullable()
    .label(form_structure.citymun_pk.label),
  prov_pk: yup
    .string()
    .required()
    .nullable()
    .label(form_structure.prov_pk.label),
  region_pk: yup
    .string()
    .required()
    .nullable()
    .label(form_structure.region_pk.label),
  zip_code: yup
    .string()
    .required()
    .nullable()
    .label(form_structure.zip_code.label),
});

const DialogConsultSyncPat: FC<IDialogConsultSyncPat> = memo((props) => {
  const dispatch = useDispatch();

  const { open_sync_pat_dialog } = useSelector(
    (store: RootStore) => store.ConsultRequestReducer
  );

  const form_instance = useForm<any>({
    resolver: yupResolver(form_schema),
    mode: "onChange",
    defaultValues: props.selected_record,
  });

  const region_pk = form_instance.watch("region_pk", false);
  const prov_pk = form_instance.watch("prov_pk", false);
  const citymun_pk = form_instance.watch("citymun_pk", false);
  const hospital_no = form_instance.watch("hospital_no", false);

  const [error_message, set_error_message] = useState("");

  const handleSubmitForm = useCallback(
    async (payload: HospPatientEntity) => {
      payload.consult_req_pk = props.selected_record.consult_req_pk;
      payload.hospital_no = hospital_no;

      if (!!payload.consult_req_pk) {
        dispatch(
          setGeneralPrompt({
            open: true,
            custom_title: `Are you sure that you want to start this consultation?`,
            continue_callback: async () => {
              dispatch(
                showPageLoading({
                  show: true,
                  loading_message:
                    "Starting the consultation, thank you for your patience",
                })
              );
              const response = await ConsultRequestApi.MapConsultationToPatient(
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
                dispatch(ConsultRequestActions.SetOpenSyncPatDialog(false));
              } else {
                set_error_message(response.message.toString());
              }
            },
          })
        );
      }
    },
    [dispatch, hospital_no, props]
  );

  const [loading_initial_data, set_loading_initial_data] =
    useState<boolean>(false);
  const [loading_province_options, set_loading_province_options] =
    useState<boolean>(false);

  const [loading_city_mun_options, set_loading_city_mun_options] =
    useState<boolean>(false);
  const [loading_brgy_options, set_loading_brgy_options] =
    useState<boolean>(false);

  const [fetch_hosp_pat_info, set_fetch_hosp_pat_info] =
    useState<boolean>(false);

  const [hosp_pat_options, set_hosp_pat_options] = useState<Array<any>>([]);
  const [region_options, set_region_options] = useState<Array<any>>([]);
  const [province_options, set_province_options] = useState<Array<any>>([]);
  const [city_mun_options, set_city_mun_options] = useState<Array<any>>([]);
  const [barangay_options, set_barangay_options] = useState<Array<any>>([]);
  const [nationality_options, set_nationality_options] = useState<Array<any>>(
    []
  );
  const [religion_options, set_religion_options] = useState<Array<any>>([]);

  useEffect(() => {
    let mounted = true;

    async function fetchData() {
      set_loading_initial_data(true);
      const hosp_pat_opt_res = await LibraryApi.HospitalPatientOptions();
      const region_response = await LibraryApi.RegionOptions();
      const nationality_response = await LibraryApi.NationalityOptions();
      const religion_response = await LibraryApi.ReligionOptions();

      if (
        hosp_pat_opt_res.success &&
        region_response.success &&
        nationality_response.success &&
        religion_response.success
      ) {
        mounted && set_hosp_pat_options(hosp_pat_opt_res.data);
        mounted && set_region_options(region_response.data);
        mounted && set_nationality_options(nationality_response.data);
        mounted && set_religion_options(religion_response.data);
      } else {
        mounted &&
          set_error_message(
            "Sorry, it looks like we are unable to fetch the some data."
          );
      }

      set_loading_initial_data(false);
    }

    mounted && fetchData();

    return () => {
      mounted = false;
    };
  }, []);

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

  useEffect(() => {
    let mounted = true;
    async function fetchData() {
      set_fetch_hosp_pat_info(true);
      dispatch(
        showPageLoading({
          show: true,
          loading_message:
            "Loading patient information, thank you for your patience.",
        })
      );

      const hosp_pat_res = await HospPatientApi.GetHosPatientById(hospital_no);
      dispatch(closePageLoading());

      if (hosp_pat_res.success) {
        mounted && form_instance.reset(hosp_pat_res.data);
      }
      set_fetch_hosp_pat_info(false);
    }

    mounted && !!hospital_no && fetchData();

    return () => {
      mounted = false;
    };
  }, [dispatch, hospital_no]);

  return (
    open_sync_pat_dialog && (
      <>
        <FormDialog
          title="Sync this consultation to an existing patient record"
          open={open_sync_pat_dialog}
          handleClose={() => {
            dispatch(ConsultRequestActions.SetOpenSyncPatDialog(false));
          }}
          minWidth={750}
          body={
            !!error_message ? (
              <>
                <Alert severity="error">{error_message}</Alert>
              </>
            ) : loading_initial_data ? (
              <>
                <BodyLoader message="Fetching initial data, thank you for your patience." />
              </>
            ) : (
              <div>
                <FormProvider {...form_instance}>
                  <form
                    onSubmit={form_instance.handleSubmit(handleSubmitForm)}
                    noValidate
                    id="form_instance"
                  >
                    <div
                      style={{
                        display: `grid`,
                        padding: `1.5em`,
                        backgroundColor: `#fff`,
                        borderRadius: 10,
                      }}
                    >
                      <Grid container spacing={3}>
                        <Grid item xs={12}>
                          <AutocompleteHookForm
                            name="hospital_no"
                            label="Select the patient that you want to sync"
                            fullWidth={true}
                            InputLabelProps={{
                              shrink: true,
                            }}
                            options={hosp_pat_options}
                          />
                        </Grid>

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
                                  <div className="main">Patient Details</div>
                                  <div className="sub">
                                    You can edit the patient details before
                                    syncronizing it.
                                  </div>
                                </div>
                              </Grid>
                            </Grid>
                          </div>
                        </Grid>

                        <Grid item xs={12} md={2}>
                          <TextFieldHookForm
                            name={form_structure.prefix.name}
                            label={form_structure.prefix.label}
                            InputLabelProps={{
                              shrink: true,
                            }}
                            fullWidth
                            placeholder={`Enter the ${form_structure.prefix.label}`}
                          />
                        </Grid>

                        <Grid item xs={12} md={5}>
                          <TextFieldHookForm
                            name={form_structure.first_name.name}
                            label={form_structure.first_name.label}
                            InputLabelProps={{
                              shrink: true,
                            }}
                            fullWidth
                            required
                            placeholder={`Enter the ${form_structure.first_name.label}`}
                          />
                        </Grid>

                        <Grid item xs={12} md={5}>
                          <TextFieldHookForm
                            name={form_structure.middle_name.name}
                            label={form_structure.middle_name.label}
                            InputLabelProps={{
                              shrink: true,
                            }}
                            fullWidth
                            placeholder={`Enter the ${form_structure.middle_name.label}`}
                          />
                        </Grid>

                        <Grid item xs={12} md={5}>
                          <TextFieldHookForm
                            name={form_structure.last_name.name}
                            label={form_structure.last_name.label}
                            InputLabelProps={{
                              shrink: true,
                            }}
                            fullWidth
                            required
                            placeholder={`Enter the ${form_structure.last_name.label}`}
                          />
                        </Grid>

                        <Grid item xs={12} md={2}>
                          <TextFieldHookForm
                            name={form_structure.suffix.name}
                            label={form_structure.suffix.label}
                            InputLabelProps={{
                              shrink: true,
                            }}
                            fullWidth
                            required
                            placeholder={`Enter the ${form_structure.suffix.label}`}
                          />
                        </Grid>

                        <Grid item xs={5}>
                          <DateFieldHookForm
                            name={form_structure.birth_date.name}
                            label={form_structure.birth_date.label}
                            InputLabelProps={{
                              shrink: true,
                            }}
                            fullWidth
                            required
                            placeholder={`Enter the ${form_structure.birth_date.label}`}
                            type="date"
                            disableFuture
                          />
                        </Grid>

                        <Grid item xs={12}>
                          <TextFieldHookForm
                            name={form_structure.birth_place.name}
                            label={form_structure.birth_place.label}
                            InputLabelProps={{
                              shrink: true,
                            }}
                            fullWidth
                            placeholder={`Enter the ${form_structure.birth_place.label}`}
                            disabled={loading_initial_data}
                          />
                        </Grid>

                        <Grid item xs={4}>
                          <AutocompleteHookForm
                            name={form_structure.cs_pk.name}
                            label={form_structure.cs_pk.label}
                            fullWidth={true}
                            InputLabelProps={{
                              shrink: true,
                            }}
                            options={[
                              { label: "Annulled", id: "A" },
                              { label: "Child", id: "C" },
                              { label: "Divorced", id: "D" },
                              { label: "Married", id: "M" },
                              { label: "Widower", id: "R" },
                              { label: "Single", id: "S" },
                              { label: "Widow", id: "W" },
                            ]}
                            required
                          />
                        </Grid>

                        <Grid item xs={4}>
                          <AutocompleteHookForm
                            name={form_structure.nat_pk.name}
                            label={form_structure.nat_pk.label}
                            fullWidth={true}
                            InputLabelProps={{
                              shrink: true,
                            }}
                            options={nationality_options}
                            disabled={loading_initial_data}
                            required
                          />
                        </Grid>

                        <Grid item xs={4}>
                          <AutocompleteHookForm
                            name={form_structure.rel_pk.name}
                            label={form_structure.rel_pk.label}
                            fullWidth={true}
                            InputLabelProps={{
                              shrink: true,
                            }}
                            options={religion_options}
                            disabled={loading_initial_data}
                            required
                          />
                        </Grid>

                        <Grid item xs={4}>
                          <TextFieldHookForm
                            name={form_structure.email.name}
                            label={form_structure.email.label}
                            InputLabelProps={{
                              shrink: true,
                            }}
                            fullWidth
                            required
                            placeholder={`Enter the ${form_structure.email.label}`}
                          />
                        </Grid>

                        <Grid item xs={4}>
                          <TextFieldHookForm
                            name={form_structure.mob_no.name}
                            label={form_structure.mob_no.label}
                            InputLabelProps={{
                              shrink: true,
                            }}
                            fullWidth
                            required
                            placeholder={`Enter the ${form_structure.mob_no.label}`}
                            InputProps={{
                              inputComponent: MaskedPhoneNumber,
                            }}
                          />
                        </Grid>

                        <Grid item xs={6} md={2}>
                          <TextFieldHookForm
                            name="zip_code"
                            label="Zip Code"
                            fullWidth
                            placeholder="Enter zip code"
                            InputLabelProps={{
                              shrink: true,
                            }}
                            required
                          />
                        </Grid>

                        <Grid item xs={6} md={4}>
                          <AutocompleteHookForm
                            name={form_structure.region_pk.name}
                            label={form_structure.region_pk.label}
                            options={region_options}
                            defaultValue=""
                            InputLabelProps={{
                              shrink: true,
                            }}
                            placeholder="Enter region"
                            required
                            loading={loading_initial_data}
                          />
                        </Grid>

                        <Grid item xs={12} md={4}>
                          <AutocompleteHookForm
                            name={form_structure.prov_pk.name}
                            label={form_structure.prov_pk.label}
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

                        <Grid item xs={12} md={4}>
                          <AutocompleteHookForm
                            name={form_structure.citymun_pk.name}
                            label={form_structure.citymun_pk.label}
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

                        <Grid item xs={12} md={4}>
                          <AutocompleteHookForm
                            name={form_structure.brgy_pk.name}
                            label={form_structure.brgy_pk.label}
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

                        <Grid item xs={12} md={6}>
                          <TextFieldHookForm
                            name={form_structure.line1.name}
                            label={form_structure.line1.label}
                            placeholder={`Enter the ${form_structure.line1.label}`}
                            fullWidth
                            InputLabelProps={{
                              shrink: true,
                            }}
                            required
                          />
                        </Grid>

                        {/* <Grid item xs={12} md={6}>
                          <TextFieldHookForm
                            name={form_structure.line2.name}
                            label={form_structure.line2.label}
                            placeholder={`Enter the ${form_structure.line2.label}`}
                            fullWidth
                            InputLabelProps={{
                              shrink: true,
                            }}
                            required
                          />
                        </Grid> */}
                      </Grid>
                    </div>
                  </form>
                </FormProvider>
              </div>
            )
          }
          actions={
            <>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                form="form_instance"
              >
                Save Changes
              </Button>
              <Button
                variant="contained"
                color="secondary"
                type="reset"
                onClick={async () => {
                  form_instance.reset(props.selected_record);
                }}
              >
                Reset
              </Button>
            </>
          }
        />
      </>
    )
  );
});

export default DialogConsultSyncPat;

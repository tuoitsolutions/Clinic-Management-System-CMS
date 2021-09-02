import { yupResolver } from "@hookform/resolvers/yup";
import { AppBar, Button, Container, Grid } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { useTheme } from "@material-ui/styles";
import React, { FC, memo, useCallback, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import * as yup from "yup";
import BodyLoader from "../../Component/BodyLoader";
import CustomAvatar from "../../Component/CustomAvatar";
import CustomStepper from "../../Component/CustomStepper/CustomStepper";
import LoadingButton from "../../Component/LoadingButton";
import { APP_NAME } from "../../Helpers/AppConfig";
import DefaultValuesActions from "../../Services/Actions/DefaultValuesActions";
import {
  closePageLoading,
  setGeneralPrompt,
  setPageSnackbar,
  showPageLoading,
} from "../../Services/Actions/PageActions";
import CommonApi from "../../Services/Api/CommonApi";
import DefaultValuesApi from "../../Services/Api/DefaultValuesApi";
import LibraryApi from "../../Services/Api/LibraryApi";
import ConsultRequestEntity from "../../Services/Entities/ConsultRequestEntity";
import OtpEntity from "../../Services/Entities/OtpEntity";
import { RootStore } from "../../Services/Store";
import { PageContainerUi } from "../../Styles/GlobalStyles";
import ConsultOtpDialog from "./ConsultOtpDialog";
import StepConsultInfo from "./StepConsultInfo";
import StepContactInfo from "./StepContactInfo";
import StepPersonalInfo from "./StepPersonalInfo";
interface ConsultRequestViewProps {}

export const ConsultRequestView: FC<ConsultRequestViewProps> = memo(() => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const form_def_val = {
    first_name: "",
    middle_name: "",
    last_name: "",
    suffix: "",
    prefix: "",
    gender: "",
    birth_date: "",
    cs_pk: "",
    nat_pk: "3",
    rel_pk: "",
    mob_no: "",
    email: "",
    line1: "",
    line2: "",
    region_pk: "",
    prov_pk: "",
    citymun_pk: "",
    brgy_pk: "",
    zip_code: "",
    chief_complaint: "",
    symptoms: "",
    notes: "",
    validate_lab_req_form: [],
  };

  const {
    hospital_name,
    fetch_hospital_name,
    hospital_logo,
    fetch_hospital_logo,
  } = useSelector((store: RootStore) => store.DefaultValuesReducer);

  let validate_lab_req_form: any = yup.object();

  const [active_step, set_active_step] = useState(0);
  const [open_otp_dialog, set_open_otp_dialog] = useState(false);

  const [form_payload, set_form_payload] =
    useState<ConsultRequestEntity | null>(null);

  const [def_zip_code, set_def_zip_code] = useState("");
  const [def_region_pk, set_def_region_pk] = useState("");

  //otp states

  if (active_step === 0) {
    validate_lab_req_form = yup.object({
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
    });
  } else if (active_step === 1) {
    validate_lab_req_form = yup.object({
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
    });
  } else if (active_step === 2) {
    validate_lab_req_form = yup.object({
      chief_complaint: yup
        .string()
        .nullable()
        .required()
        .label("Chief Complaint"),
      symptoms: yup.string().nullable().required().label("Symptoms"),
      notes: yup.string().nullable().label("Notes"),
      assign_dept_pk: yup.string().required().nullable().label("Department"),
      is_charity: yup
        .string()
        .nullable()
        .required()
        .label("Is Charity Patient"),
      is_agree_priv_pol: yup
        .string()
        .nullable()
        .required("You must read and agree to the Privacy Policy")
        .label("Privacy Policy"),
    });
  }

  const form_instance_otp = useForm<any>({
    resolver: yupResolver(validate_lab_req_form),
    mode: "onChange",
    defaultValues: form_def_val,
  });

  const handleBack = useCallback(() => {
    if (active_step > 0) {
      set_active_step((prev) => prev - 1);
    }
  }, [active_step]);

  const handleSubmitForm = useCallback(
    async (data: ConsultRequestEntity) => {
      if (active_step < 2) {
        set_active_step((prev) => prev + 1);
      } else {
        dispatch(
          showPageLoading({
            show: true,
            loading_message:
              "Generating OTP number, thank you for your patience",
          })
        );

        const otp_payload: OtpEntity = {
          mob_no: data.mob_no,
          user_pk: data.email,
        };

        const response = await CommonApi.GenerateOtp(otp_payload);

        dispatch(closePageLoading());
        dispatch(
          setPageSnackbar(
            response?.message?.toString(),
            response.success ? "success" : "error"
          )
        );
        if (response.success) {
          console.log(`data`, {
            ...data,
            is_agree_priv_pol: !!data?.is_agree_priv_pol ? "y" : "n",
          });

          set_form_payload({
            ...data,
            is_agree_priv_pol: !!data?.is_agree_priv_pol ? "y" : "n",
          });
          set_open_otp_dialog(true);
        }
      }
    },
    [active_step, dispatch]
  );

  const region_pk = form_instance_otp.watch("region_pk", false);
  const prov_pk = form_instance_otp.watch("prov_pk", false);
  const citymun_pk = form_instance_otp.watch("citymun_pk", false);

  const [loading_initial_data, set_loading_initial_data] =
    useState<boolean>(false);

  const [loading_province_options, set_loading_province_options] =
    useState<boolean>(false);

  const [loading_city_mun_options, set_loading_city_mun_options] =
    useState<boolean>(false);
  const [loading_brgy_options, set_loading_brgy_options] =
    useState<boolean>(false);

  const [error_message, set_error_message] = useState("");

  const [dept_options, set_dept_options] = useState<Array<any>>([]);
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
      const region_response = await LibraryApi.RegionOptions();
      const nationality_response = await LibraryApi.NationalityOptions();
      const religion_response = await LibraryApi.ReligionOptions();
      const dept_res = await LibraryApi.GetDepartmentOptions();

      const def_reg_res = await DefaultValuesApi.GetConsultDefRegion();
      const def_zipcode_res = await DefaultValuesApi.GetConsultDefZipcode();

      if (
        dept_res.success &&
        region_response.success &&
        nationality_response.success &&
        religion_response.success &&
        def_reg_res.success &&
        def_zipcode_res.success
      ) {
        mounted && set_region_options(region_response.data);
        mounted && set_nationality_options(nationality_response.data);
        mounted && set_religion_options(religion_response.data);
        mounted && set_dept_options(dept_res.data);

        const zip_code = def_zipcode_res.data;
        const region_pk = def_reg_res.data;

        mounted &&
          form_instance_otp.reset({
            ...form_def_val,
            zip_code: zip_code,
            region_pk: region_pk,
          });

        mounted && set_def_zip_code(zip_code);
        mounted && set_def_region_pk(region_pk);
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
    dispatch(DefaultValuesActions.setHospitalLogoAction());
    dispatch(DefaultValuesActions.setHospitalNameAction());
  }, [dispatch]);

  return (
    <PageContainerUi theme={theme}>
      {fetch_hospital_name || fetch_hospital_logo ? (
        <BodyLoader />
      ) : !loading_initial_data ? (
        !!error_message ? (
          <Alert>{error_message}</Alert>
        ) : (
          <>
            <AppBar className="header-ctnr">
              <CustomAvatar
                className="brand-logo"
                src={hospital_logo}
                alt={hospital_name?.charAt(0)}
                isBlob={true}
                spacing={5}
              />

              <div className="brand-name">{hospital_name}</div>
              <div className="app-name">{APP_NAME}</div>
            </AppBar>

            <Container maxWidth="md" className="page-content ">
              <div className="cntr-title main-title">
                <div className="main">Consultation Request Form</div>
                <div className="sub">
                  This form is used to create consultation requests for
                  patients. Kindly fill up all the required fields.
                </div>
              </div>
              <div className="tabs-ctnr">
                <FormProvider {...form_instance_otp}>
                  <form
                    onSubmit={form_instance_otp.handleSubmit(handleSubmitForm)}
                    noValidate
                    id="form_instance_otp"
                  >
                    <CustomStepper
                      active_step={active_step}
                      steps={[
                        {
                          label: "Personal Details",
                          View: (
                            <StepPersonalInfo
                              nationality_options={nationality_options}
                              religion_options={religion_options}
                            />
                          ),
                        },
                        {
                          label: "Contact Details",
                          View: (
                            <StepContactInfo
                              region_options={region_options}
                              prov_options={province_options}
                              citymun_options={city_mun_options}
                              brgy_options={barangay_options}
                              loading_prov_options={loading_province_options}
                              loading_citymun_options={loading_city_mun_options}
                              loading_brgy_options={loading_brgy_options}
                            />
                          ),
                        },
                        {
                          label: "Consultation Details",
                          View: (
                            <StepConsultInfo
                              step={active_step}
                              dept_options={dept_options}
                            />
                          ),
                        },
                      ]}
                    />
                  </form>
                </FormProvider>
              </div>

              <div style={{ marginTop: `2em` }}>
                <Grid container spacing={2} justify="flex-end">
                  <Grid item>
                    <Button
                      variant="contained"
                      size="large"
                      type="button"
                      form="form_instance_otp"
                      onClick={() => {
                        dispatch(
                          setGeneralPrompt({
                            open: true,
                            custom_title: `Are you sure that you want to reset this form?`,
                            continue_callback: async () => {
                              form_instance_otp.reset({
                                ...form_def_val,
                                zip_code: def_zip_code,
                                region_pk: def_region_pk,
                              });
                            },
                          })
                        );
                      }}
                    >
                      Reset
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      variant="contained"
                      size="large"
                      color="secondary"
                      onClick={handleBack}
                      disabled={active_step === 0}
                    >
                      Previous Step
                    </Button>
                  </Grid>
                  <Grid item>
                    <LoadingButton
                      form="form_instance_otp"
                      type="submit"
                      variant="contained"
                      size="large"
                      color="primary"
                    >
                      Next Step
                    </LoadingButton>
                  </Grid>
                </Grid>
              </div>

              {open_otp_dialog && form_payload && (
                <ConsultOtpDialog
                  form_payload={form_payload}
                  open={open_otp_dialog}
                  handleClose={() => {
                    set_open_otp_dialog(false);
                  }}
                  successCallback={() => {
                    set_active_step(0);
                    form_instance_otp.reset();
                    set_open_otp_dialog(false);
                  }}
                />
              )}
            </Container>
          </>
        )
      ) : (
        <BodyLoader />
      )}
    </PageContainerUi>
  );
});

export default ConsultRequestView;

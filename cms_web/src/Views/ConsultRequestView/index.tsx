import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "@material-ui/core";
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
import DefaultValuesActions from "../../Services/Actions/DefaultValuesActions";
import {
  closePageLoading,
  setPageSnackbar,
  showPageLoading,
} from "../../Services/Actions/PageActions";
import CommonApi from "../../Services/Api/CommonApi";
import LibraryApi from "../../Services/Api/LibraryApi";
import ConsultRequestEntity from "../../Services/Entities/ConsultRequestEntity";
import OtpEntity from "../../Services/Entities/OtpEntity";
import { RootStore } from "../../Services/Store";
import ConsultOtpDialog from "./ConsultOtpDialog";
import StepConsultInfo from "./StepConsultInfo";
import StepContactInfo from "./StepContactInfo";
import StepPersonalInfo from "./StepPersonalInfo";
import { StyledConsultRequestView } from "./styles";
interface ConsultRequestViewProps {}

export const ConsultRequestView: FC<ConsultRequestViewProps> = memo(() => {
  const theme = useTheme();
  const dispatch = useDispatch();

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

  //otp states

  if (active_step === 0) {
    validate_lab_req_form = yup.object({
      first_name: yup.string().required().label("First Name"),
      middle_name: yup.string().label("Middle Name"),
      last_name: yup.string().required().label("Last Name"),
      suffix: yup.string().label("Suffix"),
      prefix: yup.string().label("Prefix"),
      gender: yup.string().required().label("Gender"),
      birth_date: yup.date().nullable().required().label("Date of Birth"),
      cs_pk: yup.string().required().label("Civil Status"),
      nat_pk: yup.string().required().label("Nationality"),
      rel_pk: yup.string().required().label("Religion"),
    });
  } else if (active_step === 1) {
    validate_lab_req_form = yup.object({
      mob_no: yup
        .string()
        .required()
        .label("Mobile Number")
        .matches(
          /^(\+639)\d{9}$/,
          "Mobile number must be a valid philippine mobile number"
        ),
      email: yup.string().required().email().label("Email Address"),
      line1: yup.string().required().label("Building/Lot/Block"),
      line2: yup.string().required().label("Street/Subd."),
      region_pk: yup.string().required().label("Region"),
      prov_pk: yup.string().required().label("Province"),
      citymun_pk: yup.string().required().label("City/Municipality"),
      brgy_pk: yup.string().required().label("Barangay"),
      zip_code: yup.string().required().label("Zip Code"),
    });
  } else if (active_step === 2) {
    validate_lab_req_form = yup.object({
      chief_complaint: yup.string().required().label("Chief Complaint"),
      symptoms: yup.string().required().label("Symptoms"),
      notes: yup.string().label("Notes"),
    });
  }

  const form_instance_otp = useForm<any>({
    resolver: yupResolver(validate_lab_req_form),
    mode: "onChange",
    defaultValues: {
      first_name: "",
      middle_name: "",
      last_name: "",
      suffix: "",
      prefix: "",
      gender: "",
      birth_date: "",
      cs_pk: "",
      nat_pk: "",
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
    },
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
          set_form_payload(data);
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

      if (
        region_response.success &&
        nationality_response.success &&
        religion_response.success
      ) {
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
    dispatch(DefaultValuesActions.setHospitalLogoAction());
    dispatch(DefaultValuesActions.setHospitalNameAction());
  }, [dispatch]);

  return (
    <div
      style={{
        // marginTop: `1em`,
        // minHeight: `100vh`,
        width: `100%`,
        display: `grid`,
        alignItems: `center`,
        alignSelf: `center`,
        justifyItems: `center`,
      }}
    >
      {fetch_hospital_name || fetch_hospital_logo ? (
        <BodyLoader />
      ) : !loading_initial_data ? (
        !!error_message ? (
          <Alert>{error_message}</Alert>
        ) : (
          <StyledConsultRequestView
            maxWidth="md"
            theme={theme}
            // className="panel-container"
          >
            <div className="header-ctnr">
              <CustomAvatar
                className="brand-logo"
                src={hospital_logo}
                alt={hospital_name?.charAt(0)}
                isBlob={true}
                spacing={10}
              />
              <div className="brand-name">{hospital_name}</div>
              <div className="app-name">Diagnostic Drive Thru</div>
            </div>
            <div className="main-title">Consultation Request Form</div>
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
                        View: <StepConsultInfo step={active_step} />,
                      },
                    ]}
                  />
                </form>
              </FormProvider>
            </div>

            <div className="actions">
              <Button
                variant="contained"
                size="large"
                color="secondary"
                onClick={handleBack}
              >
                Back
              </Button>
              <LoadingButton
                form="form_instance_otp"
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                // loading={generating_otp}
              >
                {/* {generating_otp ? "Generating OTP" : "Next"} */}
                Next
              </LoadingButton>
            </div>

            {open_otp_dialog && form_payload && (
              <ConsultOtpDialog
                form_payload={form_payload}
                open={open_otp_dialog}
                handleClose={() => {
                  set_active_step(0);
                  form_instance_otp.reset();
                  set_open_otp_dialog(false);
                }}
              />
            )}
          </StyledConsultRequestView>
        )
      ) : (
        <BodyLoader />
      )}
    </div>
  );
});

export default ConsultRequestView;

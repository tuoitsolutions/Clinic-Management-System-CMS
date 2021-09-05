import { yupResolver } from "@hookform/resolvers/yup";
import { Grid } from "@material-ui/core";
import moment from "moment";
import React, { FC, memo, useCallback, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import * as yup from "yup";
import BodyLoader from "../../Component/BodyLoader";
import FormDialog from "../../Component/FormDialog/FormDialog";
import TextFieldHookForm from "../../Component/HookForm/TextFieldHookForm";
import LoadingButton from "../../Component/LoadingButton";
import useFormData from "../../Hooks/useFormData";
import {
  closePageLoading,
  setGeneralPrompt,
  setPageSnackbar,
  showPageLoading,
} from "../../Services/Actions/PageActions";
import CommonApi from "../../Services/Api/CommonApi";
import ConsultRequestApi from "../../Services/Api/ConsultRequestApi";
import ConsultRequestEntity from "../../Services/Entities/ConsultRequestEntity";
import OtpEntity from "../../Services/Entities/OtpEntity";

interface IConsultOtpDialog {
  form_payload: ConsultRequestEntity;
  open: boolean;
  handleClose: () => void;
  successCallback: () => void;
}

const form_otp_validation = yup.object({
  otp_code: yup.string().required().label("OTP Code"),
});

export const ConsultOtpDialog: FC<IConsultOtpDialog> = memo(
  ({ form_payload, open, handleClose, successCallback }) => {
    const dispatch = useDispatch();

    const [submitting_request, set_submitting_request] = useState(false);
    const [generating_otp, set_generating_otp] = useState(false);

    const form_instance_consult = useForm<any>({
      resolver: yupResolver(form_otp_validation),
      mode: "onChange",
      defaultValues: {
        otp_code: "",
      },
    });

    const handleResendOtp = useCallback(async () => {
      set_generating_otp(true);
      dispatch(
        showPageLoading({
          show: true,
          loading_message: "Generating OTP number, thank you for your patience",
        })
      );

      const otp_payload: OtpEntity = {
        mob_no: form_payload.mob_no,
        user_pk: form_payload.email,
      };

      const response = await CommonApi.GenerateOtp(otp_payload);
      set_generating_otp(false);
      dispatch(closePageLoading());
      dispatch(
        setPageSnackbar(
          response?.message?.toString(),
          response.success ? "success" : "error"
        )
      );
    }, [dispatch, form_payload]);

    const handleSubmitForm = useCallback(
      async (form_data: ConsultRequestEntity) => {
        form_payload.otp_code = form_data.otp_code;
        form_payload.birth_date = moment(form_payload.birth_date).format();

        const payload = new FormData();
        useFormData.convertModelToFormData(form_payload, payload);

        form_payload?.attach_req_files?.forEach((f) => {
          payload.append("attach_req_files", f);
        });

        payload.append("attach_profile_pic", form_payload?.attach_profile_pic);

        dispatch(
          setGeneralPrompt({
            open: true,
            custom_title: `Are you sure that you want to continue this consultation request?`,
            continue_callback: async () => {
              dispatch(
                showPageLoading({
                  show: true,
                  loading_message:
                    "Saving consultation request, thank you for your patience",
                })
              );

              set_submitting_request(true);
              const response = await ConsultRequestApi.InsertConsultRequest(
                payload
              );
              set_submitting_request(false);

              dispatch(closePageLoading());
              dispatch(
                setPageSnackbar(
                  response?.message?.toString(),
                  response.success ? "success" : "error"
                )
              );
              if (response.success) {
                form_instance_consult.reset();
                successCallback();
              }
            },
          })
        );
      },
      [dispatch, form_instance_consult, form_payload, successCallback]
    );
    return (
      <>
        <FormDialog
          open={open}
          title="One-Time Passcode (OTP) Verification"
          minWidth={500}
          handleClose={() => handleClose()}
          body={
            <div style={{ padding: `1em 2em` }}>
              <FormProvider {...form_instance_consult}>
                <form
                  onSubmit={form_instance_consult.handleSubmit(
                    handleSubmitForm
                  )}
                  noValidate
                  id="form_instance_consult"
                >
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <div
                        style={{
                          fontSize: `.8em`,
                          fontWeight: 400,
                          color: `#333`,
                          marginBottom: `1em`,
                        }}
                      >
                        <p>
                          Please check the{" "}
                          <b>
                            one time passcode that is sent to your mobile number
                          </b>
                          . It will only be <b>valid within 5 minutes</b>.
                        </p>
                        <p>
                          If expired, we can give you a new OTP after clicking
                          the 'RESEND OTP' button.
                        </p>
                      </div>
                    </Grid>
                    <Grid item xs={12}>
                      <TextFieldHookForm
                        label="One-time Pass Code"
                        name="otp_code"
                        placeholder="Please enter the One-Time Passcode here..."
                        fullWidth
                        InputLabelProps={{
                          shrink: true,
                        }}
                        required
                      />
                    </Grid>
                  </Grid>
                </form>
              </FormProvider>
            </div>
          }
          actions={
            <>
              <LoadingButton
                variant="contained"
                handleClick={handleResendOtp}
                loading={generating_otp}
                color="secondary"
                type="button"
              >
                {generating_otp ? "Generating OTP" : "Resend OTP"}
              </LoadingButton>
              <LoadingButton
                type="submit"
                form="form_instance_consult"
                loading={submitting_request}
                variant="contained"
                color="primary"
              >
                {submitting_request ? "Submitting" : "Continue"}
              </LoadingButton>
            </>
          }
        />
      </>
    );
  }
);

export default ConsultOtpDialog;

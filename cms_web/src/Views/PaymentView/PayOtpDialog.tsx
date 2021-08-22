import { yupResolver } from "@hookform/resolvers/yup";
import { Grid } from "@material-ui/core";
import React, { FC, memo, useCallback, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import * as yup from "yup";
import FormDialog from "../../Component/FormDialog/FormDialog";
import TextFieldHookForm from "../../Component/HookForm/TextFieldHookForm";
import LoadingButton from "../../Component/LoadingButton";
import {
  closePageLoading,
  setGeneralPrompt,
  setPageSnackbar,
  showPageLoading,
} from "../../Services/Actions/PageActions";
import ConsultRequestApi from "../../Services/Api/ConsultRequestApi";
import OtpEntity from "../../Services/Entities/OtpEntity";

interface IPayOtpDialog {
  hash_key: string;
  open: boolean;
  verifiedCallback: () => void;
}

const form_otp_validation = yup.object({
  otp_code: yup.string().required().label("OTP Code"),
});

const PayOtpDialog: FC<IPayOtpDialog> = memo(
  ({ open, hash_key, verifiedCallback }) => {
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
      const otp_payload: OtpEntity = {
        consult_req_pk: hash_key,
      };

      dispatch(
        setGeneralPrompt({
          open: true,
          custom_title: `Are you sure that you want to generate a new OTP for this payment link?`,
          continue_callback: async () => {
            dispatch(
              showPageLoading({
                show: true,
                loading_message:
                  "Generating a new OTP, thank you for your patience",
              })
            );

            set_generating_otp(true);
            const response = await ConsultRequestApi.ResendPayOtp(otp_payload);
            set_generating_otp(false);

            dispatch(closePageLoading());
            dispatch(
              setPageSnackbar(
                response?.message?.toString(),
                response.success ? "success" : "error"
              )
            );
            // if (response.success) {
            //   form_instance_consult.reset();
            // }
          },
        })
      );
    }, [dispatch, hash_key]);

    const handleSubmitForm = useCallback(
      async (form_data: OtpEntity) => {
        const otp_payload: OtpEntity = {
          ...form_data,
          consult_req_pk: hash_key,
        };

        dispatch(
          showPageLoading({
            show: true,
            loading_message:
              "Verifying OTP for this payment link, thank you for your patience",
          })
        );

        set_submitting_request(true);
        const response = await ConsultRequestApi.VerifyPayOtp(otp_payload);
        set_submitting_request(false);

        dispatch(closePageLoading());
        dispatch(
          setPageSnackbar(
            response?.message?.toString(),
            response.success ? "success" : "error"
          )
        );

        if (response.success) {
          if (typeof verifiedCallback === "function") {
            verifiedCallback();
          }
        }
      },
      [dispatch, hash_key, verifiedCallback]
    );
    return (
      <>
        <FormDialog
          open={open}
          title="One-Time Passcode (OTP) Verification"
          minWidth={500}
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
                          . It will only be <b>valid within 10 minutes</b>.
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
                disabled={generating_otp || submitting_request}
              >
                {generating_otp ? "Generating OTP" : "Resend OTP"}
              </LoadingButton>
              <LoadingButton
                type="submit"
                form="form_instance_consult"
                loading={submitting_request}
                variant="contained"
                color="primary"
                disabled={generating_otp || submitting_request}
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

export default PayOtpDialog;

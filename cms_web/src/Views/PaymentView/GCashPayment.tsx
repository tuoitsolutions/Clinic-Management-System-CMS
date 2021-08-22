import { yupResolver } from "@hookform/resolvers/yup";
import { Button, FormHelperText, Grid } from "@material-ui/core";
import React, { FC, memo, useCallback } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import * as yup from "yup";
import TextFieldHookForm from "../../Component/HookForm/TextFieldHookForm";
import MaskedPhoneNumber from "../../Component/Mask/MaskedPhoneNumber";
import { PAYMONG_SERVER_URL } from "../../Helpers/AppConfig";
import HelpNumber from "../../Helpers/HelpNumber";
import {
  closePageLoading,
  setGeneralPrompt,
  setPageSnackbar,
  showPageLoading,
} from "../../Services/Actions/PageActions";
import PaymongoApi from "../../Services/Api/PaymongoApi";
import ConsultRequestEntity from "../../Services/Entities/ConsultRequestEntity";
interface IGCashPayment {
  selected_consult_req: ConsultRequestEntity;
}

const form_schema = yup.object({
  cvc: yup.string().nullable().label("CVC"),
  phone: yup.string().nullable().label("Phone"),
  email: yup.string().nullable().label("Email"),
  line1: yup.string().nullable().label("Line 1"),
  line2: yup.string().nullable().label("Line 2"),
  state: yup.string().nullable().label("State"),
  postal_code: yup.string().nullable().label("Postal Code"),
  city: yup.string().nullable().label("City"),
  country: yup.string().nullable().label("Country"),
});

const GCashPayment: FC<IGCashPayment> = memo(({ selected_consult_req }) => {
  const dispatch = useDispatch();
  const form_instance = useForm<any>({
    resolver: yupResolver(form_schema),
    mode: "onChange",
    defaultValues: {
      name: `${selected_consult_req?.first_name} ${selected_consult_req?.middle_name} ${selected_consult_req?.last_name} ${selected_consult_req?.suffix}`,
      email: selected_consult_req.email,
      phone: selected_consult_req.mob_no,
      line1: selected_consult_req.line1,
      line2: `${selected_consult_req.line2}, ${selected_consult_req.barangaydesc}`,
      state: selected_consult_req.provincedesc,
      postal_code: selected_consult_req.zip_code,
      city: selected_consult_req.citymundesc,
      country: "PH",
    },
  });

  const handleSubmitForm = useCallback(
    async (form_values) => {
      dispatch(
        setGeneralPrompt({
          open: true,
          custom_title: `Are you sure that you want to continue the payment?`,
          continue_callback: async () => {
            dispatch(
              showPageLoading({
                show: true,
                loading_message:
                  "Processing GCash Payment, thank you for your patience",
              })
            );

            let consult_cost = HelpNumber.StringToDecimal(
              HelpNumber.NumberToMoney(selected_consult_req.consult_cost),
              "."
            );

            consult_cost = HelpNumber.StringToDecimal(consult_cost, ",");

            const payload = {
              consult_req_pk: selected_consult_req.consult_req_pk,
              type: "gcash",
              currency: "PHP",
              amount: consult_cost,
              billing: {
                name: form_values?.name,
                phone: form_values?.phone,
                email: form_values?.email,
                address: {
                  line1: form_values?.line1,
                  line2: form_values?.line2,
                  state: form_values?.state,
                  postal_code: form_values?.postal_code,
                  country: form_values?.country,
                  city: form_values?.city,
                },
              },
              redirect: {
                success: `${PAYMONG_SERVER_URL}payment/success`,
                failed: `${PAYMONG_SERVER_URL}payment/failed`,
              },
            };
            const response = await PaymongoApi.EWalletCreateSource(payload);
            dispatch(closePageLoading());

            if (response.success) {
              if (!!response.data) {
                dispatch(
                  setPageSnackbar(response.message.toString(), "success")
                );
                window.location.href = response.data.toString();
              }
            } else {
              if (!!response.paymongo_errors) {
                if (response.paymongo_errors instanceof Array) {
                  response.paymongo_errors.forEach((err) => {
                    dispatch(
                      setPageSnackbar(`${err.code}: ${err.detail}`, "error")
                    );
                  });
                }
              }

              if (!!response.message) {
                dispatch(setPageSnackbar(response.message.toString(), "error"));
              }
            }
          },
        })
      );
    },
    [dispatch, selected_consult_req]
  );

  return (
    <>
      <FormProvider {...form_instance}>
        <form
          onSubmit={form_instance.handleSubmit(handleSubmitForm)}
          noValidate
          id="form_instance"
        >
          <div>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <div className="cntr-title">
                  <div className="sub">
                    The requestor's basic details is automatically loaded as the
                    billing information. You can change it as desired.
                  </div>
                </div>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextFieldHookForm
                  name="name"
                  label="Name"
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                  placeholder="Name of billing information"
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextFieldHookForm
                  name="phone"
                  label="Phone Number"
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                  placeholder="Phone number of billing information"
                  InputProps={{
                    inputComponent: MaskedPhoneNumber,
                  }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextFieldHookForm
                  name="email"
                  label="Email Address"
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                  placeholder="Email of billing information"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextFieldHookForm
                  name="line1"
                  label="Line 1"
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                  placeholder="Line1 of the billing address information"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextFieldHookForm
                  name="line2"
                  label="Line 2"
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                  placeholder="Line2 of the billing address information"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextFieldHookForm
                  name="state"
                  label="State"
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                  placeholder="State of the billing address information"
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextFieldHookForm
                  name="postal_code"
                  label="Postal Code"
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                  placeholder="Postal Code of the billing address information"
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextFieldHookForm
                  name="city"
                  label="City"
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                  placeholder="City of the billing address information"
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <TextFieldHookForm
                  name="country"
                  label="Country"
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                  disabled
                  placeholder="Country of the billing address information"
                />
              </Grid>

              <Grid item xs={12}>
                <div style={{ marginTop: `1em` }}>
                  <Grid container justify="flex-end">
                    <Grid item>
                      <Button
                        size="large"
                        type="submit"
                        variant="contained"
                        color="primary"
                      >
                        Pay GCash
                      </Button>
                    </Grid>
                  </Grid>
                </div>
              </Grid>
            </Grid>
          </div>
        </form>
      </FormProvider>
    </>
  );
});

export default GCashPayment;

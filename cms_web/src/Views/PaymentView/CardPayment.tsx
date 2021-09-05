import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Grid } from "@material-ui/core";
import moment from "moment";
import React, { FC, memo, useCallback, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import * as yup from "yup";
import DateFieldHookForm from "../../Component/HookForm/DateFieldHookForm";
import TextFieldHookForm from "../../Component/HookForm/TextFieldHookForm";
import MaskedCard from "../../Component/Mask/MaskedCard";
import MaskedPhoneNumber from "../../Component/Mask/MaskedPhoneNumber";
import { PAYMONG_SERVER_URL } from "../../Helpers/AppConfig";
import HelpNumber from "../../Helpers/HelpNumber";
import { StringEmptyToDefault } from "../../Hooks/UseStringFormatter";
import {
  closePageLoading,
  setGeneralPrompt,
  setPageSnackbar,
  showPageLoading,
} from "../../Services/Actions/PageActions";
import PaymongoApi from "../../Services/Api/PaymongoApi";
import ConsultRequestEntity from "../../Services/Entities/ConsultRequestEntity";
import PaymongoModel, {
  PaymentIntentAttachModel,
} from "../../Services/Models/PaymongoModel";
import Card3dSecureDialog from "./Card3dSecureDialog";
interface ICardPayment {
  selected_consult_req: ConsultRequestEntity;
}

const form_schema = yup.object({
  card_number: yup
    .string()
    .required()
    .nullable()
    .label("Card Number")
    .test("Card Number", "Card Number is not valid", function (ccNum: string) {
      // ccNum = ccNum.replaceAll(" ", "");
      // var cardRegex =
      //   /^6(?:011\d{12}|5\d{14}|4[4-9]\d{13}|22(?:1(?:2[6-9]|[3-9]\d)|[2-8]\d{2}|9(?:[01]\d|2[0-5]))\d{10})$/;

      var cardRegex = /^\d\d\d\d \d\d\d\d \d\d\d\d \d\d\d\d$/;

      if (cardRegex.test(ccNum)) {
        return true;
      } else {
        return false;
      }
    }),
  exp_month: yup
    .date()
    .typeError("Expiry Month is not valid")
    .required()
    .nullable()
    .label("Expiry Month"),
  exp_year: yup
    .date()
    .typeError("Expiry Year is not valid")
    .required()
    .nullable()
    .label("Expiry Year"),
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

const CardPayment: FC<ICardPayment> = memo(({ selected_consult_req }) => {
  const dispatch = useDispatch();

  const [payment_intent_attach, set_payment_intent_attach] =
    useState<PaymentIntentAttachModel | null>();

  const [open_3d_secure_dialog, set_open_3d_secure_dialog] =
    useState<boolean>(false);

  const form_instance = useForm<any>({
    resolver: yupResolver(form_schema),
    mode: "onChange",
    defaultValues: {
      name: `${StringEmptyToDefault(
        selected_consult_req?.first_name,
        ""
      )} ${StringEmptyToDefault(selected_consult_req?.last_name, "")}`,
      email: selected_consult_req.email,
      phone: selected_consult_req.mob_no,
      line1: StringEmptyToDefault(selected_consult_req?.line1, ""),
      line2: StringEmptyToDefault(selected_consult_req?.line2, ""),
      state: selected_consult_req.provincedesc,
      postal_code: selected_consult_req.zip_code,
      city: selected_consult_req.citymundesc,
      country: "PH",
      card_number: "",
      exp_month: "",
      exp_year: "",
      cvc: "",
      // card_number: "4120 0000 0000 0007",
      // exp_month: new Date(),
      // exp_year: new Date(),
      // cvc: "123",
    },
  });

  const handleSubmitForm = useCallback(
    async (form_values: any) => {
      form_values.card_number = form_values.card_number.replaceAll(" ", "");
      form_values.exp_month = moment(form_values.exp_month).format("MM");
      form_values.exp_year = moment(form_values.exp_year).format("YY");

      dispatch(
        setGeneralPrompt({
          open: true,
          custom_title: `Are you sure that you want to continue the payment?`,
          continue_callback: async () => {
            dispatch(
              showPageLoading({
                show: true,
                loading_message:
                  "Processing Credit/Debit Card Payment, thank you for your patience",
              })
            );

            let consult_cost = HelpNumber.StringToDecimal(
              HelpNumber.NumberToMoney(selected_consult_req.consult_cost),
              "."
            );

            consult_cost = HelpNumber.StringToDecimal(consult_cost, ",");

            //create payment intent
            // send the client_key of the response to the client-side
            //create payment method

            const payload_pay_intent = {
              consult_req_pk: selected_consult_req.consult_req_pk,
              amount: consult_cost,
              payment_method_allowed: ["card"],
              payment_method_options: {
                card: {
                  request_three_d_secure: "any",
                },
              },
              description: `Online consultation payment intent for ${selected_consult_req.consult_req_pk}`,
              statement_descriptor: `Payment Intent ${selected_consult_req.consult_req_pk}`,
              currency: "PHP",
              metadata: {
                consult_req_pk: selected_consult_req.consult_req_pk,
              },
            };

            const create_pay_intent_res = await PaymongoApi.CreatePaymentIntent(
              payload_pay_intent
            );

            if (create_pay_intent_res.success) {
              if (!!create_pay_intent_res.data) {
                const pay_intent_data = create_pay_intent_res.data;
                const payment_intent_id = pay_intent_data.id;
                const public_key = pay_intent_data?.public_key;

                console.log(`pay_intent_data`, pay_intent_data);
                const payment_intent_client_key =
                  pay_intent_data?.attributes?.client_key;

                const payload_paymongo_pay_method: PaymongoModel = {
                  data: {
                    attributes: {
                      type: "card",
                      details: {
                        card_number: form_values.card_number,
                        exp_month: parseInt(form_values.exp_month),
                        exp_year: parseInt(form_values.exp_year),
                        cvc: form_values.cvc,
                      },
                      billing: {
                        address: {
                          line1: form_values.line1,
                          line2: form_values.line2,
                          city: form_values.city,
                          state: form_values.state,
                          postal_code: form_values.postal_code,
                          country: form_values.country,
                        },
                        email: form_values.email,
                        name: form_values.name,
                        phone: form_values.phone,
                      },

                      // metadata: {
                      //   consult_req_pk: selected_consult_req.consult_req_pk,
                      // },
                    },
                  },
                };

                const payment_method_res =
                  await PaymongoApi.CreatePaymongoPaymentMethod(
                    payload_paymongo_pay_method,
                    public_key
                  );

                if (payment_method_res.success) {
                  const pay_method_data = payment_method_res.data.data;
                  const pay_method_id: string = pay_method_data.id;
                  // console.log(`pay_method_id`, pay_method_data, pay_method_id);

                  const attach_pay_method_res =
                    await PaymongoApi.AttachPaymentIntent(
                      payment_intent_client_key,
                      pay_method_id,
                      public_key
                    );

                  if (attach_pay_method_res.success) {
                    console.log(`attach_pay_method_res`, attach_pay_method_res);

                    const attach_pay_method_data =
                      attach_pay_method_res?.data?.data;
                    const payment_intent_status =
                      attach_pay_method_data?.attributes?.status;

                    if (payment_intent_status === "awaiting_next_action") {
                      set_payment_intent_attach({
                        payment_intent_client_key: payment_intent_client_key,
                        pay_method_id: pay_method_id,
                        public_key: public_key,
                        secure_3d_link:
                          attach_pay_method_data?.attributes?.next_action
                            ?.redirect?.url,
                      });
                      set_open_3d_secure_dialog(true);
                    } else if (payment_intent_status === "succeeded") {
                      console.log(
                        ` You already received your customer's payment. You can show a success message from this condition.`
                      );

                      window.location.href = `${PAYMONG_SERVER_URL}payment/success`;
                    } else if (
                      payment_intent_status === "awaiting_payment_method"
                    ) {
                      console.log(
                        ` The PaymentIntent encountered a processing error. You can refer to paymentIntent.attributes.last_payment_error to check the error and render the appropriate error message.`
                      );
                      window.location.href = `${PAYMONG_SERVER_URL}payment/failed`;
                    } else if (payment_intent_status === "processing") {
                      console.log(
                        ` You need to requery the PaymentIntent after a second or two. This is a transitory status and should resolve to succeeded or awaiting_payment_method quickly.`
                      );
                    }
                  } else {
                    if (
                      attach_pay_method_res?.paymongo_errors instanceof Array
                    ) {
                      attach_pay_method_res?.paymongo_errors.forEach((err) => {
                        dispatch(
                          setPageSnackbar(`${err.code}: ${err.detail}`, "error")
                        );
                      });
                    } else {
                      dispatch(
                        setPageSnackbar(
                          attach_pay_method_res.message.toString(),
                          "error"
                        )
                      );
                    }
                  }
                } else {
                  console.log(`payment_method_res error`, payment_method_res);
                  if (payment_method_res?.paymongo_errors instanceof Array) {
                    payment_method_res?.paymongo_errors.forEach((err) => {
                      dispatch(
                        setPageSnackbar(`${err.code}: ${err.detail}`, "error")
                      );
                    });
                  } else {
                    dispatch(
                      setPageSnackbar(
                        payment_method_res.message.toString(),
                        "error"
                      )
                    );
                  }
                }
              }
            } else {
              if (!!create_pay_intent_res.paymongo_errors) {
                if (create_pay_intent_res.paymongo_errors instanceof Array) {
                  create_pay_intent_res.paymongo_errors.forEach((err) => {
                    dispatch(
                      setPageSnackbar(`${err.code}: ${err.detail}`, "error")
                    );
                  });
                }
              }

              console.log(`create_pay_intent_res error`, create_pay_intent_res);
              if (!!create_pay_intent_res.message) {
                dispatch(
                  setPageSnackbar(
                    create_pay_intent_res.message.toString(),
                    "error"
                  )
                );
              }
            }

            dispatch(closePageLoading());
          },
        })
      );
    },
    [dispatch, selected_consult_req]
  );

  return (
    <div>
      <FormProvider {...form_instance}>
        <form
          onSubmit={form_instance.handleSubmit(handleSubmitForm)}
          noValidate
          id="form_instance"
        >
          <div>
            <Grid container spacing={6}>
              <Grid item xs={12} md={7}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <div className="ctnr-title">
                      <div className="main">Billing Details</div>
                      <div className="sub">
                        The requestor's basic details is automatically loaded as
                        the billing information. You can change it as desired.
                      </div>
                    </div>
                  </Grid>
                  <Grid item xs={12} md={8}>
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
                  <Grid item xs={12} md={4}>
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
                  <Grid item xs={12} md={6}>
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

                  <Grid item xs={12}>
                    <Grid container spacing={3}>
                      <Grid item xs={12}>
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
                      <Grid item xs={12}>
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
                      <Grid item xs={12} md={5}>
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
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={12} md={5}>
                <div
                  style={{
                    padding: `1em`,
                    backgroundColor: `#fafafa5f`,
                    paddingTop: 0,
                    borderRadius: 5,
                  }}
                >
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <div className="ctnr-title">
                        <div className="main">Card Details</div>
                        <div className="sub">
                          Kindly fill up the card details.
                        </div>
                      </div>
                    </Grid>

                    <Grid item xs={12}>
                      <TextFieldHookForm
                        name="card_number"
                        label="Card Number"
                        fullWidth
                        InputLabelProps={{
                          shrink: true,
                        }}
                        required
                        InputProps={{
                          inputComponent: MaskedCard,
                        }}
                      />
                    </Grid>

                    <Grid item xs={6}>
                      <DateFieldHookForm
                        name="exp_month"
                        label="Exp. Month"
                        fullWidth
                        InputLabelProps={{
                          shrink: true,
                        }}
                        type="month"
                        required
                      />
                    </Grid>

                    <Grid item xs={6}>
                      <DateFieldHookForm
                        name="exp_year"
                        label="Exp. Year"
                        fullWidth
                        InputLabelProps={{
                          shrink: true,
                        }}
                        type="year"
                        required
                        format="yy"
                        placeholder="YY"
                      />
                    </Grid>

                    <Grid item xs={6}>
                      <TextFieldHookForm
                        name="cvc"
                        label="CVC"
                        fullWidth
                        InputLabelProps={{
                          shrink: true,
                        }}
                        required
                        type="numberonly"
                      />
                    </Grid>
                  </Grid>
                </div>
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
                        Pay Credit/Debit Card
                      </Button>
                    </Grid>
                  </Grid>
                </div>
              </Grid>
            </Grid>
          </div>
        </form>
      </FormProvider>

      {!!payment_intent_attach && (
        <Card3dSecureDialog
          open={open_3d_secure_dialog}
          handleClose={() => set_open_3d_secure_dialog(false)}
          payment_intent_attach={payment_intent_attach}
          hash_key={selected_consult_req?.hash_key}
        />
      )}
    </div>
  );
});

export default CardPayment;

import { AppBar } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { useTheme } from "@material-ui/styles";
import React, { FC, memo, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import BodyLoader from "../../Component/BodyLoader";
import CustomAvatar from "../../Component/CustomAvatar";
import CustomTab from "../../Component/CustomTabs";
import { APP_NAME } from "../../Helpers/AppConfig";
import HelpNumber from "../../Helpers/HelpNumber";
import { InvalidDateTimeToDefault } from "../../Hooks/UseDateParser";
import DefaultValuesActions from "../../Services/Actions/DefaultValuesActions";
import ConsultRequestApi from "../../Services/Api/ConsultRequestApi";
import ConsultRequestEntity from "../../Services/Entities/ConsultRequestEntity";
import { RootStore } from "../../Services/Store";
import CardPayment from "./CardPayment";
import GCashPayment from "./GCashPayment";
import GrabPayPayment from "./GrabPayPayment";
import PayOtpDialog from "./PayOtpDialog";
import { StyledPaymentView } from "./styles";
interface PaymentViewProps {}

export const PaymentView: FC<PaymentViewProps> = memo(() => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { hash_key } = useParams();

  const {
    hospital_name,
    fetch_hospital_name,
    hospital_logo,
    fetch_hospital_logo,
  } = useSelector((store: RootStore) => store.DefaultValuesReducer);

  const handleSubmitForm = useCallback(async (data) => {}, []);

  const [error_message, set_error_message] = useState("");

  const [is_pay_link_expired, set_is_pay_link_expired] = useState(true);
  const [fetch_is_pay_link_expired, set_fetch_is_pay_link_expired] =
    useState(true);

  const [is_otp_verified, set_is_otp_verified] = useState(false);
  const [is_otp_verified_counter, set_is_otp_verified_counter] = useState(0);
  const [fetch_is_otp_verified, set_fetch_is_otp_verified] = useState(true);

  const [selected_consult_req, set_selected_consult_req] =
    useState<null | ConsultRequestEntity>(null);
  const [selected_consult_req_counter, set_selected_consult_req_counter] =
    useState(0);
  const [fetch_selected_consult_req, set_fetch_selected_consult_req] =
    useState(true);

  const handleRecheckOtpVerified = useCallback(() => {
    set_is_otp_verified_counter((c) => c + 1);
  }, []);

  useEffect(() => {
    let mounted = true;
    const fetch_data = async () => {
      set_fetch_is_pay_link_expired(true);
      const response = await ConsultRequestApi.IsPayLinkExpired(hash_key);
      if (response.success) {
        set_is_pay_link_expired(false);
      } else {
        set_is_pay_link_expired(true);
        set_error_message(response.message.toString());
      }
      set_fetch_is_pay_link_expired(false);
    };
    mounted && fetch_data();
    return () => {
      mounted = false;
    };
  }, [hash_key]);

  useEffect(() => {
    let mounted = true;
    const fetch_data = async () => {
      set_fetch_is_otp_verified(true);
      const response = await ConsultRequestApi.IsPayOtpVerified(hash_key);
      if (response.success) {
        if (response.data.toString() == "y") {
          set_is_otp_verified(true);
        } else {
          set_is_otp_verified(false);
        }
      } else {
        set_error_message(response.message.toString());
      }
      set_fetch_is_otp_verified(false);
    };
    mounted && !is_pay_link_expired && fetch_data();
    return () => {
      mounted = false;
    };
  }, [hash_key, is_pay_link_expired, is_otp_verified_counter]);

  useEffect(() => {
    let mounted = true;
    const fetch_data = async () => {
      set_fetch_selected_consult_req(true);
      const response = await ConsultRequestApi.GetConsultReqByPk(hash_key);
      if (response.success) {
        set_selected_consult_req(response.data);
      } else {
        mounted && set_error_message(response.message.toString());
      }
      mounted && set_fetch_selected_consult_req(false);
    };
    mounted && !is_pay_link_expired && is_otp_verified && fetch_data();
    return () => {
      mounted = false;
    };
  }, [hash_key, is_pay_link_expired, is_otp_verified_counter, is_otp_verified]);

  useEffect(() => {
    dispatch(DefaultValuesActions.setHospitalLogoAction());
    dispatch(DefaultValuesActions.setHospitalNameAction());
  }, [dispatch]);

  return (
    <div
      style={{
        width: `100%`,
        display: `grid`,
        alignItems: `center`,
        alignSelf: `center`,
        justifyItems: `center`,
      }}
    >
      {fetch_hospital_name || fetch_hospital_logo ? (
        <BodyLoader />
      ) : !!error_message ? (
        <Alert>{error_message}</Alert>
      ) : (
        <>
          <StyledPaymentView maxWidth="lg" theme={theme}>
            <AppBar className="header-ctnr">
              <CustomAvatar
                className="brand-logo"
                src={hospital_logo}
                alt={hospital_name?.charAt(0)}
                isBlob={true}
                spacing={10}
              />
              <div className="brand-name">{hospital_name}</div>
              <div className="app-name">{APP_NAME}</div>
            </AppBar>

            <div className="top-margin"></div>

            {!fetch_is_pay_link_expired ? (
              !is_pay_link_expired &&
              (!fetch_is_otp_verified ? (
                is_otp_verified ? (
                  !fetch_selected_consult_req ? (
                    !!selected_consult_req &&
                    (selected_consult_req.sts_pk === "fa" ||
                    !selected_consult_req?.pay_at ||
                    !selected_consult_req?.paymongo_paid_at ? (
                      <>
                        <div className="pay-title-ctnr">
                          <div className="pay-title">
                            <div className="main">Statement of Account</div>
                            <div className="sub-title">
                              This link is only available within 24 hours,
                              kindly complete your transaction beforehand.
                            </div>
                          </div>
                        </div>
                        <div className="pay-body-ctnr">
                          <div className="pay-method-ctnr">
                            <div className="body-title">
                              Select a Payment Method
                            </div>

                            <div className="tabs">
                              <CustomTab
                                // height={500}
                                tabs={[
                                  {
                                    title: "Credit/Debit Card",
                                    RenderComponent: (
                                      <CardPayment
                                        selected_consult_req={
                                          selected_consult_req
                                        }
                                      />
                                    ),
                                  },
                                  {
                                    title: "GCash",
                                    RenderComponent: (
                                      <GCashPayment
                                        selected_consult_req={
                                          selected_consult_req
                                        }
                                      />
                                    ),
                                  },
                                  {
                                    title: "GrabPay",
                                    RenderComponent: (
                                      <GrabPayPayment
                                        selected_consult_req={
                                          selected_consult_req
                                        }
                                      />
                                    ),
                                  },
                                ]}
                              />
                            </div>
                          </div>

                          <div className="pay-soa">
                            <div className="body-title">
                              Consultation Summary
                            </div>

                            <div className="pay-soa-content">
                              <div className="soa-info-group">
                                <div className="soa-label">
                                  Consult Request Code
                                </div>
                                <div className="soa-value">
                                  {selected_consult_req?.consult_req_pk}
                                </div>
                              </div>
                              <div className="soa-info-group">
                                <div className="soa-label">Requestor Name</div>
                                <div className="soa-value">
                                  {`${selected_consult_req?.first_name} ${selected_consult_req?.middle_name} ${selected_consult_req?.last_name} ${selected_consult_req?.suffix}`}
                                </div>
                              </div>
                              <div className="soa-info-group">
                                <div className="soa-label">Requested On</div>
                                <div className="soa-value">
                                  {InvalidDateTimeToDefault(
                                    selected_consult_req.request_at,
                                    "n/a"
                                  )}
                                </div>
                              </div>

                              <div className="separator"></div>

                              <div className="soa-info-group">
                                <div className="soa-label">
                                  Consultation Cost
                                </div>
                                <div
                                  className="soa-value"
                                  style={{
                                    color: `#4caf50`,
                                    fontWeight: 900,
                                  }}
                                >
                                  &#8369;{" "}
                                  {HelpNumber.NumberToMoney(
                                    selected_consult_req.consult_cost
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <Alert severity="error">
                        This payment page is no longer available.
                        <div style={{ marginTop: `1em`, fontWeight: 400 }}>
                          <small>
                            It could be that the online consultation request has
                            already been paid or has been declined.
                          </small>
                        </div>
                      </Alert>
                    ))
                  ) : (
                    <BodyLoader message="Loading consultation request to pay, thank you for your patience!" />
                  )
                ) : (
                  <PayOtpDialog
                    open={!is_otp_verified}
                    hash_key={hash_key}
                    verifiedCallback={() => {
                      handleRecheckOtpVerified();
                    }}
                  />
                )
              ) : (
                <BodyLoader message="Checking OTP verification, thank you for your patience!" />
              ))
            ) : (
              <BodyLoader message="Verifying payment link, thank you for your patience!" />
            )}
          </StyledPaymentView>
        </>
      )}
    </div>
  );
});

export default PaymentView;

import { AppBar, Container } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { useTheme } from "@material-ui/styles";
import React, { FC, memo, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import BodyLoader from "../../Component/BodyLoader";
import CustomAvatar from "../../Component/CustomAvatar";
import { APP_NAME } from "../../Helpers/AppConfig";
import DefaultValuesActions from "../../Services/Actions/DefaultValuesActions";
import { RootStore } from "../../Services/Store";
import { StyledPaymentView } from "./styles";
interface PaymentFeedbackProps {}

export const PaymentFeedback: FC<PaymentFeedbackProps> = memo(() => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { feedback } = useParams();

  const {
    hospital_name,
    fetch_hospital_name,
    hospital_logo,
    fetch_hospital_logo,
  } = useSelector((store: RootStore) => store.DefaultValuesReducer);

  const [error_message, set_error_message] = useState("");

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

            <Container maxWidth="sm">
              {feedback === "success" && (
                <div>
                  <Alert severity="success">
                    We are glad to inform you that your payment of the Online
                    Consultation Request ) has been processed successfully!
                    <div style={{ marginTop: `1em`, fontWeight: 400 }}>
                      <small>
                        We will send you a feedback in your SMS and email
                        address address once your online payment has been
                        acknowledged. This may take a few minutes. If we do not
                        receive your payment in the duration of one(1) hour,
                        your payment will be refunded to your account.
                      </small>
                    </div>
                  </Alert>
                </div>
              )}

              {feedback === "failed" && (
                <div>
                  <Alert severity="error">
                    We regret to inform your payment has failed!
                    <div style={{ marginTop: `1em`, fontWeight: 400 }}>
                      <small>
                        You can redo the payment process in the payment link
                        that was provided/sent to your email address.
                      </small>
                    </div>
                  </Alert>
                </div>
              )}
            </Container>
          </StyledPaymentView>
        </>
      )}
    </div>
  );
});

export default PaymentFeedback;

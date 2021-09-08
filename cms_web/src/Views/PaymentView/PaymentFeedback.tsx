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
import { PageContainerUi } from "../../Styles/GlobalStyles";
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
    <PageContainerUi theme={theme}>
      {fetch_hospital_name || fetch_hospital_logo ? (
        <BodyLoader />
      ) : !!error_message ? (
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

          <StyledPaymentView
            maxWidth="sm"
            theme={theme}
            style={{ boxShadow: `none`, backgroundColor: `none` }}
          >
            <div className="top-margin"></div>

            {feedback === "success" && (
              <div>
                <Alert severity="success">
                  <h2>
                    We are glad to inform you that the payment of your Online
                    Consultation Request has been processed successfully!
                  </h2>
                  <div style={{ marginTop: `1em` }}>
                    <h3>
                      An eConsultLink will be sent to the provided email address
                      of the consultation. Thank you for your patience.
                    </h3>
                  </div>
                </Alert>
              </div>
            )}

            {feedback === "failed" && (
              <div>
                <Alert severity="error">
                  <h2>
                    We regret to inform you that the payment process for this
                    consultation has failed!
                  </h2>
                  <h3 style={{ marginTop: `1em` }}>
                    You can redo the payment process in the ePayLink that was
                    sent to the provided email address of the consultation. We
                    very much value your time and we humbly apologize to you for
                    having this inconvenience.
                  </h3>
                </Alert>
              </div>
            )}
          </StyledPaymentView>
        </>
      )}
    </PageContainerUi>
  );
});

export default PaymentFeedback;

import { Avatar, Checkbox, FormControlLabel } from "@material-ui/core";
import { useTheme } from "@material-ui/styles";
import clsx from "clsx";
import { Form, Formik, FormikHelpers } from "formik";
import React, { FC, memo, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import tuo_logo from "../../Assets/Images/Logo/tuoLogo1.jpg";
import CustomAvatar from "../../Component/CustomAvatar";
import LoadingButton from "../../Component/LoadingButton";
import { APP_NAME } from "../../Helpers/AppConfig";
import importImagesFromFolder from "../../Helpers/importImagesFromFolder";
import UseInterval from "../../Hooks/UseInterval";
import DefaultValuesActions from "../../Services/Actions/DefaultValuesActions";
import { setCurrentUserAction } from "../../Services/Actions/UserActions";
import UserApi from "../../Services/Api/UserApi";
import { AuthUserPayload } from "../../Services/Payloads/AuthUserPayloads";
import { RootStore } from "../../Services/Store";
import FieldPassword from "./FieldPassword";
import FieldUsername from "./FieldUsername";
import PrivacyPolicy from "./PrivacyPolicyDialog";
import { LoginStyles, StyledImageBackground } from "./styles";

interface ILoginPortal {}

const authFormValues: AuthUserPayload = {
  username: "",
  password: "",
  tos: false,
  rememberme: false,
};

const images: Array<any> = importImagesFromFolder(
  require.context(
    "../../Assets/Images/Login/",
    true,
    /\.(png|jpg|jpe?g|svg|gif)$/
  )
);

const delaySec = 5000;

export const LoginPortal: FC<ILoginPortal> = memo(() => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const {
    fetch_hospital_logo,
    hospital_logo,
    fetch_hospital_name,
    hospital_name,
  } = useSelector((store: RootStore) => store.DefaultValuesReducer);

  const [currentBackground, setCurrentBackground] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authError, setAuthError] = useState("");
  const handleChange = useCallback(() => {
    setCurrentBackground((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, []);

  const handleTogglePassword = useCallback(() => {
    setShowPassword((prevState) => !prevState);
  }, []);

  UseInterval(handleChange, delaySec);

  const handleSubmit = useCallback(
    async (
      values: AuthUserPayload,
      formikHelpers: FormikHelpers<AuthUserPayload>
    ) => {
      setIsAuthenticating(true);
      const response = await UserApi.authUserApi(values);

      console.log(`auth res`, response);
      setIsAuthenticating(false);
      if (response.success) {
        localStorage.setItem(
          APP_NAME,
          JSON.stringify({
            access_token: response.data.access_token,
            refresh_token: response.data.refresh_token,
            rememberme: response.data.rememberme,
          })
        );
        window.location.href = "/dashboard";
        // dispatch(setCurrentUserAction());
      } else {
        if (typeof response.message === "string") {
          setAuthError(response.message);
        }
        // formikHelpers.resetForm();
        formikHelpers.setValues({
          ...values,
          username: "",
          password: "",
        });
      }
    },
    []
  );

  useEffect(() => {
    let mounted = true;

    const fetchHospDefValues = () => {
      dispatch(DefaultValuesActions.setHospitalNameAction());
      dispatch(DefaultValuesActions.setHospitalLogoAction());
      dispatch(setCurrentUserAction());
    };

    mounted && fetchHospDefValues();

    return () => {
      mounted = false;
    };
  }, [dispatch]);

  return (
    <LoginStyles theme={theme}>
      <div style={{ gridArea: "login" }} className="login-container">
        <div className="slider-ctnr">
          {images.map((imgSrc: any, index: number) => (
            <StyledImageBackground
              src={imgSrc}
              key={index}
              className={clsx("slides", {
                active: index === currentBackground,
              })}
            >
              <div className="app-name">{APP_NAME}</div>
            </StyledImageBackground>
          ))}
        </div>
        <div className="form-ctnr">
          <section className="header">
            <CustomAvatar
              src={hospital_logo}
              alt={hospital_name}
              className="brand-logo"
              isBlob={true}
              spacing={14}
            />
            <div className="brand-name">{hospital_name}</div>
          </section>

          <section className="body">
            <div className="body-title">
              We are glad that you're back! <b>Sign in here.</b>
            </div>

            {!!authError && <div className="error">{authError}</div>}

            <Formik initialValues={authFormValues} onSubmit={handleSubmit}>
              {({ values, setFieldValue }) => (
                <Form className="form">
                  <div
                    style={{
                      display: "none",
                    }}
                  >
                    <input name="password" type="password" tabIndex={-1} />
                  </div>
                  <FieldUsername />
                  <FieldPassword
                    showPassword={showPassword}
                    handleTogglePassword={handleTogglePassword}
                  />

                  {/* <div className="keep-me-logged-in">
                    <FormControlLabel
                      control={<Checkbox color="primary" />}
                      label="Keep me logged in"
                      checked={values.rememberme}
                      onChange={() => {
                        setFieldValue("rememberme", !values.rememberme);
                      }}
                    />
                  </div> */}

                  <PrivacyPolicy />
                  <div className="login-btn">
                    <LoadingButton
                      type="submit"
                      className="submit-btn"
                      variant="contained"
                      color="primary"
                      loading={isAuthenticating}
                      fullWidth={true}
                      size="large"
                    >
                      Log in
                    </LoadingButton>
                  </div>
                </Form>
              )}
            </Formik>
          </section>
          <section className="footer">
            <div className="login-footer-title">Developed & Maintained By</div>
            <Avatar className="tuo_logo" src={tuo_logo} />
            <div className="tuo-name">
              TUO IT Solutions | Consultancy and Services
            </div>
          </section>
        </div>
      </div>
    </LoginStyles>
  );
});

export default LoginPortal;

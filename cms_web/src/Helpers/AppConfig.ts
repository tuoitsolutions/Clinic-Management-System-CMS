export const APP_NAME: any = process.env.REACT_APP_NAME;

export const SERVER_URL: any =
  process.env.NODE_ENV === "development"
    ? process.env.REACT_APP_DEV_SERVER_URL
    : process.env.REACT_APP_PROD_SERVER_URL;

export const PAYMONG_SERVER_URL: any =
  process.env.NODE_ENV === "development"
    ? `http://localhost:3000/`
    : process.env.REACT_APP_PROD_SERVER_URL;

export const getAccessToken = (): string | null => {
  let token: string | null = null;
  try {
    const temp_storage: string | null = localStorage.getItem(APP_NAME);
    if (temp_storage) {
      token = JSON.parse(temp_storage).access_token;
    }
  } catch (error) {}

  return token;
};

export const getRefreshToken = (): string | null => {
  let token: string | null = null;
  try {
    const temp_storage: string | null = localStorage.getItem(APP_NAME);
    if (temp_storage) {
      token = JSON.parse(temp_storage).refresh_token.tokenString;
    }
  } catch (error) {}

  return token;
};

export const getRememberMe = (): boolean => {
  let rememberme: boolean = false;
  try {
    const temp_storage: string | null = localStorage.getItem(APP_NAME);
    if (temp_storage) {
      rememberme = JSON.parse(temp_storage).rememberme;
    }
  } catch (error) {}

  return rememberme;
};

export const getRefreshTokenExpiration = (): string | null => {
  let token: string | null = null;
  try {
    const temp_storage: string | null = localStorage.getItem(APP_NAME);
    if (temp_storage) {
      token = JSON.parse(temp_storage).refresh_token.expireAt;
    }
  } catch (error) {}

  return token;
};

export const removeToken = () => {
  localStorage.removeItem(APP_NAME);
};

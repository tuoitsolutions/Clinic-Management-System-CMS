import axios, { AxiosInstance } from "axios";
import {
  APP_NAME,
  getAccessToken,
  getRefreshToken,
  getRememberMe,
  removeToken,
} from "../Helpers/AppConfig";
import ResponseModel from "../Services/Models/ServerResponseModel";

export const Axios: AxiosInstance = axios.create();

export const GetFetch = async (endpoint: string): Promise<ResponseModel> => {
  try {
    const serverResponse: ResponseModel = await Axios.get(`/` + endpoint, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getAccessToken()}`,
      },
    });

    return serverResponse.data;
  } catch (error) {
    return {
      success: false,
      message: `Client error has occured. ${error}`,
    };
  }
};

export const PostFetch = async (
  endpoint: string,
  data: any
): Promise<ResponseModel> => {
  try {
    const serverResponse: ResponseModel = await Axios.post(
      `/` + endpoint,
      data,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAccessToken()}`,
        },
      }
    );
    return serverResponse.data;
  } catch (error) {
    return {
      success: false,
      message: `Client error has occured. ${error}`,
    };
  }
};

export const FormDataPostFetch = async (
  endpoint: string,
  payload: FormData
): Promise<ResponseModel> => {
  try {
    const serverResponse: ResponseModel = await Axios.post(
      `/` + endpoint,
      payload,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${getAccessToken()}`,
        },
      }
    );
    return serverResponse.data;
  } catch (error) {
    return {
      success: false,
      message: `Client error has occured. ${error}`,
    };
  }
};

let isRefreshing = false;
let refreshSubscribers: Array<any> = [];

Axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const {
      config,
      response: { status },
    } = error;
    const originalRequest = config;

    if (status === 409) {
      // removeToken();
      // window.location.href = "/login";
    }

    if (status === 401) {
      if (!isRefreshing) {
        isRefreshing = true;
        console.clear();

        const refresh_token = getRefreshToken();
        if (refresh_token) {
          axios
            .post(
              "/api/user/RefreshToken",
              {
                RefreshToken: refresh_token,
                rememberme: getRememberMe(),
              },
              {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${getAccessToken()}`,
                },
              }
            )
            .then((response) => {
              localStorage.setItem(
                APP_NAME,
                JSON.stringify({
                  access_token: response.data.access_token,
                  refresh_token: response.data.refresh_token,
                })
              );

              isRefreshing = false;
              onRrefreshed(response.data.access_token);
              refreshSubscribers = [];
            })
            .catch((err) => {
              console.clear();
              removeToken();
              alert(
                `It looks like your session has expired, please login again!`
              );
              if (
                window.location.pathname !== "/login" &&
                window.location.pathname !== "/"
              ) {
                window.location.href = "/login";
              }
              //
            });
        } else {
          if (
            window.location.pathname !== "/login" &&
            window.location.pathname !== "/"
          ) {
            window.location.href = "/login";
          }
          // window.location.href = "/login";
        }
      }

      const retryOrigReq = new Promise((resolve, reject) => {
        subscribeTokenRefresh((token: any) => {
          originalRequest.headers["Authorization"] = "Bearer " + token;
          resolve(axios(originalRequest));
        });
      });
      return retryOrigReq;
    } else {
      return Promise.reject(error);
    }
  }
);

const subscribeTokenRefresh = (cb: any) => {
  refreshSubscribers.push(cb);
};

const onRrefreshed = (token: string) => {
  refreshSubscribers.map((cb) => cb(token));
};

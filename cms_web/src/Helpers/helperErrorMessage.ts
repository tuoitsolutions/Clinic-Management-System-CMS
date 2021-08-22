import { Dispatch } from "react";
import ResponseModel from "../Services/Models/ServerResponseModel";
import { PageReducerTypes } from "../Services/Types/PageTypes";

const helperErrorMessage = (
  dispatch: Dispatch<PageReducerTypes>,
  response: ResponseModel,
  onError?: () => any
) => {
  if (response.message && typeof response.message === "string") {
    dispatch({
      type: "SET_PAGE_SNACKBAR",
      page_snackbar: {
        message: response.message.toString(),
        options: {
          variant: "error",
        },
      },
    });
  }

  response?.errors?.forEach((err) => {
    dispatch({
      type: "SET_PAGE_SNACKBAR",
      page_snackbar: {
        message: ` ${err} `,
        options: {
          variant: "error",
        },
      },
    });
  });
  if (typeof onError === "function") {
    onError();
  }
};

export default helperErrorMessage;

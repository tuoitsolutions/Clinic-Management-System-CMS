import { Dispatch } from "react";
import {
  PagePromptTypes,
  PageReducerTypes,
  PageLoadingTypes,
  PageLinkTypes,
  PageSuccessPromptTypes,
} from "../Types/PageTypes";

export const setGeneralPrompt =
  (promptSettings: PagePromptTypes) =>
  async (dispatch: Dispatch<PageReducerTypes>) => {
    dispatch({
      type: "SET_PAGE_PROMPT",
      page_prompt: promptSettings,
    });
  };

export const resetGeneralPrompt =
  () => async (dispatch: Dispatch<PageReducerTypes>) => {
    dispatch({
      type: "SET_PAGE_PROMPT",
      page_prompt: {
        open: false,
        custom_title: null,
        custom_subtitle: null,
        continue_callback: null,
        close_callback: null,
      },
    });
  };

export const showPageLoading =
  (loadingSetting?: PageLoadingTypes) =>
  async (dispatch: Dispatch<PageReducerTypes>) => {
    dispatch({
      type: "SET_PAGE_LOADING",
      page_loading: {
        show: true,
        loading_message: !!loadingSetting?.loading_message
          ? loadingSetting?.loading_message
          : "We are processing your request, thank you for your patience.",
      },
    });
  };

export const closePageLoading =
  () => async (dispatch: Dispatch<PageReducerTypes>) => {
    dispatch({
      type: "SET_PAGE_LOADING",
      page_loading: {
        show: false,
        loading_message: null,
      },
    });
  };

export const setPageLinksAction =
  (pageLinks: Array<PageLinkTypes>) =>
  async (dispatch: Dispatch<PageReducerTypes>) => {
    dispatch({
      type: "SET_PAGE_LINKS",
      page_links: pageLinks,
    });
  };

export const setPageSuccessPromptAction =
  (payload: PageSuccessPromptTypes) =>
  async (dispatch: Dispatch<PageReducerTypes>) => {
    dispatch({
      type: "SET_PAGE_SUCCESS_PROMPT",
      page_success_prompt: payload,
    });
  };

export const setPageSnackbar =
  (
    message: string,
    variant: "default" | "error" | "info" | "success" | "warning"
  ) =>
  async (dispatch: Dispatch<PageReducerTypes>) => {
    dispatch({
      type: "SET_PAGE_SNACKBAR",
      page_snackbar: {
        message: message,
        options: {
          variant: variant,
        },
      },
    });
  };

const setOpenQrDialog =
  (is_open: boolean) => async (dispatch: Dispatch<PageReducerTypes>) => {
    dispatch({
      type: "open_qr_dialog",
      open_qr_dialog: is_open,
    });
  };

export default {
  setOpenQrDialog,
  showPageLoading,
  closePageLoading,
  setGeneralPrompt,
  setPageSnackbar,
};

import { useSnackbar } from "notistack";
import { memo, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootStore } from "../Services/Store";

const PageSnackbar = memo(() => {
  const { enqueueSnackbar } = useSnackbar();

  const { message, options } = useSelector(
    (state: RootStore) => state.PageReducer.page_snackbar
  );

  useEffect(() => {
    let mounted = true;

    const triggerSnackbar = () => {
      if (message) {
        if (options) {
          enqueueSnackbar(message, { ...options, persist: true });
        } else {
          enqueueSnackbar(message, { persist: true });
        }
      }
    };

    mounted && triggerSnackbar();
    return () => {
      mounted = false;
    };
  }, [enqueueSnackbar, message, options]);

  return null;
});

export default PageSnackbar;

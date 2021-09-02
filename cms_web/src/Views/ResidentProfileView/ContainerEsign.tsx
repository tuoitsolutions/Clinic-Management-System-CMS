import { Button, Grid } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import React, {
  FC,
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useDispatch } from "react-redux";
import SignatureCanvas from "react-signature-canvas";
import FormDialog from "../../Component/FormDialog/FormDialog";
import { dataURLtoImageFile } from "../../Hooks/UseFileConverter";
import {
  closePageLoading,
  setGeneralPrompt,
  setPageSnackbar,
  showPageLoading,
} from "../../Services/Actions/PageActions";
import HospResidentApi from "../../Services/Api/HospResidentApi";

interface IDialogResESignUpdate {}

const DialogResESignUpdate: FC<IDialogResESignUpdate> = memo(({ ...props }) => {
  const dispatch = useDispatch();
  const esign_ref = useRef<any>();
  const [open_update_esign_dialog, set_open_update_esign_dialog] =
    useState(false);
  const [loading_esignature, set_loading_esignature] = useState(false);

  const [esignature_preview, set_esignature_preview] = useState("");

  const handleReloadEsign = useCallback(async () => {
    set_loading_esignature(true);

    const esign_res = await HospResidentApi.PreviewResidentESign({});
    if (esign_res.success) {
      set_esignature_preview(esign_res.data);
    } else {
      dispatch(setPageSnackbar(esign_res.message.toString(), "error"));
    }
    set_loading_esignature(false);
  }, [dispatch]);

  const handleSaveEsign = useCallback(async () => {
    if (!!esign_ref?.current) {
      const esign: any = esign_ref.current;

      if (!esign.isEmpty()) {
        console.log(`esign`, esign.toDataURL());

        const file = dataURLtoImageFile(
          esign.toDataURL(),
          `resident-esingature-pic.png`,
          true
        );

        console.log(`file`, file);
        const form_data_payload = new FormData();
        form_data_payload.append("esignature_attach", file);

        if (!!file) {
          dispatch(
            setGeneralPrompt({
              open: true,
              custom_title: `Are you sure that you want to update your E-signature?`,
              continue_callback: async () => {
                dispatch(
                  showPageLoading({
                    show: true,
                    loading_message:
                      "Updating E-signature, thank you for your patience",
                  })
                );

                const response = await HospResidentApi.UpdateResidentESign(
                  form_data_payload
                );

                dispatch(closePageLoading());
                dispatch(
                  setPageSnackbar(
                    response?.message?.toString(),
                    response.success ? "success" : "error"
                  )
                );
                if (response.success) {
                  set_open_update_esign_dialog(false);
                  handleReloadEsign();
                }
              },
            })
          );
        }
      } else {
        dispatch(
          setPageSnackbar(
            "We are not able to read your signature, kindly specify a correct one.",
            "info"
          )
        );
      }
    }
  }, [dispatch, handleReloadEsign]);

  useEffect(() => {
    let mounted = true;

    async function fetchData() {
      mounted && set_loading_esignature(true);

      const esign_res = await HospResidentApi.PreviewResidentESign({});
      if (esign_res.success) {
        mounted && set_esignature_preview(esign_res.data);
      } else {
        dispatch(setPageSnackbar(esign_res.message.toString(), "error"));
      }
      mounted && set_loading_esignature(false);
    }

    mounted && fetchData();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <>
      <Grid item xs={12}>
        <div className="ctnr-title-container">
          <Grid container spacing={0} alignContent="center" alignItems="center">
            <Grid item xs={12} sm={6}>
              <div className="ctnr-title">
                <div className="main">Electronic Signature</div>
                <div className="sub">
                  This signature will be used to all the auto-generated
                  documents.
                </div>
              </div>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Grid container spacing={2} justify="flex-end">
                <Grid item>
                  <Button
                    color="primary"
                    variant="contained"
                    onClick={() => {
                      set_open_update_esign_dialog(true);
                    }}
                  >
                    Update E-signature
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </div>
      </Grid>

      <Grid item xs={12}>
        <div
          style={{
            padding: `1em`,
            display: `grid`,
            justifyContent: `start`,
            justifyItems: `start`,
            overflowX: `auto`,
          }}
        >
          {loading_esignature ? (
            <Skeleton height={100} animation="wave" />
          ) : (
            <img
              src={esignature_preview}
              alt="No E-signature has been added yet!"
              height={80}
              className="signature-canvas"
              style={
                {
                  // boxShadow: `0 2px 30px rgba(0,0,0,.1)`,
                  // borderRadius: 7,
                }
              }
            />
          )}
        </div>
      </Grid>

      <FormDialog
        title="Update your eletronic signature"
        open={open_update_esign_dialog}
        handleClose={() => set_open_update_esign_dialog(false)}
        minWidth={600}
        body={
          <div
            style={{
              marginTop: `1em`,
              padding: `1em`,
              display: `grid`,
              justifyContent: `center`,
              justifyItems: `center`,
            }}
          >
            <SignatureCanvas
              ref={esign_ref}
              penColor="black"
              canvasProps={{
                width: 340,
                height: 150,
                className: "signature-canvas",
                style: {
                  boxShadow: `0 2px 30px rgba(0,0,0,.1)`,
                  //   border: `1px solid rgba(0,0,0,.1)`,
                  borderRadius: 7,
                },
              }}
            />
          </div>
        }
        actions={
          <>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                handleSaveEsign();
              }}
            >
              Save E-signature
            </Button>

            <Button
              variant="contained"
              color="secondary"
              onClick={() => {
                if (!!esign_ref.current) {
                  esign_ref.current.clear();
                }
              }}
            >
              Clear
            </Button>
          </>
        }
      />
    </>
  );
});

export default DialogResESignUpdate;

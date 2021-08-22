import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Grid } from "@material-ui/core";
import React, { FC, memo, useCallback } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import * as yup from "yup";
import FormDialog from "../../../Component/FormDialog/FormDialog";
import MultCheckboxHookForm from "../../../Component/HookForm/MultCheckboxHookForm";
import TextFieldHookForm from "../../../Component/HookForm/TextFieldHookForm";
import {
  closePageLoading,
  setGeneralPrompt,
  setPageSnackbar,
  showPageLoading,
} from "../../../Services/Actions/PageActions";
import ConsultRequestApi from "../../../Services/Api/ConsultRequestApi";
import { SendMessagePayload } from "../../../Services/Entities/ConsultRequestEntity";

interface IDialogDeclineConsultReq {
  open: boolean;
  consult_req_pk: string;
  handleCloseDialog: () => void;
  successCallback: () => void;
}

const form_schema = yup.object({
  body: yup.string().required().nullable().label("Body"),
  send_to: yup.array().of(yup.string()).min(1).compact().label("Send To"),
});

const DialogDeclineConsultReq: FC<IDialogDeclineConsultReq> = memo((props) => {
  const dispatch = useDispatch();

  const def_val = {
    body: "",
    send_to: ["sms", "email"],
  };

  const form_instance = useForm<any>({
    resolver: yupResolver(form_schema),
    mode: "onChange",
    defaultValues: def_val,
  });

  const handleSubmitForm = useCallback(
    async (payload: SendMessagePayload) => {
      payload.consult_req_pk = props.consult_req_pk;

      console.log(`payload`, payload);

      if (!!payload.consult_req_pk) {
        dispatch(
          setGeneralPrompt({
            open: true,
            custom_title: `Are you sure that you want to decline this consultation request?`,
            continue_callback: async () => {
              dispatch(
                showPageLoading({
                  show: true,
                  loading_message:
                    "Decliding consultation request, thank you for your patience",
                })
              );
              const response = await ConsultRequestApi.DeclineConsultRequest(
                payload
              );

              dispatch(closePageLoading());
              dispatch(
                setPageSnackbar(
                  response?.message?.toString(),
                  response.success ? "success" : "error"
                )
              );
              if (response.success) {
                if (typeof props.successCallback === "function") {
                  props.successCallback();
                }
                props.handleCloseDialog();
              }
            },
          })
        );
      }
    },
    [dispatch, form_instance, props.consult_req_pk]
  );

  return (
    <>
      <FormDialog
        title="Consultation Request Declining Form"
        open={props.open}
        handleClose={props.handleCloseDialog}
        minWidth={500}
        body={
          <FormProvider {...form_instance}>
            <form
              onSubmit={form_instance.handleSubmit(handleSubmitForm)}
              noValidate
              id="form_instance"
            >
              <div
                style={{
                  display: `grid`,
                  padding: `1.5em`,
                  backgroundColor: `#fff`,
                  borderRadius: 10,
                }}
              >
                <Grid container spacing={6}>
                  <Grid item xs={12}>
                    <TextFieldHookForm
                      label="Body"
                      name="body"
                      fullWidth
                      InputLabelProps={{
                        shrink: true,
                      }}
                      multiline={true}
                      rows={3}
                      placeholder="Write some message to be sent to the requestor..."
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <MultCheckboxHookForm
                      label="Send To"
                      name="send_to"
                      row={true}
                      required
                      radio_items={[
                        {
                          id: "sms",
                          label: "SMS",
                        },
                        {
                          id: "email",
                          label: "Email",
                        },
                      ]}
                    />
                  </Grid>
                </Grid>
              </div>
            </form>
          </FormProvider>
        }
        actions={
          <>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              form="form_instance"
            >
              Continue
            </Button>
            <Button
              variant="contained"
              color="secondary"
              type="reset"
              onClick={async () => {
                form_instance.reset(def_val);
              }}
            >
              Reset
            </Button>
          </>
        }
      />
    </>
  );
});

export default DialogDeclineConsultReq;

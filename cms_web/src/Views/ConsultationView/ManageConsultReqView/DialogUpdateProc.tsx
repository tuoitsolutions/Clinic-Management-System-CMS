import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Grid } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import React, { FC, memo, useCallback, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import * as yup from "yup";
import FormDialog from "../../../Component/FormDialog/FormDialog";
import MultiRadioFieldHookForm from "../../../Component/HookForm/MultiRadioFieldHookForm";
import TextFieldHookForm from "../../../Component/HookForm/TextFieldHookForm";
import {
  closePageLoading,
  setGeneralPrompt,
  setPageSnackbar,
  showPageLoading,
} from "../../../Services/Actions/PageActions";
import ConsultProcApi from "../../../Services/Api/ConsultProcApi";
import ConsultProcEntity from "../../../Services/Entities/ConsultProcEntity";

interface IDialogUpdateProc {
  open: boolean;
  handleCloseDialog: () => void;
  successCallback: () => void;
  selected_record: ConsultProcEntity;
}

const form_schema = yup.object({
  proc_desc: yup.string().required().nullable().label("Procedure Description"),
  notes: yup.string().nullable().label("Notes/Comments"),
  is_active: yup.string().required().nullable().label("Active Status"),
});

const DialogUpdateProc: FC<IDialogUpdateProc> = memo((props) => {
  const dispatch = useDispatch();

  const [page_err_msg, set_page_err_msg] = useState("");

  const form_instance = useForm<any>({
    resolver: yupResolver(form_schema),
    mode: "onChange",
    defaultValues: props.selected_record,
  });

  const handleSubmitForm = useCallback(
    async (payload: ConsultProcEntity) => {
      payload.cr_proc_pk = props.selected_record.cr_proc_pk;

      if (!!payload.cr_proc_pk) {
        dispatch(
          setGeneralPrompt({
            open: true,
            custom_title: `Are you sure that you want to update this item?`,
            continue_callback: async () => {
              dispatch(
                showPageLoading({
                  show: true,
                  loading_message: "Updating item, thank you for your patience",
                })
              );
              const response = await ConsultProcApi.UpdateConsultProc(payload);

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
    [dispatch, props]
  );

  return (
    <>
      <FormDialog
        title="Update the prescribed procedure to patient in this consultation"
        open={props.open}
        handleClose={props.handleCloseDialog}
        minWidth={400}
        body={
          !!page_err_msg ? (
            <Alert severity="error">{page_err_msg}</Alert>
          ) : (
            <div>
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
                    <Grid container spacing={5}>
                      <Grid item xs={12}>
                        <TextFieldHookForm
                          name="proc_desc"
                          label="Procedure Description"
                          InputLabelProps={{
                            shrink: true,
                          }}
                          fullWidth
                          required
                          placeholder="Enter the procedure description"
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <TextFieldHookForm
                          name="notes"
                          label="Notes/Comments"
                          required
                          InputLabelProps={{
                            shrink: true,
                          }}
                          fullWidth
                          placeholder="Write some notes/comments"
                          multiline
                          rows={3}
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <MultiRadioFieldHookForm
                          name="is_active"
                          label="Active Status"
                          row={true}
                          radio_items={[
                            {
                              value: "y",
                              label: "Active",
                            },
                            {
                              value: "n",
                              label: "Not Active",
                            },
                          ]}
                        />
                      </Grid>
                    </Grid>
                  </div>
                </form>
              </FormProvider>
            </div>
          )
        }
        actions={
          <>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              form="form_instance"
            >
              Save Changes
            </Button>
            <Button
              variant="contained"
              color="secondary"
              type="reset"
              onClick={async () => {
                form_instance.reset(props.selected_record);
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

export default DialogUpdateProc;

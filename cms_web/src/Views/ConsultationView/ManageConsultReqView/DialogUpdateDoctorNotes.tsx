import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Grid } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import React, { FC, memo, useCallback, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import * as yup from "yup";
import FormDialog from "../../../Component/FormDialog/FormDialog";
import TextFieldHookForm from "../../../Component/HookForm/TextFieldHookForm";
import {
  closePageLoading,
  setGeneralPrompt,
  setPageSnackbar,
  showPageLoading,
} from "../../../Services/Actions/PageActions";
import ConsultProcApi from "../../../Services/Api/ConsultProcApi";
import ConsultRequestApi from "../../../Services/Api/ConsultRequestApi";
import ConsultRequestEntity from "../../../Services/Entities/ConsultRequestEntity";

interface IDialogUpdateDoctorNotes {
  open: boolean;
  handleCloseDialog: () => void;
  successCallback: () => void;
  hash_key: string;
  doctor_notes: string;
}

const form_schema = yup.object({
  doctor_notes: yup.string().nullable().label("Doctor Notes"),
});

const DialogUpdateDoctorNotes: FC<IDialogUpdateDoctorNotes> = memo(
  ({ doctor_notes, ...props }) => {
    const dispatch = useDispatch();

    const [page_err_msg, set_page_err_msg] = useState("");

    const form_instance = useForm<any>({
      resolver: yupResolver(form_schema),
      mode: "onChange",
      defaultValues: {
        doctor_notes: doctor_notes,
      },
    });

    const handleSubmitForm = useCallback(
      async (payload: ConsultRequestEntity) => {
        payload.hash_key = props.hash_key;

        if (!!payload.hash_key) {
          dispatch(
            setGeneralPrompt({
              open: true,
              custom_title: `Are you sure that you want to update this item?`,
              continue_callback: async () => {
                dispatch(
                  showPageLoading({
                    show: true,
                    loading_message:
                      "Updating item, thank you for your patience",
                  })
                );
                const response = await ConsultRequestApi.UpdateConsultDocNotes(
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
      [dispatch, props]
    );

    return (
      <>
        <FormDialog
          title="Update the Doctor Notes"
          open={props.open}
          handleClose={props.handleCloseDialog}
          minWidth={600}
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
                        borderRadius: 15,
                      }}
                    >
                      <Grid container spacing={5}>
                        <Grid item xs={12}>
                          <TextFieldHookForm
                            name="doctor_notes"
                            label="Doctor Notes"
                            InputLabelProps={{
                              shrink: true,
                            }}
                            fullWidth
                            required
                            placeholder="Wrote the doctor notes here..."
                            multiline={true}
                            rows={10}
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
                  form_instance.reset();
                }}
              >
                Reset
              </Button>
            </>
          }
        />
      </>
    );
  }
);

export default DialogUpdateDoctorNotes;

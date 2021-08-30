import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Grid } from "@material-ui/core";
import React, { FC, memo, useCallback } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import * as yup from "yup";
import FormDialog from "../../../Component/FormDialog/FormDialog";
import MultiRadioFieldHookForm from "../../../Component/HookForm/MultiRadioFieldHookForm";
import SelectFieldHookForm from "../../../Component/HookForm/SelectFieldHookForm";
import TextFieldHookForm from "../../../Component/HookForm/TextFieldHookForm";
import {
  closePageLoading,
  setGeneralPrompt,
  setPageSnackbar,
  showPageLoading,
} from "../../../Services/Actions/PageActions";
import ConsultRequestFileApi from "../../../Services/Api/ConsultRequestFileApi";
import ConsultRequestFileEntity from "../../../Services/Entities/ConsultRequestFileEntity";

interface IDialogConsultFileUpdate {
  open: boolean;
  handleCloseDialog: () => void;
  successCallback: () => void;
  selected_consult_file: ConsultRequestFileEntity;
}

const form_schema = yup.object({
  file_name: yup.string().required().nullable().label("File Type"),
  file_type: yup.string().nullable().label("File Type"),
  notes: yup.string().nullable().label("Notes"),
  is_active: yup.string().required().nullable().label("Active Status"),
});

const DialogConsultFileUpdate: FC<IDialogConsultFileUpdate> = memo(
  ({ selected_consult_file, ...props }) => {
    const dispatch = useDispatch();

    const form_instance = useForm<any>({
      resolver: yupResolver(form_schema),
      mode: "onChange",
      defaultValues: selected_consult_file,
    });

    const handleSubmitForm = useCallback(
      async (payload: ConsultRequestFileEntity) => {
        payload.cr_file_pk = selected_consult_file.cr_file_pk;

        if (!!payload.cr_file_pk) {
          dispatch(
            setGeneralPrompt({
              open: true,
              custom_title: `Are you sure that you want to update this record?`,
              continue_callback: async () => {
                dispatch(
                  showPageLoading({
                    show: true,
                    loading_message:
                      "Updating record, thank you for your patience",
                  })
                );

                const response = await ConsultRequestFileApi.UpdateConsultFile(
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
                } else {
                }
              },
            })
          );
        }
      },
      [dispatch, props, selected_consult_file]
    );

    return (
      <>
        <FormDialog
          title="Consultation File Updating Form"
          open={props.open}
          handleClose={props.handleCloseDialog}
          minWidth={500}
          body={
            <div>
              <FormProvider {...form_instance}>
                <form
                  onSubmit={form_instance.handleSubmit(handleSubmitForm)}
                  noValidate
                  id="form_instance"
                >
                  <div
                    style={{
                      padding: `1.5em`,
                      backgroundColor: `#fff`,
                      borderRadius: 10,
                      width: `100%`,
                    }}
                  >
                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <TextFieldHookForm
                          name="file_name"
                          label="File Name"
                          InputLabelProps={{
                            shrink: true,
                          }}
                          fullWidth
                          placeholder="Ente the file name"
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <SelectFieldHookForm
                          name="file_type"
                          label="File Type"
                          InputLabelProps={{
                            shrink: true,
                          }}
                          fullWidth
                          options={[
                            {
                              title: "results",
                              value: "results",
                            },
                            {
                              title: "prescription",
                              value: "prescription",
                            },
                            {
                              title: "personal file",
                              value: "personal file",
                            },
                            {
                              title: "others",
                              value: "others",
                            },
                          ]}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextFieldHookForm
                          name="notes"
                          label="Notes/Remarks"
                          InputLabelProps={{
                            shrink: true,
                          }}
                          fullWidth
                          placeholder="Write some notes or remarks here..."
                          multiline
                          rowsMax={4}
                          rows={4}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <MultiRadioFieldHookForm
                          name={"is_active"}
                          label={"Active Status"}
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
                  form_instance.reset({
                    file_type: "",
                    notes: "",
                  });
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

export default DialogConsultFileUpdate;

import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Grid } from "@material-ui/core";
import React, { FC, memo, useCallback } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import * as yup from "yup";
import FormDialog from "../../../Component/FormDialog/FormDialog";
import DropzoneFieldHookForm from "../../../Component/HookForm/DropzoneFieldHookForm";
import SelectFieldHookForm from "../../../Component/HookForm/SelectFieldHookForm";
import TextFieldHookForm from "../../../Component/HookForm/TextFieldHookForm";
import useFormData from "../../../Hooks/useFormData";
import {
  closePageLoading,
  setGeneralPrompt,
  setPageSnackbar,
  showPageLoading,
} from "../../../Services/Actions/PageActions";
import ConsultRequestFileApi from "../../../Services/Api/ConsultRequestFileApi";
import ConsultRequestFileEntity from "../../../Services/Entities/ConsultRequestFileEntity";

interface IDialogConsultAddFile {
  open: boolean;
  handleCloseDialog: () => void;
  successCallback: () => void;
  consult_req_pk: string;
}

const form_schema = yup.object({
  file_type: yup.string().nullable().label("File Type"),
  notes: yup.string().nullable().label("Notes"),
  attach_file: yup
    .string()
    .test(
      "Kindly attach a file",
      "Kindly attach a file",
      function (value: any) {
        const val = value;
        const files = val.split(`,`);
        if (files.length > 0) {
          return !!files[0];
        } else {
          return true;
        }
      }
    ),
});

const DialogConsultAddFile: FC<IDialogConsultAddFile> = memo((props) => {
  const dispatch = useDispatch();

  const form_instance = useForm<any>({
    resolver: yupResolver(form_schema),
    mode: "onChange",
    defaultValues: {
      file_type: "",
      notes: "",
    },
  });

  const handleSubmitForm = useCallback(
    async (form_payload: ConsultRequestFileEntity) => {
      form_payload.consult_req_pk = props.consult_req_pk;

      if (!!form_payload.consult_req_pk) {
        dispatch(
          setGeneralPrompt({
            open: true,
            custom_title: `Are you sure that you want to add this item?`,
            continue_callback: async () => {
              dispatch(
                showPageLoading({
                  show: true,
                  loading_message: "Adding item, thank you for your patience",
                })
              );

              const files: Array<File> = form_instance.getValues("attach_file");

              if (files?.length > 0) {
                form_payload.attach_file = files[0];
              } else {
                setPageSnackbar("Kindly attach a file/document!", "error");
              }

              const payload = new FormData();
              useFormData.convertModelToFormData(form_payload, payload);

              const response = await ConsultRequestFileApi.InsertConsultFile(
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
    [dispatch, form_instance, props]
  );

  return (
    <>
      <FormDialog
        title="Add a file that is related to this consultation"
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
                      <DropzoneFieldHookForm
                        name="attach_file"
                        label="Drop  1 file (image or PDF only) that is related to this consultation here."
                        accept={"image/*,.pdf"}
                        multiple={false}
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
});

export default DialogConsultAddFile;

import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Grid } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import moment from "moment";
import React, { FC, memo, useCallback, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import * as yup from "yup";
import FormDialog from "../../../Component/FormDialog/FormDialog";
import DateFieldHookForm from "../../../Component/HookForm/DateFieldHookForm";
import MultiRadioFieldHookForm from "../../../Component/HookForm/MultiRadioFieldHookForm";
import TextFieldHookForm from "../../../Component/HookForm/TextFieldHookForm";
import {
  closePageLoading,
  setGeneralPrompt,
  setPageSnackbar,
  showPageLoading,
} from "../../../Services/Actions/PageActions";
import ConsultAllergyApi from "../../../Services/Api/ConsultAllergyApi";
import ConsultAllergyEntity from "../../../Services/Entities/ConsultAllergyEntity";

interface IDialogUpdateAllergy {
  open: boolean;
  handleCloseDialog: () => void;
  successCallback: () => void;
  selected_record: ConsultAllergyEntity;
}

const form_structure = {
  substance: {
    name: "substance",
    label: "Substance",
  },
  reaction: {
    name: "reaction",
    label: "Reaction",
  },
  first_occur: {
    name: "first_occur",
    label: "First Occurence",
  },
  notes: {
    name: "notes",
    label: "Notes",
  },
  is_active: {
    name: "is_active",
    label: "Active Status",
  },
};

const form_schema = yup.object({
  substance: yup
    .string()
    .required()
    .nullable()
    .label(form_structure.substance.label),
  reaction: yup.string().nullable().label(form_structure.reaction.label),
  first_occur: yup.string().nullable().label(form_structure.first_occur.label),
  notes: yup.string().nullable().label(form_structure.notes.label),
  is_active: yup
    .string()
    .required()
    .nullable()
    .label(form_structure.is_active.label),
});

const DialogUpdateAllergy: FC<IDialogUpdateAllergy> = memo((props) => {
  const dispatch = useDispatch();

  const [page_err_msg, set_page_err_msg] = useState("");

  const form_instance = useForm<any>({
    resolver: yupResolver(form_schema),
    mode: "onChange",
    defaultValues: props.selected_record,
  });

  const handleSubmitForm = useCallback(
    async (payload: ConsultAllergyEntity) => {
      payload.cr_allergy_pk = props.selected_record.cr_allergy_pk;

      const first_occur = moment(payload?.first_occur);
      if (first_occur.isValid() || !!payload?.first_occur) {
        payload.first_occur = first_occur.format();
      }

      if (!!payload.cr_allergy_pk) {
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
              const response = await ConsultAllergyApi.UpdateConsultAllergy(
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
        title="Update patient allergy"
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
                    display: `grid`,
                    padding: `1.5em`,
                    backgroundColor: `#fff`,
                    borderRadius: 10,
                  }}
                >
                  <Grid container spacing={5}>
                    <Grid item xs={12}>
                      <TextFieldHookForm
                        name={form_structure.substance.name}
                        label={form_structure.substance.label}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        fullWidth
                        required
                        placeholder={`Enter the ${form_structure.substance.label}`}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <TextFieldHookForm
                        name={form_structure.reaction.name}
                        label={form_structure.reaction.label}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        fullWidth
                        required
                        placeholder={`Enter the ${form_structure.reaction.label}`}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <DateFieldHookForm
                        name={form_structure.first_occur.name}
                        label={form_structure.first_occur.label}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        fullWidth
                        placeholder={`Enter the ${form_structure.first_occur.label}`}
                        type="date"
                        disableFuture
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <TextFieldHookForm
                        name={form_structure.notes.name}
                        label={form_structure.notes.label}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        fullWidth
                        placeholder={`Write some ${form_structure.notes.label}`}
                        multiline
                        rows={2}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <MultiRadioFieldHookForm
                        name={form_structure.is_active.name}
                        label={form_structure.is_active.label}
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

export default DialogUpdateAllergy;

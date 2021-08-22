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
import ConsultMedProbApi from "../../../Services/Api/ConsultMedProbApi";
import ConsultMedProbEntity from "../../../Services/Entities/ConsultMedProbEntity";

interface IDialogAddMedProb {
  open: boolean;
  handleCloseDialog: () => void;
  successCallback: () => void;
  consult_req_pk: string;
}

const form_structure = {
  med_prob_desc: {
    name: "med_prob_desc",
    label: "Medical Problem Description",
  },
  med_prob_host: {
    name: "med_prob_host",
    label: "Host",
  },
  is_active: {
    name: "is_active",
    label: "Active Status",
  },
};

const form_schema = yup.object({
  med_prob_desc: yup
    .string()
    .required()
    .nullable()
    .label(form_structure.med_prob_desc.label),
  med_prob_host: yup
    .string()
    .required()
    .nullable()
    .label(form_structure.med_prob_host.label),
  is_active: yup
    .string()
    .required()
    .nullable()
    .label(form_structure.is_active.label),
});

const DialogAddMedProb: FC<IDialogAddMedProb> = memo((props) => {
  const dispatch = useDispatch();

  const form_def_val = {
    med_prob_desc: "",
    med_prob_host: "",
    is_active: "",
  };

  const [page_err_msg, set_page_err_msg] = useState("");

  const form_instance = useForm<any>({
    resolver: yupResolver(form_schema),
    mode: "onChange",
    defaultValues: form_def_val,
  });

  const handleSubmitForm = useCallback(
    async (payload: ConsultMedProbEntity) => {
      payload.consult_req_pk = props.consult_req_pk;

      if (!!payload.consult_req_pk) {
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
              const response = await ConsultMedProbApi.InsertConsultMedProb(
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
                set_page_err_msg(response.message.toString());
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
        title="Add Patient Medical Problem"
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
                        name={form_structure.med_prob_desc.name}
                        label={form_structure.med_prob_desc.label}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        fullWidth
                        required
                        placeholder={`Enter the ${form_structure.med_prob_desc.label}`}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <MultiRadioFieldHookForm
                        name={form_structure.med_prob_host.name}
                        label={form_structure.med_prob_host.label}
                        row={true}
                        radio_items={[
                          {
                            value: "s",
                            label: "Patient",
                          },
                          {
                            value: "f",
                            label: "Family",
                          },
                        ]}
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
                form_instance.reset(form_def_val);
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

export default DialogAddMedProb;

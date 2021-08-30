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
import ConsultImmuneApi from "../../../Services/Api/ConsultImmuneApi";
import ConsultImmuneEntity from "../../../Services/Entities/ConsultImmuneEntity";

interface IDialogAddImmune {
  open: boolean;
  handleCloseDialog: () => void;
  successCallback: () => void;
  consult_req_pk: string;
}

const form_structure = {
  vac_desc: {
    name: "vac_desc",
    label: "Vaccine Description",
  },
  vac_type: {
    name: "vac_type",
    label: "Vaccine Type",
  },
  date_given: {
    name: "date_given",
    label: "Date Given",
  },
  next_dose: {
    name: "next_dose",
    label: "Date Next Dose ",
  },
  administered_by: {
    name: "administered_by",
    label: "Administered By",
  },
  is_valid: {
    name: "is_valid",
    label: "Validity",
  },
};

const form_schema = yup.object({
  vac_desc: yup
    .string()
    .required()
    .nullable()
    .label(form_structure.vac_desc.label),
  vac_type: yup
    .string()
    .required()
    .nullable()
    .label(form_structure.vac_type.label),
  date_given: yup.string().nullable().label(form_structure.date_given.label),
  next_dose: yup.string().nullable().label(form_structure.next_dose.label),
  administered_by: yup
    .string()
    .nullable()
    .label(form_structure.administered_by.label),
  is_valid: yup
    .string()
    .required()
    .nullable()
    .label(form_structure.is_valid.label),
});

const DialogAddImmune: FC<IDialogAddImmune> = memo((props) => {
  const dispatch = useDispatch();

  const form_def_val = {
    vac_desc: "",
    vac_type: "",
    date_given: "",
    next_dose: "",
    administered_by: "",
    is_valid: "",
  };

  const [page_err_msg, set_page_err_msg] = useState("");

  const form_instance = useForm<any>({
    resolver: yupResolver(form_schema),
    mode: "onChange",
    defaultValues: form_def_val,
  });

  const handleSubmitForm = useCallback(
    async (payload: ConsultImmuneEntity) => {
      payload.consult_req_pk = props.consult_req_pk;

      payload.date_given = moment(payload.date_given).format();

      const next_dose = moment(payload?.next_dose);
      if (next_dose.isValid() || !!payload?.next_dose) {
        payload.next_dose = next_dose.format();
      }

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
              const response = await ConsultImmuneApi.InsertConsultImmune(
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
        title="Add Patient Immunization"
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
                        name={form_structure.vac_desc.name}
                        label={form_structure.vac_desc.label}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        fullWidth
                        required
                        placeholder={`Enter the ${form_structure.vac_desc.label}`}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <TextFieldHookForm
                        name={form_structure.vac_type.name}
                        label={form_structure.vac_type.label}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        fullWidth
                        required
                        placeholder={`Enter the ${form_structure.vac_type.label}`}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <DateFieldHookForm
                        name={form_structure.date_given.name}
                        label={form_structure.date_given.label}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        fullWidth
                        required
                        placeholder={`Enter the ${form_structure.date_given.label}`}
                        type="date"
                        disableFuture
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <DateFieldHookForm
                        name={form_structure.next_dose.name}
                        label={form_structure.next_dose.label}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        fullWidth
                        placeholder={`Enter the ${form_structure.next_dose.label}`}
                        type="date"
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <TextFieldHookForm
                        name={form_structure.administered_by.name}
                        label={form_structure.administered_by.label}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        fullWidth
                        placeholder={`Enter the ${form_structure.administered_by.label}`}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <MultiRadioFieldHookForm
                        name={form_structure.is_valid.name}
                        label={form_structure.is_valid.label}
                        row={true}
                        radio_items={[
                          {
                            value: "y",
                            label: "Valid",
                          },
                          {
                            value: "n",
                            label: "Not Valid",
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

export default DialogAddImmune;

import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Grid } from "@material-ui/core";
import React, { FC, memo, useCallback, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import * as yup from "yup";
import FormDialog from "../../../Component/FormDialog/FormDialog";
import NumberHookForm from "../../../Component/HookForm/NumberHookForm";
import MaskedOnlyNumbers from "../../../Component/Mask/MaskedOnlyNumbers";
import HelpNumber from "../../../Helpers/HelpNumber";
import {
  closePageLoading,
  setGeneralPrompt,
  setPageSnackbar,
  showPageLoading,
} from "../../../Services/Actions/PageActions";
import ConsultRequestApi from "../../../Services/Api/ConsultRequestApi";
import ConsultRequestEntity from "../../../Services/Entities/ConsultRequestEntity";

interface IDialogChangeConsultCost {
  open: boolean;
  selected_consultation: ConsultRequestEntity;
  handleCloseDialog: () => void;
  successCallback: () => void;
}

const form_schema = yup.object({
  consult_cost: yup.string().required().nullable().label("Consultation Cost"),
});

const DialogChangeConsultCost: FC<IDialogChangeConsultCost> = memo((props) => {
  const dispatch = useDispatch();

  const form_instance = useForm<any>({
    resolver: yupResolver(form_schema),
    mode: "onChange",
    defaultValues: {
      ...props.selected_consultation,
      consult_cost: HelpNumber.NumberToMoney(
        props.selected_consultation.consult_cost
      ),
      // consult_cost: props.selected_consultation.consult_cost.toFixed(1),
    },
  });

  const handleSubmitForm = useCallback(
    async (payload: ConsultRequestEntity) => {
      payload.consult_req_pk = props.selected_consultation.consult_req_pk;
      payload.consult_cost = HelpNumber.StringToDecimal(
        payload.consult_cost,
        ","
      );

      if (!!payload.consult_req_pk) {
        dispatch(
          setGeneralPrompt({
            open: true,
            custom_title: `Are you sure that you want to change the cost of this consultation?`,
            continue_callback: async () => {
              dispatch(
                showPageLoading({
                  show: true,
                  loading_message:
                    "Changing the cost of consultation request, thank you for your patience",
                })
              );
              const response = await ConsultRequestApi.ChangeConsultationCost(
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
        title="Change the Cost of the Consultation"
        open={props.open}
        handleClose={props.handleCloseDialog}
        minWidth={350}
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
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <NumberHookForm
                      label="Consultation Cost (PHP)"
                      name="consult_cost"
                      fullWidth
                      type="text"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      InputProps={{
                        inputComponent: MaskedOnlyNumbers,
                      }}
                      required
                      placeholder="0.00"
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
              Save Changes
            </Button>
            <Button
              variant="contained"
              color="secondary"
              type="reset"
              onClick={async () => {
                form_instance.reset(props.selected_consultation);
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

export default DialogChangeConsultCost;

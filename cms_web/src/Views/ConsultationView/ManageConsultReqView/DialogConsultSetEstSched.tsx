import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Grid } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import moment from "moment";
import React, { FC, memo, useCallback, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import * as yup from "yup";
import FormDialog from "../../../Component/FormDialog/FormDialog";
import DateFieldHookForm from "../../../Component/HookForm/DateFieldHookForm";
import SingleCheckboxHookForm from "../../../Component/HookForm/SingleCheckboxHookForm";
import { DateFormatOrNull } from "../../../Hooks/UseDateParser";
import ConsultRequestActions from "../../../Services/Actions/ConsultRequestActions";
import {
  closePageLoading,
  setGeneralPrompt,
  setPageSnackbar,
  showPageLoading,
} from "../../../Services/Actions/PageActions";
import ConsultRequestApi from "../../../Services/Api/ConsultRequestApi";
import ConsultRequestEntity from "../../../Services/Entities/ConsultRequestEntity";
import { RootStore } from "../../../Services/Store";

interface IDialogConsultSetEstSched {
  selected_consultation: ConsultRequestEntity;
  successCallback: () => void;
}

const form_schema = yup.object({
  start_date: yup.string().required().nullable().label("Start Date"),
  start_time: yup.string().required().nullable().label("Start Time"),
});

const DialogConsultSetEstSched: FC<IDialogConsultSetEstSched> = memo(
  (props) => {
    const dispatch = useDispatch();

    const { open_sched_dialog } = useSelector(
      (store: RootStore) => store.ConsultRequestReducer
    );

    const [error_page_message, set_error_page_message] = useState("");

    const form_instance = useForm<any>({
      resolver: yupResolver(form_schema),
      mode: "onChange",
      defaultValues: {
        start_date: DateFormatOrNull(
          props.selected_consultation?.est_start_at,
          null
        ),
        start_time: DateFormatOrNull(
          props.selected_consultation?.est_start_at,
          null
        ),
      },
    });

    const handleSubmitForm = useCallback(
      async (payload: ConsultRequestEntity) => {
        payload.consult_req_pk = props.selected_consultation.consult_req_pk;

        var new_date = moment(
          `${moment(payload.start_date).format("YYYY-MM-DD")} ${moment(
            payload.start_time
          ).format("hh:mm A")}`,
          "YYYY-MM-DD hh:mm A"
        );
        if (!!payload.consult_req_pk && new_date?.isValid()) {
          payload.est_start_at = new_date.format();
          dispatch(
            setGeneralPrompt({
              open: true,
              custom_title: `Are you sure that you want to save the changes of this consultation request?`,
              continue_callback: async () => {
                dispatch(
                  showPageLoading({
                    show: true,
                    loading_message:
                      "Saving changes, thank you for your patience",
                  })
                );
                const response = await ConsultRequestApi.SetEstSchedule(
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

                  dispatch(ConsultRequestActions.SetOpenSchedDialog(false));
                }
              },
            })
          );
        }
      },
      [dispatch, props]
    );

    useEffect(() => {
      let mounted = true;

      const reloadForm = async () => {
        form_instance.reset({
          start_date: DateFormatOrNull(
            props.selected_consultation?.est_start_at,
            null
          ),
          start_time: DateFormatOrNull(
            props.selected_consultation?.est_start_at,
            null
          ),
        });
      };

      mounted && reloadForm();

      return () => {
        mounted = false;
      };
    }, [props.selected_consultation]);

    return (
      open_sched_dialog && (
        <>
          <FormDialog
            title="Set the estimated start schedule of the consultation"
            open={open_sched_dialog}
            handleClose={() => {
              dispatch(ConsultRequestActions.SetOpenSchedDialog(false));
            }}
            minWidth={450}
            body={
              !!error_page_message ? (
                <Alert severity="error">{error_page_message}</Alert>
              ) : (
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
                        <Grid item xs={12} sm={7}>
                          <DateFieldHookForm
                            name="start_date"
                            label="Start Date"
                            type="date"
                            disablePast
                            InputLabelProps={{
                              shrink: true,
                            }}
                            required
                            mask="__/__/____"
                            placeholder="MM/DD/YYYY"
                          />
                        </Grid>
                        <Grid item xs={12} sm={5}>
                          <DateFieldHookForm
                            name="start_time"
                            label="Start Time"
                            type="time"
                            disablePast
                            InputLabelProps={{
                              shrink: true,
                            }}
                            required
                            placeholder="HH:mm A"
                          />
                        </Grid>

                        <Grid item xs={12}>
                          <SingleCheckboxHookForm
                            label="Do you want to send an email for the changes of this consultation to the requestor?"
                            name="is_send_consult_link"
                            size="small"
                          />
                        </Grid>
                      </Grid>
                    </div>
                  </form>
                </FormProvider>
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
                    form_instance.reset(props.selected_consultation);
                  }}
                >
                  Reset
                </Button>
              </>
            }
          />
        </>
      )
    );
  }
);

export default DialogConsultSetEstSched;

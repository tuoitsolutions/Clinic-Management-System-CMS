import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Grid } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import React, { FC, memo, useCallback, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import * as yup from "yup";
import BodyLoader from "../../../Component/BodyLoader";
import FormDialog from "../../../Component/FormDialog/FormDialog";
import AutocompleteHookForm from "../../../Component/HookForm/AutocompleteHookForm";
import SingleCheckboxHookForm from "../../../Component/HookForm/SingleCheckboxHookForm";
import ConsultRequestActions from "../../../Services/Actions/ConsultRequestActions";
import {
  closePageLoading,
  setGeneralPrompt,
  setPageSnackbar,
  showPageLoading,
} from "../../../Services/Actions/PageActions";
import ConsultRequestApi from "../../../Services/Api/ConsultRequestApi";
import LibraryApi from "../../../Services/Api/LibraryApi";
import ConsultRequestEntity from "../../../Services/Entities/ConsultRequestEntity";
import { OptionItemModel } from "../../../Services/Models/OptionModel";
import { RootStore } from "../../../Services/Store";

interface IDialogConsultTransferDept {
  selected_consultation: ConsultRequestEntity;
  successCallback: () => void;
}

const form_schema = yup.object({
  assign_dept_pk: yup.string().required().nullable().label("Department"),
  // assign_res_pk: yup.string().nullable().label("Resident"),
});

const DialogConsultTransferDept: FC<IDialogConsultTransferDept> = memo(
  (props) => {
    const dispatch = useDispatch();

    const { open_transfer_dept_dialog } = useSelector(
      (store: RootStore) => store.ConsultRequestReducer
    );

    const [error_page_message, set_error_page_message] = useState("");

    const [dept_options, set_dept_options] = useState<Array<OptionItemModel>>(
      []
    );
    const [fetch_dept_options, set_fetch_dept_options] = useState(false);

    const form_instance = useForm<any>({
      resolver: yupResolver(form_schema),
      mode: "onChange",
      defaultValues: {
        assign_dept_pk: props.selected_consultation.assign_dept_pk,
      },
    });

    const handleSubmitForm = useCallback(
      async (payload: ConsultRequestEntity) => {
        payload.consult_req_pk = props.selected_consultation.consult_req_pk;
        if (!!payload.consult_req_pk) {
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
                const response = await ConsultRequestApi.TransferConsultDept(
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
                  dispatch(
                    ConsultRequestActions.SetOpenTransferDeptDialog(false)
                  );
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
      async function fetchData() {
        mounted && set_fetch_dept_options(true);
        const dept_opt_res = await LibraryApi.GetDepartmentOptions();
        if (dept_opt_res.success) {
          mounted && set_dept_options(dept_opt_res.data);
        } else {
          mounted && set_error_page_message(dept_opt_res.message.toString());
        }

        mounted && set_fetch_dept_options(false);
      }

      mounted && fetchData();

      return () => {
        mounted = false;
      };
    }, []);

    return (
      open_transfer_dept_dialog && (
        <>
          <FormDialog
            title="Transfer consultation to other department"
            open={open_transfer_dept_dialog}
            handleClose={() => {
              dispatch(ConsultRequestActions.SetOpenTransferDeptDialog(false));
            }}
            minWidth={500}
            body={
              !!error_page_message ? (
                <Alert severity="error">{error_page_message}</Alert>
              ) : fetch_dept_options ? (
                <BodyLoader message="Loading department options, thank you for your patience." />
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
                        <Grid item xs={12}>
                          <AutocompleteHookForm
                            name="assign_dept_pk"
                            label="Department"
                            fullWidth={true}
                            InputLabelProps={{
                              shrink: true,
                            }}
                            options={dept_options}
                            onChangeCallback={(val) => {
                              form_instance.setValue("assign_res_pk", "");
                            }}
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
                <Button variant="contained" color="secondary">
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

export default DialogConsultTransferDept;

import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Grid } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import moment from "moment";
import React, {
  FC,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import * as yup from "yup";
import BodyLoader from "../../../Component/BodyLoader";
import FormDialog from "../../../Component/FormDialog/FormDialog";
import AutocompleteHookForm from "../../../Component/HookForm/AutocompleteHookForm";
import DateFieldHookForm from "../../../Component/HookForm/DateFieldHookForm";
import SingleCheckboxHookForm from "../../../Component/HookForm/SingleCheckboxHookForm";
import { DateFormatOrNull } from "../../../Hooks/UseDateParser";
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

interface IDialogConsultTransferDept {
  open: boolean;
  selected_consultation: ConsultRequestEntity;
  handleCloseDialog: () => void;
  successCallback: () => void;
}

const form_schema = yup.object({
  assign_dept_pk: yup.string().required().nullable().label("Department"),
  assign_res_pk: yup.string().nullable().label("Resident"),
});

const DialogConsultTransferDept: FC<IDialogConsultTransferDept> = memo(
  (props) => {
    const dispatch = useDispatch();

    const [error_page_message, set_error_page_message] = useState("");

    const [dept_resident_options, set_dept_resident_options] =
      useState<Array<OptionItemModel> | null>();
    const [fetch_dept_resident_options, set_fetch_dept_resident_options] =
      useState(false);

    const [dept_options, set_dept_options] = useState<Array<OptionItemModel>>(
      []
    );
    const [fetch_dept_options, set_fetch_dept_options] = useState(false);

    const form_instance = useForm<any>({
      resolver: yupResolver(form_schema),
      mode: "onChange",
      defaultValues: {
        assign_dept_pk: props.selected_consultation.assign_dept_pk,
        assign_res_pk: props.selected_consultation.assign_res_pk,
      },
    });

    const assign_dept_pk = form_instance.watch("assign_dept_pk", false);

    const handleSubmitForm = useCallback(
      async (payload: ConsultRequestEntity) => {
        console.log(`payload`, payload);
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
                  props.handleCloseDialog();
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

    useEffect(() => {
      let mounted = true;
      async function fetchData() {
        mounted && set_fetch_dept_resident_options(true);
        const dept_res_opt_res = await LibraryApi.GetHospResidentOptions(
          assign_dept_pk
        );
        if (dept_res_opt_res.success) {
          mounted && set_dept_resident_options(dept_res_opt_res.data);
        } else {
          mounted &&
            set_error_page_message(dept_res_opt_res.message.toString());
        }
        mounted && set_fetch_dept_resident_options(false);
      }

      mounted && !!assign_dept_pk && fetchData();

      return () => {
        mounted = false;
      };
    }, [assign_dept_pk]);

    return (
      <>
        <FormDialog
          title="Set or transfer the department and/or resident of this consultation"
          open={props.open}
          handleClose={props.handleCloseDialog}
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
                        <AutocompleteHookForm
                          name="assign_res_pk"
                          label="Resident"
                          fullWidth={true}
                          InputLabelProps={{
                            shrink: true,
                          }}
                          options={dept_resident_options}
                          loading={fetch_dept_resident_options}
                          disabled={fetch_dept_resident_options}
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
                // type="reset"
                // onClick={async () => {
                //   form_instance.reset(props.selected_consultation);
                // }}
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

export default DialogConsultTransferDept;

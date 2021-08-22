import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Grid } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import React, { FC, memo, useCallback, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import * as yup from "yup";
import BodyLoader from "../../../Component/BodyLoader";
import FormDialog from "../../../Component/FormDialog/FormDialog";
import AutocompleteHookForm from "../../../Component/HookForm/AutocompleteHookForm";
import MultiRadioFieldHookForm from "../../../Component/HookForm/MultiRadioFieldHookForm";
import TextFieldHookForm from "../../../Component/HookForm/TextFieldHookForm";
import {
  closePageLoading,
  setGeneralPrompt,
  setPageSnackbar,
  showPageLoading,
} from "../../../Services/Actions/PageActions";
import DeptResidentApi from "../../../Services/Api/DeptResidentApi";
import LibraryApi from "../../../Services/Api/LibraryApi";
import DeptResidentEntity from "../../../Services/Entities/DeptResidentEntity";
import { OptionItemModel } from "../../../Services/Models/OptionModel";

interface IDialogDeptResidentAdd {
  open: boolean;
  dept_pk: string;
  handleCloseDialog: () => void;
}

const form_schema = yup.object({
  res_pk: yup.string().nullable().required().label("Resident"),
  notes: yup.string().nullable().label("Notes"),
  is_active: yup.string().required().nullable().label("Active Status"),
});

const DialogDeptResidentAdd: FC<IDialogDeptResidentAdd> = memo((props) => {
  const dispatch = useDispatch();

  const form_instance = useForm<any>({
    resolver: yupResolver(form_schema),
    mode: "onChange",
    defaultValues: {
      res_pk: "",
      notes: "",
      is_active: "",
    },
  });

  const [page_err_msg, set_page_err_msg] = useState("");
  const [fetch_initial_data, set_fetch_initial_data] = useState(false);
  const [hosp_resident_opt, set_hosp_resident_opt] = useState<
    Array<OptionItemModel>
  >([]);

  const handleSubmitForm = useCallback(
    async (payload: DeptResidentEntity) => {
      payload.dept_pk = parseInt(props.dept_pk);

      if (!isNaN(payload.dept_pk)) {
        dispatch(
          setGeneralPrompt({
            open: true,
            custom_title: `Are you sure that you want to add this resident to the department?`,
            continue_callback: async () => {
              dispatch(
                showPageLoading({
                  show: true,
                  loading_message:
                    "Adding resident to the department, thank you for your patience",
                })
              );
              const response = await DeptResidentApi.InsertDeptResident(
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
                form_instance.reset();
              }
            },
          })
        );
      }
    },
    [dispatch, form_instance, props.dept_pk]
  );

  useEffect(() => {
    let mounted = true;

    async function fetch_init_data() {
      set_fetch_initial_data(true);
      const hosp_resident_response = await LibraryApi.GetHospResidentOptions(
        parseInt(props.dept_pk)
      );

      if (hosp_resident_response.success) {
        mounted && set_hosp_resident_opt(hosp_resident_response.data);
      } else {
        set_page_err_msg(hosp_resident_response.message.toString());
      }

      set_fetch_initial_data(false);
    }

    mounted && fetch_init_data();

    return () => {
      mounted = false;
    };
  }, [dispatch]);

  return (
    <>
      <FormDialog
        title="Department Resident Adding Form"
        open={props.open}
        handleClose={props.handleCloseDialog}
        minWidth={500}
        body={
          !fetch_initial_data ? (
            !!page_err_msg ? (
              <>
                <Alert>{page_err_msg}</Alert>
              </>
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
                    <Grid container spacing={6}>
                      <Grid item xs={12}>
                        <AutocompleteHookForm
                          label="Resident"
                          name="res_pk"
                          options={hosp_resident_opt}
                          defaultValue=""
                          InputLabelProps={{
                            shrink: true,
                          }}
                          required
                          fullWidth
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <TextFieldHookForm
                          label="Notes"
                          name="notes"
                          fullWidth
                          InputLabelProps={{
                            shrink: true,
                          }}
                          multiline={true}
                          rows={3}
                          placeholder="Write some notes or comments here..."
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <MultiRadioFieldHookForm
                          name="is_active"
                          label="Active"
                          row={true}
                          required
                          size="small"
                          radio_items={[
                            {
                              value: "y",
                              label: "Yes",
                            },
                            {
                              value: "n",
                              label: "No",
                            },
                          ]}
                        />
                      </Grid>
                    </Grid>
                  </div>
                </form>
              </FormProvider>
            )
          ) : (
            <>
              <BodyLoader />
            </>
          )
        }
        actions={
          <>
            <Button
              disabled={fetch_initial_data}
              variant="contained"
              color="primary"
              type="submit"
              form="form_instance"
            >
              Submit
            </Button>
            <Button
              disabled={fetch_initial_data}
              variant="contained"
              color="secondary"
              type="reset"
              onClick={() => {
                form_instance.reset({});
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

export default DialogDeptResidentAdd;

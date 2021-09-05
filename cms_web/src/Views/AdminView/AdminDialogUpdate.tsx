import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Grid } from "@material-ui/core";
import React, { FC, memo, useCallback, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import * as yup from "yup";
import BodyLoader from "../../Component/BodyLoader";
import ErrorMessage from "../../Component/ErrorMessage";
import FormDialog from "../../Component/FormDialog/FormDialog";
import AutocompleteHookForm from "../../Component/HookForm/AutocompleteHookForm";
import MultiRadioFieldHookForm from "../../Component/HookForm/MultiRadioFieldHookForm";
import NumberHookForm from "../../Component/HookForm/NumberHookForm";
import PhotoHookForm from "../../Component/HookForm/PhotoHookForm";
import TextFieldHookForm from "../../Component/HookForm/TextFieldHookForm";
import MaskedOnlyNumbers from "../../Component/Mask/MaskedOnlyNumbers";
import MaskedPhoneNumber from "../../Component/Mask/MaskedPhoneNumber";
import { dataURLtoImageFile } from "../../Hooks/UseFileConverter";
import useFormData from "../../Hooks/useFormData";
import {
  closePageLoading,
  setGeneralPrompt,
  setPageSnackbar,
  showPageLoading,
} from "../../Services/Actions/PageActions";
import AdminApi from "../../Services/Api/AdminApi";
import AdminEntity from "../../Services/Entities/AdminEntity";

interface IAdminDialogUpdate {
  handleClose: () => void;
  successCallback?: () => void;
  admin_pk: number;
}

const form_schema = yup.object({
  emp_id: yup.string().nullable().required().label("Employee Id"),
  prefix: yup.string().nullable().label("Prefix"),
  first_name: yup.string().nullable().required().label("First Name"),
  middle_name: yup.string().nullable().label("Middle Name"),
  last_name: yup.string().nullable().required().label("Last Name"),
  suffix: yup.string().nullable().label("Name Extension"),
  position: yup.string().nullable().required().label("Position"),
  gender: yup.string().nullable().required().label("Gender"),
  mob_no: yup.string().nullable().required().label("Mobile Number"),
  tel_no: yup.string().nullable().label("Telephone Number"),
  email: yup.string().nullable().email().required().label("Email Address"),
});

export const AdminDialogUpdate: FC<IAdminDialogUpdate> = memo((props) => {
  const dispatch = useDispatch();

  const form_instance = useForm<any>({
    resolver: yupResolver(form_schema),
    mode: "onChange",
  });

  const [loading_initial_data, set_loading_initial_data] = useState(false);
  const [selected_record, set_selected_record] = useState<null | AdminEntity>(
    null
  );
  const [error_message, set_error_message] = useState("");

  const handleSubmitForm = useCallback(
    async (data: AdminEntity) => {
      data.admin_pk = selected_record.admin_pk;
      const form_data_payload = new FormData();
      useFormData.convertModelToFormData(data, form_data_payload);
      form_data_payload.append("img_attach", data.img_attach);

      dispatch(
        setGeneralPrompt({
          open: true,
          custom_title: `Are you sure that you want to update this admnistrator?`,
          continue_callback: async () => {
            dispatch(
              showPageLoading({
                show: true,
                loading_message:
                  "Updating admnistrator, thank you for your patience",
              })
            );

            const response = await AdminApi.UpdateAdmin(form_data_payload);

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
                props.handleClose();
              }
              //   form_instance.reset();
            }
          },
        })
      );
    },
    [dispatch, props, selected_record]
  );

  useEffect(() => {
    let mounted = true;

    async function fetchData() {
      set_loading_initial_data(true);
      const selected_record = await AdminApi.GetAdminByAdminPk(props.admin_pk);

      if (selected_record.success) {
        mounted && set_selected_record(selected_record.data);

        const img_attach = dataURLtoImageFile(
          selected_record?.data?.pic_dest,
          "sample.png"
        );

        mounted &&
          form_instance.reset({
            ...selected_record.data,
            img_attach: img_attach,
          });
      } else {
        mounted &&
          set_error_message(
            "Sorry, it looks like we are unable to fetch the some data."
          );
      }

      set_loading_initial_data(false);
    }

    mounted && !!props?.admin_pk && fetchData();

    return () => {
      mounted = false;
    };
  }, [props.admin_pk]);

  return (
    <>
      <FormDialog
        open={!!props.admin_pk}
        title="Fill up all the required fields to update the administrator"
        minWidth={650}
        handleClose={() => props.handleClose()}
        body={
          <>
            {!loading_initial_data ? (
              !!error_message ? (
                <ErrorMessage message={error_message} />
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
                      <Grid container spacing={4}>
                        <Grid item xs={12}>
                          <div style={{ marginBottom: `1em` }}>
                            <Grid container justify="center">
                              <Grid item>
                                <PhotoHookForm
                                  label="Attach the profile photo"
                                  height={170}
                                  width={170}
                                  name="img_attach"
                                />
                              </Grid>
                            </Grid>
                          </div>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <TextFieldHookForm
                            name="emp_id"
                            label="Employee Id"
                            InputLabelProps={{
                              shrink: true,
                            }}
                            required
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <TextFieldHookForm
                            name="first_name"
                            label="First Name"
                            type="text"
                            fullWidth
                            InputLabelProps={{
                              shrink: true,
                            }}
                            required
                          />
                        </Grid>

                        <Grid item xs={12} md={6}>
                          <TextFieldHookForm
                            name="middle_name"
                            label="Middle Name"
                            fullWidth
                            type="text"
                            InputLabelProps={{
                              shrink: true,
                            }}
                          />
                        </Grid>

                        <Grid item xs={12} md={6}>
                          <TextFieldHookForm
                            name="last_name"
                            label="Last Name"
                            fullWidth
                            InputLabelProps={{
                              shrink: true,
                            }}
                            required
                            type="text"
                          />
                        </Grid>

                        <Grid item xs={12} md={6}>
                          <TextFieldHookForm
                            name="suffix"
                            label="Suffix"
                            InputLabelProps={{
                              shrink: true,
                            }}
                          />
                        </Grid>

                        <Grid item xs={12} md={6}>
                          <AutocompleteHookForm
                            name="position"
                            label="Position"
                            fullWidth={true}
                            InputLabelProps={{
                              shrink: true,
                            }}
                            options={[
                              {
                                id: "Tech Support",
                                label: "Tech Support",
                              },
                              {
                                id: "Software Developer",
                                label: "Software Developer",
                              },
                            ]}
                          />
                        </Grid>

                        <Grid item xs={12} md={6}>
                          <MultiRadioFieldHookForm
                            name="gender"
                            label="Gender"
                            row={true}
                            required
                            size="small"
                            variant="standard"
                            radio_items={[
                              {
                                value: "m",
                                label: "Male",
                              },
                              {
                                value: "f",
                                label: "Female",
                              },
                            ]}
                          />
                        </Grid>

                        <Grid item xs={12} md={6}>
                          <MultiRadioFieldHookForm
                            name="is_active"
                            label="Active Status"
                            row={true}
                            required
                            size="small"
                            variant="standard"
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

                        <Grid item xs={12} md={6}>
                          <TextFieldHookForm
                            name="email"
                            type="email"
                            label="Email Address"
                            fullWidth
                            InputLabelProps={{
                              shrink: true,
                            }}
                            required
                          />
                        </Grid>

                        <Grid item xs={12} md={6}>
                          <TextFieldHookForm
                            label="Mobile Number"
                            name="mob_no"
                            fullWidth
                            type="numberonly"
                            InputLabelProps={{
                              shrink: true,
                            }}
                            required
                            InputProps={{
                              inputComponent: MaskedPhoneNumber,
                            }}
                          />
                        </Grid>
                      </Grid>
                    </div>
                  </form>
                </FormProvider>
              )
            ) : (
              <BodyLoader />
            )}
          </>
        }
        actions={
          <>
            <Button
              color="primary"
              form="form_instance"
              variant="contained"
              type="submit"
            >
              Update Administrator
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                form_instance.reset();
              }}
            >
              Reset Form
            </Button>
          </>
        }
      />
    </>
  );
});

export default AdminDialogUpdate;

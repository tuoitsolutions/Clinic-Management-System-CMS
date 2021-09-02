import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Grid } from "@material-ui/core";
import React, { FC, memo, useCallback, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import * as yup from "yup";
import BodyLoader from "../../Component/BodyLoader";
import ErrorMessage from "../../Component/ErrorMessage";
import FormDialog from "../../Component/FormDialog/FormDialog";
import AutocompleteHookForm from "../../Component/HookForm/AutocompleteHookForm";
import MultiRadioFieldHookForm from "../../Component/HookForm/MultiRadioFieldHookForm";
import PhotoHookForm from "../../Component/HookForm/PhotoHookForm";
import TextFieldHookForm from "../../Component/HookForm/TextFieldHookForm";
import MaskedPhoneNumber from "../../Component/Mask/MaskedPhoneNumber";
import useFormData from "../../Hooks/useFormData";
import {
  closePageLoading,
  setGeneralPrompt,
  setPageSnackbar,
  showPageLoading,
} from "../../Services/Actions/PageActions";
import HosResidentApi from "../../Services/Api/HospResidentApi";
import LibraryApi from "../../Services/Api/LibraryApi";
import HospResidentEntity from "../../Services/Entities/HospResidentEntity";
import { OptionItemModel } from "../../Services/Models/OptionModel";
import { RootStore } from "../../Services/Store";

interface IAdminDialogCreate {
  open: boolean;
  handleClose: () => void;
  successCallback?: () => void;
}

const form_schema = yup.object({
  license_no: yup.string().required().nullable().label("License Number"),
  dept_pk: yup.string().nullable().label("Department"),
  spclty_pk: yup.string().required().nullable().label("Specialty"),
  doc_title: yup.string().nullable().label("Doctor's Title"),
  first_name: yup.string().required().nullable().label("First Name"),
  middle_name: yup.string().nullable().label("Middle Name"),
  last_name: yup.string().required().nullable().label("Last Name"),
  suffix: yup.string().nullable().label("Suffix"),
  gender: yup.string().required().nullable().label("Gender"),
  mob_no: yup.string().required().nullable().label("Mobile Number"),
  tel_no: yup.string().label("Telephone Number"),
  email: yup.string().email().required().nullable().label("Email Address"),
  is_active: yup.string().required().nullable().label("Is Active"),
});

export const AdminDialogCreate: FC<IAdminDialogCreate> = memo((props) => {
  const dispatch = useDispatch();
  const user_type = useSelector(
    (store: RootStore) => store.UserReducer.user?.user_type
  );
  const form_instance = useForm<any>({
    resolver: yupResolver(form_schema),
    mode: "onChange",
  });

  const [loading_initial_data, set_loading_initial_data] = useState(false);
  const [doc_specialty_options, set_doc_specialty_options] = useState<
    Array<OptionItemModel>
  >([]);
  const [dept_options, set_dept_options] = useState<Array<OptionItemModel>>([]);
  const [error_message, set_error_message] = useState("");

  const handleSubmitForm = useCallback(
    async (data: HospResidentEntity) => {
      const form_data_payload = new FormData();
      useFormData.convertModelToFormData(data, form_data_payload);
      form_data_payload.append("img_attach", data.img_attach);

      dispatch(
        setGeneralPrompt({
          open: true,
          custom_title: `Are you sure that you want to add this hospital resident?`,
          continue_callback: async () => {
            dispatch(
              showPageLoading({
                show: true,
                loading_message:
                  "Adding hospital resident, thank you for your patience",
              })
            );

            const response = await HosResidentApi.InsertHospResident(
              form_data_payload
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
                props.handleClose();
              }
              form_instance.reset();
            }
          },
        })
      );
    },
    [dispatch, form_instance, props]
  );

  useEffect(() => {
    let mounted = true;

    async function fetchData() {
      set_loading_initial_data(true);
      const spclty_opt_res = await LibraryApi.DoctorSpecialtyOptions();
      const dept_opt_res = await LibraryApi.GetDepartmentOptions();

      if (spclty_opt_res.success && dept_opt_res.success) {
        mounted && set_doc_specialty_options(spclty_opt_res.data);
        mounted && set_dept_options(dept_opt_res.data);
      } else {
        mounted &&
          set_error_message(
            "Sorry, it looks like we are unable to fetch the some data."
          );
      }

      set_loading_initial_data(false);
    }

    mounted && fetchData();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <>
      <FormDialog
        open={props.open}
        title="Fill up all the required fields to register a new hospital resident"
        minWidth={650}
        handleClose={() => {
          props.handleClose();
        }}
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
                      <Grid container spacing={3}>
                        <Grid item xs={12}>
                          <div style={{ marginBottom: `1em` }}>
                            <Grid container justify="center">
                              <Grid item>
                                <PhotoHookForm
                                  label="Attach the profile photo"
                                  height={150}
                                  width={150}
                                  name="img_attach"
                                />
                              </Grid>
                            </Grid>
                          </div>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <TextFieldHookForm
                            name="license_no"
                            label="License Number"
                            InputLabelProps={{
                              shrink: true,
                            }}
                            fullWidth
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

                        <Grid item xs={12} sm={3}>
                          <TextFieldHookForm
                            name="suffix"
                            label="Suffix"
                            InputLabelProps={{
                              shrink: true,
                            }}
                            fullWidth
                          />
                        </Grid>

                        <Grid item xs={12} sm={3}>
                          <TextFieldHookForm
                            name="doc_title"
                            label="Title"
                            fullWidth
                            InputLabelProps={{
                              shrink: true,
                            }}
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
                          <AutocompleteHookForm
                            name="spclty_pk"
                            label="Specialty"
                            fullWidth={true}
                            InputLabelProps={{
                              shrink: true,
                            }}
                            options={doc_specialty_options}
                            required
                          />
                        </Grid>

                        {user_type === "admin" && (
                          <Grid item xs={12} md={6}>
                            <AutocompleteHookForm
                              name="dept_pk"
                              label="Department"
                              fullWidth={true}
                              InputLabelProps={{
                                shrink: true,
                              }}
                              options={dept_options}
                            />
                          </Grid>
                        )}

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
              Save
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                form_instance.reset();
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

export default AdminDialogCreate;

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
import PhotoHookForm from "../../Component/HookForm/PhotoHookForm";
import TextFieldHookForm from "../../Component/HookForm/TextFieldHookForm";
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
import HospResidentApi from "../../Services/Api/HospResidentApi";
import HosResidentApi from "../../Services/Api/HospResidentApi";
import LibraryApi from "../../Services/Api/LibraryApi";
import HospResidentEntity from "../../Services/Entities/HospResidentEntity";
import { OptionItemModel } from "../../Services/Models/OptionModel";

interface IAdminDialogUpdate {
  handleClose: () => void;
  successCallback?: () => void;
  res_pk: number;
}

const form_schema = yup.object({
  doc_id: yup.string().required().label("Employee Id"),
  spclty_pk: yup.string().required().label("Employee Id"),
  prefix: yup.string().label("Prefix"),
  first_name: yup.string().required().label("First Name"),
  middle_name: yup.string().label("Middle Name"),
  last_name: yup.string().required().label("Last Name"),
  suffix: yup.string().label("Name Extension"),
  gender: yup.string().required().label("Gender"),
  mob_no: yup.string().required().label("Mobile Number"),
  tel_no: yup.string().label("Telephone Number"),
  email: yup.string().email().required().label("Email Address"),
});

export const AdminDialogUpdate: FC<IAdminDialogUpdate> = memo((props) => {
  const dispatch = useDispatch();

  const form_instance = useForm<any>({
    resolver: yupResolver(form_schema),
    mode: "onChange",
  });

  const [loading_initial_data, set_loading_initial_data] = useState(false);
  const [selected_record, set_selected_record] =
    useState<null | HospResidentEntity>(null);
  const [doc_specialty_options, set_doc_specialty_options] = useState<
    Array<OptionItemModel>
  >([]);
  const [error_message, set_error_message] = useState("");

  const handleSubmitForm = useCallback(
    async (data: HospResidentEntity) => {
      data.res_pk = selected_record.res_pk;
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

            const response = await HosResidentApi.UpdateHospResident(
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
              }
              form_instance.reset();
            }
          },
        })
      );
    },
    [dispatch, form_instance, props, selected_record?.res_pk]
  );

  useEffect(() => {
    let mounted = true;

    async function fetchData() {
      set_loading_initial_data(true);
      const selected_record =
        await HospResidentApi.GetHospResidentByHospResidentPk(props.res_pk);
      const doc_spcly_opt_res = await LibraryApi.DoctorSpecialtyOptions();

      if (selected_record.success && doc_spcly_opt_res.success) {
        mounted && set_selected_record(selected_record.data);
        mounted && set_doc_specialty_options(doc_spcly_opt_res.data);

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
        let msg = "";
        if (!selected_record.success) {
          msg = msg + selected_record.message?.toString();
        }

        if (!doc_spcly_opt_res.success) {
          msg = msg + doc_spcly_opt_res.message?.toString();
        }
        mounted && set_error_message(msg);
      }

      set_loading_initial_data(false);
    }

    mounted && !!props?.res_pk && fetchData();

    return () => {
      mounted = false;
    };
  }, [props?.res_pk]);

  return (
    <>
      <FormDialog
        open={!!props.res_pk}
        title="Fill up all the required fields to update the hospital resident"
        minWidth={500}
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
                        <Grid item xs={12} md={3}>
                          <TextFieldHookForm
                            name="doc_id"
                            label="Doctor Id"
                            InputLabelProps={{
                              shrink: true,
                            }}
                            required
                          />
                        </Grid>
                        <Grid item xs={12} md={3}>
                          <TextFieldHookForm
                            name="prefix"
                            label="Prefix"
                            fullWidth
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
                            name="spclty_pk"
                            label="Specialty"
                            fullWidth={true}
                            InputLabelProps={{
                              shrink: true,
                            }}
                            options={doc_specialty_options}
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
            <Button
              variant="contained"
              color="secondary"
              onClick={() => {
                props.handleClose();
              }}
            >
              Close
            </Button>
          </>
        }
      />
    </>
  );
});

export default AdminDialogUpdate;

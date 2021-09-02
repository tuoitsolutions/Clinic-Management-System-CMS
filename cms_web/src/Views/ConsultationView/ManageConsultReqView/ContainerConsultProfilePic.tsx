import { Skeleton } from "@material-ui/lab";
import React, { FC, memo, useEffect, useState } from "react";
import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import img_def_patient from "../../../Assets/Images/Icons/patient.png";
import PhotoField from "../../../Component/PhotoField/PhotoField";
import { dataURLtoImageFile } from "../../../Hooks/UseFileConverter";
import useFormData from "../../../Hooks/useFormData";
import {
  setGeneralPrompt,
  showPageLoading,
  closePageLoading,
  setPageSnackbar,
} from "../../../Services/Actions/PageActions";
import ConsultMedApi from "../../../Services/Api/ConsultMedApi";
import ConsultRequestApi from "../../../Services/Api/ConsultRequestApi";

interface IConsultProfilePic {}

const ConsultProfilePic: FC<IConsultProfilePic> = memo(() => {
  const { hash_key } = useParams();
  const dispatch = useDispatch();

  const [fetch_profile_pic, set_fetch_profile_pic] = useState(false);
  const [attach_pic_file, set_attach_pic_file] = useState<any>(null);

  const [refetch_profile_pic, set_refetch_profile_pic] = useState(0);

  const handleChangeProfilePic = useCallback(
    async (file: File) => {
      if (!!hash_key && !!file) {
        dispatch(
          setGeneralPrompt({
            open: true,
            custom_title: `Are you sure that you want to change the requestor's image?`,
            continue_callback: async () => {
              dispatch(
                showPageLoading({
                  show: true,
                  loading_message:
                    "Updating picture, thank you for your patience",
                })
              );

              const payload = new FormData();
              useFormData.convertModelToFormData(
                { hash_key: hash_key },
                payload
              );

              payload.append("attach_profile_pic", file);

              const response = await ConsultRequestApi.UpdateConsultPatPic(
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
                set_refetch_profile_pic((c) => c + 1);
              }
            },
          })
        );
      }
    },
    [dispatch, hash_key]
  );

  useEffect(() => {
    let mounted = true;

    async function fetchData() {
      set_fetch_profile_pic(true);

      if (!!hash_key) {
        const consult_pic_res = await ConsultRequestApi.GetConsultPatPic(
          hash_key
        );

        if (consult_pic_res.success) {
          const file = dataURLtoImageFile(
            consult_pic_res.data?.pic_dest,
            `${consult_pic_res.data?.consult_req_pk}-profile-pic.png`
          );

          mounted && set_attach_pic_file(file);
        } else {
          //   mounted && set_error_message(msg);
        }

        set_fetch_profile_pic(false);
      }
    }

    mounted && fetchData();

    return () => {
      mounted = false;
    };
  }, [hash_key, refetch_profile_pic]);

  return (
    <>
      <PhotoField
        handleChange={(file) => {
          handleChangeProfilePic(file);
        }}
        name="pat-profile-pic"
        spacing={16}
        alt={img_def_patient}
        selectedFile={attach_pic_file}
        loading={fetch_profile_pic}
      />
    </>
  );
});

export default ConsultProfilePic;

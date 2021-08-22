import React, { FC, memo } from "react";
import { useDispatch } from "react-redux";
import FormDialog from "../../Component/FormDialog/FormDialog";
import { PAYMONG_SERVER_URL } from "../../Helpers/AppConfig";
import { setPageSnackbar } from "../../Services/Actions/PageActions";
import PaymongoApi from "../../Services/Api/PaymongoApi";
import { PaymentIntentAttachModel } from "../../Services/Models/PaymongoModel";
interface ICard3dSecureDialog {
  open: boolean;
  handleClose: () => void;
  payment_intent_attach: PaymentIntentAttachModel;
  hash_key: string;
}

const Card3dSecureDialog: FC<ICard3dSecureDialog> = memo(
  ({ open, handleClose, payment_intent_attach, hash_key }) => {
    const dispatch = useDispatch();

    const iframe = `<iframe src="${payment_intent_attach.secure_3d_link}" width="100%" height="500"></iframe>`;

    window.addEventListener(
      "message",
      async (ev) => {
        console.log(`ev.data`, ev.data);
        if (ev.data === "3DS-authentication-complete") {
          // 3D Secure authentication is complete. You can requery the payment intent again to check the status.
          // alert(
          //   `3D Secure authentication is complete. You can requery the payment intent again to check the status.`
          // );
          // window.location.href = `${PAYMONG_SERVER_URL}payment/success/${hash_key}`;

          const attach_pay_method_res = await PaymongoApi.ReattachPaymentIntent(
            payment_intent_attach.payment_intent_client_key,
            payment_intent_attach.pay_method_id,
            payment_intent_attach.public_key
          );
          console.log(`attach_pay_method_res`, attach_pay_method_res);
          if (attach_pay_method_res.success) {
            const attach_pay_method_data = attach_pay_method_res?.data?.data;
            const payment_intent_status =
              attach_pay_method_data?.attributes?.status;
            console.log(`payment_intent_status`, payment_intent_status);
            if (payment_intent_status === "succeeded") {
              console.log(
                ` You already received your customer's payment. You can show a success message from this condition.`
              );
              window.location.href = `${PAYMONG_SERVER_URL}payment/success`;
            } else if (payment_intent_status === "awaiting_payment_method") {
              console.log(
                ` The PaymentIntent encountered a processing error. You can refer to paymentIntent.attributes.last_payment_error to check the error and render the appropriate error message.`
              );
              window.location.href = `${PAYMONG_SERVER_URL}payment/failed`;
            } else if (payment_intent_status === "processing") {
              console.log(
                ` You need to requery the PaymentIntent after a second or two. This is a transitory status and should resolve to succeeded or awaiting_payment_method quickly.`
              );
            }
          } else {
            if (attach_pay_method_res?.paymongo_errors instanceof Array) {
              attach_pay_method_res?.paymongo_errors.forEach((err) => {
                dispatch(
                  setPageSnackbar(`${err.code}: ${err.detail}`, "error")
                );
              });
            } else {
              dispatch(
                setPageSnackbar(
                  attach_pay_method_res.message.toString(),
                  "error"
                )
              );
            }
          }
        }
      },
      false
    );

    return (
      !!payment_intent_attach && (
        <>
          <FormDialog
            open={open}
            handleClose={() => handleClose()}
            title="Credit/Debit Card 3D Secure Authentication"
            minWidth={600}
            body={
              <div style={{ padding: `1em 2em` }}>
                <div className="cntr-title">
                  <div className="sub">
                    Kindly wait for the 3D Secure Authentication to be loaded.
                  </div>
                </div>
                <div
                  dangerouslySetInnerHTML={{
                    __html: iframe,
                  }}
                />
              </div>
            }
          />
        </>
      )
    );
  }
);

export default Card3dSecureDialog;

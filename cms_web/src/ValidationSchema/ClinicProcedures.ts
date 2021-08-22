import * as yup from "yup";

export const UpdateClinicProcSchema = yup.object({
  procno: yup.number().required(),
  isactive: yup.string().required(),
  procdesc: yup.string().required().max(255).label("Description"),
  regprice: yup
    .number()
    .required()
    .moreThan(0)
    .lessThan(100000)
    .label("Regular Price"),
});

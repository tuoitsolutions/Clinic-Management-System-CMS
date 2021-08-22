import CardEntity from "../Services/Entities/CardEntity";
import CheckEntity from "../Services/Entities/CheckEntity";
import TransacDtlsEntity from "../Services/Entities/TransacDtlsEntity";
import HelpNumber from "./HelpNumber";

const CalcCartSubtotal = (cart_items: Array<TransacDtlsEntity>) => {
  let total: number = 0.0;
  cart_items.forEach((c) => {
    total = total + c.subtotal;
  });
  return total;
};

const CalcTotalCard = (cards: Array<CardEntity>) => {
  let total: number = 0.0;
  cards.forEach((c) => {
    const amount = HelpNumber.StringToDecimal(c.amount, ",");
    total = total + amount;
  });
  return total;
};
const CalcTotalCheck = (checks: Array<CheckEntity>) => {
  let total: number = 0.0;
  checks.forEach((c) => {
    const amount = HelpNumber.StringToDecimal(c.amount, ",");
    total = total + amount;
  });
  return total;
};

const CalcTotalPayment = (
  cards: Array<CardEntity>,
  checks: Array<CheckEntity>,
  cash: number | ""
) => {
  let total_card: number = 0.0;
  cards.forEach((c) => {
    const amount = HelpNumber.StringToDecimal(c.amount, ",");
    total_card = total_card + amount;
  });
  let total_check: number = 0.0;
  checks.forEach((c) => {
    const amount = HelpNumber.StringToDecimal(c.amount, ",");
    total_check = total_check + amount;
  });

  let fix_cash = 0.0;

  if (!!cash) {
    if (typeof cash === "string") {
      fix_cash = HelpNumber.StringToDecimal(cash, ",");
    } else {
      fix_cash = cash;
    }
  }

  const total_payment = fix_cash + total_card + total_check;

  console.log(`total_payment`, total_payment);

  return total_payment;
};

const CalcDiscount = (
  cart_items: Array<TransacDtlsEntity>,
  discount_rate: number | ""
) => {
  let total: number = 0.0;
  cart_items.forEach((c) => {
    total = total + c.subtotal;
  });

  let fix_disc_rate: number = 0.0;
  if (typeof discount_rate === "string" && discount_rate === "") {
  } else {
    fix_disc_rate = discount_rate;
  }

  return total * (fix_disc_rate / 100);
};

const CalcGrossTotal = (
  cart_items: Array<TransacDtlsEntity>,
  discount_rate: number | ""
) => {
  let total: number = 0.0;
  cart_items.forEach((c) => {
    total = total + c.subtotal;
  });

  let fix_disc_rate: number = 0.0;
  if (typeof discount_rate === "string" && discount_rate === "") {
  } else {
    fix_disc_rate = discount_rate;
  }

  let discount_amount = total * (fix_disc_rate / 100);
  return total - discount_amount;
};

const CalcVat = (cart_items: Array<TransacDtlsEntity>, vat_rate: number) => {
  let total: number = 0.0;
  cart_items.forEach((c) => {
    total = total + c.subtotal;
  });

  const vat_amount = total - total / (vat_rate / 100 + 1);

  return vat_amount;
};

export default {
  CalcCartSubtotal,
  CalcDiscount,
  CalcGrossTotal,
  CalcVat,
  CalcTotalCard,
  CalcTotalCheck,
  CalcTotalPayment,
};

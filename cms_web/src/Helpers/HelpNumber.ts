const StringToDecimal = (str: number | string, remove_char: string) => {
  if (!!str) {
    const new_str: string = str.toString();
    return parseFloat(new_str.replace(remove_char, ""));
  }
  return undefined;
};

const NumberToMoney = (num: number | "") => {
  if (typeof num === "string") {
    return 0.0;
  }
  return num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const NumberToDecimal = (num: number) => {
  return parseFloat(num.toFixed(2));
};

export default {
  StringToDecimal,
  NumberToMoney,
  NumberToDecimal,
};

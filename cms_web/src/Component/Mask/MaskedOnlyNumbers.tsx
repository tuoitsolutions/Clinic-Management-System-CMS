import React, { memo } from "react";
import MaskedInput from "react-text-mask";

const MaskedOnlyNumbers = memo((props: any) => {
  const { inputRef, ...other } = props;

  return (
    <MaskedInput
      {...other}
      ref={(ref) => {
        inputRef(ref ? ref?.inputElement : null);
      }}
      mask={decimalMaskOpt({ decimalPlaces: 2 })}
      style={{
        textAlign: `end`,
      }}
    />
  );
});

export default MaskedOnlyNumbers;

const decimalMaskOpt = ({
  thousandsSeparatorSymbol = ",",
  decimalSymbol = ".",
  decimalPlaces = 2,
} = {}) => {
  return (input) => {
    var digits = (input.match(/\d/gi) || []).length;

    if (digits <= decimalPlaces) return Array(decimalPlaces).fill(/\d/);

    if (digits === decimalPlaces - 1) {
      return [/\d/, decimalSymbol, ...Array(decimalPlaces).fill(/\d/)];
    }

    var mask = [];
    for (var i = digits - 1; i >= 0; i--) {
      mask.push(/\d/);
      if (i == digits - decimalPlaces) {
        mask.push(decimalSymbol);
      }

      const r = digits - i;
      if (r >= decimalPlaces + 2 && (r - decimalPlaces) % 3 == 0 && i > 0) {
        mask.push(thousandsSeparatorSymbol);
      }
    }

    return mask.reverse();
  };
};

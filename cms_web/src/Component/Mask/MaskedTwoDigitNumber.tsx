import React, { memo } from "react";
import MaskedInput from "react-text-mask";

const MaskedTwoDigitNumber = memo((props: any) => {
  const { inputRef, ...other } = props;

  return (
    <MaskedInput
      {...other}
      ref={(ref) => {
        inputRef(ref ? ref.inputElement : null);
      }}
      mask={[/\d/, /\d/]}
      showMask
      guide={false}
      type="text"
    />
  );
});

export default MaskedTwoDigitNumber;

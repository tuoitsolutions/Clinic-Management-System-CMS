import React, { memo } from "react";
import MaskedInput from "react-text-mask";

const MaskedMonth = memo((props: any) => {
  const { inputRef, ...other } = props;

  return (
    <MaskedInput
      {...other}
      ref={(ref) => {
        inputRef(ref ? ref.inputElement : null);
      }}
      placeholder={"MM"}
      mask={[/[0-1]/, /\d/]}
      showMask
      guide={false}
    />
  );
});

export default MaskedMonth;

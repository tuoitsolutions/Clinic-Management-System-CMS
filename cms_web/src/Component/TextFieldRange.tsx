import { useTheme } from "@material-ui/styles";
import React, { FC, memo } from "react";
import { MaskedInputProps } from "react-text-mask";
import styled from "styled-components";

interface ExtendPropsInterface {
  MaskedInput?: any;
}

interface TextFieldRangeInterface {
  FirstField?: any;
  SecondField?: any;
  label?: string;
  error?: boolean;
  helperText?: string;
}

export const TextFieldRange: FC<TextFieldRangeInterface> = memo(
  ({ FirstField, SecondField, label, error, helperText }) => {
    const theme = useTheme();
    return (
      <StyledTextFieldRange theme={theme}>
        <div
          className="field-group"
          style={{
            borderColor: error ? `red` : "",
          }}
        >
          <label>{label}</label>
          <div className="input-group">
            {FirstField}
            <span className="separator">/</span>
            {SecondField}
          </div>
        </div>
        {helperText && (
          <small
            style={{
              color: error ? `red` : "inherit",
            }}
            className="helper-text"
          >
            {helperText}
          </small>
        )}
      </StyledTextFieldRange>
    );
  }
);

export default TextFieldRange;

export const StyledTextFieldRange = styled.div`
  .field-group {
    border: 0.03em solid rgba(0, 0, 0, 0.2);
    border-radius: 5px;
    display: grid;
    align-items: center;
    /* height: 55px; */
    height: 40px;
    grid-auto-rows: 15px 1fr;
    &:hover {
      border: 2px solid ${(props) => props.theme.palette.primary.main};
    }
    label {
      margin-top: -5px;
      /* margin-left: -10px; */
      font-weight: 500;
      padding: 0 0.5em;
      color: rgba(0, 0, 0, 0.65);
      z-index: 1;
      background-color: #fff;
      justify-self: start;
      transform: translate(-6px, -6px) scale(0.75);
    }

    .input-group {
      margin-top: -13px;
      display: grid;
      /* margin-bottom: 25px !important; */
      margin-left: 10px;
      margin-right: 10px;
      grid-gap: 2px;
      grid-auto-flow: column;

      input {
        width: auto;
        border: none;
        height: 100%;
        font-size: 1em;
        width: 100%;
      }

      .separator {
        background-color: #e0dede;
        border-radius: 3px;
        padding: 0 0.3em;
        font-size: 1.1em;
        font-weight: 600;
      }
    }
  }

  .helper-text {
    margin-left: 1em;
    font-size: 0.75em;
    font-weight: 500;
    transform: translate(-6px, -6px) scale(0.75);
  }
`;

import { IconButton, Paper, Popover } from "@material-ui/core";
import FilterListRoundedIcon from "@material-ui/icons/FilterListRounded";
import React, { FC, memo } from "react";
import styled from "styled-components";
interface IDataTableSearch {
  width?: number;
}

export const DataTableSearch: FC<IDataTableSearch> = memo(
  ({ children, width }) => {
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
      null
    );

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
      setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? "simple-popover" : undefined;

    return (
      <div>
        <IconButton
          type="button"
          color="primary"
          style={
            {
              // backgroundColor: `red`,
            }
          }
          aria-describedby={id}
          onClick={handleClick}
        >
          <FilterListRoundedIcon color="primary" />
        </IconButton>
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          <PopperContent
            style={{
              minWidth: !!width ? width : 650,
              maxWidth: !!width ? width : 650,
            }}
          >
            <div className="popper-content">
              <div className="title">Filter Records</div>
              <div className="content">{children}</div>
            </div>
          </PopperContent>
        </Popover>
      </div>
    );
  }
);

export default DataTableSearch;

const PopperContent = styled(Paper)`
  padding: 0.5em;
  display: grid;
  grid-gap: 0.5em;

  .popper-content {
    padding: 0.5em;

    .title {
      font-weight: 900;
      font-size: 0.83em;
      opacity: 0.6;
    }

    .content {
      padding: 1em;
    }
  }
`;

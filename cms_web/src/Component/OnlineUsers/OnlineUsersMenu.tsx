import {
  Avatar,
  Badge,
  Button,
  IconButton,
  Popover,
  useTheme,
} from "@material-ui/core";
import React from "react";
import { StyledOnlineUsersMenu, StyledOnlineUsersMenuPopOver } from "./styles";
import PeopleOutlineRoundedIcon from "@material-ui/icons/PeopleOutlineRounded";
import { RootStore } from "../../Services/Store";
import { useDispatch, useSelector } from "react-redux";
import { setGeneralPrompt } from "../../Services/Actions/PageActions";
const OnlineUsersMenu = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const theme = useTheme();
  const dispatch = useDispatch();

  const online_users = useSelector(
    (store: RootStore) => store.UserReducer.online_users
  );

  const admin_socket_con = useSelector(
    (store: RootStore) => store.UserReducer.admin_socket_con
  );

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  return (
    <StyledOnlineUsersMenu theme={theme}>
      <IconButton
        aria-describedby={id}
        color="primary"
        size="small"
        onClick={handleClick}
        className="icon-header"
      >
        <Badge
          badgeContent={online_users?.length}
          showZero={true}
          color="secondary"
        >
          <PeopleOutlineRoundedIcon />
        </Badge>
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
          horizontal: "center",
        }}
      >
        <StyledOnlineUsersMenuPopOver
          theme={theme}
          className="content-container"
        >
          <div className="content-header">
            <div className="info">
              <div className="value">{online_users?.length}</div>
              <div className="title">Online Users</div>
            </div>
            <div className="btn">
              <Button
                variant="contained"
                color="primary"
                disableElevation
                onClick={async () => {
                  dispatch(
                    setGeneralPrompt({
                      open: true,
                      continue_callback: async () => {
                        await admin_socket_con.send("AlertUpdateMessage");
                        handleClose();
                      },
                    })
                  );
                }}
              >
                Notify for Update
              </Button>
            </div>
          </div>
          <div className="content-body">
            {online_users?.map((user, index) => (
              <div className="online-user" key={index}>
                <Avatar className="img">
                  {user.empname.length > 0 ? user.empname.charAt(0) : "U"}
                </Avatar>
                <span className="name">{user.empname}</span>
                <span className="group">{user.usergroup}</span>
              </div>
            ))}
          </div>
        </StyledOnlineUsersMenuPopOver>
      </Popover>
    </StyledOnlineUsersMenu>
  );
};

export default OnlineUsersMenu;

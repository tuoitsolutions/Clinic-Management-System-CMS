import { Popover, useTheme } from "@material-ui/core";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import React, { memo, useCallback } from "react";
import { useHistory } from "react-router-dom";
import { removeToken } from "../../Helpers/AppConfig";
import UserEntity from "../../Services/Entities/UserEntity";
import CustomAvatar from "../CustomAvatar";
import { StyledPopOverContent, StyledUserProfile } from "./styles";

interface IUserProfile {
  variant: "mobile" | "desktop";
  user: UserEntity;
}

const UserProfile: React.FC<IUserProfile> = memo(({ variant, user }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const history = useHistory();
  const theme = useTheme();

  const handleClick = useCallback((event) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleLogout = useCallback(() => {
    removeToken();
    window.location.href = "/login";
  }, []);

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <StyledUserProfile>
      <div className="header" aria-describedby={id} onClick={handleClick}>
        <CustomAvatar
          className="profile-image"
          alt={user?.full_name?.charAt(0)}
          spacing={5}
        />
        {open ? (
          <ExpandLessIcon className="icon" fontSize="small" />
        ) : (
          <ExpandMoreIcon className="icon" fontSize="small" />
        )}

        {variant === "mobile" ? null : (
          <div className="user">
            <div className="fullname">{user?.full_name}</div>
            <div className="designation">
              {user?.user_type === "hosp_resident" && "Resident"}
              {user?.user_type === "admin" && "Administrator"}
            </div>
          </div>
        )}
      </div>
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
        <StyledPopOverContent theme={theme} className="content-container">
          <div className="content-header">
            <CustomAvatar
              className="content-header-image"
              spacing={5}
              alt={user?.full_name?.charAt(0)}
            />
            <div className="content-header-user">
              <div className="name">{user?.full_name}</div>
              <div className="designation">
                {" "}
                {user?.user_type === "hosp_resident" && "Resident"}
                {user?.user_type === "admin" && "Administrator"}
              </div>
            </div>
          </div>
          <div className="content-body">
            <div className="content-title">Menus</div>
            <div className="content-items">
              <div
                className="link"
                onClick={() => {
                  history.push(`/profile/general`);
                }}
              >
                Profile
              </div>
            </div>
            <div className="content-items">
              <div className="link" onClick={handleLogout}>
                Logout
              </div>
            </div>
          </div>
        </StyledPopOverContent>
      </Popover>
    </StyledUserProfile>
  );
});

export default UserProfile;

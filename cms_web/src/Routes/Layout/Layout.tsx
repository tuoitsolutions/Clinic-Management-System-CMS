import React, { memo, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DefaultValuesActions from "../../Services/Actions/DefaultValuesActions";
import { setCurrentUserAction } from "../../Services/Actions/UserActions";
import UserEntity from "../../Services/Entities/UserEntity";
import { RootStore } from "../../Services/Store";
import Body from "./Body";
import FooterLayout from "./FooterLayout";
import Header from "./Header";
import MobileSidebar from "./MobileSidebar";

export interface IPageNavLinks {
  hasSubLinks: boolean;
  text: string;
  to: string;
  parentKey?: string;
  navLinks?: Array<any>;
}

const generateNavLinks = (user: UserEntity): Array<IPageNavLinks> => {
  if (!user) {
    return [];
  }

  let PageNavLinks: Array<IPageNavLinks> = [];

  if (user.user_type === "admin") {
    PageNavLinks = [
      {
        hasSubLinks: false,
        text: "Dashboard",
        to: "/dashboard",
      },
      {
        hasSubLinks: false,
        text: "Requests",
        to: "/request",
      },
      {
        hasSubLinks: false,
        text: "Departments",
        to: "/department",
      },
      {
        hasSubLinks: false,
        text: "Residents",
        to: "/resident",
      },
      {
        hasSubLinks: false,
        text: "Administrators",
        to: "/administrator",
      },
    ];
  }

  if (user.user_type === "hosp_resident") {
    PageNavLinks = [
      {
        hasSubLinks: false,
        text: "Dashboard",
        to: "/dashboard",
      },
      {
        hasSubLinks: false,
        text: "Requests",
        to: "/request",
      },
      {
        hasSubLinks: false,
        text: "Residents",
        to: "/resident",
      },
    ];
  }

  return PageNavLinks;
};

const Layout = memo(({ children }) => {
  const dispatch = useDispatch();
  const user = useSelector((reducers: RootStore) => reducers.UserReducer.user);

  console.log(`user`, user);

  const [isOpenMobileHeader, setIsOpenMobileHeader] = useState(false);

  const handleToggleHeader = useCallback(() => {
    setIsOpenMobileHeader((prevHeader) => !prevHeader);
  }, []);

  const [isOpenMobileSidebar, setIsOpenMobileSidebar] = useState(false);

  const handleCloseMobileSidebar = useCallback(() => {
    setIsOpenMobileSidebar(false);
  }, []);

  const handleToggleSidebar = useCallback(() => {
    setIsOpenMobileSidebar((prevSidebar) => !prevSidebar);
  }, []);

  useEffect(() => {
    let mounted = true;
    const getUserInfo = async () => {
      dispatch(setCurrentUserAction());
    };

    mounted && getUserInfo();

    return () => {
      mounted = false;
    };
  }, [dispatch]);

  useEffect(() => {
    let mounted = true;

    const fetchHospDefValues = () => {
      dispatch(DefaultValuesActions.setHospitalNameAction());
      dispatch(DefaultValuesActions.setHospitalLogoAction());
    };

    mounted && fetchHospDefValues();

    return () => {
      mounted = false;
    };
  }, [dispatch]);
  return (
    <>
      <Header
        PageNavLinks={generateNavLinks(user)}
        isOpenMobileHeader={isOpenMobileHeader}
        handleToggleHeader={handleToggleHeader}
        handleToggleSidebar={handleToggleSidebar}
        isOpenMobileSidebar={isOpenMobileSidebar}
        user={user}
      />
      <MobileSidebar
        PageNavLinks={generateNavLinks(user)}
        isOpenMobileSidebar={isOpenMobileSidebar}
        handleCloseMobileSidebar={handleCloseMobileSidebar}
        user={user}
      />
      <Body isOpenMobileHeader={isOpenMobileHeader}>{children}</Body>
      <FooterLayout />
    </>
  );
});

export default Layout;

import {
  createStyles,
  Fade,
  Grow,
  Tab,
  Tabs,
  Theme,
  useMediaQuery,
  useTheme,
  withStyles,
} from "@material-ui/core";
import { AnimatePresence, motion } from "framer-motion";
import React, { memo, useCallback, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";

interface ICustomTab {
  tabs: Array<ITabItems>;
  height?: number | string;
  getCurrectActiveTab?: (tab_index: number) => void;
}

interface ITabItems {
  title: string;
  RenderComponent: any;
}

const CustomTab: React.FC<ICustomTab> = memo(
  ({ tabs, height, getCurrectActiveTab }) => {
    const [activeTab, setActiveTab] = useState(0);
    const theme = useTheme();
    const desktop = useMediaQuery(theme.breakpoints.up("md"));

    const handleChangeTab = useCallback((prop: any, value: number) => {
      setActiveTab(value);
    }, []);

    useEffect(() => {
      if (typeof getCurrectActiveTab === "function") {
        getCurrectActiveTab(activeTab);
      }
    }, [activeTab, getCurrectActiveTab]);

    return (
      <StyledLinkTabs className="div">
        <AntTabs
          // orientation={desktop ? "vertical" : "horizontal"}
          // variant={desktop ? "standard" : "scrollable"}
          value={activeTab}
          className="tabs"
          indicatorColor="primary"
          textColor="primary"
          style={{
            // borderRight: desktop ? `1px solid ${theme.palette.divider}` : "",
            borderBottom: !desktop ? `1px solid ${theme.palette.divider}` : "",
            height: "100%",
          }}
          onChange={handleChangeTab}
        >
          {tabs.map((value, index) => (
            <AntTab
              label={value.title}
              key={index}
              value={index}
              onClick={() => {}}
            ></AntTab>
          ))}
        </AntTabs>

        <div className="custom-tab-container">
          {tabs.map(
            (tab: any, index: number) =>
              // activeTab === index && (
              // <Fade in={activeTab === index} timeout={500}>
              //   <div
              //     className="tab-item"
              //     style={{
              //       height: !!height ? height : `auto`,
              //     }}
              //   >
              //     {tab?.RenderComponent}
              //   </div>
              // </Fade>
              activeTab === index && (
                <AnimatePresence key={index}>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="tab-item"
                    style={{
                      height: height,
                      // padding: `.5em`,
                    }}
                  >
                    {tab?.RenderComponent}
                  </motion.div>
                </AnimatePresence>
              )
          )}
        </div>
      </StyledLinkTabs>
    );
  }
);

export default CustomTab;

const StyledLinkTabs = styled.div`
  /* width: 100%;
  height: 100%; */

  span.PrivateTabIndicator-root-1.PrivateTabIndicator-colorPrimary-2.MuiTabs-indicator {
    border-bottom-color: blue !important;
  }
  .tabs {
    .Mui-selected {
      color: #2196f3 !important;
      border-bottom-color: #2196f3 !important;
    }

    .MuiTab-wrapper {
      font-weight: 500 !important;
    }
  }
  .body {
    /* margin-top: 0.5em; */
    /* padding: 1em; */
    /* border: 0.01em solid rgb(0, 0, 0, 0.1); */
    border-radius: 7px;
  }

  .custom-tab-container {
    display: grid;
    grid-template-areas: "t";
    align-content: start;
    align-items: start;
    max-width: 100%;
    /* overflow-x: auto; */
    .tab-item {
      grid-area: t;
    }
  }
`;

const AntTabs = withStyles({
  root: {
    borderBottom: "1px solid #e8e8e8",
  },
  indicator: {
    backgroundColor: "#1890ff",
  },
})(Tabs);

const AntTab = withStyles((theme: Theme) =>
  createStyles({
    root: {
      textTransform: "none",
      minWidth: 50,
      fontWeight: theme.typography.fontWeightRegular,
      marginRight: theme.spacing(1),
      "&:hover": {
        color: "#40a9ff",
        opacity: 1,
      },
      "&$selected": {
        color: "#1890ff",
        fontWeight: theme.typography.fontWeightMedium,
      },
      "&:focus": {
        color: "#40a9ff",
      },
    },
    selected: {},
  })
)((props: any) => <Tab disableRipple {...props} />);

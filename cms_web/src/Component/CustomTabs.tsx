import {
  createStyles,
  Tab,
  Tabs,
  Theme,
  useMediaQuery,
  useTheme,
  withStyles,
} from "@material-ui/core";
import { AnimatePresence, motion } from "framer-motion";
import React, { memo, useCallback, useState } from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";

interface ICustomTab {
  tabs: Array<ITabItems>;
  height?: number;
}

interface ITabItems {
  title: string;
  RenderComponent: any;
}

const CustomTab: React.FC<ICustomTab> = memo(({ tabs, height }) => {
  const [activeTab, setActiveTab] = useState(0);
  const history = useHistory();
  const theme = useTheme();
  const desktop = useMediaQuery(theme.breakpoints.up("md"));

  const handleChangeTab = useCallback((prop: any, value: number) => {
    setActiveTab(value);
  }, []);

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

      {tabs.map(
        (tab: any, index: number) =>
          activeTab === index && (
            <AnimatePresence key={index}>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="custom-tab-content"
                style={{
                  height: height,
                  padding: `1.5em 1em`,
                }}
              >
                {tab?.RenderComponent}
              </motion.div>
            </AnimatePresence>
          )
      )}
    </StyledLinkTabs>
  );
});

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
      minWidth: 72,
      fontWeight: theme.typography.fontWeightRegular,
      marginRight: theme.spacing(4),
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

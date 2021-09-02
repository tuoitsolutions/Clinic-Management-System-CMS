import { Grid, useMediaQuery } from "@material-ui/core";
import {
  createStyles,
  Theme,
  useTheme,
  withStyles,
} from "@material-ui/core/styles";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import React, { memo } from "react";
import { Route, Switch as RouterSwitch, useHistory } from "react-router";
import styled from "styled-components";
export interface ILinkTab {
  label: string;
  link: string;
  Component?: any;
}

interface StyledTabsProps {
  value: number;
  onChange: (event: React.ChangeEvent<{}>, newValue: number) => void;
}

interface ILinkTabs {
  tabs: Array<ILinkTab>;
  orientation?: "vertical" | "horizontal";
}

interface StyledTabProps {
  label: any;
}

const LinkTabs: React.FC<ILinkTabs> = memo(({ tabs, orientation }) => {
  const history = useHistory();
  const theme = useTheme();
  const desktop = useMediaQuery(theme.breakpoints.up("md"));
  // const [click_counter, set_click_counter] = useState(0);

  return (
    tabs.length > 0 && (
      <StyledLinkTabs>
        <Grid container>
          <Grid
            item
            xs={12}
            md={orientation === "horizontal" ? 12 : 3}
            lg={orientation === "horizontal" ? 12 : 2}
          >
            <AntTabs
              orientation={
                !!orientation
                  ? orientation
                  : desktop
                  ? "vertical"
                  : "horizontal"
              }
              variant={
                !!orientation
                  ? "scrollable"
                  : desktop
                  ? "standard"
                  : "scrollable"
              }
              value={tabs.findIndex((p) =>
                window.location.pathname
                  .toLowerCase()
                  .includes(p.link.toLowerCase())
              )}
              className="tabs"
              indicatorColor="primary"
              textColor="primary"
              style={{
                borderRight:
                  orientation === "horizontal"
                    ? ""
                    : desktop
                    ? `1px solid ${theme.palette.divider}`
                    : "",
                borderBottom:
                  orientation === "horizontal"
                    ? ""
                    : !desktop
                    ? `1px solid ${theme.palette.divider}`
                    : "",
                height: "100%",
              }}
            >
              {tabs.map((value, index) => (
                <AntTab
                  label={value.label}
                  key={index}
                  value={index}
                  onClick={() => {
                    // set_click_counter((prev) => prev + 1);
                    history.push(value.link);
                  }}
                ></AntTab>
              ))}
            </AntTabs>
          </Grid>
          <Grid
            item
            xs={12}
            md={orientation === "horizontal" ? 12 : 9}
            lg={orientation === "horizontal" ? 12 : 10}
          >
            <div className="body" style={{ minHeight: 400, padding: `1em` }}>
              <RouterSwitch>
                {tabs.map((tab, index) => (
                  <Route path={tab.link} exact key={index}>
                    {tab.Component}
                  </Route>
                ))}
              </RouterSwitch>
            </div>
          </Grid>
        </Grid>
      </StyledLinkTabs>
    )
  );
});

export default LinkTabs;

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
      padding: 0.5em 0 !important;
      font-size: 1.05em !important;
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
    // borderBottom: "1px solid #e8e8e8",
    boxShadow: `0 3px 2px -2px rgba(0, 0, 0, 0.1)`,
    minHeight: 0,
  },
  indicator: {
    backgroundColor: "#1890ff",
  },
})(Tabs);

const AntTab = withStyles((theme: Theme) =>
  createStyles({
    root: {
      textTransform: "none",
      minWidth: 20,
      fontWeight: theme.typography.fontWeightRegular,
      marginRight: theme.spacing(3),

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

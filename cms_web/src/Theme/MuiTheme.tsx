import { Color } from "@material-ui/core";
import {
  createMuiTheme,
  responsiveFontSizes,
  Theme,
} from "@material-ui/core/styles";

interface ThemeProp {
  appbar: IAppBar;
}

interface IAppBar {
  bgColor: string;
  color: string;
  height: number;
}

export interface StyledComponentTheme {
  theme: Theme;
}

declare module "@material-ui/core/styles/createMuiTheme" {
  interface ThemeOptions {
    header?: IHeader;
    sidebar?: ISidebar;
    body: IBody;
  }

  interface IHeader {
    height: number;
    backgroundColor: string;
    color: string;
    activeNavColor: string;
  }

  interface ISidebar {
    maxWidth: number;
    minWidth: number;
    backgroundColor: string;
    color: string;
  }

  interface IBody {
    backgroundColor: string;
    color: string;
  }
}

interface CustomizeInterface {
  boxShadowColor?: string;
  headerTextColor?: string;
}

declare module "@material-ui/core/styles/createPalette" {
  interface Palette {
    blue?: Color;
    bg?: Color;

    // gray: Palette["primary"];
    // grey: Palette["primary"],
    // orange: Palette["primary"],
    // red: Palette["primary"]
  }

  interface PaletteOptions {
    blue?: PaletteOptions["primary"];
    customize?: CustomizeInterface;
    // bg: PaletteOptions["primary"];
    // gray?: PaletteOptions["primary"];
  }
}

let theme = createMuiTheme({
  palette: {
    primary: {
      main: `#775ada`,
    },
    secondary: {
      main: `#ff304f`,
    },
    customize: {
      boxShadowColor: `rgba(11, 132, 87, .5)`,
      headerTextColor: `#dee1ec`,
    },
  },
  typography: {
    button: {
      textTransform: "unset",
      // letterSpacing: `.3pt`,
      // wordSpacing: `.3pt`,
      // fontWeight: 700,
      // fontSize: `.83em`,
    },
    fontFamily: [
      "nunito",
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
  },
  header: {
    backgroundColor: "#e2f3f5",
    height: 65,
    color: "black",
    activeNavColor: `#eac100`,
  },
  sidebar: {
    maxWidth: 300,
    minWidth: 65,
    backgroundColor: "#fdfdfd",
    color: "black",
  },
  body: {
    backgroundColor: "unset",
    color: `black`,
  },
  // spacing: 4,
});

theme = responsiveFontSizes(theme);

export default theme;

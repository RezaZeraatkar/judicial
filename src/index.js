import React from "react";
import ReactDOM from "react-dom/client";

import store from "./store/store";
import { Provider } from "react-redux";
import PropTypes from "prop-types";
import { Link as RouterLink, BrowserRouter } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";
import "react-toastify/dist/ReactToastify.css";

import { UserProvider } from "./hocs/UserProvider";

// root app file
import App from "./App";
import ErrorBoundary from "./pages/ErrorBoundary";
// **** our application dependencies **** //
import { getUserAuthApiSlice } from "./services/api/auth/getUserAuthSlice";
// rtl setup imports
import { createTheme, ThemeProvider } from "@mui/material/styles";
import rtlPlugin from "stylis-plugin-rtl";
import { prefixer } from "stylis";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
// MUI localization Setup
import { faIR } from "@mui/material/locale"; // core translations
import { faIR as dataGridFaIR } from "@mui/x-data-grid"; // x-data-grid translations
import { faIR as pickersFaIR } from "@mui/x-date-pickers"; // x-date-pickers translations
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import AdapterJalali from "@date-io/date-fns-jalali";
import reportWebVitals from "./reportWebVitals";

// Seting up React Router Dom Links integrated with MUI Links Globally
const LinkBehavior = React.forwardRef((props, ref) => {
  const { href, ...other } = props;
  // Map href (MUI) -> to (react-router)
  return (
    <RouterLink data-testid="custom-link" ref={ref} to={href} {...other} />
  );
});
LinkBehavior.propTypes = {
  href: PropTypes.oneOfType([
    PropTypes.shape({
      hash: PropTypes.string,
      pathname: PropTypes.string,
      search: PropTypes.string,
    }),
    PropTypes.string,
  ]).isRequired,
};

// our customizations on the Mui theme
const theme = createTheme({
  direction: "rtl",
  typography: {
    fontFamily: "Iransans, Segoe UI, Tahoma, Geneva, Verdana",
    fontSize: 12,
  },
  palette: {
    primary: {
      main: "#5046E5",
    },
    secondary: {
      main: "#354aa0",
    },
    error: {
      main: "#e54f46",
    },
    warning: {
      main: "#f9d13e",
    },
    info: {
      main: "#dce546",
    },
  },
  components: {
    MuiLink: {
      defaultProps: {
        component: LinkBehavior,
        color: "rgba(44, 56, 74, 0.681)",
      },
    },
    MuiButtonBase: {
      defaultProps: {
        LinkComponent: LinkBehavior,
      },
    },
    MuiListItemButton: {
      defaultProps: {
        disableTouchRipple: true,
      },
    },
  },
  faIR,
  dataGridFaIR,
  pickersFaIR,
});
// Create rtl cache
const cacheRtl = createCache({
  key: "muirtl",
  stylisPlugins: [prefixer, rtlPlugin],
});

store.dispatch(getUserAuthApiSlice.endpoints.getUserAuth.initiate());

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <Provider store={store}>
        <CacheProvider value={cacheRtl}>
          <ThemeProvider theme={theme}>
            <BrowserRouter>
              <CssBaseline />
              <LocalizationProvider dateAdapter={AdapterJalali}>
                <UserProvider>
                  <App />
                </UserProvider>
              </LocalizationProvider>
            </BrowserRouter>
          </ThemeProvider>
        </CacheProvider>
      </Provider>
    </ErrorBoundary>
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

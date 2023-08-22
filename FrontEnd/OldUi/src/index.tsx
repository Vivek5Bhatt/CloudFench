import React from "react";
import ReactDOM from "react-dom";
import "./assets/css/App.css";
import { HashRouter, Switch, Redirect } from "react-router-dom";
import AuthLayout from "./layouts/auth";
import AdminLayout from "./layouts/admin";
import RTLLayout from "./layouts/rtl";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "./theme/theme";
import ProtectedRoutes from "util/protectedRoutes/protectedRoutes";
import AuthProtectedRoutes from "util/protectedRoutes/authProtectedRoute";

ReactDOM.render(
  <ChakraProvider theme={theme}>
    <React.StrictMode>
      <HashRouter>
        <Switch>
          <AuthProtectedRoutes path={"/auth"}>
            <AuthLayout />
          </AuthProtectedRoutes>
          <ProtectedRoutes path="/admin">
            <AdminLayout />
          </ProtectedRoutes>
          {/* <ProtectedRoutes path="/rtl">
            <RTLLayout />
          </ProtectedRoutes> */}
          <Redirect from="/" to={"/auth"} />
        </Switch>
      </HashRouter>
    </React.StrictMode>
  </ChakraProvider>,
  document.getElementById("root")
);

import React from "react";
import { Redirect, Route } from "react-router-dom";
export default function ProtectedRoutes({
  children,
  path,
}: {
  children: any;
  path: any;
}) {

  return (
    <Route
      path={path}
      render={({ location }) =>
        localStorage.getItem("accessToken") ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/auth/sign-in",
              state: { from: location },
            }}
          />
        )
      }
    />
  );
}

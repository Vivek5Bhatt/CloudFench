import { Redirect, Route } from "react-router-dom";
export default function AuthProtectedRoutes({
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
        !localStorage.getItem("accessToken") ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/admin",
              state: { from: location },
            }}
          />
        )
      }
    />
  );
}

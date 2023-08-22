import {
  Card,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import Box from "@mui/material/Box";
import styled from "@emotion/styled";
import lambada1 from "public/images/awsimg/lambada1.svg";
import container1 from "public/images/container1.svg";
import copy1 from "public/images/copy1.svg";
import stack1 from "public/images/stack1.svg";
import { useRouter } from "next/router";
import BreadcrumbHeading from "src/components/BreadcrumbHeading";
import CollapsRow from "src/components/Dashboard/risk-dashboard/CollapsRow";
import { useEffect, useState } from "react";
import { getDashboardExposure } from "utils/apis/routes/dashboard";
import { getCookie } from "cookies-next";
import CustomLoader from "src/components/Loader/CustomLoader";

const menuList = (posturesList) => {
  let list = [
    {
      id: 0,
      label: "Exposed Virtual Machines",
      icon: copy1,
      count: posturesList?.length,
    },
    {
      id: 1,
      label: "Exposed API endpoints",
      icon: lambada1,
      count: 0,
    },
    {
      id: 2,
      label: "Exposed Containers",
      icon: container1,
      count: 0,
    },
    {
      id: 3,
      label: "Exposed Database",
      icon: stack1,
      count: 0,
    },
  ];
  return list;
};

const RiskDashboard = () => {
  const router = useRouter();
  const [posturesList, setPosturesList] = useState([]);
  const currentPageUrl = router.pathname;
  const [loader, setLoader] = useState(true);

  const getPosture = async () => {
    let accounts = getCookie("cloudConnector");
    let parse = JSON.parse(accounts);
    let res = await getDashboardExposure(parse);

    if (res?.data?.data) {
      setPosturesList(res?.data?.data);
      setLoader(false);
    }
  };
  // console.log(posturesList, "posturesListposturesList");

  useEffect(() => {
    getPosture();
  }, []);

  return (
    <>
      <BreadcrumbHeading url={currentPageUrl} />
      {loader ? (
        <CustomLoader />
      ) : (
        <Card sx={{ mt: "15px" }}>
          <Table aria-label="collapsible table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: "200px" }}>
                  Resources With Wide Internet Access
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody
              hover="true"
              role="checkbox"
              tabIndex={-1}
              className="nowrap_bx"
            >
              {menuList(posturesList)?.map((lst, key) => {
                return (
                  <CollapsRow
                    lst={lst}
                    key={key}
                    index={key}
                    posturesList={posturesList}
                  />
                );
              })}
            </TableBody>
          </Table>
        </Card>
      )}
    </>
  );
};

export default RiskDashboard;

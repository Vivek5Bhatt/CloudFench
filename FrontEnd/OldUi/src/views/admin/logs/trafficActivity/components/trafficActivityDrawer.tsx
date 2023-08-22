import {
  Box,
  Button,
  Divider,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Text,
} from "@chakra-ui/react";

const DetailObj: { [key: string]: {}[] } = {
  General: [
    { objectLabel: "Deployment", type: "default" },
    { objectLabel: "cloud", type: "default" },
    { objectLabel: "region", type: "default" },
    { objectLabel: "date", type: "default" },
    { objectLabel: "time", type: "default" },
  ],
  Action: [
    { objectLabel: "action", type: "default" },
    { objectLabel: "threats", type: "default" },
    { objectLabel: "threattyps", type: "default" },
    { objectLabel: "crlevel", type: "default" },
  ],
  Source: [
    { objectLabel: "srcip", title: "Source IP", type: "default" },
    { objectLabel: "srcip", title: "Source Name", type: "default" },
    { objectLabel: "srcport", title: "Source Port", type: "default" },
    {
      objectLabel: "srccountry",
      title: "Source Country",
      render: (key: string, value: string) => (
        <Text>
          <span style={{ textTransform: "capitalize" }}>{key}</span> :{" "}
          {value === "Reserved" ? "" : value.replace("%20", " ")}
        </Text>
      ),
      type: "custom",
    },
  ],
  Destination: [
    { objectLabel: "dstip", title: "Destination IP", type: "default" },
    { objectLabel: "dstip", title: "Destination Name", type: "default" },
    { objectLabel: "dstport", title: "Destination Port", type: "default" },
    {
      objectLabel: "dstcountry",
      title: "Destination Country",
      render: (key: string, value: string) => (
        <Text>
          <span style={{ textTransform: "capitalize" }}>{key}</span> :{" "}
          {value === "Reserved" ? "" : value.replace("%20", " ")}
        </Text>
      ),
      type: "custom",
    },
    { objectLabel: "dstregion", title: "Destination Region", type: "default" },
    { objectLabel: "dstcity", title: "Destination City", type: "default" },
    {
      objectLabel: "dstreputation",
      title: "Destination Reputation",
      type: "default",
    },
  ],
  Application: [
    { objectLabel: "service", type: "default" },
    { objectLabel: "app", title: "Application", type: "default" },
    { objectLabel: "proto", type: "default" },
    { objectLabel: "appcat", type: "default" },
  ],
  Data: [
    {
      objectLabel: "duration",
      title: "duration",
      render: (key: string, value: string) => (
        <Text>
          <span style={{ textTransform: "capitalize" }}>{key}</span> : {value}{" "}
          seconds
        </Text>
      ),
      type: "custom",
    },
    {
      objectLabel: "sentbyte",
      title: "sentbyte",
      render: (key: string, value: string) => (
        <Text>
          <span style={{ textTransform: "capitalize" }}>{key}</span>:{" "}
          {parseInt(value) / 1024} Kbyte
        </Text>
      ),
      type: "custom",
    },
    {
      objectLabel: "rcvdbyte",
      title: "rcvdbyte",
      render: (key: string, value: string) => (
        <Text>
          <span style={{ textTransform: "capitalize" }}>{key}</span>:{" "}
          {parseInt(value) / 1024} Kbyte
        </Text>
      ),
      type: "custom",
    },
    { objectLabel: "sentpkt", type: "default" },
    { objectLabel: "rcvdpkt", type: "default" },
  ],
};
export default function TrafficActivityDrawer({
  isOpen,
  onClose,
  DetailedObj,
}: {
  isOpen: boolean;
  onClose: () => void;
  DetailedObj: { [key: string]: string } | undefined;
}) {
  return (
    <>
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Log Details</DrawerHeader>

          {DetailedObj && (
            <DrawerBody>
              {Object.keys(DetailObj).map((objKey: string, index: number) => {
                return (
                  <>
                    {" "}
                    <Box key={index} paddingY="16px">
                      <Text fontSize="xl">{objKey}</Text>
                      {DetailObj[objKey].map((detailObj: any) => {
                        switch (detailObj.type) {
                          case "custom":
                            return detailObj.render(
                              detailObj.title
                                ? detailObj.title
                                : detailObj.objectLabel,
                              DetailedObj[detailObj.objectLabel]
                            );
                          case "default":
                            return (
                              <Text>
                                <span style={{ textTransform: "capitalize" }}>
                                  {detailObj.title
                                    ? detailObj.title
                                    : detailObj.objectLabel}{" "}
                                </span>
                                : {DetailedObj[detailObj.objectLabel]}
                              </Text>
                            );
                        }
                      })}
                    </Box>
                    <Divider />
                  </>
                );
              })}
            </DrawerBody>
          )}

          {/* <DrawerFooter></DrawerFooter> */}
        </DrawerContent>
      </Drawer>
    </>
  );
}

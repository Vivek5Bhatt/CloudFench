/* eslint-disable */

import { NavLink, useLocation } from "react-router-dom";
// chakra imports
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Flex,
  HStack,
  Menu,
  MenuButton,
  MenuList,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { Key } from "react";

export function SidebarLinks(props: { routes: RoutesType[] }) {
  //   Chakra color mode
  let location = useLocation();
  let activeColor = useColorModeValue("gray.700", "white");
  let inactiveColor = useColorModeValue(
    "secondaryGray.600",
    "secondaryGray.600"
  );
  let activeIcon = useColorModeValue("brand.500", "white");
  let textColor = useColorModeValue("secondaryGray.500", "white");
  let brandColor = useColorModeValue("brand.500", "brand.400");

  const { routes } = props;

  // verifies if routeName is the one active (in browser input)
  const activeRoute = (routeName: string) => {
    return location.pathname.includes(routeName);
  };

  // this function creates the links from the secondary accordions (for example auth -> sign-in -> default)
  const createLinks = (routes: RoutesType[]) => {
    return routes.map((route: RoutesType, index: number) => {
      if (route.show)
        if (
          route.layout === "/admin" ||
          route.layout === "/auth" ||
          route.layout === "/rtl"
        ) {
          if (route.secondaryRoutes?.length) {
            return (
              <Accordion key={index} allowToggle={true}>
                <AccordionItem border={0}>
                  <h2>
                    <AccordionButton padding={"5px 0px 5px 10px"}>
                      <Flex
                        w="100%"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <Box
                          color={
                            activeRoute(route.path.toLowerCase())
                              ? activeIcon
                              : textColor
                          }
                          me="18px"
                        >
                          {route.icon}
                        </Box>
                        <Text
                          me="auto"
                          color={
                            activeRoute(route.path.toLowerCase())
                              ? activeColor
                              : textColor
                          }
                          fontWeight={
                            activeRoute(route.path.toLowerCase())
                              ? "bold"
                              : "normal"
                          }
                        >
                          {route.name}
                        </Text>
                      </Flex>
                      <AccordionIcon />
                    </AccordionButton>
                  </h2>
                  <AccordionPanel padding={0} paddingLeft="2.8rem">
                    {route.secondaryRoutes.map((r, index) =>
                      r.title ? (
                        <Box key={index}>
                          <Text textTransform={'uppercase'} color={textColor} padding={"4px 4px 0px 4px"}>
                            {r.title}
                          </Text>
                          {r.secondaryRoutes.map((r2: any, index: Key) => (
                            <NavLink key={index} to={r2.layout + r2.path}>
                              <Box>
                                <HStack
                                  spacing={
                                    activeRoute(r2.path.toLowerCase())
                                      ? "22px"
                                      : "26px"
                                  }
                                  py="5px"
                                  ps="10px"
                                >
                                  <Flex
                                    w="100%"
                                    alignItems="center"
                                    justifyContent="center"
                                  >
                                    <Text
                                      me="auto"
                                      color={
                                        activeRoute(r2.path.toLowerCase())
                                          ? activeColor
                                          : textColor
                                      }
                                      fontWeight={
                                        activeRoute(r2.path.toLowerCase())
                                          ? "bold"
                                          : "normal"
                                      }
                                    >
                                      {r2.name}
                                    </Text>
                                  </Flex>
                                  <Box
                                    h="36px"
                                    w="4px"
                                    bg={
                                      activeRoute(r2.path.toLowerCase())
                                        ? brandColor
                                        : "transparent"
                                    }
                                    borderRadius="5px"
                                  />
                                </HStack>
                              </Box>
                            </NavLink>
                          ))}
                        </Box>
                      ) : (
                        <NavLink key={index} to={r.layout + r.path}>
                          <Box>
                            <HStack
                              spacing={
                                activeRoute(r.path.toLowerCase())
                                  ? "22px"
                                  : "26px"
                              }
                              py="5px"
                              ps="10px"
                            >
                              <Flex
                                w="100%"
                                alignItems="center"
                                justifyContent="center"
                              >
                                <Text
                                  me="auto"
                                  color={
                                    activeRoute(r.path.toLowerCase())
                                      ? activeColor
                                      : textColor
                                  }
                                  fontWeight={
                                    activeRoute(r.path.toLowerCase())
                                      ? "bold"
                                      : "normal"
                                  }
                                >
                                  {r.name}
                                </Text>
                              </Flex>
                              <Box
                                h="36px"
                                w="4px"
                                bg={
                                  activeRoute(r.path.toLowerCase())
                                    ? brandColor
                                    : "transparent"
                                }
                                borderRadius="5px"
                              />
                            </HStack>
                          </Box>
                        </NavLink>
                      )
                    )}
                  </AccordionPanel>
                </AccordionItem>
              </Accordion>
            );
          } else
            return (
              <NavLink key={index} to={route.layout + route.path}>
                {route.icon ? (
                  <Box>
                    <HStack
                      spacing={
                        activeRoute(route.path.toLowerCase()) ? "22px" : "26px"
                      }
                      py="5px"
                      ps="10px"
                    >
                      <Flex
                        w="100%"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <Box
                          color={
                            activeRoute(route.path.toLowerCase())
                              ? activeIcon
                              : textColor
                          }
                          me="18px"
                        >
                          {route.icon}
                        </Box>
                        <Text
                          me="auto"
                          color={
                            activeRoute(route.path.toLowerCase())
                              ? activeColor
                              : textColor
                          }
                          fontWeight={
                            activeRoute(route.path.toLowerCase())
                              ? "bold"
                              : "normal"
                          }
                        >
                          {route.name}
                        </Text>
                      </Flex>
                      <Box
                        h="36px"
                        w="4px"
                        bg={
                          activeRoute(route.path.toLowerCase())
                            ? brandColor
                            : "transparent"
                        }
                        borderRadius="5px"
                      />
                    </HStack>
                  </Box>
                ) : (
                  <Box>
                    <HStack
                      spacing={
                        activeRoute(route.path.toLowerCase()) ? "22px" : "26px"
                      }
                      py="5px"
                      ps="10px"
                    >
                      <Text
                        me="auto"
                        color={
                          activeRoute(route.path.toLowerCase())
                            ? activeColor
                            : inactiveColor
                        }
                        fontWeight={
                          activeRoute(route.path.toLowerCase())
                            ? "bold"
                            : "normal"
                        }
                      >
                        {route.name}
                      </Text>
                      <Box h="36px" w="4px" bg="brand.400" borderRadius="5px" />
                    </HStack>
                  </Box>
                )}
              </NavLink>
            );
        }
    });
  };
  //  BRAND
  return <>{createLinks(routes)}</>;
}

export default SidebarLinks;

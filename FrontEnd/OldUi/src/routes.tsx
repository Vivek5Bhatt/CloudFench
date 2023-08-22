import { Icon } from "@chakra-ui/react";
import {
  MdBarChart,
  MdPerson,
  MdHome,
  MdLock,
  MdOutlineShoppingCart,
  MdAnalytics,
  MdOutlineSecurity,
} from "react-icons/md";

// Admin Imports
import MainDashboard from "views/admin/default";
import NFTMarketplace from "views/admin/marketplace";
import Profile from "views/admin/profile";
import RTL from "views/admin/rtl";

// Auth Imports
import SignInCentered from "views/auth/signIn";
import SignUp from "views/auth/signup";
import ForgotPassword from "views/auth/forgotPassword/index";
import CloudConnector from "views/admin/configuration/cloudConnector";
import StackConnectivity from "views/admin/configuration/stackConnectivity";
import TrafficActivity from "views/admin/logs/trafficActivity";
import PolicyComponent from "views/admin/policy/index";

const routes = [
  {
    name: "Dashboard",
    layout: "/admin",
    path: "/default",
    icon: <Icon as={MdHome} width="20px" height="20px" color="inherit" />,
    component: MainDashboard,
    show: true,
    secondaryRoutes: [
      {
        layout: "/admin",
        path: "/default",
        name: "Status",
        component: MainDashboard,
        show: true,
      },
      {
        layout: "/admin",
        path: "/globalmaps",
        name: "Global Maps",
        component: MainDashboard,
        show: true,
      },
    ],
  },
  {
    name: "Configuration",
    layout: "/admin",
    icon: (
      <Icon as={MdOutlineSecurity} width="20px" height="20px" color="inherit" />
    ),
    path: "/cloud-connector",
    component: CloudConnector,
    show: true,
    secondaryRoutes: [
      {
        title: "Stack Settings",
        layout: "/admin",
        path: "/cloud-connector",
        name: "Cloud Connectors",
        component: CloudConnector,
        show: true,
        secondaryRoutes: [
          {
            layout: "/admin",
            path: "/cloud-connector",
            name: "Cloud Connectors",
            component: CloudConnector,
            show: true,
          },
          {
            layout: "/admin",
            path: "/stack-connectivity",
            name: "Stack Connectivity",
            component: StackConnectivity,
            show: true,
          },
        ],
      },
      {
        title: "Secure Nat Gw",
        layout: "/admin",
        path: "/secure-nat/policies",
        name: "Secure Nat GW",
        component: PolicyComponent,
        show: true,
        secondaryRoutes: [
          {
            layout: "/admin",
            path: "/secure-nat/policies",
            name: "Policies",
            component: PolicyComponent,
            show: true,
          },
          {
            layout: "/admin",
            path: "/secure-nat/security",
            name: "Security",
            component: StackConnectivity,
            show: true,
          },
        ],
      },
      {
        title: "internal Segmentation",
        layout: "/admin",
        path: "/internal-segmentation/policies",
        name: "internal Segmentation",
        component: PolicyComponent,
        show: true,
        secondaryRoutes: [
          {
            layout: "/admin",
            path: "/internal-segmentation/policies",
            name: "Policies",
            component: PolicyComponent,
            show: true,
          },
          {
            layout: "/admin",
            path: "/internal-segmentation/security",
            name: "Security",
            component: StackConnectivity,
            show: true,
          },
        ],
      },
      {
        title: "Remote Access",
        layout: "/admin",
        path: "/remote-access/policies",
        name: "Remote Access",
        component: PolicyComponent,
        show: true,
        secondaryRoutes: [
          {
            layout: "/admin",
            path: "/remote-access/policies",
            name: "Policies",
            component: PolicyComponent,
            show: true,
          },
          {
            layout: "/admin",
            path: "/remote-access/security",
            name: "Security",
            component: StackConnectivity,
            show: true,
          },
          {
            layout: "/admin",
            path: "/remote-access/settings",
            name: "Settings",
            component: StackConnectivity,
            show: true,
          },
        ],
      },
    ],
  },
  {
    name: "Monitor & Logs",
    layout: "/admin",
    icon: <Icon as={MdBarChart} width="20px" height="20px" color="inherit" />,
    path: "/traffic-activity",
    component: CloudConnector,
    show: true,
    secondaryRoutes: [
      {
        layout: "/admin",
        path: "/traffic-activity",
        name: "Traffic Activity",
        component: TrafficActivity,
        show: true,
      },
      {
        layout: "/admin",
        path: "/malware-protection",
        name: "Malware Protection",
        component: TrafficActivity,
        show: true,
      },
      {
        layout: "/admin",
        path: "/compliance",
        name: "Compliance",
        component: TrafficActivity,
        show: true,
      },
    ],
  },
  {
    name: "Analytics",
    layout: "/admin",
    path: "/nft-marketplace",
    icon: (
      <Icon
        as={MdOutlineShoppingCart}
        width="20px"
        height="20px"
        color="inherit"
      />
    ),
    component: NFTMarketplace,
    secondary: true,
    show: false,
  },
  {
    name: "Profile",
    layout: "/admin",
    path: "/profile",
    icon: <Icon as={MdPerson} width="20px" height="20px" color="inherit" />,
    component: Profile,
    show: false,
  },
  {
    name: "Sign In",
    layout: "/auth",
    path: "/sign-in",
    icon: <Icon as={MdLock} width="20px" height="20px" color="inherit" />,
    component: SignInCentered,
    show: false,
  },
  // {
  //   name: "RTL Admin",
  //   layout: "/rtl",
  //   path: "/rtl-default",
  //   icon: <Icon as={MdHome} width="20px" height="20px" color="inherit" />,
  //   component: RTL,
  //   show: false,
  // },
  {
    name: "Sign Up",
    layout: "/auth",
    path: "/sign-up",
    icon: <Icon as={MdLock} width="20px" height="20px" color="inherit" />,
    component: SignUp,
    show: false,
  },

  {
    name: "Forgot Password",
    layout: "/auth",
    path: "/forgot-password",
    icon: <Icon as={MdLock} width="20px" height="20px" color="inherit" />,
    component: ForgotPassword,
    show: false,
  },
];

export default routes;

import React from "react";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import GridViewIcon from "@mui/icons-material/GridView";
import LayersIcon from "@mui/icons-material/Layers";
import SettingsIcon from "@mui/icons-material/Settings";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import CopyAllIcon from "@mui/icons-material/CopyAll";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
  import { ReactComponent as RequestPageIcon } from "../../../public/images/icons/NFT.png";

export const SidebarData = [
  {
    title: "Dashboard",
    path: "/",
    icon:   <img
    src="/images/icons/dashboard.png"
    alt="NFT Icon"
    style={{width: "16px", height: "16px" }} // Adjust the width and height as needed
  /> ,    iconClosed: <KeyboardArrowRightIcon />,
    iconOpened: <KeyboardArrowDownIcon />,
  },
  {
    title: "Patent Services",
    path: "/patent-services/",
    icon:   <img
    src="/images/icons/PATENT SERVICES.png"
    alt="NFT Icon"
    style={{ width: "17px", height: "17px" }} // Adjust the width and height as needed
  /> ,
    iconClosed: <KeyboardArrowRightIcon />,
    iconOpened: <KeyboardArrowDownIcon />,
  },
  {
    title: "IP Tracker",
    path: "/my-patents/",
    icon:   <img
    src="/images/icons/IP TRACKER.png"
    alt="NFT Icon"
    style={{ width: "20px", height: "20px"  }} // Adjust the width and height as needed
  /> ,
    iconClosed: <KeyboardArrowRightIcon />,
    iconOpened: <KeyboardArrowDownIcon />,
  },
  {
    title: "Bulk Orders",
    path: "/bulk-orders/",
    icon: <LayersIcon style={{ fill: "white" }} />, // Use "fill" to change the icon color
    iconClosed: <KeyboardArrowRightIcon />,
    iconOpened: <KeyboardArrowDownIcon />,
  },
  {
    title: "IP NFT’s",
    path: "https://humcen.io", // Updated link path
    icon:<img
    src="/images/icons/NFT.png"
    alt="NFT Icon"
    style={{
      width: "20px",
      height: "20px",
    }}
  />,
    iconClosed: <KeyboardArrowRightIcon />,
    iconOpened: <KeyboardArrowDownIcon />,
  },
  {
    title: "About Us",
    path: "/about-us/",
    icon: <CopyAllIcon style={{ fill: "white" }} />, // Use "fill" to change the icon color
    iconClosed: <KeyboardArrowRightIcon />,
    iconOpened: <KeyboardArrowDownIcon />,
  },
  {
    title: "Help & Support",
    path: "/help-and-support/",
    icon:   <img
    src="/images/icons/HELP & SUPPORT.png"
    alt="NFT Icon"
    style={{width: "20px", height: "20px" }} // Adjust the width and height as needed
  /> ,    iconClosed: <KeyboardArrowRightIcon />,
    iconOpened: <KeyboardArrowDownIcon />,
  },
  {
    title: "Settings",
    path: "/settings/",
    icon: <SettingsIcon style={{ fill: "white" }} />, // Use "fill" to change the icon color
    iconClosed: <KeyboardArrowRightIcon />,
    iconOpened: <KeyboardArrowDownIcon />,
  },
];

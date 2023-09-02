import React from "react";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import GridViewIcon from "@mui/icons-material/GridView";
import LayersIcon from "@mui/icons-material/Layers";
import SettingsIcon from "@mui/icons-material/Settings";
import PostAddIcon from "@mui/icons-material/PostAdd";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import CopyAllIcon from "@mui/icons-material/CopyAll";

export const SidebarData = [
  {
    title: "Dashboard",
    path: "/",
    icon: <GridViewIcon />,
    iconClosed: <KeyboardArrowRightIcon />,
    iconOpened: <KeyboardArrowDownIcon />,
  },
  {
    title: "Patent Services",
    path: "/patent-services/",
    icon: <LayersIcon />,
    iconClosed: <KeyboardArrowRightIcon />,
    iconOpened: <KeyboardArrowDownIcon />,
  },
  {
    title: "Job Listing",
    path: "/job-listing/",
    icon: <MailOutlineIcon />,
    iconClosed: <KeyboardArrowRightIcon />,
    iconOpened: <KeyboardArrowDownIcon />,
  },
  {
    title: "Patent History",
    path: "/patent-history/",
    icon: <PostAddIcon />,
    iconClosed: <KeyboardArrowRightIcon />,
    iconOpened: <KeyboardArrowDownIcon />,
  },
  {
    title: "Un-Assigned Jobs",
    path: "/UnAssignedJobs/",
    icon: <LayersIcon/>,
    iconClosed: <KeyboardArrowRightIcon />,
    iconOpened: <KeyboardArrowDownIcon />,
  },
  {
    title: "Partners",
    path: "/partners/",
    icon: <CopyAllIcon />,
    iconClosed: <KeyboardArrowRightIcon />,
    iconOpened: <KeyboardArrowDownIcon />,
  },
  {
    title: "Bulk Order Assign",
    path: "/BulkOrders/",
    icon: <LayersIcon/>,
    iconClosed: <KeyboardArrowRightIcon />,
    iconOpened: <KeyboardArrowDownIcon />,
  },
  {
    title: "Bulk Order Requests",
    path: "/BulkOrderFiles/",
    icon: <LayersIcon/>,
    iconClosed: <KeyboardArrowRightIcon />,
    iconOpened: <KeyboardArrowDownIcon />,
  },
  {
    title: "Settings",
    path: "/settings/",
    icon: <SettingsIcon />,
    iconClosed: <KeyboardArrowRightIcon />,
    iconOpened: <KeyboardArrowDownIcon />,
  },
];

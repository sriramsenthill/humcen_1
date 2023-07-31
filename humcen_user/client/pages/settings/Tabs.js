import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import { Typography } from "@mui/material";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import TrackOrder from "@/components/eCommerce/OrderDetails/TrackOrder";
import ProfileSettings from "./ProfileSettings";
import EmailNotifsSettings from "./EmailNotifsSettings";
import ChangePassword from "./ChangePassword";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function BasicTabs({ no, items }) {
  const [value, setValue] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      {isMounted && (
        <Card
          sx={{
            boxShadow: "none",
            borderRadius: "10px",
            p: "25px",
            mb: "15px",
            width: "100%",
          }}
        >
          <Box sx={{ width: "100%" }}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={value}
                onChange={handleChange}
                aria-label="basic tabs example"
                sx={{
                  textTransform: "none",
                  "& .MuiTabs-indicator": {
                    backgroundColor: "#333333",
                  },
                  "& .Mui-selected": {
                    color: "#333333",
                  },
                  "& .MuiTab-root": {
                    color: "#333333",
                  },
                }}
              >
                <Tab
                  sx={{
                    textTransform: "none",
                    marginRight: "10px",
                  }}
                  label="Personal Information"
                  {...a11yProps(0)}
                />
                <Tab
                  sx={{
                    textTransform: "none",
                    marginRight: "10px",
                  }}
                  label="E-mail Preferences"
                  {...a11yProps(1)}
                />
                <Tab
                  sx={{
                    textTransform: "none",
                    marginRight: "10px",
                  }}
                  label="Security"
                  {...a11yProps(2)}
                />
              </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
              <div className={'cardTab'}>
                <ProfileSettings />
              </div>
            </TabPanel>
            <TabPanel value={value} index={1}>
              <div className={'cardTab'}>
                <EmailNotifsSettings />
              </div>
            </TabPanel>
            <TabPanel value={value} index={2}>
              <div className={'cardTab'}>
                <ChangePassword />
              </div>
            </TabPanel>
          </Box>
        </Card>
      )}
    </>
  );
}

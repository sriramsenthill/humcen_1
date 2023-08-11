import * as React from "react";
import { useState, useEffect } from "react";
import axios from "axios";

import styles from "@/components/_App/TopNavbar/Notification.module.css";
import {
  IconButton,
  Button,
  Typography,
  Tooltip,
  Menu,
  Link,
  Badge,
} from "@mui/material";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});


// Add an interceptor to include the token in the request headers
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = token;
  }
  return config;
});


const Notification = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [notifications, setNotifications] = useState([]);
  const [userID, setUserID] = useState("");
  const options = {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
    weekday: "long",
  };

  useEffect(() => {
    const fetchNotifData = async () => {
      try {
        const notifResponse = await api.get(`admin/get-notifs`);
        const unSeenNotifs = notifResponse.data.filter((notif) => {
          return notif.seen == false;
        })
        setNotifications(unSeenNotifs);
        console.log("Notifications Unseen " + unSeenNotifs[0].notifDate);
      } catch(error) {
        console.error("Error Fetching Notification : " + error);
      }
    }

    fetchNotifData();
  }
  , []);

  const eraseRecent = async(userID) => {

    const response = await api.get(`admin/clear-notif`).then(() => {
      console.log("Recent Notifications cleared Successfully");
    }).catch((err) => {
      console.error("Error in Clearing Unseen Notifications : " + err)
    })
  }

  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <>
      <Tooltip title="Notification">
        <IconButton
          onClick={handleClick}
          size="small"
          sx={{ 
            backgroundColor: '#f5f5f5',
            width: '40px',
            height: '40px',
            p: 0
          }}
          aria-controls={open ? "account-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          className="ml-2 for-dark-notification"
        >
      { notifications.length > 0 ? (
          <Badge color="danger" variant="dot">
            <NotificationsActiveIcon color="action" />
          </Badge>
        ) :
          (
            <NotificationsActiveIcon color="action" />
          )}
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            padding: "5px 20px 5px",
            borderRadius: "10px",
            boxShadow: "0px 10px 35px rgba(50, 110, 189, 0.2)",
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <div className={styles.header}>
          <Typography variant="h4">Notifications</Typography>
          <Button variant="text" disabled={notifications.length === 0} onClick={() => {eraseRecent(userID); window.location.reload(true);}}>clear all</Button>
        </div>
        { notifications.length === 0 && 
          <Typography
              variant="h5"
              sx={{
                fontSize: "14px",
                color: "#260944",
                fontWeight: "400",
                mb: 1,
              }}
            >
              No new Notifications to show up.
            </Typography>
        }
        <div className={styles.notification}>
          {notifications.map((notif) => (
            <div className={styles.notificationList}>
            <Typography
              variant="h5"
              sx={{
                fontSize: "14px",
                color: "#260944",
                fontWeight: "500",
                mb: 1,
              }}
            >
              {notif.notifText}
            </Typography>

            <Typography sx={{ fontSize: "12px", color: "#A9A9C8", mt: 1 }}>
            {new Intl.DateTimeFormat("en-US", options).format(new Date(notif.notifDate))}
              
            </Typography>
          </div>

          ))}
          <Typography component="div" textAlign="center">
            <Link
              href="/notification/"
              underline="none"
              sx={{
                fontSize: "13px",
                color: "#757FEF",
                fontWeight: "500",
                mt: "10px",
                display: "inline-block",
              }}
            >
              View All{" "}
              <span className={styles.rightArrow}>
                <i className="ri-arrow-right-s-line"></i>
              </span>
            </Link>
          </Typography>
        </div>
      </Menu>
    </>
  );
};

export default Notification;

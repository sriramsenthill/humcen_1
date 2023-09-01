import * as React from "react";
import axios from "axios";
import {useState, useEffect} from "react";
import {
  IconButton,
  Typography,
  Box,
  Tooltip,
  Avatar,
  Menu,
  MenuItem,
  Link,
  ListItemIcon,
  Divider,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import Settings from "@mui/icons-material/Settings";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import Logout from "@mui/icons-material/Logout";

const Profile = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [partnerName, setPartnerName] = useState("");
  const [partnerAvatar, setPartnerAvatar] = useState("")
  const open = Boolean(anchorEl);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get("http://localhost:3000/api/partner/name", {
          headers: {
            Authorization: token,
          },
        })
        .then((response) => {
          const  partnerNameData  = response.data;
          setPartnerName(partnerNameData);
        })
        .catch((error) => {
          console.error("Error fetching partner name:", error);
        });
      // axios
      //   .get("http://localhost:3000/api/partner/img", {
      //     headers: {
      //       Authorization: token,
      //     },
      //   })
      //   .then((response) => {
      //     const  partnerAvatarData  = response.data;
      //     setPartnerAvatar(partnerAvatarData);
      //   })
      //   .catch((error) => {
      //     console.error("Error fetching partner name:", error);
      //   });
    }
  }, []);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <>
      <Tooltip title="Account settings">
        <IconButton
          onClick={handleClick}
          size="small"
          sx={{ p: 0 }}
          aria-controls={open ? "account-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          className="ml-2"
        >
          <Avatar
            src="images/Default_pfp.jpg"
            alt={partnerName}
            sx={{ width: 40, height: 40 }}
          />
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
        className="for-dark-top-navList"
      >
      <Link href="/settings" style={{textDecoration:"none"}}>
        <MenuItem>
        
          <Avatar src="images/Default_pfp.jpg" className="mr-1" />
          <Box>
            <Typography sx={{ fontSize: "11px", color: "#757FEF" }}>
              Partner
            </Typography>
            <Typography
              sx={{
                fontSize: "13px",
                color: "#260944",
                fontWeight: "500",
              }}
            >
              {partnerName}
            </Typography>
          </Box>
      
        </MenuItem>
</Link>
        <Divider />

        <MenuItem>
          <ListItemIcon sx={{ mr: "-8px", mt: "-3px" }}>
            <PersonIcon fontSize="small" />
          </ListItemIcon>
          <Link
            href="/pages/profile/"
            fontSize="13px"
            color="inherit"
            underline="none"
          >
            Profile
          </Link>
        </MenuItem>
{/* 
        <MenuItem>
          <ListItemIcon sx={{ mr: "-8px", mt: "-3px" }}>
            <MailOutlineIcon fontSize="small" />
          </ListItemIcon>
          <Link
            href="/email/inbox/"
            fontSize="13px"
            color="inherit"
            underline="none"
          >
            Inbox
          </Link>
        </MenuItem>

        <MenuItem>
          <ListItemIcon sx={{ mr: "-8px", mt: "-3px" }}>
            <ChatBubbleOutlineIcon fontSize="small" />
          </ListItemIcon>
          <Link
            href="/apps/chat/"
            fontSize="13px"
            color="inherit"
            underline="none"
          >
            Chat
          </Link>
        </MenuItem> */}

        <MenuItem>
          <ListItemIcon sx={{ mr: "-8px", mt: "-3px" }}>
            <Settings fontSize="small" />
          </ListItemIcon>
          <Link
            href="/settings/"
            fontSize="13px"
            color="inherit"
            underline="none"
          >
            Settings
          </Link>
        </MenuItem>

        <MenuItem>
          <ListItemIcon sx={{ mr: "-8px", mt: "-3px" }}>
            <AttachMoneyIcon fontSize="small" />
          </ListItemIcon>
          <Link
            href="/pages/pricing/"
            fontSize="13px"
            color="inherit"
            underline="none"
          >
            Pricing
          </Link>
        </MenuItem>

        <Divider />

        <MenuItem>
          <ListItemIcon sx={{ mr: "-8px", mt: "-3px" }}>
            <Logout fontSize="small" />
          </ListItemIcon>

          <Link
            href="/authentication/logout/"
            fontSize="13px"
            color="inherit"
            underline="none"
          >
            Logout
          </Link>
        </MenuItem>
      </Menu>
    </>
  );
};

export default Profile;

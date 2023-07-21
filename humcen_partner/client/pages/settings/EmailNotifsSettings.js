import * as React from "react";
import { useState, useEffect } from "react";
import Checkbox from "@mui/material/Checkbox";
import axios from "axios";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import { styled } from "@mui/system";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import EditIcon from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";
import { FormControlLabel } from "@mui/material";
import Switch from "@mui/material/Switch";

const IOSSwitch = styled((props) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 38,
  height: 20,
  padding: 0,
  "& .MuiSwitch-switchBase": {
    padding: 0,
    margin: 2,
    transitionDuration: "300ms",
    "&.Mui-checked": {
      transform: "translateX(16px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        backgroundColor: theme.palette.mode === "dark" ? "#2ECA45" : "#65C466",
        opacity: 1,
        border: 0,
      },
      "&.Mui-disabled + .MuiSwitch-track": {
        opacity: 0.5,
      },
    },
    "&.Mui-focusVisible .MuiSwitch-thumb": {
      color: "#33cf4d",
      border: "6px solid #fff",
    },
    "&.Mui-disabled .MuiSwitch-thumb": {
      color:
        theme.palette.mode === "light"
          ? theme.palette.grey[100]
          : theme.palette.grey[600],
    },
    "&.Mui-disabled + .MuiSwitch-track": {
      opacity: theme.palette.mode === "light" ? 0.7 : 0.3,
    },
  },
  "& .MuiSwitch-thumb": {
    boxSizing: "border-box",
    width: 18,
    height: 17,
  },
  "& .MuiSwitch-track": {
    borderRadius: 26 / 2,
    backgroundColor: theme.palette.mode === "light" ? "#F14242" : "#27AE60",
    opacity: 1,
    transition: theme.transitions.create(["background-color"], {
      duration: 500,
    }),
  },
}));

const ColorButton = styled(Button)(({ theme }) => ({
  color: "white",
  background: "#00ACF6",
  "&:hover": {
    background: "#00ACF6",
  },
  textTransform: "none",
  fontSize: "14px",
  fontWeight: "400",
}));


export default function Profile() {
  const [editMode, setEditMode] = React.useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [UID, setUserID] = useState("");
  const [essentialEmails, setEssentialEmails] = useState(false);
  const [orderUpdates, setOrderUpdates] = useState(false);
  const [marketingMails, setMarketingMails] = useState(false);
  const [newsletter, setNewsLetter] = useState(false);
  const open = Boolean(anchorEl);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get("http://localhost:3000/api/partner/settings", {
          headers: {
            Authorization: token,
          },
        })
        .then((response) => {
          const userId = response.data.userID;
          setUserID(UID);
          const essentialEmails = response.data.pref.mails;
          setEssentialEmails(essentialEmails);
          const orderUpdates = response.data.pref.order_updates;
          setOrderUpdates(orderUpdates);
          const marketingMails = response.data.pref.marketing_emails;
          setMarketingMails(marketingMails);
          const newsletter = response.data.pref.newsletter;
          setNewsLetter(newsletter);
        })
        .catch((error) => {
          console.error(
            "Error fetching Partner's Preferential Settings:",
            error
          );
        });
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
      <Card
        sx={{
          boxShadow: "none",
          borderRadius: "10px",
          mb: "15px",
          display: "flex",
          p: "12px 12px",
          flexDirection: "column",
          background: "white",
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} sm={8} md={8} style={{ flexBasis: "60%" }}>
            <TableContainer
              component={Paper}
              sx={{
                boxShadow: "none",
                background: "white",
              }}
            >
              <Table aria-label="simple table" className="dark-table">
                <TableHead></TableHead>

                <TableBody>
                  <TableRow>
                    <TableCell
                      sx={{
                        borderBottom: "1px solid #F7FAFF",
                        fontSize: "14px",
                        padding: "8px 10px",
                        fontWeight: "600",
                        color: "#223345",
                      }}
                    >
                      Essential Emails
                    </TableCell>

                    <TableCell
                      align="right"
                      sx={{
                        borderBottom: "2px solid #F7FAFF",
                        fontSize: "14px",
                        padding: "8px 10px",
                        fontWeight: "400",
                        color: "#828282",
                      }}
                    >
                      <FormControlLabel
                        style={{
                          marginLeft: 10,
                          position: "relative",
                          float: "right",
                        }}
                        control={
                          <IOSSwitch
                            sx={{ m: 1 }}
                            disabled={!editMode}
                            checked={essentialEmails}
                            onChange={() =>
                              setEssentialEmails(!essentialEmails)
                            }
                          />
                        }
                      />
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell
                      sx={{
                        borderBottom: "1px solid #F7FAFF",
                        fontSize: "14px",
                        padding: "8px 10px",
                        fontWeight: "600",
                        color: "#223345",
                      }}
                    >
                      Order Updates
                    </TableCell>

                    <TableCell
                      align="right"
                      sx={{
                        borderBottom: "1px solid #F7FAFF",
                        fontSize: "14px",
                        padding: "8px 10px",
                        fontWeight: "400",
                        color: "#828282",
                      }}
                    >
                      <FormControlLabel
                        style={{
                          marginLeft: 10,
                          position: "relative",
                          float: "right",
                        }}
                        control={
                          <IOSSwitch
                            sx={{ m: 1 }}
                            disabled={!editMode}
                            checked={orderUpdates}
                            onChange={() => setOrderUpdates(!orderUpdates)}
                          />
                        }
                      />
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell
                      sx={{
                        borderBottom: "1px solid #F7FAFF",
                        fontSize: "14px",
                        padding: "8px 10px",
                        fontWeight: "600",
                        color: "#223345",
                      }}
                    >
                      Marketing emails
                    </TableCell>

                    <TableCell
                      align="right"
                      sx={{
                        borderBottom: "1px solid #F7FAFF",
                        fontSize: "14px",
                        padding: "8px 10px",
                        fontWeight: "400",
                        color: "#828282",
                      }}
                    >
                      <FormControlLabel
                        style={{
                          marginLeft: 10,
                          position: "relative",
                          float: "right",
                        }}
                        control={
                          <IOSSwitch
                            sx={{ m: 1 }}
                            disabled={!editMode}
                            checked={marketingMails}
                            onChange={() =>
                              setMarketingMails(!marketingMails)
                            }
                          />
                        }
                      />
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell
                      sx={{
                        borderBottom: "1px solid #F7FAFF",
                        fontSize: "14px",
                        padding: "8px 10px",
                        fontWeight: "600",
                        color: "#223345",
                      }}
                    >
                      Newsletter
                    </TableCell>

                    <TableCell
                      align="right"
                      sx={{
                        borderBottom: "1px solid #F7FAFF",
                        fontSize: "14px",
                        padding: "8px 10px",
                        fontWeight: "400",
                        color: "#828282",
                      }}
                    >
                      <FormControlLabel
                        style={{
                          marginLeft: 10,
                          position: "relative",
                          float: "right",
                        }}
                        control={
                          <IOSSwitch
                            sx={{ m: 1 }}
                            disabled={!editMode}
                            checked={newsletter}
                            onChange={() => setNewsLetter(!newsletter)}
                          />
                        }
                      />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <Grid
            item
            xs={12}
            sm={6}
            md={6}
            align="right"
            style={{ flexBasis: "40%" }}
          >
            <IconButton
              color="#79E0F3"
              aria-label="add"
              sx={{
                borderRadius: "50%",
                width: "56px",
                height: "56px",
                backgroundColor: "#ECFCFF",
              }}
              onClick={() => {
                if (editMode) { 
                  setEditMode(false);
                  const token = localStorage.getItem("token");
                  axios.put('http://localhost:3000/api/partner/pref-settings',{data:{
                  userID: UID,
                  mails: essentialEmails,
                  order_updates: orderUpdates,
                  marketing_emails: marketingMails,
                  newsletter: newsletter,
                 }}, {headers:{
                  "Authorization": token,
                  "Content-Type": "application/json"
                 }})
                 .then((response) => res.json(response.data))
                 .catch((error) => console.error("Error in Updating Partner's Preferential Settings", error));
                 window.location.reload(true); 
                  }
                else { 
                  setEditMode(true)
               }
              }}
            >
              <EditIcon style={{ color: "#79E0F3" }} />
            </IconButton>
          </Grid>
        </Grid>
      </Card>
    </>
  );
}

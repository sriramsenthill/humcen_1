import * as React from "react";
import {useState, useEffect} from "react";
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



export default function Profile() {
  const [editMode, setEditMode] = React.useState(false);

  const [formData, setFormData] = useState({
    essential_emails: false,
    order_updates: false,
    marketing_emails: false,
    newsletter: false,
  });

  useEffect(() => {
    const fetchAdminProfileSettings = async() => {
      const response = await api.get("admin/settings").then((response) => {
        const emailNotifSettings = response.data.pref;
        console.log(emailNotifSettings);
        const newForm = {
          essential_emails: emailNotifSettings.essential_emails,
          order_updates: emailNotifSettings.order_updates,
          marketing_emails: emailNotifSettings.marketing_emails,
          newsletter: emailNotifSettings.newsletter
        };
        setFormData(newForm);
      }).catch((error) => {
        console.error("Error in Fetching Admin's Billing Settings : " + error);
      });
    }

    fetchAdminProfileSettings();

  }, []);

  const updateEmailNotifSettings = async(formData) => {
    try {
      const response = await api.put("admin/pref-settings", formData).then((response) => {
        console.log("Updated Email Notification Settings of Admin sent successfully : " + response.data);
      }).catch((error) => {
        console.error("Error in sending the Updated Email Notification Settings of Admin : " + error)
      })
    } catch(error) {
      console.error("Error in sending Admin's Updated Email Notification Settings : " + error);
    }
  }

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
                  <TableRow
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
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
                            checked={formData.essential_emails}
                            onChange={(e) => setFormData((formData) => {
                              return({
                                ...formData,
                                essential_emails: !(formData.essential_emails),
                              })
                            })}
                          />
                        }
                      />
                    </TableCell>
                  </TableRow>

                  <TableRow
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
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
                            checked={formData.order_updates}
                            onChange={(e) => setFormData((formData) => {
                              return({
                                ...formData,
                                order_updates: !(formData.order_updates),
                              })
                            })}
                          />
                        }
                      />
                    </TableCell>
                  </TableRow>

                  <TableRow
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
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
                            checked={formData.marketing_emails}
                            onChange={(e) => setFormData((formData) => {
                              return({
                                ...formData,
                                marketing_emails: !(formData.marketing_emails)
                              })
                            })}
                          />
                        }
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
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
                            checked={formData.newsletter}
                            onChange={(e) => setFormData((formData) => {
                              return({
                                ...formData,
                                newsletter: !(formData.newsletter),
                              })
                            })}
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
                  updateEmailNotifSettings(formData);
                  window.location.reload(true);
                  }
                else {
                  setEditMode(true)
                  };
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

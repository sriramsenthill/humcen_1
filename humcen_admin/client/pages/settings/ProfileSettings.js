import * as React from "react";
import { useState, useEffect } from "react";
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
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get("email"),
      password: data.get("password"),
    });
  };

  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState("");
  const [surname, setSurName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    const fetchAdminProfileSettings = async() => {
      const response = await api.get("admin/settings").then((response) => {
        const personalSettings = response.data
        setName(personalSettings.name);
        setSurName(personalSettings.surname);
        setEmail(personalSettings.email);
        setPhone(personalSettings.phone);
      }).catch((error) => {
        console.error("Error in fetching Admin's Profile Settings");
      });

    }

    fetchAdminProfileSettings();

  }, []);

  const updateAdminPersonalDetails = async(details) => {
    const response = await api.put("admin/settings", details).then((response) => {
      console.log("Admin's Personal Information Successfully Updated." + response.data);
    }).catch((error) => {
      console.error("Error in updating Admin's Personal Information Settings : " + error);
    }) 
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
                      Name
                    </TableCell>

                    <TableCell
                      align="left"
                      sx={{
                        borderBottom: "2px solid #F7FAFF",
                        fontSize: "14px",
                        padding: "8px 10px",
                        fontWeight: "400",
                        color: "#828282",
                      }}
                    >
                      {editMode ? (
                        <TextField
                          required
                          fullWidth
                          id="name"
                          label="Name"
                          name="name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                      ) : (
                        <Typography>{name}</Typography>
                      )}
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
                      Surname
                    </TableCell>

                    <TableCell
                      align="left"
                      sx={{
                        borderBottom: "1px solid #F7FAFF",
                        fontSize: "14px",
                        padding: "8px 10px",
                        fontWeight: "400",
                        color: "#828282",
                      }}
                    >
                      {editMode ? (
                        <TextField
                          required
                          fullWidth
                          id="surname"
                          label="Surname"
                          name="surname"
                          value={surname}
                          onChange={(e) => setSurName(e.target.value)}
                        />
                      ) : (
                        <Typography>{surname}</Typography>
                      )}
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
                      Email
                    </TableCell>

                    <TableCell
                      align="left"
                      sx={{
                        borderBottom: "1px solid #F7FAFF",
                        fontSize: "14px",
                        padding: "8px 10px",
                        fontWeight: "400",
                        color: "#828282",
                      }}
                    >
                      {editMode ? (
                        <TextField
                          required
                          fullWidth
                          id="email"
                          label="Email"
                          name="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      ) : (
                        <Typography>
                          {email}
                        </Typography>
                      )}
                    </TableCell>
                  </TableRow>

                  <TableRow
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  ></TableRow>

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
                      Phone
                    </TableCell>

                    <TableCell
                      align="left"
                      sx={{
                        borderBottom: "1px solid #F7FAFF",
                        fontSize: "14px",
                        padding: "8px 10px",
                        fontWeight: "400",
                        color: "#828282",
                      }}
                    >
                      {editMode ? (
                        <TextField
                          required
                          fullWidth
                          id="phno"
                          label="Phone"
                          name="phno"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                        />
                      ) : (
                        <Typography>{phone}</Typography>
                      )}
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
                if (editMode === true) {
                  setEditMode(false);
                  const updatedSettings = {
                    name: name,
                    surname: surname,
                    email: email,
                    phone: phone,
                  }
                  updateAdminPersonalDetails(updatedSettings);
                  window.location.reload(true);

                } else {
                  setEditMode(true);
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

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

export default function Profile() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [UID, setUserID] = useState("");
  const [applicantType, setApplicantType] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [companyID, setCompanyID] = useState("");
  const [vatPayer, setVatPayer] = useState("");
  const [phone, setPhone] = useState("");
  const [position, setPosition] = useState("");
  const [street, setStreet] = useState("");
  const [town, setTown] = useState("");
  const [postCode, setPostCode] = useState("");
  const [country, setCountry] = useState("");

 
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
          const UsID = response.data.userID;
          setUserID(UsID);
          const firstName = response.data.first_name;
          setFirstName(firstName);
          const email = response.data.email;
          setEmail(email);
          const lastName = response.data.last_name;
          setLastName(lastName);
          const applicantType = response.data.applicant_type;
          setApplicantType(applicantType);
          const businessName = response.data.business_name;
          setBusinessName(businessName);
          const companyID = response.data.company_id;
          setCompanyID(companyID);
          const vatPayer = response.data.vat_payer;
          setVatPayer(vatPayer);
          const phone = response.data.phno;
          setPhone(phone);
          const position = response.data.position;
          setPosition(position);
          const street = response.data.street;
          setStreet(street);
          const town = response.data.town;
          setTown(town);
          const postCode = response.data.post_code;
          setPostCode(postCode);
          const country = response.data.country;
          setCountry(country);
  
        })
        .catch((error) => {
          console.error("Error fetching profile Settings:", error);
        });
    }
  }, []);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get("email"),
      password: data.get("password"),
    });
  };

  const [editMode, setEditMode] = useState(false);

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
                      Applicant Type
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
                          id="applicant_type"
                          label="Applicant Type"
                          name="applicant_type"
                          placeholder="Applicant Type"
                          value={applicantType}
                          onChange={(e) => setApplicantType(e.target.value)}
                        />
                      ) : (
                        <Typography>
                          {applicantType}
                        </Typography>
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
                      Business Name
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
                          id="business_name"
                          label="Business Name"
                          name="business_name"
                          placeholder="Business Name"
                          value={businessName}
                          onChange={(e) => setBusinessName(e.target.value)}
                        />
                      ) : (
                        <Typography>{businessName}</Typography>
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
                      Company ID
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
                          id="companyID"
                          label="Company ID"
                          name="companyID"
                          placeholder="Company ID"
                          value={companyID}
                          onChange={(e) => setCompanyID(e.target.value)}
                        />
                      ) : (
                        <Typography>{companyID}</Typography>
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
                      VAT Payer
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
                          id="vat"
                          label="VAT Payer"
                          name="name"
                          placeholder="VAT Payer"
                          value={vatPayer}
                          onChange={(e) => setVatPayer(e.target.value)}
                        />
                      ) : (
                        <Typography>{vatPayer}</Typography>
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
                          placeholder="Name"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                        />
                      ) : (
                        <Typography>{firstName}</Typography>
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
                          placeholder="Last Name"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                        />
                      ) : (
                        <Typography>{lastName}</Typography>
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
                          placeholder="Email ID"
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
                          placeholder="Phone Number"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                        />
                      ) : (
                        <Typography>{phone}</Typography>
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
                      Position
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
                          id="position"
                          label="Position"
                          name="position"
                          placeholder="Position"
                          value={position}
                          onChange={(e) => setPosition(e.target.value)}
                        />
                      ) : (
                        <Typography>{position}</Typography>
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
                      Street
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
                          id="street"
                          label="Street"
                          name="street"
                          placeholder="Street"
                          value={street}
                          onChange={(e) => setStreet(e.target.value)}
                        />
                      ) : (
                        <Typography>
                          {street}
                        </Typography>
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
                      Town
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
                          id="town"
                          label="Town"
                          name="town"
                          placeholder="Town"
                          value={town}
                          onChange={(e) => setTown(e.target.value)}
                        />
                      ) : (
                        <Typography>{town}</Typography>
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
                      Postcode
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
                          id="street"
                          label="Street"
                          name="street"
                          placeholder="Post Code"
                          value={postCode}
                          onChange={(e) => setPostCode(e.target.value)}
                        />
                      ) : (
                        <Typography>{postCode}</Typography>
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
                      Country
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
                          id="street"
                          label="Street"
                          name="street"
                          placeholder="Country"
                          value={country}
                          onChange={(e) => setCountry(e.target.value)}
                        />
                      ) : (
                        <Typography>{country}</Typography>
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
                  const token = localStorage.getItem("token");
                  axios.put('http://localhost:3000/api/partner/settings',{data:{
                  userId: UID,
                  applicant_type: applicantType,
                  business_name: businessName,
                  company_id: companyID,
                  vat_payer: vatPayer,
                  first_name: firstName,
                  last_name: lastName,
                  email: email,
                  phone: phone,
                  position: position,
                  street: street,
                  town: town,
                  post_code: postCode,
                  country: country
                 }}, {headers:{
                  "Authorization": token,
                  "Content-Type": "application/json"
                 }})
                 .then((response) => res.json(response.data))
                 .catch((error) => console.error("Error in Updating Partner's Settings", error));
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

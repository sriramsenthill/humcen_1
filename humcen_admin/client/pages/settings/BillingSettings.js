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


export default function BillingSettings() {
  const [editMode, setEditMode] = useState(false);

  const [formData, setFormData] = useState({
    bankName: "",
    accountNumber: "",
    accountName: "",
    branch: "",
    ifscCode: "",
    address: "",
    town: "",
    postcode: "",
    country: "",
  });

  useEffect(() => {
    const fetchAdminProfileSettings = async() => {
      const response = await api.get("admin/settings").then((response) => {
        const billingSettings = response.data.billing;
        console.log(billingSettings);
        const newForm = {
          bankName: billingSettings.bank_name,
          accountNumber: billingSettings.account_number,
          accountName: billingSettings.account_name,
          branch: billingSettings.branch,
          ifscCode: billingSettings.ifsc_code,
          address: billingSettings.address,
          town: billingSettings.town,
          postcode: billingSettings.postcode,
          country: billingSettings.country,
        };
        setFormData(newForm);
      }).catch((error) => {
        console.error("Error in Fetching Admin's Billing Settings : " + error);
      });
    }

    fetchAdminProfileSettings();

  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const updateBilling = async(formData) => {
    try {
      const response = await api.put("admin/billing-settings", formData).then((response) => {
        console.log("Updated Billing Settings of Admin sent successfully : " + response.data);
      }).catch((error) => {
        console.error("Error in sending the Updated Billing Settings of Admin : " + error)
      })
    } catch(error) {
      console.error("Error in sending Admin's Updated Billing Information Settings : " + error);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    updateBilling(formData);
    console.log(e);
    console.log("inside handleSubmit");
    setEditMode(false);
    window.location.reload(true);

    

    
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
            {editMode ? (
              <form onSubmit={handleSubmit}>
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
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
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
                          Bank Name
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
                          <TextField
                            required
                            fullWidth
                            id="bank_name"
                            label="Bank Name"
                            name="bank_name"
                            value={formData.bankName}
                            onChange={(e) => setFormData((formData) => {
                              return({
                                ...formData,
                                bankName: e.target.value
                              })
                            })}
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
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
                          Account Number
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
                          <TextField
                            required
                            fullWidth
                            id="acc_no"
                            label="Account Number"
                            name="acc_no"
                            value={formData.accountNumber}
                            onChange={(e) => setFormData((formData) => {
                              return({
                                ...formData,
                                accountNumber: e.target.value
                              })
                            })}
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
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
                          Account Name
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
                          <TextField
                            required
                            fullWidth
                            id="acc_name"
                            label="Account Name"
                            name="acc_name"
                            value={formData.accountName}
                            onChange={(e) => setFormData((formData) => {
                              return({
                                ...formData,
                                accountName: e.target.value
                              })
                            })}
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
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
                          Branch
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
                          <TextField
                            required
                            fullWidth
                            id="branch"
                            label="Branch Name"
                            name="branch"
                            value={formData.branch}
                            onChange={(e) => setFormData((formData) => {
                              return({
                                ...formData,
                                branch: e.target.value
                              })
                            })}
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
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
                          IFSC Code
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
                          <TextField
                            required
                            fullWidth
                            id="ifsc"
                            label="IFSC Code"
                            name="ifsc"
                            value={formData.ifscCode}
                            onChange={(e) => setFormData((formData) => {
                              return({
                                ...formData,
                                ifscCode: e.target.value
                              })
                            })}
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
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
                          Address
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
                          <TextField
                            required
                            fullWidth
                            id="address"
                            label="Address"
                            name="address"
                            value={formData.address}
                            onChange={(e) => setFormData((formData) => {
                              return({
                                ...formData,
                                address: e.target.value
                              })
                            })}
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
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
                            borderBottom: "1px solid #F7FAFF",
                            fontSize: "14px",
                            padding: "8px 10px",
                            fontWeight: "400",
                            color: "#828282",
                          }}
                        >
                          <TextField
                            required
                            fullWidth
                            id="town"
                            label="Town"
                            name="town"
                            value={formData.town}
                            onChange={(e) => setFormData((formData) => {
                              return({
                                ...formData,
                                town: e.target.value
                              })
                            })}
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
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
                            borderBottom: "1px solid #F7FAFF",
                            fontSize: "14px",
                            padding: "8px 10px",
                            fontWeight: "400",
                            color: "#828282",
                          }}
                        >
                          <TextField
                            required
                            fullWidth
                            id="postcode"
                            label="Postcode"
                            name="postcode"
                            value={formData.postcode}
                            onChange={(e) => setFormData((formData) => {
                              return({
                                ...formData,
                                postcode: e.target.value
                              })
                            })}
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
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
                          <TextField
                            required
                            fullWidth
                            id="country"
                            label="Country"
                            name="country"
                            value={formData.country}
                            onChange={(e) => setFormData((formData) => {
                              return({
                                ...formData,
                                country: e.target.value
                              })
                            })}
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell
                          sx={{
                            borderBottom: "1px solid #F7FAFF",
                            fontSize: "14px",
                            padding: "8px 10px",
                            fontWeight: "600",
                            color: "#223345",
                          }}
                        ></TableCell>

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
                          <Button type="submit">Submit Changes</Button>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </form>
            ) : (
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
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}
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
                        Bank Name
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
                        <Typography>{formData.bankName}</Typography>
                      </TableCell>
                    </TableRow>
                    <TableRow
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}
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
                        Account Number
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
                        <Typography>{formData.accountNumber}</Typography>
                      </TableCell>
                    </TableRow>
                    <TableRow
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}
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
                        Account Name
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
                        <Typography>{formData.accountName}</Typography>
                      </TableCell>
                    </TableRow>
                    <TableRow
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}
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
                        Branch
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
                        <Typography>{formData.branch}</Typography>
                      </TableCell>
                    </TableRow>
                    <TableRow
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}
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
                        IFSC Code
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
                        <Typography>{formData.ifscCode}</Typography>
                      </TableCell>
                    </TableRow>
                    <TableRow
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}
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
                        Address
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
                        <Typography>
                          {formData.address}
                        </Typography>
                      </TableCell>
                    </TableRow>
                    <TableRow
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}
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
                          borderBottom: "1px solid #F7FAFF",
                          fontSize: "14px",
                          padding: "8px 10px",
                          fontWeight: "400",
                          color: "#828282",
                        }}
                      >
                        <Typography>{formData.town}</Typography>
                      </TableCell>
                    </TableRow>
                    <TableRow
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}
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
                          borderBottom: "1px solid #F7FAFF",
                          fontSize: "14px",
                          padding: "8px 10px",
                          fontWeight: "400",
                          color: "#828282",
                        }}
                      >
                        <Typography>{formData.postcode}</Typography>
                      </TableCell>
                    </TableRow>
                    <TableRow
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}
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
                        <Typography>{formData.country}</Typography>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            )}
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
                  handleSubmit;
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

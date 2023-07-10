import * as React from "react";
import { useState } from "react";
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

export default function BillingSettings() {
  const [editMode, setEditMode] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(e);
    console.log("inside handleSubmit");
    setEditMode(false);

    try {
      await axios.post("/update-partner", formData);

      alert("Partner information updated successfully");

      setFormData({
        email: "",
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
    } catch (error) {
      console.error(error);
      alert("An error occurred");
    }
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
                        <Typography>XYZ Bank</Typography>
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
                        <Typography>123456789710345</Typography>
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
                        <Typography>Bibin Matthew</Typography>
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
                        <Typography>Ambattur</Typography>
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
                        <Typography>1246XYZ314</Typography>
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
                          Olympia Technology Park, Level 2,Altius Block,No.1,
                          SIDCO Industrial Estate
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
                        <Typography>Chennai</Typography>
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
                        <Typography>600032</Typography>
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
                        <Typography>India</Typography>
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

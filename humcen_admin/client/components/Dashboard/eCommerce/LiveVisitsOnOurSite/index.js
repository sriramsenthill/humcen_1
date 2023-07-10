import React from "react";
import { Box, Typography, Grid } from "@mui/material";
import Card from "@mui/material/Card";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import LiveVisitsChart from "./LiveVisitsChart";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

const LiveVisitsOnOurSite = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
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
          border: "1px solid black",
          margin: "10px",
          p: "25px",
          mb: "15px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingBottom: "10px",
            mb: "20px",
          }}
          className="for-dark-bottom-border"
        >
          <Typography
            as="h3"
            sx={{
              fontSize: 18,
              fontWeight: 500,
            }}
          >
            Live Visits on Our Site
          </Typography>
        </Box>
        <Grid container spacing={2}>
          <Grid item xs={12} md={7}>
            <LiveVisitsChart />
          </Grid>
          <Grid item xs={12} md={5}>
            <Card
              sx={{
                boxShadow: "none",
                borderRadius: "10px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Typography
                sx={{
                  fontFamily: "Inter",
                  fontStyle: "normal",
                  fontWeight: "400",
                  fontSize: "24px",
                  lineHeight: "140%",
                }}
              >
                Summary
              </Typography>
              <br />
              <TableContainer
                component={Paper}
                sx={{
                  boxShadow: "none",
                }}
              >
                <Table aria-label="simple table" className="dark-table">
                  <TableHead></TableHead>

                  <TableBody>
                    <TableRow
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell
                        align="left"
                        sx={{
                          borderBottom: "1px solid #F7FAFF",
                          fontSize: "12px",
                          padding: "8px 10px",
                          fontWeight: "500",
                        }}
                      >
                        Service Fee
                      </TableCell>

                      <TableCell
                        align="right"
                        sx={{
                          borderBottom: "1px solid #F7FAFF",
                          fontSize: "12px",
                          padding: "8px 10px",
                          fontWeight: "500",
                        }}
                      >
                        $1500
                      </TableCell>
                    </TableRow>

                    <TableRow
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell
                        sx={{
                          borderBottom: "1px solid #F7FAFF",
                          fontSize: "12px",
                          padding: "8px 10px",
                          fontWeight: "500",
                        }}
                      >
                        Discount 10%
                      </TableCell>

                      <TableCell
                        align="right"
                        sx={{
                          borderBottom: "1px solid #F7FAFF",
                          fontSize: "12px",
                          padding: "8px 10px",
                          fontWeight: "500",
                        }}
                      >
                        - $150
                      </TableCell>
                    </TableRow>

                    <TableRow
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell
                        sx={{
                          borderBottom: "1px solid #F7FAFF",
                          fontSize: "12px",
                          padding: "8px 10px",
                          fontWeight: "500",
                        }}
                      >
                        Administrative Fee
                      </TableCell>

                      <TableCell
                        align="right"
                        sx={{
                          borderBottom: "1px solid #F7FAFF",
                          fontSize: "12px",
                          padding: "8px 10px",
                          fontWeight: "500",
                        }}
                      >
                        $200
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
                          fontSize: "18px",
                          padding: "8px 10px",
                          fontWeight: "800",
                          color: "#000",
                        }}
                      >
                        Total (USD) :
                      </TableCell>

                      <TableCell
                        align="right"
                        sx={{
                          borderBottom: "1px solid #F7FAFF",
                          fontSize: "18px",
                          padding: "8px 10px",
                          fontWeight: "800",
                          color: "#000",
                        }}
                      >
                        $1550
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>
          </Grid>
        </Grid>
      </Card>
    </>
  );
};

export default LiveVisitsOnOurSite;

import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TablePagination,
  TableRow,
  IconButton,
  useTheme,
} from "@mui/material";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import PropTypes from "prop-types";
import styled from "@emotion/styled";
import Rating from "@mui/material/Rating";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { createTheme, ThemeProvider } from "@mui/material/styles";

function formatDate(date) {
  const options = { month: "long", day: "numeric", year: "numeric" };
  return new Date(date).toLocaleDateString(undefined, options);
}

function getStatusColor(status) {
  if (status === "In Progress") {
    return "Gold"; // Set the color to yellow for "in progress" status
  } else if (status === "Completed") {
    return "Green"; // Set the color to green for "completed" status
  } else if (status === "Pending") {
    return "Red"; // Set the color to Red for "Pending" status
  }
  return ""; // Default color if the status value is not matched
}

const StyledRating = styled(Rating)({
  "& .MuiRating-iconFilled": {
    color: "#68BDFD",
    fontSize: "10",
  },
});

function RecentPartner(props) {
  const { count, page, rowsPerPage, onPageChange } = props;
  const theme = useTheme();

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handlePrevButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handlePrevButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

RecentPartner.propTypes = {
  count: PropTypes.number.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

async function fetchPartnerData() {
  try {
    const response = await fetch("http://localhost:3000/api/admin/partner");
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error("Error fetching partner data:", error);
    return [];
  }
}

function RecentPartners() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [count, setCount] = useState(0);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchPartnerData();
      setCount(data.length);
      setRows(data);
    };

    fetchData();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, count - page * rowsPerPage);

  return (
    <Card>
      <Box sx={{ p: 2 }}>
        <TableContainer component={Paper}>
          <Table aria-label="custom pagination table" className="dark-table">
            <TableHead>
              <TableRow>
                <TableCell>User ID</TableCell>
                <TableCell>Full Name</TableCell>
                <TableCell>Age</TableCell>
                <TableCell>Domain</TableCell>
                <TableCell>Patent Agent</TableCell>
                <TableCell>Cert No</TableCell>
                <TableCell>Jurisdiction</TableCell>
                <TableCell>City</TableCell>
                <TableCell>State</TableCell>
                <TableCell>Zip Code</TableCell>
                <TableCell>Tax ID No</TableCell>
                <TableCell>LinkedIn Profile</TableCell>
                <TableCell>Years of Experience</TableCell>
                <TableCell>Expertise In</TableCell>
                <TableCell>Can Handle</TableCell>
                <TableCell>Jobs</TableCell>
                <TableCell>Ratings</TableCell>
                <TableCell>Current Status</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => (
                  <TableRow key={row._id.userID}>
                    <TableCell>{row._id.userID}</TableCell>
                    <TableCell>{row.full_name}</TableCell>
                    <TableCell>{row.age}</TableCell>
                    <TableCell>{row.domain}</TableCell>
                    <TableCell>{row["Patent Agent"]}</TableCell>
                    <TableCell>{row.cert_no || "To be assigned"}</TableCell>
                    <TableCell>{row.jurisdiction}</TableCell>
                    <TableCell>{row.city}</TableCell>
                    <TableCell>{row.state}</TableCell>
                    <TableCell>{row.zip_code}</TableCell>
                    <TableCell>{row.tax_ID_no}</TableCell>
                    <TableCell>{row.linkedin_profile}</TableCell>
                    <TableCell>{row.years_of_exp}</TableCell>
                    <TableCell>{row.expertise_in}</TableCell>
                    <TableCell>{row.can_handle}</TableCell>
                    <TableCell>{row.jobs.join(", ")}</TableCell>
                    <TableCell>
                      <StyledRating name="read-only" value="2.5" readOnly />
                    </TableCell>
                    <TableCell>Completed</TableCell>
                    <TableCell>
                      <IconButton>
                        <MoreVertIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={17} />
                </TableRow>
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  colSpan={17}
                  count={count}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      </Box>
    </Card>
  );
}

export default RecentPartners;

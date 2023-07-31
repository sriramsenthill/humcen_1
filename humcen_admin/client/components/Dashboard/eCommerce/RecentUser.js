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

function RecentUser(props) {
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

RecentUser.propTypes = {
  count: PropTypes.number.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

async function fetchUserData() {
  try {
    const response = await fetch("http://localhost:3000/api/admin/customer");
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return [];
  }
}

function RecentUsers() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [count, setCount] = useState(0);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchUserData();
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
    const sortedData = [...rows].sort((a, b) => {
      // Check if the full_name property is undefined in either a or b
      if (a.first_name === undefined || b.first_name === undefined) {
        // Keep the original order if any of the full_name properties is undefined
        return 0;
      } else {
        return a.first_name.localeCompare(b.first_name);
      }
    });

    
  return (
    <Card>
      <Box sx={{ p: 2 }}>
        <TableContainer component={Paper}>
          <Table aria-label="custom pagination table" className="dark-table">
            <TableHead>
              <TableRow>
                <TableCell>User ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone No</TableCell>
                <TableCell>City</TableCell>
                <TableCell>Street</TableCell>
                <TableCell>State</TableCell>
                <TableCell>Zip Code</TableCell>
                <TableCell>Tax ID</TableCell>
                <TableCell>Website</TableCell>
                <TableCell>Industry Sector</TableCell>
                <TableCell>Employee Name</TableCell>
                <TableCell>Employee Surname</TableCell>
                <TableCell>Employee Position</TableCell>
              
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => (
                  <TableRow key={row._id.$oid}>
                    <TableCell>{row.userID}</TableCell>
                    <TableCell>{row.first_name+" "+row.last_name}</TableCell>
                    <TableCell>{row.email}</TableCell>
                    <TableCell>{row.phno}</TableCell>
                    <TableCell>{row.city}</TableCell>
                    <TableCell>{row.street}</TableCell>
                    <TableCell>{row.state}</TableCell>
                    <TableCell>{row.zipcode}</TableCell>
                    <TableCell>{row.user_specific_data?.tax_ID??"To be assigned"}</TableCell>
                    <TableCell>
                      {row.user_specific_data?.website ?? "To be assigned"}
                    </TableCell>
                    <TableCell>
                      {row.user_specific_data?.ind_sec ?? "To be assigned"}
                    </TableCell>
                    <TableCell>
                      {row.user_specific_data?.emp_name ?? "To be assigned"}
                    </TableCell>
                    <TableCell>
                      {row.user_specific_data?.emp_surname ?? "To be assigned"}
                    </TableCell>
                    <TableCell>
                      {row.user_specific_data?.emp_pos ?? "To be assigned"}
                    </TableCell>
                  </TableRow>
                ))}
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={16} />
                </TableRow>
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  colSpan={16}
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

export default RecentUsers;

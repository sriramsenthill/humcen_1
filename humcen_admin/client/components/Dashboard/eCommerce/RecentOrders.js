import React, { useState, useEffect } from "react";
import Link from "next/link";
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

function RecentOrder(props) {
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

RecentOrder.propTypes = {
  count: PropTypes.number.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

async function fetchJobOrders() {
  try {
    const response = await fetch("http://localhost:3000/api/admin/job_order");
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error("Error fetching job orders:", error);
    return [];
  }
}

function RecentOrders() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [count, setCount] = useState(0);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchJobOrders();
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
                <TableCell>Job No</TableCell>
                <TableCell>Service</TableCell>
                <TableCell>Country</TableCell>
                <TableCell>Submitted Date</TableCell>
                <TableCell>Delivery Date</TableCell>
                <TableCell>Budget</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>User ID</TableCell>
                <TableCell>User Name</TableCell>
                <TableCell>Partner ID</TableCell>
                <TableCell>Partner Name</TableCell>
                <TableCell>Job Title</TableCell>
                <TableCell>Job Description</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => (
                  <TableRow key={row._id.job_no}>
                    <TableCell>{row._id.job_no}</TableCell>
                    <TableCell>{row.service}</TableCell>
                    <TableCell>{row.country}</TableCell>
                    <TableCell>{formatDate(row.start_date)}</TableCell>
                    <TableCell>{formatDate(row.end_date)}</TableCell>
                    <TableCell>{row.budget}</TableCell>
                    <TableCell
                      style={{
                        color: getStatusColor(row.status),
                        fontWeight: "bold",
                      }}
                    >
                      {row.status}
                    </TableCell>
                    <TableCell>{row.userID || "To be assigned"}</TableCell>
                    <TableCell>{row.userName || "To be assigned"}</TableCell>
                    <TableCell>{row.partnerID || "To be assigned"}</TableCell>
                    <TableCell>{row.partnerName || "To be assigned"}</TableCell>
                    <TableCell>{row.job_title || "To be assigned"}</TableCell>
                    <TableCell>{row.job_desc || "To be assigned"}</TableCell>
                    <TableCell>
                      <Link href={`onGoingPatents/${row._id.job_no}`} passHref>
                        Details
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={13} />
                </TableRow>
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  colSpan={13}
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

export default RecentOrders;

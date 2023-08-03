import React, { useState, useEffect } from "react";
import axios from 'axios';
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
  Button,
} from "@mui/material";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import PropTypes from "prop-types";
import styles from "@/styles/PageTitle.module.css"

function formatDate(date) {
  const options = { month: "long", day: "numeric", year: "numeric" };
  return new Date(date).toLocaleDateString(undefined, options);
}

function MyIncomes(props) {
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

MyIncomes.propTypes = {
  count: PropTypes.number.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};


// Create an Axios instance
const api = axios.create({
  baseURL: 'http://localhost:3000/api',
});

// Add an interceptor to include the token in the request headers
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = token;
  }
  return config;
});



async function fetchJobOrders() {
  try {
    const response = await api.get('/partner/job_order');
    const { jobOrders } = response.data; // Extract the jobOrders array from the response data

    if (Array.isArray(jobOrders)) {
      return jobOrders;
    } else {
      console.error('Invalid data format: Expected an array');
      return [];
    }
  } catch (error) {
    console.error('Error fetching job orders:', error);
    return [];
  }
}

function getPayStatusColor(payStatus) {
  if (payStatus === "unpaid") {
    return ({
      background: "rgba(238,54,140,.1)",
      borderRadius: "4px",
      color: "#ee368c",
      padding: "5px 13px",
      display: "inline-block",
  })

  }
 else {
    return ({
      background: "rgba(0, 182, 155, 0.1)",
      borderRadius: "4px",
      color: "#00b69b",
      fontWeight: "bold",
      padding: "5px 13px",
      display: "inline-block",
  })  // Set the color to green for "completed" status
  }  
 // Default color if the status value is not matched
}


function MyIncome() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [count, setCount] = useState(0);
  const [rows, setRows] = useState([]);
  
  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchJobOrders();
      const sortedData = data.sort((a, b) => b._id.job_no - a._id.job_no); // Sort by job_no in descending order
      setCount(sortedData.length);
      setRows(sortedData);
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
      <Box sx={{ p: 0 }}>
        <h1 className={styles.heading2} style={{
          marginBottom: "30px",
          marginTop: "10px",
          marginLeft: "12px"
        }}>My Income History</h1>
        <TableContainer component={Paper} sx={{
            boxShadow: "none",
          }}>
          <Table sx={{ minWidth: 950 }} aria-label="custom pagination table" className="dark-table">
            <TableHead sx={{ background: "#F7FAFF" }}>
              <TableRow>
                <TableCell sx={{
                    borderBottom: "1px solid #F7FAFF",
                    fontSize: "13.5px",
                    fontWeight: 'bold',
                    padding: "15px 10px",
                    textAlign: "center",
                  }}>
                Job No
                </TableCell>
                <TableCell sx={{
                    borderBottom: "1px solid #F7FAFF",
                    fontSize: "13.5px",
                    fontWeight: 'bold',
                    padding: "15px 10px",
                    textAlign: "center",
                  }}>
                Patent Service
                </TableCell>
                <TableCell sx={{
                    borderBottom: "1px solid #F7FAFF",
                    fontSize: "13.5px",
                    fontWeight: 'bold',
                    padding: "15px 10px",
                    textAlign: "center",
                  }}>Country</TableCell>
                <TableCell sx={{
                    borderBottom: "1px solid #F7FAFF",
                    fontSize: "13.5px",
                    fontWeight: 'bold',
                    padding: "15px 10px",
                    textAlign: "center",
                  }}>Amount</TableCell>
                <TableCell sx={{
                    borderBottom: "1px solid #F7FAFF",
                    fontSize: "13.5px",
                    fontWeight: 'bold',
                    padding: "15px 10px",
                    textAlign: "center",
                  }}>Delivery Date</TableCell>
                <TableCell sx={{
                    borderBottom: "1px solid #F7FAFF",
                    fontSize: "13.5px",
                    fontWeight: 'bold',
                    padding: "15px 10px",
                    textAlign: "center",
                  }}>Status</TableCell>
                <TableCell sx={{
                    borderBottom: "1px solid #F7FAFF",
                    fontSize: "13.5px",
                    fontWeight: 'bold',
                    padding: "15px 10px",
                    textAlign: "center",
                  }}>Download Files</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => (
                  <TableRow key={row._id.job_no}>
                    <TableCell sx={{
                      width: 100,
                      fontWeight: "bold",
                      borderBottom: "1px solid #F7FAFF",
                      padding: "8px 10px",
                      fontSize: "13px",
                      textAlign: "center",
                    }}>
                    {row._id.job_no}
                    </TableCell>
                    <TableCell sx={{
                      width: 100,
                      fontWeight: "bold",
                      borderBottom: "1px solid #F7FAFF",
                      padding: "8px 10px",
                      fontSize: "13px",
                      textAlign: "center",
                    }}>
                    {row.service}
                    </TableCell>
                    <TableCell sx={{
                      width: 100,
                      borderBottom: "1px solid #F7FAFF",
                      padding: "8px 10px",
                      fontSize: "13px",
                      textAlign: "center",
                    }}>
                    {row.country}
                    </TableCell>
                    <TableCell sx={{
                      width: 100,
                      borderBottom: "1px solid #F7FAFF",
                      padding: "8px 10px",
                      fontSize: "13px",
                      textAlign: "center",
                    }}>
                    {row.amount}
                    </TableCell>
                    <TableCell sx={{
                      width: 100,
                      borderBottom: "1px solid #F7FAFF",
                      padding: "8px 10px",
                      fontSize: "13px",
                      textAlign: "center",
                    }}>{formatDate(row.end_date)}</TableCell>
                    <TableCell
                    sx={{
                      fontWeight: 500,
                      borderBottom: "1px solid #F7FAFF",
                      fontSize: "11px",
                      width: 100,
                      padding: "8px 10px",
                      textAlign: "center",
                    }}
                    >
                    { row.pay_status && <span style={getPayStatusColor(row.pay_status)}>{row.pay_status}</span>}
                    </TableCell>
                    <TableCell sx={{
                      width: 100,
                      borderBottom: "1px solid #F7FAFF",
                      padding: "8px 10px",
                      fontSize: "13px",
                      textAlign: "center",
                    }}> <Button
                    sx={{
                      background: "#00ACF6",
                      color: "white",
                      borderRadius: "100px",
                      width: "150px",
                      height: "80%",
                      textTransform: "none",
                    }}
                  >
                  Download Invoice
                  </Button></TableCell>
                  </TableRow>
                ))}
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={9} />
                </TableRow>
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  colSpan={9}
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

export default MyIncome;

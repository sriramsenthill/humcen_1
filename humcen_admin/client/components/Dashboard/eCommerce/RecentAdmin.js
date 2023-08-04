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

function RecentAdmin(props) {
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

RecentAdmin.propTypes = {
  count: PropTypes.number.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

async function fetchAdminData() {
  try {
    const response = await fetch("http://localhost:3000/api/admin/admin");
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error("Error fetching admin data:", error);
    return [];
  }
}

function RecentAdmins() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [count, setCount] = useState(0);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchAdminData();
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
      if (a.name === undefined || b.name === undefined) {
        // Keep the original order if any of the full_name properties is undefined
        return 0;
      } else {
        return a.name.localeCompare(b.name);
      }
    });


  return (
    <Card>
      <Box sx={{ p: 2 }}>
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
                    width: "100px",
                    textAlign: "center",
                  }}>Name</TableCell>
                <TableCell sx={{
                    borderBottom: "1px solid #F7FAFF",
                    fontSize: "13.5px",
                    fontWeight: 'bold',
                    padding: "15px 10px",
                    width: "100px",
                    textAlign: "center",
                  }}>Surname</TableCell>
                <TableCell sx={{
                    borderBottom: "1px solid #F7FAFF",
                    fontSize: "13.5px",
                    fontWeight: 'bold',
                    padding: "15px 10px",
                    width: "100px",
                    textAlign: "center",
                  }}>Email</TableCell>
                <TableCell sx={{
                    borderBottom: "1px solid #F7FAFF",
                    fontSize: "13.5px",
                    fontWeight: 'bold',
                    padding: "15px 10px",
                    width: "100px",
                    textAlign: "center",
                  }}>Phone</TableCell>
                <TableCell sx={{
                    borderBottom: "1px solid #F7FAFF",
                    fontSize: "13.5px",
                    fontWeight: 'bold',
                    padding: "15px 10px",
                    width: "100px",
                    textAlign: "center",
                  }}>Preferences</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => (
                  <TableRow key={row._id["$oid"]}>
                    <TableCell sx={{
                      width: 100,
                      fontWeight: "bold",
                      borderBottom: "1px solid #F7FAFF",
                      padding: "8px 10px",
                      textAlign: "center",
                      fontSize: "13px"
                    }}>{row.name}</TableCell>
                    <TableCell sx={{
                      width: 100,
                      fontWeight: "bold",
                      borderBottom: "1px solid #F7FAFF",
                      padding: "8px 10px",
                      textAlign: 'center',
                      fontSize: "13px"
                    }}>{row.surname}</TableCell>
                    <TableCell sx={{
                      width: 100,
                      borderBottom: "1px solid #F7FAFF",
                      padding: "8px 10px",
                      textAlign: "center",
                      fontSize: "13px"
                    }}>{row.email}</TableCell>
                    <TableCell sx={{
                      width: 100,
                      borderBottom: "1px solid #F7FAFF",
                      padding: "8px 10px",
                      textAlign: "center",
                      fontSize: "13px"
                    }}>{row.phone}</TableCell>
                    <TableCell sx={{
                      width: 100,
                      borderBottom: "1px solid #F7FAFF",
                      padding: "8px 10px",
                      textAlign: "center",
                      fontSize: "13px"
                    }}>
                      {Object.entries(row.pref).map(([key, value]) => (
                        <Typography key={key}>
                          {key}: {value.toString()}
                        </Typography>
                      ))}
                    </TableCell>
                  </TableRow>
                ))}
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={5} />
                </TableRow>
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  colSpan={5}
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

export default RecentAdmins;

import * as React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { useTheme } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableFooter from "@mui/material/TableFooter";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import { Box, Typography } from "@mui/material";
import Card from "@mui/material/Card";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PrintIcon from "@mui/icons-material/Print";
import DeleteIcon from "@mui/icons-material/Delete";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import Checkbox from "@mui/material/Checkbox";
import Link from "next/link";
import { options } from "@fullcalendar/core/preact";

const label = { inputProps: { "aria-label": "Checkbox demo" } };

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


function Notification(props) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
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
        onClick={handleBackButtonClick}
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

Notification.propTypes = {
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

function createData(id, text, readEmail, date) {
  return { id, text, readEmail, date };
}

const rows = [
  createData(
    "1",
    "Hello  –  Trip home from 🎉 Colombo has been arranged, then Jenna will com...",
    "/email/read-email",
    "1 Jan 2022"
  ),
  createData(
    "2",
    "Last pic over my village  –  Yeah i'd like that! Do you remember the video som..",
    "/email/read-email",
    "2 Jan 2022"
  ),
  createData(
    "3",
    "Mochila Beta: Subscription Confirmed  –  You've been confirmed! Welcome to ",
    "/email/read-email",
    "3 Jan 2022"
  ),
  createData(
    "4",
    "You've been confirmed! Welcome to the ruling class of the inbox. For your ",
    "/email/read-email",
    "4 Jan 2022"
  ),
  createData(
    "5",
    "For your records, here is a copy of the information you submitted to us...",
    "/email/read-email",
    "5 Jan 2022"
  ),
  createData(
    "6",
    "Hello  –  Trip home from 🎉 Colombo has been arranged, then Jenna will com...",
    "/email/read-email",
    "6 Jan 2022"
  ),
  createData(
    "7",
    "Hello  –  Trip home from 🎉 Colombo has been arranged, then Jenna will com...",
    "/email/read-email",
    "7 Jan 2022"
  ),
  createData(
    "8",
    "For your records, here is a copy of the information you submitted to us...",
    "/email/read-email",
    "8 Jan 2022"
  ),
  createData(
    "9",
    "Hello  –  Trip home from 🎉 Colombo has been arranged, then Jenna will com...",
    "/email/read-email",
    "9 Jan 2022"
  ),
  createData(
    "10",
    "Off on Thursday  –  Eff that place, you might as well stay here with us inst",
    "/email/read-email",
    "10 Jan 2022"
  ),
  createData(
    "11",
    "Hello  –  Trip home from 🎉 Colombo has been arranged, then Jenna will com...",
    "/email/read-email",
    "11 Jan 2022"
  ),
  createData(
    "12",
    "This Week's Top Stories  –  Our top pick for you on Medium this week The",
    "/email/read-email",
    "12 Jan 2022"
  ),
  createData(
    "13",
    "Weekend on Revibe  –  Today's Friday and we thought maybe you want so",
    "/email/read-email",
    "13 Jan 2022"
  ),
  createData(
    "14",
    "You can now use your storage in Google Drive  –  Hey Nicklas Sandell! Tha",
    "/email/read-email",
    "14 Jan 2022"
  ),
  createData(
    "15",
    "New Ticket Reply - eDemy - Michel Valenzuela",
    "/email/read-email",
    "15 Jan 2022"
  ),
  createData(
    "16",
    "New Ticket Reply - Abev - Manos Pappas",
    "/email/read-email",
    "16 Jan 2022"
  ),
  createData(
    "17",
    "New Ticket Reply - Lofi - Adarsh Raj",
    "/email/read-email",
    "11 Jan 2022"
  ),
];

export default function NotificationTable() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [notifications, setNotifications] = useState([]);
  const [tickNotifs, setTickNotifs] = useState([]);
  const [userID, setUserID] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get(`partner/settings`);
        setUserID(response.data.userID);
      } catch (error) {
        console.error("Error fetching Partner's Profile data:", error);
      }
    };

    fetchUserData();

  }, []);

  useEffect(() => {
    if(userID) {
    const fetchNotifData = async () => {
      try {
        const notifResponse = await api.get(`partner/get-notifs/${userID}`);
        setNotifications(notifResponse.data);
        console.log("Notifications " + notifResponse.data);
      } catch(error) {
        console.error("Error Fetching Notification : " + error);
      }
    }

    fetchNotifData();
  }
  },[userID])

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - notifications.length) : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Dropdown
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const clickedByUser = async(notifId, userID) => {
    const clickConfirm = await api.put(`partner/seen-notif/${userID}/${notifId}`, { seen: true})
    clickConfirm.then(() => {
      console.log("Successfully Updated" + clickConfirm.data);
    }).catch( (error) => {
      console.error("Error in updating Notifications : " + error);
    });

  }

  const sendNotifNums = async(evt) => {
    let chosenOnes = [...tickNotifs];
    if(chosenOnes.includes(evt.target.value)){
      chosenOnes = chosenOnes.filter((value) => value != evt.target.value);
      setTickNotifs(chosenOnes);
    } else {
      chosenOnes.push(evt.target.value);
      setTickNotifs(chosenOnes);
    } 
  }

  const deleteSelectedNotifs = async(userID, deleteTheseNotifs) => {
    const selectedNotifs = deleteTheseNotifs.map((elt) => elt=Number(elt));
    console.log(userID, selectedNotifs)
    const response = await api.put(`partner/delete-notif/${userID}`, {deletedNotifs: selectedNotifs}).then(() => {
      console.log("Successfully Deleted those Notifications.");
    }).catch((err) => {
      console.error("Error in deleting Notifications : " + err);
    });
  }

  const handleDaysSort = async (e, userID) => {
    const timeInterval = e.target.getAttribute("value");
    console.log(timeInterval, userID);
    const sortedNotif = await api.get(`partner/sort-notif/${userID}/${timeInterval}`);
    setNotifications(sortedNotif.data);
  }

  return (
    <>
      <Card
        sx={{
          boxShadow: "none",
          borderRadius: "10px",
          p: "25px 25px 10px",
          mb: "15px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid #EEF0F7",
            paddingBottom: "10px",
            mb: "20px",
          }}
          className="for-dark-bottom-border"
        >
          <Typography
            as="h3"
            sx={{
              fontSize: 24,
              fontWeight: 500,
            }}
          >
            Notification List
          </Typography>

          <Box>
            <Tooltip title="Print">
              <IconButton
                size="small"
                sx={{ background: "#F2F6F8" }}
                className='ml-5px'
              >
                <PrintIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Delete">
              <IconButton
                size="small"
                sx={{ background: "#F2F6F8" }}
                className='ml-5px'
                disabled={notifications.length === 0}
                onClick={() => {deleteSelectedNotifs(userID, tickNotifs), window.location.href = window.location.href;}}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Report Spam">
              <IconButton
                size="small"
                sx={{ background: "#F2F6F8" }}
                className='ml-5px'
              >
                <ErrorOutlineIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            <Tooltip title="More...">
              <IconButton
                onClick={handleClick}
                disabled={notifications.length === 0}
                size="small"
                aria-controls={open ? "account-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                sx={{
                  background: "#F2F6F8",
                }}
                className='ml-5px'
              >
                <MoreVertIcon />
              </IconButton>
            </Tooltip>
          </Box>
          <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={open}
            onClose={handleClose}
            onClick={handleClose}
            PaperProps={{
              elevation: 0,
              sx: {
                overflow: "visible",
                filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                mt: 1.5,
                "& .MuiAvatar-root": {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
                "&:before": {
                  content: '""',
                  display: "block",
                  position: "absolute",
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: "background.paper",
                  transform: "translateY(-50%) rotate(45deg)",
                  zIndex: 0,
                },
              },
            }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            <MenuItem sx={{ fontSize: "14px" }} value={15} onClick={(e) => {  handleDaysSort(e, userID);  }}>Last 15 Days</MenuItem>
            <MenuItem sx={{ fontSize: "14px" }} value={30} onClick={(e) => handleDaysSort(e, userID)}>Last Month</MenuItem>
            <MenuItem sx={{ fontSize: "14px" }} value={365} onClick={(e) => handleDaysSort(e, userID)}>Last Year</MenuItem>
          </Menu>
        </Box>

        <TableContainer
          component={Paper}
          sx={{
            boxShadow: "none",
          }}
        >
          <Table 
            sx={{ minWidth: 500 }} 
            aria-label="custom pagination table"
            className="dark-table"
          >
            <TableBody>
              {(rowsPerPage > 0
                ? notifications.slice(
                    page * rowsPerPage,
                    page * rowsPerPage + rowsPerPage
                  )
                : notifications
              ).map((notification) => (
                <TableRow key={notification.notifNum}>
                  <TableCell
                    style={{
                      borderBottom: "1px solid #F7FAFF",
                      padding: "10px",
                    }}
                  >
                    <Checkbox value={notification.notifNum} {...label} onClick={(e) => sendNotifNums(e)} size="small" />
                  </TableCell>
  
                  <TableCell
                    style={{
                      borderBottom: "1px solid #F7FAFF",
                      fontSize: "13px",
                      padding: "10px",
                    }}
                  >
                      <Link href="/notification" onClick={() => { clickedByUser(notification.notifNum, userID); window.location.href=window.location.href; }}>{notification.notifText}</Link>
                  </TableCell>

                  <TableCell
                    align="right"
                    style={{
                      borderBottom: "1px solid #F7FAFF",
                      fontSize: "13px",
                      padding: "10px",
                    }}
                  >
                    {new Date(notification.notifDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                  </TableCell>
                </TableRow>
              ))}

              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell
                    colSpan={3}
                    style={{ borderBottom: "1px solid #F7FAFF" }}
                  />
                </TableRow>
              )}
            </TableBody>

            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
                  colSpan={5}
                  count={notifications.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  SelectProps={{
                    inputProps: {
                      "aria-label": "rows per page",
                    },
                    native: true,
                  }}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  ActionsComponent={Notification}
                  style={{ borderBottom: "none" }}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      </Card>
    </>
  );
}

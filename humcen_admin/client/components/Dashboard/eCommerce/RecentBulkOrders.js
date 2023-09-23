import React, { useState, useEffect, use } from "react";
import axios from "axios";
import { ArrowBack, Check } from "@mui/icons-material";
import BulkOrderAssignPage from "@/components/BulkOrderAssignPage";
import {Checkbox} from "@mui/material";
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
  Button,
} from "@mui/material";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import PropTypes from "prop-types";
import styled from "@emotion/styled";
import Rating from "@mui/material/Rating";

const api = axios.create({
    baseURL: "http://localhost:3000/api",
  });
  
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = token;
    }
    return config;
  });

function formatDate(date) {
  const options = { month: "long", day: "numeric", year: "numeric" };
  return new Date(date).toLocaleDateString(undefined, options);
}


function getStatusColor(status) {
  if (status === "In Progress") {
    return ( {
      background: "rgba(255, 255, 0, 0.1)", /* Yellow background with reduced opacity */
      borderRadius: "4px",
      fontWeight: "bold",
      color: "#ffbc2b", /* You can define your yellow color variable */
      padding: "5px 13px",
      display: "inline-block",
    });
     // Set the color to yellow for "in progress" status
  } else if (status === "Completed") {
    return ({
      background: "rgba(0, 182, 155, 0.1)",
      borderRadius: "4px",
      color: "#00b69b",
      fontWeight: "bold",
      padding: "5px 13px",
      display: "inline-block",
  })  // Set the color to green for "completed" status
  } else if (status === "Pending") {
    return ({
      background: "rgba(238,54,140,.1)",
      borderRadius: "4px",
      color: "#ee368c",
      padding: "5px 13px",
      display: "inline-block",
  })

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
    const response = await api.get("get-bulk-orders");
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching partner data:", error);
    return [];
  }
}

function RecentBulkOrders() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [count, setCount] = useState(0);
  const [country, setCountry] = useState([]);
  const [openModal, setAssignModal] = useState(false);
  const [assignDetails, setDetails] = useState([]);
  const [codedID, setCoded] = useState([]);
  const [selected, setSelected] = useState([]);
  const [rows, setRows] = useState([]);
  const [allServices, setThoseServices] = useState([]);
  const [showSelectAll, setSelectAll] = useState(false);
  const [completeDetails, setCompleteDetails] = useState({});


  const handleSelection = (value, codedValue, service, countries) => {
    if(selected.length > 0) {
      if(selected.includes(value)) {
        const updatedList = selected.filter( elem => elem != value );
        const updatedCoded = codedID.filter( elem => elem != codedValue );

        const indexOfElementToRemove = allServices.indexOf(service);

// Check if the element exists in the array before removing it
if (indexOfElementToRemove !== -1) {
  // Remove one instance of the selected element using the spread operator and filter
  const updatedElements = [
    ...allServices.slice(0, indexOfElementToRemove),
    ...allServices.slice(indexOfElementToRemove + 1)
  
  ];
  setThoseServices(updatedElements);
}
        

        setSelected(updatedList);
        setCoded(updatedCoded);

      } else {
        setSelected([...selected, value]);
        setCoded([...codedID, codedValue]);
        setThoseServices([...allServices, service])

      }
    } else {
      setSelected([value]);
      setThoseServices([service]);
      setCoded([codedValue]);
      setCountry([countries]);
    }
  }

  const handleEdit = () => {
    setAssignModal(false);
  }

  const getReqDetails = async(selected) => {
    const response = await api.get(`bulk-assign-details/${selected}`);
    if(response.data) {
      const serviceAndPartner = [];
      const uniqueEmails = response.data.emails.filter((value, index, array) => array.indexOf(value) === index);
      const uniqueServices = response.data.bulkServices.filter((value, index, array) => array.indexOf(value) === index);
      const uniqueCountries = response.data.bulkCountries.filter((value, index, array) => array.indexOf(value) === index);
      console.log(uniqueEmails, uniqueServices, uniqueCountries);

      const detailsObject = {
        emails: uniqueEmails,
        countries: uniqueCountries,
        services: uniqueServices
      }
      setCompleteDetails(detailsObject);
      console.log(detailsObject);

    }
  }

  const handleAssignClick = async( newJobIds ,jobs, allServices, country) => {
    console.log(jobs, newJobIds);
    setAssignModal(true);
    console.log(completeDetails);
    const fromJob = jobs.indexOf(Math.min(...jobs));
    const toJob = jobs.indexOf(Math.max(...jobs));
    if(completeDetails) {
      setDetails([{
        title: "Jobs",
        text: newJobIds[fromJob]+" to "+newJobIds[toJob],
      }, {
        title: "Total Jobs",
        text: newJobIds.length,
      }, {
        title: "Service",
        text:  allServices ,
      },{
        title: "Country",
        text:  country ,
      }, {
        title: "User Emails",
        text: completeDetails.emails.join(", "),
      },
    ])  
    setSelected(jobs);
    }

  }

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchPartnerData();
      console.log(data.copyJobs);
      setCount(data.copyJobs.length);
      setRows(data.copyJobs);
    };


    const execDetails = async() => {
      if(selected.length > 0) {
        await getReqDetails(selected);
       }
  
    }

    fetchData();
    execDetails();


    

  }, [selected]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleSelectAll = () => {
    console.log(page);
    
    let availableIDs = sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((elem) => elem.og_id);
    let availableCodedIDs = sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((elem) => elem._id.job_no);
    let availableServices = sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((elem) => elem.bulk_order_service);
    let availableCountries = sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((elem) => elem.country);

    let newSelections = selected.concat(availableIDs);
    let newCodedSelections = codedID.concat(availableCodedIDs);
    let newCodedServices = allServices.concat(availableServices);
    let newCodedCountries = country.concat(availableCountries);

    setSelected(newSelections.filter((value, index, array) => array.indexOf(value) === index));
    setCoded(newCodedSelections.filter((value, index, array) => array.indexOf(value) === index))
    setThoseServices(newCodedServices)
    setCountry(newCodedCountries.filter((value, index, array) => array.indexOf(value) === index))

    console.log(newSelections, newCodedSelections, newCodedServices, newCodedCountries);

    if(selected.some(job=> availableIDs.includes(job))) {
      setSelected(selected.filter((elem) => !availableIDs.includes(elem)));
      setCoded(codedID.filter((elem) => !availableCodedIDs.includes(elem)));
      setThoseServices(allServices.filter((elem) => !availableServices.includes(elem)));
      console.log(selected, codedID, allServices, country);
    }


  }

  console.log(allServices);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, count - page * rowsPerPage);

  const sortedData = rows.sort((a, b) => parseInt(b.og_id) - parseInt(a.og_id));

  return (
    <>
    { !openModal && sortedData.length > 0 && <Card>
      <Box sx={{ p: 2 }}>
        <TableContainer component={Paper} sx={{
            boxShadow: "none",
          }}>
          <Table aria-label="custom pagination table" className="dark-table">
            <TableHead sx={{ background: "#F7FAFF" }}>
              <TableRow>
              <TableCell sx={{
                    borderBottom: "1px solid #F7FAFF",
                    fontSize: "13.5px",
                    fontWeight: 'bold',
                    padding: "15px 10px",
                    width: "120px",
                    textAlign: "center",
                  }}
                  onMouseEnter={() => setSelectAll(true)}
                  onMouseLeave={() => setSelectAll(false)}
                  >
               { showSelectAll ? (
                <IconButton aria-label="select_all"  onClick={() => handleSelectAll()}>
                  <Check />
                </IconButton>) : (<>Select Jobs</> )}   
                

                </TableCell>
                <TableCell sx={{
                    borderBottom: "1px solid #F7FAFF",
                    fontSize: "13.5px",
                    fontWeight: 'bold',
                    padding: "15px 10px",
                    width: "100px",
                    textAlign: "center",
                  }}>
                Job No
                </TableCell>
                <TableCell sx={{
                    borderBottom: "1px solid #F7FAFF",
                    fontSize: "13.5px",
                    fontWeight: 'bold',
                    padding: "15px 10px",
                    width: "250px",
                    textAlign: "center",
                  }}>
                Service
                </TableCell>
                <TableCell sx={{
                    borderBottom: "1px solid #F7FAFF",
                    fontSize: "13.5px",
                    fontWeight: 'bold',
                    padding: "15px 10px",
                    width: "100px",
                    textAlign: "center",
                  }}>
                Job Title
                </TableCell>
                <TableCell sx={{
                    borderBottom: "1px solid #F7FAFF",
                    fontSize: "13.5px",
                    fontWeight: 'bold',
                    padding: "15px 10px",
                    width: "100px",
                    textAlign: "center",
                  }}>
                Country
                </TableCell>
                <TableCell sx={{
                    borderBottom: "1px solid #F7FAFF",
                    fontSize: "13.5px",
                    fontWeight: 'bold',
                    padding: "15px 10px",
                    width: "100px",
                    textAlign: "center",
                  }}>
                Customer ID
                </TableCell>
                {/* <TableCell sx={{
                    borderBottom: "1px solid #F7FAFF",
                    fontSize: "13.5px",
                    fontWeight: 'bold',
                    padding: "15px 10px",
                    width: "180px",
                    textAlign: "center",
                  }}>
                Assign Jobs
                </TableCell> */}
                
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => (
                  <TableRow key={row.og_id}>
                  <TableCell sx={{
                      width: 100,
                      fontWeight: "bold",
                      borderBottom: "1px solid #F7FAFF",
                      padding: "8px 10px",
                      textAlign: "center",
                    }}>                                                       
                      <Checkbox value={row.og_id} 
                      onChange={() => handleSelection(row.og_id, row._id.job_no, row.bulk_order_service, row.country)}
                      checked={selected.includes(row.og_id)}
                      sx={{
                        color: "#5B5B98",
                        "&.Mui-checked": {
                          color: "#7DE5ED"
                        },
                      }}/>
                    </TableCell>
                    <TableCell sx={{
                      width: 170,
                      fontWeight: "bold",
                      borderBottom: "1px solid #F7FAFF",
                      padding: "8px 10px",
                      fontSize: "15px",
                      textAlign: "center",
                    }}>
                    {row._id.job_no}
                    </TableCell>
                    <TableCell sx={{
                      width: 350,
                      fontWeight: "bold",
                      borderBottom: "1px solid #F7FAFF",
                      padding: "8px 10px",
                      fontSize: "15px",
                      textAlign: "center",
                    }}>{row.bulk_order_service}</TableCell>
                    <TableCell sx={{
                      width: 350,
                      fontWeight: "bold",
                      borderBottom: "1px solid #F7FAFF",
                      padding: "8px 10px",
                      fontSize: "15px",
                      textAlign: "center",
                    }}>{row.bulk_order_title}</TableCell>
                    <TableCell sx={{
                      width: 250,
                      fontWeight: "bold",
                      borderBottom: "1px solid #F7FAFF",
                      padding: "8px 10px",
                      fontSize: "15px",
                      textAlign: "center",
                    }}>{row.country}</TableCell>
                    <TableCell sx={{
                      width: 150,
                      fontWeight: "bold",
                      borderBottom: "1px solid #F7FAFF",
                      padding: "8px 10px",
                      fontSize: "15px",
                      textAlign: "center",
                    }}>{row.user_ID}</TableCell>
    
                  
                   {/* <TableCell>
                   <Link href={`onGoingBulkOrders/${row.og_id}`} passHref>
                    <Button
                      sx={{
                        background: "#27AE60",
                        position: "relative",
                        left: "30%", 
                        color: "white",
                        borderRadius: "100px",
                        width: "40%",
                        height: "88%",
                        textAlign: "center",
                        textTransform: "none",
                        "&:hover": {
                          background: "linear-gradient(90deg, #5F9EA0 0%, #7FFFD4 100%)",
                        },
                      }}
                    >
                      Assign
                    </Button>
                    </Link>
                    </TableCell> */}
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
        {console.log(allServices.filter((value, index, array) => array.indexOf(value) === index).length, selected.length)}
        { selected.length > 0 && allServices.filter((value, index, array) => array.indexOf(value) === index).length === 1 && <div style={{textAlign: "center", marginTop: "2rem", marginBottom: "2rem"}}>
              <Button onClick={() => {handleAssignClick(codedID , selected, allServices.filter((value, index, array) => array.indexOf(value) === index), country.filter((value, index, array) => array.indexOf(value) === index));}} variant="contained"  style={{ marginTop: '0.25rem', borderRadius: "100px" , boxShadow: "none",background: "linear-gradient(90deg, rgba(0, 172, 246, 0.8) 0%, rgba(2, 225, 185, 0.79) 91.25%)"}}>
                Assign
              </Button>
            </div> }
        {console.log(selected, allServices.filter((value, index, array) => array.indexOf(value) === index).length === 1, allServices)}
      </Box>
    </Card> }
   { openModal && completeDetails && <>
    <Card
        sx={{
          boxShadow: "none",
          borderRadius: "10px",
          p: "25px",
          mb: "15px",
        }}
      >

   <div>
    <div style={{
    textAlign: "left",
    width: "40px",
   }}>
    <IconButton aria-label="go_back" onClick={() => { handleEdit()}}>
       <ArrowBack />
      </IconButton>
    </div>
    <div style={{
      textAlign: "center",
    }}>
    <Typography sx={{
                    borderBottom: "1px solid #F7FAFF",
                    fontSize: "25px",
                    textAlign: "center",
                    fontWeight: "bold",
                    paddingBottom: "2rem",
         }}>Assign Bulk Orders</Typography>
    </div>
   </div>
   {console.log(selected)}
   <BulkOrderAssignPage detailsList={assignDetails} jobLists={selected} services={allServices} countries={country}/> 
   </Card>
   </>}
   {sortedData.length === 0 && <div style={{
        textAlign: "center",
        background: "white",
        pt: "2rem",
        pb: "2rem",
      }}>
        <Typography
            as="h1"
            sx={{
              fontSize: 18,
              fontWeight: 500,
              pb: "2rem",
              pt: "2rem"
            }}
          >
            No Bulk Orders generated recently.
          </Typography>
      </div>}
    </>
  );
}

export default RecentBulkOrders;

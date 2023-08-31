import React, { useState } from 'react';
import OkDialogueBox from './dialoguebox';
import Head from 'next/head';
import axios from 'axios';
import CustomDropZone from "@/components/CustomDropBox";
import DefaultSelect from "@/components/Forms/AdvancedElements/DefaultField";
import ShoppingCart from '@/components/shoppingCart';
import { Checkbox } from '@mui/material';
import BannerCard from "@/components/BannerCard";
import style from "@/styles/PageTitle.module.css";
import Link from "next/link";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import { FormControlLabel } from "@mui/material";

import {
  InputLabel,
  Container,
  Typography,
  Paper,
  TextField,
  Select,
  MenuItem,
  Divider,
  Button,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

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


export default function Inbox() {
    const [draftingOpen, setDraftingOpen] = useState(true);
    const [countriesOpen, setCountriesOpen] = useState(false);
    const [contactOpen, setContactOpen] = useState(false);
    const [success, setSuccess] = useState("");
    const [domain, setDomain] = useState("");
    const [country, setCountry] = useState([]);
    const [applicationType, setApplicatonType] = useState("");
    const [title, setTitle] = useState("");
    const [detailsFile, setDetailsFile] = useState(null);
    const [applicantsFile, setApplicantsFile] = useState(null);
    const [investorsFile, setInvestorsFile] = useState(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false);
    const [isErrorDialogOpenStatus, setIsErrorDialogOpenStatus] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [summary, setSummary] = useState([]);
  const [totalBill, setBill] = useState([]); // Bill amount state
  const [shoppingList, setList] = useState([]);
  const [keywords, setKeyword] = useState([]);

  
    const handleDomainChange = (value) => {
      setDomain(value);
    };
  
    const handleApplicationTypeChange = (value) => {
      setApplicatonType(event.target.value);
    };
  
    const handleTitleChange = (event) => {
      setTitle(event.target.value); // Update the title state on input change
    };
  
    const handleDetailsFileChange = (newFiles) => {
      setDetailsFile(newFiles);
    };
  
    const handleApplicantsFileChange = (files) => {
      setApplicantsFile(files);
    };
  
    const handleInvestorsFileChange = (files) => {
      setInvestorsFile(files);
    };
  
    const isFormValid = () => {
      if (
        domain.trim() === "" ||
        applicationType.trim() === "" ||
        title.trim() === "" ||
        detailsFile === null ||
        applicantsFile === null ||
        investorsFile === null
      ) {
        return false;
      }
      return true;
    };
  
    const handleSubmit = async (e) => {
    
      if (!isFormValid()) {
        setIsErrorDialogOpen(true);
        return;
      }
      const formData = {
        domain: domain, // Use the actual domain value from the state
        countries: country,
        title: title,
        bills: totalBill,
        service_specific_files: {
          application_type: applicationType,
          details: detailsFile,
          applicants: applicantsFile,
          investors: investorsFile,
        },
      };
      try {
        const response = await api.post("/patent_filing", formData);
        const data = response.data;
        console.log("Form submitted successfully");
        console.log(data);
        setIsSubmitted(true);
      }catch (error) {
        setErrorMessage(error.response.data);
        setIsErrorDialogOpenStatus(true);
      }
    };

  const handleDraftingContinue = () => {
    console.log(isFormValid())
    if(isFormValid()) {
      setDraftingOpen(false);
      setCountriesOpen(true);  
      setSummary([
        {
          title: "Title",
          text: title,
        },
        {
          title: "Domain",
          text: domain,
        },
        {
          title: "Application Type",
          text: applicationType,
        },
        {
          title: "Uploaded Files",
          text: [detailsFile.map((file) => file.name)].toString() + ","+[applicantsFile.map((file) => file.name)] + "," + [investorsFile.map((file) => file.name)]
        }
      ]);
    } else {
      setSuccess(false);
    }
  };



  const handleCountriesContinue = () => {
    if(country.length != 0 ) {
      setCountriesOpen(false);
      setContactOpen(true);
  
      setSummary([
        {
          title: "Title",
          text: title,
        },
        {
          title: "Domain",
          text: domain,
        },
        {
          title: "Application Type",
          text: applicationType,
        },
        {
          title: "Uploaded Files",
          text: [detailsFile.map((file) => file.name)].toString() + ","+[applicantsFile.map((file) => file.name)] + "," + [investorsFile.map((file) => file.name)]
        }
      ]);
  
      const newList = []
      console.log(country);
      for (let choices = 0; choices < country.length; choices++) {
        newList.push({
          country: country[choices],
          cost: totalBill[choices]
        });
        
      }
      setList(newList)
    }
      else {
        setContactOpen(false);
        setSuccess(false);
      }
    
  };


  return (
    <>
      <div style={{ margin: '0 1rem' }}>
        <Paper elevation={3} style={{ borderRadius: '16px', padding: '1rem', margin: '1rem 0' }}>
          {/* Banner */}


    {/* Page title */}
    <div className={style.pageTitle}>
  <ul>
    <li>
      <Link href="/">Dashboard</Link>
    </li>
    <li>
      <Link href="/patent-services">My Patent Services</Link>
    </li>
    <li>Patent Filing</li>
  </ul>
</div>

    <Container maxWidth="md" style={{ marginTop: '2rem' }}>
      <Head>
        <title>Patent Filing</title>
      </Head>
      <BannerCard
  title="Patent filing"
  imageSrc="/images/banner_img/bg.png"
  color="white"
  style={{ width: '100%', maxWidth: '1200px', margin: '550%' }}></BannerCard>

      <Typography variant="h5" onClick={() => {setDraftingOpen(!draftingOpen); if(contactOpen) {setContactOpen(false)}}} style={{ cursor: 'pointer', fontWeight: "bold" }}>
        Filing
        <ExpandMoreIcon style={{ transform: draftingOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} />
      </Typography>

      {draftingOpen && (
        <div style={{ padding: '1rem 0' }}>
          <TextField
            label="Enter your proposed invention title"
            variant="outlined"
            fullWidth
            value={title}
            onChange={handleTitleChange}
            style={{ marginBottom: '2rem', marginTop: "0.5rem" }}
          />
          <DefaultSelect domain={domain} onDomainChange={handleDomainChange}/>
                      <Typography
              as="h3"
              sx={{
                fontSize: 18,
                fontWeight: 500,
                mt: "2rem",
                mb: "1rem",
              }}
            >
              Select your application type
            </Typography>
              <RadioGroup
              row
              aria-labelledby="demo-radio-buttons-group-label"
              value={applicationType}
              name="radio-buttons-group"
              onChange={handleApplicationTypeChange}
            >
              <FormControlLabel
                value="Provisional"
                control={<Radio />}
                label="Provisional Application"
              />
              <FormControlLabel
                value="Complete"
                control={<Radio />}
                label="Complete Application"
              />
            </RadioGroup>
            <Typography
                as="h3"
                sx={{
                  fontSize: 18,
                  fontWeight: 500,
                  mt: "2rem",
                  mb: "1rem",
                }}
              >
                Upload your invention details
              </Typography>
              {/* <DottedCard> */}
              <CustomDropZone files={detailsFile} onFileChange={handleDetailsFileChange}/>
              <Typography
                as="h3"
                sx={{
                  fontSize: 18,
                  fontWeight: 500,
                  mt: "2rem",
                  mb: "1rem",
                }}
              >
                Upload your list of applicants
              </Typography>
              {/* <DottedCard> */}
              <CustomDropZone files={applicantsFile} onFileChange={handleApplicantsFileChange}/>
              <Typography
                as="h3"
                sx={{
                  fontSize: 18,
                  fontWeight: 500,
                  mt: "2rem",
                  mb: "1rem",
                }}
              >
                Upload your list of investors (if applicable)
              </Typography>
              {/* <DottedCard> */}
              <CustomDropZone files={investorsFile} onFileChange={handleInvestorsFileChange}/>
           { draftingOpen && <div style={{
              textAlign: "center",
            }}>
            <Button variant="contained" color="primary" onClick={handleDraftingContinue} style={{ marginTop: '1rem',  borderRadius: "100px", boxShadow: "none" ,background: "linear-gradient(90deg, rgba(0, 172, 246, 0.8) 0%, rgba(2, 225, 185, 0.79) 91.25%)" }}>
            Continue
            </Button>
            </div> }
        </div>
      )}
      <Divider style={{ margin: '2rem 0' }} />
      <Typography variant="h5" style={{ fontWeight: "bold"}} 
      onClick={() => { if (!draftingOpen) { setCountriesOpen(!countriesOpen) } if(contactOpen) {setContactOpen(false)}}}>
      Countries
      <ExpandMoreIcon style={{ transform: countriesOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} />
       </Typography>
      
      {countriesOpen && (
        <div style={{ padding: '1rem 0' }}>
          {/* Country Selection Buttons */}
          <Typography
            as="h3"
            sx={{
              fontSize: 18,
              fontWeight: 500,
              mb: "10px",
            }}
          >
            Select the Country
          </Typography>
          <Button
            style={{
              background: country.includes("India") ? "linear-gradient(90deg, rgba(0, 172, 246, 0.8) 0%, rgba(2, 225, 185, 0.79) 91.25%)" : "#F8FCFF",
              color: country.includes("India") ? "white" : "#BFBFBF",
              width: "15%",
              marginRight: "2%",
              boxShadow: "none",
              borderRadius: "100px",
              height: "60px",
              textTransform: "none",
            }}
            onClick={() => {
              if(!country.includes("India")) {
                setCountry(country => [...country, "India"]);
                setBill([...totalBill, 625]);
              } else {
                setCountry(country.filter(nation => nation != "India"));
                setBill(totalBill.filter(bill => bill != 625));
              }
              console.log(country);
              console.log(totalBill);
            }}
          >
            <img
              src="https://hatscripts.github.io/circle-flags/flags/in.svg"
              width="24"
            />
            &nbsp;&nbsp;India <br />&nbsp;&nbsp;&#40;&#36;625&#41;
          </Button>
          <Button
            style={{
              background: country.includes("United States") ? "linear-gradient(90deg, rgba(0, 172, 246, 0.8) 0%, rgba(2, 225, 185, 0.79) 91.25%)" : "#F8FCFF",
              color: country.includes("United States") ? "white" : "#BFBFBF",
              width: "18%",
              marginRight: "2%",
              boxShadow: "none",
              borderRadius: "100px",
              height: "60px",
              textTransform: "none",
            }}
            onClick={() => {
              if(!country.includes("United States")) {
                setCountry(country => [...country, "United States"]);
                setBill([...totalBill, 900]);
              } else {
                setCountry(country.filter(nation => nation != "United States"));
                setBill(totalBill.filter(bill => bill != 900))
              }
              console.log(country);
              console.log(totalBill);
            }}
            value="United States"
          >
            <img
              src="https://hatscripts.github.io/circle-flags/flags/us.svg"
              width="24"
            />
            &nbsp;&nbsp;United States <br />&nbsp;&nbsp;&#40;&#36;900&#41;
          </Button>
          {/* Add other country buttons similarly */}
        </div>
      )}
      {countriesOpen &&        <div style={{
        textAlign: "center"
      }}>
        <Button variant="contained" color="primary" onClick={handleCountriesContinue} style={{ marginTop: '1rem',  borderRadius: "100px", boxShadow: "none" ,background: "linear-gradient(90deg, rgba(0, 172, 246, 0.8) 0%, rgba(2, 225, 185, 0.79) 91.25%)"  }}>
            Continue
          </Button>
        </div>}

      <Divider style={{ margin: '2rem 0' }} />
      <Typography variant="h5" style={{fontWeight: "bold"}}>Summary</Typography>
      { contactOpen && <div style={{ padding: '0.5rem 0' }}>
          {/* Your content for the 'Contact' section */}
          <ShoppingCart priceList={shoppingList} detailsList={summary} total={totalBill.reduce((a,b)=> a+b,0)} service="Patent Filing"/>

        </div>
        }
        {contactOpen && isFormValid () && <div style={{
          textAlign: "center"
        }}>
          <Button variant="contained" onClick={() => handleSubmit()} style={{ marginTop: '0.25rem',  borderRadius: "100px", boxShadow: "none" ,background: "linear-gradient(90deg, rgba(0, 172, 246, 0.8) 0%, rgba(2, 225, 185, 0.79) 91.25%)"  }}>
            Submit
        </Button>
        </div>}


    </Container>
    </Paper>
    </div>
    <OkDialogueBox success={success} serviceValue={"Patent Drafting"} />
    </>
  );
};


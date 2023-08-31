import React, { useState } from 'react';
import Head from 'next/head';
import axios from 'axios';
import OkDialogueBox from './dialoguebox';
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
    const [domain, setDomain] = useState("");
    const [country, setCountry] = useState([]);
    const [success, setSuccess] = useState("");
    const [applicationType, setApplicatonType] = useState("");
    const [title, setTitle] = useState("");
    const [detailsFile, setDetailsFile] = useState(null);
    const [applicantsFile, setApplicantsFile] = useState(null);
    const [investorsFile, setInvestorsFile] = useState(null);
    const [time, setTime] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false);
    const [isErrorDialogOpenStatus, setIsErrorDialogOpenStatus] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [summary, setSummary] = useState([]);
  const [totalBill, setBill] = useState([]); // Bill amount state
  const [shoppingList, setList] = useState([]);
  const [keywords, setKeyword] = useState([]);
  const [description, setDescription] = useState("");
  const [techDrawings, setTechDrawings] = useState(null);

  const handleTechDrawings = (files) => {
    setTechDrawings(files);
  };

  const handleDomainChange = (value) => {
    setDomain(value);
  };
  const handleKeywordChange = (event) => {
    setKeyword(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value); // Update the title state on input change
  };


  
  const isFormValid = () => {
    if (!domain || !description || !keywords || !techDrawings){
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
      field: domain,
      invention_description: description,
      keywords: keywords,
      countries: country,
      bills: totalBill,
      technical_diagram: techDrawings,
    };

    try {
      const response = await api.post("/patent_search", formData);
      const data = response.data;
      console.log("Search Form submitted successfully");
      console.log(data);
      setIsSubmitted(true);
    } catch (error) {
      setErrorMessage(error.response.data);
      setIsErrorDialogOpenStatus(true);
    }
  };

  const handleDraftingContinue = () => {
    if(isFormValid()) {
      setDraftingOpen(false);
      setCountriesOpen(true);

      setSummary([
        {
          title: "Domain",
          text: domain,
        },
        {
          title: "Invention Description",
          text: description,
        },
        {
          title: "Keywords",
          text: keywords.toString()
        },
        {
          title: "Uploaded Files",
          text: [techDrawings.map((file) => file.name)].toString()
        }
      ]);
    } else {
      setSuccess(false);
    }
  };




  const handleCountriesContinue = () => {
    if(country.length != 0) {
      setCountriesOpen(false);
    setContactOpen(true);

    setSummary([
      {
        title: "Domain",
        text: domain,
      },
      {
        title: "Invention Description",
        text: description,
      },
      {
        title: "Keywords",
        text: keywords.toString()
      },
      {
        title: "Uploaded Files",
        text: [techDrawings.map((file) => file.name)].toString()
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

    } else {
      console.log("Yes");
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
    <li>Patent Search</li>
  </ul>
</div>

    <Container maxWidth="md" style={{ marginTop: '2rem' }}>
      <Head>
        <title>Patent Search</title>
      </Head>
      <BannerCard
  title="Patent Search"
  imageSrc="/images/banner_img/bg.png"
  color="white"
  style={{ width: '100%', maxWidth: '1200px', margin: '550%' }}></BannerCard>

      <Typography variant="h5" onClick={() => {setDraftingOpen(!draftingOpen); if(contactOpen) {setContactOpen(false)}}} style={{ cursor: 'pointer', fontWeight: "bold" }}>
        Search
        <ExpandMoreIcon style={{ transform: draftingOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} />
      </Typography>

      {draftingOpen && (
        <div style={{ padding: '1rem 0' }}>
          <DefaultSelect domain={domain} onDomainChange={handleDomainChange}/>
          <Typography
              as="h3"
              sx={{
                fontSize: 18,
                fontWeight: 500,
                mt: "2rem",
                mb: "10px",
              }}
            >
              Invention Description
            </Typography>
          <TextField
            label={ !description && "A clear and detailed description of the invention. Minimum 200-300 words."}
            variant="outlined"
            fullWidth
            value={description}
            onChange={handleDescriptionChange} // Provide the onChange event handler
            style={{ marginBottom: '1rem' }}
          />    
              <Typography
              as="h3"
              sx={{
                fontSize: 18,
                fontWeight: 500,
                mb: "1rem",
                mt: "2rem"
              }}
            >
              Keywords or Search Parameters: 
            </Typography>
            <TextField
              fullWidth
              id="name"
              name="name"
              value={keywords}
              label={ keywords.length == 0 && "Specific keywords, phrases, or concepts related to your invention."}
              autoComplete="name"
              InputProps={{
                style: { borderRadius: 8 },
              }}
              onChange={handleKeywordChange} // Provide the onChange event handler
            />
          <Typography
              as="h3"
              sx={{
                fontSize: 18,
                fontWeight: 500,
                mb: "10px",
                mt: "2rem"
              }}
            >
              Technical Drawings or Diagrams:
            </Typography>
            <Typography
              as="h5"
              sx={{
                fontSize: 12,
                fontWeight: 350,
                mb: "2rem",
              }}
            >
             ( Visual representations or technical drawings that illustrate the invention's design, structure, or process. )
            </Typography>
            <CustomDropZone files={techDrawings} onFileChange={handleTechDrawings}/>
          
        </div>
      )}
      {draftingOpen && <div style={{
        textAlign: "center"
      }}>
          <Button variant="contained" color="primary" onClick={handleDraftingContinue} style={{ marginTop: '1rem', borderRadius: "100px", boxShadow: "none" ,background: "linear-gradient(90deg, rgba(0, 172, 246, 0.8) 0%, rgba(2, 225, 185, 0.79) 91.25%)" }}>
            Continue
          </Button>
      </div>}
      <Divider style={{ margin: '2rem 0' }} />
      <Typography variant="h5" style={{ fontWeight: "bold"}} 
      onClick={() => { if (!draftingOpen) { setCountriesOpen(!countriesOpen) } if(contactOpen) {setContactOpen(false)}}}>
      Target Country
      <ExpandMoreIcon style={{ transform: countriesOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} /></Typography>
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
      {countriesOpen && <div style={{
        textAlign: "center"
      }}>
        <Button variant="contained" color="primary" onClick={handleCountriesContinue} style={{ marginTop: '1rem',  borderRadius: "100px", boxShadow: "none" ,background: "linear-gradient(90deg, rgba(0, 172, 246, 0.8) 0%, rgba(2, 225, 185, 0.79) 91.25%)" }}>
            Continue
          </Button>
      </div>}

      <Divider style={{ margin: '2rem 0' }} />
      <Typography variant="h5" style={{
        fontWeight: "bold"
      }}>Summary</Typography>
      { contactOpen && <div style={{ padding: '0.5rem 0' }}>
          {/* Your content for the 'Contact' section */}
          <ShoppingCart priceList={shoppingList} detailsList={summary} total={totalBill.reduce((a,b)=> a+b,0)} service="Patent Search"/>
          
        </div>
        }
        { contactOpen && isFormValid () && <div style={{textAlign: "center" }}>
        <Button variant="contained" onClick={() => handleSubmit()} style={{ marginTop: '0.5rem',  borderRadius: "100px", boxShadow: "none" ,background: "linear-gradient(90deg, rgba(0, 172, 246, 0.8) 0%, rgba(2, 225, 185, 0.79) 91.25%)" }}>
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


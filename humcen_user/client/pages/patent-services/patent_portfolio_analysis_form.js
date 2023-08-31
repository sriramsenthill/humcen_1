import React, { useState, useRef } from "react";
import BannerCard from "@/components/BannerCard";
import Link from "next/link";
import OkDialogueBox from "./dialoguebox";
import style from "@/styles/PageTitle.module.css";
import { Button, ButtonProps, Card } from "@mui/material";
import ShoppingCart from "@/components/shoppingCart";
import { styled } from "@mui/system";
import DefaultSelect from "@/components/Forms/AdvancedElements/DefaultField";
import { Typography } from "@mui/material";
import TextField from "@mui/material/TextField";
import { CheckBox, Margin } from "@mui/icons-material";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import FileBase64 from "react-file-base64";
import axios from "axios";
import { useRouter } from "next/router";
import CustomDropZone from "@/components/CustomDropBox";
import Head from "next/head";
import {
  Container,
  Paper,

  Divider,
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
    const [success, setSuccess] = useState("");
    const [country, setCountry] = useState([]);
    const [title, setTitle] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false);
    const [isErrorDialogOpenStatus, setIsErrorDialogOpenStatus] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [summary, setSummary] = useState([]);
  const [totalBill, setBill] = useState([]); // Bill amount state
  const [shoppingList, setList] = useState([]);
  const [keywords, setKeywords] = useState([]);
  const [description, setDescription] = useState(null);
  const [patentDetails, setPatentDetails] = useState(null);
  const [files, setFiles] = useState(null);
  const [businessObj,setBusinessObj]=useState('');
  const [marketAndIndustry,setMarketAndIndustry]=useState('');

  const router = useRouter();


  const getFiles = (files) => {
    setFiles(files);
  };

  const businessObjectives=(event)=>{
    setBusinessObj(event.target.value);
  }

  const marketAndIndustryInfo=(event)=>{
    setMarketAndIndustry(event.target.value);
  }

  const handleDomainChange = (value) => {
    setDomain(value);
  };
  const isFormValid = () => {
    // Check if all the required fields are filled
    return domain && businessObj && marketAndIndustry && files;
  };


  const handleSubmit = async (e) => {

    if (!isFormValid()) {
      setIsErrorDialogOpen(true);
      return;
    }


    const formData = {
      field: domain,
      countries:country,
      bills: totalBill,
      business_objectives:businessObj,
      market_and_industry_information:marketAndIndustry,
      service_specific_files: {
        invention_details: files,
      },
    };

    try {
      const response = await api.post("/freedom_to_patent_portfolio_analysis", formData);
      const data = response.data;
      console.log("Form submitted successfully");
      console.log(data);
      setIsSubmitted(true);
    } catch (error) {
      setErrorMessage(error.response.data);
      setIsErrorDialogOpenStatus(true);
    }
  };

  const handleOk = () => {
    setIsSubmitted(false);
    router.push("/");
  };


  const handleDraftingContinue = () => {
    if(isFormValid()) {
      setDraftingOpen(false);
      setCountriesOpen(true);

      setSummary([
        {
          title: "Business Objectives",
          text: businessObj,
        },
        {
          title: "Domain",
          text: domain,
        },
        {
          title: "Market and Industry Information",
          text: marketAndIndustry
        },
        {
          title: "Uploaded Files",
          text: [files.map((file) => file.name)].toString()
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
          title: "Business Objectives",
          text: businessObj,
        },
        {
          title: "Domain",
          text: domain,
        },
        {
          title: "Market and Industry Information",
          text: marketAndIndustry
        },
        {
          title: "Uploaded Files",
          text: [files.map((file) => file.name)].toString()
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
    <li>Patent Portfolio Analysis</li>
  </ul>
</div>

    <Container maxWidth="md" style={{ marginTop: '2rem' }}>
      <Head>
        <title>Patent Portfolio Analysis</title>
      </Head>
      <BannerCard
  title="Patent Portfolio Analysis"
  imageSrc="/images/banner_img/bg.png"
  color="white"
  style={{ width: '100%', maxWidth: '1200px', margin: '550%' }}></BannerCard>

      <Typography variant="h5" onClick={() => {setDraftingOpen(!draftingOpen); if(contactOpen) {setContactOpen(false)}}} style={{ cursor: 'pointer', fontWeight: "bold" }}>
      Patent Portfolio Analysis
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
                mb: "1rem",
              }}
            >
              Business Objectives :
            </Typography>
            <TextField
              fullWidth
              id="name"
              name="name"
              label={ !businessObj && "Share your specific business goals and objectives related to your patent portfolio."}
              autoComplete="name"
              value={businessObj}
              InputProps={{
                style: { borderRadius: 8 },
              }}
              onChange={businessObjectives} // Provide the onChange event handler
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
              Market and Industry Information :
            </Typography>
            <TextField
              fullWidth
              id="name"
              name="name"
              label={ !marketAndIndustry && "Provide insights into your target market and industry."}
              value={marketAndIndustry}
              autoComplete="name"
              InputProps={{
                style: { borderRadius: 8 },
              }}
              onChange={marketAndIndustryInfo} // Provide the onChange event handler
            />
            <Typography
              as="h3"
              sx={{
                fontSize: 18,
                fontWeight: 500,
                mt: "2rem",
                mb: "10px"
              }}
            >
              Patent Portfolio Information :
            </Typography>
            <Typography
              as="h5"
              sx={{
                fontSize: 12,
                fontWeight: 350,
                mb: "2rem",
              }}
            >
             ( Provide a list of your existing patents, including patent numbers, filing dates, titles, and any other relevant details. )
            </Typography>
            <CustomDropZone files={files} onFileChange={getFiles}/>
            

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
      onClick={() => { if (!draftingOpen) { setCountriesOpen(!countriesOpen) }}}>
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
              boxShadow: "none",
              borderRadius: "100px",
              marginRight: "2%",
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
              boxShadow: "none",
              borderRadius: "100px",
              marginRight: "2%",
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
        fontWeight: "bold",
      }}>Summary</Typography>
      { contactOpen && <div style={{ padding: '1rem 0' }}>
          {/* Your content for the 'Contact' section */}
          <ShoppingCart priceList={shoppingList} detailsList={summary} total={totalBill.reduce((a,b)=> a+b,0)}service="Patent Portfolio Analysis"/>
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


import React, { useState, useEffect } from 'react';
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


const IndexPage = () => {
  const [draftingOpen, setDraftingOpen] = useState(true);
  const [title, setTitle] = useState('');
  const [success, setSuccess] = useState("");
  const [detailsFile, setFiles] = useState([]);
  const [keywords, setKeyword] = useState([]);
  const [domain, setDomain] = useState('');
  const [shoppingList, setList] = useState([]);
  const [countriesOpen, setCountriesOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [summary, setSummary] = useState([]);
  const [country, setCountry] = useState([]); // Add country state
  const [totalBill, setBill] = useState([]); // Bill amount state

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleKeywordChange = (event) => {
    setKeyword(event.target.value);
  }

  const handleDomainChange = (value) => {
    setDomain(value);
  };

  const handleDetailsFileChange = (file) => {
    setFiles(file);
  }

  const handleSubmit = async() => {
    setSuccess(true);
    const infoDocument = {
      title: title,
      domain: domain,
      countries: country,
      bills: totalBill,
      keywords: keywords,
      service_specific_files: {
        invention_details: detailsFile
    }
  }
    console.log(infoDocument);
    try {
      const response = await api.post("/patent_drafting", infoDocument);
    } catch(error) {
      console.error("Error in submitting the Patent Drafting Form : " + error);
    }
       

    console.log("Submitted!");
  }

  const handleDraftingContinue = () => {
    if(title != "" && domain != "" && keywords != [] && detailsFile != []) {
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
          title: "Keywords",
          text: keywords.toString()
        },
        {
          title: "Uploaded Files",
          text: [detailsFile.map((file) => file.name)].toString()
        }
      ]);
    } else {
      setSuccess(false);
    }

  };

  const handleCountriesContinue = () => {
    console.log(country);
    if (country.length != 0) {
      setCountriesOpen(false);
      setContactOpen(true);
      console.log(success);
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
          title: "Keywords",
          text: keywords.toString()
        },
        {
          title: "Uploaded Files",
          text: [detailsFile.map((file) => file.name)].toString()
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
    <li>Patent Drafting</li>
  </ul>
</div>

    <Container maxWidth="md" style={{ marginTop: '2rem' }}>
      <Head>
        <title>Patent Drafting</title>
      </Head>
      <BannerCard
  title="Patent Drafting"
  imageSrc="/images/banner_img/bg.png"
  color="white"
  style={{ width: '100%', maxWidth: '1200px', margin: '550%' }}></BannerCard>

      <Typography variant="h5" onClick={() => {setDraftingOpen(!draftingOpen); if(contactOpen) {setContactOpen(false)}}} style={{ cursor: 'pointer', fontWeight: "bold", color: !draftingOpen && "#D3D3D3" }}>
        Drafting
        <ExpandMoreIcon style={{ transform: draftingOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} />
      </Typography>

      {draftingOpen && (
        <div style={{ padding: '1rem 0', }}>
          <TextField
            label="Title"
            variant="outlined"
            fullWidth
            value={title}
            onChange={handleTitleChange}
            style={{ marginBottom: '2rem' }}
          />
          <DefaultSelect domain={domain} onDomainChange={handleDomainChange}/>
          <TextField
            label="Keywords"
            variant="outlined"
            fullWidth
            value={keywords}
            onChange={handleKeywordChange}
            style={{ marginBottom: '2rem', marginTop: "2rem" }}
          />
            <Typography
                as="h3"
                sx={{
                  fontSize: 18,
                  fontWeight: 500,
                  mb: "10px",
                }}
              >
                Upload your invention details
              </Typography>
              {/* <DottedCard> */}
              <CustomDropZone files={detailsFile} onFileChange={handleDetailsFileChange}/>
          { draftingOpen && <div style={{
            textAlign: "center",
          }}>    
          <Button variant="contained" onClick={handleDraftingContinue} style={{ marginTop: '1rem', borderRadius: "100px", boxShadow: "none" ,background: "linear-gradient(90deg, rgba(0, 172, 246, 0.8) 0%, rgba(2, 225, 185, 0.79) 91.25%)" }}>
            Continue
          </Button>
          </div>}
        </div>
      )}
      <Divider style={{ margin: '2rem 0' }} />
      <Typography variant="h5" sx={{
        fontWeight: "bold",
        color: !countriesOpen && "#D3D3D3"
      }} onClick={() => { if (!draftingOpen) { setCountriesOpen(!countriesOpen); if(contactOpen) {setContactOpen(false)} }}}>
      Countries
      <ExpandMoreIcon style={{ transform: countriesOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} />
      </Typography>
      {countriesOpen && (
        <div style={{ padding: '1rem 0', textAlign: "center" }}>
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
            style={{                                  // 68BDFD
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
            style={{                                            // 68BDFD
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
          <Button
            style={{                                            // 68BDFD
              background: country.includes("China") ? "linear-gradient(90deg, rgba(0, 172, 246, 0.8) 0%, rgba(2, 225, 185, 0.79) 91.25%)" : "#F8FCFF",
              color: country.includes("China") ? "white" : "#BFBFBF",
              width: "18%",
              boxShadow: "none",
              borderRadius: "100px",
              marginRight: "2%",
              height: "60px",
              textTransform: "none",
            }}
            onClick={() => {
              if(!country.includes("China")) {
                setCountry(country => [...country, "China"]);
                setBill([...totalBill, 900]);
              } else {
                setCountry(country.filter(nation => nation != "China"));
                setBill(totalBill.filter(bill => bill != 900))
              }
              console.log(country);
              console.log(totalBill);
            }}
            value="China"
          >
            <img
              src="https://hatscripts.github.io/circle-flags/flags/cn.svg"
              width="24"
            />
            &nbsp;&nbsp;China <br />&nbsp;&nbsp;&#40;&#36;700&#41;
          </Button>
          <Button
            style={{                                            // 68BDFD
              background: country.includes("UAE") ? "linear-gradient(90deg, rgba(0, 172, 246, 0.8) 0%, rgba(2, 225, 185, 0.79) 91.25%)" : "#F8FCFF",
              color: country.includes("UAE") ? "white" : "#BFBFBF",
              width: "18%",
              boxShadow: "none",
              borderRadius: "100px",
              marginRight: "2%",
              height: "60px",
              textTransform: "none",
            }}
            onClick={() => {
              if(!country.includes("UAE")) {
                setCountry(country => [...country, "UAE"]);
                setBill([...totalBill, 900]);
              } else {
                setCountry(country.filter(nation => nation != "UAE"));
                setBill(totalBill.filter(bill => bill != 900))
              }
              console.log(country);
              console.log(totalBill);
            }}
            value="UAE"
          >
            <img
              src="https://hatscripts.github.io/circle-flags/flags/ae.svg"
              width="24"
            />
            &nbsp;&nbsp;UAE <br />&nbsp;&nbsp;&#40;&#36;1000&#41;
          </Button>
          {/* Add other country buttons similarly */}
          <Button
            style={{                                            // 68BDFD
              background: country.includes("Australia") ? "linear-gradient(90deg, rgba(0, 172, 246, 0.8) 0%, rgba(2, 225, 185, 0.79) 91.25%)" : "#F8FCFF",
              color: country.includes("Australia") ? "white" : "#BFBFBF",
              width: "18%",
              boxShadow: "none",
              borderRadius: "100px",
              marginRight: "2%",
              height: "60px",
              textTransform: "none",
            }}
            onClick={() => {
              if(!country.includes("Australia")) {
                setCountry(country => [...country, "Australia"]);
                setBill([...totalBill, 900]);
              } else {
                setCountry(country.filter(nation => nation != "Australia"));
                setBill(totalBill.filter(bill => bill != 900))
              }
              console.log(country);
              console.log(totalBill);
            }}
            value="Australia"
          >
            <img
              src="https://hatscripts.github.io/circle-flags/flags/au.svg"
              width="24"
            />
            &nbsp;&nbsp;Australia <br />&nbsp;&nbsp;&#40;&#36;750&#41;
          </Button>
          <Button
            style={{                                            // 68BDFD
              background: country.includes("Germany") ? "linear-gradient(90deg, rgba(0, 172, 246, 0.8) 0%, rgba(2, 225, 185, 0.79) 91.25%)" : "#F8FCFF",
              color: country.includes("Germany") ? "white" : "#BFBFBF",
              width: "18%",
              boxShadow: "none",
              borderRadius: "100px",
              marginRight: "2%",
              marginTop: "1rem",
              height: "60px",
              textTransform: "none",
            }}
            onClick={() => {
              if(!country.includes("Germany")) {
                setCountry(country => [...country, "Germany"]);
                setBill([...totalBill, 900]);
              } else {
                setCountry(country.filter(nation => nation != "Germany"));
                setBill(totalBill.filter(bill => bill != 900))
              }
              console.log(country);
              console.log(totalBill);
            }}
            value="Germany"
          >
            <img
              src="https://hatscripts.github.io/circle-flags/flags/de.svg"
              width="24"
            />
            &nbsp;&nbsp;Germany <br />&nbsp;&nbsp;&#40;&#36;800&#41;
          </Button>
          <Button
            style={{                                            // 68BDFD
              background: country.includes("UK") ? "linear-gradient(90deg, rgba(0, 172, 246, 0.8) 0%, rgba(2, 225, 185, 0.79) 91.25%)" : "#F8FCFF",
              color: country.includes("UK") ? "white" : "#BFBFBF",
              width: "18%",
              boxShadow: "none",
              borderRadius: "100px",
              marginRight: "2%",
              marginTop: "1rem",
              height: "60px",
              textTransform: "none",
            }}
            onClick={() => {
              if(!country.includes("UK")) {
                setCountry(country => [...country, "UK"]);
                setBill([...totalBill, 900]);
              } else {
                setCountry(country.filter(nation => nation != "UK"));
                setBill(totalBill.filter(bill => bill != 900))
              }
              console.log(country);
              console.log(totalBill);
            }}
            value="UK"
          >
            <img
              src="https://hatscripts.github.io/circle-flags/flags/gb.svg"
              width="24"
            />
            &nbsp;&nbsp;UK <br />&nbsp;&nbsp;&#40;&#36;950&#41;
          </Button>
          <Button
            style={{                                            // 68BDFD
              background: country.includes("Spain") ? "linear-gradient(90deg, rgba(0, 172, 246, 0.8) 0%, rgba(2, 225, 185, 0.79) 91.25%)" : "#F8FCFF",
              color: country.includes("Spain") ? "white" : "#BFBFBF",
              width: "18%",
              boxShadow: "none",
              borderRadius: "100px",
              marginRight: "2%",
              marginTop: "1rem",
              height: "60px",
              textTransform: "none",
            }}
            onClick={() => {
              if(!country.includes("Spain")) {
                setCountry(country => [...country, "Spain"]);
                setBill([...totalBill, 900]);
              } else {
                setCountry(country.filter(nation => nation != "Spain"));
                setBill(totalBill.filter(bill => bill != 900))
              }
              console.log(country);
              console.log(totalBill);
            }}
            value="Spain"
          >
            <img
              src="https://hatscripts.github.io/circle-flags/flags/es.svg"
              width="24"
            />
            &nbsp;&nbsp;Spain <br />&nbsp;&nbsp;&#40;&#36;650&#41;
          </Button>
          <Button
            style={{                                            // 68BDFD
              background: country.includes("France") ? "linear-gradient(90deg, rgba(0, 172, 246, 0.8) 0%, rgba(2, 225, 185, 0.79) 91.25%)" : "#F8FCFF",
              color: country.includes("France") ? "white" : "#BFBFBF",
              width: "18%",
              boxShadow: "none",
              borderRadius: "100px",
              marginRight: "2%",
              marginTop: "1rem",
              height: "60px",
              textTransform: "none",
            }}
            onClick={() => {
              if(!country.includes("France")) {
                setCountry(country => [...country, "France"]);
                setBill([...totalBill, 900]);
              } else {
                setCountry(country.filter(nation => nation != "France"));
                setBill(totalBill.filter(bill => bill != 900))
              }
              console.log(country);
              console.log(totalBill);
            }}
            value="France"
          >
            <img
              src="https://hatscripts.github.io/circle-flags/flags/fr.svg"
              width="24"
            />
            &nbsp;&nbsp;France <br />&nbsp;&nbsp;&#40;&#36;1100&#41;
          </Button>
          <Button
            style={{                                            // 68BDFD
              background: country.includes("Italy") ? "linear-gradient(90deg, rgba(0, 172, 246, 0.8) 0%, rgba(2, 225, 185, 0.79) 91.25%)" : "#F8FCFF",
              color: country.includes("Italy") ? "white" : "#BFBFBF",
              width: "18%",
              boxShadow: "none",
              borderRadius: "100px",
              marginRight: "2%",
              marginTop: "1rem",
              height: "60px",
              textTransform: "none",
            }}
            onClick={() => {
              if(!country.includes("Italy")) {
                setCountry(country => [...country, "Italy"]);
                setBill([...totalBill, 900]);
              } else {
                setCountry(country.filter(nation => nation != "Italy"));
                setBill(totalBill.filter(bill => bill != 900))
              }
              console.log(country);
              console.log(totalBill);
            }}
            value="Italy"
          >
            <img
              src="https://hatscripts.github.io/circle-flags/flags/it.svg"
              width="24"
            />
            &nbsp;&nbsp;Italy <br />&nbsp;&nbsp;&#40;&#36;875&#41;
          </Button>
        </div>
      )}
      { countriesOpen && <div style={{
        textAlign: "center",
      }}>
      <Button variant="contained" onClick={handleCountriesContinue} style={{ marginTop: '1rem', borderRadius: "100px" , boxShadow: "none", background: "linear-gradient(90deg, rgba(0, 172, 246, 0.8) 0%, rgba(2, 225, 185, 0.79) 91.25%)" }}>
            Continue
          </Button>
      </div> }

      <Divider style={{ margin: '2rem 0' }} />
      <Typography variant="h5" sx={{
        fontWeight: "bold",
        color: !contactOpen && "#D3D3D3"
      }}>Summary</Typography>
      { contactOpen && <div style={{ padding: '0.5rem 0' }}>
          {/* Your content for the 'Contact' section */}
          <ShoppingCart priceList={shoppingList} detailsList={summary} total={totalBill.reduce((a,b)=> a+b,0)}service="Patent Drafting"/>
        </div>
        }
       { contactOpen && title != "" && domain != "" && keywords.length != 0  && detailsFile.length != 0 && <div style={{
        textAlign: "center",
       }}>
        <Button variant="contained" onClick={() => handleSubmit()} style={{ marginTop: '0.25rem', borderRadius: "100px" , boxShadow: "none",background: "linear-gradient(90deg, rgba(0, 172, 246, 0.8) 0%, rgba(2, 225, 185, 0.79) 91.25%)" }}>
            Submit
        </Button>
        </div> }


    </Container>
    </Paper>
    </div>
    <OkDialogueBox success={success} />
    </>
  );
};

export default IndexPage;

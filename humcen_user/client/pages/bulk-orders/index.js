import BulkOrderComponent from "./BulkOrderComponent"
import styles from "@/styles/PageTitle.module.css";
import withAuth from "@/components/withAuth";
import React, { useState } from 'react';
import Head from 'next/head';
import axios from 'axios';
import OkDialogueBox from "pages/patent-services/dialoguebox";
import CustomDropZone from "@/components/CustomDropBox";
import DefaultSelect from "@/components/Forms/AdvancedElements/DefaultField";
import ShoppingCart from '@/components/shoppingCart';
import { Checkbox } from '@mui/material';
import BannerCard from "@/components/BannerCard";
import style from "@/styles/PageTitle.module.css";
import Link from "next/link";
import SelectBulk from "@/components/Forms/AdvancedElements/Selection";

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



const ProductDetails = () => {
  const [draftingOpen, setDraftingOpen] = useState(true);
  const [success, setSuccess] = useState("");
  const [detailsFile, setFiles] = useState([]);
  const [domain, setDomain] = useState('');
  const [shoppingList, setList] = useState([]);
  const [quantity, setQuantity] = useState('');

  const [countriesOpen, setCountriesOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [summary, setSummary] = useState([]);
  const [country, setCountry] = useState([]); // Add country state
  const [totalBill, setBill] = useState([]); // Bill amount state

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleQuantity = (event) => {
    setQuantity(event.target.value);
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
      const response = await api.post("patent_drafting", infoDocument);
    } catch(error) {
      console.error("Error in submitting the Patent Drafting Form : " + error);
    }
       

    console.log("Submitted!");
  }

  const handleDraftingContinue = () => {
    if(domain != "" && quantity != [] && detailsFile != []) {
      setDraftingOpen(false);
      setCountriesOpen(true);
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
          title: "Domain",
          text: domain,
        },
        {
          title: "Quantity",
          text: quantity.toString()
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
    <div className={'card'} >
      {/* Page title */}
      <div className={styles.pageTitle}>
        <ul>
          <li>
            <Link href="/">Dashboard</Link>
          </li>
          <li>Bulk Order</li>
        </ul>
      </div>
      <h1 className={styles.heading}>Bulk Orders</h1>
      </div>
      <>
      <div style={{ margin: '0 1rem' }}>
        <Paper elevation={3} style={{ borderRadius: '16px', padding: '1rem', margin: '1rem 0' }}>
          {/* Banner */}



    <Container maxWidth="md" style={{ marginTop: '2rem' }}>
      <Head>
        <title>Bulk Order</title>
      </Head>
      <BannerCard
  title="Bulk Order"
  imageSrc="/images/banner_img/bg.png"
  color="white"
  style={{ width: '100%', maxWidth: '1200px', margin: '550%' }}></BannerCard>

      <Typography variant="h5" onClick={() => setDraftingOpen(!draftingOpen)} style={{ cursor: 'pointer', fontWeight: "bold" }}>
        Details
        <ExpandMoreIcon style={{ transform: draftingOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} />
      </Typography>

      {draftingOpen && (
        <div style={{ padding: '1rem 0', }}>
          <SelectBulk domain={domain} onDomainChange={handleDomainChange}/>
          <TextField
            label="Quantity"
            variant="outlined"
            fullWidth
            value={quantity}
            onChange={handleQuantity}
            style={{ marginBottom: '2rem', marginTop: "2rem" }}
          />
            {/* <Typography
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
              {/* <CustomDropZone files={detailsFile} onFileChange={handleDetailsFileChange}/>  */}
          <div style={{
            textAlign: "center",
          }}>    
          <Button variant="contained" onClick={handleDraftingContinue} style={{ marginTop: '1rem', borderRadius: "100px", boxShadow: "none" ,background: "linear-gradient(90deg, rgba(0, 172, 246, 0.8) 0%, rgba(2, 225, 185, 0.79) 91.25%)" }}>
            Continue
          </Button>
          </div>
        </div>
      )}
      <Divider style={{ margin: '2rem 0' }} />
      <Typography variant="h5" sx={{
        fontWeight: "bold",
      }} onClick={() => { if (!draftingOpen) { setCountriesOpen(!countriesOpen) }}}>
      Target Country 
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
          {/* Add other country buttons similarly */}
          
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

     
   
        <Button variant="contained" onClick={() => handleSubmit()} style={{ marginTop: '0.25rem', borderRadius: "100px" , boxShadow: "none",background: "linear-gradient(90deg, rgba(0, 172, 246, 0.8) 0%, rgba(2, 225, 185, 0.79) 91.25%)" }}>
            Submit
        </Button>
    


    </Container>
    </Paper>
    </div>
    <OkDialogueBox success={success} serviceValue={"Patent Drafting"} />
    </>
    </>

  );
}

export default withAuth(ProductDetails)
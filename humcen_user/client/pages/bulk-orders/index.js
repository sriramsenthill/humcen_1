import BulkOrderComponent from "./BulkOrderComponent"
import styles from "@/styles/PageTitle.module.css";
import withAuth from "@/components/withAuth";
import React, { useState, useEffect } from 'react';
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
import { Carousel } from "react-responsive-carousel";
import { Card } from "@mui/material";

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
  const [country, setCountry] = useState(""); // Add country state
   // Bill amount state

   const [uploadAccess, setUploadAccess] = useState(false);

   useEffect(() => {
     const checkRequestBeforeUpload = async() => {
       try {
         const checkResponse = await api.get("bulk-order/check-request");
         if(checkResponse.status === 200) {
           console.log("Response received Successfully");
           setUploadAccess(checkResponse.data.user);
         }

       } catch(error) {
           console.error("Error in receiving Check Results : " + error);
       }        
     }
   
     checkRequestBeforeUpload();
   }, [])


  const handleQuantity = (event) => {
    setQuantity(event.target.value);
  }

  const handleDomainChange = (value) => {
    setDomain(value);
  };


  const handleSubmit = async() => {
    try {
      
    if(country != '') {
      setSuccess(true);
      const infoDocument = {
        domain: domain,
        quantity: Math.abs(quantity),
        country: country
    }
    const response = await api.post("/new-bulk-order-request", infoDocument);
    console.log("Response sent Successfully!");
      console.log("Submitted!");
    } else {
      setSuccess(false);
    }

    } catch(error) {
      console.error("Error in sending the Response : " + error);
    }

  }

  const handleDraftingContinue = () => {
    if(domain != "" && quantity != "") {
      setDraftingOpen(false);
      setCountriesOpen(true);
    } else {
      setSuccess(false);
    }

  };

  const carouselImages = [
    {
      src: "/images/Business 1.jpg",
      alt: "image1",
      link: "https://www.youtube.com/watch?v=49HTIoCccDY",
    },
    {
      src: "/images/Business 2.jpg",
      alt: "image2",
      link: "https://store.google.com/in/magazine/compare_nest_speakers_displays?pli=1&hl=en-GB",
    },
    {
      src: "/images/Business 3.jpg",
      alt: "image3",
      link: "https://www.amazon.in/amazonprime",
    },
  ];

  const handleClick = (link) => {
    window.open(link, "_blank");
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
        <Carousel
  autoPlay={true}
  infiniteLoop={true}
  interval={3000}
  showArrows={false}
  showThumbs={false}
  showStatus={false}
  showIndicators={true}
  dynamicHeight={false}
  style={{ maxWidth: "md", margin: "0 auto"}}
>
  {carouselImages.map((image, index) => (
    <div
      key={index}
      style={{
        textAlign: "center",
        borderRadius: "20px",
        overflow: "hidden",
        cursor: "pointer",
        height: "100%", // Set a fixed height for the carousel items
      }}
      onClick={() => handleClick(image.link)}
    >
      <img
        src={image.src}
        alt={image.alt}
        style={{
          maxWidth: "70%", // Ensure the image scales within its container
          maxHeight: "100%", // Maintain the aspect ratio of the image
          borderRadius: "20px"
        }}
      />
    </div>
                ))}
              </Carousel>
      { !uploadAccess && <div style={{textAlign: "center", background: "white"}}><Typography
            as="h1"
            sx={{
              fontSize: 18,
              fontWeight: 500,
              pb: "2rem",
              pt: "2rem"
            }}
          >
            Wait for the Pending Request to be Completed. Thank You.
          </Typography></div>}
      <div style={{ margin: '0 1rem' }}>
      { uploadAccess && <Paper elevation={3} style={{ borderRadius: '16px', padding: '1rem', margin: '1rem 0' }}>
          {/* Banner */}
 <Container maxWidth="md" style={{ marginTop: '2rem' }}>
      <Head>
        <title>Bulk Order</title>
      </Head>
      {/* <BannerCard
  title="Bulk Order"
  imageSrc="/images/banner_img/bg.png"
  color="white"
  style={{ width: '100%', maxWidth: '1200px', margin: '550%' }}></BannerCard> */}

      <Typography variant="h5" onClick={() => setDraftingOpen(!draftingOpen)} style={{ cursor: 'pointer', fontWeight: "bold" }}>
        Details
        <ExpandMoreIcon style={{ transform: draftingOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} />
      </Typography>

      {draftingOpen && (
        <div style={{ padding: '1rem 0', }}>
        <Typography
            as="h3"
            sx={{
              fontSize: 18,
              fontWeight: 500,
              mb: "1rem",
            }}
          >
            Select the Service
          </Typography>
          <SelectBulk domain={domain} onDomainChange={handleDomainChange}/>
          <Typography
            as="h3"
            sx={{
              fontSize: 18,
              fontWeight: 500,
              mt: "2rem",
              mb: "1rem",
            }}
          >
            Select the Quantity
          </Typography>
          <TextField
            label="Quantity"
            variant="outlined"
            type= "number"
            InputProps={{
              inputProps: {
                min: 1,
              }
            }}
            fullWidth
            value={quantity}
            onChange={handleQuantity}
            style={{ marginBottom: '2rem' }}
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
              background: country === "India" ? "linear-gradient(90deg, rgba(0, 172, 246, 0.8) 0%, rgba(2, 225, 185, 0.79) 91.25%)" : "#F8FCFF",
              color: country.includes("India") ? "white" : "#BFBFBF",
              width: "15%",
              marginRight: "2%",
              boxShadow: "none",
              borderRadius: "100px",
              height: "60px",
              textTransform: "none",
            }}
            onClick={() => {
              setCountry("India")
            }}
          >
            <img
              src="https://hatscripts.github.io/circle-flags/flags/in.svg"
              width="24"
            />
            &nbsp;&nbsp;India
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
              setCountry("United States");
              console.log(country);
            }}
            value="United States"
          >
            <img
              src="https://hatscripts.github.io/circle-flags/flags/us.svg"
              width="24"
            />
            &nbsp;&nbsp;United States
          </Button>
          {/* Add other country buttons similarly */}
          
        </div>
      )}
      { countriesOpen &&  <div style={{
        textAlign: "center",
      }}>
        <Button variant="contained" onClick={() => handleSubmit()} style={{ marginTop: '0.25rem', borderRadius: "100px" , boxShadow: "none",background: "linear-gradient(90deg, rgba(0, 172, 246, 0.8) 0%, rgba(2, 225, 185, 0.79) 91.25%)" }}>
            Submit
        </Button>
      </div>}

      <Divider style={{ margin: '2rem 0' }} />
    


    </Container>
    </Paper>}
    </div>
    <OkDialogueBox success={success} serviceValue={"Patent Drafting"} />
    </>
    </>

  );
}

export default withAuth(ProductDetails)
import React, { useState, useRef } from "react";
import BannerCard from "@/components/BannerCard";
import Link from "next/link";
import style from "@/styles/PageTitle.module.css";
import { Button, ButtonProps, Card, InputLabel } from "@mui/material";
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
import OkDialogueBox from "./dialoguebox";
import CustomDropZone from "@/components/CustomDropBox";
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


const ColorButton = styled(Button)(({ theme }) => ({
  color: "white",
  width: "120%",
  height: "52px",
  borderRadius: "100px",
  marginBottom: "30px",
  background: "linear-gradient(270deg, #02E1B9 0%, #00ACF6 100%)",
  "&:hover": {
    background: "linear-gradient(270deg, #02E1B9 0%, #00ACF6 100%)",
  },
  textTransform: "none",
  fontSize: "14px",
  fontWeight: "400",
}));

export default function Inbox() {
  const [domain, setDomain] = useState("");
  const [country, setCountry] = useState("");
  const [description, setDescription] = useState("");
  const [keyword, setKeyword] = useState("");
  const [techDrawings, setTechDrawings] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false);
  const [isErrorDialogOpenStatus, setIsErrorDialogOpenStatus] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const router = useRouter();


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
    if (!domain || !country || !description || !keyword || !techDrawings){
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    

if (!isFormValid()) {
  setIsErrorDialogOpen(true);
  return;
}



    const formData = {
      field: domain,
      invention_description: description,
      keywords: keyword,
      country: country,
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

  const handleOk = () => {
    setIsSubmitted(false);
    router.push("/");
  };


  return (
    <>
    <div className="card">
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
      <BannerCard title="Patent Search" imageSrc="/images/banner_img/bg.png" color="white"></BannerCard>
      <div className={style.ccard}>
      {/* <h1 className={`${style.heading} ${style.align}`}>Patent Search</h1>

      <p
        style={{
          fontFamily: "Inter",
          fontStyle: "normal",
          fontWeight: "400",
          fontSize: "16px",
          lineHeight: "19px",
          paddingLeft: "12%",
          marginTop: "8px"
        }}
      >
        Let's get started with the basic details to search your project
      </p> */}
      <Card variant="outlined" sx={{ marginLeft: "2%", marginRight: "2%", width: "95%", borderRadius: "15px" }}>
    
      <form onSubmit={handleSubmit}>
      <Card variant="outlined" sx={{ margin: "5% 12%" }}>
          <DefaultSelect domain={domain} onDomainChange={handleDomainChange} />
          <Card
            sx={{
              boxShadow: "none",
              borderRadius: "10px",
              p: "25px",
              mb: "10px",
            }}
          >
            <Typography
              as="h3"
              sx={{
                fontSize: 18,
                fontWeight: 500,
                mb: "10px",
              }}
            >
              Target Country
            </Typography>
            <Button
              style={{
                background: country === "India" ? "#68BDFD" : "#F8FCFF",
                color: country === "India" ? "white" : "#BFBFBF",
                width: "13%",
                marginRight: "2%",
                height: "40px",
                textTransform: "none",
              }}
              onClick={() => {
                setCountry("India"); // Update the country state on button click
              }}
            >
              <img
                src="https://hatscripts.github.io/circle-flags/flags/in.svg"
                width="24"
              />
              &nbsp;&nbsp;India
            </Button>
            <Button
              style={{
                background: country === "United States" ? "#68BDFD" : "#F8FCFF",
                color: country === "United States" ? "white" : "#BFBFBF",
                width: "13%",
                marginRight: "2%",
                height: "40px",
                textTransform: "none",
              }}
              onClick={() => {
                setCountry("United States");
              }}
            >
              <img
                src="https://hatscripts.github.io/circle-flags/flags/us.svg"
                width="24"
              />
              &nbsp;&nbsp;United States
            </Button>
            <Button
              style={{
                background: country === "Germany" ? "#68BDFD" : "#F8FCFF",
                color: country === "Germany" ? "white" : "#BFBFBF",
                width: "13%",
                marginRight: "2%",
                height: "40px",
                textTransform: "none",
              }}
              onClick={() => {
                setCountry("Germany");
              }}
            >
              <img
                src="https://hatscripts.github.io/circle-flags/flags/de.svg"
                width="24"
              />
              &nbsp;&nbsp;Germany
            </Button>
            <Button
              style={{
                background: country === "China" ? "#68BDFD" : "#F8FCFF",
                color: country === "China" ? "white" : "#BFBFBF",
                width: "13%",
                marginRight: "2%",
                height: "40px",
                textTransform: "none",
              }}
              onClick={() => {
                setCountry("China");
              }}
            >
              <img
                src="https://hatscripts.github.io/circle-flags/flags/cn.svg"
                width="24"
              />
              &nbsp;&nbsp;China
            </Button>
            <Button
              style={{
                background: country === "UAE" ? "#68BDFD" : "#F8FCFF",
                color: country === "UAE" ? "white" : "#BFBFBF",
                width: "13%",
                marginRight: "2%",
                height: "40px",
                textTransform: "none",
              }}
              onClick={() => {
                setCountry("UAE");
              }}
            >
              <img
                src="https://hatscripts.github.io/circle-flags/flags/ae.svg"
                width="24"
              />
              &nbsp;&nbsp;UAE
            </Button>
            <Button
              style={{
                background: country === "Japan" ? "#68BDFD" : "#F8FCFF",
                color: country === "Japan" ? "white" : "#BFBFBF",
                width: "13%",
                marginRight: "2%",
                height: "40px",
                textTransform: "none",
              }}
              onClick={() => {
                setCountry("Japan");
              }}
            >
              <img
                src="https://hatscripts.github.io/circle-flags/flags/jp.svg"
                width="24"
              />
              &nbsp;&nbsp;Japan
            </Button>
          </Card>
          <Card
            sx={{
              boxShadow: "none",
              borderRadius: "10px",
              p: "25px",
              mb: "10px",
            }}
          >
            <Typography
              as="h3"
              sx={{
                fontSize: 18,
                fontWeight: 500,
                mb: "10px",
              }}
            >
              Invention Description:
            </Typography>
            <TextField
              fullWidth
              id="name"
              name="name"
              label="A clear and detailed description of the invention. Minimum 200-300 words."
              autoComplete="name"
              InputProps={{
                style: { borderRadius: 8 },
              }}
              onChange={handleDescriptionChange} // Provide the onChange event handler
            />
          </Card>
          <Card
            sx={{
              boxShadow: "none",
              borderRadius: "10px",
              p: "25px",
              mb: "10px",
            }}
          >
            <Typography
              as="h3"
              sx={{
                fontSize: 18,
                fontWeight: 500,
                mb: "10px",
              }}
            >
              Technical Drawings or Diagrams:
            </Typography>
            <Typography
              as="h5"
              sx={{
                fontSize: 12,
                fontWeight: 350,
                mb: "10px",
              }}
            >
             ( Visual representations or technical drawings that illustrate the invention's design, structure, or process. )
            </Typography>
            <CustomDropZone files={techDrawings} onFileChange={handleTechDrawings}/>
          </Card>
          <Card
            sx={{
              boxShadow: "none",
              borderRadius: "10px",
              p: "25px",
              mb: "10px",
            }}
          >
            <Typography
              as="h3"
              sx={{
                fontSize: 18,
                fontWeight: 500,
                mb: "10px",
              }}
            >
              Keywords or Search Parameters: 
            </Typography>
            <TextField
              fullWidth
              id="name"
              name="name"
              label="Specific keywords, phrases, or concepts related to your invention."
              autoComplete="name"
              InputProps={{
                style: { borderRadius: 8 },
              }}
              onChange={handleKeywordChange} // Provide the onChange event handler
            />
          </Card>
          <Card
            sx={{
              boxShadow: "none",
              borderRadius: "10px",
              p: "25px",
              mb: "10px",
            }}
          >
            <CheckBox /> I have read and agreed to the following policies -
            Humcen Privacy Policy, Humcen Terms & Conditions, before proceeding.
          </Card>
          <Card
            sx={{
              boxShadow: "none",
              borderRadius: "10px",
              p: "25px",
              mb: "10px",
            }}
          >
            <Link
              href="/patent-services/search_form"
              style={{ textDecoration: "none" }}
            >
              <ColorButton
                sx={{ width: "15%" }}
                type="submit"
                onClick={handleSubmit}
              >
                Submit
              </ColorButton>
            </Link>
          </Card>
        </Card>
      </form>
</Card>
      {isSubmitted && <OkDialogueBox domainValue={domain} serviceValue={"Patent Search"}/> }
      <Dialog open={isErrorDialogOpen}>
    <DialogTitle>Error</DialogTitle>
    <DialogContent>
      <p>Please fill all the required details before submitting the form.</p>
    </DialogContent>
    <DialogActions>
      <Button onClick={() => setIsErrorDialogOpen(false)}>OK</Button>
    </DialogActions>
  </Dialog>

  <Dialog open={isErrorDialogOpenStatus}>
  <DialogTitle>Error</DialogTitle>
  <DialogContent>
    <p>{errorMessage}</p>
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setIsErrorDialogOpenStatus(false)}>OK</Button>
  </DialogActions>
</Dialog>

      </div>
      </div>
    </>
  );
}

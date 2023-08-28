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
  const [patentInfo, setPatentInfo] = useState("");
  const [commGoals, setCommGoals] = useState("");
  const [compLandscape, setCompLandscape] = useState("");
  const [techDescription, setTechDescription] = useState("");
  const [country, setCountry] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false);
  const [isErrorDialogOpenStatus, setIsErrorDialogOpenStatus] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const router = useRouter();


  const handleDomainChange = (value) => {
    setDomain(value);
  };

  const handlePatentInfo = (event) => {
    setPatentInfo(event.target.value);
  };

  const handleCommGoals = (event) => {
    setCommGoals(event.target.value);
  };

  const handleCompLandscape = (event) => {
    setCompLandscape(event.target.value);
  };

  const handleTechDescription = (event) => {
    setTechDescription(event.target.value);
  }
  
  const isFormValid = () => {
    // Check if all the required fields are filled
    return (
      domain &&
      patentInfo &&
      commGoals &&
      compLandscape &&
      techDescription &&
      country
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
if (!isFormValid()) {
  setIsErrorDialogOpen(true);
  return;
}


    const formData = {
      field: domain,
      patent_information: patentInfo,
      commercialization_goals: commGoals,
      competitive_landscape: compLandscape,
      technology_description: techDescription,
      country: country,
    };

    try {
      const response = await api.post("/patent_licensing", formData);
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
          <li>Patent Licensing and Commercialization Services</li>
        </ul>
      </div>
      <BannerCard title="Patent Licensing and Commercialization" imageSrc="/images/banner_img/bg.png" color="white"></BannerCard>
      <div className={style.ccard}>
      {/* <h1 className={`${style.heading} ${style.align}`}>Patent Licensing and Commercialization Services</h1>

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
        Let's get started with the basic details for Patent Licensing and Commercialization Services
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
              Patent Information :
            </Typography>
            <TextField
              fullWidth
              id="name"
              name="name"
              label="Share details of the patented technology."
              autoComplete="name"
              InputProps={{
                style: { borderRadius: 8 },
              }}
              onChange={handlePatentInfo} // Provide the onChange event handler
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
              Commercialization Goals :
            </Typography>
            <TextField
              fullWidth
              id="name"
              name="name"
              label="Discuss your specific goals and objectives for licensing and commercializing your patented technology."
              autoComplete="name"
              InputProps={{
                style: { borderRadius: 8 },
              }}
              onChange={handleCommGoals} // Provide the onChange event handler
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
              Competitive Landscape :
            </Typography>
            <TextField
              fullWidth
              id="name"
              name="name"
              label="Provide information about existing competitors or companies operating in the same or related fields."
              autoComplete="name"
              InputProps={{
                style: { borderRadius: 8 },
              }}
              onChange={handleCompLandscape} // Provide the onChange event handler
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
              Technology Description :
            </Typography>
            <TextField
              fullWidth
              id="name"
              name="name"
              label="Give a comprehensive description of the patented technology."
              autoComplete="name"
              InputProps={{
                style: { borderRadius: 8 },
              }}
              onChange={handleTechDescription} // Provide the onChange event handler
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
              Target Country :
            </Typography>
            <Typography
              as="h5"
              sx={{
                fontSize: 12,
                fontWeight: 350,
                mb: "10px",
              }}
            >
             ( Specify the countries or regions where you intend to operate or commercialize your invention. )
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
              href="/patent-services/drafting-form"
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

      {isSubmitted && <OkDialogueBox domainValue={domain} serviceValue={"Patent Licensing and Commercialization"}/> }
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

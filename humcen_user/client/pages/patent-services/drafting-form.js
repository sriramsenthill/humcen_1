import React, { useState, useRef } from "react";
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
import Upload from "../../components/Upload";
import BannerCard from "@/components/BannerCard";
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
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");
  const [keyword, setKeyword] = useState("");
  const [country, setCountry] = useState("");
  const [budget, setBudget] = useState("");
  const [files, setFileData] = useState(null);
  const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isErrorDialogOpenStatus, setIsErrorDialogOpenStatus] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();


  const getFiles = (fileData) => {
    setFileData(fileData);
  };

  const handleDomainChange = (value) => {
    setDomain(value);
  };
  const handleKeywordChange = (event) => {
    setKeyword(event.target.value);
  };

  const handleTitleChange = (event) => {
    setTitle(event.target.value); // Update the title state on input change
  };

  const isFormValid = () => {
    if (
      domain === "" ||
      title === "" ||
      keyword === "" ||
      country === "" ||
      budget === "" ||
      time === "" ||
      files === null
    ) {
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
      domain: domain,
      country: country,
      job_title: title,
      keywords: keyword,
      budget: budget,
      time_of_delivery: time,
      service_specific_files: {
        invention_details: files,
      },
    };

    try {
      const response = await api.post("/job_order", formData);
      const data = response.data;
      console.log("Form submitted successfully");
      console.log(data);
      setIsSubmitted(true);
    }catch (error) {
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

      <BannerCard title="Patent Drafting" imageSrc="/images/banner_img/2.png" color="common.black"></BannerCard>
     
      <div className={style.ccard}>
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
              Select your preferred country format
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
              Enter your proposed invention title
            </Typography>
            <TextField
              fullWidth
              id="name"
              label="Name"
              name="name"
              autoComplete="name"
              InputProps={{
                style: { borderRadius: 8 },
              }}
              onChange={handleTitleChange} // Provide the onChange event handler
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
              Upload your invention details
            </Typography>
            <FileBase64 multiple={true} onDone={getFiles} />{" "}
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
              Keywords
            </Typography>
            <TextField
              fullWidth
              id="name"
              label="Name"
              name="name"
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
            <Typography
              as="h3"
              sx={{
                fontSize: 18,
                fontWeight: 500,
                mb: "10px",
              }}
            >
              Budget
            </Typography>
            <Button
              style={{
                background: budget === "250-500$" ? "#68BDFD" : "#F8FCFF",
                color: budget === "250-500$" ? "white" : "#BFBFBF",
                width: "15%",
                marginRight: "2%",
                height: "40px",
                textTransform: "none",
              }}
              onClick={() => {
                setBudget("250-500$");
              }}
            >
              250-500$
            </Button>
            <Button
              style={{
                background: budget === "500-1000$" ? "#68BDFD" : "#F8FCFF",
                color: budget === "500-1000$" ? "white" : "#BFBFBF",
                width: "15%",
                marginRight: "2%",
                height: "40px",
                textTransform: "none",
              }}
              onClick={() => {
                setBudget("500-1000$");
              }}
            >
              500-1000$
            </Button>
            <Button
              style={{
                background: budget === "1000-1500$" ? "#68BDFD" : "#F8FCFF",
                color: budget === "1000-1500$" ? "white" : "#BFBFBF",
                width: "15%",
                marginRight: "2%",
                height: "40px",
                textTransform: "none",
              }}
              onClick={() => {
                setBudget("1000-1500$");
              }}
            >
              1000-1500$
            </Button>
            <Button
              style={{
                background: budget === "1500-2000$" ? "#68BDFD" : "#F8FCFF",
                color: budget === "1500-2000$" ? "white" : "#BFBFBF",
                width: "15%",
                marginRight: "2%",
                height: "40px",
                textTransform: "none",
              }}
              onClick={() => {
                setBudget("1500-2000$");
              }}
            >
              1500-2000$
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
              Time of delivery
            </Typography>
            <Button
              style={{
                background: time === "1-2 days" ? "#68BDFD" : "#F8FCFF",
                color: time === "1-2 days" ? "white" : "#BFBFBF",
                width: "15%",
                marginRight: "2%",
                height: "40px",
                textTransform: "none",
              }}
              onClick={() => {
                setTime("1-2 days");
              }}
            >
              1-2 days
            </Button>
            <Button
              style={{
                background: time === "3-5 days" ? "#68BDFD" : "#F8FCFF",
                color: time === "3-5 days" ? "white" : "#BFBFBF",
                width: "15%",
                marginRight: "2%",
                height: "40px",
                textTransform: "none",
              }}
              onClick={() => {
                setTime("3-5 days");
              }}
            >
              3-5 days
            </Button>
            <Button
              style={{
                background: time === "5-7 days" ? "#68BDFD" : "#F8FCFF",
                color: time === "5-7 days" ? "white" : "#BFBFBF",
                width: "15%",
                marginRight: "2%",
                height: "40px",
                textTransform: "none",
              }}
              onClick={() => {
                setTime("5-7 days");
              }}
            >
              5-7 days
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


{isSubmitted && <OkDialogueBox domainValue={domain} serviceValue={"Patent Drafting"}/> }


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

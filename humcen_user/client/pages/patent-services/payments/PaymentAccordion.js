import * as React from "react";
import { styled } from "@mui/material/styles";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import SignUpForm1 from "./PaymentDetailsForm1";
import SignUpForm2 from "./PaymentDetailsForm2";
import PaymentDetails from "./PaymentApplicantDetails";

const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: "none",
  width: "100%",
  borderRadius: "24px",
  p: "12px",
  marginBottom: "12px",
  boxShadow: "initial",
}));

const AccordionSummary = styled((props) => <MuiAccordionSummary {...props} />)(
  ({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "white" : "white",
    "& .MuiAccordionSummary-content": {
      marginLeft: theme.spacing(1),
    },
    border: "none",
    borderRadius: "24px",
  })
);

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
}));

export default function CustomizedAccordions() {
  const [expanded, setExpanded] = React.useState("panel1");

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  return (
    <div>
      <Accordion
        expanded={expanded === "panel1"}
        onChange={handleChange("panel1")}
      >
        <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
          <Typography
            sx={{
              fontFamily: "Inter",
              fontStyle: "normal",
              fontWeight: expanded === "panel1" ? "700" : "400",
              fontSize: "24px",
              lineHeight: "36px",
              color: expanded === "panel1" ? "#333333" : "#4F4F4F",
              margin: "10px",
            }}
          >
            Applicant Details
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <PaymentDetails onChangeUpdate={handleChange} />
        </AccordionDetails>
      </Accordion>
      <Accordion
        expanded={expanded === "panel2"}
        onChange={handleChange("panel2")}
      >
        <AccordionSummary aria-controls="panel2d-content" id="panel2d-header">
          <Typography
            sx={{
              fontFamily: "Inter",
              fontStyle: "normal",
              fontWeight: expanded === "panel2" ? "700" : "400",
              fontSize: "24px",
              lineHeight: "36px",
              color: expanded === "panel2" ? "#333333" : "#4F4F4F",
              margin: "10px",
            }}
          >
            Personal Information
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <SignUpForm1 onChangeUpdate={handleChange} />
        </AccordionDetails>
      </Accordion>
      <Accordion
        expanded={expanded === "panel3"}
        onChange={handleChange("panel3")}
      >
        <AccordionSummary aria-controls="panel3d-content" id="panel3d-header">
          <Typography
            sx={{
              fontFamily: "Inter",
              fontStyle: "normal",
              fontWeight: expanded === "panel3" ? "700" : "400",
              fontSize: "24px",
              lineHeight: "36px",
              color: expanded === "panel3" ? "#333333" : "#4F4F4F",
              margin: "10px",
            }}
          >
            Address for Communications
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <SignUpForm2 onChangeUpdate={handleChange} />
        </AccordionDetails>
      </Accordion>
    </div>
  );
}

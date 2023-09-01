import React, { useState } from "react";
import Card from "@mui/material/Card";
import { Typography } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

export default function BasicAccordion() {
  const [expanded1, setExpanded1] = useState(false);
  const [expanded2, setExpanded2] = useState(false);
  const [expanded3, setExpanded3] = useState(false);
  const [expanded4, setExpanded4] = useState(false);
  const [expanded5, setExpanded5] = useState(false);
  const [expanded6, setExpanded6] = useState(false);
  const [expanded7, setExpanded7] = useState(false);
  const [expanded8, setExpanded8] = useState(false);
  const [expanded9, setExpanded9] = useState(false);
  const [expanded10, setExpanded10] = useState(false);

  

  const handleAccordion1Change = () => {
    setExpanded1(!expanded1);
  };
  const handleAccordion2Change = () => {
    setExpanded2(!expanded2);
  };
  const handleAccordion3Change = () => {
    setExpanded3(!expanded3);
  };

  const handleAccordion4Change = () => {
    setExpanded4(!expanded4);
  };

  const handleAccordion5Change = () => {
    setExpanded5(!expanded5);
  };

  const handleAccordion6Change = () => {
    setExpanded6(!expanded6);
  };

  const handleAccordion7Change = () => {
    setExpanded7(!expanded7);
  };

  const handleAccordion8Change = () => {
    setExpanded8(!expanded8);
  };

  const handleAccordion9Change = () => {
    setExpanded9(!expanded9);
  };

  const handleAccordion10Change = () => {
    setExpanded10(!expanded10);
  };

  return (
    <>
      <Accordion
        expanded={expanded1}
        onChange={handleAccordion1Change}
        style={{ border: "none" }}
      >
        <AccordionSummary
          expandIcon={
            expanded1 ? (
              <RemoveIcon style={{ color: "#00ACF6" }} />
            ) : (
              <AddIcon style={{ color: "#00ACF6" }} />
            )
          }
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography component="h1" fontWeight="bold" style={{ fontWeight: "strong" }}>  
          How do I join HumCen.io as an IP professional? 
                    </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
          Joining is simple! Just visit our website and follow the easy registration process. Once approved, you'll gain access to our vibrant community.

          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion
        className="bg-black"
        expanded={expanded2}
        onChange={handleAccordion2Change}
      >
        <AccordionSummary
          expandIcon={
            expanded2 ? (
              <RemoveIcon style={{ color: "#00ACF6" }} />
            ) : (
              <AddIcon style={{ color: "#00ACF6" }} />
            )
          }
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography component="h1" fontWeight="bold" style={{ fontWeight: "strong" }}>  
          Is this platform suitable for both seasoned and newer IP professionals?           </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
          Absolutely! Our platform is designed to cater to a diverse range of IP professionals, whether you're an industry veteran or just starting out.       </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion
        className="bg-black"
        expanded={expanded3}
        onChange={handleAccordion3Change}
      >
        <AccordionSummary
          expandIcon={
            expanded3 ? (
              <RemoveIcon style={{ color: "#00ACF6" }} />
            ) : (
              <AddIcon style={{ color: "#00ACF6" }} />
            )
          }
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography component="h1" fontWeight="bold" style={{ fontWeight: "strong" }}>  
          What kinds of cross-border collaborations can I expect on HumCen.io?          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
          Our platform fosters collaborations on various IP-related projects, including , IP consultations, patent applications, and more.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion
        className="bg-black"
        expanded={expanded4}
        onChange={handleAccordion4Change}
      >
        <AccordionSummary
          expandIcon={
            expanded4 ? (
              <RemoveIcon style={{ color: "#00ACF6" }} />
            ) : (
              <AddIcon style={{ color: "#00ACF6" }} />
            )
          }
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography component="h1" fontWeight="bold" style={{ fontWeight: "strong" }}>  
          Can I work exclusively remotely or are there on-site requirements?     </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
          You have the freedom to work remotely. HumCen.io embraces the remote work trend, allowing you to engage with projects from anywhere in the world.
</Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion
        className="bg-black"
        expanded={expanded5}
        onChange={handleAccordion5Change}
      >
        <AccordionSummary
          expandIcon={
            expanded5 ? (
              <RemoveIcon style={{ color: "#00ACF6" }} />
            ) : (
              <AddIcon style={{ color: "#00ACF6" }} />
            )
          }
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography component="h1" fontWeight="bold" style={{ fontWeight: "strong" }}>  
          How are the tasks and projects assigned to IP professionals while maintaining client confidentiality?
     </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
          Our platform introduces a unique model. Clients submit job requirements without directly selecting IP professionals. Using advanced technology, tasks are intelligently matched to the most suitable experts based on client inputs. This ensures a confidential collaboration process, managed solely through HumCen.io, while robust encryption safeguards client’s sensitive information. </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion
        className="bg-black"
        expanded={expanded6}
        onChange={handleAccordion6Change}
      >
        <AccordionSummary
          expandIcon={
            expanded6 ? (
              <RemoveIcon style={{ color: "#00ACF6" }} />
            ) : (
              <AddIcon style={{ color: "#00ACF6" }} />
            )
          }
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography component="h1" fontWeight="bold" style={{ fontWeight: "strong" }}>  
          What benefits does HumCen.io offer compared to traditional job platforms?
     </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
          HumCen.io is tailored exclusively for IP professionals, offering a niche environment for specialized opportunities, cross-border networking, and enhanced earnings potential.
</Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion
        className="bg-black"
        expanded={expanded7}
        onChange={handleAccordion7Change}
      >
        <AccordionSummary
          expandIcon={
            expanded7 ? (
              <RemoveIcon style={{ color: "#00ACF6" }} />
            ) : (
              <AddIcon style={{ color: "#00ACF6" }} />
            )
          }
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography component="h1" fontWeight="bold" style={{ fontWeight: "strong" }}>  
          How can I effectively showcase my expertise and skills to attract projects? 
     </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
          Your profile serves as a digital resume. Highlight your experience, achievements, and expertise to make a compelling case for potential clients.
</Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion
        className="bg-black"
        expanded={expanded8}
        onChange={handleAccordion8Change}
      >
        <AccordionSummary
          expandIcon={
            expanded8 ? (
              <RemoveIcon style={{ color: "#00ACF6" }} />
            ) : (
              <AddIcon style={{ color: "#00ACF6" }} />
            )
          }
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography component="h1" fontWeight="bold" style={{ fontWeight: "strong" }}>  
          What kind of ongoing support can I expect from the HumCen.io team?
     </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
          We provide comprehensive support, including technical assistance, project guidance, and networking opportunities to help you succeed on our platform.
</Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion
        className="bg-black"
        expanded={expanded9}
        onChange={handleAccordion9Change}
      >
        <AccordionSummary
          expandIcon={
            expanded9 ? (
              <RemoveIcon style={{ color: "#00ACF6" }} />
            ) : (
              <AddIcon style={{ color: "#00ACF6" }} />
            )
          }
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography component="h1" fontWeight="bold" style={{ fontWeight: "strong" }}>  
          How do I handle payment and billing for the projects I undertake? 
     </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
          We facilitate secure payment transactions through our platform, ensuring a seamless and transparent process for both you and the clients.</Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion
        className="bg-black"
        expanded={expanded10}
        onChange={handleAccordion10Change}
      >
        <AccordionSummary
          expandIcon={
            expanded10 ? (
              <RemoveIcon style={{ color: "#00ACF6" }} />
            ) : (
              <AddIcon style={{ color: "#00ACF6" }} />
            )
          }
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography component="h1" fontWeight="bold" style={{ fontWeight: "strong" }}>  
          What measures are in place to ensure the quality and professionalism of IP professionals in your network?     </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
          At HumCen.io, we maintain a stringent vetting process for all IP professionals on our platform. This includes evaluating credentials, experience, and expertise to ensure the highest standards of quality.</Typography>
        </AccordionDetails>
      </Accordion>
    </>
  );
}

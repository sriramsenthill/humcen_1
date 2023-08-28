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
          What is HumCen.io? 
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
          HumCen.io is a revolutionary blockchain-driven platform designed to facilitate cross-border Intellectual Property (IP) management. It empowers innovators and businesses by offering expert IP assistance, secure IP transactions, and strategic portfolio management on a global scale.

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
          How does HumCen.io work? 
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
          HumCen.io utilises blockchain technology to provide a secure and transparent environment for managing IP. It connects innovators and businesses with experts, enables secure IP transactions, and offers tools for strategic portfolio management, all while ensuring the protection and monetization of their creations.          </Typography>
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
          Who can benefit from using HumCen.io?           </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
          HumCen.io is beneficial for innovators, businesses, startups, and anyone involved in creating and managing intellectual property. Whether you have a single patent or a large portfolio of IP assets, HumCen.io offers solutions to protect, manage, and monetize your creations.
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
          What kind of IP assistance is available on HumCen.io?        </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
          HumCen.io provides access to expert IP assistance, including all kinds of patenting support,, and other intellectual property-related services. Our network of professionals ensures that your IP journey is well-guided and successful.          </Typography>
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
          How secure are IP transactions on HumCen.io? 
     </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
          IP transactions on HumCen.io are secured using blockchain technology, which ensures transparency, immutability, and tamper-proof records. This guarantees the integrity of all transactions and protects your valuable IP assets. </Typography>
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
          Can I manage my IP portfolio on HumCen.io?
     </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
          Yes, HumCen.io offers tools for strategic IP portfolio management. You can track the status of your IP assets, monitor their progress, and make informed decisions about their protection and monetization strategies. </Typography>
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
          What is cross-border IP management? 
     </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
          Cross-border IP management refers to the ability to manage intellectual property assets across different countries and jurisdictions. HumCen.io simplifies this process by providing a unified platform for international IP management and transactions.</Typography>
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
          How can HumCen.io help me monetize my IP creations? 
     </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
          HumCen.io provides opportunities for users to monetize their IP assets through licensing, sales, or collaborations. Our platform connects you with potential partners and buyers, facilitating a seamless process to turn your IP into revenue.
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
          Is HumCen.io suitable for startups and small businesses?  
     </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
          Absolutely. HumCen.io is designed to cater to the needs of startups and small businesses as well as larger enterprises. We offer scalable solutions to support IP management at every stage of growth.
</Typography>
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
          What sets HumCen.io apart from other IP management platforms? 
     </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
          HumCen.io stands out with its integration of blockchain technology, which ensures the security and transparency of all IP-related activities. Additionally, our focus on cross-border IP management and expert assistance sets us apart as a comprehensive solution for the global IP community.
</Typography>
        </AccordionDetails>
      </Accordion>
    </>
  );
}

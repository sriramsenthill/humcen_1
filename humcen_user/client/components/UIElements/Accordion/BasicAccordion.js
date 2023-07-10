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

  const handleAccordion1Change = () => {
    setExpanded1(!expanded1);
  };
  const handleAccordion2Change = () => {
    setExpanded2(!expanded2);
  };
  const handleAccordion3Change = () => {
    setExpanded3(!expanded3);
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
          <Typography component="h1" fontWeight="500">
            Diam maecenas ultricies mi eget mauris pharetra et ultrices neque?
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
            malesuada lacus ex, sit amet blandit leo lobortis eget.
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
          <Typography component="h1" fontWeight="500">
            Vitae elementum curabitur vitae nunc. Eget dolor morbi non arcu
            risus quis. Varius duis at consectetur lorem donec?
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Varius duis at consectetur lorem donec massa sapien faucibus?
          </Typography>
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
          <Typography component="h1" fontWeight="500">
            Varius duis at consectetur lorem donec massa sapien faucibus?
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
            malesuada lacus ex, sit amet blandit leo lobortis eget.
          </Typography>
        </AccordionDetails>
      </Accordion>
    </>
  );
}

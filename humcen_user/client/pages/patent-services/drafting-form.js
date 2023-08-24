import React, { useState } from 'react';
import Head from 'next/head';
import {
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

const IndexPage = () => {
  const [draftingOpen, setDraftingOpen] = useState(true);
  const [title, setTitle] = useState('');
  const [domain, setDomain] = useState('');
  const [countriesOpen, setCountriesOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [country, setCountry] = useState(''); // Add country state

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleDomainChange = (event) => {
    setDomain(event.target.value);
  };

  const handleDraftingContinue = () => {
    setDraftingOpen(false);
    setCountriesOpen(true);
  };

  const handleCountriesContinue = () => {
    setCountriesOpen(false);
    setContactOpen(true);
  };

  return (
    <Container maxWidth="md" style={{ marginTop: '2rem' }}>
      <Head>
        <title>Form Example</title>
      </Head>
      <Typography variant="h5" onClick={() => setDraftingOpen(!draftingOpen)} style={{ cursor: 'pointer' }}>
        Drafting
        <ExpandMoreIcon style={{ transform: draftingOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} />
      </Typography>
      {draftingOpen && (
        <div style={{ padding: '1rem 0' }}>
          <TextField
            label="Title"
            variant="outlined"
            fullWidth
            value={title}
            onChange={handleTitleChange}
            style={{ marginBottom: '1rem' }}
          />
          <Select
            label="Domain"
            variant="outlined"
            fullWidth
            value={domain}
            onChange={handleDomainChange}
          >
            <MenuItem value="technology">Technology</MenuItem>
            <MenuItem value="finance">Finance</MenuItem>
            <MenuItem value="healthcare">Healthcare</MenuItem>
          </Select>
          <Button variant="contained" color="primary" onClick={handleDraftingContinue} style={{ marginTop: '1rem' }}>
            Continue
          </Button>
        </div>
      )}
      <Divider style={{ margin: '2rem 0' }} />
      <Typography variant="h5">Countries</Typography>
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
            style={{
              background: country === "India" ? "#68BDFD" : "#F8FCFF",
              color: country === "India" ? "white" : "#BFBFBF",
              width: "13%",
              marginRight: "2%",
              height: "40px",
              textTransform: "none",
            }}
            onClick={() => {
              setCountry("India");
            }}
          >
            <img
              src="https://hatscripts.github.io/circle-flags/flags/in.svg"
              width="24"
            />
            &nbsp;&nbsp;India
          </Button>
          {/* Add other country buttons similarly */}
          <Button variant="contained" color="primary" onClick={handleCountriesContinue} style={{ marginTop: '1rem' }}>
            Continue
          </Button>
        </div>
      )}

      <Divider style={{ margin: '2rem 0' }} />
      <Typography variant="h5">Summary</Typography>
      {contactOpen && (
        <div style={{ padding: '1rem 0' }}>
          {/* Your content for the 'Contact' section */}
        </div>
      )}
    </Container>
  );
};

export default IndexPage;

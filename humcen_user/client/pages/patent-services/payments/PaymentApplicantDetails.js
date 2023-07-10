import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import { styled } from "@mui/system";

import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";

const ColorButton = styled(Button)(({ theme }) => ({
  color: "white",
  width: "80%",
  height: "50px",
  borderRadius: "40px",
  marginTop: "20px",
  marginBottom: "30px",
  background: "#00ACF6",
  "&:hover": {
    background: "#00ACF6",
  },
  textTransform: "none",
  fontSize: "14px",
  fontWeight: "400",
}));

export default function PaymentDetails({ onChangeUpdate }) {
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
  };

  const handleButtonClick = (event) => {
    const newLabel = "panel2";
    onChangeUpdate(newLabel);
  };

  return (
    <>
      <Card
        sx={{
          boxShadow: "none",
          borderRadius: "10px",
          mb: "15px",
          display: "flex",
          flexDirection: "row",
        }}
      >
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            display="inline-flex"
            flexDirection="row"
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControl>
                  <RadioGroup
                    row
                    aria-labelledby="demo-row-radio-buttons-group-label"
                    name="row-radio-buttons-group"
                  >
                    <FormControlLabel
                      value="Natural Person"
                      control={<Radio color="success" />}
                      label="Natural Person"
                      sx={{
                        marginRight: "40px",
                        fontSize: "24",
                      }}
                    />
                    <FormControlLabel
                      value="Entity"
                      control={<Radio color="success" />}
                      label="Entity"
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <ColorButton onClick={handleButtonClick}>Next</ColorButton>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </Card>
    </>
  );
}

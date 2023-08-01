import React, { useState, useEffect } from "react";
import Link from "next/link";
import Grid from "@mui/material/Grid";
import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import styles from "@/components/Authentication/Authentication.module.css";
import { useRouter } from "next/router";
import { Card } from "@mui/material";


const SignUpForm = () => {
  const router = useRouter();
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    first_name: "",
    last_name: "",
    password: ""
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // Redirect to the dashboard if the user is already logged in
      router.push("/");
    }
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/api/customer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        console.log("User data saved successfully");
        router.push("/authentication/sign-in/");
        // Reset the form data
        setFormData({
          email: "",
          first_name: "",
          last_name: "",
          password: ""
        });
      } else {
        console.error("Failed to save user data");
      }
    }  catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          setError("status code 401");
        } else if (error.response.status === 404) {
          setError("status code 404");
        }
      } else {
        console.error("Error:", error);
      }
    }
  };

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    });
  };


  return (
    <>
      <div className="authenticationBox">
      <div className={styles.container}>
          <div className={styles.leftContainer}>
            <div className={styles.topContainer}>
                <div className={styles.cardContainer}>
                  <img
                    src="/images/sign.png"
                    alt="favicon"
                    className={styles.sign}
                  />
                  <Card className={styles.floatingCard} >
                    <h2>Applied patent</h2>
                    <p>200<strong>+ </strong> </p>
                  </Card>
                </div>
              </div>
            <div className={styles.bottomContainer}>
                <Typography as="h1" mb="5px">
                  <img
                    src="/images/logo-white.png"
                    alt="favicon"
                    className={styles.favicon}
                  /> 
                  <Typography className={styles.textt}>
                  Let's Empower your <strong>cross </strong>
                  </Typography>
                  <Typography className={styles.text}>
                    <strong> border patent</strong> seamlessly 
                  </Typography>
                  <Typography className={styles.text2}>
                  Blockchain Driven One Stop IP platform to protect your <br></br>Inventions Globally. 
                  </Typography>                
                </Typography>
            </div>
          </div>
          <div className={styles.rightContainer}>
    
          <Box
          component="main"
          sx={{
            maxWidth: "490px",
            ml: "auto",
            mr: "auto",
            padding: "50px 0 100px",
          }}
        >           
              <Box component="form" noValidate onSubmit={handleSubmit}>
                <Box
                  sx={{
                    background: "#fff",
                    padding: "30px 20px",
                    borderRadius: "10px",
                    mb: "20px",
                  }}
                  className="bg-black"
                >
                  <Grid container alignItems="center" spacing={2}>
                  <h1>Sign Up</h1>
                    <Grid item xs={12}>
                      <Typography
                        component="label"
                        sx={{
                          fontWeight: "500",
                          fontSize: "14px",
                          mb: "10px",
                          display: "block",
                        }}
                      >
                        First Name
                      </Typography>

                      <TextField
                        autoComplete="given-name"
                        name="first_name"
                        required
                        fullWidth
                        id="firstName"
                        label="First Name"
                        autoFocus
                        InputProps={{
                          style: { borderRadius: 8 },
                        }}
                        value={formData.first_name}
                        onChange={handleChange}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <Typography
                        component="label"
                        sx={{
                          fontWeight: "500",
                          fontSize: "14px",
                          mb: "10px",
                          display: "block",
                        }}
                      >
                        Last Name
                      </Typography>

                      <TextField
                        required
                        fullWidth
                        id="lastName"
                        label="Last Name"
                        name="last_name"
                        autoComplete="family-name"
                        InputProps={{
                          style: { borderRadius: 8 },
                        }}
                        value={formData.last_name}
                        onChange={handleChange}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <Typography
                        component="label"
                        sx={{
                          fontWeight: "500",
                          fontSize: "14px",
                          mb: "10px",
                          display: "block",
                        }}
                      >
                        Email
                      </Typography>

                      <TextField
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        InputProps={{
                          style: { borderRadius: 8 },
                        }}
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <Typography
                        component="label"
                        sx={{
                          fontWeight: "500",
                          fontSize: "14px",
                          mb: "10px",
                          display: "block",
                        }}
                      >
                        Password
                      </Typography>

                      <TextField
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="new-password"
                        InputProps={{
                          style: { borderRadius: 8 },
                        }}
                        value={formData.password}
                        onChange={handleChange}
                      />
                    </Grid>
                  </Grid>
                </Box>

                  {error && (
                    <Typography
                      variant="body2"
                      color="error"
                      align="center"
                      sx={{ mb: 2 }}
                    >
                      {error}
                    </Typography>
                  )}

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{
                      mt: "20px",
                      textTransform: "capitalize",
                      borderRadius: "100px", /* Changed to 100px for circular button */
                      fontWeight: "500",
                      fontSize: "16px",
                      marginLeft: "20px",                      padding: "14px 0px 14px 0px", /* Adjust the padding as needed */
                      color: "#fff !important",
                      width: "450px", /* Set the width to 483px */
                      height: "48px", /* Set the height to 48px */
                      background: "linear-gradient(270deg, #02E1B9 0%, #00ACF6 100%)",
                    }}
                  >
                    Sign up
                  </Button>
                  <Typography fontSize="15px" mb="30px" mt="15px" ml="30px">
                Already have an account?{" "}
                <Link
                  href="/authentication/sign-in/"
                  className="primaryColor text-decoration-none"
                >
                  Log In
                </Link>
              </Typography>
                <Typography fontSize="12px" mt="20%" textAlign="center" color="#676B5F">
                  2023 Copyrights. All Rights Reserved
                </Typography>
                </Box>
              </Box>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUpForm;

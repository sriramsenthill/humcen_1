import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import BasicTabs from "./Tabs";
import withAuth from "@/components/withAuth";

const Settings=() => {
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get("email"),
      password: data.get("password"),
    });
  };

  return (
    <>
    <div className={'card'}>
      <Card
        sx={{
          boxShadow: "none",
          borderRadius: "10px",
          mb: "15px",
          display: "flex",
          p: "12px 12px",
          flexDirection: "column",
          background: "white",
        }}
      >
        <Typography
          sx={{
            fontSize: "40px",
            marginBottom: "0px",
            paddingBottom: "0px" ,
            textAlign: "left",
            color: "#3c3c3c",
            fontWeight: "bold" ,
            paddingLeft: "10px" ,
            paddingTop: "20px" 
          }}
        >
          Settings
        </Typography>

        <BasicTabs />
      </Card>
      </div>
    </>
  );
}

export default withAuth(Settings);

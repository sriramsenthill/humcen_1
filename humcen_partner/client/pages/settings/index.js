import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import BasicTabs from "./Tabs";
import withAuth from "@/components/withAuth";
import styles from "@/styles/PageTitle.module.css"
import Link from "next/link";

function Settings() {
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
      <div className={styles.pageTitle}>
          <ul>
            <li>
              <Link href="/">Dashboard</Link>
            </li>
            <li>Settings</li>
          </ul>
        </div>
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
      <h1 className={styles.heading} style={{
        marginTop: "14px" ,
        marginLeft: "16px"
      }}>Settings</h1>

        <BasicTabs />
      </Card>
      </div>
    </>
  );
}

export default withAuth(Settings);

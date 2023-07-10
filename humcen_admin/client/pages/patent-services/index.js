import React from "react";
import Link from "next/link";
import styles from "@/styles/PageTitle.module.css";
import Grid from "@mui/material/Grid";
import Cards from "@/components/UIElements/Cards/Media";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import AddCircleOutlineIconTwoTone from "@mui/icons-material/AddCircleOutlineTwoTone";
import withAuth from "@/components/withAuth";

const serviceList = [
  {
    image: "/images/patent_consult.png",
    title: "Patent Consultation",
    desc: "Maximize the value of your invention with expert Patent Consultation from Us",
  },
  {
    image: "/images/patent_drafting.png",
    title: "Patent Drafting",
    desc: "Transform your ideas into strong patents with our expert Patent Drafting service",
  },
  {
    image: "/images/patent_filing.png",
    title: "Patent Filing",
    desc: "Secure your innovative ideas with our hassle-free patent filing service. Let us handle the complexities of the patent application process",
  },
  {
    image: "/images/patent_search.png",
    title: "Patent Search",
    desc: "Uncover the potential of your invention with our in-depth Patent Search service.",
  },
];
const FileManager = () => {
  return (
    <>
      {/* Page title */}
      <div className={styles.pageTitle}>
        <h1>My Patent Services</h1>
        <ul>
          <li>
            <Link href="/">Dashboard</Link>
          </li>
          <li>My Patent Services</li>
        </ul>
      </div>

      <Grid
        container
        rowSpacing={1}
        columnSpacing={{ xs: 1, sm: 1, md: 1, lg: 1, xl: 2 }}
      >
        <Grid item xs={12} sm={6} md={6} lg={4} xl={3}>
          <Card
            sx={{ mb: "15px", height: "100%", background: "#F8FCFF" }}
            style={{
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CardContent
              style={{
                justifyContent: "center",
                alignContent: "center",
                textAlign: "center",
              }}
            >
              <AddCircleOutlineIconTwoTone
                sx={{ fontSize: 50, fontWeight: 200, color: "#00ACF6" }}
              />
              <Typography
                sx={{
                  fontSize: "16px",
                  marginLeft: "40px",
                  marginRight: "40px",
                }}
              >
                Add New Patent Service
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {serviceList.map(Cards)}
      </Grid>
    </>
  );
}

export default withAuth(FileManager)
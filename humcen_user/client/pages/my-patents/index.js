import React from "react";
import styles from "@/styles/PageTitle.module.css";
import RecentOrders from "@/components/Dashboard/eCommerce/RecentOrders";
import SearchForm from "@/components/_App/TopNavbar/SearchForm";
import withAuth from "@/components/withAuth";
import { Card } from "@mui/material";

const Inbox = () => {
  return (
    <>
      {/* Page title */}
      <div className={styles.pageTitle} style={{
          justifyContent: "space-between",
          paddingBottom: "20px" ,
          // marginLeft: "1%",
      }}>
        <h1>My Patents</h1>
        <SearchForm colorCom={"white"} />
      </div>
      <Card sx={{
}} >   
        <RecentOrders sx={{
}}></RecentOrders>
      </Card>
    </>
  );
}

export default withAuth(Inbox);

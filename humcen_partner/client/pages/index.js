import React from "react";
import {useState, useEffect} from "react";
import Grid from "@mui/material/Grid";
import Link from "next/link";
import styles from "@/styles/PageTitle.module.css";
import Performance from "@/components/Dashboard/eCommerce/Performance";
import RecentOrders from "@/components/Dashboard/eCommerce/RecentOrders";
import NewOrder from "@/components/index_comp/new_orders";
import withAuth from "@/components/withAuth";
import NewCustomers from "@/components/Dashboard/eCommerce/NewCustomers";
import axios from "axios";

function eCommerce() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [partnerName, setPartnerName] = useState("");
  const open = Boolean(anchorEl);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get("http://localhost:3000/api/partner/name", {
          headers: {
            Authorization: token,
          },
        })
        .then((response) => {
          const  partnerNameData  = response.data;
          setPartnerName(partnerNameData);
        })
        .catch((error) => {
          console.error("Error fetching partner name:", error);
        });
    }
  }, []);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <>
    <div className={'card'}>
      {/* Page title */}
      <div className={styles.pageTitle}>
        <h1>Welcome Back, {partnerName}!</h1>
        <ul>
          <li>
            <Link href="/">Dashboard</Link>
          </li>
          <li>home</li>
        </ul>
      </div>
      <NewOrder />
      <RecentOrders />
      <Grid
        container
        rowSpacing={1}
        columnSpacing={{ xs: 1, sm: 2, md: 2 }}
        margin={2}
      >
        <Grid item xs={12} md={8}>
          {/* RevenuStatus */}
          <Performance />
        </Grid>
        <Grid item xs={12} md={4}>
          <NewCustomers />
        </Grid>
      </Grid>
      </div>
    </>
  );
}

export default withAuth(eCommerce);

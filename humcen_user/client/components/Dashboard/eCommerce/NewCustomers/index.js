import React from "react";
import { Box, Typography } from "@mui/material";
import Card from "@mui/material/Card";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import styles from "@/components/Dashboard/eCommerce/NewCustomers/NewCustomers.module.css";
import Rating from "@mui/material/Rating";
import styled from "@emotion/styled";

const NewCustomersData = [
  {
    id: "1",
    image: "/images/user2.png",
    name: "Jordan Stevenson",
    userName: "@jstevenson5c",
    price: "$289.50",
    order: "15 Orders",
  },
];

const StyledRating = styled(Rating)({
  "& .MuiRating-iconFilled": {
    color: "#68BDFD",
    fontSize: "10",
  },
});

const NewCustomers = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Box>
        {NewCustomersData.slice(0, 4).map((customer) => (
          <div className={styles.newCustomerList} key={customer.id}>
            <div className={styles.leftContent}>
              <img src={customer.image} alt="user" />
              <div>
                <p
                  style={{
                    fontFamily: "Inter",
                    fontStyle: "normal",
                    fontWeight: "500",
                    fontSize: "14px",
                    lineHeight: "130%",
                    color: "#828282",
                  }}
                >
                  {customer.name}
                </p>
                <StyledRating name="read-only" value="2.5" readOnly />
              </div>
            </div>
          </div>
        ))}
      </Box>
    </>
  );
};

export default NewCustomers;

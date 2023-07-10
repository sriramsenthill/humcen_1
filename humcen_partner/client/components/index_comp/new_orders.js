import React from "react";
import styles from "@/styles/Patents.module.css";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import { styled } from "@mui/system";

const ColorButton = styled(Button)(({ theme }) => ({
  color: "white",
  width: "120%",
  height: "60px",
  borderRadius: "100px",
  marginBottom: "30px",
  background: "linear-gradient(270deg, #02E1B9 0%, #00ACF6 100%)",
  "&:hover": {
    background: "linear-gradient(270deg, #02E1B9 0%, #00ACF6 100%)",
  },
  textTransform: "none",
  fontSize: "14px",
  fontWeight: "400",
}));

const NewOrder = () => {
  return (
    <>
      <Card
        sx={{
          boxShadow: "none",
          borderRadius: "10px",
          border: "1px solid #E0E0E0",
          p: "0.2% 1.5% 1.5% 1.5%",
          mb: "15px",
          width: "100%",
        }}
      >
        <h3>New Order Requests</h3>
        <Grid>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
            }}
          >
            <tbody>
              <tr>
                <td className={styles.label} style={{ padding: "5px" }}>
                  Job No
                </td>
                <td className={styles.label} style={{ padding: "5px" }}>
                  Patent Type
                </td>
                <td className={styles.label} style={{ padding: "5px" }}>
                  Location
                </td>
                <td className={styles.label} style={{ padding: "5px" }}>
                  Budget
                </td>
                <td className={styles.label} style={{ padding: "5px" }}>
                  Expected Delivery
                </td>
                <td
                  className={styles.label}
                  style={{ padding: "2px" }}
                  rowSpan={2}
                >
                  <Button
                    sx={{
                      background: "#E0E0E0",
                      color: "white",
                      borderRadius: "100px",
                      width: "100%",
                      height: "90%",
                      textTransform: "none",
                    }}
                  >
                    Reject
                  </Button>
                </td>
                <td
                  className={styles.label}
                  style={{ padding: "2px" }}
                  rowSpan={2}
                >
                  <Button
                    sx={{
                      background: "#27AE60",
                      color: "white",
                      borderRadius: "100px",
                      width: "100%",
                      height: "90%",
                      textTransform: "none",
                    }}
                  >
                    Accept
                  </Button>
                </td>
              </tr>
              <tr>
                <td style={{ padding: "5px" }}>1001</td>
                <td style={{ padding: "5px" }}>Patent Drafting</td>
                <td style={{ padding: "5px" }}>United Kingdom</td>
                <td style={{ padding: "5px" }}>300000</td>
                <td style={{ padding: "5px" }}>12 Apr 2023</td>
              </tr>
            </tbody>
          </table>
        </Grid>
      </Card>
      ;
    </>
  );
};

export default NewOrder;

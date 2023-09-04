import { useState } from "react";
import { useEffect } from "react";
import {Grid, Item} from "@mui/material";
import Card from "@mui/material/Card";
import { Box, Typography } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";


const BulkOrderAssignPage = ({detailsList}) => {
  const [realDetails, setDetails] = useState([]);

  return (
    <>

    {console.log(detailsList)}
      <Card
        sx={{
          boxShadow: "none",
          borderRadius: "10px",
          p: "25px",
          mb: "15px",
        }}
      >
    <div style={{
        textAlign: "center",
    }}>
         <Typography sx={{
                    borderBottom: "1px solid #F7FAFF",
                    fontSize: "25px",
                    textAlign: "center",
                    fontWeight: "bold",
                    paddingBottom: "2rem",
         }}>Assign Bulk Orders</Typography>
    </div>

    {
  detailsList.map((detail, index) => (
    <Grid container>
      <Grid item sm={2} md={3} lg={6} xl={6}>
      <Typography sx={{
                    borderBottom: "1px solid #F7FAFF",
                    fontSize: "18px",
                    textAlign: "center",
                    fontWeight: "bold",
                    paddingBottom: "20px",
                  }}>{detail.title}</Typography>
      </Grid>
      <Grid item sm={10} md={9} lg={6} xl={6}>
      <Typography sx={{
                    borderBottom: "1px solid #F7FAFF",
                    textAlign: "center",
                    fontSize: "15px",
                    paddingBottom: "20px",
                  }} >{detail.text}</Typography>
      </Grid>
    </Grid>
  ))
}
      </Card>
    </>
  );
};

export default BulkOrderAssignPage;

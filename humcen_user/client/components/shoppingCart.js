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


const ShoppingCart = ({priceList, detailsList, service, total}) => {
  const [realDetails, setDetails] = useState([]);

  return (
    <>
        {console.log(priceList)}
      <Card
        sx={{
          boxShadow: "none",
          borderRadius: "10px",
          p: "25px",
          mb: "15px",
        }}
      >
      <Typography
          as="h3"
          sx={{
            fontSize: 18,
            fontWeight: "bold",
            textAlign: "center",
            mb: "25px",
          }}
        >
          {service}
        </Typography>


    {
  detailsList.map((detail, index) => (
    <Grid container>
      <Grid item sm={2} md={3} lg={6} xl={6}>
      <Typography sx={{
                    borderBottom: "1px solid #F7FAFF",
                    fontSize: "18px",
                    textAlign: "left",
                    fontWeight: "bold",
                    paddingBottom: "15px",
                  }}>{detail.title}</Typography>
      </Grid>
      <Grid item sm={10} md={9} lg={6} xl={6}>
      <Typography sx={{
                    borderBottom: "1px solid #F7FAFF",
                    textAlign: "right",
                    fontSize: "15px",
                    paddingBottom: "15px",
                  }} >{detail.text}</Typography>
      </Grid>
    </Grid>
  ))
}
<Typography
          as="h3"
          sx={{
            fontSize: 18,
            fontWeight: 500,
            mt: "25px",
            mb: "10px",
          }}
        >
          Bill
        </Typography>

        <TableContainer
          component={Paper}
          sx={{
            boxShadow: "none",
          }}
        >
          <Table aria-label="simple table" className="dark-table">
            <TableHead sx={{ background: "#F7FAFF" }}>
              <TableRow>
                <TableCell
                  sx={{
                    borderBottom: "1px solid #F7FAFF",
                    fontSize: "13px",
                  }}
                >
                  Country
                </TableCell>

                <TableCell
                  align="right"
                  sx={{
                    borderBottom: "1px solid #F7FAFF",
                    fontSize: "13px",
                  }}
                >
                  Cost
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>

            {
  priceList.map((price, index) => (
    <TableRow
      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
      key={index}
    >
      <TableCell
        sx={{
          borderBottom: "1px solid #F7FAFF",
          fontSize: "12px",
          padding: "8px 10px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <Typography
            sx={{
              fontWeight: "500",
              fontSize: "12px",
            }}
            className='ml-10px'
          >
            {price.country}
          </Typography>
        </Box>
      </TableCell>

      <TableCell
        align="right"
        sx={{
          borderBottom: "1px solid #F7FAFF",
          fontSize: "12px",
          padding: "8px 10px",
        }}
      >
        &#36;{price.cost}.00
      </TableCell>
    </TableRow>
  ))
}



              <TableRow
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell
                  sx={{
                    borderBottom: "1px solid #F7FAFF",
                    fontSize: "13px",
                    padding: "8px 10px",
                    fontWeight: "500",
                    color: "#000",
                  }}
                >
                  Total (USD) :
                </TableCell>

                <TableCell
                  align="right"
                  sx={{
                    borderBottom: "1px solid #F7FAFF",
                    fontSize: "13px",
                    padding: "8px 10px",
                    fontWeight: "500",
                    color: "#000",
                  }}
                >
                  &#36;{total}.00
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </>
  );
};

export default ShoppingCart;

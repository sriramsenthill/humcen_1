import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import { styled } from "@mui/material";

const CardImg = styled(CardMedia)`
  & .MuiCardMedia-img {
    border-radius: 100px;
  }
`;

const ImageContainer = styled("div")`
  border-radius: 40px;
  overflow: hidden;
`;

export default function Media(service) {
  return (
    <Grid item xs={12} sm={6} md={6} lg={4} xl={3}>
      <Card
        sx={{ mb: "15px", borderRadius: "10px" }}
        style={{
          width: "100%",
          backgroundColor: "white",
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
          height: "92%",
          paddingBottom: "20px",
        }}
      >
        <ImageContainer>
          <CardImg
            component="img"
            image={service.image}
            alt={service.title}
            sx={{
              marginTop: "18px",
            }}
          />
        </ImageContainer>

        <CardContent>
          <Typography
            gutterBottom
            variant="h6"
            component="div"
            sx={{
              fontWeight: "bold",
            }}
          >
            {service.title}
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            style={{ hyphens: "auto" }}
          >
            {service.desc.length > 90
              ? `${service.desc.substring(0, 90)}...`
              : service.desc}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  );
}

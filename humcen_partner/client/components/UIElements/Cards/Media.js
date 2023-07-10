import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Switch from "@mui/material/Switch";
import { styled } from "@mui/material/styles";
import FormControlLabel from "@mui/material/FormControlLabel";

const IOSSwitch = styled((props) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 38,
  height: 20,
  padding: 0,
  "& .MuiSwitch-switchBase": {
    padding: 0,
    margin: 2,
    transitionDuration: "300ms",
    "&.Mui-checked": {
      transform: "translateX(16px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        backgroundColor: theme.palette.mode === "dark" ? "#2ECA45" : "#65C466",
        opacity: 1,
        border: 0,
      },
      "&.Mui-disabled + .MuiSwitch-track": {
        opacity: 0.5,
      },
    },
    "&.Mui-focusVisible .MuiSwitch-thumb": {
      color: "#33cf4d",
      border: "6px solid #fff",
    },
    "&.Mui-disabled .MuiSwitch-thumb": {
      color:
        theme.palette.mode === "light"
          ? theme.palette.grey[100]
          : theme.palette.grey[600],
    },
    "&.Mui-disabled + .MuiSwitch-track": {
      opacity: theme.palette.mode === "light" ? 0.7 : 0.3,
    },
  },
  "& .MuiSwitch-thumb": {
    boxSizing: "border-box",
    width: 18,
    height: 17,
  },
  "& .MuiSwitch-track": {
    borderRadius: 26 / 2,
    backgroundColor: theme.palette.mode === "light" ? "#F14242" : "#27AE60",
    opacity: 1,
    transition: theme.transitions.create(["background-color"], {
      duration: 500,
    }),
  },
}));

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
        <FormControlLabel
          style={{ marginLeft: 10, position: "relative", float: "right" }}
          control={<IOSSwitch sx={{ m: 1 }} defaultChecked />}
        />
        <CardContent>
          <Typography gutterBottom variant="h6" component="div">
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

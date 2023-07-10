import React from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import StarIcon from "@mui/icons-material/Star";
import Button from "@mui/material/Button";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import styles from "@/components/eCommerce/ProductDetails/ProductDetailsContent.module.css";
import ProductDescription from "./ProductDescription";
import ProductReviews from "./ProductReviews";

const ProductDetailsContent = () => {
  return (
    <>
      <Card
        sx={{
          boxShadow: "none",
          borderRadius: "10px",
          p: "25px",
          mb: "15px",
        }}
      >
        <Grid
          container
          rowSpacing={2}
          alignItems="center"
          columnSpacing={{ xs: 1, sm: 1, md: 1, lg: 3, xl: 4 }}
        >
          <Grid item xs={12} md={12} lg={5} xl={5}>
            <Swiper
              navigation={true}
              modules={[Navigation]}
              className="product-img-slider"
            >
              <SwiperSlide>
                <img src="/images/certificate-image.jpg" alt="product" />
              </SwiperSlide>
              <SwiperSlide>
                <img src="/images/car-part.jpg" alt="product" />
              </SwiperSlide>

              <SwiperSlide>
                <img src="/images/patent-pic-1.png" alt="product" />
              </SwiperSlide>
            </Swiper>
          </Grid>

          <Grid item xs={12} md={12} lg={7} xl={7}>
            <Box>
              <Typography as="h4" fontWeight="500" fontSize="18px" mb="10px">
                Product Information Provision System
              </Typography>

              <Typography fontSize="15px" fontWeight="500" mb="15px">
                Price:{" "}
            
                $150
              </Typography>

              <Typography fontSize="14px" mb="15px">
                A product information providing system 10 is a product
                information providing system in which a product information
                providing device which provides product information and a
                product information outputting device which receives the product
                information from the product information providing device to
                output are connected to each other through a communication line.
              </Typography>

              <ul className={styles.metaTagList}>
                <li>
                  <span>Category :</span> Technology, Software
                </li>
              </ul>

              <ul className={styles.socialLink}>
                <li>
                  <span>Share :</span>
                </li>
                <li>
                  <a
                    href="https://www.facebook.com/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <i className="ri-facebook-line"></i>
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.twitter.com/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <i className="ri-twitter-line"></i>
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.instagram.com/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <i className="ri-instagram-line"></i>
                  </a>
                </li>
              </ul>
            </Box>
          </Grid>
        </Grid>

        <Box mt={2}>
          <Tabs className="product-details-tabs">
            <TabList>
              <Tab>Description</Tab>
              <Tab>Specifications</Tab>
            </TabList>

            <TabPanel>
              {/* ProductDescription */}
              <ProductDescription />
            </TabPanel>

            <TabPanel>
              {/* ProductReviews */}
              <ProductReviews />
            </TabPanel>
          </Tabs>
        </Box>
      </Card>
    </>
  );
};

export default ProductDetailsContent;

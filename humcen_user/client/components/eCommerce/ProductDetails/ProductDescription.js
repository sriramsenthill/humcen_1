import React from "react";

const ProductDescription = () => {
  return (
    <>
      <div className="product-description">
        <h3>European Patent Office Publication Number 2908281</h3>
        <h3>Abstract: </h3>

        <p style={{textAlign: "justify"}}>
          To provide product information to a user. A product information
          providing system 10 is a product information providing system in which
          a product information providing device whichprovides product
          information and a product information outputting device which receives
          the product information from the product information providing device
          to output are connected to each other through a communication line,
          wherein the product information outputting device includes product
          specifying image obtaining means for photographing a subject for
          specifying a product to obtain a product specifying image based on an
          instruction by a user, product information requesting means for
          transmitting the product specifying image obtained by the product
          specifying image obtaining means to the product information providing
          device to request product information of a product specified based on
          the product specifying image, product information receiving means for
          receiving the product information from the product information
          providing device, product information presenting means for outputting
          the product information received by the product information receiving
          means to present to the user, question data obtaining means for
          obtaining question data from the user about the product information
          output by the product information presenting means, answer requesting
          means for transmitting the question data obtained by the question data
          obtaining means to the product information providing device to request
          an answer to a question, answer receiving means for receiving answer
          data to the question from the product information providing device,
          and answer data outputting means for outputting the answer data
          received by the answer receiving means, and the product information
          providing device includes product specifying image receiving means for
          receiving the product specifying image from the product information
          outputting device, product specifying means for performing image
          processing of the product specifying image received by the product
          specifying image receiving means to specify the product whose product
          information the user wants to obtain.
        </p>
      </div>
    </>
  );
};

export default ProductDescription;

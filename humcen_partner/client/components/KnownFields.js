import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import ServiceList from "../pages/my-patent-services/ServiceListArray";

const knownFields = ServiceList.map((element) => element.title);

const KnownFieldsGrid = ({ onChange }) => {
  const checkboxesPerRow = 2;
  const [selectedCheckboxes, setSelectedCheckboxes] = useState([]);

  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;

    if (checked) {
      setSelectedCheckboxes((prevSelected) => [...prevSelected, value]);
    } else {
      setSelectedCheckboxes((prevSelected) =>
        prevSelected.filter((checkbox) => checkbox !== value)
      );
    }
  };

  React.useEffect(() => {
    onChange(selectedCheckboxes);
  }, [selectedCheckboxes, onChange]);

  const renderCheckboxes = () => {
    const rows = [];
    const totalCheckboxes = knownFields.length;

    for (let i = 0; i < totalCheckboxes; i += checkboxesPerRow) {
      const rowCheckboxes = knownFields
        .slice(i, i + checkboxesPerRow)
        .map((field) => (
          <Grid item xs={6} key={field}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedCheckboxes.includes(field)}
                  value={field}
                  onChange={handleCheckboxChange}
                />
              }
              label={field}
            />
          </Grid>
        ));

      rows.push(
        <Grid container spacing={2} key={i}>
          {rowCheckboxes}
        </Grid>
      );
    }

    return rows;
  };

  return <>{renderCheckboxes()}</>;
};

export default KnownFieldsGrid;

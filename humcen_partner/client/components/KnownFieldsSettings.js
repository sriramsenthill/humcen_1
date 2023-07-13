import React, { useState, useEffect } from "react";
import axios from "axios";
import Grid from "@mui/material/Grid";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import ServiceList from "../pages/my-patent-services/ServiceListArray";

const knownFields = ServiceList.map((element) => element.title);

const KnownFieldsGrid = ({ onChange, size, edit }) => {
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get("http://localhost:3000/api/partner/fields", {
          headers: {
            Authorization: token,
          },
        })
        .then((response) => {
          const fields = response.data.known_fields;
          console.log(fields);
        })
        .catch((error) => {
          console.error("Error fetching profile Settings:", error);
        });
    }
  }, []);

  const checkboxesPerRow = 2;
  const [selectedCheckboxes, setSelectedCheckboxes] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get("http://localhost:3000/api/partner/fields", {
          headers: {
            Authorization: token,
          },
        })
        .then((response) => {
          const fields = response.data;
          const servicee = [];
          Object.keys(fields).forEach((field) => {
            if (fields[field] === true) {
              servicee.push(field);
            }
          });
          const filteredServices = knownFields.filter((service) =>
            servicee.includes(service)
          );
          setSelectedCheckboxes(filteredServices);
        })
        .catch((error) => {
          console.error("Error fetching profile Settings:", error);
        });
    }
  }, []);

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

  useEffect(() => {
    onChange(selectedCheckboxes);
  }, [selectedCheckboxes, onChange]);

  const renderCheckboxes = () => {
    const rows = [];
    const totalCheckboxes = knownFields.length;

    for (let i = 0; i < totalCheckboxes; i += checkboxesPerRow) {
      const rowCheckboxes = knownFields
        .slice(i, i + checkboxesPerRow)
        .map((field) => (
          <Grid item xs={size} key={field}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedCheckboxes.includes(field)}
                  onChange={handleCheckboxChange}
                  disabled={edit}
                  value={field}
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

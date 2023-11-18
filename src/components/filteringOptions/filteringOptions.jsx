import React from "react";
import Grid from "@mui/material/Grid";
import { ExpandMore } from "@mui/icons-material";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";

import CustomCheckBox from "../formInputs/customCheckBox";

const FilteringOptions = React.memo(({ filterOptions, isSuccess }) => {
  // console.log("rerendered");
  return (
    <Grid container spacing={1}>
      {isSuccess ? (
        <>
          <Grid item xs={6}>
            {Object.entries(filterOptions.data)
              .slice(
                0,
                Math.ceil(Object.entries(filterOptions.data).length / 2),
              )
              .map((option) => {
                return (
                  <Accordion
                    defaultExpanded
                    key={option[1].title}
                    sx={{ width: "100%" }}
                  >
                    <AccordionSummary expandIcon={<ExpandMore />}>
                      {option[1].title}
                    </AccordionSummary>
                    <AccordionDetails>
                      <Grid container spacing={1}>
                        {option[1].value.map((element) => {
                          return (
                            <Grid xs={6} sm={3} item key={element.id}>
                              <CustomCheckBox
                                id={`${element.id}`}
                                name={`${option[0]}-${element.id}`}
                                label={element.description}
                              />
                            </Grid>
                          );
                        })}
                      </Grid>
                    </AccordionDetails>
                  </Accordion>
                );
              })}
          </Grid>
          <Grid item xs={6}>
            {Object.entries(filterOptions.data)
              .slice(Math.ceil(Object.entries(filterOptions.data).length / 2))
              .map((option) => {
                return (
                  <Accordion
                    defaultExpanded
                    key={option[1].title}
                    sx={{ width: "100%" }}
                  >
                    <AccordionSummary expandIcon={<ExpandMore />}>
                      {option[1].title}
                    </AccordionSummary>
                    <AccordionDetails>
                      <Grid container spacing={1}>
                        {option[1].value.map((element) => {
                          return (
                            <Grid xs={6} sm={3} item key={element.id}>
                              <CustomCheckBox
                                id={`${element.id}`}
                                name={`${option[0]}-${element.id}`}
                                label={element.description}
                              />
                            </Grid>
                          );
                        })}
                      </Grid>
                    </AccordionDetails>
                  </Accordion>
                );
              })}
          </Grid>
        </>
      ) : (
        <div>عدم امکان برقرای ارتباط با سرور و یا دیتابیس</div>
      )}
    </Grid>
  );
});
export default FilteringOptions;

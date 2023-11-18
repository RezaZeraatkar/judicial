import React from "react";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import RegisterForm from "../forms/registerForms/registerForm";
import RegisterEditForm from "../forms/registerForms/registerEditForm";
import { useUserContext } from "../hocs/UserProvider";

const Register = () => {
  const { user } = useUserContext();
  return (
    <Container
      maxWidth={false}
      sx={{ height: "100vh", backgroundColor: { xs: "#f4f4f4" } }}
    >
      <Grid
        container
        spacing={2}
        justifyContent="center"
        sx={{ width: "100%", height: "100%" }}
      >
        {user?.isAdmin ? (
          <Grid
            item
            sx={{
              marginTop: "30px",
              marginBottom: "30px",
              maxWidth: "25rem",
              width: "100%",
            }}
          >
            <Paper>
              <Grid
                container
                sx={{
                  paddingTop: "30px",
                  paddingBottom: "30px",
                }}
              >
                <Grid
                  item
                  container
                  justifyContent="space-between"
                  rowSpacing={2}
                  sx={{
                    maxWidth: { sm: "22rem" },
                    marginInline: "auto",
                  }}
                >
                  <Grid item xs={12}>
                    <RegisterForm />
                  </Grid>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        ) : null}
        <Grid
          item
          sx={{
            marginTop: "30px",
            marginBottom: "30px",
            maxWidth: "25rem",
            width: "100%",
          }}
        >
          <Paper>
            <Grid
              container
              sx={{
                paddingTop: "30px",
                paddingBottom: "30px",
              }}
            >
              <Grid
                item
                container
                justifyContent="space-between"
                rowSpacing={2}
                sx={{
                  maxWidth: { sm: "22rem" },
                  marginInline: "auto",
                }}
              >
                <Grid item xs={12}>
                  <RegisterEditForm />
                </Grid>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Register;

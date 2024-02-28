import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";

// material-ui
import { useTheme } from "@mui/material/styles";
import { Divider, Grid, Stack, Typography, useMediaQuery } from "@mui/material";

// project imports
import AuthCardWrapper from "../ui-components/AuthCardWrapper";
import AuthLogin from "../ui-components/AuthLogin";
import Logo from "../assets/avrij.png";
import axios from "axios";
import { API } from "../components/api";

const CustomTypography = ({ variant, children }) => {
  const typographyStyles = {
    h3: {
      fontSize: "1.25rem",
      fontWeight: 600,
      color: "#256a83",
      // color: "#2ca58d",
    },
    h2: {
      fontSize: "1.5rem",
      fontWeight: 700,
      fontFamily: "Roboto, sans-serif",
      lineHeight: 1.2,
      color: "#256a83",
    },
    caption: {
      fontFamily: "Roboto, sans-serif",
      lineHeight: 1.66,
      fontSize: "16px",
      fontWeight: 400,
      color: "#697586",
    },
  };

  return (
    <Typography variant={variant} sx={typographyStyles[variant]}>
      {children}
    </Typography>
  );
};

const Login = () => {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    const originalBodyBg = document.body.style.backgroundColor;
    window.document.body.style.backgroundColor = "#eef2f6";

    return () => {
      document.body.style.backgroundColor = originalBodyBg;
    };
  }, []);

  return (
    <div style={{ minHeight: "100vh" }}>
      <Grid
        container
        direction="column"
        justifyContent="flex-end"
        sx={{ minHeight: "100vh" }}
      >
        <Grid item xs={12}>
          <Grid
            container
            justifyContent="center"
            alignItems="center"
            sx={{ minHeight: "calc(100vh - 68px)" }}
          >
            <Grid item sx={{ m: { xs: 1, sm: 3 }, mb: 0 }}>
              <AuthCardWrapper>
                <Grid
                  container
                  spacing={2}
                  alignItems="center"
                  justifyContent="center"
                >
                  <Grid
                    item
                    sx={{ mb: 3 }}
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <a
                      href="https://www.avrij.com/"
                      target="_blank"
                      aria-label="theme-logo"
                    >
                      <img src={Logo} height="32" />
                    </a>
                  </Grid>
                  <Grid item xs={12}>
                    <Grid
                      container
                      direction={matchDownSM ? "column-reverse" : "row"}
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Grid item>
                        <Stack
                          alignItems="center"
                          justifyContent="center"
                          spacing={1}
                          textAlign="center"
                        >
                          <CustomTypography
                            color={theme.palette.secondary.main}
                            gutterBottom
                            variant={matchDownSM ? "h3" : "h2"}
                          >
                            MVProspect Mindset Insights
                          </CustomTypography>
                          <CustomTypography
                            variant="caption"
                            fontSize="16px"
                            textAlign={matchDownSM ? "center" : "inherit"}
                          >
                            Enter your information to continue
                          </CustomTypography>
                        </Stack>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12}>
                    <AuthLogin />
                  </Grid>
                </Grid>
              </AuthCardWrapper>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} sx={{ m: 3, mt: 1 }}>
          <></>
        </Grid>
      </Grid>
    </div>
  );
};

export default Login;

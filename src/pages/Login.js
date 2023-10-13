import React, { useState } from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { API } from "../components/api";
import axios from "axios";

import Logo from "../assets/logo-white.png";
import { makeStyles, styled } from "@mui/styles";

const theme = createTheme({
  typography: {
    fontFamily: "Roboto",
  },
});

const CustomTextField = styled(TextField)({
  width: '330px', // width of the TextField
  '& .MuiFormHelperText-root': {
    color: '#FAFAFA', // Change the color of the helper text
    fontSize: '13px', // Set the font size
    // fontStyle: 'italic', // Set the font style
    // Add any other styles you want for the helper text here
  },  
  '& .MuiInput-root': { // Target the root of the standard input
    border: 'none', // remove the border
    paddingLeft: "5px",
    paddingTop: "5px",
    paddingRight: "10px",
    backgroundColor: 'rgba(134, 134, 134, 0.54)',
  },
  '& .MuiInput-underline:before': { // Target the underline before focused
    borderBottom: 'none', // remove the underline
  },
  '& .MuiInput-underline:after': { // Target the underline after focused
    borderBottom: 'none', // remove the underline
  },
  '& .MuiInput-underline:hover:before': { // Target the underline on hover
    borderBottom: 'none', // remove the underline
  },
  '& .MuiInput-input': {
    color: '#FFFFFF', // change input text color
    fontSize: '16px',
    lineHeight: '21px',
    fontFamily: 'Roboto',
    fontWeight: 'normal',
  },
});

const useStyles = makeStyles({
});

export default function LogIn() {
  const classes = useStyles();
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setLoading(true)
    axios
      .post(`${API}/token/`, { username: username, password })
      .then(function (response) {
        // handle success
        localStorage.setItem("authTokens", JSON.stringify(response.data));
        window.location.href = window.location.href;
      })
      .catch(function (error) {
        // handle error
        setLoading(false);
      })
      .finally(() => {});
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        style={{ backgroundColor: `#171717`, backgroundSize: "cover", height: "100vh" }}
      >
      <Container
        component="main"
        maxWidth="xs"
        sx={{ pt: 20 }}
        className={classes.mainContainer}
      >
        <CssBaseline />
        <Box
          sx={{
            textAlign: "center",
          }}
        >
          <Box
            component="img"
            sx={{
              width: 225,
              mt: "5%",
              mb: 3,
            }}
            alt="Avrij logo"
            src={Logo}
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography
            style={{
              font: "normal normal bold 28px/37px Roboto",
              width: "100%",
              color: "#FAFAFA",
              textAlign: "center",
            }}
          >
            On-Demand Prospect Insights<br />
            for Major League Sports
          </Typography>

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 5 }}
            style={{
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
              justifyContent: "center",
              position: "relative",
            }}
          >
            <CustomTextField
              margin="normal"
              required
              InputLabelProps={{ required: false,
                shrink: false,
                style: {
                  fontSize: '16px',
                  lineHeight: '21px',
                  fontStyle: 'italic',
                  color: '#FAFAFA',
                }
              }}
              helperText="Username"
              variant="standard"
              fullWidth
              name="username"
              // label={username ? "" : "Username"}
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoFocus
              autoComplete="username"         
            />

            <CustomTextField
              margin="normal"
              required
              InputLabelProps={{ required: false,
                shrink: false,
                style: {
                  fontSize: '16px',
                  lineHeight: '21px',
                  fontStyle: 'italic',
                  color: '#FAFAFA',
                }
              }}              
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              helperText="Password"
              variant="standard"
              fullWidth
              id="password"
              // label={password ? "" : "Password"}
              name="password"
              autoComplete="current-password"
              style={{ font: "normal normal medium 16px/27px Roboto" }}
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Box style={{position: "absolute", bottom: -80, width: "100vw", display: "flex", gap: "20px", justifyContent: "center"}}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                style={{
                  // position: "absolute",
                  // left: "50%",
                  // transform: "translateX(-50%)",
                  background: "#ED5F21 0% 0% no-repeat padding-box",
                  borderRadius: "24px",
                  width: "max-content",
                  paddingLeft: 70,
                  paddingRight: 70,
                }}
                >
                {loading ? (
                  <>
                    <div>Authenticating</div>
                    <div
                      style={{ marginLeft: "20px" }}
                      className="dot-flashing"
                      ></div>
                  </>
                ) : (
                  "login"
                  )}
              </Button>
            </Box>
          </Box>
        </Box>
      </Container>
      </Box>
    </ThemeProvider>
  );
}

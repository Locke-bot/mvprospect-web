import PropTypes from "prop-types";
import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";

// material-ui
import { useTheme } from "@mui/material/styles";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
  Typography,
} from "@mui/material";

// third party
import * as Yup from "yup";
import { Formik } from "formik";

// project imports
import AnimateButton from "./AnimateButton";
import useScriptRef from "./useScriptRef";

import { makeStyles, styled } from "@mui/styles";
import { API } from "../components/api";
import axios from "axios";
import { toast } from "react-toastify";

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const customInput = {
  marginTop: 1,
  marginBottom: 1,
  "& > label": {
    top: 23,
    left: 0,
    color: "#697586",
    '&[data-shrink="false"]': {
      top: 5,
    },
  },
  "& > div > input": {
    padding: "30.5px 14px 11.5px !important",
  },
  "& legend": {
    display: "none",
  },
  "& fieldset": {
    top: 0,
  },
};

const JWTLogin = () => {
  const theme = useTheme();
  const scriptedRef = useScriptRef();

  const [showPassword, setShowPassword] = React.useState(false);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <Formik
      initialValues={{
        firstName: "",
        password: "",
      }}
      validationSchema={Yup.object().shape({
        firstName: Yup.string().max(255).required("Username is required"),
        password: Yup.string().max(255).required("Password is required"),
      })}
      onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
        axios
          .post(`${API}/token/`, {
            username: values.firstName.trim(),
            password: values.password.trim(),
          })
          .then((response) => {
            if (scriptedRef.current) {
              setStatus({ success: true });
              setSubmitting(false);
            }

            localStorage.setItem("authTokens", JSON.stringify(response.data));
            window.location.href = window.location.href;
          })
          .catch((error) => {
            if (scriptedRef.current) {
              setStatus({ success: true });
              setSubmitting(false);
            }
            if (error?.response?.data?.detail) {
              setErrors({ submit: error?.response?.data?.detail });
              // toast.error(error?.response?.data?.detail);
              return;
            }
            toast.error("An error occurred");
          })
          .finally(() => {});
      }}
    >
      {({
        errors,
        handleBlur,
        handleChange,
        handleSubmit,
        isSubmitting,
        touched,
        values,
      }) => (
        <form noValidate onSubmit={handleSubmit}>
          <FormControl
            fullWidth
            error={Boolean(touched.firstName && errors.firstName)}
            sx={{ ...customInput }}
          >
            <InputLabel htmlFor="outlined-adornment-firstname-login">
              Username
            </InputLabel>
            <OutlinedInput
              id="outlined-adornment-firstname-login"
              type="text"
              value={values.firstName}
              name="firstName"
              onBlur={handleBlur}
              onChange={handleChange}
              inputProps={{}}
            />
            {touched.firstName && errors.firstName && (
              <FormHelperText
                error
                id="standard-weight-helper-text-firstname-login"
              >
                {errors.firstName}
              </FormHelperText>
            )}
          </FormControl>

          <FormControl
            fullWidth
            error={Boolean(touched.password && errors.password)}
            sx={{ ...customInput }}
          >
            <InputLabel htmlFor="outlined-adornment-password-login">
              Password
            </InputLabel>
            <OutlinedInput
              id="outlined-adornment-password-login"
              type={showPassword ? "text" : "password"}
              value={values.password}
              name="password"
              onBlur={handleBlur}
              onChange={handleChange}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                    size="large"
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              }
              inputProps={{}}
              label="Password"
            />
            {touched.password && errors.password && (
              <FormHelperText
                error
                id="standard-weight-helper-text-password-login"
              >
                {errors.password}
              </FormHelperText>
            )}
          </FormControl>

          {errors.submit && (
            <Box sx={{ mt: 3 }}>
              <FormHelperText error>{errors.submit}</FormHelperText>
            </Box>
          )}

          <Box sx={{ mt: 2 }}>
            <AnimateButton>
              <Button
                sx={{
                  backgroundColor: "#256a83",
                  color: "#fff",
                  "&:hover": {
                    backgroundColor: "#22496a",
                  },
                  textTransform: "none",
                }}
                disabled={isSubmitting}
                fullWidth
                size="large"
                type="submit"
                variant="contained"
              >
                Login
              </Button>
            </AnimateButton>
          </Box>
        </form>
      )}
    </Formik>
  );
};

JWTLogin.propTypes = {
  loginProp: PropTypes.number,
};

export default JWTLogin;

import React from "react";
import { Box, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles({
  mainContainer: {
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    backgroundColor: "#F9FAFC",
    display: "flex",
    flexDirection: "column",
    overflow: "auto",
    flex: 1,
  },
});

function Privacy() {
  const classes = useStyles();
  return (
    <Box className={classes.mainContainer}>
      <Box
        style={{
          paddingLeft: "75px",
          paddingRight: "75px",
          marginTop: "17px",
        }}
      >
        {/* 1. Introduction */}
        <Typography style={{fontSize: "16px", fontWeight:500}}>
          1. Introduction
        </Typography>
        <Typography style={{fontSize: "15px", marginBottom: "10px"}}>
          This privacy policy outlines how we handle and protect
          your personal data during the testing phase of our experimental
          application.
        </Typography>

        {/* 2. Information We Collect */}
        <Typography style={{fontSize: "16px", fontWeight:500}}>
          2. Information We Collect
        </Typography>
        <Typography style={{fontSize: "15px", marginBottom: "10px"}}>
          For the testing phase, we might collect basic user data such as
          usernames, email addresses, and any feedback you provide. We do not
          collect sensitive personal information.
        </Typography>

        {/* 3. How We Use Your Information */}
        <Typography style={{fontSize: "16px", fontWeight:500}}>
          3. How We Use Your Information
        </Typography>
        <Typography style={{fontSize: "15px", marginBottom: "10px"}}>
          - Testing and Feedback: To improve our application based on user
          feedback and usage patterns.
        </Typography>
        <Typography style={{fontSize: "15px", marginBottom: "10px"}}>
          - Communication: To send you updates or notices related to the testing
          phase.
        </Typography>

        {/* 4. Data Sharing */}
        <Typography style={{fontSize: "16px", fontWeight:500}}>
          4. Data Sharing
        </Typography>
        <Typography style={{fontSize: "15px", marginBottom: "10px"}}>
          We do not share your data with third parties. All data collected
          during this testing phase is for internal use only.
        </Typography>

        {/* 5. Data Retention */}
        <Typography style={{fontSize: "16px", fontWeight:500}}>
          5. Data Retention
        </Typography>
        <Typography style={{fontSize: "15px", marginBottom: "10px"}}>
          We will retain your data only for the duration of the testing phase.
          Once the testing is complete, all personal data will be deleted.
        </Typography>

        {/* 6. Security */}
        <Typography style={{fontSize: "16px", fontWeight:500}}>
          6. Security
        </Typography>
        <Typography style={{fontSize: "15px", marginBottom: "10px"}}>
          We prioritize your data's security. While no online service is 100%
          secure, we strive to protect your information to the best of our
          ability.
        </Typography>

        {/* 7. Your Rights */}
        <Typography style={{fontSize: "16px", fontWeight:500}}>
          7. Your Rights
        </Typography>
        <Typography style={{fontSize: "15px", marginBottom: "10px"}}>
          You have the right to access, correct, or delete your data at any
          point during the testing phase. Please reach out to our team for any
          data-related queries or requests.
        </Typography>

        {/* 8. Updates to This Policy */}
        <Typography style={{fontSize: "16px", fontWeight:500}}>
          8. Updates to This Policy
        </Typography>
        <Typography style={{fontSize: "15px", marginBottom: "10px"}}>
          This is a temporary privacy policy for the testing phase. Changes, if
          any, will be communicated promptly.
        </Typography>

        {/* 9. Contact Us */}
        <Typography style={{fontSize: "16px", fontWeight:500}}>
          9. Contact Us
        </Typography>
        <Typography style={{fontSize: "15px", marginBottom: "10px"}}>
          If you have any questions about this privacy policy or our data
          practices, please contact{" "}
          <a href="mailto:sborle@rice.edu" target="_blank">
            sborle@rice.edu
          </a>
          .
        </Typography>
      </Box>
    </Box>
  );
}

export default Privacy;

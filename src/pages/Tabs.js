import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Tab,
  Tabs,
  Toolbar,
} from "@mui/material";
import { makeStyles, styled } from "@mui/styles";

import Drawer from "../components/drawer";
import MiniDrawer from "../components/mini-drawer";

import {
  fetchPlayers,
  setCurrentHistory,
  setCurrentHistoryId,
  fetchPlayerHistoryPreview,
  setPlayerHistoryPreview,
  setCurrentChat,
  setPlayer,
} from "../redux/features/playerSlice";

import { useDispatch, useSelector } from "react-redux";

import CloseIcon from "@mui/icons-material/HighlightOff";

import Main from "./Main";
import Settings from "../components/settings";

function TabPanel(props) {
  const classes = useStyles();
  const dispatch = useDispatch();

  const { name, children, value, index, ...other } = props;

  const { player } = useSelector((state) => state.playerData);

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      style={{
        flex: 1,
        overflow: "hidden",
        display: value === index ? "flex" : undefined,
        flexDirection: "column",
      }}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      <Toolbar className={classes.toolBar}>
        {index === 1 ? (
          "Settings - Privacy Policy"
        ) : (
          <Box className={classes.boxHeader}>
            <Box>
              TXRChat -{" "}
              {!player ? (
                "select a player to begin"
              ) : (
                <div style={{ display: "inline-flex", alignItems: "center" }}>
                  {player}
                  <CloseIcon
                    style={{ width: 18, cursor: "pointer" }}
                    onClick={() => dispatch(setPlayer(null))}
                  />
                </div>
              )}
            </Box>
            <Box>
              {props?.compareMode ? "Compare Mode" : ""}
            </Box>
          </Box>
        )}
      </Toolbar>
      {value === index && <>{children}</>}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

const CustomTab = styled((props) => {
  const dispatch = useDispatch();
  const { player, playerIdMap } = useSelector(
    (state) => state.playerData
  );

  let p = {
    ...props,
    style: {
      color: "#363636",
      backgroundColor: props.selected ? "#F9FAFC" : "#FFFFFF",
      border: "thin solid #AFBBC6",
      borderLeftWidth: props?.left ? "1px" : undefined,
      borderRightWidth: props?.right ? "1px" : undefined,
      height: 35,
      minHeight: 0,
      font: "normal normal normal 16px/16px Roboto",
      padding: "0 13px",
      textTransform: "none",
      display: "flex",
      justifyContent: "center",
    },
  };
  return (
    <div
      style={{
        position: "relative",
        flex: props.label === "Settings" ? 1 : undefined,
      }}
    >
      <Tab disableRipple {...p} />
    </div>
  );
})(() => ({
  "&:hover": {
    color: "#40a9ff",
    opacity: 1,
    backgroundColor: "#F4F5F8",
  },
  "&.Mui-selected": {
    backgroundColor: "#F4F5F8",
    color: "#1890ff",
  },
  "&.Mui-focusVisible": {
    backgroundColor: "#d1eaff",
  },
}));

function TabsComponent() {
  const classes = useStyles();
  const dispatch = useDispatch();

  const { compareMode, player, playerIdMap } = useSelector((state) => state.playerData);
  const [value, setValue] = useState(0);

  const handleChange = (_, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    if (!value && value !== 0) {
      setValue(0);
    }
  }, [value]);

  useEffect(() => {
    dispatch(fetchPlayers());
  }, []);

  useEffect(() => {
    if (player) {
      dispatch(fetchPlayerHistoryPreview({ reset: true }));
    } else {
      dispatch(setPlayerHistoryPreview([]));
    }
    dispatch(setCurrentChat([]));
    dispatch(setCurrentHistory([]));
    dispatch(setCurrentHistoryId(null));
  }, [player]);

  return (
    <Box className={classes.mainBox}>
      <Drawer />
      <Box className={classes.innerBox}>
        <Box className={classes.tabBox}>
          <Tabs
            value={value ?? 0}
            onChange={handleChange}
            indicatorColor="transparent"
            textColor="inherit"
            variant="fullWidth"
            aria-label="tabs"
          >
            <CustomTab
              label="Chat"
              setValue={setValue}
              {...a11yProps(0)}
              left
              right
            />

            <CustomTab
              label="Settings"
              setValue={setValue}
              {...a11yProps(1)}
              right
            />
            <Button
              variant="outlined"
              onClick={() => {
                localStorage.removeItem("authTokens");
                window.location.href = window.location.origin;
              }}
              className={classes.logoutButton}
            >
              Logout
            </Button>
          </Tabs>
        </Box>

        <>
          <TabPanel
            value={value ?? 0}
            compareMode={compareMode}
            index={0}
            name="Chat"
          >
            <Main />
          </TabPanel>
          <TabPanel value={value ?? 0} index={2} name="Settings">
            <Settings />
          </TabPanel>
        </>
      </Box>
      <Box style={{ opacity: value === 0 ? 1 : 0 }}>
        {/* value as to be zero for the Minidrawer to open */}
        <MiniDrawer value={value} />
      </Box>
    </Box>
  );
}

const useStyles = makeStyles({
  mainBox: {
    display: "flex",
    gap: "17px",
    height: "100vh",
    paddingTop: "33px",
    paddingBottom: "38px",
  },
  innerBox: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
  tabBox: {
    width: "100%",
    paddingBottom: "33px",
  },
  buttonTab: {
    borderRadius: "0 !important",
    boxShadow: "none !important",
    height: "35px",
    borderRight: "1px #AFBBC6 solid !important",
    borderTop: "1px #AFBBC6 solid !important",
    borderBottom: "1px #AFBBC6 solid !important",

    "&:hover": {
      backgroundColor: "#22BC45 !important",
    },
  },
  logoutButton: {
    borderRadius: "0 !important",
    boxShadow: "none !important",
    height: "35px",
    border: "1px #AFBBC6 solid !important",
    width: "auto !important",
    color: "rgb(54, 54, 54) !important",
    opacity: 0.6,
    backgroundColor: "#FFF !important",

    "&:hover": {
      opacity: 1
    },
  },
  boxHeader: {
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
    alignItems: "center",
  },
  tab: {
    // border: "thin solid black"
  },
  toolBar: {
    backgroundColor: "#F4F5F8",
    borderRadius: "19px 19px 0px 0px",
    paddingLeft: "27px !important",
    font: "normal normal 500 19px/16px Roboto",
    letterSpacing: 0,
    color: "#4B5155",
    minHeight: "82px !important",
    display: "flex",
    justifyContent: "space-between",
  },
});

export default TabsComponent;

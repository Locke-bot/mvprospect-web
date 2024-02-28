import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import MuiToolbar from "@mui/material/Toolbar";
import MuiTypography from "@mui/material/Typography";
import { makeStyles, withStyles } from "@mui/styles";

import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SearchIcon from "@mui/icons-material/Search";
import SettingsIcon from "@mui/icons-material/SettingsOutlined";

import {
  FormControl,
  IconButton,
  InputAdornment,
  ListItemIcon,
  Menu,
  MenuItem,
  TextField,
} from "@mui/material";

import { useDispatch, useSelector } from "react-redux";

import { setSearchValue } from "../../redux/features/uiSlice";
import {
  LogoutOutlined,
  PictureAsPdf,
} from "@mui/icons-material";

import Table from "./prospects/prospectTable";

import Logo from "../../assets/avrij.png";

const useStyles = makeStyles({
  accountBox: {
    display: "flex",
    gap: "14px",
    width: "100%",
    marginTop: "15px",
    marginBottom: "15px",
  },
  flex: {
    display: "flex",
  },
  flexColumn: {
    flexDirection: "column",
  },
  flexGrow: {
    flexGrow: 1,
  },
  name: {
    font: "normal normal normal 16px/16px Roboto",
    letterSpacing: 0,
    color: "#4B5155",
  },
  desc: {
    font: "normal normal normal 16px/16px Roboto",
    letterSpacing: 0,
    color: "#7B8793",
  },
  team: {
    font: "normal normal normal 16px/16px Roboto",
    letterSpacing: 0,
    color: "#4B5155",
  },
  topToolBar: {
    minHeight: "82px !important",
    display: "flex",
    justifyContent: "center",
  },
  marginBottom12: {
    marginBottom: "12px",
  },
  h100: {
    height: "100%",
  },
  w100: {
    width: "100%",
  },
  prospectWord: {
    font: "normal normal normal 16px/16px Roboto",
    letterSpacing: "0 !important",
    color: "#4B5155",
  },
  spaceEvenly: {
    justifyContent: "space-evenly",
  },
  alignItemsLeft: {
    alignItems: "start !important",
  },
  mainPaddingRight: {
    paddingRight: "23px !important",
  },
  pr0: {
    paddingRight: "0 !important",
  },
  notchedOutline: {
    border: "1px solid #AFBBC6 !important",
  },
  searchField: {
    '& .MuiInputBase-root.MuiOutlinedInput-root': {
      marginBottom: 5,
      borderRadius: 20,
    },
  }
});

const Typography = withStyles({
  root: {
    fontFamily: "Roboto !important",
  },
})(MuiTypography);

const Toolbar = withStyles({
  root: {
    paddingLeft: "0 !important",
    paddingRight: "0",
  },
})(MuiToolbar);

const drawerWidth = 395;

export default function PermanentDrawerLeft() {
  const dispatch = useDispatch();
  const classes = useStyles();
  const [openSettings, setOpenSettings] = useState(false);
  const [settingsEl, setSettingsEl] = useState(false);

  const { players } =
    useSelector((state) => state.playerData);
  const { searchValue } = useSelector((state) => state.uiData);

  const logout = () => {
    localStorage.removeItem("authTokens");
    window.location.href = window.location.origin;
  };

  return (
    <Box id="drawer">
      <CssBaseline />
      <Menu
        id="settings-popover"
        open={openSettings}
        anchorEl={settingsEl}
        onClose={() => setOpenSettings(false)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <MenuItem
          component={"a"}
          href={require("../../assets/MVProspect-Definitions.pdf")}
          download="MVProspect-Definitions.pdf"
        >
          <ListItemIcon>
            <PictureAsPdf style={{ color: "rgb(175, 187, 198)" }} />
          </ListItemIcon>
          <Typography className={classes.prospectWord}>Definitions</Typography>
        </MenuItem>
        <Divider style={{ height: "2px", borderColor: "rgb(175, 187, 198)" }} />
        <MenuItem onClick={logout}>
          <ListItemIcon>
            <LogoutOutlined style={{ color: "rgb(175, 187, 198)" }} />
          </ListItemIcon>
          <Typography className={classes.prospectWord}>Logout</Typography>
        </MenuItem>
      </Menu>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            display: "flex",
            width: drawerWidth,
            boxSizing: "border-box",
            paddingBottom: "20px",
            paddingLeft: "40px",
            paddingTop: "20px",
            border: "none",
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar
          className={`${classes.topToolBar} ${classes.mainPaddingRight}`}
        >
          <img src={Logo} height={32} alt="" style={{width: "50%", height: "auto"}}/>
        </Toolbar>
        <Toolbar
          className={`${classes.flexColumn} ${classes.flexGrow} ${classes.alignItemsLeft} ${classes.pr0}`}
        >
          <Box
            className={`${classes.flexGrow} ${classes.flexColumn} ${classes.flex} ${classes.w100}`}
          >
            <FormControl
              sx={{ width: "100%", background: "white" }}
              className={classes.mainPaddingRight}
            >
              <TextField
                className={classes.searchField}
                variant="outlined"
                autoComplete="off"
                value={searchValue}
                label={searchValue ? "" : "Search"}
                onChange={(e) => dispatch(setSearchValue(e.target.value))}
                size="small"
                InputLabelProps={{
                  shrink: false,
                  style: { color: "#AFBBC6" },
                }}
                InputProps={{
                  classes: {
                    notchedOutline: classes.notchedOutline,
                  },
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton>
                        <SearchIcon
                          style={{
                            zIndex: 1,
                            transform: "scale(0.8)",
                            color: "grey",
                          }}
                        />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </FormControl>
            <Table
              rows={players.map((item) => {
                return {
                  player: item,
                };
              })}
            />
          </Box>
        </Toolbar>
      </Drawer>
    </Box>
  );
}

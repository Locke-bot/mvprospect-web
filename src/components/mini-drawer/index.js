import React, { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import IconButton from "@mui/material/IconButton";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";

import DeleteIcon from "@mui/icons-material/DeleteOutlineOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DownloadIcon from "@mui/icons-material/CloudDownloadOutlined";
import ShareIcon from "@mui/icons-material/Share";

import DocDup from "../../assets/document-duplication.png";
import DocSingle from "../../assets/document-single.png";

import { makeStyles } from "@mui/styles";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";

import {
  deleteHistory,
  downloadHistory,
  fetchChatText,
  setCurrentHistory,
  setCurrentHistoryId,
  setPlayer,
  setPlayerHistoryPreview,
} from "../../redux/features/playerSlice";

const drawerWidth = 270;

const useStyles = makeStyles({
  drawer: {
    paddingTop: "20px",
  },
  flex: {
    display: "flex",
  },
  flexCol: {
    flexDirection: "column",
  },
  alignItemsCenter: {
    alignItems: "center",
  },
  list: {
    display: "flex",
    flexDirection: "column",
    // height: "50%",
    width: "auto",
  },
  listOverflow: {
    overflowX: "hidden",
  },
  heightUnset: {
    height: "unset !important",
    "& div": {
      height: "unset !important",
    },
  },
  pList: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
  },
  zIndex: {
    zIndex: 5000,
  },
  arrowIcon: {
    backgroundColor: "rgb(224, 228, 232) !important",
  },
  headerToolBar: {
    minHeight: "82px !important",
    paddingLeft: "0 !important",
    paddingRight: "0 !important",
  },
  pl8: {
    paddingLeft: "8px !important",
  },
  px0: {
    paddingLeft: "0 !important",
    paddingRight: "0 !important",
  },
  chatHistory: {
    height: "49px",
    width: "100%",
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
  },
  chatHistoryText: {
    font: "normal normal normal 16px/16px Roboto",
    color: "#4B5155",
    letterSpacing: "0 !important",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    overflow: "hidden",
  },
  chatHistoryDate: {
    font: "normal normal normal 16px/16px Roboto",
    color: "#4B5155",
    letterSpacing: "0 !important",
  },
  flexGrow: {
    flexGrow: 1,
  },
  h100: {
    height: "100%",
  },
  overflowHidden: {
    overflow: "hidden",
  },
  listItemButton: {
    // borderRadius: "50% !important",
    height: 40,
    width: 40,
    paddingLeft: "20px",
    paddingRight: "20px",
    // backgroundColor: "#EAEEF0 !important",
    display: "flex !important",
    justifyContent: "center !important",
  },
  selectedChat: {
    backgroundColor: "#F9FAFC",
    border: "1px solid #DBE5ED",
    borderRadius: "10px",
  },
});

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
  borderRight: "none",
  paddingTop: "20px",
  paddingRight: "18px",
  border: "none",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  borderRight: "none",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
  paddingTop: "20px",
  paddingRight: "18px",
  border: "none",
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

function arraysEqual(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length !== b.length) return false;

  for (var i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

export default function MiniDrawer({ value }) {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [open, setOpen] = React.useState(false);
  const [historyDelete, setHistoryDelete] = React.useState(null);
  const [historyDeleteIndex, setHistoryDeleteIndex] = React.useState(null);
  const {
    player,
    playerIdMap,
    currentHistoryId,
    playerHistoryPreview,
    selectedPlayers,
  } = useSelector((state) => state.playerData);

  const [loaders, setLoaders] = useState({});

  useEffect(() => {
    let l = {};
    playerHistoryPreview.map((item, i) => (l[i] = false));
    setLoaders(() => ({ ...l }));
  }, [playerHistoryPreview]);

  useEffect(() => {
    if (!historyDelete) {
      setHistoryDeleteIndex(null);
    }
  }, [historyDelete]);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const chatClicked = (id, players) => {
    // players is an array of player ids depending on how many players have the chat history together
    console.log(
      playerHistoryPreview.filter((item) => {
        let p = item[3].split(",");
        console.log(players, p, item[3]);
        return arraysEqual(players, p);
      })
    );
    dispatch(
      setPlayerHistoryPreview(
        playerHistoryPreview.filter((item) => {
          let p = item[3].split(",");
          return arraysEqual(players, p);
        })
      )
    );
    players.splice(players.indexOf(playerIdMap[player]), 1);
    console.log(players, player);
    if (players.length) {
      for (let i of players) {
        let j = Object.keys(playerIdMap).filter(function (key) {
          return playerIdMap[key] === i;
        })[0];

        if (!selectedPlayers.includes(j)) {
          dispatch(setPlayer(j));
        }
      }
    }
    dispatch(setCurrentHistoryId(id));
    dispatch(fetchChatText(id));
  };

  const removeHistory = (id) => {
    setLoaders({ ...loaders, [historyDeleteIndex]: true });
    dispatch(deleteHistory(id)).then(() => {
      setHistoryDelete(null);
    });
  };

  return !value ? (
    <>
      <Dialog
        open={!!historyDelete}
        onClose={() => setHistoryDelete(null)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Are you sure you want to delete the chat history?
        </DialogTitle>
        {/* <DialogTitle style={{textAlign: "center", paddingTop: 0}}>
          {`(${prospectDelete})?`}
        </DialogTitle> */}
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            This will delete this history permanently. You cannot undo this
            action.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            style={{
              borderColor: "#36454F",
              color: "#36454F",
              borderRadius: 7,
            }}
            onClick={() => setHistoryDelete(null)}
            color="primary"
          >
            Cancel
          </Button>
          {loaders[historyDeleteIndex] ? (
            <Button style={{ width: "84px", borderRadius: 7 }}>
              <CircularProgress
                style={{
                  width: "20px",
                  height: "20px",
                  color: "rgb(175, 187, 198)",
                }}
              />
            </Button>
          ) : (
            <Button
              variant="filled"
              style={{
                backgroundColor: "rgb(220, 52, 39)",
                color: "#FFFFFF",
                width: "84px",
                borderRadius: 7,
              }}
              onClick={() => removeHistory(historyDelete)}
              color="primary"
              autoFocus
            >
              Delete
            </Button>
          )}
        </DialogActions>
      </Dialog>

      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <Drawer
          variant="permanent"
          open={open && (value ?? 0) === 0}
          anchor="right"
        >
          <Toolbar className={`${classes.headerToolBar}`}>
            <DrawerHeader style={{ paddingLeft: open ? 0 : undefined }}>
              <IconButton
                onClick={open ? handleDrawerClose : handleDrawerOpen}
                className={classes.arrowIcon}
              >
                {open ? <ArrowForwardIcon /> : <ArrowBackIcon />}
              </IconButton>
            </DrawerHeader>
          </Toolbar>
          <Box
            style={{
              display: "flex",
              flexDirection: "column",
              height: "inherit",
              overflow: "scroll",
            }}
          >
            <List
              className={`${classes.list} ${classes.listOverflow}`}
              style={{ overflow: !open ? "hidden" : undefined }}
            >
              {playerHistoryPreview?.map((item, i) => (
                <ListItem
                  className={open ? undefined : classes.pl8}
                  sx={{ display: "block", padding: open ? 0 : undefined }}
                >
                  {open ? (
                    <Box
                      className={`history ${classes.chatHistory} ${
                        item[2] === currentHistoryId ? classes.selectedChat : ""
                      }`}
                      onClick={() => chatClicked(item[2], item[3].split(","))}
                    >
                      <Box
                        className={`${classes.flex} ${classes.alignItemsCenter} ${classes.h100} ${classes.flexGrow} ${classes.overflowHidden}`}
                      >
                        <Box className={classes.flex}>
                          <ListItemButton
                            className={classes.listItemButton}
                            onClick={
                              open ? handleDrawerClose : handleDrawerOpen
                            }
                          >
                            {item[3].split(",").length > 1 ? (
                              <img src={DocDup} alt="" width={20} />
                            ) : (
                              <img src={DocSingle} alt="" width={15} />
                            )}
                          </ListItemButton>
                        </Box>
                        <Box
                          className={`${classes.flex} ${classes.flexCol} ${classes.h100}`}
                          style={{
                            marginLeft: "5px",
                            justifyContent: "space-around",
                            overflow: "hidden",
                          }}
                        >
                          <Tooltip title={item[1]}>
                            <Typography className={classes.chatHistoryText}>
                              {item[1]}
                            </Typography>
                          </Tooltip>
                        </Box>
                      </Box>
                      <Box
                        className={[classes.flex, "history-menu"]}
                        style={{ gap: "8px" }}
                      >
                        <DownloadIcon
                          style={{
                            color: "#AFBBC6",
                            transform: "scale(0.8)",
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            dispatch(
                              downloadHistory({
                                id: item[2],
                                name: `${player
                                  .toLowerCase()
                                  .replace(", ", "_")
                                  .replace(
                                    " ",
                                    "_"
                                  )}-${item[0].getUTCFullYear()}-${String(
                                  item[0].getUTCMonth() + 1
                                ).padStart(2, "0")}-${String(
                                  item[0].getUTCDate()
                                ).padStart(2, "0")}-${item[2]}`,
                              })
                            );
                          }}
                        />

                        <ShareIcon
                          style={{
                            color: "#AFBBC6",
                            transform: "scale(0.8)",
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            dispatch(
                              downloadHistory({
                                type: "share",
                                id: item[2],
                                name: `${player
                                  .toLowerCase()
                                  .replace(", ", "_")
                                  .replace(
                                    " ",
                                    "_"
                                  )}-${item[0].getUTCFullYear()}-${String(
                                  item[0].getUTCMonth() + 1
                                ).padStart(2, "0")}-${String(
                                  item[0].getUTCDate()
                                ).padStart(2, "0")}-${item[2]}`,
                              })
                            );
                          }}
                        />

                        {loaders[i] ? (
                          <CircularProgress
                            style={{
                              width: "20px",
                              height: "20px",
                              color: "rgb(175, 187, 198)",
                            }}
                          />
                        ) : (
                          <DeleteIcon
                            style={{
                              transform: "scale(0.8)",
                              color: "#AFBBC6",
                              visibility:
                                currentHistoryId === item[2]
                                  ? "hidden"
                                  : undefined,
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              setHistoryDelete(item[2]);
                              setHistoryDeleteIndex(i);
                            }}
                          />
                        )}
                      </Box>
                    </Box>
                  ) : (
                    <ListItemButton
                      className={classes.listItemButton}
                      onClick={open ? handleDrawerClose : handleDrawerOpen}
                    >
                      {item[3].split(",").length > 1 ? (
                        <img src={DocDup} alt="" width={20} />
                      ) : (
                        <img src={DocSingle} alt="" width={15} />
                      )}
                    </ListItemButton>
                  )}
                </ListItem>
              ))}
            </List>
          </Box>
        </Drawer>
      </Box>
    </>
  ) : (
    <></>
  );
}

import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  excelDownload,
  videoDownload,
  textDownload,
  setPlayers,
  setPlayer,
  setCompareMode,
  setSelectedPlayers,
  pdfDownload,
} from "../../../redux/features/playerSlice";

import clsx from "clsx";
import { styled } from "@mui/material/styles";
import TableCell from "@mui/material/TableCell";
import { Box, CircularProgress, Divider, IconButton, ListItemIcon, Menu, MenuItem, Tooltip, Typography } from "@mui/material";

import ArrowDropUpOutlinedIcon from "@mui/icons-material/ArrowDropUpOutlined";
import ArrowDropDownOutlinedIcon from "@mui/icons-material/ArrowDropDownOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CheckIcon from "@mui/icons-material/Check";
import DescriptionIcon from "@mui/icons-material/Description";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import VideoFileIcon from "@mui/icons-material/VideoFile";
import TableChartIcon from "@mui/icons-material/TableChart";

import Paper from "@mui/material/Paper";
import { AutoSizer, Column, Table } from "react-virtualized";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles({
  prospectWord: {
    font: "normal normal bold 16px/18px Sofia Sans !important",
    letterSpacing: "0 !important",
    color: "#4B5155",
  },
});

const classes = {
  flexContainer: "ReactVirtualizedDemo-flexContainer",
  sortHeaders: "ReactVirtualizedDemo-sortHeaders",
  selectedCell: "ReactVirtualizedDemo-selectedCell",
  tableHeader: "ReactVirtualizedDemo-tableHeader",
  tableRow: "ReactVirtualizedDemo-tableRow",
  tableRowHover: "ReactVirtualizedDemo-tableRowHover",
  tableCell: "ReactVirtualizedDemo-tableCell",
  click: "ReactVirtualizedDemo-click",
  noselect: "noselect",
};

const styles = ({ theme }) => ({
  // temporary right-to-left patch, waiting for
  // https://github.com/bvaughn/react-virtualized/issues/454
  "& .ReactVirtualized__Table__headerRow": {
    ...(theme.direction === "rtl" && {
      paddingLeft: "0 !important",
    }),
    ...(theme.direction !== "rtl" && {
      paddingRight: undefined,
    }),
    cursor: "pointer",
  },
  [`& .${classes.flexContainer}`]: {
    display: "flex",
    alignItems: "center",
    boxSizing: "border-box",
  },
  [`& .${classes.tableRow}`]: {
    cursor: "pointer",
    width: "100% !important",
  },
  [`& .${classes.tableRowHover}`]: {
    "&:hover": {
      backgroundColor: theme.palette.grey[200],
    },
  },
  [`& .${classes.tableCell}`]: {
    flex: 1,
    borderBottom: 0,
    font: "normal normal normal 16px/16px Roboto !important",
    letterSpacing: 0,
    userSelect: "none",
    color: "#4B5155",
    paddingLeft: "32px",
  },
  [`& .${classes.tableHeader}`]: {
    flex: 1,
    borderBottom: 0,
    font: "normal normal normal 14px/16px Roboto !important",
    color: "#363636",
    letterSpacing: 0,
    padding: 0,
    display: "flex",
    justifyContent: "start",
  },
  [`& .${classes.sortHeaders}`]: {
    font: "normal normal normal 14px/16px Roboto !important",
    color: "#363636",
    letterSpacing: 0,
    display: "flex",
    alignItems: "center",
    userSelect: "none",
  },
  [`& .${classes.click}`]: {
    cursor: "pointer",
  },
});

class MuiVirtualizedTable extends React.PureComponent {
  static defaultProps = {
    headerHeight: 38,
    rowHeight: 71,
  };

  getRowClassName = ({ index }) => {
    const { onRowClick } = this.props;
    return clsx(
      "player-cell",
      index === -1 ? "" : classes.tableRow,
      classes.flexContainer,
      {
        [classes.tableRowHover]: index !== -1 && onRowClick != null,
      }
    );
  };

  cellRenderer = ({ cellData, columnIndex, rowData }) => {
    const { rowHeight } = this.props;
    return (
      <TableCell
        component="div"
        className={clsx(
          classes.tableCell,
          classes.flexContainer
          // columnIndex === 1 ? classes.simCol : null
        )}
        ref={(ref) => (this.props.playersRef.current[cellData] = ref)}
        variant="body"
        style={{
          height: rowHeight,
          color:
            !this.props.players.includes(rowData["player"]) && columnIndex === 1
              ? "#7B8793"
              : undefined,
        }}
        align="left"
        onClick={(e) => this.props.playersClicked(e, rowData["player"])}
      >
        <IconButton
          title={
            this.props.downloading ? "Download ongoing..." : "Download files"
          }
          style={{
            position: "absolute",
            right: 40,
            color:
              this.props.radioValue !== rowData["player"]
                ? "#AFBBC6"
                : undefined,
          }}
          disableRipple
          onClick={(e) => {
            e.stopPropagation();
            this.props.setDownloadsElPlayer(rowData["player"]);
            this.props.setDownloadsEl(e.target);
            this.props.setOpenDownloads(true);
            // this.props.downloadFiles(rowData["player"]);
          }}
        >
          <MoreVertIcon
            style={{ transform: "scale(0.8)" }}
            className="close-menu close-delete-col"
          />
        </IconButton>

        {this.props.players.includes(rowData["player"]) ? (
          <CheckIcon
            style={{
              position: "absolute",
              left: "5px",
              transform: "scale(0.8)",
              color: "darkgreen",
            }}
          />
        ) : (
          <></>
        )}

        {cellData}
      </TableCell>
    );
  };

  headerRenderer = ({ label, columnIndex }) => {
    const { headerHeight, columns } = this.props;
    return (
      <>
        <TableCell
          component="div"
          className={clsx(
            columnIndex === 0 ? classes.tableCell : classes.tableHeader,
            classes.flexContainer
          )}
          variant="head"
          style={{
            height: headerHeight,
            paddingLeft: columnIndex === 0 ? "32px" : "20px",
          }}
          align={columns[columnIndex].numeric || false ? "right" : "left"}
          onClick={() => this.props.sortFunc(columnIndex === 0)}
        >
          <Typography
            className={`align-items-center d-flex noselect font-small ${classes.sortHeaders}`}
          >
            {label}
            {this.props.nameSort === 0 ? (
              <>
                <ArrowDropUpOutlinedIcon
                  sx={{ height: "17px", color: "#bdbebf" }}
                  className="scale-6"
                />
                <ArrowDropDownOutlinedIcon
                  sx={{ height: "17px", marginLeft: "-12px", color: "#bdbebf" }}
                  className="scale-6 -ml-18"
                />
              </>
            ) : this.props.nameSort === 1 ? (
              <>
                <ArrowDropUpOutlinedIcon
                  sx={{ height: "17px" }}
                  className="scale-6"
                />
                <ArrowDropDownOutlinedIcon
                  sx={{ height: "17px", marginLeft: "-12px", color: "#bdbebf" }}
                  className="scale-6 -ml-18"
                />
              </>
            ) : this.props.nameSort === 2 ? (
              <>
                <ArrowDropUpOutlinedIcon
                  sx={{ height: "17px", color: "#bdbebf" }}
                  className="scale-6"
                />
                <ArrowDropDownOutlinedIcon
                  sx={{ height: "17px", marginLeft: "-12px" }}
                  className="scale-6 -ml-18"
                />
              </>
            ) : (
              <></>
            )}
          </Typography>
        </TableCell>
        <Divider style={{ borderWidth: 1 }} />
      </>
    );
  };

  render() {
    const { columns, rowHeight, headerHeight, ...tableProps } = this.props;
    return (
      <AutoSizer>
        {({ height, width }) => (
          <Table
            height={height}
            width={width}
            rowHeight={rowHeight}
            gridStyle={{
              direction: "inherit",
            }}
            headerHeight={headerHeight}
            {...tableProps}
            rowClassName={this.getRowClassName}
          >
            {columns.map(({ dataKey, ...other }, index) => {
              return (
                <Column
                  key={dataKey}
                  headerRenderer={(headerProps) =>
                    this.headerRenderer({
                      ...headerProps,
                      columnIndex: index,
                    })
                  }
                  className={classes.flexContainer}
                  cellRenderer={this.cellRenderer}
                  dataKey={dataKey}
                  {...other}
                />
              );
            })}
          </Table>
        )}
      </AutoSizer>
    );
  }
}

const VirtualizedTable = styled(MuiVirtualizedTable)(styles);

export default function ReactVirtualizedTable({ rows }) {
  const muiClasses = useStyles();
  const playersRef = useRef({});
  const dispatch = useDispatch();

  const { allPlayers, compareMode, player, players, playerIdMap, pinned, selectedPlayers, downloading  } =
    useSelector((state) => state.playerData);

  const { searchValue } = useSelector((state) => state.uiData);
  const [nameSort, setNameSort] = useState(0);

  const [openDownloads, setOpenDownloads] = useState(false);
  const [downloadsEl, setDownloadsEl] = useState(null);
  const [downloadsElPlayer, setDownloadsElPlayer] = useState(null);

  const [prospectDownloading, setProspectDownloading] = useState(null);
  const [downloadType, setDownloadType] = useState(null);

  const reorderByLastName = (array, mode) => {
    array = array.slice();
    array = array.filter((item) => !pinned.includes(item));

    if (mode === 0) {
      return allPlayers;
    }
    if (mode === 1) {
      return pinned.concat(
        array.sort(function (a, b) {
          return a.toLowerCase().localeCompare(b.toLowerCase());
        })
      );
    } else if (mode === 2) {
      // || mode == 0 ) {
      return pinned.concat(
        array
          .sort(function (a, b) {
            return a.toLowerCase().localeCompare(b.toLowerCase());
          })
          .reverse()
      );
    }
  };

  useEffect(() => {
    dispatch(setPlayers(filterPlayers(allPlayers, searchValue)));
  }, [searchValue]);

  useEffect(() => {
    let result = filterPlayers(
      reorderByLastName(allPlayers, nameSort),
      searchValue
    );
    dispatch(setPlayers(result));
  }, [nameSort, allPlayers]);

  const filterPlayers = (players, search) => {
    search = searchValue.trim();
    players = nameSort !== 0 ? reorderByLastName(players, nameSort) : players;

    if (search) {
      players = players.filter((player) => {
        return player.toLowerCase().includes(search.toLowerCase());
      });
    }
    return players;
  };

  useEffect(() => {
    let result = filterPlayers(
      reorderByLastName(allPlayers, nameSort),
      searchValue
    );
    dispatch(setPlayers(result));
  }, [nameSort, allPlayers]);

  const playersClicked = (e, c) => {
    if (!c.trim()) {
      return;
    }

    if (player === c) {
      dispatch(setPlayer(""));
    } else {
      if (player || selectedPlayers.length) {
        if (compareMode) {
          if (selectedPlayers.includes(c)) {
            let p = selectedPlayers.slice();
            p.splice(p.indexOf(c), 1);

            dispatch(setCompareMode(false));
            dispatch(setPlayer(p[0]));
            dispatch(setSelectedPlayers([]));
          } else {
            dispatch(setSelectedPlayers([selectedPlayers[1], c]));
          }
        } else {
          dispatch(setSelectedPlayers([player, c]));
          dispatch(setCompareMode(true));
          dispatch(setPlayer(""));
        }
      } else {
        dispatch(setPlayer(c));
      }
    }
  };

  const sortFunc = () => {
    setNameSort((nameSort + 1) % 3);
  };

  const downloadVideo = (player) => {
    if (!downloading) {
      dispatch(
        videoDownload({
          id: playerIdMap[player],
          name: player.toLowerCase().replace(", ", "_").replace(" ", "_"),
        })
      );
      setProspectDownloading(player);
      setDownloadType("video");
    }
  };

  const downloadExcel = (player) => {
    if (!downloading) {
      dispatch(
        excelDownload({
          id: playerIdMap[player],
          name: player.toLowerCase().replace(", ", "_").replace(" ", "_"),
        })
      );
      setProspectDownloading(player);
      setDownloadType("excel");
    }
  };

  const downloadText = (player) => {
    console.log('lalkd', player)
    if (!downloading) {
      dispatch(
        textDownload({
          id: playerIdMap[player],
          name: player.toLowerCase().replace(", ", "_").replace(" ", "_"),
        })
      );
      setProspectDownloading(player);
      setDownloadType("text");
    }
  };

  const downloadPDF = (player) => {
    if (!downloading) {
      dispatch(
        pdfDownload({
          id: playerIdMap[player],
          name: player.toLowerCase().replace(", ", "_").replace(" ", "_"),
        })
      );
      setProspectDownloading(player);
      setDownloadType("pdf");
    }
  };

  return (
    <React.Fragment>
      <Menu
        id="downloads-popover"
        open={openDownloads}
        anchorEl={downloadsEl}
        onClose={() => setOpenDownloads(false)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <MenuItem
          onClick={() =>
            downloading ? void 0 : downloadText(downloadsElPlayer)
          }
        >
          <Tooltip
            title={
              !downloading
                ? ""
                : downloading &&
                  prospectDownloading === downloadsElPlayer &&
                  downloadType == "text"
                ? "Download ongoing"
                : "concurrent downloads not allowed"
            }
          >
            <Box style={{ display: "flex", alignItems: "center" }}>
              <ListItemIcon>
                {downloading &&
                prospectDownloading === downloadsElPlayer &&
                downloadType == "text" ? (
                  <CircularProgress
                    style={{
                      width: "24px",
                      height: "24px",
                      color: "rgb(175, 187, 198)",
                    }}
                    className="close-menu close-delete-col"
                  />
                ) : (
                  <DescriptionIcon style={{ color: "rgb(175, 187, 198)" }} />
                )}
              </ListItemIcon>
              <Typography className={muiClasses.prospectWord}>
                Download Text
              </Typography>
            </Box>
          </Tooltip>
        </MenuItem>
        <MenuItem
          onClick={() =>
            downloading ? void 0 : downloadPDF(downloadsElPlayer)
          }
        >
          <Tooltip
            title={
              !downloading
                ? ""
                : downloading &&
                  prospectDownloading === downloadsElPlayer &&
                  downloadType == "pdf"
                ? "Download ongoing"
                : "concurrent downloads not allowed"
            }
          >
            <Box style={{ display: "flex", alignItems: "center" }}>
              <ListItemIcon>
                {downloading &&
                prospectDownloading === downloadsElPlayer &&
                downloadType == "pdf" ? (
                  <CircularProgress
                    style={{
                      width: "24px",
                      height: "24px",
                      color: "rgb(175, 187, 198)",
                    }}
                    className="close-menu close-delete-col"
                  />
                ) : (
                  <PictureAsPdfIcon style={{ color: "rgb(175, 187, 198)" }} />
                )}
              </ListItemIcon>
              <Typography className={muiClasses.prospectWord}>
                Download PDF
              </Typography>
            </Box>
          </Tooltip>
        </MenuItem>        
        <MenuItem
          onClick={() =>
            downloading ? void 0 : downloadExcel(downloadsElPlayer)
          }
        >
          <Tooltip
            title={
              !downloading
                ? ""
                : downloading &&
                  prospectDownloading === downloadsElPlayer &&
                  downloadType == "excel"
                ? "Download ongoing"
                : "concurrent downloads not allowed"
            }
          >
            <Box style={{ display: "flex", alignItems: "center" }}>
              <ListItemIcon>
                {downloading &&
                prospectDownloading === downloadsElPlayer &&
                downloadType == "excel" ? (
                  <CircularProgress
                    style={{
                      width: "24px",
                      height: "24px",
                      color: "rgb(175, 187, 198)",
                    }}
                    className="close-menu close-delete-col"
                  />
                ) : (
                  <TableChartIcon style={{ color: "rgb(175, 187, 198)" }} />
                )}
              </ListItemIcon>
              <Typography className={muiClasses.prospectWord}>
                Download Excel
              </Typography>
            </Box>
          </Tooltip>
        </MenuItem>
        <MenuItem
          onClick={() =>
            downloading ? void 0 : downloadVideo(downloadsElPlayer)
          }
        >
          <Tooltip
            title={
              !downloading
                ? ""
                : downloading &&
                  prospectDownloading === downloadsElPlayer &&
                  downloadType == "video"
                ? "Download ongoing"
                : "concurrent downloads not allowed"
            }
          >
            <Box style={{ display: "flex", alignItems: "center" }}>
              <ListItemIcon>
                {downloading &&
                prospectDownloading === downloadsElPlayer &&
                downloadType == "video" ? (
                  <CircularProgress
                    style={{
                      width: "24px",
                      height: "24px",
                      color: "rgb(175, 187, 198)",
                    }}
                    className="close-menu close-delete-col"
                  />
                ) : (
                  <VideoFileIcon style={{ color: "rgb(175, 187, 198)" }} />
                )}
              </ListItemIcon>
              <Typography className={muiClasses.prospectWord}>
                Download Video
              </Typography>
            </Box>
          </Tooltip>
        </MenuItem>
      </Menu>

      <Paper style={{ flexGrow: 1, width: "100%", boxShadow: "unset" }}>
        <VirtualizedTable
          playersRef={playersRef}
          playersClicked={playersClicked}
          rowCount={rows.length}
          nameSort={nameSort}
          rowGetter={({ index }) => rows[index]}
          players={compareMode ? selectedPlayers : [player]}
          pinned={pinned}
          sortFunc={sortFunc}
          setDownloadsElPlayer={setDownloadsElPlayer}
          setOpenDownloads={setOpenDownloads}
          setDownloadsEl={setDownloadsEl}
          columns={[
            {
              width: "100%",
              label: `Players (${players.length})`,
              dataKey: "player",
            },
          ]}
        />
      </Paper>
    </React.Fragment>
  );
}

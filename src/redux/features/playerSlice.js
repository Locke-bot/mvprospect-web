import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { API, authAxios, getDispositionFilename } from "../../components/api";
import axios from 'axios'
import JSZip from "jszip";
import { toast } from "react-toastify";

const initialState = {
  mode: 0,
  pinned: [],
  player: "",
  playerIdMap: null,
  players: [],
  playerSimilarityMap: [],
  allPlayers: [],
  currentChat: [],
  currentHistoryId: "",
  playerHistoryPreview: [],
  compareMode: false,
  selectedPlayers: [],
  downloading: false,
  pinned: [],
};

export const fetchPinned = createAsyncThunk(
  "player/fetchPinned",
  async (options, thunkAPI) => {
    try {
      let response = await authAxios(`${API}/applicants/pinned/`);
      return await { data: response.data, ...options };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const togglePinned = createAsyncThunk(
  "player/togglePinned",
  async (options, thunkAPI) => {
    try {
      let response = await authAxios.post(
        `${API}/applicants/pinned/${options.id}/`
      );

      return await { data: response, ...options };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const textDownload = createAsyncThunk(
  "player/textDownload",
  async (options, thunkAPI) => {
    try {
      let response = await authAxios(
        `${API}/applicants/download/get-transcript/${options.id}/`,
        {
          responseType: "blob",
        }
      );
      return { response: response, name: options.name };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const pdfDownload = createAsyncThunk(
  "player/pdfDownload",
  async (options, thunkAPI) => {
    try {
      let response = await authAxios(
        `${API}/applicants/download/get-pdf/${options.id}/`,
        {
          responseType: "blob",
        }
      );
      return { response: response, name: options.name };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const excelDownload = createAsyncThunk(
  "player/excelDownload",
  async (options, thunkAPI) => {
    try {
      let response = await authAxios(
        `${API}/applicants/download/get-excel/${options.id}/`,
        {
          responseType: "blob",
        }
      );
      return { response: response, name: options.name };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const videoDownload = createAsyncThunk(
  "player/videoDownload",
  async (options, thunkAPI) => {
    try {
      let response = await authAxios(`${API}/applicants/download/get-video/${options.id}/`,);

      let response2 = await axios.get(response.data, {
        responseType: 'blob',
      });

      return { data: response2.data, name: options.name };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const fetchPlayers = createAsyncThunk(
  "player/fetchPlayers",
  async (thunkAPI) => {
    try {
      let response = await authAxios(`${API}/applicants/chat/players/`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const fetchPlayerHistoryPreview = createAsyncThunk(
  "player/fetchPlayerHistoryPreview",
  async (options, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      let response;
      if (options?.multiple) {
        response = await authAxios(
          `${API}/applicants/chat/history-preview/${state.playerData.selectedPlayers
            .map((item) => state.playerData.playerIdMap[item])
            .join(",")}/`
        );
      } else {
        response = await authAxios(
          `${API}/applicants/chat/history-preview/${
            state.playerData.playerIdMap[state.playerData.player]
          }/`
        );
      }
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const fetchChatText = createAsyncThunk(
  "player/fetchChatText",
  async (arg, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      let response = await authAxios(
        `${API}/applicants/chat/history/${state.playerData.currentHistoryId}/`
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const downloadHistory = createAsyncThunk(
  "player/downloadHistory",
  async (options, thunkAPI) => {
    try {
      let response = await authAxios(
        `${API}/applicants/chat/history/${options.id}/`
      );
      return { data: response.data, ...options };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const deleteHistory = createAsyncThunk(
  "player/deleteHistory",
  async (id, thunkAPI) => {
    try {
      let response = await authAxios.delete(
        `${API}/applicants/chat/delete-history/${id}/`
      );
      return { data: response.data, id: id };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const sendQuestion = createAsyncThunk(
  "player/sendQuestion",
  async (options, thunkAPI) => {
    try {
      let response = await authAxios.post(`${API}/applicants/chat/`, options);
      return { data: response.data, ...options };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const playerSlice = createSlice({
  name: "player",
  initialState,
  reducers: {
    setPlayer: (state, action) => {
      let c = action.payload;
      if (state.player === c) {
        state.player = "";
      } else {
        if (state.player || state.selectedPlayers.length) {
          if (state.compareMode) {
            if (state.selectedPlayers.includes(c)) {
              let p = state.selectedPlayers.slice();
              p.splice(p.indexOf(c), 1);

              state.compareMode = false;
              state.player = p[0];
              state.selectedPlayers = [];
            } else {
              state.selectedPlayers = [state.selectedPlayers[1], c];
            }
          } else {
            state.selectedPlayers = [state.player, c];
            state.compareMode = true;
            state.player = "";
          }
        } else {
          state.player = c;
        }
      }
    },
    setPinned: (state, action) => {
      state.pinned = [...new Set(action.payload)];
    },
    setPlayers: (state, action) => {
      state.players = action.payload;
    },
    setMode: (state, action) => {
      state.mode = action.payload;
    },
    setPlayerHistoryPreview: (state, action) => {
      state.playerHistoryPreview = action.payload;
    },
    setCurrentHistoryId: (state, action) => {
      state.currentHistoryId = action.payload;
    },
    setCurrentChat: (state, action) => {
      state.currentChat = action.payload;
    },
    setCompareMode: (state, action) => {
      state.compareMode = action.payload;
    },
    setSelectedPlayers: (state, action) => {
      state.selectedPlayers = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlayers.pending, (state) => {})
      .addCase(fetchPlayers.fulfilled, (state, action) => {

        const originalObject = action.payload[0]
        const transposedObject = Object.entries(originalObject).reduce((acc, [key, value]) => {
            acc[value] = key;
            return acc;
        }, {});

        state.allPlayers = Object.keys(transposedObject);
        state.players = Object.keys(transposedObject);
        state.playerIdMap = transposedObject;

        state.playerSimilarityMap = action.payload[1]
      })
      .addCase(fetchPlayers.rejected, (state) => {})

      .addCase(sendQuestion.pending, (state, action) => {})
      .addCase(sendQuestion.fulfilled, (state, action) => {
        if (state.currentHistoryId === action.payload.chat_history_id) {
          state.currentChat[state.currentChat.length - 1].push(
            action.payload.data[0]
          );
          state.currentHistoryId = action.payload.data[1];
        }
      })
      .addCase(sendQuestion.rejected, (state) => {})

      .addCase(fetchPlayerHistoryPreview.pending, (state, action) => {
        if (action?.meta?.arg?.reset === true) {
          state.playerHistoryPreview = [];
        }
      })
      .addCase(fetchPlayerHistoryPreview.fulfilled, (state, action) => {
        state.playerHistoryPreview = action.payload.map((item) => [
          new Date(item[0]),
          ...item.slice(1),
        ]);
      })
      .addCase(fetchPlayerHistoryPreview.rejected, (state) => {})

      .addCase(fetchChatText.pending, (state) => {})
      .addCase(fetchChatText.fulfilled, (state, action) => {
        state.currentChat = action.payload;
      })
      .addCase(fetchChatText.rejected, (state) => {})

      .addCase(downloadHistory.pending, (state) => {})
      .addCase(downloadHistory.fulfilled, (state, action) => {
        var text = "";
        action.payload.data.map((item, i) => {
          text = text + item[0] + "\n";
          text = text + item[1] + "\n\n\n\n";
        });
        text = text.trim();

        if (action.payload?.type === "share") {
          let subject = "MVP Chat Text";
          let body = text;
          let maxLength = 2040; // Set the maximum length for the mailto link
          let ellipsis = "...";

          // Create the initial mailto link
          var mailtoLink =
            "mailto:" + "?subject=" + encodeURIComponent(subject) + "&body=";

          // Segment the body text into graphemes
          const segmenter = new Intl.Segmenter("en", {
            granularity: "grapheme",
          });
          const segItr = segmenter.segment(body);
          const segArr = Array.from(segItr, ({ segment }) => segment);

          // Check the length of the encoded body and truncate the body if necessary
          let encodedBody = encodeURIComponent(body);
          if (mailtoLink.length + encodedBody.length > maxLength) {
            let availableLength =
              maxLength -
              mailtoLink.length -
              encodeURIComponent(ellipsis).length;
            let newBodyLength = body.length;

            // Determine the new body length based on the encoded body length
            while (
              encodeURIComponent(segArr.slice(0, newBodyLength).join(""))
                .length > availableLength
            ) {
              newBodyLength--;
            }

            // Truncate the body text using graphemes and add ellipsis
            body = segArr.slice(0, newBodyLength).join("") + ellipsis;
            mailtoLink += encodeURIComponent(body);
          } else {
            mailtoLink += encodedBody;
          }

          // Create an anchor element
          var link = window.document.createElement("a");
          link.href = mailtoLink;
          link.target = "_blank";

          // Trigger a click on the anchor element
          link.click();
        } else {
          const url = window.URL.createObjectURL(
            new Blob([text], { type: "text/plain" })
          );
          const link = window.document.createElement("a");
          link.href = url;
          link.setAttribute("download", action.payload.name);
          window.document.body.appendChild(link);
          link.click();
        }
      })

      .addCase(deleteHistory.pending, (state) => {})
      .addCase(deleteHistory.fulfilled, (state, action) => {
        state.playerHistoryPreview = state.playerHistoryPreview.filter(
          (item) => item[2] !== action.payload.id
        );
      })

      .addCase(textDownload.pending, (state) => {
        state.downloading = true;
      })
      .addCase(textDownload.fulfilled, (state, action) => {
        const url = window.URL.createObjectURL(
          new Blob([action.payload.response.data], { type: "text/plain" })
        );
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute(
          "download",
          getDispositionFilename(
            action.payload.response.headers["content-disposition"]
          )
        );
        document.body.appendChild(link);
        link.click();
        state.downloading = false;
      })
      .addCase(textDownload.rejected, (state) => {
        state.downloading = false;
        toast.info("Content not available");
      })

      .addCase(excelDownload.pending, (state) => {
        state.downloading = true;
      })
      .addCase(excelDownload.fulfilled, (state, action) => {
        let response = action.payload.response;

        const url = window.URL.createObjectURL(
          new Blob([response.data], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          })
        );
        const link = document.createElement("a");
        link.href = url;
        let name = getDispositionFilename(
          response.headers["content-disposition"]
        );
        link.setAttribute("download", `${name}`);
        document.body.appendChild(link);
        link.click();
        state.downloading = false;
      })
      .addCase(excelDownload.rejected, (state, action) => {
        state.downloading = false;
        toast.info("Content not available");
      })

      .addCase(videoDownload.pending, (state) => {
        state.downloading = true;
      })
      .addCase(videoDownload.fulfilled, (state, action) => {
        const url = window.URL.createObjectURL(
          new Blob([action.payload.data], { type: "application/zip" })
        );
        let link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${action.payload.name}.zip`);
        document.body.appendChild(link);
        link.click();
        state.downloading = false;
      })
      .addCase(videoDownload.rejected, (state) => {
        state.downloading = false;
        toast.info("Content not available");
      })

      .addCase(pdfDownload.pending, (state) => {
        state.downloading = true;
      })
      .addCase(pdfDownload.fulfilled, (state, action) => {
        let response = action.payload.response;
        let contentType = response.headers["content-type"];

        if (contentType === "application/x-zip-compressed") {
          let new_zip = new JSZip();
          let file, link;
          const links = [];
          new_zip.loadAsync(response.data).then(async function (zipped) {
            for (let filename of Object.keys(zipped.files)) {
              file = await zipped
                .file(filename)
                .async("blob")
                .then(function success(content) {
                  const url = window.URL.createObjectURL(content);
                  link = document.createElement("a");
                  link.href = url;

                  link.setAttribute("download", `${filename}`);
                  document.body.appendChild(link);
                  links.push(link);
                });
            }
            for (link of links) {
              link.click();
            }
          });
        } else {
          // Catchers and Pt
          const url = window.URL.createObjectURL(
            new Blob([response.data], { type: "application/pdf" })
          );
          const link = document.createElement("a");
          link.href = url;
          let name = getDispositionFilename(
            response.headers["content-disposition"]
          );
          link.setAttribute("download", `${name}`);
          document.body.appendChild(link);
          link.click();
        }
        state.downloading = false;
      })
      .addCase(pdfDownload.rejected, (state, action) => {
        state.downloading = false;
        toast.info("Content not available");
      })

      .addCase(togglePinned.pending, (state) => {})
      .addCase(togglePinned.fulfilled, (state, action) => {})
      .addCase(togglePinned.rejected, (state) => {})

      .addCase(fetchPinned.pending, (state) => {})
      .addCase(fetchPinned.fulfilled, (state, action) => {
        state.pinned = action.payload.data;
      })
      .addCase(fetchPinned.rejected, (state) => {});
  },
});

// Action creators are generated for each case reducer function
export const {
  setPlayer,
  setPlayers,
  setCurrentChat,
  setCurrentHistory,
  setCurrentHistoryId,
  setPlayerHistoryPreview,
  setMode,
  setCompareMode,
  setSelectedPlayers,
  setPinned,
} = playerSlice.actions;

export default playerSlice.reducer;

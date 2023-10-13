import { applyMiddleware, combineReducers, createStore } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import playerReducer from '../redux/features/playerSlice'
import uiReducer from '../redux/features/uiSlice'

const rootReducer = combineReducers({
    playerData: playerReducer,
    uiData: uiReducer,
  });

const middleware = [
  thunkMiddleware,
];

export default function store() {
  return createStore(
        rootReducer,
        composeWithDevTools(applyMiddleware(...middleware))
    );
};


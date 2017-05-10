import { combineReducers } from 'redux'
import locationReducer from './location';
import {loadingBarReducer} from 'react-redux-loading-bar'

export const makeRootReducer = (asyncReducers) => {
  return combineReducers({
    location: locationReducer,
      loadingBar:loadingBarReducer,
    ...asyncReducers
  })
};

export const injectReducer = (store, { key, reducer }) => {
  if (Object.hasOwnProperty.call(store.asyncReducers, key)) return

  store.asyncReducers[key] = reducer;
  store.replaceReducer(makeRootReducer(store.asyncReducers))
}

export default makeRootReducer

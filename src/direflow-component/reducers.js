import { combineReducers } from 'redux'
import translateArticle from './TranslateArticle/modules/reducer';

export default function createRootReducer (additionalReducers = {}) {
  const reducers = {
    translateArticle,
  }

  return combineReducers(Object.assign({}, additionalReducers, reducers))
}

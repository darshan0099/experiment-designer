import { createReducer } from '../utils/redux'
import { clone } from 'ramda'
import {
  TIMECHOP_UPDATE,
  SET_MATRIX_LOADING,
  SAVE_MATRICES,
  UPDATE_DIALOG_TEXT,
} from '../constants/index'
import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'

const initialState = {
  app: {
    timeChopData: {
      featureStartTime: '2012-01-01',
      featureEndTime: '2015-01-01',
      labelStartTime: '2012-01-01',
      labelEndTime: '2015-01-01',
      modelUpdateFrequency: '1year',
      trainingDataFrequencies: ['3month','6month'],
      maxTrainingHistories: ['3month'],
      trainingPredictionSpans: ['3month','6month'],
      testDataFrequencies: ['3month'],
      testSpans: ['1month'],
      testPredictionSpans: ['3month']
    },
    timechopMatrices: {
      data: [],
      loading: false,
      error: '',
    },
    currentDialog: '',
  }
}

const app = createReducer(initialState, {
  [TIMECHOP_UPDATE]: (state, payload) => {
    let newState = clone(state)
    if(payload.field.endsWith('Time') || payload.field.endsWith('Frequency')) {
      newState.timeChopData[payload.field] = payload.value
    } else {
      newState.timeChopData[payload.field] = payload.value.split(',')
    }
    return newState
  },
  [SET_MATRIX_LOADING]: (state, payload) => {
    let newState = clone(state)
    newState.timechopMatrices['loading'] = payload
    return newState
  },
  [SAVE_MATRICES]: (state, payload) => {
    let newState = clone(state)
    newState.timechopMatrices.data = payload.data
    newState.timechopMatrices.error = payload.error
    return newState
  },
  [UPDATE_DIALOG_TEXT]: (state, payload) => {
    let newState = clone(state)
    newState.currentDialog = payload
    return newState
  }
})
const rootReducer = combineReducers({
  routing: routerReducer,
  app,
})

export { rootReducer, initialState }

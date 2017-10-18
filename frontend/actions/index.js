import {
  TIMECHOP_UPDATE,
  SAVE_MATRICES,
  SET_MATRIX_LOADING,
  UPDATE_DIALOG_TEXT
} from '../constants/index'
import { length } from 'ramda'


export function updateTimechopValue(field, value) {
  return {
    type: TIMECHOP_UPDATE,
    payload: { field, value }
  }
}

export function setMatrixLoading(isLoading) {
  return {
    type: SET_MATRIX_LOADING,
    payload: isLoading
  }
}

export function saveMatrices(matrices) {
  return {
    type: SAVE_MATRICES,
    payload: matrices
  }
}

export function updateDialogText(dialogText) {
  return {
    type: UPDATE_DIALOG_TEXT,
    payload: dialogText
  }
}


function submitTimechopData(timechopData) {
  return fetch(
    'matrices.json', {
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
      },
      dataType: 'json',
      body: JSON.stringify(timechopData)
    }
  )
}

export function chopTime(timechopData) {
  return function(dispatch) {
    dispatch(setMatrixLoading(true))
    return submitTimechopData(timechopData)
      .then((resp) => resp.json())
      .then((data) => dispatch(saveMatrices(data)))
      .then(() => dispatch(setMatrixLoading(false)))
  }
}

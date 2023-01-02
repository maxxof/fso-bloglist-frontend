import { createSlice } from '@reduxjs/toolkit'

let timeoutID

const notificationSlice = createSlice({
  name: 'notification',
  initialState: null,
  reducers: {
    setNotif(state, action) {
      const content = action.payload
      return content
    }
  }
})

export const { setNotif } = notificationSlice.actions

export const setNotification = (notification) => {
  return dispatch => {
    clearTimeout(timeoutID)
    dispatch(setNotif(notification))
    timeoutID = setTimeout(() => {
      dispatch(setNotif(null))
    }, 5000)
  }
}

export default notificationSlice.reducer
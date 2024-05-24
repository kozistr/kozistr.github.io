import { configureStore } from '@reduxjs/toolkit'

import reducer, { initialState } from './reducer'

const createStore = () => {
  return configureStore({
    reducer: reducer,
    preloadedState: initialState,
  })
}

export default createStore

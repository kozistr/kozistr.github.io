import { createStore as reduxCreateStore } from 'redux'

import reducer, { initialState } from './reducer'

const createStore = () => reduxCreateStore(reducer, initialState)
export default createStore

import { createStore, combineReducers } from 'redux';
import customizationReducer from './customizationReducer';
import otherReducer from './reducer'; // example for another reducer

const rootReducer = combineReducers({
    customization: customizationReducer,
    other: otherReducer
});

const store = createStore(rootReducer);

export default store;

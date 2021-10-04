import { combineReducers } from 'redux';
import coinsReducer from './coinsReducer';
import selectedCoinReducer from './selectedCoinReducer';
import chartReducer from './chartReducer';
import chartDurationReducer from './chartDurationReducer';
import pageReducer from './pageReducer';

export default combineReducers({
    coins: coinsReducer,
    page: pageReducer,
    selectedCoin: selectedCoinReducer,
    chartData: chartReducer,
    chartDuration: chartDurationReducer
});
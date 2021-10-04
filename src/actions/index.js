import coinApi from "../apis/coinApi";

export const fetchCoins = (page) => async dispatch => { 
    const response = await coinApi.get(`/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=25&page=${page}&sparkline=false`);

    dispatch({
        type: 'FETCH_COINS',
        payload: response.data
    });

};

export const fetchCoinDetails = (id) => async dispatch => {    
    const response = await coinApi.get(`/coins/${id}`);

    dispatch({
        type: 'FETCH_COIN_DETAILS',
        payload: response.data
    });

};

export const fetchCoinChart = (id, duration) => async dispatch => {    
    const response = await coinApi.get(`/coins/${id}/market_chart?vs_currency=usd&days=${duration}`);

    dispatch({
        type: 'FETCH_COIN_CHART',
        payload: response.data
    });

};

export const selectDuration = (duration) => {    
    return({
        type: 'SELECT_DURATION',
        payload: duration
    });

};

export const setPage = (page) => {    
    return({
        type: 'SET_PAGE',
        payload: page
    });
};
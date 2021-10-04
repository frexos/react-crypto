export default (state = {}, action) => {
    switch (action.type) {
        case 'FETCH_COIN_CHART':
            return action.payload;
        default:
            return state;
    }
}; 
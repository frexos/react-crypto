export default (state = {}, action) => {
    switch (action.type) {
        case 'FETCH_COIN_DETAILS':
            return { ...state, [action.payload.id]: action.payload };
        default:
            return state;
    }
}; 
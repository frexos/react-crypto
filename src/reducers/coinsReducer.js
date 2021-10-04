export default (state = [], action) => {

    switch (action.type) {
        case 'FETCH_COINS':
            return [...state, ...action.payload]
        default:
            return state;
    }
}; 
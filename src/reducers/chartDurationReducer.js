export default (state = 'max', action) => {
    switch (action.type) {
        case 'SELECT_DURATION':
            return action.payload;
        default:
            return state;
    }
}; 


const notificationReducer = (state, action) => {

    switch(action.type){
        case "like":
            return {
                ...state,
                ...action.payload
            }
        case "comment":
            return {
                ...state,
                ...action.payload
            }
        default:
            throw new Error("Lỗi")
    }

    return state

}

export default notificationReducer
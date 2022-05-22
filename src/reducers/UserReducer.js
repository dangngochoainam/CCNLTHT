
const userReducer = (state, action) => {

    switch(action.type){
        case "login":
            return action.payload
        case "logout":
            return null   
        default: 
            return state
    }
    return state
}

export default userReducer
let userState;

if (window.localStorage.getItem("auth")) {
  userState = JSON.parse(window.localStorage.getItem("auth"));
} else {
  userState = null; // {}
}

export const authReducer = (state = userState, action) => {
  switch (action.type) {
    case "LOGGED_IN_USER":
      return { ...state, ...action.payload };

    case "UPDATE_USER_PROFILE":
      return { ...state, ...action.payload };
    
    case "USER_RESET":
      return {  };

    case "LOGOUT":
      return action.payload;
    default:
      return state;
  } 
};

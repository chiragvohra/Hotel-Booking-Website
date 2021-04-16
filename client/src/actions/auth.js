import axios from "axios";

export const register = async (user) =>
  await axios.post(`/api/users/register`, user);

export const login = async (user) =>
  await axios.post(`/api/users/login`, user);

// update user in local storage
export const updateUserInLocalStorage = (user, next) => {
  if (window.localStorage.getItem("auth")) {
    let auth = JSON.parse(localStorage.getItem("auth"));
    auth.user = user;
    localStorage.setItem("auth", JSON.stringify(auth));
    next();
  }
};


export const updateUserProfile = async (token, id, name, email, password) =>
    await axios.put(`/api/users/profile`,{id, name, email, password},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

/* All the needed components for the page are imported */
import { useState } from "react";
import jwt_decode from "jwt-decode";

/* Token expiration time is augmented */ 
export default function useToken() {
  function getToken() {
    const tokenString = localStorage.getItem("token");
    if (tokenString) {

      console.log("token",tokenString)
      const decodedToken = jwt_decode(tokenString);
      const now = new Date().getTime();
      const expiresIn = decodedToken.exp*1000 - now;

      if (expiresIn <= 0) {
        localStorage.removeItem("token");
        console.log("found expired token and removed it")
        return undefined;
      } else return tokenString;

    } else return undefined;
  }

  const [token, setToken] = useState(getToken());

  /* When the token is changed, it is saved in the local storage */
  const saveToken = (userToken) => {
    if(userToken)
      localStorage.setItem("token", userToken);
    setToken(userToken);
  };

  return {
    token,
    setToken: saveToken,
  };
}

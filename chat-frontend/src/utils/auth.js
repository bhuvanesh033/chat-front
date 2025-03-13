export const getToken = () => {
    return localStorage.getItem("token");
  };
  
  export const clearToken = () => {
    localStorage.removeItem("token");
  };
  
const WSTOKEN = "KJUH37IYFBHJFSD7TFASBN6TJBYHB6TBTYDFT"; // Temporary token
export function getToken() {
  return window.localStorage.getItem("token") || WSTOKEN;
}

export function setToken(token: string) {
  window.localStorage.setItem("token", token);
  // WSTOKEN = token;
}
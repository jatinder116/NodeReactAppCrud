let saveParams = (function() {
    let token = "";
    let getToken = function() {
      return token;    // Or pull this from cookie/localStorage
    };
  
    let setToken = function(jtoken) {
      token = jtoken;     
      // Also set this in cookie/localStorage
    };
  
    return {
      getToken: getToken,
      setToken: setToken
    }
  })();
  
  export default saveParams;
  
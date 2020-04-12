const getList = () => {
    return fetch("http://localhost:5000/api/processes")
  };
  const killAll = () => {
    return fetch("http://localhost:5000/api/kill", { method: "DELETE" })
  };
  
  const webServer = () => {
    return fetch("http://localhost:5000/api/launch/web", { method: "POST" }).then(
      (r) => {
        console.log("api/launch/web", r);
      }
    );
  };
  
  const handsServer = () => {
    return fetch("http://localhost:5000/api/launch/hands", { method: "POST" }).then(
      (r) => {
        console.log("api/launch/hands", r);
      }
    );
  };
  
  const leapServer = () => {
    return fetch("http://localhost:5000/api/launch/leapd", { method: "POST" }).then(
      (r) => {
        console.log("api/launch/leapd", r);
      }
    );
  };
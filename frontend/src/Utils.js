export const getList = () => {
  return fetch("http://localhost:5000/api/processes")
};
export const killAll = () => {
  return fetch("http://localhost:5000/api/kill", { method: "DELETE" })
};

export const webServer = () => {
  return fetch("http://localhost:5000/api/launch/web", { method: "POST" })
};

export const handsServer = () => {
  return fetch("http://localhost:5000/api/launch/hands", { method: "POST" })
};

export const leapServer = () => {
  return fetch("http://localhost:5000/api/launch/leapd", { method: "POST" })
};
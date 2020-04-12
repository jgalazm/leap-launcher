import React from 'react';
import logo from './logo.svg';
import styles from './App.module.css';

const getList = () => {
  return fetch("http://localhost:5000/api/processes")
    .then((r) => r.json())
    .then((r) => {
      const element = document.getElementById("logs");
      element.innerText = JSON.stringify(r, null, 2);
    });
};
const killAll = () => {
  return fetch("http://localhost:5000/api/kill", { method: "DELETE" })
    .then((r) => r.json())
    .then((r) => {
      console.log("api/kill", r);
    });
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

const KILLING = 'KILLING';
const LAUNCHING = 'LAUNCHING';
const READY = 'READY';


function App() {
  return (
    <div className={styles.App}>
        asd
    </div>
  );
}

export default App;

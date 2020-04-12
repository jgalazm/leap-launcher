import React from "react";
import logo from "./logo.svg";
import styles from "./App.module.css";
import * as Utils from './Utils';

const STARTING = "STARTING";
const KILLING = "KILLING";
const LAUNCHING = "LAUNCHING";
const READY = "READY";

function App() {
  const [screen, setScreen] = React.useState(STARTING);
  const [processesList, setProcessesList] = React.useState([]);
  React.useEffect(() => {
    const interval = setInterval(() => {
      Utils.getList().then(async r => {
        if (r.ok) {
          const list = await r.json()
          setProcessesList(list['processes']);
        }
      })
      return () => {
        clearInterval(interval);
      }
    }, 3000);

  }, [])

  return <div className={styles.App}>{processesList.map(r => <div key={r}>{r}</div>)}</div>;
}

export default App;

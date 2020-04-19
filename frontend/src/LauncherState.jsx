import React from "react";
import styles from "./LauncherState.module.css";
import "typeface-roboto";

export default function ({ screen, processesList, serversAck }) {
  return (
    <>
      <div className={styles.App}>
        <h1>{screen}</h1>
        <div>
          {processesList.map((r) => (
            <div key={r}>{r}</div>
          ))}
        </div>

        <div>
          {serversAck.map((s) => (
            <div key={s}>{s}</div>
          ))}
        </div>
      </div>
    </>
  );
}

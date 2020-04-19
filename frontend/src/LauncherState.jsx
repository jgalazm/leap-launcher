import React from "react";
import styles from "./LauncherState.module.css";
import { CircleProgress } from "react-gradient-progress";
import { OPEN } from "./App";

export default function ({ screen, processesList, serversAck, screenOrder }) {
  const percentage = parseInt(
    (screenOrder.findIndex((s) => s === screen) / (screenOrder.length - 1)) *
      100
  );
  console.log([
    getComputedStyle(document.body).getPropertyValue("--tertiary-color"),
    getComputedStyle(document.body).getPropertyValue("--primary-text-color"),
  ]);

  return (
    <>
      <div className={styles.App}>
        <CircleProgress
          percentage={percentage}
          strokeWidth={8}
          primaryColor={[
            getComputedStyle(document.body)
              .getPropertyValue("--tertiary-color")
              .replace(" ", ""),
            getComputedStyle(document.body)
              .getPropertyValue("--primary-text-color")
              .replace(" ", ""),
          ]}
          secondaryColor={getComputedStyle(document.body)
            .getPropertyValue("--primary-transparent-color")
            .replace(" ", "")}
        />
        <div className={styles.header}>{screen}</div>
        {screen === OPEN && (
          <div className={styles.subtitle}>Press SPACE or ENTER to start</div>
        )}
        {/* <div className={styles.serversStatus}>
          <ul>
            <li>web</li>
            <li>hands</li>
            <li>leapd</li>
          </ul>
        </div> */}
        {/* <div>
          {processesList.map((r) => (
            <div key={r}>{r}</div>
          ))}
        </div> */}

        {/* <div>
          {serversAck.map((s) => (
            <div key={s}>{s}</div>
          ))}
        </div> */}
      </div>
    </>
  );
}

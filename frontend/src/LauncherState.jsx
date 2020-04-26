import React from "react";
import styles from "./LauncherState.module.css";
import { CircleProgress } from "react-gradient-progress";
import { OPEN } from "./App";

export default function ({ screen, processesList, serversAck, screenOrder }) {
  const percentage = parseInt(
    (screenOrder.findIndex((s) => s === screen) / (screenOrder.length - 1)) *
      100
  );

  const expectedServers = [
    { name: "leapd", port: 6436 },
    { name: "leapd", port: 6437 },
    { name: "leapd", port: 6438 },
    { name: "leapd", port: 6439 },
    { name: "web", port: 8000 },
    { name: "hands", port: 8765 },
  ];

  const serversStatus = expectedServers.map((server) => {
    return {
      ...server,
      isListening: processesList.some((p) => p.includes(server.port)),
    };
  });

  return (
    <>
      <div className={styles.App}>
        <CircleProgress
          percentage={percentage}
          strokeWidth={8}
          primaryColor={[
            getComputedStyle(document.body)
              .getPropertyValue("--primary-text-color")
              .replace(" ", ""),
            getComputedStyle(document.body)
              .getPropertyValue("--primary-text-color")
              .replace(" ", ""),
          ]}
          secondaryColor={getComputedStyle(document.body)
            .getPropertyValue("--secondary-color")
            .replace(" ", "")}
        />
        <div className={styles.header}>{screen}</div>
        {screen === OPEN && (
          <div className={styles.subtitle}>Press SPACE or ENTER to start</div>
        )}
        <div className={styles.serversStatus}>
          {serversStatus.map((server) => {
            return (
              <div
                key={`${server.name}:${server.port}`}
                className={styles.serverRow}
              >
                <div
                  className={[
                    styles.circle,
                    !server.isListening ? styles.failed : "",
                  ].join(" ")}
                ></div>
                <span>{`${server.name}:${server.port}`}</span>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

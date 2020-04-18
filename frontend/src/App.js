import React from "react";
import styles from "./App.module.css";
import * as Utils from "./Utils";

/** Launcher status */
const STARTING = "STARTING";
const KILLING = "KILLING";
const KILLING_ACK = "KILLING_ACK";
const KILLED = "KILLED";
const FAILED_TO_KILL = 'FAILED_TO_KILL'; // not used yet
const LAUNCHING = "LAUNCHING";
const READY = "READY";
const OPEN = 'OPEN';

/** Available servers */
const WEB_SERVER = 'WEB_SERVER';
const HANDS_SERVER = 'HANDS_SERVER';
const LEAP_SERVER = 'LEAP_SERVER';

function App() {

  /** Description of the current stage of the launcher */
  const [screen, setScreen] = React.useState(STARTING);
  
  /** List of host processes according to the lsof command 
   * useful to know if a server (web, hands, leapd) is running or not.
  */
 
  const [processesList, setProcessesList] = React.useState([]);
  
  /** List of servers (web, hands, leapd) for which the
   * launcher backend has sent an ack, i.e., a "start" command
   * has been sent.
   */
  const [serversAck, setServersAck] = React.useState([]);

  React.useEffect(() => {
    const interval = setInterval(() => {
      Utils.getList().then(async (r) => {
        if (r.ok) {
          const list = await r.json();
          setProcessesList(list["processes"]);
        }
      });
      return () => {
        clearInterval(interval);
      };
    }, 4000);
  }, []);

  React.useEffect(() => {
    const killed_already = processesList.every(
      (p) =>
        !p.includes("8000") && !p.includes("8765") && !p.includes("leapd")
    );

    if (screen === STARTING) {
      /** Wait for data to be received */
      if (processesList.length === 0) return;

      /** Once received, all servers may have already been killed */
      if (killed_already) {
        setScreen(KILLED);
        return;
      }

      /** Otherwise send a kill command */
      setScreen(KILLING);
      Utils.killAll().then((r) => {
        if (r.ok) {
          /** kill cmd was acknowledged by the backend */
          setScreen(KILLING_ACK);
          return;
        }
      });
      return;
    }

    if (screen === KILLING_ACK) {
      if (killed_already) {
        setScreen(KILLED);
      }
      return;

      /** TODO: timeout error since killing  */
    }

    if (screen === KILLED) {
      setScreen(LAUNCHING);

      Utils.webServer().then(r => {
        if (r.ok) {
          setServersAck(serversAck => [...serversAck, WEB_SERVER]);
        }
      })

      Utils.handsServer().then(r => {
        if (r.ok) {
          setServersAck(serversAck => [...serversAck, HANDS_SERVER]);
        }
      })

      Utils.leapServer().then(r => {
        if (r.ok) {
          setServersAck(serversAck => [...serversAck, LEAP_SERVER]);
        }
      })

      return;
    }

    if (screen === LAUNCHING) {
      if (serversAck.includes(WEB_SERVER, HANDS_SERVER, LEAP_SERVER)) {
        const webServerReady = processesList.some(p => p.includes('8000'));
        const handsServerReady = processesList.some(p => p.includes('8765'));
        const leapServerReady = processesList.some(p => p.includes('leapd'));

        if (webServerReady && handsServerReady && leapServerReady) {
          setScreen(READY);
        }
      }
    }

    if (screen == READY){
      window.open("http://localhost:8000");
      setScreen(OPEN);
    }

  }, [screen, processesList, serversAck]);

  const startTsunamilab = () => {
    window.open("http://localhost:8000");
  }

  React.useEffect(() => {
    document.body.onkeypress = (ev) => {
      if (screen == OPEN && (ev.key === ' ' || ev.key === 'Enter')) {
        startTsunamilab()
      }
    };
  }, [screen]);

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
          {serversAck.map(s => <div key={s}>{s}</div>)}
        </div>

      </div>
    </>
  );
}

export default App;

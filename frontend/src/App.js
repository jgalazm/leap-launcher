import React from "react";
import LauncherState from './LauncherState';
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

const order = [
  STARTING,
  KILLING,
  KILLING_ACK,
  KILLED,
  FAILED_TO_KILL,
  LAUNCHING,
  READY,
  OPEN
];

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

    if (screen == READY) {
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

  // const processesList = [
  //   "systemd-r   808 systemd-resolve   13u  IPv4  24770      0t0  TCP 127.0.0.53:53 (LISTEN)\r",
  //   "sshd       1670            root    3u  IPv4  42951      0t0  TCP *:22 (LISTEN)\r",
  //   "sshd       1670            root    4u  IPv6  42953      0t0  TCP *:22 (LISTEN)\r",
  //   "cupsd      6836            root    6u  IPv6  58321      0t0  TCP [::1]:631 (LISTEN)\r",
  //   "cupsd      6836            root    7u  IPv4  58322      0t0  TCP 127.0.0.1:631 (LISTEN)\r",
  //   "quart      8952            root   10u  IPv4  84133      0t0  TCP 127.0.0.1:5000 (LISTEN)\r",
  //   "node       9160            root   22u  IPv4  84202      0t0  TCP *:80 (LISTEN)\r",
  //   "python3   25154            jose    3u  IPv4 160060      0t0  TCP *:8000 (LISTEN)\r",
  //   "python3   25223            jose    6u  IPv4 158208      0t0  TCP *:8765 (LISTEN)\r",
  //   "leapd     25295            root   13u  IPv4 156549      0t0  TCP 127.0.0.1:6438 (LISTEN)\r",
  //   "leapd     25295            root   15u  IPv4 156551      0t0  TCP 127.0.0.1:6439 (LISTEN)\r",
  //   "leapd     25295            root   23u  IPv4 157158      0t0  TCP 127.0.0.1:6437 (LISTEN)\r",
  //   "leapd     25295            root   25u  IPv4 155648      0t0  TCP 127.0.0.1:6436 (LISTEN)\r"
  // ];


  // const serversAck = [
  //   "WEB_SERVER",
  //   "HANDS_SERVER",
  //   "LEAP_SERVER"
  // ];

  // React.useEffect(() => {
  //   setInterval(() => {
  //     setScreen(screen => {
  //       const index = order.findIndex(s => s === screen);
  //       setScreen(order[(index + 1) % (order.length - 1)]);
  //     })
  //   }, 5000);
  // }, []);

  return (<LauncherState
    screen={screen}
    screenOrder={order}
    processesList={processesList}
    serversAck={serversAck} />)
}

export default App;

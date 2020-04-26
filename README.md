# leap-launcher
Launcher for a leap-app

![Demo gif](https://raw.githubusercontent.com/jgalazm/leap-launcher/master/docs/demo.gif?token=AA2AL6KDY6G63FKDETRK33C6V437O "demo gif")
# Requirements
- docker
- docker-compose
- A copy of [the tsunami-leap servers folder](https://github.com/Inria-Chile/leap-tsunami/tree/dev/websocket) in your home directory `~/`.

# Installing
1. Clone the repo
```
git clone https://github.com/jgalazm/leap-launcher
docker-compose build
```
2. Create a .env file inside the `leap-launcher` repo with this content:
```
SUDO_USER=<your sudo user>
SUDO_PASS=<your sudo pass>
```


3. Start the servers once with
```
docker-compose up -d
```
The servers will start automatically even if you restart your computer.


4. Copy the Tsunamilab.desktop shortcut icon to your computer desktop.

(Optional) To get the icon right edit the `TsunamiLab.desktop` and change the `Icon` field to match your configuration as:
```
[Desktop Entry]
Encoding=UTF-8
Name=TsunamiLab
Type=Link
URL=http://localhost/
Icon=<leap-launcher repo path>/frontend/public/TSUNAMILAB_icon.svg
```

# Running
Make sure the `leapmotion` is connected. 
This app only launches the servers and does not check for the existance of the camera.

Double click the icon in your desktop or open your browser at  http://localhost.


# How it works
The `leap-launcher`  uses `quart` for the backend and `react` for the frontend. 
The backend `quart` app enables several http endpoints to interact with the host through ssh using `paramiko` to launch and kill servers and also to obtain the list of servers and ports with LISTEN status.  This is similar to running
```
sudo lsof -i -P -n   | grep LISTEN
```
on the host.

This information is used by the frontend to render the current status of the app. Everytime the user opens http://localhost it will poll the current status every 5 seconds and try to restart (kill and launch) all servers.

To start the application automatically without pressing any keys once all servers are ready, you must enable popups for the http://localhost domain from your browser.

# Possible improvements

- [ ] Pass tsunami-leap servers folder path in env vars
- [ ] Write servers logs into separate files
- [ ] Report fetch erros and timeouts in frontend
- [ ] Check which ssh cleanups are necessary
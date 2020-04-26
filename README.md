# leap-launcher
Launcher for a leap-app

# Requirements
- docker
- docker-compose

A copy of this folder `https://github.com/Inria-Chile/leap-tsunami/tree/dev/websocket` at your home directory `~/`.

# Installing
```
git clone https://github.com/jgalazm/leap-launcher
docker-compose build
```
Create a .env file inside the `leap-launcher` repo with this content:
```
SUDO_USER=<your sudo user>
SUDO_PASS=<your sudo pass>
```

# Running
Make sure the `leapmotion` is connected. 
This app only launches the servers and does not check for the existance of the camera.
Then
`docker-compose up -d`
Open your browser at [http://localhost](localhost)

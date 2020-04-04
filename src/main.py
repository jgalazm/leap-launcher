import os
import paramiko
from quart import Quart, jsonify
import launcher

key = paramiko.RSAKey.from_private_key_file("./launcher/id_rsa")
username = os.environ['SUDO_USER']
sudo_password = os.environ['SUDO_PASS']
cmd_runner = launcher.CommandRunner(username, key, sudo_password)


app = Quart(__name__)
@app.route('/processes', methods=['GET'])
async def list_processes():
    processes = cmd_runner.get_listening_process_list()
    return jsonify({
        "processes": processes 
    })


# /kill

# /launch/web

# /launch/hands

# /launch/leapd


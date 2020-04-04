import os
import paramiko
from quart import Quart, make_response, jsonify
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

@app.route("/kill", methods=["DELETE"])
async def kill_servers():
    """ Send kill -9 commands to all servers """
    cmd_runner.kill_servers()
    res = await make_response(jsonify({}), 200)
    return res
# curl -X DELETE http://localhost:5000/kill

# /kill

# /launch/web

# /launch/hands

# /launch/leapd


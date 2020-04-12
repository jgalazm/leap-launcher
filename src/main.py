import os
import asyncio
import paramiko
from quart import Quart, make_response, jsonify, Blueprint
from quart_cors import cors
import launcher


key = paramiko.RSAKey.from_private_key_file("./launcher/id_rsa")
username = os.environ['SUDO_USER']
sudo_password = os.environ['SUDO_PASS']
cmd_runner = launcher.CommandRunner(username, key, sudo_password)


app = Quart(__name__)
api = Blueprint('api', __name__)

@api.route('/processes', methods=['GET'])
async def list_processes():
    # curl -X GET http://localhost:5000/processes
    processes = cmd_runner.get_listening_process_list()
    return jsonify({
        "processes": processes 
    })

@api.route("/kill", methods=["DELETE"])
async def kill_servers():
    """ Send kill -9 commands to all servers """
    # curl -X DELETE http://localhost:5000/kill
    cmd_runner.kill_servers()
    res = await make_response(jsonify({}), 200)
    return res

@api.route("/launch/web", methods=["POST"])
async def launch_web_server():
    """Launches the web server at port 8000"""
    # curl -X POST http://localhost:5000/launch/web
    asyncio.create_task(cmd_runner.run_simple_server())
    res = await make_response(jsonify({}), 200)
    return res

@api.route("/launch/hands", methods=["POST"])
async def launch_hands_server():
    """Launches the hands server at port 8000"""
    # curl -X POST http://localhost:5000/launch/hands
    asyncio.create_task(cmd_runner.run_hands_server())
    res = await make_response(jsonify({}), 200)
    return res

@api.route("/launch/leapd", methods=["POST"])
async def launch_leapd_server():
    """Launches the leapd server at port 8000"""
    # curl -X POST http://localhost:5000/launch/leapd
    asyncio.create_task(cmd_runner.run_leapd_server())
    res = await make_response(jsonify({}), 200)
    return res

api = cors(api, allow_origin='http://localhost')
app.register_blueprint(api, url_prefix='/api')
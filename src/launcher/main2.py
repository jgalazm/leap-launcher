import paramiko
import os
import launcher
from pprint import pprint
import asyncio

async def main():
    key = paramiko.RSAKey.from_private_key_file("./id_rsa")
    username = os.environ['SUDO_USER']
    sudo_password = os.environ['SUDO_PASS']

    cmd_runner = launcher.CommandRunner(username, key, sudo_password)

    # kill servers
    print('Processes before kill:\n', cmd_runner.get_listening_process_list())
    cmd_runner.kill_servers()
    print('Processes after kill:\n', cmd_runner.get_listening_process_list())

    # run simple server
    asyncio.create_task(cmd_runner.run_simple_server())
    processes = cmd_runner.get_listening_process_list()

    # run hands server
    asyncio.create_task(cmd_runner.run_hands_server())
    processes = cmd_runner.get_listening_process_list()

    # run leapd server
    asyncio.create_task(cmd_runner.run_leapd_server())

if __name__ == '__main__':
    loop = asyncio.get_event_loop()
    loop.create_task(main())
    loop.run_forever()
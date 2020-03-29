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
    processes = cmd_runner.get_listening_process_list()
    print('Processes before kill:\n', processes)
    cmd_runner.kill_servers()
    processes = cmd_runner.get_listening_process_list()
    print('Processes after kill:\n', processes)

    # # get list of LISTEN process list
    # processes = cmd_runner.get_listening_process_list()
    # print(processes)

    # # run simple server
    # cmd_runner.run_simple_server()
    # processes = cmd_runner.get_listening_process_list()
    # print('After simple server run:', processes)

    # # run hands server
    # cmd_runner.run_hands_server()
    # processes = cmd_runner.get_listening_process_list()
    # print('After simple server run:', processes)

    # run leapd server
    asyncio.create_task(cmd_runner.run_leapd_server())
    print('RUN LEAPD-----------')
    print('RUN LEAPD-----------')
    print('RUN LEAPD-----------')
    print('RUN LEAPD-----------')
    print('RUN LEAPD-----------')

if __name__ == '__main__':
    asyncio.get_event_loop().create_task(main())
    asyncio.get_event_loop().run_forever()
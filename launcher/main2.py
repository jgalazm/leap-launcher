import paramiko
import os
from pprint import pprint
def run_command(username, pkey, command, blocking=True):
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect( hostname = "localhost", username = username, pkey = key )   

    if not blocking:
        command = command + ' > /dev/null 2>&1 &'
    
    stdin, stdout, stderr = client.exec_command(command)
    stdout = stdout.read().decode('utf-8')
    stderr = stderr.read().decode('utf-8')
    
    client.close()
    return stdout, stderr

key = paramiko.RSAKey.from_private_key_file("./id_rsa")
username = 'jose'

# get list of LISTEN process list
get_listen_cmd = "lsof -i -P -n"
stdout, stderr = run_command(username, key, get_listen_cmd)
print([l for l in stdout.split('\n') if 'LISTEN' in l])

# kill servers 
for port in [8000, 8765]:
    get_killport_cmd = f"lsof -t -i:{port}"
    stdout, stderr = run_command(username, key, get_killport_cmd)

    if stdout != '':
        for process_id in stdout.split('\n'):
            process_id = int(process_id)
            kill_process_cmd = f"kill -9 {process_id}"
            stdout, stderr = run_command(username, key, kill_process_cmd)
            print(stdout)

# get list of LISTEN process list
get_listen_cmd = "lsof -i -P -n"
stdout, stderr = run_command(username, key, get_listen_cmd)
print([l for l in stdout.split('\n') if 'LISTEN' in l])

# run simple server
simple_server_cmd = "cd ~/hands_server && python3 -m http.server "
stdout, stderr = run_command(username, key, simple_server_cmd, False)
print(f'ran {simple_server_cmd}\n')

# get list of LISTEN process list
get_listen_cmd = "lsof -i -P -n"
stdout, stderr = run_command(username, key, get_listen_cmd)
print([l for l in stdout.split('\n') if 'LISTEN' in l])

# run hands server
handss_server_command = "cd ~/hands_server && LD_PRELOAD=./libLeap.so python3 server.py"
stdout, stderr = run_command(username, key, handss_server_command, False)
print(f'ran {handss_server_command}\n')

# get list of LISTEN process list
get_listen_cmd = "lsof -i -P -n"
stdout, stderr = run_command(username, key, get_listen_cmd)
print([l for l in stdout.split('\n') if 'LISTEN' in l])
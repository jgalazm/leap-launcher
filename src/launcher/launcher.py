import paramiko
from enum import Enum
import asyncio
import concurrent.futures
import time

class ServersPorts(Enum):
    SIMPLE_SERVER_PORT = 8000
    HANDS_SERVER_PORT = 8765
    LEAPD_PORT1 = 6437
    LEAPD_PORT2 = 6438
    LEAPD_PORT3 = 6439


class CommandRunner():
    def __init__(self, username, key, sudo_password):
        self.username = username
        self.key = key
        self.sudo_password = sudo_password

    def run_command(self, command, blocking=True):
        client = paramiko.SSHClient()
        client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        client.connect(hostname="localhost",
                       username=self.username, pkey=self.key)

        if not blocking:
            command = command + ' > /dev/null 2>&1 &'

        stdin, stdout, stderr = client.exec_command(command)
        stdout = stdout.read().decode('utf-8')
        stderr = stderr.read().decode('utf-8')

        client.close()
        return stdout, stderr
    
    def read_and_print_stdout(self, stdout):
        while True:
            time.sleep(0.5)
            stdout.flush()
            line = stdout.readline()
            if line != b'' and line.decode('utf-8')[:-2] != self.sudo_password:
                print(line)

    async def run_server_command(self, command):
        client = paramiko.SSHClient()
        client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        client.connect( hostname = "localhost", username = self.username, pkey = self.key )   


        session = client.get_transport().open_session()
        session.set_combine_stderr(True)
        session.get_pty()
        # run commands as user, not as root
        true_command = f'runuser -l {self.username} -c \'{command}\' '
        true_command = f'sudo bash -c "{true_command}"'
        session.exec_command(true_command)
        stdin = session.makefile('wb', -1)
        stdout = session.makefile('rb', -1)
        stdin.write(f'{self.sudo_password}\n')
        stdin.flush()
        with concurrent.futures.ThreadPoolExecutor() as pool:
            await asyncio.get_event_loop().run_in_executor(pool, self.read_and_print_stdout, stdout)

    def get_listening_process_list(self):
        get_listen_cmd = "lsof -i -P -n"
        stdout, stderr = self.run_command(get_listen_cmd)
        return [l for l in stdout.split('\n') if 'LISTEN' in l]

    def kill_servers(self):
        for port in ServersPorts:
            print(f'killing {port.name}:{port.value}')
            get_killport_cmd = f"lsof -t -i:{port.value}"
            stdout, stderr = self.run_command(get_killport_cmd)
            for process_id in stdout.split('\n'):
                if process_id == '':
                    break
                process_id = int(process_id)
                kill_process_cmd = f"kill -9 {process_id}"
                stdout, stderr = self.run_command(kill_process_cmd)
                print(stdout)            

    async def run_simple_server(self):
        simple_server_cmd = "cd ~/hands_server; python3 -m http.server "
        await self.run_server_command(simple_server_cmd)
        print(f'ran {simple_server_cmd}\n')        

    async def run_hands_server(self):
        hands_server_command = "cd ~/hands_server && LD_PRELOAD=./libLeap.so python3 server.py"
        await self.run_server_command(hands_server_command)
        print(f'ran {hands_server_command}\n')        

    async def run_leapd_server(self):
        await self.run_server_command('leapd')
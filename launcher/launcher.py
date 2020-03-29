import paramiko
from enum import Enum


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

    def run_simple_server(self):
        simple_server_cmd = "cd ~/hands_server && python3 -m http.server "
        stdout, stderr = self.run_command(simple_server_cmd, False)
        print(f'ran {simple_server_cmd}\n')        

    def run_hands_server(self):
        hands_server_command = "cd ~/hands_server && LD_PRELOAD=./libLeap.so python3 server.py"
        stdout, stderr = self.run_command(hands_server_command, False)
        print(f'ran {hands_server_command}\n')        


    def run_leapd_server(self):
        client = paramiko.SSHClient()
        client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        client.connect( hostname = "localhost", username = self.username, pkey = self.key )   


        session = client.get_transport().open_session()
        session.set_combine_stderr(True)
        session.get_pty()
        session.exec_command('sudo bash -c "leapd"')
        stdin = session.makefile('wb', -1)
        stdout = session.makefile('rb', -1)
        stdin.write(f'{self.sudo_password}\n')
        stdin.flush()
        while True:
            stdout.flush()
            line = stdout.readline()
            if line != b'':
                print(line)
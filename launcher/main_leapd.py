import paramiko
import os
import launcher
from pprint import pprint
username = os.environ['SUDO_USER']
password = os.environ['SUDO_PASS']


key = paramiko.RSAKey.from_private_key_file("./id_rsa")

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect( hostname = "localhost", username = username, pkey = key )   


session = client.get_transport().open_session()
session.set_combine_stderr(True)
session.get_pty()
session.exec_command('sudo bash -c "leapd"')
stdin = session.makefile('wb', -1)
stdout = session.makefile('rb', -1)
stdin.write(f'{password}\n')
stdin.flush()
while True:
    stdout.flush()
    line = stdout.readline()
    if line != b'':
        print(line)
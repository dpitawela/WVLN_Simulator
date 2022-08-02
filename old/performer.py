import subprocess

# run simulator
process = subprocess.Popen("python simulator1.py",
                           shell=True,
                           stdin=subprocess.PIPE,
                           stdout=subprocess.PIPE,
                           stderr=subprocess.PIPE,
                           )

# read .txt and execute actions
with open('script.txt', 'r') as scr:
    actions = scr.read()

process.stdin.write(actions.encode())

process.stdin.close()
cmd_out = process.stdout.read()
process.stdout.close()
print("cmd_out:", cmd_out.decode(encoding="gbk"))
cmd_error = process.stderr.read()
process.stderr.close()

# run generator
subprocess.call("python generator1.py", shell=True)

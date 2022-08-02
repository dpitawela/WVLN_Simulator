import os
import random
import shutil
import string


def generate_random_str():
    str_list = random.sample(string.digits + string.ascii_letters, 10)
    random_str = ''.join(str_list) + '.html'
    return random_str


def generate_survey(name, allfiles):
    with open(name, 'r', encoding='UTF-8') as file:
        data = file.read()
        data = data.replace('pic1', allfiles[0])
        data = data.replace('pic2', allfiles[1])
        data = data.replace('pic3', allfiles[2])
        data = data.replace('pic4', allfiles[3])
        data = data.replace('pic5', allfiles[4])
        data = data.replace('pic6', allfiles[5])
        data = data.replace('pic7', allfiles[6])
        data = data.replace('pic8', allfiles[7])
        data = data.replace('pic9', allfiles[8])
        data = data.replace('pic0', allfiles[9])
    with open(name, 'w', encoding='UTF-8') as file:
        file.write(data)


if not os.path.exists('surveys'):
    os.mkdir('surveys')

fileList = os.listdir('screenshots/')

i = 1
while i < len(fileList) - 10:
    filename = generate_random_str()
    shutil.copy('format.html', 'surveys/' + filename)
    generate_survey('surveys/' + filename, fileList[i:i + 10])
    i += 10

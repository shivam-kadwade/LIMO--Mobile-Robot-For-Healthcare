'''
	Raspberry Pi GPIO Status and Control
    1,2,3,4 are used for rooms/beds, 5 is used for reception, 6 is used for reset, 7 is used for battery warning.
    variable1 is assigned to rooms 
    variable2 is assigned to beds
    for reception and reset only rooms ie. 5,6 are assigned
'''

#import RPi.GPIO as GPIO ##use this for raspberry-pi
import time
import html
from flask import Flask, render_template, request, jsonify
from multiprocessing import Process
import sys
import serial
app = Flask(__name__)

'''GPIO.setmode(GPIO.BCM)
GPIO.setwarnings(False)
'''

#The following line is for serial over GPIO
port = '/dev/ttyACM0'
ard = serial.Serial(port,9600,timeout=1)
@app.route("/")
def index():
    return render_template('index_1.html')

@app.route('/ret_num', methods = ['POST', 'GET'])
def ret_num():
    var_read=ard.readline()
    line=html.unescape(str(var_read))
    str1=line
    str2='<>-[]/)(*^?\'
    for c in str2:
        str1 = str1.replace(c, '')
    line=str1
    length=len(line)
    print(line)
    if (line.find('7') != -1) and (length<4):
        line='7'
    if (line.find('8') != -1) and (length<4):
        line='8'
    if (line.find('11') != -1) and (length<4):
        line='11'
    time.sleep(0.5)
    return line

@app.route("/<Room>/<Bed>")
def action(Room, Bed):
    if (Room == '1') or (Room == '2') or (Room == '3') or (Room == '4'):
        variable1=Room
        print(variable1)
        ard.write(variable1.encode()) # writing variable to arduino serial port
        time.sleep(2)
        variable2=Bed
        print(variable2)
        ard.write(variable2.encode()) # writing variable to arduino serial port
    if Room =='5':
        variable1='5' #Reception
        print(variable1)
        ard.write(variable1.encode()) # writing variable to arduino serial port
        time.sleep(3)
        variable2=Bed
        print(variable2)
        ard.write(variable2.encode()) # writing variable to arduino serial por
    if Room =='6':
        variable1=6 #Reset
        print(variable1)
        ard.write(variable1.encode()) # writing variable to arduino serial port
if __name__ == "__main__":
    p1=Process(target=app.run(host='192.168.0.146', port=8000, debug=True))
    p1.start()

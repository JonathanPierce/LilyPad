import wx
import json
import os
from os.path import expanduser
from flask import Flask
from flask import request
from flask.ext.cors import CORS, cross_origin

flaskapp = Flask(__name__)
flaskapp.config['CORS_HEADERS'] = 'Content-Type'
cors = CORS(flaskapp)

# create pads.json if it does not already exist
if os.path.exists('pads.json') == False:
    pads = open('pads.json', 'w+')
    pads.write('{"pads": []}')
    pads.close()

@flaskapp.route("/getjson")
def get_json():
    to_open = request.args.get('file')

    json_file = open(to_open, 'r')
    data = json_file.read()
    json_file.close()

    return '{"response": "GetJSON", "JSON": ' + data + '}'

@flaskapp.route("/setjson")
def set_json():
    to_open = request.args.get('file')
    data = request.args.get('data')

    json_file = open(to_open, 'w')
    data = json_file.write(data)
    json_file.close()

    return '{"response": "SetJSON", "success": true}'

@flaskapp.route("/launch")
@cross_origin(headers=['Content-Type'])
def launch():
    script = request.args.get('script')
    
    sh_file = open('launch.sh', 'w')
    sh_file.write(script)
    sh_file.close()

    res = os.system('sh launch.sh &')
    success = 'true'
    if res != 0:
        success = 'false'

    return '{"response": "Launch", "success": ' + success + '}'

@flaskapp.route("/pick")
def get_path():
    wxapp = wx.App(None)
    style = wx.FD_OPEN | wx.FD_FILE_MUST_EXIST | wx.MULTIPLE
    dialog = wx.FileDialog(None, 'Choose some files...', defaultDir=expanduser("~"), wildcard='*', style=style)
    dialog.ToggleWindowStyle(wx.STAY_ON_TOP)
    paths = []
    if dialog.ShowModal() == wx.ID_OK:
        paths = dialog.GetPaths()
    dialog.Destroy()

    return '{"response": "Pick", "sucess": true, "paths": ["' + '","'.join(paths) +'"]}'

    
if __name__ == "__main__":
	flaskapp.run(port=2014)

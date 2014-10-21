import wx
import json
from os.path import expanduser
from flask import Flask
from flask import request
from flask.ext.cors import CORS, cross_origin

flaskapp = Flask(__name__)
flaskapp.config['CORS_HEADERS'] = 'Content-Type'
cors = CORS(flaskapp)

@flaskapp.route("/getjson")
def get_json():
	return ""

@flaskapp.route("/setjson")
def set_json():
	return ""

@flaskapp.route("/launch")
def launch():
	return ""

@flaskapp.route("/pick")
def get_path():
    app = wx.App(None)
    style = wx.FD_OPEN | wx.FD_FILE_MUST_EXIST | wx.MULTIPLE
    dialog = wx.FileDialog(None, 'Choose some files...', defaultDir=expanduser("~"), wildcard='*', style=style)
    paths = []
    if dialog.ShowModal() == wx.ID_OK:
        paths = dialog.GetPaths()
    dialog.Destroy()

    return '{"response": "Pick", "sucess": true, "paths": ["' + '","'.join(paths) +'"]}'

    
if __name__ == "__main__":
	flaskapp.run(port=2014)

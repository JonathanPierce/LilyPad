import wx
from os.path import expanduser
from flask import Flask

flaskapp = Flask(__name__)

@flaskapp.route("/pick")
def get_path():
    app = wx.App(None)
    style = wx.FD_OPEN | wx.FD_FILE_MUST_EXIST | wx.MULTIPLE
    dialog = wx.FileDialog(None, 'Choose some files...', defaultDir=expanduser("~"), wildcard='*', style=style)
    paths = []
    if dialog.ShowModal() == wx.ID_OK:
        paths = dialog.GetPaths()
    dialog.Destroy()
    return paths[0]
    
if __name__ == "__main__":
	flaskapp.run(port=2014)

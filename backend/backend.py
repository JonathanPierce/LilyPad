import wx

def get_path(wildcard):
    app = wx.App(None)
    style = wx.FD_OPEN | wx.FD_FILE_MUST_EXIST | wx.MULTIPLE
    dialog = wx.FileDialog(None, 'Open', wildcard=wildcard, style=style)
    if dialog.ShowModal() == wx.ID_OK:
        paths = dialog.GetPaths()
    dialog.Destroy()
    return paths

print get_path('*')

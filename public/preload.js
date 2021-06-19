const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('scraped', {
    init: async () => await ipcRenderer.invoke('init'),
    save: async data => await ipcRenderer.invoke('save', data),
    fetchClipboard: async () => await ipcRenderer.invoke('fetchClipboard'),
})
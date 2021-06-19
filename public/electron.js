const {app, BrowserWindow, clipboard, ipcMain, session} = require('electron')
const path = require('path')
const isDev = require("electron-is-dev")
const fs = require('fs')
const HTMLParser = require('node-html-parser')

const TOP_URL = isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, "../build/index.html")}`

function createWindow () {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  mainWindow.loadURL(TOP_URL);

  // prevent any links from navigating users to a different page
  mainWindow.webContents.on('will-navigate', ev => {
    ev.preventDefault()
  })

  //mainWindow.webContents.openDevTools()
}

app.whenReady().then(() => {
  createWindow()
  
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})


const HOME_PATH = process.env[process.platform === "win32" ? "USERPROFILE" : "HOME"]
const OUTPUT_PATH = path.join(HOME_PATH, 'scrap.json')
const INITIAL_DATA = JSON.stringify([])

ipcMain.handle('init', (event) => {
    if (fs.existsSync(OUTPUT_PATH)) {
        const data = fs.readFileSync(OUTPUT_PATH)
        const json = JSON.parse(data)
        return {
            date: Date.now(),
            scrapList: json,
        }
    } else {
        fs.writeFileSync(OUTPUT_PATH, INITIAL_DATA)
        return {
            date: Date.now(),
            scrapList: JSON.parse(INITIAL_DATA),
        }
    }
})

ipcMain.handle('save', (event, data) => {
    fs.writeFileSync(OUTPUT_PATH, data)
})

const removeEventAttributes = (elem) => {
  const attrs = Object.keys(elem.attributes)
  for (const attr of attrs) {
    if (attr.startsWith('on')) {
      elem.removeAttribute(attr)
    }
  }
}

ipcMain.handle('fetchClipboard', (event) => {
    const image = clipboard.readImage()

    if (!image.isEmpty()) {
        return {
            date: Date.now(),
            payload: {
                dataType: 'image',
                data: image.toDataURL(),
            },
        }
    }

    const html = clipboard.readHTML()
    if (html !== "") {
      // convert to safe HTML without script
      const parsed = HTMLParser.parse(html,
        {
          blockTextElemnts: {
            script: false,
            noscript: false,
            style: true,
            pre: true,
          }
        })
      parsed.querySelectorAll('*').map(removeEventAttributes)

      return {
        date: Date.now(),
        payload: {
          dataType: 'html',
          data: parsed.toString(),
        }
      }
    }

    const text = clipboard.readText()
    if (text) {
        return {
            date: Date.now(),
            payload: {
                dataType: 'text',
                data: text,
            },
        }
    }

    //console.log('clipboard is empty')
    return null
})
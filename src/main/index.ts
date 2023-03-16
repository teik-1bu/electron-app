import { app } from 'electron'

import { makeAppSetup, makeAppWithSingleInstanceLock } from './factories'
import { MainWindow, registerAboutWindowCreationByIPC, registerMainWindowCheckUpdateByIPC } from './windows'

makeAppWithSingleInstanceLock(async () => {
  await app.whenReady()
  const mainWindow = await makeAppSetup(MainWindow)

  registerAboutWindowCreationByIPC()
  registerMainWindowCheckUpdateByIPC(mainWindow)
})

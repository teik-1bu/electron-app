import { screen } from 'electron';
import { createWindow } from 'main/factories'
import { displayName } from '~/package.json'

export * from './ipcs'

export function AboutWindow() {
  const window = createWindow({
    id: 'about',
    title: `${displayName} - About`,
    width: 450,
    height: 350,
    show: false,
    resizable: false,
    alwaysOnTop: true,
    autoHideMenuBar: true,
  })

  const displays = screen.getAllDisplays();

  const externalDisplay = displays.find((display) => {
    return display.bounds.x !== 0 || display.bounds.y !== 0;
  });

  if (externalDisplay) {
    const { x, y, width, height } = externalDisplay.bounds
    window.setPosition(x + width / 2 - 225, y + height / 2 - 175)
  }

  window.webContents.on('did-finish-load', () => window.show())

  return window
}

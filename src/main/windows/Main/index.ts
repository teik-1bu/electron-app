import { BrowserWindow, Menu, nativeImage, screen, Tray, app } from 'electron';
import { join } from 'path';

import { ENVIRONMENT } from 'shared/constants';
import { createWindow } from 'main/factories';
import { displayName } from '~/package.json';
import { autoUpdater } from 'electron-updater';

export * from './ipcs';

export async function MainWindow() {
  const window = createWindow({
    id: 'main',
    title: displayName,
    width: 700,
    height: 400,
    show: false,
    center: true,
    movable: true,
    resizable: false,
    alwaysOnTop: true,
    autoHideMenuBar: true,

    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  });

  const displays = screen.getAllDisplays();

  const externalDisplay = displays.find((display) => {
    return display.bounds.x !== 0 || display.bounds.y !== 0;
  });

  if (externalDisplay) {
    const { x, y, width, height } = externalDisplay.bounds;
    window.setPosition(x + width / 2 - 350, y + height / 2 - 200);
  }

  window.webContents.on('did-finish-load', () => {
    if (ENVIRONMENT.IS_DEV) {
      window.webContents.openDevTools({ mode: 'detach' });
    }
    window.show();
  });

  window.on('close', (e: Event) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (e as any).sender.hide();
    e.preventDefault();
  });

  const trayIcon = nativeImage.createFromDataURL(
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAaNJREFUWEft1btrVFEQx/FPFBtBFCziI43YGPQfiIiChY1YCBHBWtQ6RRBBUFHxga9CxCKVj0ostRHEwkenFiEpE1RsREFBERKUgVnY5ubcu8uyzZ16zvy+53dm5owYcowMWV8L0DrQOtCvA7twCDvxBVfxvclo9wqwBrfxA+9xF6M4j3ODBtiKtwlwM8We4jCOY2aQAFvS6uuY7hL6hyWsx+9BAazFL8znm3d0HuEY9uB1E/HIbdIDUXw3AuQPNuczHEnxN03FmwCcwH18ww1sxDZ8xGUsV4ivyub8WgVXx4F1+JkFDuaYRcHFGjd+iMd41g/ABZzFO0zUEO2k3MLndKzyWMmB1Wn7BpzORVOH4Vq6drGUXALYi1dZZD9eFgrGgrqDBQREMUoAZ3Apq8TanV2h4jiu4AkeFJUzoQRwD6cyt2rO49ZT2IcA/lBXvM4YxufS2XgvcACx9SI24Sgm8Tz7o2oce27CHZjrOh0LKGY/llGAxHjFRxQ/YU9ReoIouh0nMZab81M2ZjjytyfVrkN1APrVWPF8C9A60DowdAf+A0hOSCHSX+fIAAAAAElFTkSuQmCC'
  );
  const tray = new Tray(trayIcon);
  const menu = Menu.buildFromTemplate([
    {
      label: 'Dashboard',
      click: (): void => {
        window.show();
      }
    },
    { type: 'separator' },
    {
      label: 'Check for Update',
      click: (): void => {
        autoUpdater.checkForUpdatesAndNotify();
      }
    },
    {
      label: 'Quit',
      click: () => {
        BrowserWindow.getAllWindows().forEach((window) => {
          window.removeAllListeners('close');
          window.destroy();
        });
        app.quit();
      }
    }
  ]);
  tray.setToolTip('Eco Sign 2ways');
  tray.setContextMenu(menu);

  return window;
}

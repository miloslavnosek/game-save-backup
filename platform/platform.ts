import * as R from 'ramda';
import os from 'os';
import { mkdir } from "shelljs";
import * as metadata from '../package.json';
import * as application from '../application/application';

const _createAppDataDirPath = () => {
  return R.cond([
    [ R.equals('darwin'), R.always(`~/Library/Application Support/${metadata.name}`) ],
    [ R.equals('win32'), R.always(`%APPDATA%\\Local\\${metadata.name}`) ],
    [ R.equals('linux'), R.always(`~/.local/share/${metadata.name}`) ],
    [ R.T, (_: string) => {
      throw new Error('Your OS is not recognized');
    } ]
  ])(os.platform());
}

export const createAppDataDir = () => mkdir('-p', `${getAppDataDirPath()}`);

export const getAppDataDirPath =
    R.ifElse(
        application.isInDev,
        R.always(`${process.cwd()}/.app-data`),
        _createAppDataDirPath,
    );


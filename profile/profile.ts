import { ShellString } from 'shelljs';
import { promisify } from 'util';
import * as fs from 'fs';
import * as R from 'ramda';
import * as platform from '../platform/platform';
import * as fileSystem from '../fileSystem/fileSystem';

export type Profile = {
  name: string,
  source: string,
  destination: string,
  interval: number,
}


export const doesBackupProfilesFileExist = () => fileSystem.fileExists(`${platform.getAppDataDirPath()}/profiles.json`);

export const createBackupProfileConfigFile = () => {
  if (!doesBackupProfilesFileExist()) {
    ShellString('[]').to(`${platform.getAppDataDirPath()}/profiles.json`);
  }
}

export const getBackupProfiles: () => Promise<Profile[]> = async () => {
  const readFile = promisify(fs.readFile);
  const profiles = await readFile(`${platform.getAppDataDirPath()}/profiles.json`, 'utf8');

  console.log(profiles)
  return JSON.parse(profiles) as Promise<Profile[]>;
}

export const addGameBackupProfile = async (name: string, source: string, destination: string, interval: number) => {
  const newProfile = {
    name,
    source,
    destination,
    interval,
  };
  const existingProfiles = await getBackupProfiles();
  const updatedProfiles = R.append(newProfile, existingProfiles);

  ShellString(JSON.stringify(updatedProfiles, null, 2)).to(`${platform.getAppDataDirPath()}/profiles.json`);
}

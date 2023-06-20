import { rm, ShellString } from 'shelljs';
import * as platform from '../platform/platform';
import * as profile from './profile';
import * as fileSystem from '../fileSystem/fileSystem';

const clearDataDir = () => {
  rm('-r', `${platform.getAppDataDirPath()}/*`);
}

const clearProfiles = () => {
  ShellString('[]').to(`${platform.getAppDataDirPath()}/profiles.json`);
}

const testProfile = {
  name: 'Test Profile',
  source: `${process.cwd()}/test/fixtures/source`,
  destination: `${process.cwd()}/test/fixtures/destination`,
  interval: 1,
}

beforeAll(() => {
  clearDataDir();
});

beforeEach(() => {
  clearProfiles();
});

afterAll(() => {
  clearDataDir();
});

it('should create a file with profile', () => {
  profile.createBackupProfileConfigFile();

  expect(fileSystem.fileExists(`${platform.getAppDataDirPath()}/profiles.json`)).toBe(true);
});

it('should add a new backup profile and get all profiles', async () => {
  const {name, source, destination, interval} = testProfile;

  await profile.addGameBackupProfile(name, source, destination, interval);
  const updatedProfiles = await profile.getBackupProfiles();

  expect(updatedProfiles).toStrictEqual([testProfile]);
});

it('should add multiple backup profiles and get all profiles', async () => {
  const testProfiles = [
    {...testProfile},
    {
      ...testProfile,
      name: testProfile.name + ' 1',
    }];

  for (let {name, source, destination, interval} of testProfiles) {
    await profile.addGameBackupProfile(name, source, destination, interval);
  }

  const updatedProfiles = await profile.getBackupProfiles();

  expect(updatedProfiles).toStrictEqual(testProfiles);
});


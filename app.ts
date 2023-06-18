import * as R from 'ramda';
import * as parseArgs from 'minimist';
import { cp } from 'shelljs';
import { argv, env } from 'process';

const minToMs = (min: number) => min * 60 * 1000;

const getUnixTimestamp = () => Math.floor(Date.now() / 1000);

const copySaveDir = (src: string, dist: string) => {
  const timestamp = getUnixTimestamp();
  const date = new Date();

  console.log(`[${date.getHours()}:${date.getMinutes()}]: Copying ${src} to ${dist}/${timestamp}`);
  cp('-R', src, `${dist}/${timestamp}`);
};

const startBackupInterval = (src: string, dist: string, intervalMs: number) =>
  setInterval(() => copySaveDir(src, dist), intervalMs);

const isInDev = () => R.equals(env.NODE_ENV, 'dev');

const main = () => {
  const args = parseArgs(R.drop(2, argv));
  const srcDir = R.or(args.s, args.source);
  const backupDir = R.or(args.d, args.destination);
  const intervalMin = args.i || args.interval || 7;
  const intervalMs = minToMs(intervalMin);

  if (R.any(R.isNil, [ srcDir, backupDir ])) {
    console.error('Usage example: game-save-backup -s /path/to/saves -d /path/to/backup/dir [interval in minutes]');
    process.exit(1);
  }

  if (isInDev()) {
    copySaveDir(srcDir, backupDir);
  } else {
    startBackupInterval(srcDir, backupDir, intervalMs)
  }
};

main();

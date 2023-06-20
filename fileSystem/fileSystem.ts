import * as fs from 'fs';

export const fileExists = (path) => fs.existsSync(path);

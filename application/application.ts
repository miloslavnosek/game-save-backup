import * as R from "ramda";
import { env } from "process";

export const isInDev = () => R.equals(env.NODE_ENV, 'dev');

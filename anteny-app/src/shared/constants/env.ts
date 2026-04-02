import Constants from 'expo-constants';

interface Env {
  APP_ENV: string;
  MATRIX_PORT: string;
  MATRIX_HOST_SERVER: string;
  MATRIX_URL: string;
  JWT_SECRET: string;
}

const extra = Constants.expoConfig?.extra as Env;

export const ENV: Env = {
  APP_ENV: extra.APP_ENV,
  MATRIX_PORT: extra.MATRIX_PORT,
  MATRIX_HOST_SERVER: extra.MATRIX_HOST_SERVER,
  MATRIX_URL: extra.MATRIX_URL,
  JWT_SECRET: extra.JWT_SECRET,
};

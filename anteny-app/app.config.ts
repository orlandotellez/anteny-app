import 'dotenv/config';
import { ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext) => {
  return {
    ...config,
    extra: {
      ...config.extra,
      APP_ENV: process.env.APP_ENV,
      MATRIX_PORT: process.env.MATRIX_PORT,
      MATRIX_HOST_SERVER: process.env.MATRIX_HOST_SERVER,
      MATRIX_URL: process.env.MATRIX_URL,
      JWT_SECRET: process.env.JWT_SECRET,
    },
  };
};

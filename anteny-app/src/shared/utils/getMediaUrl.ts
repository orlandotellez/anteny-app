import { ENV } from "../constants/env";

export const getMediaUrl = (mxcUrl: string) => {
  if (!mxcUrl) return "";

  const [, server, mediaId] = mxcUrl.match(/^mxc:\/\/([^/]+)\/(.+)$/) || [];

  return `${ENV.MATRIX_URL}/_matrix/media/v3/download/${server}/${mediaId}`;
};

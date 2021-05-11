import {
  handleBodyRequestParsing,
  handleCompression,
  handleCookie,
  handleCors,
} from "./common";

import { handleAPIDocs } from "./apiDocs";
import { handleLogging } from "./logging";
import { handleCSRF, handleHTTPHeaders, handleRateLimit } from "./security";

export default [
  handleCors,
  handleBodyRequestParsing,
  handleCompression,
  handleCookie,
  handleAPIDocs,
  handleRateLimit,
  handleHTTPHeaders,
  handleCSRF,
  handleLogging,
];

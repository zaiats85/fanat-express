import {
  handleBodyRequestParsing,
  handleCompression,
  handleCors,
} from "./common";

import { handleAPIDocs } from "./apiDocs";

export default [
  handleCors,
  handleBodyRequestParsing,
  handleCompression,
  handleAPIDocs,
];

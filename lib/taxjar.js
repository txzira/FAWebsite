// CommonJS Import

import Taxjar from "taxjar";

const client = new Taxjar({
  apiKey: process.env.TAXJAR_API_KEY,
});

export default client;

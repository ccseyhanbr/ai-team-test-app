import assert from "node:assert/strict";
import { after, before, describe, it } from "node:test";

import { createServer } from "../src/server.js";

describe("GET /health", () => {
  let baseUrl;
  let server;

  before(async () => {
    server = createServer();
    await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
    const address = server.address();
    baseUrl = `http://${address.address}:${address.port}`;
  });

  after(async () => {
    await new Promise((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  });

  it("returns status ok as JSON", async () => {
    const response = await fetch(`${baseUrl}/health`);

    assert.equal(response.status, 200);
    assert.match(response.headers.get("content-type"), /^application\/json/);
    assert.deepEqual(await response.json(), { status: "ok" });
  });
});

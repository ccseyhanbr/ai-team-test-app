import http from "node:http";
import { fileURLToPath } from "node:url";

const host = process.env.HOST ?? "127.0.0.1";
const port = Number.parseInt(process.env.PORT ?? "3000", 10);

export function createServer() {
  return http.createServer((request, response) => {
    const url = new URL(request.url ?? "/", `http://${request.headers.host ?? host}`);

    if (request.method === "GET" && url.pathname === "/health") {
      sendJson(response, 200, { status: "ok" });
      return;
    }

    if (request.method === "GET" && url.pathname === "/") {
      sendHtml(response, 200, "<!doctype html><html><head><title>AI Team Test App</title></head><body><h1>AI Team Test App</h1></body></html>");
      return;
    }

    sendJson(response, 404, { error: "not_found" });
  });
}

function sendJson(response, statusCode, body) {
  response.writeHead(statusCode, {
    "content-type": "application/json; charset=utf-8"
  });
  response.end(JSON.stringify(body));
}

function sendHtml(response, statusCode, body) {
  response.writeHead(statusCode, {
    "content-type": "text/html; charset=utf-8"
  });
  response.end(body);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  createServer().listen(port, host, () => {
    console.log(`AI Team Test App listening at http://${host}:${port}`);
  });
}

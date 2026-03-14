import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  stages: [
    { duration: "30s", target: 10 }, // rampa hasta 10 usuarios
    { duration: "1m", target: 10 }, // mantener 10 usuarios 1 minuto
    { duration: "30s", target: 0 }, // bajar a 0
  ],
  thresholds: {
    http_req_duration: ["p(95)<500"], // 95% de requests < 500ms
    http_req_failed: ["rate<0.01"], // menos del 1% de errores
  },
};

export default function main() {
  // Cambia esta URL por la de tu app (puede ser localhost en el runner)
  const res = http.get("https://caso-1-iota.vercel.app/");

  check(res, {
    "status es 200": (r) => r.status === 200,
  });

  sleep(1);
}

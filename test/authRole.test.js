import { authRole } from "../middlewares/authRole.js";

function simulate(middleware, { user }) {
  return new Promise((resolve) => {
    const req = { user };
    const res = {
      status(code) { this.statusCode = code; return this; },
      json(payload) { resolve({ status: this.statusCode, payload }); },
    };
    const next = () => resolve({ status: 200, payload: { ok: true } });
    middleware(req, res, next);
  });
}

(async () => {
  const onlyAdmin = authRole("admin");
  const adminUser = { role: "admin" };
  const coachUser = { role: "coach" };

  // Should allow admin
  const ok = await simulate(onlyAdmin, { user: adminUser });
  if (ok.status !== 200) throw new Error("Expected admin to pass");

  // Should block coach
  const blocked = await simulate(onlyAdmin, { user: coachUser });
  if (blocked.status !== 403) throw new Error("Expected coach to be forbidden");

  // Should block unauthenticated
  const unauth = await simulate(onlyAdmin, { user: undefined });
  if (unauth.status !== 401) throw new Error("Expected unauthenticated to be 401");

  // Multiple roles
  const adminOrCoach = authRole("admin", "coach");
  const okCoach = await simulate(adminOrCoach, { user: coachUser });
  if (okCoach.status !== 200) throw new Error("Expected coach to pass for multi-role");

  console.log("authRole tests passed");
})();




import { validateSignup, validateLogin } from "../middlewares/validation.js";

// Minimal harness to run middleware arrays
function runMiddlewares(middlewares, reqBody) {
  return new Promise((resolve) => {
    const req = { body: reqBody, headers: {} };
    const res = {
      status(code) {
        this.statusCode = code;
        return this;
      },
      json(payload) {
        resolve({ status: this.statusCode, payload });
      },
    };
    let idx = 0;
    const next = () => {
      const mw = middlewares[idx++];
      if (!mw) return resolve({ status: 200, payload: { ok: true } });
      mw(req, res, next);
    };
    next();
  });
}

async function expectValidationFail(middlewares, body) {
  const result = await runMiddlewares(middlewares, body);
  if (result.status !== 422) {
    throw new Error(`Expected 422, got ${result.status}`);
  }
  return result.payload.errors;
}

// Basic tests
(async () => {
  // Signup: missing fields
  await expectValidationFail(validateSignup, {});

  // Signup: weak password
  const weak = await expectValidationFail(validateSignup, {
    name: "Al",
    email: "user@example.com",
    password: "weak",
    gender: "male",
  });
  if (!weak.find((e) => e.field === "password")) {
    throw new Error("Expected password strength error");
  }

  // Login: invalid email
  const badEmail = await expectValidationFail(validateLogin, {
    email: "not-an-email",
    password: "Str0ng!Pass",
  });
  if (!badEmail.find((e) => e.field === "email")) {
    throw new Error("Expected email validation error");
  }

  // Login: good payload should pass
  const ok = await runMiddlewares(validateLogin, {
    email: "user@example.com",
    password: "Str0ng!Pass",
  });
  if (ok.status !== 200) {
    throw new Error("Expected success for valid login payload");
  }

  // If we reach here, tests are OK
  console.log("Validation tests passed");
})();




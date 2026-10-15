import test from "node:test";
import assert from "node:assert/strict";
import { POST } from "../app/api/contact/route.js";

const configKeys = ["FORMSPREE_FORM_ID", "RESEND_API_KEY", "CONTACT_TO_EMAIL", "CONTACT_FROM_EMAIL"];
const validMessage = { name: "Alex <Lee>", email: "alex@example.com", phone: "", message: "Hello <Sachin>, let's talk.", website: "" };
let requestNumber = 0;

function request(payload) {
  return new Request("http://localhost/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-forwarded-for": `contact-test-${++requestNumber}` },
    body: JSON.stringify(payload),
  });
}

async function withConfig(config, callback) {
  const previous = Object.fromEntries(configKeys.map(key => [key, process.env[key]]));
  const originalFetch = globalThis.fetch;
  try {
    for (const key of configKeys) {
      if (config[key] === undefined) delete process.env[key];
      else process.env[key] = config[key];
    }
    await callback();
  } finally {
    for (const key of configKeys) {
      if (previous[key] === undefined) delete process.env[key];
      else process.env[key] = previous[key];
    }
    globalThis.fetch = originalFetch;
  }
}

test("contact delivery requires a configured provider", async () => {
  await withConfig({ FORMSPREE_FORM_ID: "" }, async () => {
    globalThis.fetch = () => { throw new Error("Resend must not be called"); };
    const response = await POST(request(validMessage));
    assert.equal(response.status, 503);
    assert.match((await response.json()).error, /not configured/);
  });
});

test("contact delivery uses the configured public Formspree form by default", async () => {
  await withConfig({}, async () => {
    globalThis.fetch = async (url) => {
      assert.equal(url, "https://formspree.io/f/xvkzdavg");
      return Response.json({ ok: true });
    };
    const response = await POST(request(validMessage));
    assert.equal(response.status, 200);
  });
});

test("Formspree receives validated form fields without a custom sender domain", async () => {
  await withConfig({ FORMSPREE_FORM_ID: "example123" }, async () => {
    globalThis.fetch = async (url, options) => {
      assert.equal(url, "https://formspree.io/f/example123");
      assert.equal(options.headers.Accept, "application/json");
      assert.deepEqual(JSON.parse(options.body), {
        name: "Alex <Lee>", email: "alex@example.com", phone: "", message: "Hello <Sachin>, let's talk.",
      });
      return Response.json({ ok: true });
    };
    const response = await POST(request(validMessage));
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { ok: true });
  });
});

test("Formspree rejection does not claim delivery", async () => {
  await withConfig({ FORMSPREE_FORM_ID: "example123" }, async () => {
    globalThis.fetch = async () => Response.json({ error: "not found" }, { status: 404 });
    const response = await POST(request(validMessage));
    assert.equal(response.status, 502);
  });
});

test("contact delivery sends escaped HTML and keeps the visitor as reply-to", async () => {
  await withConfig({
    FORMSPREE_FORM_ID: "",
    RESEND_API_KEY: "re_test_key",
    CONTACT_TO_EMAIL: "owner@example.com",
    CONTACT_FROM_EMAIL: "Portfolio <hello@example.com>",
  }, async () => {
    globalThis.fetch = async (url, options) => {
      assert.equal(url, "https://api.resend.com/emails");
      assert.equal(options.headers.Authorization, "Bearer re_test_key");
      const email = JSON.parse(options.body);
      assert.equal(email.from, "Portfolio <hello@example.com>");
      assert.deepEqual(email.to, ["owner@example.com"]);
      assert.equal(email.reply_to, "alex@example.com");
      assert.match(email.html, /Alex &lt;Lee&gt;/);
      assert.match(email.html, /Hello &lt;Sachin&gt;/);
      assert.match(email.text, /Hello <Sachin>/);
      return Response.json({ id: "mock-email-id" });
    };
    const response = await POST(request(validMessage));
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { ok: true, id: "mock-email-id" });
  });
});

test("contact delivery reports provider rejection instead of claiming success", async () => {
  await withConfig({
    FORMSPREE_FORM_ID: "",
    RESEND_API_KEY: "re_test_key",
    CONTACT_TO_EMAIL: "owner@example.com",
    CONTACT_FROM_EMAIL: "Portfolio <hello@example.com>",
  }, async () => {
    globalThis.fetch = async () => Response.json({ message: "unverified domain" }, { status: 403 });
    const response = await POST(request(validMessage));
    assert.equal(response.status, 502);
    assert.match((await response.json()).error, /Delivery failed/);
  });
});

test("contact delivery rejects invalid JSON values before reading fields", async () => {
  await withConfig({}, async () => {
    const response = await POST(request(null));
    assert.equal(response.status, 400);
    assert.equal((await response.json()).error, "Invalid request.");
  });
});

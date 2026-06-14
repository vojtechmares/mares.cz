import { describe, expect, it } from "vitest";

import { buildEcomailTags, splitFullName, validateSignup } from "@/lib/newsletter";

const valid = {
  name: "Jan Novák",
  email: "jan@example.com",
  locale: "cs",
  trainingSlug: "kubernetes-pro-zacatecniky",
  consent: true,
};

describe("validateSignup", () => {
  it("accepts a valid payload", () => {
    const result = validateSignup(valid);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value).toEqual({
        name: "Jan Novák",
        email: "jan@example.com",
        locale: "cs",
        trainingSlug: "kubernetes-pro-zacatecniky",
      });
    }
  });

  it("trims whitespace from name and email", () => {
    const result = validateSignup({ ...valid, name: "  Jan Novák  ", email: " jan@example.com " });
    expect(result.ok && result.value.name).toBe("Jan Novák");
    expect(result.ok && result.value.email).toBe("jan@example.com");
  });

  it("requires name and email", () => {
    const result = validateSignup({ ...valid, name: " ", email: "" });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.fields.name).toBe("required");
      expect(result.fields.email).toBe("required");
    }
  });

  it("rejects an invalid email", () => {
    const result = validateSignup({ ...valid, email: "not-an-email" });
    expect(!result.ok && result.fields.email).toBe("invalid");
  });

  it("requires consent", () => {
    const result = validateSignup({ ...valid, consent: false });
    expect(!result.ok && result.fields.consent).toBe("required");
  });

  it("defaults locale to cs and accepts en", () => {
    const en = validateSignup({ ...valid, locale: "en" });
    expect(en.ok && en.value.locale).toBe("en");
    const unknown = validateSignup({ ...valid, locale: "xx" });
    expect(unknown.ok && unknown.value.locale).toBe("cs");
  });

  it("allows a null training slug", () => {
    const result = validateSignup({ ...valid, trainingSlug: null });
    expect(result.ok && result.value.trainingSlug).toBeNull();
  });

  it("rejects a malformed training slug", () => {
    const result = validateSignup({ ...valid, trainingSlug: "bad slug!" });
    expect(!result.ok && result.fields.trainingSlug).toBe("invalid");
  });
});

describe("splitFullName", () => {
  it("splits on the first space into name + surname", () => {
    expect(splitFullName("Jan Novák")).toEqual({ name: "Jan", surname: "Novák" });
  });

  it("keeps everything after the first space as the surname", () => {
    expect(splitFullName("Jan van der Berg")).toEqual({ name: "Jan", surname: "van der Berg" });
  });

  it("leaves the surname empty for a single word", () => {
    expect(splitFullName("Madonna")).toEqual({ name: "Madonna", surname: "" });
  });

  it("normalizes surrounding and repeated whitespace", () => {
    expect(splitFullName("  Jan   Novák  ")).toEqual({ name: "Jan", surname: "Novák" });
  });
});

describe("buildEcomailTags", () => {
  it("includes source and language, plus training when a slug is present", () => {
    expect(buildEcomailTags({ name: "Jan Novák", email: "c@d.cz", locale: "cs", trainingSlug: "react-pro" })).toEqual([
      "web-training-news",
      "lang:cs",
      "training:react-pro",
    ]);
  });

  it("omits the training tag when there is no slug", () => {
    expect(buildEcomailTags({ name: "Jan Novák", email: "c@d.cz", locale: "en", trainingSlug: null })).toEqual([
      "web-training-news",
      "lang:en",
    ]);
  });
});

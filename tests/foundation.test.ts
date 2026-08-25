import { describe, expect, it } from "bun:test";
import { brand } from "../lib/brand";
import { env } from "../lib/env";

describe("Platform Foundation Baseline", () => {
  it("verifies brand configuration constants", () => {
    expect(brand.name).toBe("4TWENTY Operations");
    expect(brand.wordmark).toBe("4TWENTY");
    expect(brand.domainSuffix).toBe(".DEV");
    expect(brand.systemName).toBe("OPERATIONS//CTRL");
  });

  it("verifies environment variable validation schema", () => {
    expect(env.NODE_ENV).toBeDefined();
    expect(env.NEXT_PUBLIC_APP_NAME).toBe("4TWENTY Operations");
    expect(env.NEXT_PUBLIC_APP_URL).toBe("http://localhost:3000");
  });
});

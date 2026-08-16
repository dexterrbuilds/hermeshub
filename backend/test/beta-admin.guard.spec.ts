import { ExecutionContext } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { BetaAdminGuard } from "../src/auth/beta-admin.guard";

function contextWithToken(token?: string) {
  return {
    switchToHttp: () => ({
      getRequest: () => ({
        header: (name: string) => (name === "x-hermes-admin-token" ? token : undefined)
      })
    })
  } as unknown as ExecutionContext;
}

describe("BetaAdminGuard", () => {
  it("allows requests with the configured beta admin token", () => {
    const config = { get: (key: string) => ({ ENABLE_BETA_ADMIN_ENDPOINTS: "true", BETA_ADMIN_TOKEN: "secret" })[key] } as ConfigService;
    expect(new BetaAdminGuard(config).canActivate(contextWithToken("secret"))).toBe(true);
  });

  it("rejects requests without the configured token", () => {
    const config = { get: (key: string) => ({ ENABLE_BETA_ADMIN_ENDPOINTS: "true", BETA_ADMIN_TOKEN: "secret" })[key] } as ConfigService;
    expect(() => new BetaAdminGuard(config).canActivate(contextWithToken("wrong"))).toThrow("You are not allowed to perform this beta operation.");
  });
});

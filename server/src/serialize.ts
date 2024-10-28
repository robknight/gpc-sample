import type { ParcnetAPI } from "@parcnet-js/app-connector";

export type ProveResult = Extract<
  Awaited<ReturnType<ParcnetAPI["gpc"]["prove"]>>,
  { success: true }
>;

export function serializeProofResult(result: ProveResult): string {
  return JSON.stringify(result, (key, value) =>
    typeof value === "bigint" ? `__BIGINT__${value.toString()}` : value
  );
}

export function deserializeProofResult(result: string): ProveResult {
  return JSON.parse(result, (key, value) =>
    typeof value === "string" && value.startsWith("__BIGINT__")
      ? BigInt(value.slice(11))
      : value
  );
}

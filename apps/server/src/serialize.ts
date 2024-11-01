import type { ParcnetAPI } from "@parcnet-js/app-connector";
import { boundConfigFromJSON, GPCBoundConfig, GPCRevealedClaims, revealedClaimsFromJSON } from "@pcd/gpc";

export type ProveResult = Extract<
  Awaited<ReturnType<ParcnetAPI["gpc"]["prove"]>>,
  { success: true }
>;

export function deserializeProofResult(result: string): { boundConfig: GPCBoundConfig, revealedClaims: GPCRevealedClaims } {
  const proofResult = JSON.parse(result);
  return {
    boundConfig: boundConfigFromJSON(proofResult.boundConfig),
    revealedClaims: revealedClaimsFromJSON(proofResult.revealedClaims),
  }
}

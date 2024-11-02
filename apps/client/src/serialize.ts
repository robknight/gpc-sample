import { ParcnetAPI } from "@parcnet-js/app-connector";
import { boundConfigToJSON, revealedClaimsToJSON } from "@pcd/gpc"; 

export type ProveResult = Extract<
  Awaited<ReturnType<ParcnetAPI["gpc"]["prove"]>>,
  { success: true }
>;

/**
 * Serialize a proof result for transmission to the server
 * @param result - The proof result to serialize
 * @returns A JSON string representing the proof result
 */
export function serializeProofResult(result: ProveResult): string {
  const serializedProofResult = {
    proof: result.proof,
    serializedBoundConfig: boundConfigToJSON(result.boundConfig),
    serializedRevealedClaims: revealedClaimsToJSON(result.revealedClaims),
  }
  return JSON.stringify(serializedProofResult);
}
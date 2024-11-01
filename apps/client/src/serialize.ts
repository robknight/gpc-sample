import { ParcnetAPI } from "@parcnet-js/app-connector";
import { boundConfigToJSON, revealedClaimsToJSON } from "@pcd/gpc"; 

export type ProveResult = Extract<
  Awaited<ReturnType<ParcnetAPI["gpc"]["prove"]>>,
  { success: true }
>;

export function serializeProofResult(result: ProveResult): string {
  const proofResult = {
    proof: result.proof,
    serializedBoundConfig: boundConfigToJSON(result.boundConfig),
    serializedRevealedClaims: revealedClaimsToJSON(result.revealedClaims),
  }
  return JSON.stringify(proofResult);
}

// export function deserializeProofResult(result: string): ProveResult {
//   return JSON.parse(result, (key, value) =>
//     typeof value === "string" && value.startsWith("__BIGINT__")
//       ? BigInt(value.slice(11))
//       : value
//   );
// }

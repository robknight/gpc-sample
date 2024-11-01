import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { boundConfigFromJSON, gpcVerify, revealedClaimsFromJSON } from "@pcd/gpc";
import path from "path";
import { DevconTicketProofRequest } from "@repo/shared";

const GPC_ARTIFACTS_PATH = path.join(__dirname, "..", "node_modules", "@pcd", "proto-pod-gpc-artifacts");

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 4000;

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.post("/verify", async (req: Request, res: Response) => {
  const proofResult = req.body;

  // Deserialize values from the client
  const { serializedBoundConfig, serializedRevealedClaims, proof } = proofResult;
  const boundConfig = boundConfigFromJSON(serializedBoundConfig);
  const revealedClaims = revealedClaimsFromJSON(serializedRevealedClaims);

  // Get values from the proof request for verification
  const { proofConfig, membershipLists, externalNullifier, watermark } = DevconTicketProofRequest.getProofRequest();
  
  // Set circuit identifier to the one from the bound config
  proofConfig.circuitIdentifier = boundConfig.circuitIdentifier;

  // Set external nullifier and watermark
  if (revealedClaims.owner && externalNullifier) {
    revealedClaims.owner.externalNullifier = externalNullifier;
  }
  revealedClaims.watermark = watermark;
  // Set membership lists to values from the proof request
  revealedClaims.membershipLists = membershipLists;
  
  const result = await gpcVerify(proof, boundConfig, revealedClaims, GPC_ARTIFACTS_PATH);
  
  res.json({ result });
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
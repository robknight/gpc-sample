import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { gpcVerify } from "@pcd/gpc";
import path from "path";
import { ProveResult } from "./serialize";

const GPC_ARTIFACTS_PATH = path.join(__dirname, "..", "node_modules", "@pcd", "proto-pod-gpc-artifacts");

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.json({
  reviver(key, value) {
    if (typeof value === "string" && value.startsWith("__BIGINT__")) {
      return BigInt(value.slice(11));
    }
    return value;
  },
}));

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.post("/verify", async (req: Request, res: Response) => {
  const proveResult: ProveResult = req.body;
  console.log(proveResult);
  const { proof, revealedClaims, boundConfig } = proveResult;
  const result = await gpcVerify(proof, boundConfig, revealedClaims, GPC_ARTIFACTS_PATH);
  console.log(result);
  res.send("OK");
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
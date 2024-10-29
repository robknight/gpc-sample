import "./style.css";
import { connect, ParcnetAPI, Zapp } from "@parcnet-js/app-connector";
import { serializeProofResult } from "./serialize";
import { DevconTicketProofRequest } from "@repo/shared";

const myApp: Zapp = {
  name: "Devcon Ticket Authentication",
  permissions: {
    REQUEST_PROOF: { collections: ["Tickets"] },
  },
};

let z: ParcnetAPI | undefined = undefined;

async function main(): Promise<void> {
  z = await connect(
    myApp,
    document.querySelector<HTMLDivElement>("#connector")!,
    "https://zupass.org"
  );
  document
    .querySelector<HTMLButtonElement>("#authenticate")!
    .removeAttribute("disabled");
  document
    .querySelector<HTMLButtonElement>("#authenticate")!
    .addEventListener("click", async () => {
      document
        .querySelector<HTMLButtonElement>("#authenticate")!
        .setAttribute("disabled", "true");
      try {
        const proof = await z?.gpc.prove({ request: DevconTicketProofRequest.schema, collectionIds: ["Tickets"] });
        document
          .querySelector<HTMLButtonElement>("#authenticate")!
          .setAttribute("disabled", "true");
        if (proof?.success) {
          document.querySelector<HTMLDivElement>("#details")!.innerHTML = `
        <p>Email address: ${proof.revealedClaims.pods.ticket.entries?.attendeeEmail.value}</p>
        <p>Name: ${proof.revealedClaims.pods.ticket.entries?.attendeeName.value}</p>
      `;
          const serializedProof = serializeProofResult(proof);
          console.log(serializedProof);
          await fetch("http://localhost:3000/verify", {
            method: "POST",
            body: serializedProof,
            headers: {
              "Content-Type": "application/json",
            }
          });
        } else {
          if (proof?.error) {
            document.querySelector<HTMLDivElement>("#details")!.innerHTML = `
          <p>Error: ${proof.error}</p>
        `;
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        document
          .querySelector<HTMLButtonElement>("#authenticate")!
          .removeAttribute("disabled");
      }
    });
}

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div>
    <h1>Devcon Ticket Authentication</h1>
    <div class="card">
      <button id="authenticate" type="button" disabled>Authenticate</button>
    </div>
    <div class="card">
      <div id="details"></div>
    </div>
    <div id="connector"></div>
  </div>
`;

main().catch(console.error);

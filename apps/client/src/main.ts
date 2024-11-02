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

/**
 * Connect to the Zupass server, and set up the UI to authenticate a ticket.
 * 
 * This is implemented as a plain JavaScript function, rather than using a React component.
 * However, the `@parcnet-js/app-connector-react` package offers a React component which
 * you may prefer to use for connection management.
 */
async function main(): Promise<void> {
  // Begin by connecting to Zupass
  z = await connect(
    myApp,
    document.querySelector<HTMLDivElement>("#connector")!,
    "https://zupass.org"
  );
  // Enable the authenticate button
  document
    .querySelector<HTMLButtonElement>("#authenticate")!
    .removeAttribute("disabled");
  // Add an event listener to the authenticate button
  document
    .querySelector<HTMLButtonElement>("#authenticate")!
    .addEventListener("click", async () => {
      // Disable the authenticate button to prevent multiple clicks
      document
        .querySelector<HTMLButtonElement>("#authenticate")!
        .setAttribute("disabled", "true");
      try {
        // Generate the proof
        const proof = await z?.gpc.prove({ request: DevconTicketProofRequest.schema, collectionIds: ["Tickets"] });
        document
          .querySelector<HTMLButtonElement>("#authenticate")!
          .setAttribute("disabled", "true");
        // If the proof was generated successfully, display the details
        if (proof?.success) {
          document.querySelector<HTMLDivElement>("#details")!.innerHTML = `
        <p>Email address: ${proof.revealedClaims.pods.ticket.entries?.attendeeEmail.value}</p>
        <p>Name: ${proof.revealedClaims.pods.ticket.entries?.attendeeName.value}</p>
      `;
          // Serialize the proof for transmission to the server
          const serializedProof = serializeProofResult(proof);
          // Send the proof to the server for verification
          const { result } = await (await fetch("http://localhost:4000/verify", {
            method: "POST",
            body: serializedProof,
            headers: {
              "Content-Type": "application/json",
            }
          })).json();
          // If the server verifies the proof, display a success message
          if (result === true) {
            document.querySelector<HTMLDivElement>("#details")!.innerHTML = `
          <p>Ticket is valid</p>
        `;
          } else {
            document.querySelector<HTMLDivElement>("#details")!.innerHTML = `
          <p>Ticket is invalid</p>
        `;
          }
        } else {
          // If there was an error generating the proof, display an error message
          if (proof?.error) {
            document.querySelector<HTMLDivElement>("#details")!.innerHTML = `
          <p>Error: ${proof.error}</p>
        `;
          }
        }
      } catch (e) {
        // If there was an unexpected error, display an error message to the console
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

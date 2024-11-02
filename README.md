# Z API and GPC demo

This sample application does the following things:

- Using Z API's `z.gpc.prove` method and a proof request, generates a GPC proof
- Using `@pcd/gpc`'s serialization functions, serializes the proof result and config, and sends it to the back-end server app
- In the back-end server app, deserializes the proof, claims, and configuration
- Re-generates the proof config and parts of the proof input from the proof request, and then combines this with the claims to verify that the proof is both cryptographically valid and matches the expected config

This is the full set of steps required to create a client-side proof, and to fully verify it on a server.

## Usage

```shell
$ npm run dev
```

This will watch the `shared` package for changes, and will run both the server and client apps. The server app listens on port 4000, and the client app listens on port 5173. Vist http://localhost:5173 to see the app in action.

## How it works

The `shared` package exports an object called `DevconTicketProofRequest`, which is configured to help with creating proof configurations for Devcon tickets. This is used by the client with the [`z.gpc.prove` method of the Z API](https://zappsdk.netlify.app/guides/getting-started/#making-proofs), and on the server-side for [verification of the proof](https://zappsdk.netlify.app/guides/ticket-proofs/#proof-requests).

The code is commented and explains the workflow.
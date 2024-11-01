import { ticketProofRequest } from "@parcnet-js/ticket-spec";

export const DevconTicketProofRequest = ticketProofRequest({
  classificationTuples: [
    {
      signerPublicKey: "ZeZomy3iAu0A37TrJUAJ+76eYjiB3notl9jiRF3vRJE",
      eventId: "5074edf5-f079-4099-b036-22223c0c6995",
    },
  ],
  fieldsToReveal: {
    attendeeEmail: true,
    attendeeName: true,
  },
});
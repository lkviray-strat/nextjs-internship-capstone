let clientId: string | null = null;

export function getClientId() {
  if (!clientId) {
    clientId = crypto.randomUUID();
  }
  return clientId;
}

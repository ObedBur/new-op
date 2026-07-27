export interface ProviderResponse {
  messageId?: string;
  status?: string;
  [key: string]: unknown;
}

export interface ISmsProvider {
  /** Le nom lisible du fournisseur (ex: 'twilio', 'mock') */
  readonly name: string;

  /** Envoie le SMS au fournisseur externe */
  send(
    phone: string,
    message: string,
    signal?: AbortSignal,
  ): Promise<ProviderResponse>;
}

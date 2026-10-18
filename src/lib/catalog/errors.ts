export type CatalogErrorKind = "network" | "upstream" | "decode";

export interface CatalogErrorOptions {
  status?: number;
  cause?: unknown;
}

export class CatalogError extends Error {
  readonly kind: CatalogErrorKind;
  readonly status?: number;

  constructor(
    kind: CatalogErrorKind,
    message: string,
    options: CatalogErrorOptions = {},
  ) {
    super(message, { cause: options.cause });
    this.name = "CatalogError";
    this.kind = kind;
    this.status = options.status;
  }
}

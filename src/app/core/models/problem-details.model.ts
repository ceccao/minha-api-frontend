// Espelha o formato que o ExceptionMiddleware (backend, CrossCutting) devolve em
// qualquer erro - RFC 7807 (ProblemDetails).
export interface ProblemDetails {
  type?: string;
  title: string;
  status: number;
  detail?: string;
  traceId?: string;
  errors?: string[];
}
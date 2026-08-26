export type ApplicationPayload = {
  nombre: string;
  email: string;
  celular: string;
  edad: number;
  registroVoz: string;
  experiencia: string;
  sobreVos: string;
  consentimiento: true;
};

export type ApplicationResult = {
  success: true;
  id: string;
  message: string;
};

type ErrorResult = {
  success?: false;
  message?: string;
};

const DEFAULT_ERROR = "No pudimos enviar tus datos en este momento. Por favor, intentá nuevamente.";

export async function saveApplication(payload: ApplicationPayload): Promise<ApplicationResult> {
  let response: Response;

  try {
    response = await fetch("/api/join", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new Error(DEFAULT_ERROR);
  }

  let result: ApplicationResult | ErrorResult;
  try {
    result = await response.json() as ApplicationResult | ErrorResult;
  } catch {
    throw new Error(DEFAULT_ERROR);
  }

  if (!response.ok || result.success !== true || !("id" in result) || !result.id) {
    throw new Error(result.message || DEFAULT_ERROR);
  }

  return result;
}

export async function POST() {
  return Response.json(
    { error: "La carga multimedia estará disponible en una próxima versión." },
    { status: 503 },
  );
}

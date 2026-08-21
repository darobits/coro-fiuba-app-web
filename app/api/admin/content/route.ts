const unavailable = () => Response.json(
  { error: "El panel editorial estará disponible en una próxima versión." },
  { status: 503 },
);

export async function GET() {
  return unavailable();
}

export async function POST() {
  return unavailable();
}

export async function DELETE() {
  return unavailable();
}

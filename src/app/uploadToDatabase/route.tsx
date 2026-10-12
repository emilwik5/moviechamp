// Data import disabled.
export async function GET() {
  return new Response("Data import is disabled in this portfolio copy.", {
    status: 410,
  });
}

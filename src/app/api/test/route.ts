export const runtime = "nodejs"
import { prisma } from "@/src/lib/db"

export async function GET() {
  const result = await prisma.verification.findFirst()
  return Response.json({ ok: !!result })
}

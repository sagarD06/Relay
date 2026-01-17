export const runtime = "nodejs"
import { prisma } from "@/lib/db"

export async function GET() {
  const result = await prisma.verification.findFirst()
  return Response.json({ ok: !!result })
}

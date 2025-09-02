import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import crypto from "crypto";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const { usuarioId, texto } = await req.json();

  // Buscar chave privada do usuário
  const usuario = await prisma.usuario.findUnique({ where: { id: usuarioId } });
  if (!usuario) return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });

  // Calcular hash SHA-256
  const hash = crypto.createHash("sha256").update(texto).digest("hex");

  // Assinar hash com chave privada
  const signer = crypto.createSign("SHA256");
  signer.update(hash);
  signer.end();
  const assinatura = signer.sign(usuario.chavePriv, "base64");

  // Salvar assinatura
  const ass = await prisma.assinatura.create({
    data: {
      usuarioId,
      texto,
      hash,
      assinatura,
    },
  });

  return NextResponse.json({ assinaturaId: ass.id });
}

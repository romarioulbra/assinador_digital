import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import crypto from "crypto";

const prisma = new PrismaClient();

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const id = parseInt(params.id);

  const ass = await prisma.assinatura.findUnique({ 
    where: { id },
    include: { usuario: true }
  });

  if (!ass) return NextResponse.json({ error: "Assinatura não encontrada" }, { status: 404 });

  // Verificar assinatura
  const verifier = crypto.createVerify("SHA256");
  verifier.update(ass.hash);
  verifier.end();

  const valida = verifier.verify(ass.usuario.chavePub, ass.assinatura, "base64");
  const resultado = valida ? "VALIDA" : "INVALIDA";

  // Salvar log
  await prisma.logVerificacao.create({
    data: {
      assinaturaId: ass.id,
      resultado,
      algoritmo: "SHA256-RSA",
    },
  });

  return NextResponse.json({
    resultado,
    usuario: ass.usuario.nome,
    algoritmo: "SHA256-RSA",
    dataHora: new Date(),
  });
}

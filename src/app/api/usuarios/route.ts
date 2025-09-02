import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import crypto from "crypto";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const { nome, email } = await req.json();

  // Gerar par de chaves RSA 2048 bits
  const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
    modulusLength: 2048,
    publicKeyEncoding: { type: "spki", format: "pem" },
    privateKeyEncoding: { type: "pkcs8", format: "pem" },
  });

  const usuario = await prisma.usuario.create({
    data: {
      nome,
      email,
      chavePub: publicKey,
      chavePriv: privateKey,
    },
  });

  return NextResponse.json({ usuarioId: usuario.id, chavePub: publicKey });
}

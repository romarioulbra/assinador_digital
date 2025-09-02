import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { generateHash, signText, decryptPrivateKey } from '@/lib/crypto';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    const { text } = await request.json();

    if (!text || text.trim().length === 0) {
      return NextResponse.json(
        { error: 'Texto é obrigatório' },
        { status: 400 }
      );
    }

    // Buscar usuário com chave privada
    const user = await prisma.usuario.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      );
    }

    // Gerar hash do texto
    const hash = generateHash(text);
    
    // Descriptografar chave privada (usando a senha do usuário - em produção, precisaria de um fluxo diferente)
    // Esta é uma simplificação - em produção, precisaria de um mecanismo mais seguro
    const privateKey = decryptPrivateKey(user.chavePriv, "senha-temporaria");

    // Assinar o hash
    const signature = signText(hash, privateKey);

    // Salvar assinatura no banco
    const newSignature = await prisma.assinatura.create({
      data: {
        texto: text,
        hash: hash,
        assinatura: signature,
        usuarioId: user.id,
      },
      include: {
        usuario: {
          select: {
            id: true,
            nome: true,
            email: true,
          }
        }
      }
    });

    return NextResponse.json({
      signature: newSignature,
      message: 'Texto assinado com sucesso'
    });

  } catch (error) {
    console.error('Signing error:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
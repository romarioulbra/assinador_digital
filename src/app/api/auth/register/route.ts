// // app/api/auth/register/route.ts
// import { NextRequest, NextResponse } from 'next/server';
// import { PrismaClient } from '@prisma/client';
// import { hashPassword } from '@/lib/auth';
// import { generateKeyPair, encryptPrivateKey } from '@/lib/crypto';

// export async function POST(request: NextRequest) {
//   // Criar uma instância do PrismaClient para esta requisição
//   const prisma = new PrismaClient();
  
//   try {
//     console.log('Iniciando registro...');
    
//     const { name, email, password } = await request.json();
//     console.log('Dados recebidos:', { name, email });

//     // Validação básica
//     if (!email || !password || !name) {
//       console.log('Dados incompletos');
//       return NextResponse.json(
//         { error: 'Nome, email e senha são obrigatórios' },
//         { status: 400 }
//       );
//     }

//     // Validar formato do email
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(email)) {
//       return NextResponse.json(
//         { error: 'Formato de email inválido' },
//         { status: 400 }
//       );
//     }

//     // Validar força da senha
//     if (password.length < 6) {
//       return NextResponse.json(
//         { error: 'A senha deve ter pelo menos 6 caracteres' },
//         { status: 400 }
//       );
//     }

//     // Verificar se o usuário já existe
//     console.log('Buscando usuário existente...');
//     const existingUser = await prisma.usuario.findUnique({
//       where: { email },
//     });

//     if (existingUser) {
//       console.log('Usuário já existe');
//       return NextResponse.json(
//         { error: 'Já existe um usuário com este e-mail' },
//         { status: 400 }
//       );
//     }

//     console.log('Gerando par de chaves...');
//     // Gerar par de chaves
//     const { publicKey, privateKey } = await generateKeyPair();
    
//     // Criptografar a chave privada com a senha do usuário
//     const encryptedPrivateKey = encryptPrivateKey(privateKey, password);
    
//     // Criptografar a senha
//     const hashedPassword = await hashPassword(password);

//     console.log('Criando usuário no banco...');
//     // Criar o usuário
//     const user = await prisma.usuario.create({
//       data: {
//         nome: name,
//         email,
//         senha: hashedPassword,
//         chavePub: publicKey,
//         chavePriv: encryptedPrivateKey,
//       },
//     });

//     console.log('Usuário criado com sucesso:', user.id);

//     // Remover a senha e chave privada do retorno
//     const { senha: _, chavePriv: __, ...userWithoutSensitiveData } = user;

//     return NextResponse.json(
//       { 
//         user: userWithoutSensitiveData, 
//         message: 'Usuário criado com sucesso' 
//       },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error('Registration error:', error);
    
//     // Tratar erros específicos do Prisma
//     if (error instanceof Error && error.message.includes('Unique constraint')) {
//       return NextResponse.json(
//         { error: 'Já existe um usuário com este e-mail' },
//         { status: 400 }
//       );
//     }
    
//     return NextResponse.json(
//       { error: 'Erro interno do servidor' },
//       { status: 500 }
//     );
//   } finally {
//     // Desconectar o PrismaClient para evitar vazamentos de conexão
//     await prisma.$disconnect();
//   }
// }

// app/api/auth/register/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { hashPassword } from '@/lib/auth';
import { generateKeyPair, encryptPrivateKey } from '@/lib/crypto';

export async function POST(request: NextRequest) {
  const prisma = new PrismaClient();
  
  try {
    console.log('Iniciando registro...');
    
    const { name, email, password } = await request.json();
    console.log('Dados recebidos:', { name, email });

    // Validação básica
    if (!email || !password || !name) {
      console.log('Dados incompletos');
      return NextResponse.json(
        { error: 'Nome, email e senha são obrigatórios' },
        { status: 400 }
      );
    }

    // Validar formato do email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Formato de email inválido' },
        { status: 400 }
      );
    }

    // Validar força da senha
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'A senha deve ter pelo menos 6 caracteres' },
        { status: 400 }
      );
    }

    // Verificar se o usuário já existe
    console.log('Buscando usuário existente...');
    const existingUser = await prisma.usuario.findUnique({
      where: { email },
    });

    if (existingUser) {
      console.log('Usuário já existe');
      return NextResponse.json(
        { error: 'Já existe um usuário com este e-mail' },
        { status: 400 }
      );
    }

    console.log('Gerando par de chaves...');
    // Gerar par de chaves
    const { publicKey, privateKey } = await generateKeyPair();
    
    // Criptografar a chave privada com a senha do usuário
    const encryptedPrivateKey = encryptPrivateKey(privateKey, password);
    
    // Criptografar a senha
    const hashedPassword = await hashPassword(password);

    console.log('Criando usuário no banco...');
    // Criar o usuário
    const user = await prisma.usuario.create({
      data: {
        nome: name,
        email,
        senha: hashedPassword,
        chavePub: publicKey,
        chavePriv: encryptedPrivateKey,
      },
    });

    console.log('Usuário criado com sucesso:', user.id);

    // Remover a senha e chave privada do retorno
    const { senha: _, chavePriv: __, ...userWithoutSensitiveData } = user;

    return NextResponse.json(
      { 
        user: userWithoutSensitiveData, 
        message: 'Usuário criado com sucesso' 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    
    // Tratar erros específicos do Prisma
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return NextResponse.json(
        { error: 'Já existe um usuário com este e-mail' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  } finally {
    // Desconectar o PrismaClient para evitar vazamentos de conexão
    await prisma.$disconnect();
  }
}
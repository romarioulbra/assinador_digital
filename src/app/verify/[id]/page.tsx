
// 'use client';

// import { useState } from 'react';
// import { useParams } from 'next/navigation';

// export default function VerifyPage() {
//   const params = useParams();
//   const [resultado, setResultado] = useState(null);

//   const handleCheck = async (e: React.FormEvent) => {
//     e.preventDefault();
//     const res = await fetch(`/api/verify/${params.id}`);
//     const data = await res.json();
//     setResultado(data);
//   };

//   return (
//     <div className="max-w-md mx-auto mt-8 bg-white p-6 rounded shadow">
//       <h1 className="text-2xl font-bold mb-4">Verificar Assinatura</h1>
//       <form onSubmit={handleCheck} className="flex flex-col gap-4">
//         <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Verificar</button>
//       </form>

//       {resultado && (
//         <div className="mt-4 p-4 border rounded">
//           <p>Resultado: {resultado.resultado}</p>
//           <p>Usuário: {resultado.usuario}</p>
//           <p>Algoritmo: {resultado.algoritmo}</p>
//           <p>Data/Hora: {new Date(resultado.dataHora).toLocaleString()}</p>
//         </div>
//       )}
//     </div>
//   );
// }


import { prisma } from '@/lib/prisma';
import { verifySignature } from '@/lib/crypto';



interface VerifyPageProps {
  params: {
    id: string;
  };
}

export default async function VerifyPage({ params }: VerifyPageProps) {
  const signatureId = parseInt(params.id);
  
  if (isNaN(signatureId)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-6 rounded-xl shadow-md max-w-md w-full">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Erro</h1>
          <p>ID de assinatura inválido.</p>
        </div>
      </div>
    );
  }

  // Buscar assinatura
  const signature = await prisma.assinatura.findUnique({
    where: { id: signatureId },
    include: {
      usuario: {
        select: {
          nome: true,
          email: true,
          chavePub: true,
        }
      },
      logs: {
        orderBy: {
          dataHora: 'desc'
        },
        take: 10
      }
    }
  });

  if (!signature) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-6 rounded-xl shadow-md max-w-md w-full">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Assinatura não encontrada</h1>
          <p>Nenhuma assinatura encontrada com o ID {signatureId}.</p>
        </div>
      </div>
    );
  }

  // Verificar assinatura
  const isValid = verifySignature(signature.hash, signature.assinatura, signature.usuario.chavePub);
  const resultado = isValid ? 'VALIDA' : 'INVALIDA';

  // Registrar verificação
  await prisma.logVerificacao.create({
    data: {
      assinaturaId: signature.id,
      resultado: resultado,
      algoritmo: 'RSA-SHA256'
    }
  });

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-6">
        <h1 className="text-2xl font-bold text-center mb-6">Verificação de Assinatura Digital</h1>
        
        <div className={`p-4 rounded-lg mb-6 ${isValid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          <h2 className="text-xl font-semibold text-center">
            Assinatura: <span className={isValid ? 'text-green-600' : 'text-red-600'}>{resultado}</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">Informações da Assinatura</h3>
            <p><strong>ID:</strong> {signature.id}</p>
            <p><strong>Data:</strong> {new Date(signature.createdAt).toLocaleString('pt-BR')}</p>
            <p><strong>Algoritmo:</strong> RSA-SHA256</p>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">Signatário</h3>
            <p><strong>Nome:</strong> {signature.usuario.nome}</p>
            <p><strong>Email:</strong> {signature.usuario.email}</p>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="font-semibold mb-2">Texto Assinado</h3>
          <div className="bg-gray-100 p-4 rounded-lg">
            <p className="whitespace-pre-wrap">{signature.texto}</p>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="font-semibold mb-2">Hash (SHA-256)</h3>
          <div className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
            <code className="text-sm break-all">{signature.hash}</code>
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Últimas Verificações</h3>
          {signature.logs.length === 0 ? (
            <p className="text-gray-500">Nenhuma verificação registrada.</p>
          ) : (
            <div className="space-y-2">
              {signature.logs.map((log) => (
                <div key={log.id} className="flex justify-between items-center p-2 border-b">
                  <span className={log.resultado === 'VALIDA' ? 'text-green-600' : 'text-red-600'}>
                    {log.resultado}
                  </span>
                  <span className="text-sm text-gray-500">
                    {new Date(log.dataHora).toLocaleString('pt-BR')}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
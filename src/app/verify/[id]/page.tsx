// 'use client';
// import { useEffect, useState } from 'react';

// export default function VerifyPage({ params }: { params: { id: string } }) {
//   const [status, setStatus] = useState<string>('Verificando...');

//   useEffect(() => {
//     const verificar = async () => {
//       const res = await fetch(`/api/verify/${params.id}`);
//       const data = await res.json();
//       setStatus(data.status);
//     };
//     verificar();
//   }, [params.id]);

//   return (
//     <main className="flex flex-col items-center p-8">
//       <h2 className="text-2xl font-bold mb-4 text-blue-600">Verificação</h2>
//       <p className="text-lg">{status}</p>
//     </main>
//   );
// }


'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';

export default function VerifyPage() {
  const params = useParams();
  const [resultado, setResultado] = useState(null);

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch(`/api/verify/${params.id}`);
    const data = await res.json();
    setResultado(data);
  };

  return (
    <div className="max-w-md mx-auto mt-8 bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Verificar Assinatura</h1>
      <form onSubmit={handleCheck} className="flex flex-col gap-4">
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Verificar</button>
      </form>

      {resultado && (
        <div className="mt-4 p-4 border rounded">
          <p>Resultado: {resultado.resultado}</p>
          <p>Usuário: {resultado.usuario}</p>
          <p>Algoritmo: {resultado.algoritmo}</p>
          <p>Data/Hora: {new Date(resultado.dataHora).toLocaleString()}</p>
        </div>
      )}
    </div>
  );
}

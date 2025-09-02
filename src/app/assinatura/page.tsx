'use client';

import { useState } from 'react';

export default function AssinaturaPage() {
  const [usuarioId, setUsuarioId] = useState('');
  const [texto, setTexto] = useState('');
  const [assinaturaId, setAssinaturaId] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch('/api/assinaturas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usuarioId: parseInt(usuarioId), texto }),
    });

    const data = await res.json();
    if (res.ok) setAssinaturaId(data.assinaturaId);
    else setAssinaturaId(`Erro: ${data.error}`);
  };

  return (
    <div className="max-w-md mx-auto mt-8 bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Assinar Texto</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input type="number" placeholder="ID do usuário" value={usuarioId} onChange={e => setUsuarioId(e.target.value)} className="border p-2 rounded" />
        <textarea placeholder="Digite o texto" value={texto} onChange={e => setTexto(e.target.value)} className="border p-2 rounded h-32" />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Assinar</button>
      </form>
      {assinaturaId && <p className="mt-4 text-blue-700">Assinatura ID: {assinaturaId}</p>}
    </div>
  );
}

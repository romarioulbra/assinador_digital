'use client';
import { useState } from 'react';
import { signOut, useSession } from 'next-auth/react';
import { motion } from 'framer-motion';

interface Signature {
  id: number;
  texto: string;
  hash: string;
  assinatura: string;
  createdAt: string;
}

export default function Dashboard() {
  const { data: session } = useSession();
  const [text, setText] = useState('');
  const [isSigning, setIsSigning] = useState(false);
  const [signatures, setSignatures] = useState<Signature[]>([]);
  const [message, setMessage] = useState('');

  const handleSign = async () => {
    if (!text.trim()) {
      setMessage('Por favor, digite um texto para assinar');
      return;
    }

    setIsSigning(true);
    setMessage('');

    try {
      const response = await fetch('/api/sign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (response.ok) {
        const data = await response.json();
        setSignatures([data.signature, ...signatures]);
        setMessage('Texto assinado com sucesso! ID: ' + data.signature.id);
        setText('');
      } else {
        const error = await response.json();
        setMessage('Erro: ' + error.error);
      }
    } catch (error) {
      setMessage('Erro de conexão');
    } finally {
      setIsSigning(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 p-4 bg-white rounded-xl shadow-md">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Sistema de Assinatura Digital</h1>
            <p className="text-gray-600">Bem-vindo, {session?.user?.name}</p>
          </div>
          <button
            onClick={() => signOut()}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
          >
            Sair
          </button>
        </div>

        {/* Área de assinatura */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-xl shadow-md mb-6"
        >
          <h2 className="text-xl font-semibold mb-4">Assinar Texto</h2>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Digite o texto que deseja assinar..."
            className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition mb-4"
          />
          <button
            onClick={handleSign}
            disabled={isSigning}
            className={`px-6 py-2 rounded-lg text-white font-medium transition ${isSigning ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {isSigning ? 'Assinando...' : 'Assinar Texto'}
          </button>

          {message && (
            <div className={`mt-4 p-3 rounded-lg ${message.includes('Erro') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
              {message}
            </div>
          )}
        </motion.div>

        {/* Lista de assinaturas */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-xl shadow-md"
        >
          <h2 className="text-xl font-semibold mb-4">Suas Assinaturas</h2>
          
          {signatures.length === 0 ? (
            <p className="text-gray-500">Nenhuma assinatura criada ainda.</p>
          ) : (
            <div className="space-y-4">
              {signatures.map((signature) => (
                <div key={signature.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium">ID: {signature.id}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(signature.createdAt).toLocaleString('pt-BR')}
                      </p>
                    </div>
                    <a 
                      href={`/verify/${signature.id}`}
                      target="_blank"
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      Verificar
                    </a>
                  </div>
                  <p className="text-gray-700 mb-2">
                    <strong>Texto:</strong> {signature.texto.length > 100 
                      ? `${signature.texto.substring(0, 100)}...` 
                      : signature.texto}
                  </p>
                  <p className="text-sm text-gray-600 break-all">
                    <strong>Hash:</strong> {signature.hash}
                  </p>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
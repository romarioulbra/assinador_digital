// 'use client';
// import { motion } from 'framer-motion';
// import { useState } from 'react';

// export default function RegistroPage() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');

//   const handleRegister = async (e: React.FormEvent) => {
//     e.preventDefault();
//     const res = await fetch('/api/registro', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ email, password })
//     });
//     if (res.ok) alert('Usuário registrado com sucesso!');
//   };

//   return (
//     <main className="flex items-center justify-center h-screen bg-gray-100">
//       <motion.div
//         className="bg-white p-8 rounded-2xl shadow-xl w-96"
//         initial={{ opacity: 0, scale: 0.9 }}
//         animate={{ opacity: 1, scale: 1 }}
//         transition={{ duration: 0.5 }}
//       >
//         <h2 className="text-2xl font-bold text-center mb-6 text-blue-600">Registro</h2>
//         <form onSubmit={handleRegister} className="space-y-4">
//           <input 
//             type="email" 
//             placeholder="Email" 
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             className="w-full p-2 border rounded-lg"
//           />
//           <input 
//             type="password" 
//             placeholder="Senha"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             className="w-full p-2 border rounded-lg"
//           />
//           <button 
//             type="submit"
//             className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
//           >
//             Registrar
//           </button>
//         </form>
//       </motion.div>
//     </main>
//   );
// }


'use client';

import { useState } from 'react';

export default function RegistroPage() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [mensagem, setMensagem] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch('/api/usuarios', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, email }),
    });

    const data = await res.json();
    if (res.ok) setMensagem(`Cadastro realizado! Chave pública: ${data.chavePub}`);
    else setMensagem(`Erro: ${data.error}`);
  };

  return (
    <div className="max-w-md mx-auto mt-8 bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Registro</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input type="text" placeholder="Nome" value={nome} onChange={e => setNome(e.target.value)} className="border p-2 rounded" />
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="border p-2 rounded" />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Cadastrar</button>
      </form>
      {mensagem && <p className="mt-4 text-blue-700">{mensagem}</p>}
    </div>
  );
}

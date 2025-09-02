// 'use client';
// import { motion, AnimatePresence } from 'framer-motion';
// import { signIn } from 'next-auth/react';
// import { useState } from 'react';
// import { useRouter } from 'next/navigation';

// type AuthMode = 'login' | 'register';

// export default function AuthPage() {
//   const [mode, setMode] = useState<AuthMode>('login');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [name, setName] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState('');
//   const router = useRouter();

//   const handleAuth = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setError('');

//     if (mode === 'login') {
//       const result = await signIn('credentials', {
//         email,
//         password,
//         redirect: false,
//       });

//       if (result?.error) {
//         setError('Credenciais inválidas');
//       } else {
//         router.push('/');
//       }
//     } else {
//       // Modo de cadastro
//       if (password !== confirmPassword) {
//         setError('As senhas não coincidem');
//         setIsLoading(false);
//         return;
//       }

//       try {
//         const response = await fetch('/api/auth/register', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({ name, email, password }),
//         });

//         if (response.ok) {
//           // Cadastro bem-sucedido, agora faz login automaticamente
//           const result = await signIn('credentials', {
//             email,
//             password,
//             redirect: false,
//           });

//           if (result?.error) {
//             setError('Cadastro realizado, mas falha no login automático');
//           } else {
//             router.push('/');
//           }
//         } else {
//           const data = await response.json();
//           setError(data.error || 'Erro no cadastro');
//         }
//       } catch (error) {
//         setError('Erro de conexão');
//       }
//     }
    
//     setIsLoading(false);
//   };

//   const toggleMode = () => {
//     setMode(mode === 'login' ? 'register' : 'login');
//     setError('');
//   };

//   return (
//     <main className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
//       <motion.div
//         className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md"
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//       >
//         <div className="flex justify-center mb-6">
//           <div className="relative flex bg-gray-100 rounded-lg p-1">
//             <button
//               className={`relative px-4 py-2 rounded-md transition-all duration-300 ${mode === 'login' ? 'text-white' : 'text-gray-700'}`}
//               onClick={() => setMode('login')}
//             >
//               Login
//               {mode === 'login' && (
//                 <motion.div
//                   className="absolute inset-0 bg-blue-600 rounded-md"
//                   layoutId="activeTab"
//                   transition={{ type: "spring", stiffness: 500, damping: 30 }}
//                 />
//               )}
//             </button>
//             <button
//               className={`relative px-4 py-2 rounded-md transition-all duration-300 ${mode === 'register' ? 'text-white' : 'text-gray-700'}`}
//               onClick={() => setMode('register')}
//             >
//               Cadastro
//               {mode === 'register' && (
//                 <motion.div
//                   className="absolute inset-0 bg-blue-600 rounded-md"
//                   layoutId="activeTab"
//                   transition={{ type: "spring", stiffness: 500, damping: 30 }}
//                 />
//               )}
//             </button>
//           </div>
//         </div>

//         <AnimatePresence mode="wait">
//           <motion.div
//             key={mode}
//             initial={{ opacity: 0, x: mode === 'login' ? -20 : 20 }}
//             animate={{ opacity: 1, x: 0 }}
//             exit={{ opacity: 0, x: mode === 'login' ? 20 : -20 }}
//             transition={{ duration: 0.3 }}
//           >
//             <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
//               {mode === 'login' ? 'Acesse sua conta' : 'Crie sua conta'}
//             </h2>

//             {error && (
//               <motion.div 
//                 initial={{ opacity: 0, y: -10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
//               >
//                 {error}
//               </motion.div>
//             )}

//             <form onSubmit={handleAuth} className="space-y-4">
//               {mode === 'register' && (
//                 <motion.div
//                   initial={{ opacity: 0, height: 0 }}
//                   animate={{ opacity: 1, height: 'auto' }}
//                   transition={{ duration: 0.3 }}
//                 >
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Nome completo
//                   </label>
//                   <input
//                     type="text"
//                     placeholder="Seu nome"
//                     value={name}
//                     onChange={(e) => setName(e.target.value)}
//                     required={mode === 'register'}
//                     className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
//                   />
//                 </motion.div>
//               )}

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   E-mail
//                 </label>
//                 <input
//                   type="email"
//                   placeholder="seu@email.com"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   required
//                   className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Senha
//                 </label>
//                 <input
//                   type="password"
//                   placeholder={mode === 'login' ? 'Sua senha' : 'Crie uma senha segura'}
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   required
//                   className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
//                 />
//               </div>

//               {mode === 'register' && (
//                 <motion.div
//                   initial={{ opacity: 0, height: 0 }}
//                   animate={{ opacity: 1, height: 'auto' }}
//                   transition={{ duration: 0.3, delay: 0.1 }}
//                 >
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Confirmar senha
//                   </label>
//                   <input
//                     type="password"
//                     placeholder="Confirme sua senha"
//                     value={confirmPassword}
//                     onChange={(e) => setConfirmPassword(e.target.value)}
//                     required={mode === 'register'}
//                     className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
//                   />
//                 </motion.div>
//               )}

//               <motion.button
//                 type="submit"
//                 disabled={isLoading}
//                 whileHover={{ scale: 1.02 }}
//                 whileTap={{ scale: 0.98 }}
//                 className={`w-full py-3 px-4 rounded-lg text-white font-medium transition ${isLoading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'}`}
//               >
//                 {isLoading ? (
//                   <div className="flex justify-center items-center">
//                     <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
//                     Processando...
//                   </div>
//                 ) : mode === 'login' ? (
//                   'Entrar'
//                 ) : (
//                   'Criar conta'
//                 )}
//               </motion.button>
//             </form>

//             <div className="mt-6 text-center">
//               <p className="text-gray-600">
//                 {mode === 'login' ? 'Não tem uma conta?' : 'Já tem uma conta?'}
//                 <button
//                   onClick={toggleMode}
//                   className="ml-2 text-blue-600 hover:text-blue-800 font-medium"
//                 >
//                   {mode === 'login' ? 'Cadastre-se' : 'Fazer login'}
//                 </button>
//               </p>
//             </div>

//             <div className="relative flex items-center mt-6">
//               <div className="flex-grow border-t border-gray-300"></div>
//               <span className="flex-shrink mx-4 text-gray-600">Ou</span>
//               <div className="flex-grow border-t border-gray-300"></div>
//             </div>

//             <div className="mt-4 grid grid-cols-2 gap-2">
//               <button
//                 onClick={() => signIn('google', { callbackUrl: '/' })}
//                 className="flex items-center justify-center py-2 px-4 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
//               >
//                 <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
//                   <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
//                   <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
//                   <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
//                   <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
//                 </svg>
//                 Google
//               </button>
//               <button
//                 onClick={() => signIn('github', { callbackUrl: '/' })}
//                 className="flex items-center justify-center py-2 px-4 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition"
//               >
//                 <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
//                   <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
//                 </svg>
//                 GitHub
//               </button>
//             </div>
//           </motion.div>
//         </AnimatePresence>
//       </motion.div>
//     </main>
//   );
// }

'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type AuthMode = 'login' | 'register';

export default function AuthPage() {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (mode === 'login') {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Credenciais inválidas');
      } else {
        router.push('/dashboard');
      }
    } else {
      try {
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name, email, password }),
        });

        if (response.ok) {
          const result = await signIn('credentials', {
            email,
            password,
            redirect: false,
          });

          if (result?.error) {
            setError('Cadastro realizado, mas falha no login automático');
          } else {
            router.push('/dashboard');
          }
        } else {
          const data = await response.json();
          setError(data.error || 'Erro no cadastro');
        }
      } catch (error) {
        setError('Erro de conexão');
      }
    }
    
    setIsLoading(false);
  };

  const toggleMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    setError('');
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <motion.div
        className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-center mb-6">
          <div className="relative flex bg-gray-100 rounded-lg p-1">
            <button
              className={`relative px-4 py-2 rounded-md transition-all duration-300 ${mode === 'login' ? 'text-white' : 'text-gray-700'}`}
              onClick={() => setMode('login')}
            >
              Login
              {mode === 'login' && (
                <motion.div
                  className="absolute inset-0 bg-blue-600 rounded-md"
                  layoutId="activeTab"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </button>
            <button
              className={`relative px-4 py-2 rounded-md transition-all duration-300 ${mode === 'register' ? 'text-white' : 'text-gray-700'}`}
              onClick={() => setMode('register')}
            >
              Cadastro
              {mode === 'register' && (
                <motion.div
                  className="absolute inset-0 bg-blue-600 rounded-md"
                  layoutId="activeTab"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={mode}
            initial={{ opacity: 0, x: mode === 'login' ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: mode === 'login' ? 20 : -20 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
              {mode === 'login' ? 'Acesse sua conta' : 'Crie sua conta'}
            </h2>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
              >
                {error}
              </motion.div>
            )}

            <form onSubmit={handleAuth} className="space-y-4">
              {mode === 'register' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.3 }}
                >
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome completo
                  </label>
                  <input
                    type="text"
                    placeholder="Seu nome"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required={mode === 'register'}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </motion.div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  E-mail
                </label>
                <input
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Senha
                </label>
                <input
                  type="password"
                  placeholder={mode === 'login' ? 'Sua senha' : 'Crie uma senha segura'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>

              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full py-3 px-4 rounded-lg text-white font-medium transition ${isLoading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'}`}
              >
                {isLoading ? (
                  <div className="flex justify-center items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Processando...
                  </div>
                ) : mode === 'login' ? (
                  'Entrar'
                ) : (
                  'Criar conta'
                )}
              </motion.button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                {mode === 'login' ? 'Não tem uma conta?' : 'Já tem uma conta?'}
                <button
                  onClick={toggleMode}
                  className="ml-2 text-blue-600 hover:text-blue-800 font-medium"
                >
                  {mode === 'login' ? 'Cadastre-se' : 'Fazer login'}
                </button>
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </main>
  );
}
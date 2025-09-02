"use client";

import { motion } from "framer-motion";
import { FaKey, FaPenFancy, FaShieldAlt } from "react-icons/fa";
import { signIn } from "next-auth/react";

export default function HomePage() {
  return (
<>
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 via-indigo-800 to-purple-900 text-white">
      <motion.div
        className="text-center max-w-2xl p-10 rounded-2xl bg-white/10 backdrop-blur-lg shadow-2xl border border-white/20"
        initial={{ opacity: 0, scale: 0.8, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <motion.h1
          className="text-4xl md:text-5xl font-extrabold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Assinador Digital Web
        </motion.h1>

        <motion.p
          className="text-lg text-gray-200 mb-8 leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          Segurança, autenticidade e praticidade para suas assinaturas digitais.
          Cadastre-se, assine seus documentos e verifique sua autenticidade com
          poucos cliques.
        </motion.p>

        <motion.button
          onClick={() => signIn()}
          className="px-8 py-4 text-lg font-semibold rounded-full shadow-lg bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 hover:from-blue-600 hover:via-indigo-600 hover:to-purple-700 transition-all flex items-center gap-3 mx-auto"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaPenFancy className="text-2xl" />
          Entrar para Assinar
        </motion.button>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            className="flex flex-col items-center p-5 bg-white/10 rounded-xl border border-white/20"
            whileHover={{ scale: 1.05 }}
          >
            <FaKey className="text-4xl text-blue-400 mb-3" />
            <h3 className="font-bold text-lg">Chaves Seguras</h3>
            <p className="text-sm text-gray-300">
              Par de chaves criptográficas gerado automaticamente no cadastro.
            </p>
          </motion.div>

          <motion.div
            className="flex flex-col items-center p-5 bg-white/10 rounded-xl border border-white/20"
            whileHover={{ scale: 1.05 }}
          >
            <FaPenFancy className="text-4xl text-purple-400 mb-3" />
            <h3 className="font-bold text-lg">Assinaturas Digitais</h3>
            <p className="text-sm text-gray-300">
              Assine textos e documentos com segurança e praticidade.
            </p>
          </motion.div>

          <motion.div
            className="flex flex-col items-center p-5 bg-white/10 rounded-xl border border-white/20"
            whileHover={{ scale: 1.05 }}
          >
            <FaShieldAlt className="text-4xl text-green-400 mb-3" />
            <h3 className="font-bold text-lg">Verificação Pública</h3>
            <p className="text-sm text-gray-300">
              Qualquer pessoa pode verificar a validade das assinaturas.
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
    </>
  );
}

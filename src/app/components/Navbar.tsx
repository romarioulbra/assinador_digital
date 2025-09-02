// 'use client';
// import Link from 'next/link';
// // import { useSession, signOut } from 'next-auth/react';
// import { motion } from 'framer-motion';
// import { FaHome, FaPenFancy, FaSignOutAlt, FaUserPlus, FaFileSignature } from 'react-icons/fa';

// export default function Navbar() {
//   // const { data: session } = useSession();

//   // if (!session) return null;

//   return (
//     <motion.nav 
//       className="bg-blue-600 text-white p-4 flex justify-between items-center shadow-md"
//       initial={{ y: -50, opacity: 0 }}
//       animate={{ y: 0, opacity: 1 }}
//       transition={{ duration: 0.5 }}
//     >
//       <h1 className="font-bold text-xl">Assinador Digital</h1>
//       <div className="flex gap-6 items-center">
//         <Link href="/" className="flex items-center gap-2 hover:text-gray-300">
//           <FaHome /> Home
//         </Link>
//         <Link href="/registro" className="flex items-center gap-2 hover:text-gray-300">
//           <FaUserPlus /> Registro
//         </Link>
//         <Link href="/assinatura" className="flex items-center gap-2 hover:text-gray-300">
//           <FaFileSignature /> Assinar
//         </Link>
//         {/* <button onClick={() => signOut()} className="flex items-center gap-2 hover:text-gray-300">
//           <FaSignOutAlt /> Sair
//         </button> */}
//       </div>
//     </motion.nav>
//   );
// }

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  FaHome, 
  FaUserPlus, 
  FaFileSignature, 
  FaSearch, 
  FaSignOutAlt, 
  FaSignInAlt, 
  FaPenFancy, 
  FaBars, 
  FaTimes 
} from 'react-icons/fa';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false); // estado simulado

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <motion.nav
      className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center shadow-md sticky top-0 z-50"
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3">
        <FaPenFancy className="text-2xl" />
        <span className="font-bold text-xl">Assinador Digital</span>
      </div>

      {/* Desktop Links */}
      <div className="hidden md:flex gap-6 items-center">
        <Link href="/" className="flex items-center gap-2 hover:text-gray-300">
          <FaHome /> Home
        </Link>

        {!loggedIn && (
          <>
            {/* <Link href="/registro" className="flex items-center gap-2 hover:text-gray-300">
              <FaUserPlus /> Registro
            </Link> */}
            <Link href="/login" className="flex items-center gap-2 bg-white text-blue-600 px-4 py-2 rounded hover:bg-gray-100 transition">
              <FaSignInAlt /> Login
            </Link>
          </>
        )}

        {loggedIn && (
          <>
            <Link href="/assinatura" className="flex items-center gap-2 hover:text-gray-300">
              <FaFileSignature /> Assinar
            </Link>
            <Link href="/verificacao" className="flex items-center gap-2 hover:text-gray-300">
              <FaSearch /> Verificar
            </Link>
            <button 
              onClick={() => setLoggedIn(false)}
              className="flex items-center gap-2 hover:text-gray-300"
            >
              <FaSignOutAlt /> Sair
            </button>
          </>
        )}
      </div>

      {/* Mobile Menu */}
      <button className="md:hidden" onClick={toggleMenu}>
        {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </button>

      <motion.div
        className="md:hidden fixed top-16 right-0 bg-blue-600 w-64 h-full p-6 flex flex-col gap-6 shadow-lg"
        initial={{ opacity: 0, x: 100 }}
        animate={menuOpen ? { opacity: 1, x: 0 } : { opacity: 0, x: 100 }}
        transition={{ duration: 0.3 }}
      >
        <Link href="/" className="flex items-center gap-2 hover:text-gray-300" onClick={toggleMenu}>
          <FaHome /> Home
        </Link>

        {!loggedIn && (
          <>
            <Link href="/registro" className="flex items-center gap-2 hover:text-gray-300" onClick={toggleMenu}>
              <FaUserPlus /> Registro
            </Link>
            <Link href="/login" className="flex items-center gap-2 bg-white text-blue-600 px-4 py-2 rounded hover:bg-gray-100 transition" onClick={toggleMenu}>
              <FaSignInAlt /> Login
            </Link>
          </>
        )}

        {loggedIn && (
          <>
            <Link href="/assinatura" className="flex items-center gap-2 hover:text-gray-300" onClick={toggleMenu}>
              <FaFileSignature /> Assinar
            </Link>
            <Link href="/verificacao" className="flex items-center gap-2 hover:text-gray-300" onClick={toggleMenu}>
              <FaSearch /> Verificar
            </Link>
            <button 
              onClick={() => { setLoggedIn(false); toggleMenu(); }}
              className="flex items-center gap-2 hover:text-gray-300"
            >
              <FaSignOutAlt /> Sair
            </button>
          </>
        )}
      </motion.div>
    </motion.nav>
  );
}

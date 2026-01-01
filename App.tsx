
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { User, Bet, BetType, GameConfig } from './types';
import { DEFAULT_CONFIG } from './constants';
import TigerGame from './components/TigerGame';
import Dashboard from './components/Dashboard';
import Admin from './components/Admin';
import PixDeposit from './components/PixDeposit';
import Login from './components/Login';
import Register from './components/Register';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('tigre_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [config, setConfig] = useState<GameConfig>(() => {
    const saved = localStorage.getItem('tigre_config');
    return saved ? JSON.parse(saved) : DEFAULT_CONFIG;
  });

  // Persistência automática do usuário logado
  useEffect(() => {
    if (user) {
      localStorage.setItem('tigre_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('tigre_user');
    }
  }, [user]);

  // Persistência das configurações do admin
  useEffect(() => {
    localStorage.setItem('tigre_config', JSON.stringify(config));
  }, [config]);

  const handleLogout = () => {
    setUser(null);
  };

  const updateUser = (updates: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...updates } : null);
  };

  const addBet = (bet: Bet) => {
    setUser(prev => {
      if (!prev) return null;
      // Garante que o saldo nunca fique negativo por erro de processamento
      const newBalance = prev.balance + bet.payout - (bet.type === BetType.REAL ? bet.amount : 0);
      return {
        ...prev,
        betHistory: [bet, ...prev.betHistory].slice(0, 100), // Mantém histórico razoável
        balance: Math.max(0, newBalance),
        freeSpins: bet.type === BetType.FREE ? Math.max(0, prev.freeSpins - 1) : prev.freeSpins
      };
    });
  };

  const isAdmin = user?.email === 'admin@tigre.com';

  return (
    <HashRouter>
      <div className="flex flex-col min-h-screen">
        <nav className="glass-panel sticky top-0 z-50 px-4 py-3 flex items-center justify-between border-b border-yellow-500/20">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-3xl">🐯</span>
            <span className="font-game text-2xl text-yellow-500 tracking-wider">FORTUNE TIGER</span>
          </Link>
          
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <div className="hidden md:flex flex-col items-end text-sm">
                  <span className="text-gray-400">Saldo: <span className="text-green-400 font-bold">R$ {user.balance.toFixed(2)}</span></span>
                  <span className="text-gray-400">Bônus: <span className="text-yellow-400 font-bold">{user.freeSpins} Giros</span></span>
                </div>
                <Link to="/deposit" className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-full text-xs font-bold transition-all shadow-lg shadow-green-900/40 hover:scale-105 active:scale-95">
                  DEPOSITAR
                </Link>
                <div className="relative group">
                   <button className="flex items-center space-x-1 focus:outline-none">
                     <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-yellow-600 to-yellow-400 flex items-center justify-center font-bold border-2 border-white/20 shadow-md">
                       {user.name[0].toUpperCase()}
                     </div>
                   </button>
                   <div className="absolute right-0 mt-2 w-52 glass-panel rounded-xl shadow-2xl py-3 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all z-50 transform translate-y-2 group-hover:translate-y-0">
                     <div className="px-4 py-2 border-b border-white/5 mb-2">
                       <p className="text-xs text-gray-400 truncate">{user.email}</p>
                     </div>
                     <Link to="/dashboard" className="block px-4 py-2 hover:bg-white/10 text-sm transition-colors"><i className="fa-solid fa-chart-line mr-2"></i>Minha Conta</Link>
                     {isAdmin && <Link to="/admin" className="block px-4 py-2 hover:bg-white/10 text-sm text-yellow-500 font-bold transition-colors"><i className="fa-solid fa-crown mr-2"></i>Painel Admin</Link>}
                     <button onClick={handleLogout} className="w-full text-left px-4 py-2 hover:bg-white/10 text-sm text-red-400 transition-colors mt-2 border-t border-white/5 pt-2"><i className="fa-solid fa-sign-out-alt mr-2"></i>Sair</button>
                   </div>
                </div>
              </>
            ) : (
              <div className="flex space-x-2">
                <Link to="/login" className="px-5 py-2 rounded-full text-sm font-bold border border-yellow-500/50 hover:bg-yellow-500/10 transition-all">
                  LOGIN
                </Link>
                <Link to="/register" className="px-5 py-2 rounded-full text-sm font-bold tiger-gradient text-white shadow-lg hover:brightness-110 transition-all">
                  CADASTRAR
                </Link>
              </div>
            )}
          </div>
        </nav>

        <main className="flex-grow flex flex-col items-center justify-center p-4">
          <Routes>
            <Route path="/" element={user ? <TigerGame user={user} config={config} onBet={addBet} /> : <Navigate to="/login" />} />
            <Route path="/login" element={<Login onLogin={setUser} />} />
            <Route path="/register" element={<Register onRegister={setUser} />} />
            <Route path="/dashboard" element={user ? <Dashboard user={user} onUpdate={updateUser} /> : <Navigate to="/login" />} />
            <Route path="/deposit" element={user ? <PixDeposit user={user} onDeposit={(amt) => updateUser({ balance: user.balance + amt })} /> : <Navigate to="/login" />} />
            <Route path="/admin" element={isAdmin ? <Admin config={config} setConfig={setConfig} /> : <Navigate to="/" />} />
          </Routes>
        </main>

        <footer className="py-8 glass-panel border-t border-yellow-500/10 text-center text-xs text-gray-500 mt-auto">
          <div className="flex justify-center space-x-6 mb-4">
            <span className="opacity-50 hover:opacity-100 transition-opacity cursor-help">Jogo Responsável</span>
            <span className="opacity-50 hover:opacity-100 transition-opacity cursor-help">Termos de Uso</span>
            <span className="opacity-50 hover:opacity-100 transition-opacity cursor-help">Privacidade</span>
          </div>
          <p>© 2024 Fortune Tiger Oficial. Proibido para menores de 18 anos.</p>
        </footer>
      </div>
    </HashRouter>
  );
};

export default App;


import React, { useState } from 'react';
import { User } from '../types';
import { Link, useNavigate } from 'react-router-dom';

interface Props {
  onLogin: (user: User) => void;
}

const Login: React.FC<Props> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Demo credentials
    if (email === 'admin@tigre.com' && password === 'admin123') {
      const adminUser: User = {
        id: 'admin-id',
        name: 'Administrador',
        email: 'admin@tigre.com',
        balance: 1000.00,
        freeSpins: 99,
        betHistory: []
      };
      onLogin(adminUser);
      navigate('/');
      return;
    }

    // Check localStorage for demo users
    const savedUsers = JSON.parse(localStorage.getItem('registered_users') || '[]');
    const found = savedUsers.find((u: any) => u.email === email && u.password === password);

    if (found) {
      onLogin({
        id: found.id,
        name: found.name,
        email: found.email,
        balance: found.balance || 0,
        freeSpins: found.freeSpins || 5,
        betHistory: found.betHistory || []
      });
      navigate('/');
    } else {
      setError('Credenciais inválidas. Tente admin@tigre.com / admin123');
    }
  };

  return (
    <div className="w-full max-w-md glass-panel rounded-3xl p-8">
      <div className="text-center mb-8">
        <h2 className="font-game text-4xl text-yellow-500">ACESSAR CONTA</h2>
        <p className="text-gray-400 text-sm mt-2">O Tigre te espera para grandes vitórias</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-red-400 text-xs bg-red-900/20 p-2 rounded">{error}</p>}
        <div>
          <label className="text-xs font-bold text-gray-400 uppercase ml-1">Email</label>
          <input 
            type="email" 
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full bg-black/30 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-yellow-500 transition-all mt-1"
            placeholder="seu@email.com"
          />
        </div>
        <div>
          <label className="text-xs font-bold text-gray-400 uppercase ml-1">Senha</label>
          <input 
            type="password" 
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full bg-black/30 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-yellow-500 transition-all mt-1"
            placeholder="••••••••"
          />
        </div>
        <button type="submit" className="w-full tiger-gradient py-4 rounded-xl font-bold text-lg shadow-lg hover:brightness-110 active:scale-95 transition-all mt-4">
          ENTRAR AGORA
        </button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-6">
        Ainda não tem conta? <Link to="/register" className="text-yellow-500 font-bold hover:underline">Cadastre-se e ganhe 5 rodadas!</Link>
      </p>
    </div>
  );
};

export default Login;

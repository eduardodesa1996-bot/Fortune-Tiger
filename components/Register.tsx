
import React, { useState } from 'react';
import { User } from '../types';
import { Link, useNavigate } from 'react-router-dom';

interface Props {
  onRegister: (user: User) => void;
}

const Register: React.FC<Props> = ({ onRegister }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      email,
      balance: 0,
      freeSpins: 5,
      betHistory: []
    };

    // Store for persistence in this demo
    const savedUsers = JSON.parse(localStorage.getItem('registered_users') || '[]');
    savedUsers.push({ ...newUser, password });
    localStorage.setItem('registered_users', JSON.stringify(savedUsers));

    onRegister(newUser);
    navigate('/');
  };

  return (
    <div className="w-full max-w-md glass-panel rounded-3xl p-8">
      <div className="text-center mb-8">
        <h2 className="font-game text-4xl text-yellow-500">CRIAR CONTA</h2>
        <p className="text-green-400 text-sm font-bold mt-2">BÔNUS: 5 RODADAS GRÁTIS ATIVADAS! 🎁</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs font-bold text-gray-400 uppercase ml-1">Nome Completo</label>
          <input 
            type="text" 
            required
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full bg-black/30 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-yellow-500 transition-all mt-1"
            placeholder="Como quer ser chamado?"
          />
        </div>
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
            placeholder="Crie uma senha forte"
          />
        </div>
        <button type="submit" className="w-full tiger-gradient py-4 rounded-xl font-bold text-lg shadow-lg hover:brightness-110 active:scale-95 transition-all mt-4">
          CADASTRAR E GANHAR BÔNUS
        </button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-6">
        Já possui conta? <Link to="/login" className="text-yellow-500 font-bold hover:underline">Fazer Login</Link>
      </p>
    </div>
  );
};

export default Register;

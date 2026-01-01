
import React, { useState } from 'react';
import { User, BetResult } from '../types';

interface Props {
  user: User;
  onUpdate: (updates: Partial<User>) => void;
}

const Dashboard: React.FC<Props> = ({ user, onUpdate }) => {
  const [withdrawing, setWithdrawing] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount <= 0) return;
    if (amount > user.balance) {
      alert("Saldo insuficiente para este saque.");
      return;
    }
    
    setWithdrawing(true);
    // Simula processamento
    setTimeout(() => {
      onUpdate({ balance: user.balance - amount });
      setWithdrawing(false);
      setWithdrawAmount('');
      alert(`Saque de R$ ${amount.toFixed(2)} enviado para sua chave PIX vinculada!`);
    }, 1500);
  };

  return (
    <div className="w-full max-w-4xl space-y-6 animate-fadeIn">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-panel p-6 rounded-2xl text-center border-b-4 border-green-500">
          <p className="text-gray-400 text-xs font-bold uppercase mb-1">Saldo Disponível</p>
          <p className="text-3xl font-bold text-green-400">R$ {user.balance.toFixed(2)}</p>
        </div>
        <div className="glass-panel p-6 rounded-2xl text-center border-b-4 border-yellow-500">
          <p className="text-gray-400 text-xs font-bold uppercase mb-1">Bônus Ativo</p>
          <p className="text-3xl font-bold text-yellow-400">{user.freeSpins} Giros</p>
        </div>
        <div className="glass-panel p-6 rounded-2xl text-center border-b-4 border-blue-500">
          <p className="text-gray-400 text-xs font-bold uppercase mb-1">Volume de Apostas</p>
          <p className="text-3xl font-bold text-blue-400">{user.betHistory.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-panel rounded-2xl overflow-hidden">
          <div className="bg-white/5 px-6 py-4 border-b border-white/10 flex justify-between items-center">
            <h2 className="font-bold flex items-center"><i className="fa-solid fa-clock-rotate-left mr-2 text-yellow-500"></i>Últimas Atividades</h2>
            <span className="text-[10px] bg-white/10 px-2 py-1 rounded text-gray-400">Exibindo últimas 20</span>
          </div>
          <div className="overflow-x-auto max-h-[400px]">
            <table className="w-full text-left">
              <thead className="sticky top-0 bg-gray-900">
                <tr className="text-[10px] text-gray-500 uppercase">
                  <th className="px-6 py-3">Data/Hora</th>
                  <th className="px-6 py-3">Modalidade</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Resultado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {user.betHistory.length > 0 ? (
                  user.betHistory.slice(0, 20).map(bet => (
                    <tr key={bet.id} className="text-sm hover:bg-white/5 transition-colors group">
                      <td className="px-6 py-3 text-gray-400 whitespace-nowrap">{new Date(bet.timestamp).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}</td>
                      <td className="px-6 py-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${bet.type === 'FREE' ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/30' : 'bg-green-500/20 text-green-500 border border-green-500/30'}`}>
                          {bet.type}
                        </span>
                      </td>
                      <td className="px-6 py-3">
                        <span className={`flex items-center ${bet.result === BetResult.WIN ? 'text-green-400 font-bold' : 'text-red-400 opacity-60'}`}>
                          {bet.result === BetResult.WIN ? <><i className="fa-solid fa-circle-check mr-1 text-[10px]"></i> GANHOU</> : 'PERDEU'}
                        </span>
                      </td>
                      <td className={`px-6 py-3 font-mono text-right ${bet.payout > 0 ? 'text-green-400' : 'text-gray-600'}`}>
                        {bet.payout > 0 ? `+R$ ${bet.payout.toFixed(2)}` : `-R$ ${bet.amount.toFixed(2)}`}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-20 text-center text-gray-500 italic">
                      Sua jornada começa aqui. Faça sua primeira aposta!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between border border-white/10">
          <div>
            <h3 className="font-bold text-lg mb-4 flex items-center"><i className="fa-solid fa-hand-holding-dollar mr-2 text-green-500"></i>Efetuar Saque</h3>
            <p className="text-xs text-gray-400 mb-6">O saque será processado via PIX para o CPF cadastrado no registro.</p>
            
            <form onSubmit={handleWithdraw} className="space-y-4">
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">R$</span>
                <input 
                  type="number" 
                  step="0.01"
                  placeholder="0.00"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl py-4 px-10 text-xl font-bold focus:outline-none focus:border-green-500 transition-all"
                  required
                />
              </div>
              <button 
                type="submit" 
                disabled={withdrawing || !withdrawAmount || parseFloat(withdrawAmount) <= 0}
                className="w-full bg-white text-black py-4 rounded-xl font-bold hover:bg-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl active:scale-95"
              >
                {withdrawing ? <i className="fa-solid fa-circle-notch animate-spin"></i> : 'SOLICITAR SAQUE'}
              </button>
            </form>
          </div>
          
          <div className="mt-8 p-4 bg-yellow-500/10 rounded-xl border border-yellow-500/20">
            <p className="text-[10px] text-yellow-500 font-bold uppercase mb-1">Dica do Tigre</p>
            <p className="text-[11px] text-gray-300">Saques acima de R$ 500,00 podem levar até 2h para análise de segurança.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

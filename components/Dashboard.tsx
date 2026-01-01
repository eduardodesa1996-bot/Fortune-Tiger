
import React, { useState, useMemo } from 'react';
import { User, BetResult } from '../types';

interface Props {
  user: User;
  onUpdate: (updates: Partial<User>) => void;
}

const Dashboard: React.FC<Props> = ({ user, onUpdate }) => {
  const [withdrawing, setWithdrawing] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');

  const stats = useMemo(() => {
    const totalBet = user.betHistory.reduce((acc, b) => acc + (b.type === 'REAL' ? b.amount : 0), 0);
    const totalWon = user.betHistory.reduce((acc, b) => acc + b.payout, 0);
    return { totalBet, totalWon, profit: totalWon - totalBet };
  }, [user.betHistory]);

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount < 10) {
      alert("O valor mínimo para saque é R$ 10,00");
      return;
    }
    if (amount > user.balance) {
      alert("Saldo insuficiente.");
      return;
    }
    
    setWithdrawing(true);
    setTimeout(() => {
      onUpdate({ balance: user.balance - amount });
      setWithdrawing(false);
      setWithdrawAmount('');
      alert(`✅ Solicitação de R$ ${amount.toFixed(2)} enviada! O crédito cairá no seu PIX em instantes.`);
    }, 2000);
  };

  return (
    <div className="w-full max-w-4xl space-y-6 animate-fadeIn pb-10">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-2xl text-center border-b-4 border-green-500">
          <p className="text-gray-400 text-[10px] font-bold uppercase mb-1">Saldo</p>
          <p className="text-2xl font-bold text-green-400">R$ {user.balance.toFixed(2)}</p>
        </div>
        <div className="glass-panel p-5 rounded-2xl text-center border-b-4 border-yellow-500">
          <p className="text-gray-400 text-[10px] font-bold uppercase mb-1">Bônus</p>
          <p className="text-2xl font-bold text-yellow-400">{user.freeSpins} Giros</p>
        </div>
        <div className="glass-panel p-5 rounded-2xl text-center border-b-4 border-blue-500">
          <p className="text-gray-400 text-[10px] font-bold uppercase mb-1">Total Ganho</p>
          <p className="text-2xl font-bold text-blue-400">R$ {stats.totalWon.toFixed(2)}</p>
        </div>
        <div className="glass-panel p-5 rounded-2xl text-center border-b-4 border-purple-500">
          <p className="text-gray-400 text-[10px] font-bold uppercase mb-1">Lucro Líquido</p>
          <p className={`text-2xl font-bold ${stats.profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            R$ {stats.profit.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-panel rounded-2xl overflow-hidden border border-white/5">
          <div className="bg-white/5 px-6 py-4 border-b border-white/10 flex justify-between items-center">
            <h2 className="font-bold text-sm uppercase tracking-widest flex items-center">
              <i className="fa-solid fa-receipt mr-2 text-yellow-500"></i> Histórico Recente
            </h2>
          </div>
          <div className="overflow-x-auto max-h-[500px]">
            <table className="w-full text-left">
              <thead className="sticky top-0 bg-gray-900/90 backdrop-blur-md z-10">
                <tr className="text-[10px] text-gray-500 uppercase">
                  <th className="px-6 py-4">Data</th>
                  <th className="px-6 py-4">Tipo</th>
                  <th className="px-6 py-4">Resultado</th>
                  <th className="px-6 py-4 text-right">Montante</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {user.betHistory.length > 0 ? (
                  user.betHistory.slice(0, 30).map(bet => (
                    <tr key={bet.id} className="text-xs hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 text-gray-400 font-mono">
                        {new Date(bet.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 rounded-[4px] font-bold ${bet.type === 'FREE' ? 'text-yellow-500 bg-yellow-500/10' : 'text-green-500 bg-green-500/10'}`}>
                          {bet.type}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={bet.result === BetResult.WIN ? 'text-green-400 font-black' : 'text-red-400 opacity-40'}>
                          {bet.result === BetResult.WIN ? 'VITÓRIA' : 'PERDA'}
                        </span>
                      </td>
                      <td className={`px-6 py-4 font-mono text-right font-bold ${bet.payout > 0 ? 'text-green-400' : 'text-gray-500'}`}>
                        {bet.payout > 0 ? `+ R$ ${bet.payout.toFixed(2)}` : `- R$ ${bet.amount.toFixed(2)}`}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-20 text-center text-gray-500 italic text-sm">
                      O Tigre está aguardando sua primeira jogada...
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-white/10 shadow-xl">
            <h3 className="font-bold text-lg mb-4 flex items-center text-green-400">
              <i className="fa-solid fa-money-bill-transfer mr-2"></i> Saque PIX
            </h3>
            <p className="text-[11px] text-gray-400 mb-6 leading-relaxed">
              O valor será transferido instantaneamente para sua conta via PIX CPF. 
              <strong> Mínimo: R$ 10,00.</strong>
            </p>
            
            <form onSubmit={handleWithdraw} className="space-y-4">
              <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">R$</span>
                <input 
                  type="number" 
                  step="0.01"
                  placeholder="0.00"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="w-full bg-black/40 border-2 border-white/5 rounded-xl py-4 px-10 text-xl font-bold focus:outline-none focus:border-green-500 transition-all text-white"
                  required
                />
              </div>
              <button 
                type="submit" 
                disabled={withdrawing || !withdrawAmount || parseFloat(withdrawAmount) < 10}
                className="w-full bg-green-600 text-white py-4 rounded-xl font-bold hover:bg-green-500 transition-all disabled:opacity-30 disabled:grayscale shadow-lg active:scale-95"
              >
                {withdrawing ? <i className="fa-solid fa-spinner animate-spin"></i> : 'SOLICITAR RESGATE'}
              </button>
            </form>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-yellow-500/20 bg-yellow-500/5">
            <h4 className="text-yellow-500 font-bold text-xs uppercase mb-2 flex items-center">
              <i className="fa-solid fa-circle-exclamation mr-2"></i> Regras de Saque
            </h4>
            <ul className="text-[10px] text-gray-400 space-y-2 list-disc list-inside">
              <li>Saques liberados 24h por dia.</li>
              <li>Bônus (Giros) não podem ser sacados diretamente.</li>
              <li>Apenas 1 saque pendente por vez.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

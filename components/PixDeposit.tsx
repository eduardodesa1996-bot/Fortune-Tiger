
import React, { useState } from 'react';
import { User } from '../types';
import { PIX_KEY } from '../constants';

interface Props {
  user: User;
  onDeposit: (amount: number) => void;
}

const PixDeposit: React.FC<Props> = ({ user, onDeposit }) => {
  const [amount, setAmount] = useState(20);
  const [step, setStep] = useState(1);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(PIX_KEY);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConfirm = () => {
    if (amount < 1) {
      alert("Valor mínimo de depósito é R$ 1,00");
      return;
    }
    onDeposit(amount);
    setStep(3);
  };

  return (
    <div className="w-full max-w-md glass-panel rounded-[2rem] p-8 space-y-6 shadow-2xl border border-white/10 animate-scaleIn">
      <div className="text-center">
        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/30">
          <i className="fa-solid fa-bolt text-2xl text-green-500"></i>
        </div>
        <h2 className="font-game text-4xl text-yellow-500 tracking-wider">RECARGA PIX</h2>
        <p className="text-gray-400 text-sm mt-2">Crédito instantâneo na sua conta</p>
      </div>

      {step === 1 && (
        <div className="space-y-6 animate-fadeIn">
          <div className="grid grid-cols-3 gap-3">
            {[20, 50, 100].map(val => (
              <button 
                key={val}
                onClick={() => setAmount(val)}
                className={`py-3 rounded-xl font-bold transition-all border-2 ${amount === val ? 'tiger-gradient text-white border-yellow-400 shadow-lg' : 'glass-panel border-white/5 hover:border-white/20'}`}
              >
                R$ {val}
              </button>
            ))}
          </div>
          <div className="relative group">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">R$</span>
            <input 
              type="number" 
              min="1"
              value={amount} 
              onChange={(e) => setAmount(Math.max(0, Number(e.target.value)))}
              className="w-full bg-black/40 border-2 border-white/5 rounded-2xl py-5 px-12 text-3xl font-bold focus:outline-none focus:border-yellow-500 transition-all text-white placeholder-gray-700"
            />
          </div>
          <button 
            onClick={() => setStep(2)}
            disabled={amount < 1}
            className="w-full tiger-gradient py-5 rounded-2xl font-bold text-xl shadow-xl hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
          >
            GERAR PAGAMENTO
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6 text-center animate-fadeIn">
          <div className="bg-white p-4 rounded-3xl inline-block shadow-2xl ring-8 ring-white/5">
             <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=03368540050" alt="QR Code" className="w-48 h-48" />
          </div>
          
          <div className="glass-panel p-5 rounded-2xl text-left border border-white/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-2 opacity-5">
              <i className="fa-solid fa-copy text-4xl"></i>
            </div>
            <p className="text-[10px] text-gray-500 uppercase font-bold mb-2 tracking-widest">Código Copia e Cola</p>
            <div className="flex items-center gap-3">
               <code className="text-xs truncate flex-grow bg-black/50 p-3 rounded-lg border border-white/5 font-mono text-yellow-500">{PIX_KEY}</code>
               <button 
                onClick={handleCopy} 
                className={`p-3 rounded-xl transition-all shadow-lg ${copied ? 'bg-green-600' : 'bg-yellow-600 hover:bg-yellow-700'}`}
               >
                 <i className={`fa-solid ${copied ? 'fa-check' : 'fa-copy'}`}></i>
               </button>
            </div>
          </div>

          <div className="flex items-center justify-center space-x-2 text-sm text-gray-400">
             <i className="fa-solid fa-circle-notch animate-spin text-yellow-500"></i>
             <span>Aguardando detecção do pagamento...</span>
          </div>

          <div className="pt-4 flex flex-col gap-3">
            <button 
              onClick={handleConfirm}
              className="w-full bg-green-600 py-4 rounded-xl font-bold hover:bg-green-700 transition-all shadow-lg"
            >
              SIMULAR CONFIRMAÇÃO
            </button>
            <button onClick={() => setStep(1)} className="text-xs text-gray-500 hover:text-white uppercase font-bold tracking-widest">Alterar Valor</button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="text-center py-10 space-y-6 animate-fadeIn">
           <div className="relative inline-block">
             <div className="w-24 h-24 bg-green-600 rounded-full flex items-center justify-center text-5xl mx-auto shadow-[0_0_30px_rgba(22,163,74,0.5)] animate-bounce">
               ✓
             </div>
             <div className="absolute -top-2 -right-2 text-3xl animate-pulse">✨</div>
           </div>
           <div>
             <h3 className="text-3xl font-bold mb-2">Sucesso!</h3>
             <p className="text-gray-400">R$ {amount.toFixed(2)} já estão disponíveis em sua banca.</p>
           </div>
           <button 
            onClick={() => window.location.hash = "/"}
            className="w-full tiger-gradient py-4 rounded-xl font-bold text-lg shadow-xl hover:scale-105 active:scale-95 transition-all"
           >
             BORA JOGAR!
           </button>
        </div>
      )}
    </div>
  );
};

export default PixDeposit;

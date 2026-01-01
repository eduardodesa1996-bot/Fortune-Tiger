
import React, { useState, useEffect, useRef } from 'react';
import { User, Bet, BetType, BetResult, GameConfig } from '../types';
import { SYMBOLS } from '../constants';
import { getTigerWisdom } from '../services/geminiService';

interface Props {
  user: User;
  config: GameConfig;
  onBet: (bet: Bet) => void;
}

const TigerGame: React.FC<Props> = ({ user, config, onBet }) => {
  const [spinning, setSpinning] = useState(false);
  const [reels, setReels] = useState(['🐯', '🐯', '🐯']);
  const [message, setMessage] = useState("Clique em GIRAR para começar!");
  const [tigerWisdom, setTigerWisdom] = useState("");
  const [lastResults, setLastResults] = useState<BetResult[]>([]);
  
  useEffect(() => {
    fetchWisdom();
  }, []);

  const fetchWisdom = async () => {
    const wisdom = await getTigerWisdom(user.balance, lastResults.filter(r => r === BetResult.WIN).length);
    setTigerWisdom(wisdom);
  };

  const determineResult = () => {
    const consecutiveLosses = lastResults.length >= config.minLossesForBoost && 
      lastResults.slice(-config.minLossesForBoost).every(r => r === BetResult.LOSS);
    
    const prob = consecutiveLosses ? config.boostedProbability : config.winProbability;
    const isWin = Math.random() < prob;

    if (isWin) {
      const winningSymbol = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)].char;
      return [winningSymbol, winningSymbol, winningSymbol];
    } else {
      const s1 = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)].char;
      let s2 = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)].char;
      let s3 = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)].char;
      if (s1 === s2 && s2 === s3) {
        s3 = SYMBOLS.find(s => s.char !== s1)?.char || '🍊';
      }
      return [s1, s2, s3];
    }
  };

  const spin = (type: BetType) => {
    if (spinning) return;
    const amount = 1.0;

    if (type === BetType.REAL && user.balance < amount) {
      setMessage("Saldo insuficiente! Deposite para continuar.");
      return;
    }
    if (type === BetType.FREE && user.freeSpins <= 0) {
      setMessage("Você não tem mais giros grátis.");
      return;
    }

    setSpinning(true);
    setMessage("O Tigre está decidindo...");

    let count = 0;
    const interval = window.setInterval(() => {
      setReels([
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)].char,
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)].char,
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)].char,
      ]);
      count++;
      if (count > 25) {
        window.clearInterval(interval);
        finishSpin(type, amount);
      }
    }, 60);
  };

  const finishSpin = (type: BetType, amount: number) => {
    const finalReels = determineResult();
    setReels(finalReels);
    setSpinning(false);

    const isWin = finalReels[0] === finalReels[1] && finalReels[1] === finalReels[2];
    const betResult = isWin ? BetResult.WIN : BetResult.LOSS;
    
    // CORREÇÃO: Payout baseado na configuração do administrador
    const payout = isWin ? (amount * config.payoutMultiplier) : 0;

    const newBet: Bet = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      type,
      amount,
      result: betResult,
      payout,
    };

    onBet(newBet);
    setLastResults(prev => [...prev, betResult].slice(-10));
    
    if (isWin) {
      setMessage(`PARABÉNS! Você ganhou R$ ${payout.toFixed(2)}!`);
      fetchWisdom();
    } else {
      setMessage("Não foi dessa vez. O Tigre guarda sua sorte!");
    }
  };

  return (
    <div className="w-full max-w-md flex flex-col items-center space-y-6">
      
      {/* Tiger Wisdom Header */}
      <div className="w-full glass-panel rounded-2xl p-4 relative overflow-hidden group border-l-4 border-yellow-500">
        <div className="absolute top-0 right-0 p-2 text-yellow-500 opacity-10 transform translate-x-2 -translate-y-2 group-hover:scale-110 transition-transform">
          <i className="fa-solid fa-paw text-5xl"></i>
        </div>
        <div className="flex items-start space-x-3 relative z-10">
          <div className="flex-shrink-0 w-12 h-12 tiger-gradient rounded-full flex items-center justify-center text-2xl shadow-xl border-2 border-yellow-300/30">
            🐯
          </div>
          <div className="flex-grow">
            <h3 className="text-yellow-500 font-bold text-[10px] uppercase tracking-widest">Oráculo do Tigrinho</h3>
            <p className="text-sm italic text-gray-200 mt-1 leading-snug">"{tigerWisdom || "Sentindo as vibrações da fortuna..."}"</p>
          </div>
        </div>
      </div>

      {/* Main Game Machine */}
      <div className="w-full glass-panel rounded-[2rem] p-6 relative border-b-8 border-yellow-700 shadow-[0_20px_50px_rgba(0,0,0,0.5),0_0_50px_rgba(234,179,8,0.1)] bg-gradient-to-b from-gray-800 to-gray-900">
        
        {/* Leds Decorativos */}
        <div className="absolute -left-2 top-1/4 bottom-1/4 w-1 bg-yellow-500 rounded-full shadow-[0_0_10px_#f59e0b]"></div>
        <div className="absolute -right-2 top-1/4 bottom-1/4 w-1 bg-yellow-500 rounded-full shadow-[0_0_10px_#f59e0b]"></div>

        <div className="text-center mb-6">
          <div className="inline-block px-4 py-1 bg-black/50 rounded-full border border-yellow-500/30 mb-2">
             <span className="text-[10px] text-yellow-500 font-bold uppercase tracking-widest">Multiplier {config.payoutMultiplier}x</span>
          </div>
          <h1 className="font-game text-5xl text-yellow-500 drop-shadow-[0_2px_10px_rgba(245,158,11,0.5)] tracking-widest uppercase">MEGA WIN</h1>
        </div>

        {/* Reels Area */}
        <div className="flex justify-between items-center bg-black/60 rounded-2xl p-4 gap-3 border-2 border-yellow-600/30 shadow-inner">
          {reels.map((symbol, i) => (
            <div key={i} className="flex-1 aspect-[3/4] glass-panel rounded-xl flex items-center justify-center text-5xl md:text-6xl bg-gradient-to-b from-white/10 to-transparent shadow-2xl relative overflow-hidden">
               <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
               <span className={`${spinning ? 'animate-bounce' : 'scale-110'} transition-all duration-75 block relative z-10`}>
                 {symbol}
               </span>
            </div>
          ))}
        </div>

        {/* Status Message */}
        <div className="mt-8 text-center h-10 flex items-center justify-center">
           <p className={`font-bold text-lg px-4 py-1 rounded-full transition-all duration-300 ${message.includes('VITÓRIA') || message.includes('PARABÉNS') ? 'text-green-400 bg-green-400/10 scale-110 shadow-[0_0_15px_rgba(74,222,128,0.2)]' : 'text-yellow-500'}`}>
             {message}
           </p>
        </div>

        {/* Botão Principal */}
        <div className="mt-8">
          {user.freeSpins > 0 ? (
            <button 
              disabled={spinning}
              onClick={() => spin(BetType.FREE)}
              className={`w-full py-5 rounded-2xl font-game text-3xl tracking-widest shadow-2xl transition-all relative overflow-hidden group ${spinning ? 'opacity-50 cursor-not-allowed bg-gray-600' : 'tiger-gradient hover:scale-[1.02] active:scale-95 text-white ring-4 ring-yellow-400/50'}`}
            >
              <span className="relative z-10">GIRO GRÁTIS ({user.freeSpins})</span>
              {!spinning && <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 skew-x-12"></div>}
            </button>
          ) : (
            <button 
              disabled={spinning || user.balance < 1}
              onClick={() => spin(BetType.REAL)}
              className={`w-full py-5 rounded-2xl font-game text-3xl tracking-widest shadow-2xl transition-all relative overflow-hidden group ${spinning || user.balance < 1 ? 'opacity-50 cursor-not-allowed bg-gray-600' : 'bg-green-600 hover:bg-green-500 hover:scale-[1.02] active:scale-95 text-white ring-4 ring-green-400/30'}`}
            >
              <span className="relative z-10 uppercase">JOGAR R$ 1,00</span>
              {!spinning && <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>}
            </button>
          )}
        </div>
      </div>

      {/* Legend / Info */}
      <div className="w-full flex justify-between text-[10px] text-gray-500 font-bold uppercase tracking-widest px-2">
        <div className="flex items-center space-x-2"><span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> <span>14k+ Jogando</span></div>
        <div className="flex items-center space-x-2"><span>Certificado RNG</span> <i className="fa-solid fa-shield-halved text-green-500"></i></div>
      </div>
    </div>
  );
};

export default TigerGame;

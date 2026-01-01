
import React, { useState, useEffect, useMemo } from 'react';
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
  const [isWinning, setIsWinning] = useState(false);

  // Deriva perdas consecutivas do histórico real do usuário para evitar fraudes via refresh
  const consecutiveLosses = useMemo(() => {
    let count = 0;
    for (const bet of user.betHistory) {
      if (bet.result === BetResult.LOSS) count++;
      else break;
    }
    return count;
  }, [user.betHistory]);

  useEffect(() => {
    fetchWisdom();
  }, []);

  const fetchWisdom = async () => {
    try {
      const wisdom = await getTigerWisdom(user.balance, consecutiveLosses);
      setTigerWisdom(wisdom);
    } catch {
      setTigerWisdom("A sorte sorri para quem persiste!");
    }
  };

  const determineResult = () => {
    const isBoosted = consecutiveLosses >= config.minLossesForBoost;
    const prob = isBoosted ? config.boostedProbability : config.winProbability;
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
    const cost = 1.0;

    if (type === BetType.REAL && user.balance < cost) {
      setMessage("⚠️ Saldo insuficiente!");
      return;
    }
    if (type === BetType.FREE && user.freeSpins <= 0) {
      setMessage("⚠️ Giros grátis esgotados!");
      return;
    }

    setSpinning(true);
    setIsWinning(false);
    setMessage("Sorteando fortuna...");

    let spinsCount = 0;
    const maxSpins = 25;
    
    const spinInterval = window.setInterval(() => {
      setReels([
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)].char,
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)].char,
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)].char,
      ]);
      spinsCount++;
      
      if (spinsCount >= maxSpins) {
        window.clearInterval(spinInterval);
        const finalResult = determineResult();
        setReels(finalResult);
        processResult(type, cost, finalResult);
      }
    }, 70);
  };

  const processResult = (type: BetType, amount: number, finalReels: string[]) => {
    const isWin = finalReels[0] === finalReels[1] && finalReels[1] === finalReels[2];
    const payout = isWin ? (amount * config.payoutMultiplier) : 0;
    const result = isWin ? BetResult.WIN : BetResult.LOSS;

    onBet({
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      type,
      amount,
      result,
      payout,
    });

    setSpinning(false);
    if (isWin) {
      setIsWinning(true);
      setMessage(`💰 MEGA GANHO: R$ ${payout.toFixed(2)}!`);
      fetchWisdom();
    } else {
      setMessage(consecutiveLosses >= config.minLossesForBoost - 1 ? "🍀 O Tigre está se preparando..." : "Tente novamente!");
    }
  };

  return (
    <div className="w-full max-w-md flex flex-col items-center space-y-6">
      
      {/* Oracle Wisdom */}
      <div className="w-full glass-panel rounded-2xl p-4 relative overflow-hidden border-l-4 border-yellow-500 shadow-lg">
        <div className="flex items-center space-x-3 relative z-10">
          <div className="flex-shrink-0 w-12 h-12 tiger-gradient rounded-full flex items-center justify-center text-2xl shadow-xl border-2 border-white/20 animate-pulse">
            🐯
          </div>
          <div>
            <h3 className="text-yellow-500 font-bold text-[10px] uppercase tracking-widest opacity-80">Mensagem do Tigrinho</h3>
            <p className="text-sm italic text-gray-100 font-medium leading-tight">"{tigerWisdom || "O destino aguarda seu comando..."}"</p>
          </div>
        </div>
      </div>

      {/* Slot Machine Container */}
      <div className={`w-full glass-panel rounded-[2.5rem] p-6 relative border-b-8 border-yellow-800 shadow-2xl bg-gradient-to-b from-gray-800 to-black transition-all duration-500 ${isWinning ? 'ring-4 ring-yellow-400 scale-[1.02]' : ''}`}>
        
        {/* Lights */}
        <div className="absolute top-10 -left-1 w-2 h-20 bg-yellow-500/50 blur-sm rounded-full"></div>
        <div className="absolute top-10 -right-1 w-2 h-20 bg-yellow-500/50 blur-sm rounded-full"></div>

        <div className="text-center mb-6">
          <div className="inline-block px-3 py-1 bg-yellow-500/10 rounded-full border border-yellow-500/20 mb-2">
            <span className="text-[10px] text-yellow-500 font-black uppercase tracking-[0.2em]">Sorte {Math.round(config.winProbability * 100)}%</span>
          </div>
          <h1 className={`font-game text-5xl tracking-widest uppercase transition-colors ${isWinning ? 'text-yellow-400 animate-bounce' : 'text-yellow-600'}`}>
            {isWinning ? 'GRANDE GANHO' : 'FORTUNE TIGER'}
          </h1>
        </div>

        {/* Reels Area */}
        <div className="flex justify-between items-center bg-black/80 rounded-3xl p-4 gap-4 border-2 border-yellow-600/20 shadow-inner min-h-[160px]">
          {reels.map((symbol, i) => (
            <div key={i} className={`flex-1 aspect-[3/4] glass-panel rounded-2xl flex items-center justify-center text-5xl md:text-6xl bg-gradient-to-b from-white/5 to-transparent transition-all ${spinning ? 'blur-[1px] opacity-80' : 'scale-105'}`}>
               <span className={`${spinning ? 'animate-pulse' : ''}`}>{symbol}</span>
            </div>
          ))}
        </div>

        {/* Feedback Message */}
        <div className="mt-8 text-center h-12 flex items-center justify-center">
           <p className={`font-bold text-xl px-6 py-2 rounded-full transition-all duration-300 ${isWinning ? 'text-green-400 bg-green-500/10' : 'text-yellow-500 bg-white/5'}`}>
             {message}
           </p>
        </div>

        {/* Spin Buttons */}
        <div className="mt-6">
          {user.freeSpins > 0 ? (
            <button 
              disabled={spinning}
              onClick={() => spin(BetType.FREE)}
              className={`w-full py-5 rounded-2xl font-game text-3xl tracking-widest shadow-2xl transition-all relative overflow-hidden ${spinning ? 'opacity-50 grayscale' : 'tiger-gradient hover:brightness-125 hover:scale-[1.02] active:scale-95 text-white ring-4 ring-yellow-400/30'}`}
            >
              GIRO GRÁTIS ({user.freeSpins})
            </button>
          ) : (
            <button 
              disabled={spinning || user.balance < 1}
              onClick={() => spin(BetType.REAL)}
              className={`w-full py-5 rounded-2xl font-game text-3xl tracking-widest shadow-2xl transition-all relative overflow-hidden ${spinning || user.balance < 1 ? 'opacity-50 grayscale cursor-not-allowed' : 'bg-green-600 hover:bg-green-500 hover:scale-[1.02] active:scale-95 text-white ring-4 ring-green-400/20'}`}
            >
              JOGAR R$ 1,00
            </button>
          )}
        </div>
      </div>

      {/* Footer Info */}
      <div className="w-full flex justify-between text-[10px] text-gray-500 font-bold uppercase tracking-widest opacity-60">
        <div className="flex items-center space-x-1">
          <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_5px_green]"></span>
          <span>Sessão Segura</span>
        </div>
        <span>RTP: {(config.winProbability * config.payoutMultiplier * 100).toFixed(1)}%</span>
      </div>
    </div>
  );
};

export default TigerGame;

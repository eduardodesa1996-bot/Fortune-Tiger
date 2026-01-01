
import React from 'react';
import { GameConfig } from '../types';

interface Props {
  config: GameConfig;
  setConfig: React.Dispatch<React.SetStateAction<GameConfig>>;
}

const Admin: React.FC<Props> = ({ config, setConfig }) => {
  const updateConfig = (key: keyof GameConfig, value: number) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="w-full max-w-2xl glass-panel rounded-3xl p-8">
      <div className="flex items-center space-x-3 mb-8 border-b border-white/10 pb-4">
        <i className="fa-solid fa-gears text-3xl text-yellow-500"></i>
        <h2 className="font-game text-4xl text-yellow-500 tracking-wider">PAINEL DO DONO</h2>
      </div>

      <div className="space-y-8">
        <section className="space-y-4">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Algoritmo de Probabilidades</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-panel p-4 rounded-xl">
              <label className="block text-xs font-bold mb-2">CHANCE DE VITÓRIA PADRÃO: <span className="text-yellow-500">{Math.round(config.winProbability * 100)}%</span></label>
              <input 
                type="range" 
                min="0" max="1" step="0.05" 
                value={config.winProbability} 
                onChange={(e) => updateConfig('winProbability', Number(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-yellow-500"
              />
            </div>

            <div className="glass-panel p-4 rounded-xl">
              <label className="block text-xs font-bold mb-2">CHANCE DE VITÓRIA TURBINADA: <span className="text-green-500">{Math.round(config.boostedProbability * 100)}%</span></label>
              <input 
                type="range" 
                min="0" max="1" step="0.05" 
                value={config.boostedProbability} 
                onChange={(e) => updateConfig('boostedProbability', Number(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-green-500"
              />
            </div>

            <div className="glass-panel p-4 rounded-xl">
              <label className="block text-xs font-bold mb-2">MÍN. PERDAS PARA ATIVAR TURBO: <span className="text-red-500">{config.minLossesForBoost}</span></label>
              <input 
                type="number" 
                value={config.minLossesForBoost} 
                onChange={(e) => updateConfig('minLossesForBoost', Number(e.target.value))}
                className="w-full bg-black/30 border border-white/10 rounded-lg p-2 focus:outline-none focus:border-yellow-500"
              />
            </div>

            <div className="glass-panel p-4 rounded-xl">
              <label className="block text-xs font-bold mb-2">MULTIPLICADOR DE PAGAMENTO: <span className="text-blue-500">{config.payoutMultiplier}x</span></label>
              <input 
                type="number" 
                step="0.1"
                value={config.payoutMultiplier} 
                onChange={(e) => updateConfig('payoutMultiplier', Number(e.target.value))}
                className="w-full bg-black/30 border border-white/10 rounded-lg p-2 focus:outline-none focus:border-yellow-500"
              />
            </div>
          </div>
        </section>

        <section className="glass-panel p-6 rounded-2xl border-l-4 border-yellow-500">
          <h4 className="font-bold text-yellow-500 mb-2">Como funciona o controle?</h4>
          <ul className="text-xs text-gray-400 space-y-2 list-disc list-inside">
            <li>Aumente o "Padão" para dar mais prêmios constantes.</li>
            <li>Use o "Min Perdas" para evitar que o jogador desista, dando uma vitória garantida após uma sequência ruim.</li>
            <li>O RTP (Return to Player) é calculado automaticamente baseado nessas variáveis.</li>
          </ul>
        </section>

        <div className="flex justify-end pt-4">
          <button onClick={() => alert("Configurações salvas no servidor local!")} className="px-8 py-3 bg-green-600 rounded-xl font-bold text-sm shadow-lg hover:bg-green-700 active:scale-95 transition-all">
            SALVAR ALTERAÇÕES
          </button>
        </div>
      </div>
    </div>
  );
};

export default Admin;

'use client';

import { useState, useEffect } from 'react';
import { GeneratorOptions } from '@/lib/generator';

interface OptionsFormProps {
  options: GeneratorOptions;
  onChange: (options: GeneratorOptions) => void;
  onGenerate: () => void;
  isGenerating?: boolean;
}

export default function OptionsForm({ 
  options, 
  onChange, 
  onGenerate, 
  isGenerating = false 
}: OptionsFormProps) {
  const [localOptions, setLocalOptions] = useState<GeneratorOptions>(options);

  // Sincronizar com props quando mudarem
  useEffect(() => {
    setLocalOptions(options);
  }, [options]);

  const handleOptionChange = (key: keyof GeneratorOptions, value: any) => {
    const newOptions = { ...localOptions, [key]: value };
    setLocalOptions(newOptions);
    onChange(newOptions);
  };

  const handleLengthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value);
    handleOptionChange('length', value);
  };

  const hasSelectedCharsets = localOptions.lowercase || 
                             localOptions.uppercase || 
                             localOptions.numbers || 
                             localOptions.symbols;

  return (
    <div className="w-full max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
        Opções de Geração
      </h2>

      {/* Comprimento da senha */}
      <div className="mb-6">
        <label 
          htmlFor="password-length" 
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3"
        >
          Comprimento: <span className="font-bold text-blue-600 dark:text-blue-400">{localOptions.length}</span> caracteres
        </label>
        
        <div className="relative">
          <input
            id="password-length"
            type="range"
            min="4"
            max="128"
            value={localOptions.length}
            onChange={handleLengthChange}
            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
            aria-label={`Comprimento da senha: ${localOptions.length} caracteres`}
          />
          
          {/* Marcadores de referência */}
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
            <span>4</span>
            <span>16</span>
            <span>32</span>
            <span>64</span>
            <span>128</span>
          </div>
        </div>
        
        {/* Sugestões de comprimento */}
        <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
          {localOptions.length < 8 && (
            <span className="text-red-600 dark:text-red-400">⚠️ Muito curta</span>
          )}
          {localOptions.length >= 8 && localOptions.length < 12 && (
            <span className="text-yellow-600 dark:text-yellow-400">⚡ Boa</span>
          )}
          {localOptions.length >= 12 && localOptions.length < 16 && (
            <span className="text-green-600 dark:text-green-400">✅ Forte</span>
          )}
          {localOptions.length >= 16 && (
            <span className="text-green-700 dark:text-green-300">🔒 Muito forte</span>
          )}
        </div>
      </div>

      {/* Tipos de caracteres */}
      <div className="mb-6">
        <fieldset>
          <legend className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Tipos de Caracteres
          </legend>
          
          <div className="space-y-3">
            {/* Letras minúsculas */}
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={localOptions.lowercase}
                onChange={(e) => handleOptionChange('lowercase', e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                aria-describedby="lowercase-description"
              />
              <div className="flex-1">
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Letras minúsculas
                </span>
                <p id="lowercase-description" className="text-xs text-gray-500 dark:text-gray-400">
                  a-z (26 caracteres)
                </p>
              </div>
            </label>

            {/* Letras maiúsculas */}
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={localOptions.uppercase}
                onChange={(e) => handleOptionChange('uppercase', e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                aria-describedby="uppercase-description"
              />
              <div className="flex-1">
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Letras maiúsculas
                </span>
                <p id="uppercase-description" className="text-xs text-gray-500 dark:text-gray-400">
                  A-Z (26 caracteres)
                </p>
              </div>
            </label>

            {/* Números */}
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={localOptions.numbers}
                onChange={(e) => handleOptionChange('numbers', e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                aria-describedby="numbers-description"
              />
              <div className="flex-1">
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Números
                </span>
                <p id="numbers-description" className="text-xs text-gray-500 dark:text-gray-400">
                  0-9 (10 caracteres)
                </p>
              </div>
            </label>

            {/* Símbolos */}
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={localOptions.symbols}
                onChange={(e) => handleOptionChange('symbols', e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                aria-describedby="symbols-description"
              />
              <div className="flex-1">
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Símbolos
                </span>
                <p id="symbols-description" className="text-xs text-gray-500 dark:text-gray-400">
                  !@#$%^&*()_+-=[]{}|;:,.&lt;&gt;? (26 caracteres)
                </p>
              </div>
            </label>
          </div>
        </fieldset>
      </div>

      {/* Opções avançadas */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Opções Avançadas
        </h3>
        
        <div className="space-y-3">
          {/* Excluir caracteres similares */}
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={localOptions.excludeSimilar}
              onChange={(e) => handleOptionChange('excludeSimilar', e.target.checked)}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              aria-describedby="exclude-similar-description"
            />
            <div className="flex-1">
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Excluir caracteres similares
              </span>
              <p id="exclude-similar-description" className="text-xs text-gray-500 dark:text-gray-400">
                Remove: i, l, 1, L, o, 0, O
              </p>
            </div>
          </label>

          {/* Excluir caracteres ambíguos */}
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={localOptions.excludeAmbiguous}
              onChange={(e) => handleOptionChange('excludeAmbiguous', e.target.checked)}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              aria-describedby="exclude-ambiguous-description"
            />
            <div className="flex-1">
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Excluir caracteres ambíguos
              </span>
              <p id="exclude-ambiguous-description" className="text-xs text-gray-500 dark:text-gray-400">
                Remove: {}, [], (), /, \, ', ", `, ~, ,, ;, ., &lt;, &gt;
              </p>
            </div>
          </label>

          {/* Garantir todos os tipos */}
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={localOptions.ensureAllTypes}
              onChange={(e) => handleOptionChange('ensureAllTypes', e.target.checked)}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              aria-describedby="ensure-all-types-description"
            />
            <div className="flex-1">
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Garantir todos os tipos selecionados
              </span>
              <p id="ensure-all-types-description" className="text-xs text-gray-500 dark:text-gray-400">
                Inclui pelo menos um caractere de cada tipo selecionado
              </p>
            </div>
          </label>
        </div>
      </div>

      {/* Botão de gerar */}
      <button
        onClick={onGenerate}
        disabled={!hasSelectedCharsets || isGenerating}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
        aria-label="Gerar nova senha"
      >
        {isGenerating ? (
          <div className="flex items-center justify-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            <span>Gerando...</span>
          </div>
        ) : (
          'Gerar Senha'
        )}
      </button>

      {/* Aviso se nenhum tipo selecionado */}
      {!hasSelectedCharsets && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400 text-center">
          Selecione pelo menos um tipo de caractere
        </p>
      )}
    </div>
  );
}

/* Estilos CSS customizados para o slider */
<style jsx>{`
  .slider::-webkit-slider-thumb {
    appearance: none;
    height: 20px;
    width: 20px;
    border-radius: 50%;
    background: #3b82f6;
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  .slider::-moz-range-thumb {
    height: 20px;
    width: 20px;
    border-radius: 50%;
    background: #3b82f6;
    cursor: pointer;
    border: none;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  .slider:focus::-webkit-slider-thumb {
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
  }

  .slider:focus::-moz-range-thumb {
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
  }
`}</style>
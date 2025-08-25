'use client';

import { useMemo } from 'react';
import { calculatePasswordStrength, getPasswordSuggestions, StrengthResult } from '@/lib/strength';
import { GeneratorOptions } from '@/lib/generator';
import { calculateEntropy, estimateCrackTime, formatCrackTime } from '@/lib/generator';

interface StrengthMeterProps {
  password: string;
  options: GeneratorOptions;
  showDetails?: boolean;
}

export default function StrengthMeter({ 
  password, 
  options, 
  showDetails = true 
}: StrengthMeterProps) {
  const strengthResult = useMemo(() => {
    if (!password) {
      return {
        score: 0,
        strength: 'muito-fraca' as const,
        label: 'Nenhuma senha',
        color: 'bg-gray-300',
        percentage: 0
      };
    }
    return calculatePasswordStrength(password, options);
  }, [password, options]);

  const suggestions = useMemo(() => {
    if (!password) return [];
    return getPasswordSuggestions(password, options);
  }, [password, options]);

  const entropy = useMemo(() => {
    if (!password) return 0;
    return calculateEntropy(password, options);
  }, [password, options]);

  const crackTime = useMemo(() => {
    if (!password || entropy === 0) return 0;
    return estimateCrackTime(entropy);
  }, [password, entropy]);

  const getStrengthIcon = (strength: StrengthResult['strength']) => {
    switch (strength) {
      case 'muito-fraca':
        return '🔴';
      case 'fraca':
        return '🟠';
      case 'media':
        return '🟡';
      case 'forte':
        return '🟢';
      case 'muito-forte':
        return '🔵';
      default:
        return '⚪';
    }
  };

  const getProgressBarColor = (score: number) => {
    switch (score) {
      case 0:
        return 'bg-gray-300 dark:bg-gray-600';
      case 1:
        return 'bg-red-500';
      case 2:
        return 'bg-red-400';
      case 3:
        return 'bg-yellow-500';
      case 4:
        return 'bg-green-500';
      case 5:
        return 'bg-green-600';
      default:
        return 'bg-gray-300 dark:bg-gray-600';
    }
  };

  if (!password) {
    return (
      <div className="w-full max-w-2xl mx-auto">
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <div className="text-center text-gray-500 dark:text-gray-400">
            <div className="text-2xl mb-2">⚪</div>
            <p className="text-sm">Gere uma senha para ver a análise de força</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        {/* Cabeçalho com força da senha */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Força da Senha
          </h3>
          <div className="flex items-center space-x-2">
            <span className="text-2xl">{getStrengthIcon(strengthResult.strength)}</span>
            <span className={`font-medium ${
              strengthResult.score <= 1 ? 'text-red-600 dark:text-red-400' :
              strengthResult.score <= 2 ? 'text-yellow-600 dark:text-yellow-400' :
              'text-green-600 dark:text-green-400'
            }`}>
              {strengthResult.label}
            </span>
          </div>
        </div>

        {/* Barra de progresso */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
            <span>Força</span>
            <span>{Math.round(strengthResult.percentage)}%</span>
          </div>
          
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ease-out ${getProgressBarColor(strengthResult.score)}`}
              style={{ width: `${strengthResult.percentage}%` }}
              role="progressbar"
              aria-valuenow={strengthResult.percentage}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`Força da senha: ${strengthResult.label}`}
            >
              <div className="h-full bg-gradient-to-r from-transparent to-white/20"></div>
            </div>
          </div>
          
          {/* Marcadores de níveis */}
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
            <span>Muito Fraca</span>
            <span>Fraca</span>
            <span>Média</span>
            <span>Forte</span>
            <span>Muito Forte</span>
          </div>
        </div>

        {showDetails && (
          <>
            {/* Métricas detalhadas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {/* Comprimento */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                <div className="text-sm text-gray-600 dark:text-gray-400">Comprimento</div>
                <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {password.length} chars
                </div>
              </div>
              
              {/* Entropia */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                <div className="text-sm text-gray-600 dark:text-gray-400">Entropia</div>
                <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {Math.round(entropy)} bits
                </div>
              </div>
              
              {/* Tempo para quebrar */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                <div className="text-sm text-gray-600 dark:text-gray-400">Tempo para quebrar</div>
                <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {formatCrackTime(crackTime)}
                </div>
              </div>
            </div>

            {/* Composição da senha */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Composição da Senha
              </h4>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {/* Minúsculas */}
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${
                    /[a-z]/.test(password) ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                  }`}></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Minúsculas
                  </span>
                </div>
                
                {/* Maiúsculas */}
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${
                    /[A-Z]/.test(password) ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                  }`}></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Maiúsculas
                  </span>
                </div>
                
                {/* Números */}
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${
                    /[0-9]/.test(password) ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                  }`}></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Números
                  </span>
                </div>
                
                {/* Símbolos */}
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${
                    /[^a-zA-Z0-9]/.test(password) ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                  }`}></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Símbolos
                  </span>
                </div>
              </div>
            </div>

            {/* Sugestões de melhoria */}
            {suggestions.length > 0 && (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2 flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  Sugestões para Melhorar
                </h4>
                <ul className="space-y-1">
                  {suggestions.map((suggestion, index) => (
                    <li key={index} className="text-sm text-blue-700 dark:text-blue-300 flex items-start">
                      <span className="mr-2">•</span>
                      <span>{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Informação sobre o cálculo */}
            <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
              <p>
                * Tempo estimado considerando 1 bilhão de tentativas por segundo.
                Senhas reais podem ser mais seguras devido a políticas de bloqueio.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
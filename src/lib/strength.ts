import { CharsetOptions } from './charset';

/**
 * Tipos para avaliação de força da senha
 */
export type PasswordStrength = 'muito-fraca' | 'fraca' | 'media' | 'forte' | 'muito-forte';

export interface StrengthResult {
  score: number; // 0-4
  strength: PasswordStrength;
  label: string;
  color: string;
  percentage: number;
}

/**
 * Calcula a força de uma senha baseada em múltiplos critérios
 * @param password - Senha para avaliar
 * @param options - Opções de caracteres selecionadas
 * @returns Resultado da avaliação de força
 */
export function calculatePasswordStrength(
  password: string,
  options: CharsetOptions
): StrengthResult {
  if (!password) {
    return {
      score: 0,
      strength: 'muito-fraca',
      label: 'Muito Fraca',
      color: 'bg-red-500',
      percentage: 0
    };
  }

  let score = 0;
  const length = password.length;

  // Critério 1: Comprimento (0-2 pontos)
  if (length >= 8) score += 1;
  if (length >= 12) score += 1;
  if (length >= 16) score += 1;

  // Critério 2: Diversidade de caracteres (0-2 pontos)
  const charsetCount = getCharsetVariety(password);
  if (charsetCount >= 2) score += 1;
  if (charsetCount >= 3) score += 1;
  if (charsetCount >= 4) score += 1;

  // Critério 3: Ausência de padrões repetitivos (-1 ponto)
  if (hasRepeatingPatterns(password)) {
    score -= 1;
  }

  // Critério 4: Ausência de sequências (-1 ponto)
  if (hasSequentialPatterns(password)) {
    score -= 1;
  }

  // Normalizar score entre 0-4
  score = Math.max(0, Math.min(4, score));

  return getStrengthResult(score);
}

/**
 * Conta quantos tipos diferentes de caracteres a senha contém
 * @param password - Senha para analisar
 * @returns Número de tipos de caracteres (1-4)
 */
function getCharsetVariety(password: string): number {
  let variety = 0;
  
  if (/[a-z]/.test(password)) variety++; // minúsculas
  if (/[A-Z]/.test(password)) variety++; // maiúsculas
  if (/[0-9]/.test(password)) variety++; // números
  if (/[^a-zA-Z0-9]/.test(password)) variety++; // símbolos
  
  return variety;
}

/**
 * Verifica se a senha tem padrões repetitivos
 * @param password - Senha para analisar
 * @returns true se encontrar padrões repetitivos
 */
function hasRepeatingPatterns(password: string): boolean {
  // Verifica caracteres repetidos consecutivos (3 ou mais)
  if (/(..).*\1/.test(password)) return true;
  
  // Verifica sequências de 3+ caracteres iguais
  if (/(.)\1{2,}/.test(password)) return true;
  
  return false;
}

/**
 * Verifica se a senha tem sequências sequenciais
 * @param password - Senha para analisar
 * @returns true se encontrar sequências
 */
function hasSequentialPatterns(password: string): boolean {
  const sequences = [
    'abcdefghijklmnopqrstuvwxyz',
    'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    '0123456789',
    'qwertyuiopasdfghjklzxcvbnm',
    'QWERTYUIOPASDFGHJKLZXCVBNM'
  ];
  
  for (const sequence of sequences) {
    for (let i = 0; i <= sequence.length - 3; i++) {
      const subseq = sequence.substring(i, i + 3);
      if (password.includes(subseq) || password.includes(subseq.split('').reverse().join(''))) {
        return true;
      }
    }
  }
  
  return false;
}

/**
 * Converte score numérico em resultado de força
 * @param score - Score de 0-4
 * @returns Resultado formatado da força
 */
function getStrengthResult(score: number): StrengthResult {
  const results: Record<number, Omit<StrengthResult, 'score' | 'percentage'>> = {
    0: {
      strength: 'muito-fraca',
      label: 'Muito Fraca',
      color: 'bg-red-500'
    },
    1: {
      strength: 'fraca',
      label: 'Fraca',
      color: 'bg-red-400'
    },
    2: {
      strength: 'media',
      label: 'Média',
      color: 'bg-yellow-500'
    },
    3: {
      strength: 'forte',
      label: 'Forte',
      color: 'bg-green-500'
    },
    4: {
      strength: 'muito-forte',
      label: 'Muito Forte',
      color: 'bg-green-600'
    }
  };
  
  const result = results[score] || results[0];
  
  return {
    score,
    percentage: (score / 4) * 100,
    ...result
  };
}

/**
 * Gera sugestões para melhorar a força da senha
 * @param password - Senha atual
 * @param options - Opções selecionadas
 * @returns Array de sugestões
 */
export function getPasswordSuggestions(
  password: string,
  options: CharsetOptions
): string[] {
  const suggestions: string[] = [];
  
  if (password.length < 8) {
    suggestions.push('Use pelo menos 8 caracteres');
  }
  
  if (password.length < 12) {
    suggestions.push('Considere usar 12 ou mais caracteres para maior segurança');
  }
  
  const variety = getCharsetVariety(password);
  if (variety < 3) {
    suggestions.push('Use uma combinação de letras, números e símbolos');
  }
  
  if (hasRepeatingPatterns(password)) {
    suggestions.push('Evite padrões repetitivos');
  }
  
  if (hasSequentialPatterns(password)) {
    suggestions.push('Evite sequências como "abc" ou "123"');
  }
  
  return suggestions;
}
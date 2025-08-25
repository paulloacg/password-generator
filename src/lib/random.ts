/**
 * Funções para geração segura de números aleatórios usando Web Crypto API
 */

/**
 * Gera um número aleatório seguro entre 0 e max-1
 * @param max - Valor máximo (exclusivo)
 * @returns Número aleatório entre 0 e max-1
 */
export function getSecureRandomInt(max: number): number {
  if (max <= 0) {
    throw new Error('O valor máximo deve ser maior que 0');
  }
  
  // Usar Web Crypto API para entropia segura
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  
  // Evitar bias usando rejection sampling
  const randomValue = array[0];
  const maxValidValue = Math.floor(0xFFFFFFFF / max) * max;
  
  if (randomValue >= maxValidValue) {
    // Rejeitar e tentar novamente para evitar bias
    return getSecureRandomInt(max);
  }
  
  return randomValue % max;
}

/**
 * Seleciona um caractere aleatório de uma string
 * @param str - String para selecionar caractere
 * @returns Caractere aleatório da string
 */
export function getRandomCharacter(str: string): string {
  if (str.length === 0) {
    throw new Error('A string não pode estar vazia');
  }
  
  const randomIndex = getSecureRandomInt(str.length);
  return str[randomIndex];
}

/**
 * Embaralha um array usando algoritmo Fisher-Yates
 * @param array - Array para embaralhar
 * @returns Novo array embaralhado
 */
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = getSecureRandomInt(i + 1);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  
  return shuffled;
}

/**
 * Verifica se Web Crypto API está disponível
 * @returns true se Web Crypto API está disponível
 */
export function isWebCryptoAvailable(): boolean {
  return typeof crypto !== 'undefined' && 
         typeof crypto.getRandomValues === 'function';
}

/**
 * Fallback para ambientes sem Web Crypto API (não recomendado para produção)
 * @param max - Valor máximo (exclusivo)
 * @returns Número aleatório entre 0 e max-1
 */
export function getFallbackRandomInt(max: number): number {
  console.warn('Usando Math.random() como fallback - não é criptograficamente seguro');
  return Math.floor(Math.random() * max);
}

/**
 * Gera número aleatório com fallback automático
 * @param max - Valor máximo (exclusivo)
 * @returns Número aleatório entre 0 e max-1
 */
export function getRandomInt(max: number): number {
  if (isWebCryptoAvailable()) {
    return getSecureRandomInt(max);
  } else {
    return getFallbackRandomInt(max);
  }
}
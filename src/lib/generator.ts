import { CharsetOptions, buildCharacterPool, hasSelectedOptions } from './charset';
import { getRandomCharacter, shuffleArray, getRandomInt } from './random';

/**
 * Interface para opções de geração de senha
 */
export interface GeneratorOptions extends CharsetOptions {
  length: number;
  excludeSimilar: boolean;
  excludeAmbiguous: boolean;
  ensureAllTypes: boolean;
}

/**
 * Caracteres similares que podem ser confundidos
 */
const SIMILAR_CHARACTERS = 'il1Lo0O';

/**
 * Caracteres ambíguos que podem causar confusão
 */
const AMBIGUOUS_CHARACTERS = '{}[]()/\\\'"`~,;.<>';

/**
 * Gera uma senha segura baseada nas opções fornecidas
 * @param options - Opções de geração
 * @returns Senha gerada
 */
export function generatePassword(options: GeneratorOptions): string {
  // Validar opções
  validateOptions(options);
  
  // Construir pool de caracteres
  let characterPool = buildCharacterPool(options);
  
  // Aplicar filtros
  if (options.excludeSimilar) {
    characterPool = excludeCharacters(characterPool, SIMILAR_CHARACTERS);
  }
  
  if (options.excludeAmbiguous) {
    characterPool = excludeCharacters(characterPool, AMBIGUOUS_CHARACTERS);
  }
  
  // Verificar se ainda temos caracteres suficientes
  if (characterPool.length === 0) {
    throw new Error('Nenhum caractere disponível com as opções selecionadas');
  }
  
  // Gerar senha
  if (options.ensureAllTypes) {
    return generatePasswordWithAllTypes(options, characterPool);
  } else {
    return generateRandomPassword(options.length, characterPool);
  }
}

/**
 * Valida as opções de geração
 * @param options - Opções para validar
 */
function validateOptions(options: GeneratorOptions): void {
  if (options.length < 4) {
    throw new Error('O comprimento mínimo da senha é 4 caracteres');
  }
  
  if (options.length > 128) {
    throw new Error('O comprimento máximo da senha é 128 caracteres');
  }
  
  if (!hasSelectedOptions(options)) {
    throw new Error('Pelo menos um tipo de caractere deve ser selecionado');
  }
}

/**
 * Remove caracteres específicos do pool
 * @param pool - Pool de caracteres
 * @param toExclude - Caracteres para excluir
 * @returns Pool filtrado
 */
function excludeCharacters(pool: string, toExclude: string): string {
  return pool
    .split('')
    .filter(char => !toExclude.includes(char))
    .join('');
}

/**
 * Gera senha aleatória simples
 * @param length - Comprimento da senha
 * @param pool - Pool de caracteres
 * @returns Senha gerada
 */
function generateRandomPassword(length: number, pool: string): string {
  const password: string[] = [];
  
  for (let i = 0; i < length; i++) {
    password.push(getRandomCharacter(pool));
  }
  
  return password.join('');
}

/**
 * Gera senha garantindo que todos os tipos selecionados estejam presentes
 * @param options - Opções de geração
 * @param pool - Pool completo de caracteres
 * @returns Senha gerada
 */
function generatePasswordWithAllTypes(
  options: GeneratorOptions,
  pool: string
): string {
  const requiredChars: string[] = [];
  const availablePools: string[] = [];
  
  // Coletar um caractere de cada tipo selecionado
  if (options.lowercase) {
    let lowercasePool = 'abcdefghijklmnopqrstuvwxyz';
    if (options.excludeSimilar) {
      lowercasePool = excludeCharacters(lowercasePool, SIMILAR_CHARACTERS);
    }
    if (lowercasePool.length > 0) {
      requiredChars.push(getRandomCharacter(lowercasePool));
      availablePools.push(lowercasePool);
    }
  }
  
  if (options.uppercase) {
    let uppercasePool = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (options.excludeSimilar) {
      uppercasePool = excludeCharacters(uppercasePool, SIMILAR_CHARACTERS);
    }
    if (uppercasePool.length > 0) {
      requiredChars.push(getRandomCharacter(uppercasePool));
      availablePools.push(uppercasePool);
    }
  }
  
  if (options.numbers) {
    let numbersPool = '0123456789';
    if (options.excludeSimilar) {
      numbersPool = excludeCharacters(numbersPool, SIMILAR_CHARACTERS);
    }
    if (numbersPool.length > 0) {
      requiredChars.push(getRandomCharacter(numbersPool));
      availablePools.push(numbersPool);
    }
  }
  
  if (options.symbols) {
    let symbolsPool = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    if (options.excludeAmbiguous) {
      symbolsPool = excludeCharacters(symbolsPool, AMBIGUOUS_CHARACTERS);
    }
    if (symbolsPool.length > 0) {
      requiredChars.push(getRandomCharacter(symbolsPool));
      availablePools.push(symbolsPool);
    }
  }
  
  // Verificar se temos caracteres suficientes
  if (requiredChars.length > options.length) {
    throw new Error('Comprimento insuficiente para incluir todos os tipos de caracteres');
  }
  
  // Preencher o restante da senha
  const remainingLength = options.length - requiredChars.length;
  const allAvailableChars = availablePools.join('');
  
  for (let i = 0; i < remainingLength; i++) {
    requiredChars.push(getRandomCharacter(allAvailableChars));
  }
  
  // Embaralhar para evitar padrões previsíveis
  return shuffleArray(requiredChars).join('');
}

/**
 * Gera múltiplas senhas de uma vez
 * @param count - Número de senhas para gerar
 * @param options - Opções de geração
 * @returns Array de senhas geradas
 */
export function generateMultiplePasswords(
  count: number,
  options: GeneratorOptions
): string[] {
  if (count < 1 || count > 50) {
    throw new Error('Número de senhas deve estar entre 1 e 50');
  }
  
  const passwords: string[] = [];
  
  for (let i = 0; i < count; i++) {
    passwords.push(generatePassword(options));
  }
  
  return passwords;
}

/**
 * Estima a entropia de uma senha
 * @param password - Senha para analisar
 * @param options - Opções usadas na geração
 * @returns Entropia em bits
 */
export function calculateEntropy(password: string, options: GeneratorOptions): number {
  const poolSize = buildCharacterPool(options).length;
  return Math.log2(Math.pow(poolSize, password.length));
}

/**
 * Estima o tempo para quebrar a senha por força bruta
 * @param entropy - Entropia da senha em bits
 * @param attemptsPerSecond - Tentativas por segundo (padrão: 1 bilhão)
 * @returns Tempo estimado em segundos
 */
export function estimateCrackTime(
  entropy: number,
  attemptsPerSecond: number = 1e9
): number {
  const totalCombinations = Math.pow(2, entropy);
  const averageAttempts = totalCombinations / 2;
  return averageAttempts / attemptsPerSecond;
}

/**
 * Formata o tempo de quebra em formato legível
 * @param seconds - Tempo em segundos
 * @returns String formatada
 */
export function formatCrackTime(seconds: number): string {
  if (seconds < 60) {
    return `${Math.round(seconds)} segundos`;
  } else if (seconds < 3600) {
    return `${Math.round(seconds / 60)} minutos`;
  } else if (seconds < 86400) {
    return `${Math.round(seconds / 3600)} horas`;
  } else if (seconds < 31536000) {
    return `${Math.round(seconds / 86400)} dias`;
  } else {
    const years = seconds / 31536000;
    if (years > 1e12) {
      return 'Mais de 1 trilhão de anos';
    }
    return `${Math.round(years).toLocaleString()} anos`;
  }
}
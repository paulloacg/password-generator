// Conjuntos de caracteres para geração de senhas
export const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
export const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
export const DIGITS = '0123456789';
export const SYMBOLS = '!@#$%^&*()-_=+[]{},.<>/?';

// Tipos para as opções de caracteres
export interface CharsetOptions {
  lowercase: boolean;
  uppercase: boolean;
  digits: boolean;
  symbols: boolean;
}

/**
 * Constrói o pool de caracteres baseado nas opções selecionadas
 * @param options - Opções de conjuntos de caracteres
 * @returns String com todos os caracteres disponíveis
 */
export function buildCharacterPool(options: CharsetOptions): string {
  let pool = '';
  
  if (options.lowercase) pool += LOWERCASE;
  if (options.uppercase) pool += UPPERCASE;
  if (options.digits) pool += DIGITS;
  if (options.symbols) pool += SYMBOLS;
  
  return pool;
}

/**
 * Retorna os conjuntos de caracteres selecionados
 * @param options - Opções de conjuntos de caracteres
 * @returns Array com os conjuntos selecionados
 */
export function getSelectedCharsets(options: CharsetOptions): string[] {
  const charsets: string[] = [];
  
  if (options.lowercase) charsets.push(LOWERCASE);
  if (options.uppercase) charsets.push(UPPERCASE);
  if (options.digits) charsets.push(DIGITS);
  if (options.symbols) charsets.push(SYMBOLS);
  
  return charsets;
}

/**
 * Verifica se pelo menos uma opção está selecionada
 * @param options - Opções de conjuntos de caracteres
 * @returns true se pelo menos uma opção está ativa
 */
export function hasSelectedOptions(options: CharsetOptions): boolean {
  return options.lowercase || options.uppercase || options.digits || options.symbols;
}
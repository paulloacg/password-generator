'use client';

import { useState } from 'react';
import { ClipboardIcon, CheckIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

interface PasswordOutputProps {
  password: string;
  isGenerating?: boolean;
  onRegenerate?: () => void;
  onCopySuccess?: () => void;
  onCopyError?: (error: string) => void;
}

export default function PasswordOutput({ 
  password, 
  isGenerating = false, 
  onRegenerate,
  onCopySuccess,
  onCopyError 
}: PasswordOutputProps) {
  const [copied, setCopied] = useState(false);
  const [showPassword, setShowPassword] = useState(true);

  const handleCopy = async () => {
    if (!password) return;
    
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      onCopySuccess?.();
      
      // Reset copied state after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Erro ao copiar senha:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido ao copiar';
      onCopyError?.(errorMessage);
      // Fallback para navegadores mais antigos
      fallbackCopy(password);
    }
  };

  const fallbackCopy = (text: string) => {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      document.execCommand('copy');
      setCopied(true);
      onCopySuccess?.();
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Erro no fallback de cópia:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro no fallback de cópia';
      onCopyError?.(errorMessage);
    } finally {
      document.body.removeChild(textArea);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const displayPassword = showPassword ? password : '•'.repeat(password.length);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <label 
        htmlFor="password-output" 
        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
      >
        Senha Gerada
      </label>
      
      <div className="relative">
        <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 shadow-sm">
          <input
            id="password-output"
            type="text"
            value={displayPassword}
            readOnly
            className="flex-1 px-4 py-3 text-lg font-mono bg-transparent border-none outline-none text-gray-900 dark:text-gray-100 selection:bg-blue-200 dark:selection:bg-blue-800"
            placeholder={isGenerating ? "Gerando senha..." : "Clique em 'Gerar Senha' para começar"}
            aria-label="Senha gerada"
          />
          
          <div className="flex items-center gap-2 px-3">
            {/* Botão de visibilidade */}
            <button
              onClick={togglePasswordVisibility}
              disabled={!password || isGenerating}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              title={showPassword ? "Ocultar senha" : "Mostrar senha"}
            >
              {showPassword ? (
                <EyeSlashIcon className="w-5 h-5" />
              ) : (
                <EyeIcon className="w-5 h-5" />
              )}
            </button>
            
            {/* Botão de copiar */}
            <button
              onClick={handleCopy}
              disabled={!password || isGenerating}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label="Copiar senha"
              title={copied ? "Copiado!" : "Copiar senha"}
            >
              {copied ? (
                <CheckIcon className="w-5 h-5 text-green-500" />
              ) : (
                <ClipboardIcon className="w-5 h-5" />
              )}
            </button>
            
            {/* Botão de regenerar */}
            {onRegenerate && (
              <button
                onClick={onRegenerate}
                disabled={isGenerating}
                className="px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/20"
                aria-label="Gerar nova senha"
              >
                {isGenerating ? 'Gerando...' : 'Nova'}
              </button>
            )}
          </div>
        </div>
        
        {/* Indicador de loading */}
        {isGenerating && (
          <div className="absolute inset-0 bg-white/50 dark:bg-gray-800/50 rounded-lg flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          </div>
        )}
      </div>
      
      {/* Informações da senha */}
      {password && !isGenerating && (
        <div className="mt-3 flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
          <span>Comprimento: {password.length} caracteres</span>
          {copied && (
            <span className="text-green-600 dark:text-green-400 font-medium">
              ✓ Copiado para a área de transferência
            </span>
          )}
        </div>
      )}
      
      {/* Aviso de segurança */}
      <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
        <div className="flex items-start gap-2">
          <div className="flex-shrink-0">
            <svg className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="text-sm text-amber-800 dark:text-amber-200">
            <p className="font-medium">Dica de Segurança:</p>
            <p>Nunca compartilhe sua senha e use senhas únicas para cada conta.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
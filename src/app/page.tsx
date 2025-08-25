'use client';

import { useState, useCallback } from 'react';
import PasswordOutput from '@/components/PasswordOutput';
import OptionsForm from '@/components/OptionsForm';
import StrengthMeter from '@/components/StrengthMeter';
import SkipLink from '@/components/SkipLink';
import { ToastContainer, useToast } from '@/components/Toast';
import { generatePassword, GeneratorOptions } from '@/lib/generator';
import { isWebCryptoAvailable } from '@/lib/random';

const DEFAULT_OPTIONS: GeneratorOptions = {
  length: 16,
  lowercase: true,
  uppercase: true,
  numbers: true,
  symbols: false,
  excludeSimilar: false,
  excludeAmbiguous: false,
  ensureAllTypes: true
};

export default function Home() {
  const [password, setPassword] = useState<string>('');
  const [options, setOptions] = useState<GeneratorOptions>(DEFAULT_OPTIONS);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toasts, removeToast, success, error: showError, warning } = useToast();

  const handleGenerate = useCallback(async () => {
    setIsGenerating(true);
    
    try {
      // Verificar se Web Crypto API está disponível
      if (!isWebCryptoAvailable()) {
        warning(
          'Fallback de Segurança',
          'Web Crypto API não disponível. Usando gerador alternativo.',
          4000
        );
      }
      
      // Simular um pequeno delay para melhor UX
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const newPassword = generatePassword(options);
      setPassword(newPassword);
      
      // Mostrar toast de sucesso
      success(
        'Senha Gerada!',
        'Nova senha segura criada com sucesso.',
        3000
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido ao gerar senha';
      showError(
        'Erro ao Gerar Senha',
        errorMessage,
        5000
      );
      console.error('Erro ao gerar senha:', err);
    } finally {
      setIsGenerating(false);
    }
  }, [options, success, showError, warning]);

  const handleOptionsChange = useCallback((newOptions: GeneratorOptions) => {
    setOptions(newOptions);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <SkipLink />
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  Gerador de Senhas Seguras
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Crie senhas fortes e seguras instantaneamente
                </p>
              </div>
            </div>
            
            {/* Indicador de segurança */}
            <div className="hidden sm:flex items-center space-x-2 text-sm">
              <div className="flex items-center space-x-1 text-green-600 dark:text-green-400">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Criptograficamente Seguro</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
       <main 
         id="main-content" 
         className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
         role="main"
         aria-label="Gerador de senhas seguras"
       >


        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" role="region" aria-label="Interface do gerador de senhas">
          {/* Coluna da esquerda - Opções */}
           <div className="lg:col-span-1" role="region" aria-label="Opções de configuração">
            <OptionsForm
              options={options}
              onChange={handleOptionsChange}
              onGenerate={handleGenerate}
              isGenerating={isGenerating}
            />
          </div>

          {/* Coluna da direita - Resultado */}
           <div className="lg:col-span-2 space-y-6" role="region" aria-label="Resultado e análise da senha">
            {/* Output da senha */}
            <PasswordOutput
              password={password}
              isGenerating={isGenerating}
              onRegenerate={handleGenerate}
              onCopySuccess={() => success(
                'Copiado!',
                'Senha copiada para a área de transferência.',
                2000
              )}
              onCopyError={(error) => showError(
                'Erro ao Copiar',
                error,
                4000
              )}
            />

            {/* Medidor de força */}
            <StrengthMeter
              password={password}
              options={options}
              showDetails={true}
            />
          </div>
        </div>

        {/* Seção de informações */}
         <div className="mt-12 max-w-4xl mx-auto" role="region" aria-label="Dicas de segurança">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              💡 Dicas de Segurança
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                  ✅ Boas Práticas
                </h3>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• Use senhas únicas para cada conta</li>
                  <li>• Prefira senhas com 12+ caracteres</li>
                  <li>• Combine diferentes tipos de caracteres</li>
                  <li>• Use um gerenciador de senhas</li>
                  <li>• Ative autenticação de dois fatores</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                  ❌ Evite
                </h3>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• Informações pessoais (nome, data de nascimento)</li>
                  <li>• Palavras do dicionário</li>
                  <li>• Sequências (123456, abcdef)</li>
                  <li>• Reutilizar senhas</li>
                  <li>• Compartilhar senhas</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
       <footer 
         className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 mt-16"
         role="contentinfo"
         aria-label="Informações do rodapé"
       >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              © 2025 Gerador de Senhas Seguras. Desenvolvido por{' '}
              <a 
                href="https://instagram.com/paulloacg" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-200 font-medium"
                aria-label="Instagram do Paulo Gomes"
              >
                Paulo Gomes
              </a>
              {' '}com Next.js e TypeScript.
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
              Todas as senhas são geradas localmente no seu navegador. Nenhuma informação é enviada para servidores externos.
            </p>
          </div>
        </div>
      </footer>
      
      {/* Container de Toasts */}
      <ToastContainer 
        toasts={toasts} 
        onRemoveToast={removeToast} 
        position="top-right" 
      />
    </div>
  );
}

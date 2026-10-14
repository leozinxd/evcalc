/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  CalculationInputs,
  ClientData,
  CompanyData,
  MaterialItem,
  SavedQuote,
} from './types';
import {
  DEFAULT_CLIENT,
  DEFAULT_COMPANY,
  DEFAULT_PRICES,
} from './constants/presets';
import {
  analyzeElectrical,
  formatBRL,
  generateDefaultMaterials,
} from './utils/calculations';
import { exportToCSV, generateWhatsAppMessage } from './utils/exportUtils';
import { Header } from './components/Header';
import { CalculatorInputs } from './components/CalculatorInputs';
import { MaterialsTable } from './components/MaterialsTable';
import { FinancialSummary } from './components/FinancialSummary';
import { ClientForm } from './components/ClientForm';
import { ProposalReport } from './components/ProposalReport';
import { CompanySettings } from './components/CompanySettings';
import {
  Zap,
  CheckCircle2,
  BookmarkPlus,
  History,
  FileText,
  AlertCircle,
  Copy,
  ExternalLink,
} from 'lucide-react';

const STORAGE_KEY_COMPANY = 'voltcharge_company_data';
const STORAGE_KEY_CLIENT = 'voltcharge_client_data';
const STORAGE_KEY_QUOTES = 'voltcharge_saved_quotes';

export default function App() {
  const [activeTab, setActiveTab] = useState<'calculator' | 'proposal' | 'settings'>('calculator');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // 1. Estado inicial exatamente igual à planilha do usuário
  const [inputs, setInputs] = useState<CalculationInputs>({
    potenciaKw: 7.0,
    distanciaMetros: 30,
    tipoLigacao: 'MONOFÁSICO',
    bitolaCabo: '10 mm²',
    taxaMenor30: DEFAULT_PRICES.taxaInstalacaoMenor30, // R$ 56,00
    taxaMaior30: DEFAULT_PRICES.taxaInstalacaoMaior30, // R$ 50,00
    chargerModelName: 'Wallbox BYD 7.0 kW',
    includeEquipment: false,
    equipmentPrice: 4200,
    customArtTax: 0,
    discountPercentage: 5,
    bdiMarginPercentage: 0,
  });

  // 2. Dados da Empresa (com persistência local)
  const [company, setCompany] = useState<CompanyData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_COMPANY);
      return saved ? JSON.parse(saved) : DEFAULT_COMPANY;
    } catch {
      return DEFAULT_COMPANY;
    }
  });

  // 3. Dados do Cliente (com persistência local)
  const [client, setClient] = useState<ClientData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CLIENT);
      return saved ? JSON.parse(saved) : DEFAULT_CLIENT;
    } catch {
      return DEFAULT_CLIENT;
    }
  });

  // 4. Lista de Materiais e Serviços
  const [materials, setMaterials] = useState<MaterialItem[]>(() => {
    return generateDefaultMaterials({
      potenciaKw: 7.0,
      distanciaMetros: 30,
      tipoLigacao: 'MONOFÁSICO',
      bitolaCabo: '10 mm²',
      taxaMenor30: 56.0,
      taxaMaior30: 50.0,
      chargerModelName: 'Wallbox BYD 7.0 kW',
      includeEquipment: false,
      equipmentPrice: 4200,
      customArtTax: 0,
      discountPercentage: 5,
      bdiMarginPercentage: 0,
    });
  });

  // 5. Histórico de Orçamentos Salvos
  const [savedQuotes, setSavedQuotes] = useState<SavedQuote[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_QUOTES);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Salvar no localStorage quando dados da empresa ou cliente mudarem
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_COMPANY, JSON.stringify(company));
    } catch (e) {
      console.warn('Erro ao salvar dados da empresa:', e);
    }
  }, [company]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CLIENT, JSON.stringify(client));
    } catch (e) {
      console.warn('Erro ao salvar dados do cliente:', e);
    }
  }, [client]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_QUOTES, JSON.stringify(savedQuotes));
    } catch (e) {
      console.warn('Erro ao salvar histórico de orçamentos:', e);
    }
  }, [savedQuotes]);

  // Recalcular materiais automáticos quando parâmetros mudam
  const updateInputs = (newInputs: Partial<CalculationInputs>) => {
    setInputs((prev) => {
      const updated = { ...prev, ...newInputs };
      setMaterials((prevMaterials) =>
        generateDefaultMaterials(updated, prevMaterials)
      );
      return updated;
    });
  };

  // Análise elétrica instantânea
  const electricalAnalysis = useMemo(() => {
    return analyzeElectrical(inputs);
  }, [inputs]);

  // Cálculos financeiros
  const subtotalMateriais = useMemo(() => {
    return materials
      .filter((m) => m.category !== 'mao_de_obra' && m.category !== 'carregador')
      .reduce((acc, curr) => acc + curr.total, 0);
  }, [materials]);

  const subtotalMaoDeObra = useMemo(() => {
    return materials
      .filter((m) => m.category === 'mao_de_obra')
      .reduce((acc, curr) => acc + curr.total, 0);
  }, [materials]);

  const equipmentPriceTotal = useMemo(() => {
    if (!inputs.includeEquipment) return 0;
    const item = materials.find((m) => m.category === 'carregador');
    return item ? item.total : inputs.equipmentPrice;
  }, [materials, inputs.includeEquipment, inputs.equipmentPrice]);

  const totalGeral = useMemo(() => {
    return materials.reduce((acc, curr) => acc + curr.total, 0);
  }, [materials]);

  // Manipulação de itens da tabela
  const handleUpdateItem = (id: string, updates: Partial<MaterialItem>) => {
    setMaterials((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const handleDeleteItem = (id: string) => {
    setMaterials((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAddItem = (item: Omit<MaterialItem, 'id' | 'total'>) => {
    const newItem: MaterialItem = {
      ...item,
      id: `custom_${Date.now()}`,
      total: Math.round(item.quantity * item.unitPrice * 100) / 100,
    };
    setMaterials((prev) => [...prev, newItem]);
    showToast('Novo item adicionado com sucesso!');
  };

  const handleResetToDefaults = () => {
    const fresh = generateDefaultMaterials(inputs);
    setMaterials(fresh);
    showToast('Fórmulas e valores originais restaurados!');
  };

  // Notificações Toast
  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Ações de exportação
  const handlePrint = () => {
    window.print();
  };

  const handleExportCsv = () => {
    exportToCSV(inputs, materials, totalGeral);
    showToast('Planilha CSV gerada e baixada com sucesso!');
  };

  const handleShareWhatsApp = async () => {
    const text = generateWhatsAppMessage(
      company,
      client,
      inputs,
      materials,
      totalGeral
    );
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(text);
        showToast('Resumo copiado para a área de transferência! Cole no WhatsApp.');
      } else {
        const encoded = encodeURIComponent(text);
        window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
      }
    } catch {
      showToast('Texto gerado!');
    }
  };

  // Salvar Orçamento Atual no Histórico
  const handleSaveQuoteToHistory = () => {
    const quoteCode = `ORC-${new Date().getFullYear()}-${Math.floor(
      1000 + Math.random() * 9000
    )}`;
    const newQuote: SavedQuote = {
      id: `quote_${Date.now()}`,
      code: quoteCode,
      createdAt: new Date().toLocaleDateString('pt-BR'),
      client: { ...client },
      inputs: { ...inputs },
      materials: [...materials],
      subtotalMateriais,
      subtotalMaoDeObra,
      valorEquipamento: equipmentPriceTotal,
      totalGeral,
    };

    setSavedQuotes((prev) => [newQuote, ...prev.slice(0, 19)]); // Guardar até 20
    showToast(`Orçamento ${quoteCode} salvo no histórico!`);
  };

  const handleLoadQuote = (quote: SavedQuote) => {
    setClient(quote.client);
    setInputs(quote.inputs);
    setMaterials(quote.materials);
    setActiveTab('calculator');
    showToast(`Orçamento ${quote.code} carregado!`);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-lg shadow-lg text-xs font-semibold flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header com Top Bar Contract */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onPrint={handlePrint}
        onShareWhatsApp={handleShareWhatsApp}
        onExportCsv={handleExportCsv}
        totalGeral={totalGeral}
      />

      {/* Conteúdo Principal */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* ABA 1: CALCULADORA & MEMORIAL */}
        {activeTab === 'calculator' && (
          <div className="space-y-6 animate-fade-in">
            {/* Bloco de Dados do Cliente e Local */}
            <ClientForm
              client={client}
              onChange={(updates) => setClient((prev) => ({ ...prev, ...updates }))}
            />

            {/* Bloco de Inputs e Regras da Planilha */}
            <CalculatorInputs
              inputs={inputs}
              onChange={updateInputs}
              electricalAnalysis={electricalAnalysis}
            />

            {/* Memorial Analítico de Materiais */}
            <MaterialsTable
              materials={materials}
              onUpdateItem={handleUpdateItem}
              onDeleteItem={handleDeleteItem}
              onAddItem={handleAddItem}
              onResetToDefaults={handleResetToDefaults}
              subtotalMateriais={subtotalMateriais}
              subtotalMaoDeObra={subtotalMaoDeObra}
              totalGeral={totalGeral}
            />

            {/* Resumo Financeiro & Condições */}
            <FinancialSummary
              subtotalMateriais={subtotalMateriais}
              subtotalMaoDeObra={subtotalMaoDeObra}
              equipmentPrice={equipmentPriceTotal}
              includeEquipment={inputs.includeEquipment}
              totalGeral={totalGeral}
              discountPercentage={inputs.discountPercentage}
              onDiscountChange={(val) => updateInputs({ discountPercentage: val })}
              onGoToProposal={() => setActiveTab('proposal')}
            />

            {/* Barra de Ações Rápidas Inferior */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-200">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSaveQuoteToHistory}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg shadow-2xs transition-colors"
                >
                  <BookmarkPlus className="w-3.5 h-3.5 text-slate-600" />
                  <span>Salvar Orçamento no Histórico</span>
                </button>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-500 font-mono">
                  Total Calculado: <strong>{formatBRL(totalGeral)}</strong>
                </span>
                <button
                  type="button"
                  onClick={() => setActiveTab('proposal')}
                  className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-sm transition-colors"
                >
                  Gerar Proposta Oficial com Logo
                </button>
              </div>
            </div>

            {/* Histórico de Orçamentos Salvos (se houver) */}
            {savedQuotes.length > 0 && (
              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <div className="flex items-center gap-2 mb-3 text-xs font-bold uppercase tracking-wider text-slate-700">
                  <History className="w-4 h-4 text-emerald-600" />
                  <span>Orçamentos Salvos Recentemente ({savedQuotes.length})</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                  {savedQuotes.map((q) => (
                    <div
                      key={q.id}
                      onClick={() => handleLoadQuote(q)}
                      className="p-3 rounded-lg border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/20 cursor-pointer transition-all text-xs"
                    >
                      <div className="flex justify-between font-bold text-slate-900 font-mono">
                        <span>{q.code}</span>
                        <span>{formatBRL(q.totalGeral)}</span>
                      </div>
                      <div className="text-slate-600 font-medium truncate mt-1">
                        {q.client.nome || 'Cliente'}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {q.inputs.distanciaMetros}m · {q.inputs.tipoLigacao} · {q.createdAt}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ABA 2: RELATÓRIO & PROPOSTA TÉCNICA */}
        {activeTab === 'proposal' && (
          <ProposalReport
            company={company}
            client={client}
            inputs={inputs}
            materials={materials}
            subtotalMateriais={subtotalMateriais}
            subtotalMaoDeObra={subtotalMaoDeObra}
            equipmentPrice={equipmentPriceTotal}
            includeEquipment={inputs.includeEquipment}
            totalGeral={totalGeral}
            electricalAnalysis={electricalAnalysis}
            onPrint={handlePrint}
            onShareWhatsApp={handleShareWhatsApp}
            onExportCsv={handleExportCsv}
            onBackToCalculator={() => setActiveTab('calculator')}
          />
        )}

        {/* ABA 3: CONFIGURAÇÕES DA EMPRESA & LOGO */}
        {activeTab === 'settings' && (
          <CompanySettings
            company={company}
            onChange={(updates) => setCompany((prev) => ({ ...prev, ...updates }))}
            onResetDefaults={() => setCompany(DEFAULT_COMPANY)}
          />
        )}
      </main>

      {/* Footer Minimalista */}
      <footer className="no-print mt-auto py-5 border-t border-slate-200 bg-white text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-emerald-600" />
            <span>VoltCalc EV · Calculadora de Infraestrutura para Carregadores de Veículos Elétricos</span>
          </div>
          <div>
            <span>Conformidade NBR 5410 & NBR 17019 · {company.nomeFantasia}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

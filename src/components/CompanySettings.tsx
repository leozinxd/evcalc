import React, { useRef } from 'react';
import { CompanyData, CalculationInputs } from '../types';
import {
  Building2,
  Upload,
  Trash2,
  ShieldCheck,
  Check,
  Image as ImageIcon,
  DollarSign,
} from 'lucide-react';

interface CompanySettingsProps {
  company: CompanyData;
  onChange: (updates: Partial<CompanyData>) => void;
  onResetDefaults: () => void;
  inputs: CalculationInputs;
  onInputsChange: (updates: Partial<CalculationInputs>) => void;
}

export const CompanySettings: React.FC<CompanySettingsProps> = ({
  company,
  onChange,
  onResetDefaults,
  inputs,
  onInputsChange,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert('Por favor, selecione uma imagem menor que 2MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      onChange({ logoUrl: result });
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = () => {
    onChange({ logoUrl: null });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-3">
        <div>
          <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-emerald-600" />
            Configurações da Empresa Instaladora & Logotipo
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Personalize a identidade visual, taxas de mão de obra e os dados técnicos que aparecem no relatório e na proposta do cliente.
          </p>
        </div>

        <button
          type="button"
          onClick={onResetDefaults}
          className="text-xs font-medium text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
        >
          Restaurar Dados Padrão
        </button>
      </div>

      {/* Upload do Logotipo */}
      <div className="p-5 bg-slate-50 rounded-xl border border-slate-200">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-2">
          Logotipo da Empresa (Aparecerá no Relatório e Proposta)
        </label>

        <div className="flex flex-col sm:flex-row items-center gap-5">
          {/* Preview Box */}
          <div className="w-48 h-24 rounded-lg border-2 border-dashed border-slate-300 bg-white flex items-center justify-center p-2 overflow-hidden shadow-2xs relative">
            {company.logoUrl ? (
              <img
                src={company.logoUrl}
                alt="Logo da Empresa"
                className="max-h-full max-w-full object-contain"
              />
            ) : (
              <div className="text-center text-slate-400 p-2">
                <ImageIcon className="w-6 h-6 mx-auto mb-1 opacity-60" />
                <span className="text-[11px] block font-medium">Logo Padrão Ativa</span>
              </div>
            )}
          </div>

          {/* Upload Controls */}
          <div className="space-y-2 text-center sm:text-left">
            <div className="flex items-center gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png, image/jpeg, image/webp, image/svg+xml"
                onChange={handleLogoUpload}
                className="hidden"
                id="logo-upload-input"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-900 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg shadow-2xs transition-colors"
              >
                <Upload className="w-3.5 h-3.5 text-slate-600" />
                <span>Carregar Nova Logo</span>
              </button>

              {company.logoUrl && (
                <button
                  type="button"
                  onClick={handleRemoveLogo}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors"
                  title="Remover logotipo personalizado"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remover</span>
                </button>
              )}
            </div>
            <p className="text-[11px] text-slate-500">
              Formatos recomendados: PNG transparente ou SVG. Tamanho máx.: 2MB.
            </p>
          </div>
        </div>
      </div>

      {/* SEÇÃO: Precificação de Instalação (Mão de Obra por Metro) */}
      <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-2 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Precificação de Instalação (Mão de Obra por Metro)
              </h3>
              <p className="text-xs text-slate-500">
                Valores base de mão de obra e engenharia para o cálculo automático com base na distância.
              </p>
            </div>
          </div>
          <span className="text-[11px] text-slate-500 font-mono bg-white px-2.5 py-1 rounded border border-slate-200 self-start sm:self-auto">
            Regra: Transição automática aos 30 metros
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* INSTALAÇÃO/M (<30) */}
          <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-800">
                INSTALAÇÃO/M (&lt;30)
              </label>
              <span className="text-[10px] text-slate-400 font-medium">Distâncias &lt; 30m</span>
            </div>
            <div className="relative mt-1.5">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">
                R$
              </span>
              <input
                type="number"
                step="0.5"
                min="0"
                value={inputs.taxaMenor30}
                onChange={(e) =>
                  onInputsChange({
                    taxaMenor30: Math.max(0, parseFloat(e.target.value) || 0),
                  })
                }
                className="w-full bg-white border border-slate-300 rounded-md py-1.5 pl-9 pr-3 text-sm font-bold text-slate-900 font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1.5">
              Valor padrão: R$ 56,00/m
            </p>
          </div>

          {/* INSTALAÇÃO/M (>30) */}
          <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-800">
                INSTALAÇÃO/M (&gt;30)
              </label>
              <span className="text-[10px] text-slate-400 font-medium">Distâncias ≥ 30m</span>
            </div>
            <div className="relative mt-1.5">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">
                R$
              </span>
              <input
                type="number"
                step="0.5"
                min="0"
                value={inputs.taxaMaior30}
                onChange={(e) =>
                  onInputsChange({
                    taxaMaior30: Math.max(0, parseFloat(e.target.value) || 0),
                  })
                }
                className="w-full bg-white border border-slate-300 rounded-md py-1.5 pl-9 pr-3 text-sm font-bold text-slate-900 font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1.5">
              Valor padrão: R$ 50,00/m
            </p>
          </div>

          {/* Taxa fixa ART / Projeto */}
          <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-800">
                TAXA FIXA ART / CREA
              </label>
              <span className="text-[10px] text-slate-400 font-medium">Opcional</span>
            </div>
            <div className="relative mt-1.5">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">
                R$
              </span>
              <input
                type="number"
                step="10"
                min="0"
                value={inputs.customArtTax}
                onChange={(e) =>
                  onInputsChange({
                    customArtTax: Math.max(0, parseFloat(e.target.value) || 0),
                  })
                }
                className="w-full bg-white border border-slate-300 rounded-md py-1.5 pl-9 pr-3 text-sm font-bold text-slate-900 font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                placeholder="0,00"
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1.5">
              Taxa fixa somada à mão de obra calculada
            </p>
          </div>
        </div>
      </div>

      {/* Formulário de Dados Cadastrais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className="text-xs font-semibold text-slate-700 block mb-1">
            Nome Fantasia da Empresa
          </label>
          <input
            type="text"
            value={company.nomeFantasia}
            onChange={(e) => onChange({ nomeFantasia: e.target.value })}
            className="w-full bg-white border border-slate-300 rounded-md py-1.5 px-3 text-xs font-medium text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-700 block mb-1">
            Razão Social
          </label>
          <input
            type="text"
            value={company.razaoSocial}
            onChange={(e) => onChange({ razaoSocial: e.target.value })}
            className="w-full bg-white border border-slate-300 rounded-md py-1.5 px-3 text-xs font-medium text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-700 block mb-1">
            CNPJ
          </label>
          <input
            type="text"
            value={company.cnpj}
            onChange={(e) => onChange({ cnpj: e.target.value })}
            className="w-full bg-white border border-slate-300 rounded-md py-1.5 px-3 text-xs font-medium text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-700 block mb-1">
            Responsável Técnico
          </label>
          <input
            type="text"
            value={company.responsavelTecnico}
            onChange={(e) => onChange({ responsavelTecnico: e.target.value })}
            className="w-full bg-white border border-slate-300 rounded-md py-1.5 px-3 text-xs font-medium text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-700 block mb-1">
            Registro Profissional (CREA / CFT)
          </label>
          <input
            type="text"
            value={company.registroProfissional}
            onChange={(e) => onChange({ registroProfissional: e.target.value })}
            className="w-full bg-white border border-slate-300 rounded-md py-1.5 px-3 text-xs font-medium text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-700 block mb-1">
            Telefone / WhatsApp Comercial
          </label>
          <input
            type="text"
            value={company.telefone}
            onChange={(e) => onChange({ telefone: e.target.value })}
            className="w-full bg-white border border-slate-300 rounded-md py-1.5 px-3 text-xs font-medium text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-700 block mb-1">
            E-mail Comercial
          </label>
          <input
            type="email"
            value={company.email}
            onChange={(e) => onChange({ email: e.target.value })}
            className="w-full bg-white border border-slate-300 rounded-md py-1.5 px-3 text-xs font-medium text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-700 block mb-1">
            Cidade / Estado
          </label>
          <input
            type="text"
            value={company.cidadeUf}
            onChange={(e) => onChange({ cidadeUf: e.target.value })}
            className="w-full bg-white border border-slate-300 rounded-md py-1.5 px-3 text-xs font-medium text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-700 block mb-1">
            Chave PIX para Pagamento
          </label>
          <input
            type="text"
            value={company.pixKey || ''}
            onChange={(e) => onChange({ pixKey: e.target.value })}
            placeholder="Chave CNPJ, e-mail ou aleatória"
            className="w-full bg-white border border-slate-300 rounded-md py-1.5 px-3 text-xs font-medium text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
        </div>

        <div className="lg:col-span-3">
          <label className="text-xs font-semibold text-slate-700 block mb-1">
            Termos de Garantia e Conformidade Técnica
          </label>
          <textarea
            rows={3}
            value={company.condicoesGarantia || ''}
            onChange={(e) => onChange({ condicoesGarantia: e.target.value })}
            className="w-full bg-white border border-slate-300 rounded-md py-2 px-3 text-xs text-slate-800 leading-relaxed focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { formatBRL } from '../utils/calculations';
import { CreditCard, Banknote, Percent, ShieldCheck, ArrowRight } from 'lucide-react';

interface FinancialSummaryProps {
  subtotalMateriais: number;
  subtotalMaoDeObra: number;
  equipmentPrice: number;
  includeEquipment: boolean;
  totalGeral: number;
  discountPercentage: number;
  onDiscountChange: (discount: number) => void;
  onGoToProposal: () => void;
}

export const FinancialSummary: React.FC<FinancialSummaryProps> = ({
  subtotalMateriais,
  subtotalMaoDeObra,
  equipmentPrice,
  includeEquipment,
  totalGeral,
  discountPercentage,
  onDiscountChange,
  onGoToProposal,
}) => {
  const discountValue = (totalGeral * discountPercentage) / 100;
  const totalComDesconto = totalGeral - discountValue;

  // Simulação de parcelamento (12x)
  const parcelas12 = totalGeral / 12;
  const parcelas6 = totalGeral / 6;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Card 1: Composição de Custos */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
          Composição do Orçamento
        </h3>
        <div className="space-y-2.5 text-xs">
          <div className="flex justify-between items-center text-slate-600">
            <span>Materiais Elétricos & Tubulações:</span>
            <span className="font-mono font-semibold text-slate-900">
              {formatBRL(subtotalMateriais)}
            </span>
          </div>
          <div className="flex justify-between items-center text-slate-600">
            <span>Mão de Obra, ART & Comissionamento:</span>
            <span className="font-mono font-semibold text-slate-900">
              {formatBRL(subtotalMaoDeObra)}
            </span>
          </div>
          {includeEquipment && (
            <div className="flex justify-between items-center text-slate-600">
              <span>Equipamento Carregador EV:</span>
              <span className="font-mono font-semibold text-slate-900">
                {formatBRL(equipmentPrice)}
              </span>
            </div>
          )}
          <div className="pt-2.5 border-t border-slate-100 flex justify-between items-center text-sm font-bold text-slate-900">
            <span>Valor Bruto Total:</span>
            <span className="font-mono text-base">{formatBRL(totalGeral)}</span>
          </div>
        </div>
      </div>

      {/* Card 2: Condições de Pagamento */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center justify-between">
          <span>Condições Comerciais</span>
          <span className="text-[11px] font-normal text-slate-400">Personalizável</span>
        </h3>

        <div className="space-y-3">
          {/* Desconto à vista */}
          <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-lg border border-slate-200">
            <div className="flex items-center gap-2">
              <Banknote className="w-4 h-4 text-emerald-600" />
              <div>
                <div className="text-xs font-bold text-slate-900">À Vista (PIX / TED)</div>
                <div className="text-[11px] text-slate-500">
                  {discountPercentage}% de desconto: {formatBRL(totalComDesconto)}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1 w-20">
              <input
                type="number"
                min="0"
                max="25"
                value={discountPercentage}
                onChange={(e) =>
                  onDiscountChange(Math.max(0, parseFloat(e.target.value) || 0))
                }
                className="w-12 text-center text-xs font-bold bg-white border border-slate-300 rounded py-1 px-1 font-mono focus:ring-1 focus:ring-emerald-500"
              />
              <span className="text-xs text-slate-500">%</span>
            </div>
          </div>

          {/* Parcelamento Cartão */}
          <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-lg border border-slate-200">
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-slate-700" />
              <div>
                <div className="text-xs font-bold text-slate-900">Cartão de Crédito</div>
                <div className="text-[11px] text-slate-500">
                  6x de {formatBRL(parcelas6)} ou 12x de {formatBRL(parcelas12)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Card 3: Call to Action & Conformidade */}
      <div className="bg-slate-900 text-white p-5 rounded-xl shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Garantia & Emissão de ART</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed mt-1">
            Instalação com memorial descritivo, proteção contra surtos (DPS), DR Tipo A específico para recarga veicular e conformidade com a ABNT NBR 17019.
          </p>
        </div>

        <button
          type="button"
          onClick={onGoToProposal}
          className="mt-4 w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"
        >
          <span>Visualizar Relatório & Proposta Completa</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

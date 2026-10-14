import React from 'react';
import {
  BitolaCabo,
  CalculationInputs,
  ChargerPreset,
  TipoLigacao,
} from '../types';
import { CHARGER_PRESETS } from '../constants/presets';
import { ElectricalAnalysis } from '../utils/calculations';
import {
  Zap,
  Gauge,
  Sliders,
  AlertTriangle,
  CheckCircle2,
  Info,
  DollarSign,
} from 'lucide-react';

interface CalculatorInputsProps {
  inputs: CalculationInputs;
  onChange: (newInputs: Partial<CalculationInputs>) => void;
  electricalAnalysis: ElectricalAnalysis;
}

export const CalculatorInputs: React.FC<CalculatorInputsProps> = ({
  inputs,
  onChange,
  electricalAnalysis,
}) => {
  const handlePresetSelect = (preset: ChargerPreset) => {
    onChange({
      potenciaKw: preset.powerKw,
      tipoLigacao: preset.tipoLigacao,
      bitolaCabo: preset.defaultCabo,
      chargerModelName: preset.model,
      equipmentPrice: preset.equipmentPrice || 0,
    });
  };

  const isDistanciaAcima30 = inputs.distanciaMetros >= 30;
  const currentLaborRate = isDistanciaAcima30
    ? inputs.taxaMaior30
    : inputs.taxaMenor30;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-emerald-600" />
            Parâmetros da Instalação
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Defina a potência, distância de cabeamento, tipo de rede e taxas por metro.
          </p>
        </div>
        <div className="text-right">
          <span className="text-xs font-medium text-slate-500 block">
            Taxa Aplicada Mão de Obra:
          </span>
          <span className="text-sm font-bold text-slate-900 font-mono">
            R$ {currentLaborRate.toFixed(2)}/m{' '}
            <span className="text-xs font-normal text-slate-500">
              ({isDistanciaAcima30 ? '≥ 30m' : '< 30m'})
            </span>
          </span>
        </div>
      </div>

      {/* Seletor rápido de modelo / preset */}
      <div>
        <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-2">
          Modelos e Fabricantes de Carregadores (Atalho Rápido)
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {CHARGER_PRESETS.map((preset) => {
            const isSelected =
              inputs.chargerModelName === preset.model ||
              (inputs.chargerModelName.includes(preset.brand) &&
                inputs.potenciaKw === preset.powerKw);
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => handlePresetSelect(preset)}
                className={`p-2.5 rounded-lg border text-left transition-all ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-50/60 ring-1 ring-emerald-600'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="text-xs font-bold text-slate-900 truncate">
                  {preset.brand}
                </div>
                <div className="text-xs text-slate-600 font-mono mt-0.5">
                  {preset.powerKw} kW
                </div>
                <div className="text-[10px] text-slate-400 truncate mt-0.5">
                  {preset.tipoLigacao}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid com os 4 inputs principais da planilha */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. POTÊNCIA CARREGADOR */}
        <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
          <label className="text-xs font-semibold text-slate-700 block mb-1">
            POTÊNCIA CARREGADOR (kW)
          </label>
          <div className="relative mt-1">
            <input
              type="number"
              step="0.1"
              min="1"
              max="50"
              value={inputs.potenciaKw}
              onChange={(e) =>
                onChange({ potenciaKw: Math.max(1, parseFloat(e.target.value) || 7) })
              }
              className="w-full bg-white border border-slate-300 rounded-md py-1.5 pl-3 pr-10 text-sm font-bold text-slate-900 font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-500">
              kW
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1.5">
            Padrão: 7 kW (residencial) ou 11/22 kW (trifásico)
          </p>
        </div>

        {/* 2. DISTÂNCIA */}
        <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-semibold text-slate-700">
              DISTÂNCIA (m)
            </label>
            <span className="text-xs font-bold text-emerald-700 font-mono">
              {inputs.distanciaMetros} metros
            </span>
          </div>
          <div className="relative mt-1">
            <input
              type="number"
              min="1"
              max="200"
              value={inputs.distanciaMetros}
              onChange={(e) =>
                onChange({
                  distanciaMetros: Math.max(1, parseInt(e.target.value) || 1),
                })
              }
              className="w-full bg-white border border-slate-300 rounded-md py-1.5 pl-3 pr-10 text-sm font-bold text-slate-900 font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-500">
              m
            </span>
          </div>
          <input
            type="range"
            min="5"
            max="100"
            step="1"
            value={inputs.distanciaMetros}
            onChange={(e) =>
              onChange({ distanciaMetros: parseInt(e.target.value) })
            }
            className="w-full mt-2 accent-emerald-600 cursor-pointer"
          />
        </div>

        {/* 3. TIPO DE LIGAÇÃO */}
        <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
          <label className="text-xs font-semibold text-slate-700 block mb-1">
            TIPO DE LIGAÇÃO
          </label>
          <select
            value={inputs.tipoLigacao}
            onChange={(e) =>
              onChange({ tipoLigacao: e.target.value as TipoLigacao })
            }
            className="w-full mt-1 bg-white border border-slate-300 rounded-md py-1.5 px-3 text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          >
            <option value="MONOFÁSICO">MONOFÁSICO (220V - 3 Cabos)</option>
            <option value="BIFÁSICO">BIFÁSICO (220V - 4 Cabos)</option>
            <option value="TRIFÁSICO">TRIFÁSICO (380V - 5 Cabos)</option>
          </select>
          <p className="text-[11px] text-slate-500 mt-1.5">
            {inputs.tipoLigacao === 'MONOFÁSICO' && 'Fase + Neutro + Terra (3 fios)'}
            {inputs.tipoLigacao === 'BIFÁSICO' && '2 Fases + Neutro + Terra (4 fios)'}
            {inputs.tipoLigacao === 'TRIFÁSICO' && '3 Fases + Neutro + Terra (5 fios)'}
          </p>
        </div>

        {/* 4. CABO CA */}
        <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
          <label className="text-xs font-semibold text-slate-700 block mb-1">
            CABO CA (Bitola Condutores)
          </label>
          <select
            value={inputs.bitolaCabo}
            onChange={(e) =>
              onChange({ bitolaCabo: e.target.value as BitolaCabo })
            }
            className="w-full mt-1 bg-white border border-slate-300 rounded-md py-1.5 px-3 text-sm font-semibold text-slate-900 font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          >
            <option value="6 mm²">6 mm² (até 36A)</option>
            <option value="10 mm²">10 mm² (Padrão Planilha - até 50A)</option>
            <option value="16 mm²">16 mm² (até 68A)</option>
            <option value="25 mm²">25 mm² (até 89A)</option>
            <option value="35 mm²">35 mm² (até 110A)</option>
            <option value="50 mm²">50 mm² (até 134A)</option>
          </select>
          <p className="text-[11px] text-slate-500 mt-1.5">
            Cobre flexível 750V / 1kV NBR NM 247-3
          </p>
        </div>
      </div>

      {/* Precificação de Instalação (Regras da planilha) */}
      <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-emerald-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Precificação de Instalação (Mão de Obra por Metro)
            </h3>
          </div>
          <span className="text-xs text-slate-500">
            Regra automática de transição em 30 metros
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* INSTALAÇÃO/M (<30) */}
          <div className="bg-white p-3 rounded-lg border border-slate-200">
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-700">
                INSTALAÇÃO/M (&lt;30)
              </label>
              <span className="text-[10px] text-slate-400">Distâncias &lt; 30m</span>
            </div>
            <div className="relative mt-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400">
                R$
              </span>
              <input
                type="number"
                step="0.5"
                min="0"
                value={inputs.taxaMenor30}
                onChange={(e) =>
                  onChange({
                    taxaMenor30: Math.max(0, parseFloat(e.target.value) || 0),
                  })
                }
                className="w-full bg-white border border-slate-300 rounded-md py-1.5 pl-8 pr-3 text-sm font-bold text-slate-900 font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Padrão da planilha: R$ 56,00/m
            </p>
          </div>

          {/* INSTALAÇÃO/M (>30) */}
          <div className="bg-white p-3 rounded-lg border border-slate-200">
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-700">
                INSTALAÇÃO/M (&gt;30)
              </label>
              <span className="text-[10px] text-slate-400">Distâncias ≥ 30m</span>
            </div>
            <div className="relative mt-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400">
                R$
              </span>
              <input
                type="number"
                step="0.5"
                min="0"
                value={inputs.taxaMaior30}
                onChange={(e) =>
                  onChange({
                    taxaMaior30: Math.max(0, parseFloat(e.target.value) || 0),
                  })
                }
                className="w-full bg-white border border-slate-300 rounded-md py-1.5 pl-8 pr-3 text-sm font-bold text-slate-900 font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Padrão da planilha: R$ 50,00/m
            </p>
          </div>

          {/* Taxa de ART / Projeto opcional */}
          <div className="bg-white p-3 rounded-lg border border-slate-200">
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-700">
                TAXA FIXA ART / CREA
              </label>
              <span className="text-[10px] text-slate-400">Opcional</span>
            </div>
            <div className="relative mt-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400">
                R$
              </span>
              <input
                type="number"
                step="10"
                min="0"
                value={inputs.customArtTax}
                onChange={(e) =>
                  onChange({
                    customArtTax: Math.max(0, parseFloat(e.target.value) || 0),
                  })
                }
                className="w-full bg-white border border-slate-300 rounded-md py-1.5 pl-8 pr-3 text-sm font-bold text-slate-900 font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                placeholder="0,00"
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Somada ao valor do serviço de engenharia
            </p>
          </div>
        </div>
      </div>

      {/* Fornecimento do Carregador (Equipamento Wallbox) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-slate-50 rounded-lg border border-slate-200">
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="includeEquipment"
            checked={inputs.includeEquipment}
            onChange={(e) => onChange({ includeEquipment: e.target.checked })}
            className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
          />
          <label
            htmlFor="includeEquipment"
            className="text-xs sm:text-sm font-semibold text-slate-900 cursor-pointer"
          >
            Incluir fornecimento do Carregador Wallbox no orçamento
          </label>
        </div>

        {inputs.includeEquipment && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-600 whitespace-nowrap">
              Preço do Carregador:
            </span>
            <div className="relative w-36">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                R$
              </span>
              <input
                type="number"
                min="0"
                step="50"
                value={inputs.equipmentPrice}
                onChange={(e) =>
                  onChange({
                    equipmentPrice: Math.max(0, parseFloat(e.target.value) || 0),
                  })
                }
                className="w-full bg-white border border-slate-300 rounded-md py-1 pl-7 pr-2 text-xs font-bold text-slate-900 font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>
        )}
      </div>

      {/* Análise Técnica de Engenharia (Conformidade NBR 5410 & NBR 17019) */}
      <div
        className={`p-3.5 rounded-lg border text-xs flex flex-col md:flex-row md:items-center justify-between gap-3 ${
          electricalAnalysis.isVoltageDropOk && electricalAnalysis.isCapacityOk
            ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
            : 'bg-amber-50/80 border-amber-200 text-amber-950'
        }`}
      >
        <div className="flex items-start gap-2.5">
          {electricalAnalysis.isVoltageDropOk && electricalAnalysis.isCapacityOk ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          )}
          <div>
            <span className="font-bold block">
              Dimensionamento Técnico (NBR 5410 / NBR 17019):
            </span>
            <p className="mt-0.5 text-slate-700">
              {electricalAnalysis.recommendationMessage}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-slate-700 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-200">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-slate-500 block">
              Corrente Nominal
            </span>
            <span className="font-mono font-bold text-slate-900 text-xs">
              {electricalAnalysis.currentAmps} A
            </span>
          </div>
          <span className="text-slate-300">|</span>
          <div>
            <span className="text-[10px] uppercase tracking-wider text-slate-500 block">
              Queda de Tensão
            </span>
            <span
              className={`font-mono font-bold text-xs ${
                electricalAnalysis.isVoltageDropOk
                  ? 'text-emerald-700'
                  : 'text-amber-700'
              }`}
            >
              {electricalAnalysis.voltageDropPercentage}% ({electricalAnalysis.voltageDropVolts}V)
            </span>
          </div>
          <span className="text-slate-300">|</span>
          <div>
            <span className="text-[10px] uppercase tracking-wider text-slate-500 block">
              Limite NBR
            </span>
            <span className="font-mono font-medium text-slate-600 text-xs">
              máx. 4,0%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

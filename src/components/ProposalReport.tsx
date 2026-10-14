import React from 'react';
import {
  CalculationInputs,
  ClientData,
  CompanyData,
  MaterialItem,
} from '../types';
import { formatBRL, ElectricalAnalysis } from '../utils/calculations';
import {
  Printer,
  Share2,
  FileSpreadsheet,
  Zap,
  ShieldCheck,
  CheckCircle,
  Calendar,
  Building,
  User,
  MapPin,
  Clock,
  ArrowLeft,
} from 'lucide-react';

interface ProposalReportProps {
  company: CompanyData;
  client: ClientData;
  inputs: CalculationInputs;
  materials: MaterialItem[];
  subtotalMateriais: number;
  subtotalMaoDeObra: number;
  equipmentPrice: number;
  includeEquipment: boolean;
  totalGeral: number;
  electricalAnalysis: ElectricalAnalysis;
  onPrint: () => void;
  onShareWhatsApp: () => void;
  onExportCsv: () => void;
  onBackToCalculator: () => void;
  proposalNumber?: string;
}

export const ProposalReport: React.FC<ProposalReportProps> = ({
  company,
  client,
  inputs,
  materials,
  subtotalMateriais,
  subtotalMaoDeObra,
  equipmentPrice,
  includeEquipment,
  totalGeral,
  electricalAnalysis,
  onPrint,
  onShareWhatsApp,
  onExportCsv,
  onBackToCalculator,
  proposalNumber = 'PROP-2026-1042',
}) => {
  const currentDate = new Date().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  const validUntilDate = new Date(
    Date.now() + (company.validadePropostaDias || 15) * 24 * 60 * 60 * 1000
  ).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  const discountValue = (totalGeral * inputs.discountPercentage) / 100;
  const totalComDesconto = totalGeral - discountValue;
  const parcelas12 = totalGeral / 12;

  return (
    <div className="space-y-6">
      {/* Barra de Ações Superior (Não sai na impressão) */}
      <div className="no-print bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBackToCalculator}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Voltar para Calculadora</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onExportCsv}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-slate-600" />
            <span>Exportar CSV</span>
          </button>
          <button
            type="button"
            onClick={onShareWhatsApp}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors"
          >
            <Share2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Copiar WhatsApp</span>
          </button>
          <button
            type="button"
            onClick={onPrint}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir Proposta / Salvar PDF</span>
          </button>
        </div>
      </div>

      {/* DOCUMENTO DA PROPOSTA (Formatado para impressão A4 e visualização em tela) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 sm:p-10 max-w-4xl mx-auto print:p-0 print:border-none print:shadow-none print:max-w-none text-slate-900">
        {/* Cabeçalho da Proposta */}
        <div className="flex flex-col sm:flex-row items-start justify-between gap-6 pb-6 border-b-2 border-slate-900">
          {/* Logo e Dados da Empresa */}
          <div className="flex items-center gap-4">
            {company.logoUrl ? (
              <img
                src={company.logoUrl}
                alt={company.nomeFantasia}
                className="h-16 w-auto max-w-[200px] object-contain"
              />
            ) : (
              <div className="w-14 h-14 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-sm shrink-0">
                <Zap className="w-8 h-8" />
              </div>
            )}

            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight leading-tight">
                {company.nomeFantasia || company.razaoSocial}
              </h1>
              <p className="text-xs text-slate-600 font-medium">
                {company.razaoSocial}
              </p>
              <div className="text-[11px] text-slate-500 mt-1 space-y-0.5">
                <div>CNPJ: {company.cnpj} · {company.cidadeUf}</div>
                <div>
                  Resp. Técnico: {company.responsavelTecnico} ({company.registroProfissional})
                </div>
                <div>Contato: {company.telefone} · {company.email}</div>
              </div>
            </div>
          </div>

          {/* Dados do Documento */}
          <div className="text-left sm:text-right shrink-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
              Proposta Comercial & Memorial Técnico
            </span>
            <span className="text-base font-extrabold text-slate-900 font-mono block">
              Nº {proposalNumber}
            </span>
            <div className="text-xs text-slate-600 mt-1 space-y-0.5 font-mono">
              <div>Emissão: {currentDate}</div>
              <div>Validade: {validUntilDate}</div>
            </div>
          </div>
        </div>

        {/* Informações do Cliente & Local */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-5 border-b border-slate-200">
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-2">
              Dados do Cliente (Contratante)
            </span>
            <div className="text-xs space-y-1 text-slate-800">
              <div className="font-bold text-slate-900 text-sm">
                {client.nome || 'Cliente Final'}
              </div>
              {client.documento && <div>CPF/CNPJ: {client.documento}</div>}
              {client.telefone && <div>Telefone: {client.telefone}</div>}
              {client.email && <div>E-mail: {client.email}</div>}
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-2">
              Local e Especificações da Recarga
            </span>
            <div className="text-xs space-y-1 text-slate-800">
              <div>
                <strong className="text-slate-900">Endereço: </strong>
                {client.endereco || 'Endereço da instalação'}, {client.cidadeUf}
              </div>
              <div>
                <strong className="text-slate-900">Tipo de Imóvel: </strong>
                {client.tipoImovel}
              </div>
              <div>
                <strong className="text-slate-900">Veículo Atendido: </strong>
                {client.modeloVeiculo || 'Veículo Elétrico / PHEV'}
              </div>
              <div>
                <strong className="text-slate-900">Equipamento: </strong>
                {inputs.chargerModelName} ({inputs.potenciaKw} kW)
              </div>
            </div>
          </div>
        </div>

        {/* Resumo Técnico de Dimensionamento */}
        <div className="py-4 border-b border-slate-200">
          <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-2.5">
            Parâmetros Técnicos de Dimensionamento (Normas ABNT NBR 5410 & NBR 17019)
          </span>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
              <span className="text-[10px] text-slate-500 uppercase block">
                Potência Nominal
              </span>
              <span className="font-mono font-bold text-slate-900">
                {inputs.potenciaKw} kW ({electricalAnalysis.currentAmps} A)
              </span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
              <span className="text-[10px] text-slate-500 uppercase block">
                Distância Cabeamento
              </span>
              <span className="font-mono font-bold text-slate-900">
                {inputs.distanciaMetros} metros lineares
              </span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
              <span className="text-[10px] text-slate-500 uppercase block">
                Alimentação Elétrica
              </span>
              <span className="font-mono font-bold text-slate-900">
                {inputs.tipoLigacao} ({electricalAnalysis.nominalVoltage}V)
              </span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
              <span className="text-[10px] text-slate-500 uppercase block">
                Bitola / Queda de Tensão
              </span>
              <span className="font-mono font-bold text-emerald-700">
                {inputs.bitolaCabo} (ΔV: {electricalAnalysis.voltageDropPercentage}%)
              </span>
            </div>
          </div>
        </div>

        {/* Memorial Analítico de Custos (Tabela) */}
        <div className="py-5">
          <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-3">
            Planilha Analítica de Materiais, Equipamentos e Mão de Obra
          </span>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse border border-slate-200 text-xs">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider border-b border-slate-200">
                  <th className="py-2.5 px-3">Item / Descrição</th>
                  <th className="py-2.5 px-2 text-center w-16">QNT</th>
                  <th className="py-2.5 px-2 text-center w-16">UNID.</th>
                  <th className="py-2.5 px-3 text-right w-28">VALOR UNIT.</th>
                  <th className="py-2.5 px-3 text-right w-28">TOTAL</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-sans">
                {materials.map((item, index) => {
                  const isLabor = item.category === 'mao_de_obra';
                  const isEquipment = item.category === 'carregador';

                  return (
                    <tr
                      key={item.id}
                      className={
                        isLabor
                          ? 'bg-slate-50/70 font-semibold'
                          : isEquipment
                          ? 'bg-emerald-50/30 font-medium'
                          : ''
                      }
                    >
                      <td className="py-2 px-3">
                        <div className="font-medium text-slate-900">
                          {item.name}
                        </div>
                        {item.formulaDescription && (
                          <div className="text-[10px] text-slate-500 font-normal">
                            {item.formulaDescription}
                          </div>
                        )}
                      </td>
                      <td className="py-2 px-2 text-center font-mono text-slate-700">
                        {item.quantity}
                      </td>
                      <td className="py-2 px-2 text-center text-slate-500">
                        {item.unit}
                      </td>
                      <td className="py-2 px-3 text-right font-mono text-slate-700">
                        {formatBRL(item.unitPrice)}
                      </td>
                      <td className="py-2 px-3 text-right font-mono font-bold text-slate-900 tabular-nums">
                        {formatBRL(item.total)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Subtotais e Total Geral */}
          <div className="mt-3 bg-slate-50 p-4 rounded-lg border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="space-y-1 text-slate-600">
              <div>
                Subtotal Materiais e Infraestrutura: <strong className="font-mono text-slate-900">{formatBRL(subtotalMateriais)}</strong>
              </div>
              <div>
                Subtotal Instalação, ART e Engenharia: <strong className="font-mono text-slate-900">{formatBRL(subtotalMaoDeObra)}</strong>
              </div>
              {includeEquipment && (
                <div>
                  Fornecimento Carregador: <strong className="font-mono text-slate-900">{formatBRL(equipmentPrice)}</strong>
                </div>
              )}
            </div>

            <div className="text-left sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-200">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                VALOR TOTAL DA PROPOSTA
              </span>
              <span className="text-xl sm:text-2xl font-extrabold text-slate-900 font-mono tabular-nums block">
                {formatBRL(totalGeral)}
              </span>
            </div>
          </div>
        </div>

        {/* Condições de Pagamento e Chave PIX */}
        <div className="py-4 border-b border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1.5">
            <span className="font-bold text-slate-900 block">
              Condições de Pagamento:
            </span>
            <div className="text-slate-700">
              • <strong>À Vista via PIX / TED:</strong> {formatBRL(totalComDesconto)}{' '}
              {inputs.discountPercentage > 0 && `(com ${inputs.discountPercentage}% de desconto)`}
            </div>
            <div className="text-slate-700">
              • <strong>Parcelado em até 12x:</strong> 12x de {formatBRL(parcelas12)} sem juros no cartão
            </div>
            {company.pixKey && (
              <div className="pt-1 text-[11px] text-slate-600">
                <strong>Chave PIX:</strong> {company.pixKey}
              </div>
            )}
          </div>

          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1.5">
            <span className="font-bold text-slate-900 block">
              Prazos & Validade:
            </span>
            <div className="text-slate-700">
              • <strong>Prazo de Execução:</strong> {company.prazoInstalacaoDias || 5} dias úteis após aprovação
            </div>
            <div className="text-slate-700">
              • <strong>Validade da Proposta:</strong> {company.validadePropostaDias || 15} dias corridos
            </div>
            <div className="text-slate-700">
              • <strong>Incluso:</strong> Emissão de ART registrada e relatório fotográfico
            </div>
          </div>
        </div>

        {/* Escopo do Serviço e Garantia */}
        <div className="py-4 border-b border-slate-200 text-xs text-slate-700 space-y-2">
          <span className="font-bold text-slate-900 block">
            Escopo dos Serviços e Critérios de Segurança:
          </span>
          <ul className="list-disc list-inside space-y-1 text-[11px] leading-relaxed text-slate-600">
            <li>
              Instalação de eletroduto antichama e fixação em abraçadeiras tipo chaveta a cada 1 metro.
            </li>
            <li>
              Passagem de cabos de cobre flexível de alta condutividade com terminais tubulares prensados.
            </li>
            <li>
              Montagem de Quadro Mobi Box com Dispositivo DR Tipo A (proteção contra fugas de corrente contínua suave conforme NBR 17019), DPS Classe II e Disjuntor Curva C dedicado.
            </li>
            <li>
              Fixação e parametrização de potência da Wallbox, com teste de carga e protocolo de comissionamento.
            </li>
            <li>
              Emissão de Anotação de Responsabilidade Técnica (ART) por engenheiro eletricista habilitado.
            </li>
          </ul>

          <div className="pt-2 text-[11px] text-slate-500 italic">
            {company.condicoesGarantia}
          </div>
        </div>

        {/* Campos de Assinatura */}
        <div className="pt-8 grid grid-cols-1 sm:grid-cols-2 gap-10 text-center break-inside-avoid">
          <div>
            <div className="border-b border-slate-400 w-3/4 mx-auto mb-2"></div>
            <span className="text-xs font-bold text-slate-900 block">
              {client.nome || 'Cliente Contratante'}
            </span>
            <span className="text-[11px] text-slate-500 block">
              De Acordo e Autorização dos Serviços
            </span>
          </div>

          <div>
            <div className="border-b border-slate-400 w-3/4 mx-auto mb-2"></div>
            <span className="text-xs font-bold text-slate-900 block">
              {company.responsavelTecnico}
            </span>
            <span className="text-[11px] text-slate-500 block">
              {company.registroProfissional} · {company.nomeFantasia}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

import {
  CalculationInputs,
  ClientData,
  CompanyData,
  MaterialItem,
} from '../types';
import { formatBRL } from './calculations';

export function exportToCSV(
  inputs: CalculationInputs,
  materials: MaterialItem[],
  totalGeral: number
): void {
  const formatMoney = (val: number) => `"${formatBRL(val)}"`;

  const rows: string[] = [
    `POTENCIA CARREGADOR,${inputs.potenciaKw},,`,
    `DISTANCIA,${inputs.distanciaMetros},,`,
    `TIPO DE LIGAÇÃO,${inputs.tipoLigacao},,`,
    `CABO CA,${inputs.bitolaCabo.replace(' mm²', '')},,`,
    `INSTALAÇÃO/M (<30),${formatMoney(inputs.taxaMenor30)},,`,
    `INSTALAÇÃO/M (>30),${formatMoney(inputs.taxaMaior30)},,`,
    ',,,',
    ',QNT,VALOR UNIT.,TOTAL',
  ];

  materials.forEach((item) => {
    rows.push(
      `"${item.name}",${item.quantity},${formatMoney(item.unitPrice)},${formatMoney(item.total)}`
    );
  });

  rows.push(`TOTAL,,,${formatMoney(totalGeral)}`);

  const csvContent = '\uFEFF' + rows.join('\r\n'); // BOM para UTF-8 no Excel
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute(
    'download',
    `Orcamento_Carregador_EV_${inputs.distanciaMetros}m_${new Date().toISOString().split('T')[0]}.csv`
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function generateWhatsAppMessage(
  company: CompanyData,
  client: ClientData,
  inputs: CalculationInputs,
  materials: MaterialItem[],
  totalGeral: number
): string {
  const discountVal = (totalGeral * inputs.discountPercentage) / 100;
  const aVista = totalGeral - discountVal;
  const parc12 = totalGeral / 12;

  let msg = `⚡ *ORÇAMENTO DE INSTALAÇÃO DE CARREGADOR EV*\n`;
  msg += `*${company.nomeFantasia || company.razaoSocial}*\n\n`;

  msg += `👤 *Cliente:* ${client.nome || 'Cliente'}\n`;
  if (client.endereco) msg += `📍 *Local:* ${client.endereco}\n`;
  if (client.modeloVeiculo) msg += `🚗 *Veículo:* ${client.modeloVeiculo}\n`;
  msg += `🔋 *Carregador:* ${inputs.chargerModelName} (${inputs.potenciaKw} kW)\n`;
  msg += `📏 *Distância do QGBT:* ${inputs.distanciaMetros} metros\n`;
  msg += `🔌 *Tipo de Rede:* ${inputs.tipoLigacao} | Cabo ${inputs.bitolaCabo}\n\n`;

  msg += `📋 *RESUMO DO MEMORIAL DE MATERIAIS & SERVIÇOS:*\n`;
  materials.forEach((item) => {
    msg += `• ${item.name}: ${item.quantity} ${item.unit} (${formatBRL(item.total)})\n`;
  });

  msg += `\n💰 *INVESTIMENTO TOTAL:* *${formatBRL(totalGeral)}*\n`;
  msg += `💵 *À Vista (PIX):* ${formatBRL(aVista)} (${inputs.discountPercentage}% OFF)\n`;
  msg += `💳 *Cartão de Crédito:* até 12x de ${formatBRL(parc12)}\n\n`;

  msg += `🛡️ *Garantia:* 12 meses com emissão de ART CREA inclusa.\n`;
  msg += `📞 *Dúvidas ou agendamento:* ${company.telefone}\n`;

  return msg;
}

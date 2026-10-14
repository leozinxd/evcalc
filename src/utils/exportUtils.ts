import {
  CalculationInputs,
  ClientData,
  CompanyData,
  MaterialItem,
} from '../types';
import { formatBRL, ElectricalAnalysis } from './calculations';

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

export function downloadPrintableHtml(
  company: CompanyData,
  client: ClientData,
  inputs: CalculationInputs,
  materials: MaterialItem[],
  subtotalMateriais: number,
  subtotalMaoDeObra: number,
  equipmentPrice: number,
  includeEquipment: boolean,
  totalGeral: number,
  electricalAnalysis: ElectricalAnalysis,
  proposalNumber: string = 'PROP-2026-1042'
): void {
  const currentDate = new Date().toLocaleDateString('pt-BR');
  const validUntilDate = new Date(
    Date.now() + (company.validadePropostaDias || 15) * 24 * 60 * 60 * 1000
  ).toLocaleDateString('pt-BR');

  const discountVal = (totalGeral * inputs.discountPercentage) / 100;
  const totalComDesconto = totalGeral - discountVal;
  const parcelas12 = totalGeral / 12;

  const rowsHtml = materials
    .map(
      (item) => `
    <tr style="border-bottom: 1px solid #e2e8f0; ${
      item.category === 'mao_de_obra' ? 'background-color: #f8fafc; font-weight: 600;' : ''
    }">
      <td style="padding: 8px 12px; font-size: 12px;">
        <div style="color: #0f172a; font-weight: 600;">${item.name}</div>
        ${
          item.formulaDescription
            ? `<div style="font-size: 10px; color: #64748b; font-weight: normal;">${item.formulaDescription}</div>`
            : ''
        }
      </td>
      <td style="padding: 8px 6px; text-align: center; font-size: 12px; font-family: monospace;">${
        item.quantity
      }</td>
      <td style="padding: 8px 6px; text-align: center; font-size: 11px; color: #64748b;">${
        item.unit
      }</td>
      <td style="padding: 8px 12px; text-align: right; font-size: 12px; font-family: monospace;">${formatBRL(
        item.unitPrice
      )}</td>
      <td style="padding: 8px 12px; text-align: right; font-size: 12px; font-family: monospace; font-weight: 700; color: #0f172a;">${formatBRL(
        item.total
      )}</td>
    </tr>
  `
    )
    .join('');

  const htmlContent = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Proposta Comercial - ${proposalNumber} - ${client.nome || 'Cliente'}</title>
  <style>
    @page { size: A4 portrait; margin: 12mm 10mm; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #0f172a;
      background: #f8fafc;
      margin: 0;
      padding: 20px;
    }
    .container {
      max-width: 800px;
      margin: 0 auto;
      background: #ffffff;
      padding: 36px;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
    }
    .no-print-bar {
      max-width: 800px;
      margin: 0 auto 16px auto;
      background: #0f172a;
      color: #ffffff;
      padding: 12px 18px;
      border-radius: 8px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 13px;
    }
    .btn {
      background: #059669;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 6px;
      font-weight: 700;
      cursor: pointer;
      font-size: 12px;
    }
    .btn:hover { background: #047857; }
    @media print {
      body { background: #ffffff; padding: 0; }
      .container { border: none; padding: 0; max-width: 100%; }
      .no-print-bar { display: none !important; }
    }
  </style>
</head>
<body>
  <div class="no-print-bar">
    <span>Documento Oficial de Proposta Técnica</span>
    <button class="btn" onclick="window.print()">Imprimir / Salvar como PDF</button>
  </div>

  <div class="container">
    <!-- Cabeçalho -->
    <div style="display: flex; justify-content: space-between; align-items: flex-start; padding-bottom: 20px; border-bottom: 2px solid #0f172a; margin-bottom: 20px;">
      <div style="display: flex; align-items: center; gap: 14px;">
        ${
          company.logoUrl
            ? `<img src="${company.logoUrl}" style="height: 60px; max-width: 180px; object-fit: contain;">`
            : `<div style="width: 50px; height: 50px; background: #059669; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 24px;">⚡</div>`
        }
        <div>
          <div style="font-size: 18px; font-weight: 800; color: #0f172a;">${
            company.nomeFantasia || company.razaoSocial
          }</div>
          <div style="font-size: 11px; color: #475569;">${company.razaoSocial}</div>
          <div style="font-size: 10px; color: #64748b; margin-top: 4px;">
            CNPJ: ${company.cnpj} · ${company.cidadeUf}<br>
            Resp. Técnico: ${company.responsavelTecnico} (${company.registroProfissional})<br>
            Contato: ${company.telefone} · ${company.email}
          </div>
        </div>
      </div>
      <div style="text-align: right;">
        <div style="font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase;">Proposta Comercial</div>
        <div style="font-size: 16px; font-weight: 800; font-family: monospace; color: #0f172a;">Nº ${proposalNumber}</div>
        <div style="font-size: 11px; color: #475569; margin-top: 4px; font-family: monospace;">
          Emissão: ${currentDate}<br>
          Validade: ${validUntilDate}
        </div>
      </div>
    </div>

    <!-- Dados do Cliente e Local -->
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 18px; font-size: 12px;">
      <div style="background: #f8fafc; padding: 12px; border-radius: 6px; border: 1px solid #e2e8f0;">
        <div style="font-weight: 700; color: #475569; font-size: 10px; text-transform: uppercase; margin-bottom: 6px;">Dados do Cliente (Contratante)</div>
        <div style="font-weight: 700; font-size: 13px; color: #0f172a;">${client.nome || 'Cliente'}</div>
        ${client.documento ? `<div>CPF/CNPJ: ${client.documento}</div>` : ''}
        ${client.telefone ? `<div>Telefone: ${client.telefone}</div>` : ''}
        ${client.email ? `<div>E-mail: ${client.email}</div>` : ''}
      </div>

      <div style="background: #f8fafc; padding: 12px; border-radius: 6px; border: 1px solid #e2e8f0;">
        <div style="font-weight: 700; color: #475569; font-size: 10px; text-transform: uppercase; margin-bottom: 6px;">Local e Ponto de Recarga</div>
        <div><strong>Endereço:</strong> ${client.endereco || 'Endereço da obra'}, ${client.cidadeUf}</div>
        <div><strong>Tipo de Imóvel:</strong> ${client.tipoImovel}</div>
        <div><strong>Veículo Atendido:</strong> ${client.modeloVeiculo || 'Veículo Elétrico'}</div>
        <div><strong>Equipamento:</strong> ${inputs.chargerModelName} (${inputs.potenciaKw} kW)</div>
      </div>
    </div>

    <!-- Parâmetros Técnicos -->
    <div style="margin-bottom: 18px; padding: 10px 12px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; font-size: 11px;">
      <div style="font-weight: 700; color: #475569; text-transform: uppercase; font-size: 10px; margin-bottom: 6px;">Parâmetros de Engenharia (Normas NBR 5410 & NBR 17019)</div>
      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; font-family: monospace;">
        <div>Potência: <strong>${inputs.potenciaKw} kW (${electricalAnalysis.currentAmps}A)</strong></div>
        <div>Distância: <strong>${inputs.distanciaMetros} metros</strong></div>
        <div>Rede: <strong>${inputs.tipoLigacao} (${electricalAnalysis.nominalVoltage}V)</strong></div>
        <div>Condutor: <strong style="color: #047857;">${inputs.bitolaCabo} (ΔV: ${electricalAnalysis.voltageDropPercentage}%)</strong></div>
      </div>
    </div>

    <!-- Tabela de Materiais -->
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px; border: 1px solid #e2e8f0;">
      <thead>
        <tr style="background: #f1f5f9; text-transform: uppercase; font-size: 10px; color: #475569; border-bottom: 1px solid #e2e8f0;">
          <th style="padding: 8px 12px; text-align: left;">Item / Descrição</th>
          <th style="padding: 8px 6px; text-align: center; width: 50px;">QNT</th>
          <th style="padding: 8px 6px; text-align: center; width: 50px;">UNID.</th>
          <th style="padding: 8px 12px; text-align: right; width: 110px;">VALOR UNIT.</th>
          <th style="padding: 8px 12px; text-align: right; width: 110px;">TOTAL</th>
        </tr>
      </thead>
      <tbody>
        ${rowsHtml}
      </tbody>
    </table>

    <!-- Totais -->
    <div style="background: #f8fafc; padding: 14px; border: 1px solid #e2e8f0; border-radius: 6px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px; font-size: 12px;">
      <div style="color: #475569; line-height: 1.6;">
        <div>Subtotal Materiais e Tubulações: <strong style="color: #0f172a; font-family: monospace;">${formatBRL(subtotalMateriais)}</strong></div>
        <div>Subtotal Instalação, ART e Engenharia: <strong style="color: #0f172a; font-family: monospace;">${formatBRL(subtotalMaoDeObra)}</strong></div>
        ${includeEquipment ? `<div>Fornecimento Carregador: <strong style="color: #0f172a; font-family: monospace;">${formatBRL(equipmentPrice)}</strong></div>` : ''}
      </div>
      <div style="text-align: right;">
        <div style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase;">Valor Total da Proposta</div>
        <div style="font-size: 24px; font-weight: 800; color: #0f172a; font-family: monospace;">${formatBRL(totalGeral)}</div>
      </div>
    </div>

    <!-- Condições Comerciais -->
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 18px; font-size: 11px; color: #334155;">
      <div style="background: #f8fafc; padding: 10px 12px; border: 1px solid #e2e8f0; border-radius: 6px;">
        <strong style="color: #0f172a; display: block; margin-bottom: 4px;">Condições de Pagamento:</strong>
        • À Vista via PIX / TED: <strong>${formatBRL(totalComDesconto)}</strong> (${inputs.discountPercentage}% OFF)<br>
        • Cartão de Crédito: 12x de <strong>${formatBRL(parcelas12)}</strong> sem juros<br>
        ${company.pixKey ? `• Chave PIX: ${company.pixKey}` : ''}
      </div>
      <div style="background: #f8fafc; padding: 10px 12px; border: 1px solid #e2e8f0; border-radius: 6px;">
        <strong style="color: #0f172a; display: block; margin-bottom: 4px;">Prazos & Garantia:</strong>
        • Prazo de Execução: ${company.prazoInstalacaoDias || 5} dias úteis<br>
        • Validade da Proposta: ${company.validadePropostaDias || 15} dias<br>
        • Garantia de 12 meses com emissão de ART inclusa
      </div>
    </div>

    <!-- Assinaturas -->
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-top: 36px; text-align: center; font-size: 11px;">
      <div>
        <div style="border-bottom: 1px solid #94a3b8; width: 80%; margin: 0 auto 6px auto;"></div>
        <div style="font-weight: 700; color: #0f172a;">${client.nome || 'Cliente Contratante'}</div>
        <div style="color: #64748b;">De Acordo e Aprovação</div>
      </div>
      <div>
        <div style="border-bottom: 1px solid #94a3b8; width: 80%; margin: 0 auto 6px auto;"></div>
        <div style="font-weight: 700; color: #0f172a;">${company.responsavelTecnico}</div>
        <div style="color: #64748b;">${company.registroProfissional} · ${company.nomeFantasia}</div>
      </div>
    </div>
  </div>

  <script>
    window.onload = function() {
      setTimeout(function() {
        window.print();
      }, 500);
    };
  </script>
</body>
</html>`;

  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  const safeClient = (client.nome || 'Cliente').replace(/[^a-zA-Z0-9]/g, '_');
  link.setAttribute('download', `Proposta_Carregador_EV_${safeClient}_${proposalNumber}.html`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

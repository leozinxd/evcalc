import {
  BitolaCabo,
  CalculationInputs,
  MaterialItem,
  TipoLigacao,
} from '../types';
import { CABLE_SPECS, DEFAULT_PRICES } from '../constants/presets';

export function getNumCondutores(tipoLigacao: TipoLigacao): number {
  switch (tipoLigacao) {
    case 'MONOFÁSICO':
      return 3; // 1 Fase + 1 Neutro + 1 Terra
    case 'BIFÁSICO':
      return 4; // 2 Fases + 1 Neutro + 1 Terra
    case 'TRIFÁSICO':
      return 5; // 3 Fases + 1 Neutro + 1 Terra
    default:
      return 3;
  }
}

export function formatBitolaLabel(bitola: BitolaCabo): string {
  // Converte "10 mm²" em "10,00 mm" para manter o formato exato da planilha
  const num = bitola.replace(' mm²', '').trim();
  const floatVal = parseFloat(num);
  return `CABO ${floatVal.toFixed(2).replace('.', ',')} mm`;
}

export function calculateLaborCost(
  distancia: number,
  taxaMenor30: number,
  taxaMaior30: number,
  baseArtTax: number = 0
): { cost: number; appliedRate: number; isTieredGreater: boolean } {
  // Na planilha: para 30m o valor foi R$ 1.500,00 (30 * 50)
  // Portanto: distancia < 30 usa taxaMenor30, distancia >= 30 usa taxaMaior30
  const isTieredGreater = distancia >= 30;
  const appliedRate = isTieredGreater ? taxaMaior30 : taxaMenor30;
  const rawCost = distancia * appliedRate + (baseArtTax || 0);
  return {
    cost: Math.round(rawCost * 100) / 100,
    appliedRate,
    isTieredGreater,
  };
}

export function generateDefaultMaterials(
  inputs: CalculationInputs,
  existingItems?: MaterialItem[]
): MaterialItem[] {
  const {
    potenciaKw,
    distanciaMetros,
    tipoLigacao,
    bitolaCabo,
    taxaMenor30,
    taxaMaior30,
    customArtTax,
    includeEquipment,
    equipmentPrice,
    chargerModelName,
  } = inputs;

  const numCondutores = getNumCondutores(tipoLigacao);
  const cableSpec = CABLE_SPECS[bitolaCabo] || CABLE_SPECS['10 mm²'];

  // 1. Cabo CA: distancia * condutores
  const caboQty = Math.max(1, Math.round(distanciaMetros * numCondutores));
  const caboUnit = existingItems?.find((i) => i.id === 'cabo_ca')?.unitPrice ?? cableSpec.defaultUnitPrice;
  const caboItem: MaterialItem = {
    id: 'cabo_ca',
    name: formatBitolaLabel(bitolaCabo),
    category: 'cabo',
    quantity: caboQty,
    unit: 'm',
    unitPrice: caboUnit,
    total: Math.round(caboQty * caboUnit * 100) / 100,
    isAutomatic: true,
    formulaDescription: `${distanciaMetros}m × ${numCondutores} condutores (${tipoLigacao})`,
  };

  // 2. Eletroduto PB 32 (ou correspondente): Math.ceil(distancia / 2) barras de 2m
  const conduitConduitName = `ELETRODUTO ${cableSpec.recommendedConduitSize}`;
  const conduitQty = Math.max(1, Math.ceil(distanciaMetros / 2));
  const conduitUnit = existingItems?.find((i) => i.id === 'eletroduto')?.unitPrice ?? DEFAULT_PRICES.eletrodutoPb32;
  const conduitItem: MaterialItem = {
    id: 'eletroduto',
    name: conduitConduitName,
    category: 'infraestrutura',
    quantity: conduitQty,
    unit: 'barra 2m',
    unitPrice: conduitUnit,
    total: Math.round(conduitQty * conduitUnit * 100) / 100,
    isAutomatic: true,
    formulaDescription: `Arred. p/ cima (${distanciaMetros}m / 2m por barra)`,
  };

  // 3. Abraçadeira Chaveta: distancia * 1 un
  const abracadeiraQty = Math.max(1, Math.round(distanciaMetros));
  const abracadeiraUnit = existingItems?.find((i) => i.id === 'abracadeira')?.unitPrice ?? DEFAULT_PRICES.abracadeiraChaveta;
  const abracadeiraItem: MaterialItem = {
    id: 'abracadeira',
    name: 'ABRAÇADEIRA CHAVETA',
    category: 'infraestrutura',
    quantity: abracadeiraQty,
    unit: 'un',
    unitPrice: abracadeiraUnit,
    total: Math.round(abracadeiraQty * abracadeiraUnit * 100) / 100,
    isAutomatic: true,
    formulaDescription: `1 unidade por metro de tubulação`,
  };

  // 4. Curva PB 32: formula proporcional à distância (no sample: 30m = 12 un)
  const curvaName = `CURVA ${cableSpec.recommendedConduitSize}`;
  const curvaQty = Math.max(2, Math.round(distanciaMetros * 0.4));
  const curvaUnit = existingItems?.find((i) => i.id === 'curva')?.unitPrice ?? DEFAULT_PRICES.curvaPb32;
  const curvaItem: MaterialItem = {
    id: 'curva',
    name: curvaName,
    category: 'infraestrutura',
    quantity: curvaQty,
    unit: 'un',
    unitPrice: curvaUnit,
    total: Math.round(curvaQty * curvaUnit * 100) / 100,
    isAutomatic: true,
    formulaDescription: `Estimativa para desvios e curvas do trajeto`,
  };

  // 5. Terminal Tubular: numCondutores * 4
  const terminalQty = numCondutores * 4;
  const terminalUnit = existingItems?.find((i) => i.id === 'terminal')?.unitPrice ?? DEFAULT_PRICES.terminalTubular;
  const terminalItem: MaterialItem = {
    id: 'terminal',
    name: 'TERMINAL TUBULAR',
    category: 'infraestrutura',
    quantity: terminalQty,
    unit: 'un',
    unitPrice: terminalUnit,
    total: Math.round(terminalQty * terminalUnit * 100) / 100,
    isAutomatic: true,
    formulaDescription: `${numCondutores} condutores × 4 pontos de crimpagem (Quadro, Mobi Box e Carregador)`,
  };

  // 6. Mobi Box (Quadro de proteção EV)
  const mobiBoxName = `MOBI BOX ${tipoLigacao}`;
  const defaultMobiPrice =
    tipoLigacao === 'MONOFÁSICO'
      ? DEFAULT_PRICES.mobiBoxMono
      : tipoLigacao === 'BIFÁSICO'
      ? DEFAULT_PRICES.mobiBoxBifasico
      : DEFAULT_PRICES.mobiBoxTrifasico;
  const mobiUnit = existingItems?.find((i) => i.id === 'mobi_box')?.unitPrice ?? defaultMobiPrice;
  const mobiItem: MaterialItem = {
    id: 'mobi_box',
    name: mobiBoxName,
    category: 'quadro',
    quantity: 1,
    unit: 'cj',
    unitPrice: mobiUnit,
    total: Math.round(mobiUnit * 100) / 100,
    isAutomatic: true,
    formulaDescription: `Quadro dedicado com Disjuntor Curva C + DPS Classe II + DR Tipo A`,
  };

  // 7. Projeto + ART + Instalação (Mão de Obra)
  const laborCalc = calculateLaborCost(distanciaMetros, taxaMenor30, taxaMaior30, customArtTax);
  const laborItem: MaterialItem = {
    id: 'labor',
    name: 'PROJETO + ART + INSTALAÇÃO',
    category: 'mao_de_obra',
    quantity: 1,
    unit: 'sv',
    unitPrice: laborCalc.cost,
    total: laborCalc.cost,
    isAutomatic: true,
    formulaDescription: `${distanciaMetros}m × R$ ${laborCalc.appliedRate.toFixed(2)}/m (${
      laborCalc.isTieredGreater ? 'Faixa ≥ 30m' : 'Faixa < 30m'
    })${customArtTax ? ` + ART R$ ${customArtTax.toFixed(2)}` : ''}`,
  };

  // Coletar itens automáticos
  const items: MaterialItem[] = [
    caboItem,
    conduitItem,
    abracadeiraItem,
    curvaItem,
    terminalItem,
    mobiItem,
    laborItem,
  ];

  // 8. Carregador elétrico opcional (se usuário marcar como incluso no orçamento)
  if (includeEquipment && equipmentPrice > 0) {
    items.push({
      id: 'charger_equipment',
      name: chargerModelName || `CARREGADOR EV ${potenciaKw} kW`,
      category: 'carregador',
      quantity: 1,
      unit: 'un',
      unitPrice: equipmentPrice,
      total: equipmentPrice,
      isAutomatic: true,
      formulaDescription: `Fornecimento do equipamento Wallbox`,
    });
  }

  // Manter itens personalizados adicionados pelo usuário
  if (existingItems) {
    const customExisting = existingItems.filter(
      (item) => !items.some((i) => i.id === item.id)
    );
    items.push(...customExisting);
  }

  return items;
}

export interface ElectricalAnalysis {
  nominalVoltage: number; // Volts
  currentAmps: number; // Amperes
  copperCrossSection: number; // mm²
  cableCapacityAmps: number;
  voltageDropVolts: number;
  voltageDropPercentage: number;
  isVoltageDropOk: boolean;
  isCapacityOk: boolean;
  recommendationMessage: string;
}

export function analyzeElectrical(inputs: CalculationInputs): ElectricalAnalysis {
  const { potenciaKw, distanciaMetros, tipoLigacao, bitolaCabo } = inputs;
  const cableSpec = CABLE_SPECS[bitolaCabo] || CABLE_SPECS['10 mm²'];
  const S = cableSpec.nominalCrossSection;

  let nominalVoltage = 220;
  let currentAmps = 0;
  const powerFactor = 0.95;
  const powerWatts = potenciaKw * 1000;

  if (tipoLigacao === 'MONOFÁSICO' || tipoLigacao === 'BIFÁSICO') {
    nominalVoltage = 220;
    currentAmps = powerWatts / (nominalVoltage * powerFactor);
  } else {
    nominalVoltage = 380;
    currentAmps = powerWatts / (Math.sqrt(3) * nominalVoltage * powerFactor);
  }

  // Resistividade do cobre = 0.0172 ohm.mm²/m
  const rho = 0.0172;
  let voltageDropVolts = 0;

  if (tipoLigacao === 'TRIFÁSICO') {
    voltageDropVolts = (Math.sqrt(3) * rho * distanciaMetros * currentAmps) / S;
  } else {
    voltageDropVolts = (2 * rho * distanciaMetros * currentAmps) / S;
  }

  const voltageDropPercentage = (voltageDropVolts / nominalVoltage) * 100;
  const isVoltageDropOk = voltageDropPercentage <= 4.0;
  const isCapacityOk = currentAmps <= cableSpec.currentCapacityAmps;

  let recommendationMessage = 'Condutores e proteções dentro dos parâmetros da NBR 5410 e NBR 17019.';
  if (!isCapacityOk) {
    recommendationMessage = `Atenção: A corrente nominal (${currentAmps.toFixed(1)} A) supera a capacidade do cabo de ${S} mm² (${cableSpec.currentCapacityAmps} A). Recomenda-se aumentar a bitola.`;
  } else if (!isVoltageDropOk) {
    recommendationMessage = `Atenção: Queda de tensão calculada em ${voltageDropPercentage.toFixed(2)}% (limite máx 4,00%). Para esta distância (${distanciaMetros}m), considere aumentar para a bitola seguinte.`;
  }

  return {
    nominalVoltage,
    currentAmps: Math.round(currentAmps * 10) / 10,
    copperCrossSection: S,
    cableCapacityAmps: cableSpec.currentCapacityAmps,
    voltageDropVolts: Math.round(voltageDropVolts * 100) / 100,
    voltageDropPercentage: Math.round(voltageDropPercentage * 100) / 100,
    isVoltageDropOk,
    isCapacityOk,
    recommendationMessage,
  };
}

export function formatBRL(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

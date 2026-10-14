import { ChargerPreset, BitolaCabo, CompanyData, ClientData } from '../types';

export const CHARGER_PRESETS: ChargerPreset[] = [
  {
    id: 'byd-7kw',
    brand: 'BYD',
    model: 'Wallbox Original BYD 7.0 kW',
    powerKw: 7.0,
    tipoLigacao: 'MONOFÁSICO',
    defaultCabo: '10 mm²',
    equipmentPrice: 4200,
  },
  {
    id: 'weg-wemob-7',
    brand: 'WEG',
    model: 'WEMOB Wall 7.4 kW (Tipo 2)',
    powerKw: 7.4,
    tipoLigacao: 'MONOFÁSICO',
    defaultCabo: '10 mm²',
    equipmentPrice: 4890,
  },
  {
    id: 'gwm-7kw',
    brand: 'GWM',
    model: 'Wallbox GWM Ora / Haval 7.0 kW',
    powerKw: 7.0,
    tipoLigacao: 'MONOFÁSICO',
    defaultCabo: '10 mm²',
    equipmentPrice: 4100,
  },
  {
    id: 'volvo-11kw',
    brand: 'Volvo',
    model: 'Wallbox Volvo Cars 11.0 kW Trifásica',
    powerKw: 11.0,
    tipoLigacao: 'TRIFÁSICO',
    defaultCabo: '10 mm²',
    equipmentPrice: 6500,
  },
  {
    id: 'weg-wemob-22',
    brand: 'WEG',
    model: 'WEMOB Wall 22.0 kW Trifásica',
    powerKw: 22.0,
    tipoLigacao: 'TRIFÁSICO',
    defaultCabo: '16 mm²',
    equipmentPrice: 7200,
  },
  {
    id: 'bmw-i-22',
    brand: 'BMW',
    model: 'BMW i Wallbox Plus 22.0 kW',
    powerKw: 22.0,
    tipoLigacao: 'TRIFÁSICO',
    defaultCabo: '16 mm²',
    equipmentPrice: 8900,
  },
  {
    id: 'custom',
    brand: 'Personalizado',
    model: 'Carregador Personalizado',
    powerKw: 7.0,
    tipoLigacao: 'MONOFÁSICO',
    defaultCabo: '10 mm²',
    equipmentPrice: 0,
  },
];

export const CABLE_SPECS: Record<
  BitolaCabo,
  {
    nominalCrossSection: number; // mm²
    defaultUnitPrice: number; // R$/m
    currentCapacityAmps: number; // A (NBR 5410 B1 método em eletroduto)
    recommendedConduitSize: string; // e.g. "PB 32"
  }
> = {
  '6 mm²': {
    nominalCrossSection: 6,
    defaultUnitPrice: 7.5,
    currentCapacityAmps: 36,
    recommendedConduitSize: 'PB 25',
  },
  '10 mm²': {
    nominalCrossSection: 10,
    defaultUnitPrice: 11.0, // Preço da planilha original!
    currentCapacityAmps: 50,
    recommendedConduitSize: 'PB 32',
  },
  '16 mm²': {
    nominalCrossSection: 16,
    defaultUnitPrice: 17.5,
    currentCapacityAmps: 68,
    recommendedConduitSize: 'PB 32',
  },
  '25 mm²': {
    nominalCrossSection: 25,
    defaultUnitPrice: 26.0,
    currentCapacityAmps: 89,
    recommendedConduitSize: 'PB 40',
  },
  '35 mm²': {
    nominalCrossSection: 35,
    defaultUnitPrice: 36.0,
    currentCapacityAmps: 110,
    recommendedConduitSize: 'PB 50',
  },
  '50 mm²': {
    nominalCrossSection: 50,
    defaultUnitPrice: 52.0,
    currentCapacityAmps: 134,
    recommendedConduitSize: 'PB 50',
  },
};

export const DEFAULT_PRICES = {
  eletrodutoPb32: 24.0, // R$ 24,00 barra da planilha
  abracadeiraChaveta: 5.0, // R$ 5,00 un da planilha
  curvaPb32: 10.0, // R$ 10,00 un da planilha
  terminalTubular: 2.0, // R$ 2,00 un da planilha
  mobiBoxMono: 600.0, // R$ 600,00 da planilha
  mobiBoxBifasico: 750.0,
  mobiBoxTrifasico: 950.0,
  taxaInstalacaoMenor30: 56.0, // R$ 56,00 da planilha
  taxaInstalacaoMaior30: 50.0, // R$ 50,00 da planilha
};

export const DEFAULT_COMPANY: CompanyData = {
  razaoSocial: 'VoltCharge Engenharia & Mobilidade Elétrica Ltda.',
  nomeFantasia: 'VoltCharge Instalações EV',
  cnpj: '38.492.108/0001-45',
  telefone: '(11) 98765-4321',
  email: 'contato@voltcharge.eng.br',
  cidadeUf: 'São Paulo - SP',
  responsavelTecnico: 'Eng. Lucas Miranda Siqueira',
  registroProfissional: 'CREA-SP 5069871234/D',
  logoUrl: null,
  pixKey: '38.492.108/0001-45',
  bancoInfo: 'Banco Santander (033) - Ag: 1234 - C/C: 98765-4',
  condicoesGarantia:
    'Garantia de 12 (doze) meses sobre todos os serviços de instalação e materiais empregados, em estrita conformidade com as normas ABNT NBR 5410 e ABNT NBR 17019 (Instalações Elétricas em Veículos Elétricos). Inclui emissão de ART registrada junto ao CREA e memorial técnico de entrega.',
  prazoInstalacaoDias: 5,
  validadePropostaDias: 15,
};

export const DEFAULT_CLIENT: ClientData = {
  nome: 'Carlos Eduardo Menezes',
  documento: '284.912.834-09',
  telefone: '(11) 99123-8877',
  email: 'carlos.menezes@email.com',
  endereco: 'Rua das Palmeiras, 450 - Apto 112B',
  cidadeUf: 'São Paulo - SP',
  tipoImovel: 'Condomínio (Vaga Própria)',
  modeloVeiculo: 'BYD Dolphin Plus EV',
};

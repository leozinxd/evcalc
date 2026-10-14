export type TipoLigacao = 'MONOFÁSICO' | 'BIFÁSICO' | 'TRIFÁSICO';

export type BitolaCabo = '6 mm²' | '10 mm²' | '16 mm²' | '25 mm²' | '35 mm²' | '50 mm²';

export interface ChargerPreset {
  id: string;
  brand: string;
  model: string;
  powerKw: number;
  tipoLigacao: TipoLigacao;
  defaultCabo: BitolaCabo;
  equipmentPrice?: number;
}

export interface MaterialItem {
  id: string;
  name: string;
  category: 'cabo' | 'infraestrutura' | 'quadro' | 'mao_de_obra' | 'carregador' | 'outros';
  quantity: number;
  unit: string;
  unitPrice: number;
  total: number;
  isAutomatic?: boolean;
  formulaDescription?: string;
}

export interface CalculationInputs {
  potenciaKw: number;
  distanciaMetros: number;
  tipoLigacao: TipoLigacao;
  bitolaCabo: BitolaCabo;
  taxaMenor30: number; // R$/m para <= 30m (padrão R$ 56,00)
  taxaMaior30: number; // R$/m para > 30m (padrão R$ 50,00)
  chargerModelName: string;
  includeEquipment: boolean;
  equipmentPrice: number;
  customArtTax: number; // Opcional taxa fixa de ART/Projeto
  discountPercentage: number;
  bdiMarginPercentage: number;
}

export interface ClientData {
  nome: string;
  documento: string; // CPF ou CNPJ
  telefone: string;
  email: string;
  endereco: string;
  cidadeUf: string;
  tipoImovel: 'Residência' | 'Condomínio (Vaga Própria)' | 'Comercial / Empresa' | 'Estacionamento';
  modeloVeiculo: string;
}

export interface CompanyData {
  razaoSocial: string;
  nomeFantasia: string;
  cnpj: string;
  telefone: string;
  email: string;
  cidadeUf: string;
  responsavelTecnico: string;
  registroProfissional: string; // CREA / CFT
  logoUrl: string | null;
  pixKey?: string;
  bancoInfo?: string;
  condicoesGarantia?: string;
  prazoInstalacaoDias?: number;
  validadePropostaDias?: number;
}

export interface SavedQuote {
  id: string;
  code: string;
  createdAt: string;
  client: ClientData;
  inputs: CalculationInputs;
  materials: MaterialItem[];
  subtotalMateriais: number;
  subtotalMaoDeObra: number;
  valorEquipamento: number;
  totalGeral: number;
}

import React from 'react';
import { ClientData } from '../types';
import { User, Phone, MapPin, Car, Building2, Mail, FileText } from 'lucide-react';

interface ClientFormProps {
  client: ClientData;
  onChange: (updates: Partial<ClientData>) => void;
}

export const ClientForm: React.FC<ClientFormProps> = ({ client, onChange }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
        <div>
          <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
            <User className="w-4 h-4 text-emerald-600" />
            Dados do Cliente Final & Local da Instalação
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Essas informações serão inseridas automaticamente no cabeçalho do relatório e da proposta técnica.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Nome do Cliente */}
        <div>
          <label className="text-xs font-semibold text-slate-700 block mb-1">
            Nome do Cliente / Empresa
          </label>
          <div className="relative">
            <input
              type="text"
              value={client.nome}
              onChange={(e) => onChange({ nome: e.target.value })}
              placeholder="Ex: Carlos Eduardo Menezes"
              className="w-full bg-white border border-slate-300 rounded-md py-1.5 px-3 text-xs font-medium text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>
        </div>

        {/* CPF / CNPJ */}
        <div>
          <label className="text-xs font-semibold text-slate-700 block mb-1">
            CPF / CNPJ
          </label>
          <div className="relative">
            <input
              type="text"
              value={client.documento}
              onChange={(e) => onChange({ documento: e.target.value })}
              placeholder="000.000.000-00"
              className="w-full bg-white border border-slate-300 rounded-md py-1.5 px-3 text-xs font-medium text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Telefone / WhatsApp */}
        <div>
          <label className="text-xs font-semibold text-slate-700 block mb-1">
            Telefone / WhatsApp
          </label>
          <div className="relative">
            <input
              type="text"
              value={client.telefone}
              onChange={(e) => onChange({ telefone: e.target.value })}
              placeholder="(11) 99999-9999"
              className="w-full bg-white border border-slate-300 rounded-md py-1.5 px-3 text-xs font-medium text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>
        </div>

        {/* E-mail */}
        <div>
          <label className="text-xs font-semibold text-slate-700 block mb-1">
            E-mail do Cliente
          </label>
          <div className="relative">
            <input
              type="email"
              value={client.email}
              onChange={(e) => onChange({ email: e.target.value })}
              placeholder="cliente@email.com"
              className="w-full bg-white border border-slate-300 rounded-md py-1.5 px-3 text-xs font-medium text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Endereço */}
        <div className="lg:col-span-2">
          <label className="text-xs font-semibold text-slate-700 block mb-1">
            Endereço Completo do Ponto de Recarga
          </label>
          <div className="relative">
            <input
              type="text"
              value={client.endereco}
              onChange={(e) => onChange({ endereco: e.target.value })}
              placeholder="Rua, número, complemento, vaga de garagem"
              className="w-full bg-white border border-slate-300 rounded-md py-1.5 px-3 text-xs font-medium text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Cidade / UF */}
        <div>
          <label className="text-xs font-semibold text-slate-700 block mb-1">
            Cidade / UF
          </label>
          <div className="relative">
            <input
              type="text"
              value={client.cidadeUf}
              onChange={(e) => onChange({ cidadeUf: e.target.value })}
              placeholder="São Paulo - SP"
              className="w-full bg-white border border-slate-300 rounded-md py-1.5 px-3 text-xs font-medium text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Tipo de Imóvel */}
        <div>
          <label className="text-xs font-semibold text-slate-700 block mb-1">
            Tipo de Imóvel
          </label>
          <select
            value={client.tipoImovel}
            onChange={(e) =>
              onChange({ tipoImovel: e.target.value as ClientData['tipoImovel'] })
            }
            className="w-full bg-white border border-slate-300 rounded-md py-1.5 px-3 text-xs font-medium text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          >
            <option value="Residência">Residência Unifamiliar</option>
            <option value="Condomínio (Vaga Própria)">Condomínio (Vaga de Garagem)</option>
            <option value="Comercial / Empresa">Comercial / Empresa</option>
            <option value="Estacionamento">Estacionamento / Hub de Recarga</option>
          </select>
        </div>

        {/* Modelo do Veículo Elétrico */}
        <div className="lg:col-span-2">
          <label className="text-xs font-semibold text-slate-700 block mb-1">
            Veículo Elétrico / Híbrido Plug-in Atendido
          </label>
          <div className="relative">
            <input
              type="text"
              value={client.modeloVeiculo}
              onChange={(e) => onChange({ modeloVeiculo: e.target.value })}
              placeholder="Ex: BYD Dolphin, Volvo EX30, GWM Haval H6 PHEV, Porsche Taycan"
              className="w-full bg-white border border-slate-300 rounded-md py-1.5 px-3 text-xs font-medium text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

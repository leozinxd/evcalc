import React, { useState } from 'react';
import { MaterialItem } from '../types';
import { formatBRL } from '../utils/calculations';
import {
  Plus,
  Trash2,
  RotateCcw,
  Sparkles,
  Layers,
  Wrench,
  Check,
  Edit2,
} from 'lucide-react';

interface MaterialsTableProps {
  materials: MaterialItem[];
  onUpdateItem: (id: string, updates: Partial<MaterialItem>) => void;
  onDeleteItem: (id: string) => void;
  onAddItem: (item: Omit<MaterialItem, 'id' | 'total'>) => void;
  onResetToDefaults: () => void;
  subtotalMateriais: number;
  subtotalMaoDeObra: number;
  totalGeral: number;
}

export const MaterialsTable: React.FC<MaterialsTableProps> = ({
  materials,
  onUpdateItem,
  onDeleteItem,
  onAddItem,
  onResetToDefaults,
  subtotalMateriais,
  subtotalMaoDeObra,
  totalGeral,
}) => {
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemQty, setNewItemQty] = useState(1);
  const [newItemUnit, setNewItemUnit] = useState('un');
  const [newItemPrice, setNewItemPrice] = useState(0);
  const [newItemCategory, setNewItemCategory] = useState<MaterialItem['category']>('infraestrutura');

  const handleSaveNewItem = () => {
    if (!newItemName.trim() || newItemPrice <= 0) return;
    onAddItem({
      name: newItemName.trim(),
      quantity: newItemQty,
      unit: newItemUnit,
      unitPrice: newItemPrice,
      category: newItemCategory,
      isAutomatic: false,
      formulaDescription: 'Item adicional personalizado',
    });
    setNewItemName('');
    setNewItemQty(1);
    setNewItemPrice(0);
    setIsAddingNew(false);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
      {/* Header bar of table */}
      <div className="p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200">
        <div>
          <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-600" />
            Memorial de Materiais & Mão de Obra
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Planilha de cálculo detalhada. Edite quantidades ou valores unitários diretamente na tabela.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onResetToDefaults}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap"
            title="Recalcular todos os itens com as fórmulas automáticas da planilha"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Restaurar Fórmulas</span>
          </button>
          <button
            type="button"
            onClick={() => setIsAddingNew(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Adicionar Item</span>
          </button>
        </div>
      </div>

      {/* Tabela de Dados */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-[11px] font-bold text-slate-600 uppercase tracking-wider border-b border-slate-200">
              <th className="py-3 px-4 sm:px-6">Item / Descrição</th>
              <th className="py-3 px-3 text-center w-24">QNT</th>
              <th className="py-3 px-3 text-center w-20">UNID.</th>
              <th className="py-3 px-4 text-right w-36">VALOR UNIT.</th>
              <th className="py-3 px-4 sm:px-6 text-right w-36">TOTAL</th>
              <th className="py-3 px-3 text-center w-12 no-print"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {materials.map((item, idx) => {
              const isLabor = item.category === 'mao_de_obra';
              const isEquipment = item.category === 'carregador';

              return (
                <tr
                  key={item.id}
                  className={`hover:bg-slate-50/80 transition-colors ${
                    isLabor
                      ? 'bg-slate-50/50 font-medium'
                      : isEquipment
                      ? 'bg-emerald-50/30'
                      : ''
                  }`}
                >
                  {/* Descrição do Item */}
                  <td className="py-3 px-4 sm:px-6">
                    <div className="flex flex-col">
                      <span className="font-semibold text-slate-900 tracking-tight">
                        {item.name}
                      </span>
                      {item.formulaDescription && (
                        <span className="text-[11px] text-slate-500 mt-0.5 font-normal">
                          {item.formulaDescription}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Quantidade */}
                  <td className="py-2.5 px-3 text-center">
                    {isLabor ? (
                      <span className="font-mono text-slate-700 text-xs">
                        {item.quantity}
                      </span>
                    ) : (
                      <input
                        type="number"
                        min="1"
                        step="1"
                        value={item.quantity}
                        onChange={(e) => {
                          const val = Math.max(0, parseFloat(e.target.value) || 0);
                          onUpdateItem(item.id, {
                            quantity: val,
                            total: Math.round(val * item.unitPrice * 100) / 100,
                          });
                        }}
                        className="w-18 mx-auto text-center font-mono text-xs font-semibold text-slate-900 bg-white border border-slate-200 rounded px-1.5 py-1 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    )}
                  </td>

                  {/* Unidade */}
                  <td className="py-3 px-3 text-center text-xs text-slate-500">
                    {item.unit}
                  </td>

                  {/* Valor Unitário */}
                  <td className="py-2.5 px-4 text-right">
                    <div className="inline-flex items-center justify-end relative">
                      <span className="text-xs text-slate-400 mr-1">R$</span>
                      <input
                        type="number"
                        step="0.5"
                        min="0"
                        value={item.unitPrice}
                        onChange={(e) => {
                          const val = Math.max(0, parseFloat(e.target.value) || 0);
                          onUpdateItem(item.id, {
                            unitPrice: val,
                            total: Math.round(item.quantity * val * 100) / 100,
                          });
                        }}
                        className="w-24 text-right font-mono text-xs font-semibold text-slate-900 bg-white border border-slate-200 rounded px-1.5 py-1 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>
                  </td>

                  {/* Total da Linha */}
                  <td className="py-3 px-4 sm:px-6 text-right font-mono font-bold text-slate-900 tabular-nums">
                    {formatBRL(item.total)}
                  </td>

                  {/* Ação de remover (apenas itens manuais ou extras) */}
                  <td className="py-3 px-3 text-center no-print">
                    {!item.isAutomatic && (
                      <button
                        type="button"
                        onClick={() => onDeleteItem(item.id)}
                        className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                        title="Remover item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}

            {/* Formulário inline para novo item */}
            {isAddingNew && (
              <tr className="bg-emerald-50/40 border-t-2 border-emerald-300">
                <td className="py-2.5 px-4 sm:px-6">
                  <input
                    type="text"
                    placeholder="Nome do item (ex: Haste de Aterramento 5/8x2,40m)"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    className="w-full text-xs font-medium text-slate-900 bg-white border border-emerald-300 rounded px-2.5 py-1.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    autoFocus
                  />
                </td>
                <td className="py-2.5 px-3 text-center">
                  <input
                    type="number"
                    min="1"
                    value={newItemQty}
                    onChange={(e) =>
                      setNewItemQty(Math.max(1, parseFloat(e.target.value) || 1))
                    }
                    className="w-18 mx-auto text-center font-mono text-xs font-semibold text-slate-900 bg-white border border-emerald-300 rounded px-1.5 py-1.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </td>
                <td className="py-2.5 px-3 text-center">
                  <select
                    value={newItemUnit}
                    onChange={(e) => setNewItemUnit(e.target.value)}
                    className="text-xs text-slate-700 bg-white border border-emerald-300 rounded px-1.5 py-1.5"
                  >
                    <option value="un">un</option>
                    <option value="m">m</option>
                    <option value="barra">barra</option>
                    <option value="cj">cj</option>
                    <option value="rolo">rolo</option>
                    <option value="sv">sv</option>
                  </select>
                </td>
                <td className="py-2.5 px-4 text-right">
                  <div className="inline-flex items-center justify-end">
                    <span className="text-xs text-slate-400 mr-1">R$</span>
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      placeholder="0,00"
                      value={newItemPrice || ''}
                      onChange={(e) =>
                        setNewItemPrice(Math.max(0, parseFloat(e.target.value) || 0))
                      }
                      className="w-24 text-right font-mono text-xs font-semibold text-slate-900 bg-white border border-emerald-300 rounded px-1.5 py-1.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                </td>
                <td className="py-2.5 px-4 sm:px-6 text-right font-mono font-bold text-slate-900">
                  {formatBRL(newItemQty * newItemPrice)}
                </td>
                <td className="py-2.5 px-3 text-center no-print">
                  <div className="flex items-center justify-center gap-1">
                    <button
                      type="button"
                      onClick={handleSaveNewItem}
                      className="p-1 rounded bg-emerald-600 text-white hover:bg-emerald-700"
                      title="Salvar item"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsAddingNew(false)}
                      className="p-1 rounded text-slate-500 hover:bg-slate-200"
                      title="Cancelar"
                    >
                      ✕
                    </button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Subtotais e Total Geral */}
      <div className="p-4 sm:px-6 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-6 text-xs text-slate-600">
          <div>
            <span>Subtotal Materiais: </span>
            <strong className="text-slate-900 font-mono">
              {formatBRL(subtotalMateriais)}
            </strong>
          </div>
          <span className="text-slate-300">|</span>
          <div>
            <span>Subtotal Mão de Obra: </span>
            <strong className="text-slate-900 font-mono">
              {formatBRL(subtotalMaoDeObra)}
            </strong>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            TOTAL GERAL:
          </span>
          <span className="text-xl sm:text-2xl font-extrabold text-slate-900 font-mono tabular-nums">
            {formatBRL(totalGeral)}
          </span>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, 
  Settings, 
  Users, 
  DollarSign, 
  Layers, 
  ShoppingBag, 
  Award, 
  Percent, 
  RefreshCw, 
  BarChart2, 
  Sliders, 
  Briefcase, 
  Info, 
  Plus, 
  Trash2, 
  Calendar, 
  Grid,
  AlertTriangle,
  Activity
} from 'lucide-react';

const INITIAL_PRODUCTS = [
  { id: 'SKU-001', name: 'Миниатюры запахов', stage: 'Stage1', msrp: 990, cogsPercent: 20, launchDate: '2027-09-01' },
  { id: 'SKU-002', name: 'Туалетная вода (50 мл)', stage: 'Stage1', msrp: 4990, cogsPercent: 30, launchDate: '2027-09-15' },
  { id: 'SKU-003', name: 'Гель для душа (250 мл)', stage: 'Stage1', msrp: 790, cogsPercent: 25, launchDate: '2027-09-15' },
  { id: 'SKU-004', name: 'Твёрдый дезодорант', stage: 'Stage1', msrp: 790, cogsPercent: 25, launchDate: '2027-09-15' },
  { id: 'SKU-005', name: 'Лосьон после бритья', stage: 'Stage1', msrp: 1990, cogsPercent: 24, launchDate: '2027-09-15' },
  { id: 'SKU-006', name: 'Крем после бритья', stage: 'Stage1', msrp: 1290, cogsPercent: 22, launchDate: '2027-09-15' },
  { id: 'SKU-007', name: 'Крем для бритья', stage: 'Stage1', msrp: 1290, cogsPercent: 22, launchDate: '2027-09-15' },
  { id: 'SKU-008', name: 'Крем для рук', stage: 'Stage1', msrp: 990, cogsPercent: 20, launchDate: '2027-09-15' },
  { id: 'SKU-009', name: 'Подарочные наборы', stage: 'Stage2', msrp: 5490, cogsPercent: 28, launchDate: '2029-11-01' },
  { id: 'SKU-010', name: 'Дорожные форматы', stage: 'Stage2', msrp: 1890, cogsPercent: 22, launchDate: '2029-05-15' },
  { id: 'SKU-011', name: 'Сезонные комплекты', stage: 'Stage2', msrp: 3990, cogsPercent: 25, launchDate: '2029-11-15' },
  { id: 'SKU-012', name: 'Professional Line', stage: 'Stage3', msrp: 2490, cogsPercent: 18, launchDate: '2031-03-01' },
  { id: 'SKU-013', name: 'Средства интенсивного ухода', stage: 'Stage3', msrp: 1790, cogsPercent: 20, launchDate: '2031-03-01' },
];

const SCENARIOS = {
  BASE: {
    label: 'BASE (Реалистичный)',
    growthModifier: 1.0,
    cac: 1000,
    purchaseFrequency: 3.5,
    description: 'Реалистичная траектория роста, плановый рост SKU, плановая структура каналов дистрибуции.',
    multiplierRevenue: 5.0, 
    multiplierEbitda: 8.0   
  },
  UPSIDE: {
    label: 'UPSIDE (Оптимистичный)',
    growthModifier: 1.35, 
    cac: 800,
    purchaseFrequency: 4.8, 
    description: 'Ускоренное масштабирование маркетплейсов и DTC, снижение CAC после 2029 г., мощный органический бренд-эффект.',
    multiplierRevenue: 7.5,
    multiplierEbitda: 11.0
  },
  DOWNSIDE: {
    label: 'DOWNSIDE (Консервативный)',
    growthModifier: 0.75, 
    cac: 1300,
    purchaseFrequency: 2.5, 
    description: 'Более медленное масштабирование каналов, высокий уровень CAC, ограниченное удержание аудитории.',
    multiplierRevenue: 3.5,
    multiplierEbitda: 5.5
  }
};

const DEFAULT_CHANNEL_MIX = {
  2027: { marketplace: 100, dtc: 0, barbershops: 0, retail: 0 },
  2028: { marketplace: 85, dtc: 15, barbershops: 0, retail: 0 },
  2029: { marketplace: 70, dtc: 15, barbershops: 15, retail: 0 },
  2030: { marketplace: 55, dtc: 20, barbershops: 15, retail: 10 },
  2031: { marketplace: 50, dtc: 20, barbershops: 10, retail: 20 },
  2032: { marketplace: 45, dtc: 20, barbershops: 10, retail: 25 },
};

const DEFAULT_HR_STAFF = {
  2027: 2, 2028: 8, 2029: 20, 2030: 40, 2031: 75, 2032: 120, 
};

const DEFAULT_CAPEX = {
  2027: 3500, 2028: 1000, 2029: 10000, 2030: 2000, 2031: 2000, 2032: 2000, 
};

const DEFAULT_TARGET_REVENUE = {
  2027: 15000,
  2028: 58000,
  2029: 200000,
  2030: 600000,
  2031: 1200000,
  2032: 2000000
};

export default function App() {
  const [activeScenarioKey, setActiveScenarioKey] = useState('BASE');
  const [customCac, setCustomCac] = useState(null);
  const [customFrequency, setCustomFrequency] = useState(null);
  const [customGrowthRate, setCustomGrowthRate] = useState(100); 
  const [customCogsMarkup, setCustomCogsMarkup] = useState(0); 
  const [targetRevenue, setTargetRevenue] = useState(DEFAULT_TARGET_REVENUE);
  const [activeTab, setActiveTab] = useState('dashboard');
  
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [editingProductId, setEditingProductId] = useState(null);
  const [editPrice, setEditPrice] = useState('');
  const [editCogs, setEditCogs] = useState('');
  const [editLaunchDate, setEditLaunchDate] = useState('');
  
  const [newSkuName, setNewSkuName] = useState('');
  const [newSkuStage, setNewSkuStage] = useState('Stage1');
  const [newSkuMsrp, setNewSkuMsrp] = useState('');
  const [newSkuCogs, setNewSkuCogs] = useState('');
  const [newSkuLaunchDate, setNewSkuLaunchDate] = useState('2027-09-15');
  const [showAddForm, setShowShowAddForm] = useState(false);

  const [hrStaff, setHrStaff] = useState(DEFAULT_HR_STAFF);
  const [capexPlan, setCapexPlan] = useState(DEFAULT_CAPEX);
  const [channelMix, setChannelMix] = useState(DEFAULT_CHANNEL_MIX);

  const STARTING_EQUITY = 20000;

  const handleReset = () => {
    setCustomCac(null);
    setCustomFrequency(null);
    setCustomGrowthRate(100);
    setCustomCogsMarkup(0);
    setTargetRevenue(DEFAULT_TARGET_REVENUE);
    setProducts(INITIAL_PRODUCTS);
    setHrStaff(DEFAULT_HR_STAFF);
    setCapexPlan(DEFAULT_CAPEX);
    setChannelMix(DEFAULT_CHANNEL_MIX);
    setShowShowAddForm(false);
  };

  const activeScenario = SCENARIOS[activeScenarioKey];
  const currentCac = customCac !== null ? customCac : activeScenario.cac;
  const currentFrequency = customFrequency !== null ? customFrequency : activeScenario.purchaseFrequency;

  const handleTargetRevenueChange = (year, value) => {
    setTargetRevenue({
      ...targetRevenue,
      [year]: Math.max(0, parseInt(value) || 0)
    });
  };

  const financialData = useMemo(() => {
    const years = [2027, 2028, 2029, 2030, 2031, 2032];
    let accumulatedNetIncome = 0;
    let accumulatedCapex = STARTING_EQUITY;

    return years.map((year, idx) => {
      const baseRev = targetRevenue[year] || 0;
      const scenarioModifier = activeScenario.growthModifier;
      const userGrowthMod = customGrowthRate / 100;
      const calculatedRevenue = Math.round(baseRev * scenarioModifier * userGrowthMod);

      const channels = channelMix[year] || DEFAULT_CHANNEL_MIX[year];
      const revMarketplace = Math.round(calculatedRevenue * (channels.marketplace / 100));
      const revDtc = Math.round(calculatedRevenue * (channels.dtc / 100));
      const revBarbershops = Math.round(calculatedRevenue * (channels.barbershops / 100));
      const revRetail = Math.round(calculatedRevenue * (channels.retail / 100));

      const averageCogsPercent = products.length > 0 
        ? products.reduce((sum, p) => sum + p.cogsPercent, 0) / products.length 
        : 25;
      
      const finalCogsPercent = Math.max(5, Math.min(95, averageCogsPercent + customCogsMarkup));
      const calculatedCogs = Math.round(calculatedRevenue * (finalCogsPercent / 100));
      const grossProfit = calculatedRevenue - calculatedCogs;
      const grossMarginPercent = calculatedRevenue > 0 ? (grossProfit / calculatedRevenue) * 100 : 0;

      const staffCount = hrStaff[year] || 0;
      const hrCostAnnual = Math.round(staffCount * 223.5 * 12);

      const aov = 2850; 
      const activeCustomers = aov * currentFrequency > 0 ? Math.round((calculatedRevenue * 1000) / (aov * currentFrequency)) : 0;
      const retentionRate = 0.45; 
      const newCustomersNeeded = Math.round(activeCustomers * (1 - retentionRate));
      
      const performanceMarketingBudget = Math.round((newCustomersNeeded * currentCac) / 1000);
      const brandMarketingBudget = Math.round(calculatedRevenue * 0.10); 
      const marketingCost = performanceMarketingBudget + brandMarketingBudget;

      const commissionCost = Math.round(
        (revMarketplace * 0.22) + 
        (revDtc * 0.03) + 
        (revBarbershops * 0.05) + 
        (revRetail * 0.15)
      );

      const logisticsCost = Math.round(calculatedRevenue * (year < 2030 ? 0.09 : 0.06));
      const adminCost = Math.round(1500 + (calculatedRevenue * 0.02));

      const totalOpex = hrCostAnnual + marketingCost + commissionCost + logisticsCost + adminCost;

      const ebitda = grossProfit - totalOpex;
      const ebitdaMarginPercent = calculatedRevenue > 0 ? (ebitda / calculatedRevenue) * 100 : 0;

      const currentCapex = capexPlan[year] || 0;
      const depreciation = Math.round(currentCapex * 0.20);
      const ebit = ebitda - depreciation;

      const isUsn = calculatedRevenue < 490000;
      const taxRate = isUsn ? 0.15 : 0.25;
      const ebt = Math.max(0, ebit);
      const incomeTax = Math.round(ebt * taxRate);
      const netIncome = ebit - incomeTax;

      accumulatedNetIncome += netIncome;
      accumulatedCapex += currentCapex;

      const prevRevenue = year === 2027 ? 0 : Math.round((targetRevenue[year - 1] || 0) * scenarioModifier * userGrowthMod);
      const deltaRevenue = Math.max(0, calculatedRevenue - prevRevenue);
      const deltaNwc = Math.round(deltaRevenue * 0.08); 
      const fcf = ebitda - deltaNwc - currentCapex - incomeTax;

      const ltv = Math.round(aov * currentFrequency * (grossMarginPercent / 100));
      const ltvToCacRatio = currentCac > 0 ? (ltv / currentCac).toFixed(1) : '0.0';

      const romi = marketingCost > 0 ? Math.round(((grossProfit - marketingCost) / marketingCost) * 100) : 0;
      const roi = accumulatedCapex > 0 ? Math.round((accumulatedNetIncome / accumulatedCapex) * 100) : 0;

      const evByRevenue = Math.round(calculatedRevenue * activeScenario.multiplierRevenue);
      const evByEbitda = ebitda > 0 ? Math.round(ebitda * activeScenario.multiplierEbitda) : 0;
      const averageEv = evByEbitda > 0 ? Math.round((evByRevenue + evByEbitda) / 2) : evByRevenue;

      return {
        year, revenue: calculatedRevenue, revMarketplace, revDtc, revBarbershops, revRetail,
        cogs: calculatedCogs, grossProfit, grossMarginPercent: Math.round(grossMarginPercent),
        hrCost: hrCostAnnual, marketingCost, commissionCost, logisticsCost, adminCost, totalOpex,
        ebitda, ebitdaMarginPercent: Math.round(ebitdaMarginPercent), depreciation, ebit, tax: incomeTax,
        netIncome, fcf, capex: currentCapex, ltv, cac: currentCac, ltvToCac: ltvToCacRatio,
        romi, roi, evByRevenue, evByEbitda, valuation: averageEv, staffCount, isUsn
      };
    });
  }, [activeScenarioKey, customCac, customFrequency, customGrowthRate, customCogsMarkup, products, hrStaff, capexPlan, channelMix, targetRevenue]);

  const year2032 = financialData[5];
  const year2027 = financialData[0];

  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!newSkuName || !newSkuMsrp || !newSkuCogs) return;

    const newProduct = {
      id: `SKU-${Date.now().toString().slice(-3)}`,
      name: newSkuName,
      stage: newSkuStage,
      msrp: parseInt(newSkuMsrp) || 1000,
      cogsPercent: Math.min(95, Math.max(5, parseInt(newSkuCogs) || 25)),
      launchDate: newSkuLaunchDate
    };

    setProducts([...products, newProduct]);
    setNewSkuName('');
    setNewSkuMsrp('');
    setNewSkuCogs('');
    setNewSkuLaunchDate('2027-09-15');
    setShowShowAddForm(false);
  };

  const handleDeleteProduct = (id) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const startEditProduct = (p) => {
    setEditingProductId(p.id);
    setEditPrice(p.msrp.toString());
    setEditCogs(p.cogsPercent.toString());
    setEditLaunchDate(p.launchDate || '2027-09-15');
  };

  const saveProductEdit = (id) => {
    setProducts(products.map(p => {
      if (p.id === id) {
        return {
          ...p,
          msrp: parseInt(editPrice) || p.msrp,
          cogsPercent: Math.min(95, Math.max(5, parseInt(editCogs) || p.cogsPercent)),
          launchDate: editLaunchDate
        };
      }
      return p;
    }));
    setEditingProductId(null);
  };

  const updateStaffCount = (year, value) => {
    setHrStaff({ ...hrStaff, [year]: Math.max(0, parseInt(value) || 0) });
  };

  const updateCapexValue = (year, value) => {
    setCapexPlan({ ...capexPlan, [year]: Math.max(0, parseInt(value) || 0) });
  };

  const updateChannelShare = (year, channelKey, value) => {
    const val = Math.max(0, Math.min(100, parseInt(value) || 0));
    const currentMixYear = { ...channelMix[year] };
    currentMixYear[channelKey] = val;
    
    const keys = Object.keys(currentMixYear).filter(k => k !== channelKey);
    const sumOthers = keys.reduce((sum, k) => sum + currentMixYear[k], 0);
    const targetSumOthers = 100 - val;
    
    if (sumOthers > 0) {
      keys.forEach(k => {
        currentMixYear[k] = Math.round((currentMixYear[k] / sumOthers) * targetSumOthers);
      });
    } else {
      currentMixYear[keys[0]] = targetSumOthers;
    }
    
    const finalSum = Object.values(currentMixYear).reduce((a, b) => a + b, 0);
    if (finalSum !== 100) {
      currentMixYear[keys[0]] += (100 - finalSum);
    }

    setChannelMix({ ...channelMix, [year]: currentMixYear });
  };

  const formatCurrency = (value, showFull = false) => {
    if (showFull) {
      return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(value * 1000);
    }
    if (Math.abs(value) >= 1000) {
      return `${(value / 1000).toFixed(1)} млн ₽`;
    }
    return `${new Intl.NumberFormat('ru-RU').format(Math.round(value))} тыс. ₽`;
  };

  const groupedProducts = useMemo(() => {
    return {
      Stage1: products.filter(p => p.stage === 'Stage1'),
      Stage2: products.filter(p => p.stage === 'Stage2'),
      Stage3: products.filter(p => p.stage === 'Stage3'),
    };
  }, [products]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur sticky top-0 z-50 px-4 py-3 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-r from-amber-600 to-amber-400 text-slate-950 px-3 py-1.5 rounded-lg font-black tracking-wider text-sm shadow-md">
            HOT DADDY
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight flex items-center gap-2">
              Financial Simulator <span className="text-xs bg-slate-800 text-amber-400 px-2 py-0.5 rounded border border-slate-700">Canvas Premium 3.0</span>
            </h1>
            <p className="text-xs text-slate-400">Интерактивный инвестиционный симулятор бренда (2027–2032 гг.)</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs text-slate-400 hidden sm:inline">Сценарий:</span>
          <div className="bg-slate-950 p-0.5 rounded-lg border border-slate-800 flex">
            {Object.keys(SCENARIOS).map((key) => (
              <button
                key={key}
                onClick={() => setActiveScenarioKey(key)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  activeScenarioKey === key 
                    ? 'bg-amber-500 text-slate-950 shadow-md' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                {key}
              </button>
            ))}
          </div>
          
          <button 
            onClick={handleReset}
            title="Сбросить все корректировки"
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors border border-slate-700"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row">
        <aside className="w-full lg:w-80 bg-slate-900 border-b lg:border-b-0 lg:border-r border-slate-800 p-4 space-y-6 shrink-0">
          <div className="space-y-1">
            <h2 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
              <Sliders className="h-4 w-4 text-amber-500" />
              Глобальные Драйверы
            </h2>
            <p className="text-xs text-slate-500">Изменение параметров динамически пересчитывает OPEX, EBITDA и EV</p>
          </div>

          <div className="space-y-5">
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300 font-medium">Темп роста выручки:</span>
                <span className="font-bold text-amber-400">{customGrowthRate}%</span>
              </div>
              <input 
                type="range" min="50" max="200" value={customGrowthRate}
                onChange={(e) => setCustomGrowthRate(parseInt(e.target.value))}
                className="w-full accent-amber-500 bg-slate-950 h-2 rounded-lg cursor-pointer"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300 font-medium flex items-center gap-1">
                  CAC (стоимость клиента):
                  {currentCac > 1200 && <AlertTriangle className="h-3.5 w-3.5 text-rose-500" title="Высокий CAC снижает маржинальность и оценку!" />}
                </span>
                <span className="font-bold text-amber-400">
                  {new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(currentCac)}
                </span>
              </div>
              <input 
                type="range" min="500" max="2000" step="50" value={currentCac}
                onChange={(e) => setCustomCac(parseInt(e.target.value))}
                className="w-full accent-amber-500 bg-slate-950 h-2 rounded-lg cursor-pointer"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300 font-medium">Частота покупок в год:</span>
                <span className="font-bold text-amber-400">{currentFrequency} раз(а)</span>
              </div>
              <input 
                type="range" min="1.5" max="6" step="0.1" value={currentFrequency}
                onChange={(e) => setCustomFrequency(parseFloat(e.target.value))}
                className="w-full accent-amber-500 bg-slate-950 h-2 rounded-lg cursor-pointer"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300 font-medium">Сдвиг COGS (себестоимости):</span>
                <span className={`font-bold ${customCogsMarkup >= 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {customCogsMarkup > 0 ? `+${customCogsMarkup}` : customCogsMarkup}%
                </span>
              </div>
              <input 
                type="range" min="-15" max="15" value={customCogsMarkup}
                onChange={(e) => setCustomCogsMarkup(parseInt(e.target.value))}
                className="w-full accent-amber-500 bg-slate-950 h-2 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          <hr className="border-slate-800" />

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-3">
            <h3 className="text-xs font-semibold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp className="h-3.5 w-3.5" />
              Целевая выручка (база), тыс.₽
            </h3>
            <div className="space-y-2 text-xs">
              {Object.keys(targetRevenue).map((year) => (
                <div key={year} className="flex items-center justify-between gap-2">
                  <span className="text-slate-400 font-mono">{year} г:</span>
                  <input
                    type="number"
                    value={targetRevenue[year]}
                    onChange={(e) => handleTargetRevenueChange(year, e.target.value)}
                    className="w-32 bg-slate-900 border border-slate-800 rounded px-2 py-0.5 text-right font-semibold text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
              ))}
            </div>
          </div>

          <hr className="border-slate-800" />

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <h4 className="text-xs font-semibold text-slate-400 mb-2">Целевая юнит-экономика (2032):</h4>
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="bg-slate-900 p-2 rounded border border-slate-800">
                <span className="block text-[10px] text-slate-500 uppercase">LTV</span>
                <span className="text-xs font-bold text-slate-200">{new Intl.NumberFormat('ru-RU').format(year2032.ltv)} ₽</span>
              </div>
              <div className="bg-slate-900 p-2 rounded border border-slate-800">
                <span className="block text-[10px] text-slate-500 uppercase">LTV / CAC</span>
                <span className={`text-xs font-bold ${parseFloat(year2032.ltvToCac) >= 3.0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {year2032.ltvToCac}x
                </span>
              </div>
            </div>
          </div>
        </aside>

        <main className="flex-1 p-4 lg:p-6 overflow-y-auto space-y-6">
          <div className="flex flex-wrap border-b border-slate-800 gap-1">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-4 py-2 text-xs font-semibold rounded-t-lg transition-all flex items-center gap-2 ${
                activeTab === 'dashboard' ? 'bg-slate-900 border-t-2 border-amber-500 text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <BarChart2 className="h-3.5 w-3.5" /> Дашборд и Аналитика
            </button>
            <button
              onClick={() => setActiveTab('pl')}
              className={`px-4 py-2 text-xs font-semibold rounded-t-lg transition-all flex items-center gap-2 ${
                activeTab === 'pl' ? 'bg-slate-900 border-t-2 border-amber-500 text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <DollarSign className="h-3.5 w-3.5" /> Отчет P&L и Cash Flow
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`px-4 py-2 text-xs font-semibold rounded-t-lg transition-all flex items-center gap-2 ${
                activeTab === 'products' ? 'bg-slate-900 border-t-2 border-amber-500 text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ShoppingBag className="h-3.5 w-3.5" /> Реестр SKU & Pricing Engine
            </button>
            <button
              onClick={() => setActiveTab('channels')}
              className={`px-4 py-2 text-xs font-semibold rounded-t-lg transition-all flex items-center gap-2 ${
                activeTab === 'channels' ? 'bg-slate-900 border-t-2 border-amber-500 text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="h-3.5 w-3.5" /> Каналы Продаж
            </button>
            <button
              onClick={() => setActiveTab('hr')}
              className={`px-4 py-2 text-xs font-semibold rounded-t-lg transition-all flex items-center gap-2 ${
                activeTab === 'hr' ? 'bg-slate-900 border-t-2 border-amber-500 text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Users className="h-3.5 w-3.5" /> Штат и Кадровый План
            </button>
            <button
              onClick={() => setActiveTab('capex')}
              className={`px-4 py-2 text-xs font-semibold rounded-t-lg transition-all flex items-center gap-2 ${
                activeTab === 'capex' ? 'bg-slate-900 border-t-2 border-amber-500 text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Briefcase className="h-3.5 w-3.5" /> Инвестиции (CAPEX)
            </button>
          </div>

          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2 relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-amber-500/10 text-amber-400 text-[10px] px-2 py-0.5 rounded-bl">
                    Target Revenue
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-400 font-medium">Выручка (2032)</span>
                    <span className="p-1.5 bg-amber-500/10 text-amber-400 rounded-lg">
                      <TrendingUp className="h-4 w-4" />
                    </span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-2xl font-bold tracking-tight text-white">
                      {formatCurrency(year2032.revenue)}
                    </span>
                    <div className="text-xs text-slate-400 flex items-center gap-1">
                      Старт 2027: <span className="text-slate-200 font-semibold">{formatCurrency(year2027.revenue)}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-400 font-medium">EBITDA (2032)</span>
                    <span className="p-1.5 bg-emerald-500/10 text-emerald-400 rounded-lg">
                      <Percent className="h-4 w-4" />
                    </span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-2xl font-bold tracking-tight text-white">
                      {formatCurrency(year2032.ebitda)}
                    </span>
                    <div className="text-xs text-slate-400 flex items-center gap-1">
                      Рентабельность: <span className="text-emerald-400 font-semibold">{year2032.ebitdaMarginPercent}%</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-400 font-medium">ROMI (2032)</span>
                    <span className="p-1.5 bg-purple-500/10 text-purple-400 rounded-lg">
                      <Activity className="h-4 w-4" />
                    </span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-2xl font-bold tracking-tight text-purple-400">
                      {year2032.romi}%
                    </span>
                    <div className="text-xs text-slate-400">
                      Эффективность маркетинга
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-400 font-medium">Накопленный ROI (2032)</span>
                    <span className="p-1.5 bg-blue-500/10 text-blue-400 rounded-lg">
                      <Award className="h-4 w-4" />
                    </span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-2xl font-bold tracking-tight text-white">
                      {year2032.roi}%
                    </span>
                    <div className="text-xs text-slate-400">
                      Рентабельность капитала
                    </div>
                  </div>
                </div>

              </div>

              <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
                <div className="p-4 bg-slate-900/50 border-b border-slate-800 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-white text-sm">Прогнозная траектория HOT DADDY (2027–2032 гг.)</h3>
                    <p className="text-xs text-slate-400">Сценарий: <span className="text-amber-400 font-medium">{activeScenario.label}</span></p>
                  </div>
                  <div className="text-xs text-slate-400">Все суммы в тыс. рублей</div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-950 text-slate-400 text-xs border-b border-slate-800">
                        <th className="p-3 font-semibold">Год</th>
                        <th className="p-3 font-semibold text-right">Выручка (Revenue)</th>
                        <th className="p-3 font-semibold text-right">Валовая прибыль</th>
                        <th className="p-3 font-semibold text-right">Маркетинг</th>
                        <th className="p-3 font-semibold text-right">EBITDA</th>
                        <th className="p-3 font-semibold text-right text-purple-400">ROMI %</th>
                        <th className="p-3 font-semibold text-right text-blue-400">Накоп. ROI %</th>
                        <th className="p-3 font-semibold text-right">FCF (Ден. поток)</th>
                        <th className="p-3 font-semibold text-right">Оценка EV</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-xs text-slate-300">
                      {financialData.map((row) => (
                        <tr key={row.year} className="hover:bg-slate-800/30 transition-colors">
                          <td className="p-3 font-bold text-white">{row.year}</td>
                          <td className="p-3 text-right font-semibold text-amber-400">{row.revenue.toLocaleString()}</td>
                          <td className="p-3 text-right text-slate-200">{row.grossProfit.toLocaleString()}</td>
                          <td className="p-3 text-right text-rose-300">({row.marketingCost.toLocaleString()})</td>
                          <td className={`p-3 text-right font-bold ${row.ebitda >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {row.ebitda.toLocaleString()}
                          </td>
                          <td className="p-3 text-right text-purple-400 font-bold">{row.romi}%</td>
                          <td className="p-3 text-right text-blue-400 font-bold">{row.roi}%</td>
                          <td className={`p-3 text-right ${row.fcf >= 0 ? 'text-blue-400' : 'text-rose-300'}`}>
                            {row.fcf.toLocaleString()}
                          </td>
                          <td className="p-3 text-right font-bold text-amber-500">{row.valuation.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 space-y-4">
                  <div>
                    <h4 className="font-bold text-sm text-white flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-amber-400" />
                      Динамика Оценки Стоимости (EV)
                    </h4>
                    <p className="text-xs text-slate-400">Рост капитализации с учетом маржи и CAC</p>
                  </div>
                  <div className="space-y-3">
                    {financialData.map((row) => {
                      const maxVal = financialData[financialData.length - 1].valuation;
                      const percentWidth = Math.max(5, (row.valuation / maxVal) * 100);
                      
                      return (
                        <div key={row.year} className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="font-semibold text-slate-300">{row.year} г.</span>
                            <span className="font-bold text-amber-400">{formatCurrency(row.valuation)}</span>
                          </div>
                          <div className="w-full bg-slate-950 h-3.5 rounded-md overflow-hidden border border-slate-800">
                            <div 
                              className="bg-gradient-to-r from-amber-600 to-amber-400 h-full rounded-md transition-all duration-500"
                              style={{ width: `${percentWidth}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 space-y-4">
                  <div>
                    <h4 className="font-bold text-sm text-white flex items-center gap-2">
                      <Layers className="h-4 w-4 text-blue-400" />
                      Структура продаж по каналам (2032 г.)
                    </h4>
                    <p className="text-xs text-slate-400">Мультиканальная дистрибуция</p>
                  </div>
                  
                  <div className="space-y-4 pt-2">
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-300">Маркетплейсы (WB/Ozon)</span>
                        <span className="font-bold text-white">{formatCurrency(year2032.revMarketplace)} ({channelMix[2032]?.marketplace || DEFAULT_CHANNEL_MIX[2032].marketplace}%)</span>
                      </div>
                      <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden">
                        <div className="bg-amber-500 h-full" style={{ width: `${channelMix[2032]?.marketplace || DEFAULT_CHANNEL_MIX[2032].marketplace}%` }} />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-300">DTC (Собственный E-commerce)</span>
                        <span className="font-bold text-white">{formatCurrency(year2032.revDtc)} ({channelMix[2032]?.dtc || DEFAULT_CHANNEL_MIX[2032].dtc}%)</span>
                      </div>
                      <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-full" style={{ width: `${channelMix[2032]?.dtc || DEFAULT_CHANNEL_MIX[2032].dtc}%` }} />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-300">Барбершопы (B2B Professional)</span>
                        <span className="font-bold text-white">{formatCurrency(year2032.revBarbershops)} ({channelMix[2032]?.barbershops || DEFAULT_CHANNEL_MIX[2032].barbershops}%)</span>
                      </div>
                      <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden">
                        <div className="bg-blue-500 h-full" style={{ width: `${channelMix[2032]?.barbershops || DEFAULT_CHANNEL_MIX[2032].barbershops}%` }} />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-300">Сети и Ритейл (Retail)</span>
                        <span className="font-bold text-white">{formatCurrency(year2032.revRetail)} ({channelMix[2032]?.retail || DEFAULT_CHANNEL_MIX[2032].retail}%)</span>
                      </div>
                      <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden">
                        <div className="bg-purple-500 h-full" style={{ width: `${channelMix[2032]?.retail || DEFAULT_CHANNEL_MIX[2032].retail}%` }} />
                      </div>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* --- ВКЛАДКА 2: P&L --- */}
          {activeTab === 'pl' && (
            <div className="space-y-6">
              <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
                <div className="p-4 bg-slate-900/50 border-b border-slate-800 flex justify-between items-center flex-wrap gap-2">
                  <div>
                    <h3 className="font-bold text-white text-sm">Отчет о прибылях и убытках (P&L, 2027–2032 гг.)</h3>
                    <p className="text-xs text-slate-400">Интегрировано с планом OPEX, HR, акцизами и налогами</p>
                  </div>
                  <span className="text-xs text-amber-400 font-semibold bg-amber-500/10 px-3 py-1 rounded border border-amber-500/20">
                    Налоги: Динамические (УСН/ОСНО)
                  </span>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-950 text-slate-400 border-b border-slate-800">
                        <th className="p-3 font-semibold">Статья (в тыс. рублей)</th>
                        {financialData.map(row => <th key={row.year} className="p-3 font-semibold text-right">{row.year}</th>)}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      <tr className="bg-slate-900/40 text-slate-100 font-bold">
                        <td className="p-3">Выручка (Gross Revenue)</td>
                        {financialData.map(row => <td key={row.year} className="p-3 text-right text-amber-400">{row.revenue.toLocaleString()}</td>)}
                      </tr>
                      
                      <tr className="text-slate-300">
                        <td className="p-3 pl-6">Себестоимость продукции (COGS)</td>
                        {financialData.map(row => <td key={row.year} className="p-3 text-right text-slate-400">({row.cogs.toLocaleString()})</td>)}
                      </tr>

                      <tr className="bg-slate-950/20 font-semibold text-slate-200">
                        <td className="p-3 pl-4">Валовая прибыль (Gross Profit)</td>
                        {financialData.map(row => (
                          <td key={row.year} className="p-3 text-right text-emerald-400">
                            {row.grossProfit.toLocaleString()} <span className="text-[10px] text-slate-500">({row.grossMarginPercent}%)</span>
                          </td>
                        ))}
                      </tr>

                      <tr className="text-slate-400 font-medium">
                        <td className="p-3">Операционные расходы (OPEX)</td>
                        {financialData.map(row => <td key={row.year} className="p-3 text-right text-slate-400">({row.totalOpex.toLocaleString()})</td>)}
                      </tr>
                      
                      <tr className="text-slate-400">
                        <td className="p-3 pl-8">ФОТ команды (+49% налоги/ЕСН)</td>
                        {financialData.map(row => <td key={row.year} className="p-3 text-right">({row.hrCost.toLocaleString()})</td>)}
                      </tr>
                      
                      <tr className="text-slate-400 border-l-2 border-rose-500/30">
                        <td className="p-3 pl-8">Маркетинг (Performance + Brand)</td>
                        {financialData.map(row => <td key={row.year} className="p-3 text-right">({row.marketingCost.toLocaleString()})</td>)}
                      </tr>

                      <tr className="text-slate-400">
                        <td className="p-3 pl-8">Комиссии каналов дистрибуции</td>
                        {financialData.map(row => <td key={row.year} className="p-3 text-right">({row.commissionCost.toLocaleString()})</td>)}
                      </tr>

                      <tr className="text-slate-400">
                        <td className="p-3 pl-8">Логистика, Склад и 3PL</td>
                        {financialData.map(row => <td key={row.year} className="p-3 text-right">({row.logisticsCost.toLocaleString()})</td>)}
                      </tr>

                      <tr className="text-slate-400 text-[11px] italic">
                        <td className="p-3 pl-8">Административные расходы и IT</td>
                        {financialData.map(row => <td key={row.year} className="p-3 text-right">({row.adminCost.toLocaleString()})</td>)}
                      </tr>

                      <tr className="bg-slate-900 font-bold text-slate-100 border-t border-b border-slate-700">
                        <td className="p-3">EBITDA</td>
                        {financialData.map(row => (
                          <td key={row.year} className={`p-3 text-right ${row.ebitda >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {row.ebitda.toLocaleString()} <span className="text-[10px] text-slate-400">({row.ebitdaMarginPercent}%)</span>
                          </td>
                        ))}
                      </tr>

                      <tr className="text-purple-400 font-bold bg-purple-500/5">
                        <td className="p-3 pl-6">ROMI (Эффективность маркетинга)</td>
                        {financialData.map(row => <td key={row.year} className="p-3 text-right">{row.romi}%</td>)}
                      </tr>

                      <tr className="text-blue-400 font-bold bg-blue-500/5">
                        <td className="p-3 pl-6">Накопленный ROI (Эффективность капитала)</td>
                        {financialData.map(row => <td key={row.year} className="p-3 text-right">{row.roi}%</td>)}
                      </tr>

                      <tr className="text-slate-400">
                        <td className="p-3 pl-6">Амортизация активов (Depreciation)</td>
                        {financialData.map(row => <td key={row.year} className="p-3 text-right">({row.depreciation.toLocaleString()})</td>)}
                      </tr>

                      <tr className="bg-slate-950/40 text-slate-300 font-semibold">
                        <td className="p-3 pl-4">Операционная прибыль (EBIT)</td>
                        {financialData.map(row => <td key={row.year} className="p-3 text-right">{row.ebit.toLocaleString()}</td>)}
                      </tr>

                      <tr className="text-slate-400">
                        <td className="p-3 pl-6">Налоги на прибыль</td>
                        {financialData.map(row => (
                          <td key={row.year} className="p-3 text-right text-rose-300">
                            ({row.tax.toLocaleString()}) <span className="text-[9px] block text-slate-500">{row.isUsn ? 'УСН 15%' : 'ОСНО 25%'}</span>
                          </td>
                        ))}
                      </tr>

                      <tr className="bg-slate-950 text-slate-100 font-bold border-t-2 border-slate-700">
                        <td className="p-3">ЧИСТАЯ ПРИБЫЛЬ (Net Income)</td>
                        {financialData.map(row => (
                          <td key={row.year} className={`p-3 text-right ${row.netIncome >= 0 ? 'text-emerald-300' : 'text-rose-400'}`}>
                            {row.netIncome.toLocaleString()}
                          </td>
                        ))}
                      </tr>

                      <tr className="bg-slate-900/10 text-slate-400 text-[11px] border-t border-slate-800">
                        <td className="p-3 font-semibold">CAPEX (Капитальные затраты)</td>
                        {financialData.map(row => <td key={row.year} className="p-3 text-right text-rose-400">({row.capex.toLocaleString()})</td>)}
                      </tr>

                      <tr className="bg-amber-500/5 text-amber-300 font-bold">
                        <td className="p-3">Свободный Денежный Поток (FCF)</td>
                        {financialData.map(row => (
                          <td key={row.year} className={`p-3 text-right ${row.fcf >= 0 ? 'text-blue-400' : 'text-rose-300'}`}>
                            {row.fcf.toLocaleString()}
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* --- ВКЛАДКА 3: РЕЕСТР SKU --- */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex justify-between items-center flex-wrap gap-4">
                <div>
                  <h3 className="font-bold text-sm text-white mb-1">Реестр SKU & Pricing Engine (Ценообразование)</h3>
                  <p className="text-xs text-slate-400">Добавление, удаление и изменение цены/себестоимости SKU.</p>
                </div>
                <button 
                  onClick={() => setShowShowAddForm(!showAddForm)}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2 rounded-lg text-xs flex items-center gap-1.5 transition-colors shadow-md"
                >
                  <Plus className="h-4 w-4" />
                  Добавить новый SKU
                </button>
              </div>

              {showAddForm && (
                <form onSubmit={handleAddProduct} className="bg-slate-900 p-5 rounded-xl border border-slate-700 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs text-slate-400 font-semibold block">Название SKU</label>
                    <input 
                      type="text" placeholder="Напр. Набор 'Nordic'" value={newSkuName}
                      onChange={(e) => setNewSkuName(e.target.value)}
                      className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs w-full text-white" required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-slate-400 font-semibold block">Этап разработки</label>
                    <select 
                      value={newSkuStage} onChange={(e) => setNewSkuStage(e.target.value)}
                      className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs w-full text-white"
                    >
                      <option value="Stage1">Этап I — Запуск</option>
                      <option value="Stage2">Этап II</option>
                      <option value="Stage3">Этап III (Prof. Line)</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-slate-400 font-semibold block">Цена MSRP, ₽</label>
                    <input 
                      type="number" placeholder="РРЦ на полке" value={newSkuMsrp}
                      onChange={(e) => setNewSkuMsrp(e.target.value)}
                      className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs w-full text-white" required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-slate-400 font-semibold block">Себестоимость COGS, %</label>
                    <input 
                      type="number" placeholder="Обычно 20-30%" value={newSkuCogs}
                      onChange={(e) => setNewSkuCogs(e.target.value)}
                      className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs w-full text-white" required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-slate-400 font-semibold block">Дата запуска</label>
                    <input 
                      type="date" value={newSkuLaunchDate}
                      onChange={(e) => setNewSkuLaunchDate(e.target.value)}
                      className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs w-full text-white" required
                    />
                  </div>
                  <div className="lg:col-span-5 flex justify-end gap-2 pt-2 border-t border-slate-800">
                    <button type="button" onClick={() => setShowShowAddForm(false)} className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg text-xs hover:bg-slate-700">Отмена</button>
                    <button type="submit" className="px-4 py-2 bg-amber-500 text-slate-950 font-bold rounded-lg text-xs hover:bg-amber-400">Создать SKU</button>
                  </div>
                </form>
              )}

              {Object.entries(groupedProducts).map(([stageKey, skuList]) => {
                const stageNames = { Stage1: 'Этап I — Запуск', Stage2: 'Этап II', Stage3: 'Этап III (Professional Line)' };
                return (
                  <div key={stageKey} className="space-y-4">
                    <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2 border-b border-slate-800 pb-2">
                      <Grid className="h-4 w-4" /> {stageNames[stageKey]} ({skuList.length})
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {skuList.map(p => (
                        <div key={p.id} className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-3 relative overflow-hidden flex flex-col justify-between">
                          <button onClick={() => handleDeleteProduct(p.id)} className="absolute top-2 right-2 p-1 text-slate-500 hover:text-rose-400 transition-colors" title="Удалить SKU">
                            <Trash2 className="h-4 w-4" />
                          </button>

                          <div className="space-y-1">
                            <span className="text-[9px] text-slate-500 font-mono block">{p.id}</span>
                            <h4 className="font-bold text-sm text-white pr-6 leading-tight">{p.name}</h4>
                          </div>

                          {editingProductId === p.id ? (
                            <div className="space-y-3 bg-slate-950 p-3 rounded-lg border border-slate-800 mt-2">
                              <div className="space-y-1"><label className="text-[10px] text-slate-400 block font-medium">Цена MSRP, ₽</label><input type="number" value={editPrice} onChange={(e) => setEditPrice(e.target.value)} className="bg-slate-900 border border-slate-700 rounded px-2 py-1 w-full text-xs text-white" /></div>
                              <div className="space-y-1"><label className="text-[10px] text-slate-400 block font-medium">COGS, %</label><input type="number" value={editCogs} onChange={(e) => setEditCogs(e.target.value)} className="bg-slate-900 border border-slate-700 rounded px-2 py-1 w-full text-xs text-white" /></div>
                              <div className="space-y-1"><label className="text-[10px] text-slate-400 block font-medium">Дата запуска</label><input type="date" value={editLaunchDate} onChange={(e) => setEditLaunchDate(e.target.value)} className="bg-slate-900 border border-slate-700 rounded px-2 py-1 w-full text-xs text-white" /></div>
                              <div className="flex gap-2 pt-1">
                                <button onClick={() => saveProductEdit(p.id)} className="bg-amber-500 text-slate-950 font-bold px-3 py-1 rounded text-xs hover:bg-amber-400 w-full">Ок</button>
                                <button onClick={() => setEditingProductId(null)} className="bg-slate-800 text-slate-300 px-3 py-1 rounded text-xs hover:bg-slate-700">X</button>
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-3 pt-2">
                              <div className="grid grid-cols-2 gap-2 text-xs">
                                <div className="bg-slate-950 p-2 rounded">
                                  <span className="block text-[9px] text-slate-500">Цена MSRP</span>
                                  <span className="font-bold text-slate-200">{p.msrp.toLocaleString()} ₽</span>
                                </div>
                                <div className="bg-slate-950 p-2 rounded">
                                  <span className="block text-[9px] text-slate-500">Валовая маржа</span>
                                  <span className="font-bold text-emerald-400">{100 - p.cogsPercent}%</span>
                                </div>
                              </div>

                              <div className="text-[11px] text-slate-400 flex items-center gap-1.5 bg-slate-950/40 p-1.5 rounded border border-slate-800">
                                <Calendar className="h-3.5 w-3.5 text-slate-500" />
                                <span>Запуск: {p.launchDate}</span>
                              </div>

                              <div className="flex justify-between items-center pt-2 border-t border-slate-800/80">
                                <span className="text-[10px] text-slate-500">Прибыль: {Math.round(p.msrp * (1 - p.cogsPercent/100))} ₽</span>
                                <button onClick={() => startEditProduct(p)} className="text-xs text-amber-500 hover:text-amber-400 font-semibold">Изменить</button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}

            </div>
          )}

          {/* --- ВКЛАДКА 4: НАСТРОЙКА КАНАЛОВ ПРОДАЖ --- */}
          {activeTab === 'channels' && (
            <div className="space-y-6">
              
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                <h3 className="font-bold text-sm text-white mb-1">Дистрибуция по Годам (%)</h3>
                <p className="text-xs text-slate-400">Сумма долей каналов в каждом году должна составлять 100%. Изменение долей автоматически пересчитывает комиссии и результирующий OPEX.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.keys(channelMix).map(year => {
                  const mix = channelMix[year];
                  return (
                    <div key={year} className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-4">
                      <h4 className="font-bold text-base text-white border-b border-slate-800 pb-2 flex justify-between">
                        <span>{year} год</span>
                        <span className="text-xs text-slate-400 font-normal">План дистрибуции</span>
                      </h4>

                      <div className="space-y-3">
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="text-slate-400">Маркетплейсы</span>
                            <span className="font-bold text-amber-400">{mix.marketplace}%</span>
                          </div>
                          <input 
                            type="range" min="0" max="100" value={mix.marketplace}
                            onChange={(e) => updateChannelShare(year, 'marketplace', e.target.value)}
                            className="w-full accent-amber-500 bg-slate-950 h-1.5 rounded-lg cursor-pointer"
                          />
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="text-slate-400">DTC (Сайт/e-comm)</span>
                            <span className="font-bold text-emerald-400">{mix.dtc}%</span>
                          </div>
                          <input 
                            type="range" min="0" max="100" value={mix.dtc}
                            onChange={(e) => updateChannelShare(year, 'dtc', e.target.value)}
                            className="w-full accent-emerald-500 bg-slate-950 h-1.5 rounded-lg cursor-pointer"
                          />
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="text-slate-400">Барбершопы</span>
                            <span className="font-bold text-blue-400">{mix.barbershops}%</span>
                          </div>
                          <input 
                            type="range" min="0" max="100" value={mix.barbershops}
                            disabled={parseInt(year) < 2029} 
                            onChange={(e) => updateChannelShare(year, 'barbershops', e.target.value)}
                            className="w-full accent-blue-500 bg-slate-950 h-1.5 rounded-lg cursor-pointer disabled:opacity-30"
                          />
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="text-slate-400">Сети (Ритейл)</span>
                            <span className="font-bold text-purple-400">{mix.retail}%</span>
                          </div>
                          <input 
                            type="range" min="0" max="100" value={mix.retail}
                            disabled={parseInt(year) < 2030} 
                            onChange={(e) => updateChannelShare(year, 'retail', e.target.value)}
                            className="w-full accent-purple-500 bg-slate-950 h-1.5 rounded-lg cursor-pointer disabled:opacity-30"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          )}

          {/* --- ВКЛАДКА 5: ШТАТНЫЙ ПЛАН --- */}
          {activeTab === 'hr' && (
            <div className="space-y-6">
              
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                <h3 className="font-bold text-sm text-white mb-1">Кадровое планирование (HR Register)</h3>
                <p className="text-xs text-slate-400">
                  Укажите количество сотрудников по годам. ФОТ рассчитывается по схеме <span className="text-amber-400 font-bold">149%</span> от среднего оклада в 150 тыс. ₽.
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {Object.keys(hrStaff).map(year => (
                  <div key={year} className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-3 text-center">
                    <span className="text-xs text-slate-500 font-semibold">{year} год</span>
                    
                    <div className="flex items-center justify-center space-x-2">
                      <button 
                        onClick={() => updateStaffCount(year, hrStaff[year] - 1)}
                        className="w-8 h-8 rounded bg-slate-950 border border-slate-800 text-slate-300 font-bold hover:bg-slate-800"
                      >
                        -
                      </button>
                      <span className="text-lg font-bold text-amber-400 w-10">{hrStaff[year]}</span>
                      <button 
                        onClick={() => updateStaffCount(year, hrStaff[year] + 1)}
                        className="w-8 h-8 rounded bg-slate-950 border border-slate-800 text-slate-300 font-bold hover:bg-slate-800"
                      >
                        +
                      </button>
                    </div>

                    <div className="text-[10px] text-slate-400 space-y-1 pt-1 border-t border-slate-800">
                      <div>ФОТ + Налоги:</div>
                      <div className="font-bold text-slate-200">
                        {formatCurrency(Math.round(hrStaff[year] * 223.5 * 12))} / год
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 space-y-3">
                <h4 className="font-bold text-xs text-slate-300 uppercase tracking-wider">План расширения команды:</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                    <span className="font-bold text-amber-400 block mb-1">2027-2028 (Lean фаза)</span>
                    <p className="text-slate-400">Минимальная команда: Основатели (CEO + CMO) + базовый e-commerce менеджер. Фокус на мультифункциональность.</p>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                    <span className="font-bold text-blue-400 block mb-1">2029-2030 (Специфика ролей)</span>
                    <p className="text-slate-400">Появление менеджеров по маркетплейсам, DTC команды, начального R&D и внутренней логистической цепочки.</p>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                    <span className="font-bold text-purple-400 block mb-1">2031-2032 (Индустриализация)</span>
                    <p className="text-slate-400">Запуск собственного производства и расширенной лаборатории. Формирование полноценного HR и финансового департамента.</p>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* --- ВКЛАДКА 6: ИНВЕСТИЦИОННЫЙ ПЛАН --- */}
          {activeTab === 'capex' && (
            <div className="space-y-6">
              
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                <h3 className="font-bold text-sm text-white mb-1">План Капитальных Инвестиций (CAPEX Register)</h3>
                <p className="text-xs text-slate-400">
                  Управляйте плановыми капитальными вложениями (в тыс. рублей) на разработку ароматов, IT платформы, R&D и запуск производственного оборудования.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.keys(capexPlan).map(year => (
                  <div key={year} className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-4">
                    <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                      <span className="font-bold text-base text-white">{year} год</span>
                      <span className="text-[10px] text-slate-500">Амортизация: 20% в год</span>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs text-slate-400 font-medium block">Размер инвестиций, тыс. ₽</label>
                      <input 
                        type="number" 
                        step="500"
                        value={capexPlan[year]}
                        onChange={(e) => updateCapexValue(year, e.target.value)}
                        className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 w-full text-sm text-amber-400 font-bold focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div className="text-[11px] text-slate-500 bg-slate-950/50 p-2 rounded border border-slate-800/50">
                      {parseInt(year) === 2027 && "Запуск бренда, разработка ароматов, базовая ИТ-платформа"}
                      {parseInt(year) === 2028 && "Плановая доработка CRM-системы и адаптация под маркетплейсы"}
                      {parseInt(year) === 2029 && "Масштабирование собственной e-commerce платформы (DTC)"}
                      {parseInt(year) === 2030 && "Развитие цифровой экосистемы и интеграций с внешними API"}
                      {parseInt(year) === 2031 && "Создание собственной физической лаборатории R&D"}
                      {parseInt(year) === 2032 && "Запуск собственного производства и линий упаковки"}
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

        </main>

      </div>

      <footer className="border-t border-slate-800 bg-slate-950 px-4 py-3 text-center text-xs text-slate-500">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <span>Разработано в соответствии со стандартами Master Data Model (MDM) проекта HOT DADDY.</span>
          <span className="text-amber-500/80 font-semibold">Project Management Office (PMO) © 2026</span>
        </div>
      </footer>

    </div>
  );
}

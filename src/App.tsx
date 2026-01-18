import React, { useState, useEffect } from 'react';
import { 
  Bell, Calendar, Clock, User, Home, ChevronRight, Plus, Settings, 
  LogOut, Activity, CheckCircle2, MapPin, Heart, ChevronLeft, Phone, 
  Loader2, Check, Scale, Users, PlusCircle, Zap, ArrowUpRight, Smile, 
  Meh, Frown, Stethoscope, ClipboardList, Pill, Mail, Lock, Search, 
  TrendingUp, History, Info, Share2, X, AlertCircle, MessageSquare,
  Thermometer, Droplets, ArrowRight, ShieldCheck, UserCheck, Camera,
  Target, FileText, Edit3
} from 'lucide-react';

// --- Estilos Globais ---
const GlobalStyles = () => (
  <style dangerouslySetInnerHTML={{ __html: `
    :root { color-scheme: light; }
    body { 
      background-color: #F2F2F7 !important; 
      color: #1e293b !important;
      margin: 0;
      padding: 0;
      -webkit-font-smoothing: antialiased;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    }
    .safe-area-bottom { padding-bottom: env(safe-area-inset-bottom); }
    .animate-in { animation: fadeIn 0.3s ease-out; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    .ios-blur { backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); }
    input::placeholder { color: #94a3b8; font-weight: 400; }
  `}} />
);

// --- Componentes Base ---

const Card = ({ children, className = "", onClick }) => (
  <div 
    onClick={onClick}
    className={`bg-white rounded-[28px] p-5 shadow-sm border border-slate-200 transition-all active:scale-[0.98] ${className}`}
  >
    {children}
  </div>
);

const Button = ({ children, onClick, variant = 'primary', fullWidth = false, disabled = false, loading = false, className = "" }) => {
  const baseStyle = "h-14 px-6 rounded-2xl font-bold transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 shadow-sm";
  const variants = {
    primary: `bg-[#007AFF] text-white`,
    secondary: `bg-white text-[#007AFF] border border-slate-200`,
    danger: `bg-red-50 text-red-500 border border-red-100`,
    ghost: `bg-slate-100 text-slate-600`,
  };
  return (
    <button onClick={onClick} disabled={disabled || loading} className={`${baseStyle} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}>
      {loading ? <Loader2 className="animate-spin" /> : children}
    </button>
  );
};

const Input = ({ label, icon: Icon, type = "text", placeholder, value, onChange }) => (
  <div className="text-left w-full mb-4">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block px-1">{label}</label>
    <div className="relative">
      {Icon && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
          <Icon size={18} />
        </div>
      )}
      <input 
        type={type}
        className={`w-full bg-white border border-slate-200 rounded-2xl p-4 ${Icon ? 'pl-12' : 'pl-4'} font-bold outline-none focus:border-blue-500 transition-colors`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  </div>
);

// --- MODAIS ---

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40 animate-in">
      <div className="bg-[#F2F2F7] w-full max-w-md rounded-t-[32px] sm:rounded-[32px] max-h-[90vh] overflow-y-auto pb-10">
        <div className="sticky top-0 bg-[#F2F2F7]/80 ios-blur p-6 flex justify-between items-center z-10">
          <h3 className="text-xl font-black text-slate-900">{title}</h3>
          <button onClick={onClose} className="bg-white p-2 rounded-full shadow-sm"><X size={20} /></button>
        </div>
        <div className="px-6">{children}</div>
      </div>
    </div>
  );
};

// --- util localStorage (adição técnica, não muda layout) ---
const LS_KEYS = {
  treatments: 'vivercom_treatments_v1',
  sharedPeople: 'vivercom_shared_people_v1',
  cholesterol: 'vivercom_cholesterol_v1',
  familyHistory: 'vivercom_family_history_v1',
};

const safeJsonParse = (val, fallback) => {
  try { return JSON.parse(val); } catch { return fallback; }
};

const todayKey = () => {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

const calcAdherence = (treatment, dateStr) => {
  const expected = Math.max(1, Number(treatment?.dosesPerDay || 1));
  const taken = Math.min(expected, Number(treatment?.takenByDate?.[dateStr] || 0));
  const pct = Math.round((taken / expected) * 100);
  return { expected, taken, pct };
};

const MiniLineChart = ({ points = [] }) => {
  if (!points.length) return null;
  const w = 320;
  const h = 90;
  const pad = 10;

  const xs = points.map((_, i) => i);
  const ys = points.map(p => Number(p.value || 0));

  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const rangeY = Math.max(1, maxY - minY);

  const scaleX = (x) => pad + (x * (w - pad * 2)) / Math.max(1, xs.length - 1);
  const scaleY = (y) => (h - pad) - ((y - minY) * (h - pad * 2)) / rangeY;

  const d = points.map((p, i) => {
    const x = scaleX(i);
    const y = scaleY(Number(p.value || 0));
    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4">
      <svg width="100%" viewBox={`0 0 ${w} ${h}`} className="block">
        <path d={d} fill="none" stroke="currentColor" strokeWidth="3" className="text-blue-600" strokeLinejoin="round" strokeLinecap="round" />
        {points.map((p, i) => (
          <circle key={i} cx={scaleX(i)} cy={scaleY(Number(p.value || 0))} r="4" className="text-blue-600" fill="currentColor" />
        ))}
      </svg>
      <div className="flex justify-between mt-3 text-[9px] font-black text-slate-300 uppercase px-1">
        <span>{points[0]?.date || ''}</span>
        <span>{points[points.length - 1]?.date || ''}</span>
      </div>
    </div>
  );
};

// --- FLUXO DE ONBOARDING / CADASTRO ---

const OnboardingFlow = ({ onFinish, initialStep = 'welcome' }) => {
  const [step, setStep] = useState(initialStep);

  const next = (s) => setStep(s);
  const back = (s) => setStep(s);

  if (step === 'welcome') {
    return (
      <div className="flex-1 flex flex-col p-8 animate-in text-center justify-center min-h-screen">
        <h1 className="text-3xl font-black mb-6">Bem-vindo ao VIVERCOM</h1>
        <Button fullWidth onClick={() => next('step1')}>Criar conta</Button>
      </div>
    );
  }

  /* ===========================
     STEP 1 – DADOS BÁSICOS
  =========================== */
  if (step === 'step1') {
    return (
      <div className="p-8 animate-in min-h-screen pb-24">
        <h2 className="text-xl font-black mb-6">Dados Básicos</h2>

        <Input label="Nome Completo" icon={User} />
        <Input label="CPF" placeholder="000.000.000-00" />
        <Input label="Data de Nascimento" type="date" icon={Calendar} />
        <Input label="Estado Civil" placeholder="Ex: Casado(a)" />
        <Input label="Endereço Completo" placeholder="Rua, número, cidade, UF" />
        <Input label="Telefone" icon={Phone} />
        <Input label="Contato de Emergência" placeholder="Nome + telefone" />

        <Button fullWidth onClick={() => next('step2')}>Avançar</Button>
      </div>
    );
  }

  /* ===========================
     STEP 2 – DADOS DE ROTINA
  =========================== */
  if (step === 'step2') {
    return (
      <div className="p-8 animate-in min-h-screen pb-24">
        <h2 className="text-xl font-black mb-6">Dados de Rotina</h2>

        <Input label="Sexo" placeholder="Masculino / Feminino / Outro" />
        <Input label="Altura (cm)" />
        <Input label="Peso (kg)" />
        <Input label="Grupo Sanguíneo" placeholder="Ex: O+, A-" />
        <Input label="Doenças Pré-existentes" placeholder="Ex: Diabetes, Hipertensão" />
        <Input label="Hábitos de Vida" placeholder="Ex: Fuma, bebe, sedentário" />
        <Input label="Pratica Atividade Física?" placeholder="Ex: Sim, 3x por semana" />
        <Input label="Trabalho / Profissão" placeholder="Opcional" />

        <div className="flex gap-3">
          <Button variant="secondary" fullWidth onClick={() => back('step1')}>Voltar</Button>
          <Button fullWidth onClick={() => next('step3')}>Avançar</Button>
        </div>
      </div>
    );
  }

  /* ===========================
     STEP 3 – DADOS DE SAÚDE
  =========================== */
  if (step === 'step3') {
    return (
      <div className="p-8 animate-in min-h-screen pb-24">
        <h2 className="text-xl font-black mb-6">Dados de Saúde</h2>

        <Input label="Antecedentes de Saúde" placeholder="Ex: cirurgias, internações" />
        <Input label="Doenças Atuais" />
        <Input label="Tratamento Atual" />
        <Input label="Medicamentos em Uso" />
        <Input label="Possui Alergias?" placeholder="Ex: Dipirona, alimentos" />
        <Input label="Histórico Familiar (inicial)" placeholder="Detalhado depois" />

        <div className="flex gap-3">
          <Button variant="secondary" fullWidth onClick={() => back('step2')}>Voltar</Button>
          <Button fullWidth onClick={() => next('step4')}>Avançar</Button>
        </div>
      </div>
    );
  }

  /* ===========================
     STEP 4 – REDE DE APOIO
  =========================== */
  if (step === 'step4') {
    return (
      <div className="p-8 animate-in min-h-screen pb-24">
        <h2 className="text-xl font-black mb-6">Rede de Apoio</h2>

        <Input label="Contato de Emergência" />
        <Input label="Médico de Referência" />
        <Input label="Telefone do Médico" />
        <Input label="E-mail do Médico" />
        <Input label="Observações" placeholder="Opcional" />

        <div className="flex gap-3">
          <Button variant="secondary" fullWidth onClick={() => back('step3')}>Voltar</Button>
          <Button fullWidth onClick={() => onFinish({ name: 'Novo Usuário', role: 'patient' })}>
            Finalizar Cadastro
          </Button>
        </div>
      </div>
    );
  }
};

// --- TELAS DO APP (DASHBOARD) ---

const TabHome = ({ user, treatments, setTreatments }) => {
  const [feeling, setFeeling] = useState(null);
  const [isAddMedModalOpen, setIsAddMedModalOpen] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  const simulateNotification = () => {
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 8000);
  };

  // ✅ Adição: marcar dose tomada para atualizar aderência (sem mudar layout)
  const markDoseTaken = (treatmentId) => {
    const dKey = todayKey();
    setTreatments(prev => prev.map(t => {
      if (t.id !== treatmentId) return t;
      const expected = Math.max(1, Number(t.dosesPerDay || 1));
      const current = Number(t.takenByDate?.[dKey] || 0);
      const nextVal = Math.min(expected, current + 1);
      return { ...t, takenByDate: { ...(t.takenByDate || {}), [dKey]: nextVal } };
    }));
  };

  return (
    <div className="p-6 animate-in pb-32">
      {showNotification && (
        <div className="fixed top-4 left-4 right-4 z-[200] max-w-md mx-auto animate-in">
          <div className="bg-white/95 ios-blur p-4 rounded-[24px] shadow-2xl border border-slate-200 flex flex-col gap-3">
            <div className="flex gap-3">
              <div className="bg-blue-600 p-2 rounded-xl text-white"><Pill size={20} /></div>
              <div className="flex-1 text-left">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Agora • VIVERCOM</p>
                <h4 className="font-bold text-slate-900">Hora do seu medicamento!</h4>
                <p className="text-sm text-slate-600">Losartana 50mg - Dose da tarde.</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="flex-1 bg-blue-600 text-white py-2.5 rounded-xl font-bold text-sm" onClick={() => setShowNotification(false)}>Marcar como tomado</button>
              <button className="px-4 bg-slate-100 text-slate-600 py-2.5 rounded-xl font-bold text-sm" onClick={() => setShowNotification(false)}>Adiar</button>
            </div>
          </div>
        </div>
      )}

      <header className="flex items-center justify-between mb-8 text-left">
        <div>
          <p className="text-blue-600 font-bold text-[10px] uppercase tracking-widest">Seu app de autogestão de saúde</p>
          <h1 className="text-2xl font-black text-slate-900">Olá, {user?.name?.split(' ')[0]}!</h1>
        </div>
        <div className="flex gap-2">
          <button onClick={simulateNotification} className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100"><Zap size={20} className="text-yellow-500" /></button>
          <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 relative">
            <Bell size={24} className="text-slate-600" />
            <span className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </div>
        </div>
      </header>

      <Card className="mb-6 border-none shadow-md">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 text-left">Sentimento Hoje</p>
        <div className="flex justify-around items-center">
          {[{ id: 'sad', icon: Frown, label: 'Mal', color: 'text-red-500' }, { id: 'neutral', icon: Meh, label: 'Bem', color: 'text-yellow-500' }, { id: 'happy', icon: Smile, label: 'Ótimo', color: 'text-green-500' }].map((item) => (
            <button key={item.id} onClick={() => setFeeling(item.id)} className={`flex flex-col items-center gap-2 p-4 rounded-[22px] transition-all ${feeling === item.id ? 'bg-slate-50 scale-105' : 'opacity-40'}`}>
              <item.icon size={32} className={feeling === item.id ? item.color : 'text-slate-400'} />
              <span className="text-[10px] font-bold">{item.label}</span>
            </button>
          ))}
        </div>
      </Card>

      <div className="mb-8">
        <Button fullWidth onClick={() => setIsAddMedModalOpen(true)} className="h-16 shadow-lg shadow-blue-200">
          <PlusCircle size={24} /> Adicionar Medicamento
        </Button>
      </div>

      <section className="text-left mb-8">
        <h3 className="font-black text-slate-900 text-lg mb-4">Rotina do Dia</h3>
        <div className="space-y-3">
          {[
            { name: 'Losartana', dose: '50mg', time: '12:00', icon: Pill, status: 'pendente', treatmentId: treatments?.[0]?.id },
            { name: 'Dr. Roberto Silva', dose: 'Cardiologista', time: '14:30', icon: Stethoscope, status: 'agendado' },
          ].map((item, i) => (
            <div key={i} className="bg-white p-4 rounded-[22px] flex items-center gap-4 shadow-sm border border-slate-100">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${item.status === 'pendente' ? 'bg-blue-50 text-blue-600' : 'bg-slate-50 text-slate-400'}`}><item.icon size={20} /></div>
              <div className="flex-1">
                <h4 className="font-bold text-slate-800 text-sm">{item.name}</h4>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{item.dose} • {item.time}</p>

                {/* ✅ 2) Indicador de aderência do tratamento (adição dentro do bloco, sem mudar layout) */}
                {item.treatmentId && (
                  <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-1">
                    Aderência hoje: {calcAdherence(treatments.find(t => t.id === item.treatmentId), todayKey()).pct}%
                  </p>
                )}
              </div>
              <button
                onClick={() => item.treatmentId ? markDoseTaken(item.treatmentId) : null}
                className="w-8 h-8 rounded-full border-2 border-slate-100 flex items-center justify-center text-slate-300 active:bg-blue-600 active:text-white transition-colors"
                type="button"
              >
                <Check size={16} strokeWidth={3} />
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="text-left mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-black text-slate-900 text-lg">Próximas Consultas</h3>
          <button className="text-blue-600 text-xs font-bold">Ver Calendário</button>
        </div>
        <div className="space-y-3">
          {[
            { doctor: 'Dra. Aline Santos', specialty: 'Nutricionista', date: '25 Jan', time: '10:00', type: 'Presencial', color: 'bg-indigo-50 text-indigo-600' },
            { doctor: 'Dr. Marcos Oliveira', specialty: 'Dermatologista', date: '02 Fev', time: '16:45', type: 'Teleconsulta', color: 'bg-emerald-50 text-emerald-600' },
          ].map((appt, i) => (
            <Card key={i} className="p-4">
              <div className="flex gap-4">
                <div className={`${appt.color} w-14 h-14 rounded-2xl flex flex-col items-center justify-center`}>
                  <span className="text-[8px] font-black uppercase">{appt.date.split(' ')[1]}</span>
                  <span className="text-lg font-black">{appt.date.split(' ')[0]}</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-slate-900 text-sm">{appt.doctor}</h4>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">{appt.specialty} • {appt.time}</p>
                  <div className="flex items-center gap-1 mt-2 text-[9px] font-black text-slate-400 uppercase">
                    {appt.type === 'Presencial' ? <MapPin size={10} /> : <Activity size={10} />}
                    {appt.type}
                  </div>
                </div>
                <div className="flex items-center">
                  <ChevronRight size={18} className="text-slate-200" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* ✅ 3) Tratamento abaixo de “Próximas Consultas” (adição logo abaixo, sem mover nada) */}
      <section className="text-left mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-black text-slate-900 text-lg">Tratamentos</h3>
          <button className="text-blue-600 text-xs font-bold">Ver Tudo</button>
        </div>

        <div className="space-y-3">
          {(treatments || []).map((t) => {
            const a = calcAdherence(t, todayKey());
            return (
              <Card key={t.id} className="p-4">
                <div className="flex gap-4">
                  <div className="bg-blue-50 text-blue-600 w-14 h-14 rounded-2xl flex items-center justify-center">
                    <Pill size={22} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-slate-900 text-sm">{t.name}</h4>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">
                      {t.dosage} • {t.frequency}
                    </p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Aderência hoje</span>
                      <span className="text-[10px] font-black text-blue-600 uppercase">{a.pct}%</span>
                    </div>
                    <div className="mt-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div className="h-2 bg-blue-600" style={{ width: `${a.pct}%` }} />
                    </div>
                    <p className="text-[10px] text-slate-400 font-medium mt-2">
                      Tomadas: <b>{a.taken}</b> de <b>{a.expected}</b>
                    </p>
                  </div>
                  <div className="flex items-center">
                    <ChevronRight size={18} className="text-slate-200" />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      <Modal isOpen={isAddMedModalOpen} onClose={() => setIsAddMedModalOpen(false)} title="Novo Tratamento">
        <div className="space-y-4 text-left">
          <Input label="Nome do Medicamento" icon={Pill} placeholder="Ex: Atorvastatina" />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Dosagem" icon={Activity} placeholder="10mg" />
            <div className="text-left">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block px-1">Frequência</label>
              <select className="w-full bg-white border border-slate-200 rounded-2xl p-4 font-bold outline-none h-[58px]">
                <option>Diário</option>
                <option>12 em 12h</option>
                <option>8 em 8h</option>
              </select>
            </div>
          </div>
          <Input label="Próximo Horário" icon={Clock} type="time" />
          <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-2xl border border-blue-100">
            <MessageSquare className="text-blue-600" size={20} />
            <p className="text-xs text-blue-800 font-medium">Alertas automáticos via <b>Push</b> e <b>WhatsApp</b> serão ativados.</p>
          </div>
          <Button fullWidth className="mt-4" onClick={() => setIsAddMedModalOpen(false)}>Salvar Medicamento</Button>
        </div>
      </Modal>
    </div>
  );
};

const TabAgenda = ({ treatments, setTreatments }) => {
  const [selectedDay, setSelectedDay] = useState(16);
  const [modalType, setModalType] = useState(null); // 'med', 'appt', 'exam', 'treat' ✅
  const days = [14, 15, 16, 17, 18, 19, 20];

  // ✅ 1) Agenda – incluir opção “Novo Tratamento” (adição sem mexer nos itens atuais)
  const [treatForm, setTreatForm] = useState({ name: '', dosage: '', frequency: 'Diário', dosesPerDay: '1' });

  const addTreatmentFromAgenda = () => {
    const id = `t_${Date.now()}`;
    const newT = {
      id,
      name: treatForm.name || 'Novo Tratamento',
      dosage: treatForm.dosage || '—',
      frequency: treatForm.frequency || 'Diário',
      dosesPerDay: Number(treatForm.dosesPerDay || 1),
      takenByDate: {},
    };
    setTreatments(prev => [newT, ...(prev || [])]);
    setTreatForm({ name: '', dosage: '', frequency: 'Diário', dosesPerDay: '1' });
    setModalType(null);
  };

  return (
    <div className="p-6 text-left animate-in pb-32">
      <h1 className="text-2xl font-black text-slate-900 mb-2">Agenda</h1>
      <p className="text-sm text-slate-500 mb-6">Sua programação completa de saúde.</p>

      {/* Seletor de Datas */}
      <div className="flex justify-between mb-8 overflow-x-auto pb-2 scrollbar-hide">
        {days.map((day) => (
          <button 
            key={day} 
            onClick={() => setSelectedDay(day)}
            className={`flex flex-col items-center gap-1 min-w-[50px] py-4 rounded-2xl transition-all ${selectedDay === day ? 'bg-blue-600 text-white shadow-lg scale-105' : 'bg-white text-slate-400 border border-slate-100'}`}
          >
            <span className="text-[8px] font-black uppercase tracking-tighter opacity-70">Jan</span>
            <span className="text-lg font-black">{day}</span>
          </button>
        ))}
      </div>

      {/* Botões de Ação Rápida (mantido 100% como está) */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        <button onClick={() => setModalType('med')} className="flex flex-col items-center gap-2 p-4 bg-white rounded-3xl border border-slate-100 shadow-sm active:scale-95 transition-all">
          <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center"><Pill size={20} /></div>
          <span className="text-[10px] font-black uppercase text-slate-400">Remédio</span>
        </button>
        <button onClick={() => setModalType('appt')} className="flex flex-col items-center gap-2 p-4 bg-white rounded-3xl border border-slate-100 shadow-sm active:scale-95 transition-all">
          <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center"><Stethoscope size={20} /></div>
          <span className="text-[10px] font-black uppercase text-slate-400">Consulta</span>
        </button>
        <button onClick={() => setModalType('exam')} className="flex flex-col items-center gap-2 p-4 bg-white rounded-3xl border border-slate-100 shadow-sm active:scale-95 transition-all">
          <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center"><ClipboardList size={20} /></div>
          <span className="text-[10px] font-black uppercase text-slate-400">Exame</span>
        </button>
      </div>

      {/* ✅ ADIÇÃO: Novo Tratamento sem mexer no grid (fica como novo bloco abaixo) */}
      <div className="mb-8">
        <button
          onClick={() => setModalType('treat')}
          className="w-full flex items-center gap-4 p-4 bg-white rounded-3xl border border-slate-100 shadow-sm active:scale-95 transition-all text-left"
          type="button"
        >
          <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
            <PlusCircle size={20} />
          </div>
          <div className="flex-1">
            <span className="text-[10px] font-black uppercase text-slate-400">Novo Tratamento</span>
            <p className="text-sm font-bold text-slate-800">Cadastrar tratamento pela Agenda</p>
          </div>
          <ChevronRight className="text-slate-200" />
        </button>
      </div>

      {/* Linha do Tempo */}
      <div className="space-y-6">
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Clock size={16} className="text-blue-600" />
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Cronograma de hoje</h3>
          </div>
          
          <div className="space-y-4 border-l-2 border-slate-100 ml-2 pl-6 relative">
            {[
              { time: '08:00', title: 'Medicamento', desc: 'Losartana 50mg', icon: Pill, color: 'text-blue-600', bg: 'bg-blue-50' },
              { time: '10:00', title: 'Consulta', desc: 'Dra. Aline (Nutri)', icon: Stethoscope, color: 'text-indigo-600', bg: 'bg-indigo-50' },
              { time: '12:30', title: 'Medicamento', desc: 'Vitamina D', icon: Pill, color: 'text-orange-600', bg: 'bg-orange-50' },
              { time: '16:45', title: 'Exame', desc: 'Coleta de Sangue', icon: Activity, color: 'text-purple-600', bg: 'bg-purple-50' },
            ].map((item, i) => (
              <div key={i} className="relative">
                <div className="absolute -left-[31px] top-1 w-2.5 h-2.5 rounded-full bg-slate-200 border-2 border-white"></div>
                <div className="flex gap-4">
                  <span className="text-[10px] font-black text-slate-400 w-10 pt-1">{item.time}</span>
                  <div className={`flex-1 ${item.bg} p-4 rounded-2xl border border-slate-50`}>
                    <div className="flex items-center gap-2 mb-1">
                      <item.icon size={14} className={item.color} />
                      <span className={`text-[9px] font-black uppercase tracking-widest ${item.color}`}>{item.title}</span>
                    </div>
                    <p className="text-sm font-bold text-slate-800">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Modais de Cadastro */}
      <Modal isOpen={modalType === 'med'} onClose={() => setModalType(null)} title="Novo Medicamento">
        <div className="space-y-4 text-left">
          <Input label="Nome do Medicamento" icon={Pill} placeholder="Ex: Metformina" />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Dosagem" icon={Activity} placeholder="500mg" />
            <Input label="Estoque Inicial" icon={History} placeholder="30" />
          </div>
          <Input label="Horário" icon={Clock} type="time" />
          <Button fullWidth onClick={() => setModalType(null)}>Cadastrar Medicamento</Button>
        </div>
      </Modal>

      <Modal isOpen={modalType === 'appt'} onClose={() => setModalType(null)} title="Nova Consulta">
        <div className="space-y-4 text-left">
          <Input label="Médico / Profissional" icon={User} placeholder="Nome do médico" />
          <Input label="Especialidade" icon={Stethoscope} placeholder="Ex: Cardiologia" />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Data" icon={Calendar} type="date" />
            <Input label="Hora" icon={Clock} type="time" />
          </div>
          <Input label="Local / Link" icon={MapPin} placeholder="Clínica ou Link de reunião" />
          <Button fullWidth onClick={() => setModalType(null)}>Agendar Consulta</Button>
        </div>
      </Modal>

      <Modal isOpen={modalType === 'exam'} onClose={() => setModalType(null)} title="Novo Exame">
        <div className="space-y-4 text-left">
          <Input label="Tipo de Exame" icon={ClipboardList} placeholder="Ex: Ecocardiograma" />
          <Input label="Laboratório / Local" icon={MapPin} placeholder="Nome do laboratório" />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Data

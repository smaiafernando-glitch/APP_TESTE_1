import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Calendar, 
  Clock, 
  User, 
  Home, 
  ChevronRight, 
  Plus, 
  Settings, 
  LogOut, 
  Shield, 
  Activity, 
  CheckCircle2, 
  CalendarDays,
  MapPin,
  Video,
  Heart,
  ChevronLeft,
  Mail,
  Lock,
  Phone,
  Camera,
  Loader2,
  Check,
  Zap,
  Moon,
  Scale,
  Thermometer,
  ArrowUpRight,
  Filter,
  Save,
  AlertTriangle,
  Smile,
  Meh,
  Frown,
  ZapOff
} from 'lucide-react';

// --- Theme Constants ---
const COLORS = {
  primary: '#007AFF',
  background: '#F2F2F7',
  card: '#FFFFFF',
  text: '#1C1C1E',
  textSecondary: '#8E8E93',
  success: '#34C759',
  border: '#E5E5EA'
};

// --- Mock Data ---
const MOCK_MEDS = [
  { id: 1, name: 'Atorvastatina', dose: '20mg', time: '08:00', taken: true },
  { id: 2, name: 'Losartana', dose: '50mg', time: '12:00', taken: false },
  { id: 3, name: 'Vitamina D', dose: '2000 UI', time: '20:00', taken: false },
];

const MOCK_APPOINTMENTS = [
  { id: 1, doc: 'Dr. Roberto Silva', specialty: 'Cardiologista', date: '22 Jan', time: '14:30', type: 'Presencial', location: 'Clínica Vida, Sala 402' },
  { id: 2, doc: 'Dra. Aline Santos', specialty: 'Nutricionista', date: '25 Jan', time: '10:00', type: 'Teleconsulta', location: 'Link via App' },
];

const MOCK_VITALS = [
  { id: 'heart', label: 'Batimentos', value: '72', unit: 'bpm', icon: Zap, color: 'text-red-500', bg: 'bg-red-50' },
  { id: 'sleep', label: 'Sono', value: '7.5', unit: 'hrs', icon: Moon, color: 'text-indigo-500', bg: 'bg-indigo-50' },
  { id: 'weight', label: 'Peso', value: '78.2', unit: 'kg', icon: Scale, color: 'text-blue-500', bg: 'bg-blue-50' },
  { id: 'temp', label: 'Temp.', value: '36.6', unit: '°C', icon: Thermometer, color: 'text-orange-500', bg: 'bg-orange-50' },
];

const MOCK_HISTORY = [
  { id: 1, title: 'Check-up Semestral', date: '10 Dez, 2024', status: 'Concluído', category: 'Consulta' },
  { id: 2, title: 'Exame de Sangue', date: '05 Nov, 2024', status: 'Concluído', category: 'Exame' },
  { id: 3, title: 'Início do Tratamento B', date: '20 Set, 2024', status: 'Evento', category: 'Tratamento' },
  { id: 4, title: 'Vacina Gripe', date: '15 Ago, 2024', status: 'Concluído', category: 'Vacina' },
];

// --- Shared Components ---

const Button = ({ children, onClick, variant = 'primary', fullWidth = false, disabled = false, loading = false, className = "" }) => {
  const baseStyle = "h-14 px-6 rounded-2xl font-bold transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:active:scale-100";
  const variants = {
    primary: `bg-[${COLORS.primary}] text-white shadow-lg shadow-blue-200`,
    secondary: `bg-white text-[${COLORS.primary}] border border-[${COLORS.primary}]`,
    ghost: `bg-transparent text-[${COLORS.textSecondary}]`,
  };
  
  return (
    <button 
      onClick={onClick} 
      disabled={disabled || loading}
      className={`${baseStyle} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      style={{ backgroundColor: variant === 'primary' ? COLORS.primary : undefined }}
    >
      {loading ? <Loader2 className="animate-spin" /> : children}
    </button>
  );
};

const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-[28px] p-5 shadow-sm border border-gray-100 ${className}`}>
    {children}
  </div>
);

const Input = ({ label, type = "text", placeholder, icon: Icon, value, onChange, error }) => (
  <div className="mb-4 text-left">
    {label && <label className="block text-[10px] font-bold text-gray-400 mb-2 ml-1 uppercase tracking-widest">{label}</label>}
    <div className="relative">
      {Icon && <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />}
      <input 
        type={type} 
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full bg-white border-2 ${error ? 'border-red-500' : 'border-transparent'} rounded-2xl py-4 ${Icon ? 'pl-12' : 'px-4'} focus:border-blue-500 transition-all outline-none shadow-sm text-sm font-medium`}
      />
    </div>
    {error && <p className="text-red-500 text-xs mt-1 ml-1 font-medium">{error}</p>}
  </div>
);

// --- Onboarding Flow ---

const Onboarding = ({ onComplete }) => {
  const [step, setStep] = useState('welcome');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ phone: '', name: '', birthDate: '' });

  const nextStep = (target) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(target);
    }, 800);
  };

  if (step === 'welcome') return (
    <div className="flex flex-col h-screen px-8 pb-12 pt-24 animate-in fade-in duration-700">
      <div className="mb-auto">
        <div className="w-20 h-20 bg-blue-600 rounded-[28px] flex items-center justify-center text-white mb-8 shadow-xl rotate-3">
          <Heart size={40} fill="currentColor" />
        </div>
        <h1 className="text-4xl font-black tracking-tight text-gray-900 leading-tight">Bem-vindo ao <br/><span className="text-blue-600">VIVERCOM</span></h1>
        <p className="text-xl text-gray-500 mt-4 leading-relaxed font-medium">Tudo o que você precisa para cuidar de quem você ama em um só lugar.</p>
      </div>
      <Button fullWidth onClick={() => setStep('phone')}>Começar</Button>
    </div>
  );

  if (step === 'phone') return (
    <div className="flex flex-col h-screen px-8 pt-16 animate-in slide-in-from-right-8 duration-300">
      <button onClick={() => setStep('welcome')} className="mb-8 w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm"><ChevronLeft /></button>
      <h2 className="text-3xl font-bold mb-2">Seu Telefone</h2>
      <p className="text-gray-500 mb-8">Validaremos seu acesso de forma segura.</p>
      <Input label="Celular" placeholder="(00) 00000-0000" icon={Phone} value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
      <Button fullWidth loading={loading} disabled={formData.phone.length < 8} onClick={() => nextStep('code')}>Enviar Código</Button>
    </div>
  );

  if (step === 'code') return (
    <div className="flex flex-col h-screen px-8 pt-16 animate-in slide-in-from-right-8 duration-300">
      <button onClick={() => setStep('phone')} className="mb-8 w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm"><ChevronLeft /></button>
      <h2 className="text-3xl font-bold mb-2">Validar Acesso</h2>
      <p className="text-gray-500 mb-8">Insira o código enviado por SMS.</p>
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[1,2,3,4].map(i => <div key={i} className="w-full h-16 bg-white rounded-2xl border-2 border-transparent flex items-center justify-center text-2xl font-bold shadow-sm">0</div>)}
      </div>
      <Button fullWidth loading={loading} onClick={() => nextStep('profile')}>Verificar e Continuar</Button>
    </div>
  );

  if (step === 'profile') return (
    <div className="flex flex-col h-screen px-8 pt-16 animate-in slide-in-from-right-8 duration-300">
      <h2 className="text-3xl font-bold mb-2">Quem vamos cuidar?</h2>
      <p className="text-gray-500 mb-8">Crie o perfil principal.</p>
      <div className="flex justify-center mb-8">
        <div className="relative w-24 h-24 rounded-[32px] bg-gray-100 flex items-center justify-center text-gray-400 border-2 border-dashed border-gray-300">
          <User size={40} /><button className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-2 rounded-xl shadow-lg border-4 border-[#F2F2F7]"><Camera size={16} /></button>
        </div>
      </div>
      <Input label="Nome Completo" placeholder="Ex: João da Silva" icon={User} value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
      <div className="mt-auto pb-12"><Button fullWidth loading={loading} disabled={!formData.name} onClick={() => nextStep('success')}>Finalizar Cadastro</Button></div>
    </div>
  );

  if (step === 'success') return (
    <div className="flex flex-col h-screen px-8 items-center justify-center text-center animate-in zoom-in-95 duration-500">
      <div className="w-24 h-24 bg-green-100 text-green-600 rounded-[35px] flex items-center justify-center mb-8"><Check size={48} strokeWidth={3} /></div>
      <h2 className="text-3xl font-black mb-4">Tudo pronto!</h2>
      <p className="text-gray-500 text-lg mb-10">Vamos cuidar da sua saúde <br/> por aqui.</p>
      <Button fullWidth onClick={() => onComplete(formData.name)}>Ir para o Início</Button>
    </div>
  );
};

// --- App Modules ---

const DashboardModule = ({ userName }) => {
  const [mood, setMood] = useState(null);

  const moodOptions = [
    { id: 'great', emoji: '🤩', label: 'Excelente', icon: Smile, color: 'text-orange-500', bg: 'bg-orange-50' },
    { id: 'good', emoji: '😊', label: 'Bom', icon: Smile, color: 'text-green-500', bg: 'bg-green-50' },
    { id: 'normal', emoji: '😐', label: 'Normal', icon: Meh, color: 'text-blue-500', bg: 'bg-blue-50' },
    { id: 'low', emoji: '😔', label: 'Baixo', icon: Frown, color: 'text-purple-500', bg: 'bg-purple-50' },
    { id: 'tired', emoji: '😴', label: 'Cansado', icon: ZapOff, color: 'text-gray-500', bg: 'bg-gray-50' },
  ];

  return (
    <div className="p-6 pb-24 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-8">
        <div><p className="text-gray-500 font-medium">Bom dia,</p><h1 className="text-2xl font-extrabold text-gray-900">{userName}</h1></div>
        <div className="relative bg-white p-3 rounded-2xl shadow-sm border border-gray-100"><Bell size={24} className="text-gray-700" /><span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span></div>
      </div>

      {/* Seção de Disposição - Nova */}
      <div className="mb-8">
        <h3 className="text-xl font-bold mb-4">Como está a sua disposição hoje?</h3>
        <div className="flex justify-between gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {moodOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => setMood(option.id)}
              className={`flex-1 min-w-[70px] flex flex-col items-center gap-2 p-3 rounded-[24px] transition-all duration-300 ${
                mood === option.id 
                  ? `${option.bg} border-2 border-blue-500 scale-105 shadow-md` 
                  : 'bg-white border-2 border-transparent shadow-sm'
              }`}
            >
              <span className="text-2xl">{option.emoji}</span>
              <span className={`text-[10px] font-bold uppercase tracking-tight ${mood === option.id ? 'text-blue-600' : 'text-gray-400'}`}>
                {option.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      <Card className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white border-none mb-8 shadow-xl shadow-blue-100">
        <div className="flex justify-between items-start mb-6">
          <div><p className="opacity-80 text-sm font-bold uppercase tracking-wider mb-1">Aderência Hoje</p><h3 className="text-4xl font-black">92%</h3></div>
          <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md"><Activity size={24} /></div>
        </div>
        <div className="w-full bg-white/20 h-2.5 rounded-full overflow-hidden"><div className="bg-white h-full rounded-full" style={{ width: '92%' }}></div></div>
      </Card>

      <div className="mb-8">
        <div className="flex justify-between items-center mb-4"><h3 className="text-xl font-bold">Medicamentos</h3><button className="text-blue-600 font-bold text-sm">Ver todos</button></div>
        <div className="space-y-4">
          {MOCK_MEDS.map(med => (
            <div key={med.id} className="bg-white p-4 rounded-[28px] flex items-center gap-4 shadow-sm border border-gray-50">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${med.taken ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'}`}><Clock size={24} /></div>
              <div className="flex-1"><h4 className="font-bold text-gray-800">{med.name}</h4><p className="text-xs text-gray-500">{med.dose} • {med.time}</p></div>
              <button className={`p-2 rounded-xl border-2 ${med.taken ? 'bg-green-500 border-green-500 text-white' : 'border-gray-100 text-gray-300'}`}><Check size={20} strokeWidth={3} /></button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const AgendaModule = () => (
  <div className="p-6 pb-24 animate-in fade-in duration-500">
    <div className="flex justify-between items-center mb-8"><h1 className="text-3xl font-bold">Agenda</h1><button className="bg-blue-600 text-white p-3 rounded-2xl shadow-lg shadow-blue-200"><Plus size={24} /></button></div>
    <div className="flex gap-3 mb-8 overflow-x-auto pb-2 scrollbar-hide">
      {['Seg', 'Ter', 'Qua', 'Qui', 'Sex'].map((dia, i) => (
        <div key={dia} className={`flex-shrink-0 w-14 py-4 rounded-[20px] flex flex-col items-center gap-1 ${i === 2 ? 'bg-blue-600 text-white' : 'bg-white text-gray-400'}`}><span className="text-[10px] font-bold uppercase">{dia}</span><span className="text-lg font-bold">{16 + i}</span></div>
      ))}
    </div>
    <div className="space-y-4">
      {MOCK_APPOINTMENTS.map(appt => (
        <Card key={appt.id} className="relative overflow-hidden">
          <div className={`absolute left-0 top-0 h-full w-1.5 ${appt.type === 'Teleconsulta' ? 'bg-indigo-500' : 'bg-blue-500'}`}></div>
          <div className="flex justify-between mb-3"><div><h4 className="font-bold text-lg">{appt.doc}</h4><p className="text-blue-600 text-sm font-semibold">{appt.specialty}</p></div><div className="text-right"><p className="font-bold">{appt.date}</p><p className="text-gray-400 text-xs">{appt.time}</p></div></div>
          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl text-xs text-gray-600 mb-4">{appt.type === 'Teleconsulta' ? <Video size={14} /> : <MapPin size={14} />}<span>{appt.location}</span></div>
          <div className="flex gap-2"><Button fullWidth variant="secondary" className="h-10 text-sm">Remarcar</Button><Button fullWidth className="h-10 text-sm">Confirmar</Button></div>
        </Card>
      ))}
    </div>
  </div>
);

const HistoryModule = () => (
  <div className="p-6 pb-24 animate-in fade-in duration-500 bg-[#F2F2F7]">
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-3xl font-bold">Painel de Saúde</h1>
      <button className="bg-white p-2.5 rounded-xl shadow-sm border border-gray-100">
        <Filter size={20} className="text-gray-500" />
      </button>
    </div>

    {/* Indicadores Vitais */}
    <div className="grid grid-cols-2 gap-4 mb-8">
      {MOCK_VITALS.map((vital) => (
        <Card key={vital.id} className="p-4 flex flex-col justify-between h-32 relative overflow-hidden group">
          <div className="flex justify-between items-start">
            <div className={`p-2 rounded-xl ${vital.bg} ${vital.color}`}>
              <vital.icon size={20} />
            </div>
            <ArrowUpRight size={16} className="text-gray-300 group-hover:text-blue-500 transition-colors" />
          </div>
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-gray-900">{vital.value}</span>
              <span className="text-xs font-bold text-gray-400 uppercase">{vital.unit}</span>
            </div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{vital.label}</p>
          </div>
        </Card>
      ))}
    </div>

    {/* Sessão de Histórico */}
    <div className="mb-6 flex items-center justify-between">
      <h3 className="text-gray-900 font-bold text-xl">Histórico e Atividades</h3>
      <button className="text-blue-600 text-xs font-bold">Ver Tudo</button>
    </div>

    <div className="space-y-4 relative before:content-[''] before:absolute before:left-6 before:top-2 before:bottom-2 before:w-[2px] before:bg-gray-200">
      {MOCK_HISTORY.map((item) => (
        <div key={item.id} className="relative pl-14">
          <div className={`absolute left-3 top-2 w-6 h-6 rounded-full border-4 border-[#F2F2F7] z-10 ${
            item.category === 'Consulta' ? 'bg-blue-500' : 
            item.category === 'Exame' ? 'bg-indigo-500' : 
            item.category === 'Vacina' ? 'bg-green-500' : 'bg-orange-500'
          }`}></div>
          <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[9px] font-black uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md mb-1 inline-block">
                  {item.category}
                </span>
                <h4 className="font-bold text-gray-800 text-base">{item.title}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <Calendar size={12} className="text-gray-400" />
                  <p className="text-xs text-gray-400 font-medium">{item.date}</p>
                </div>
              </div>
              <ChevronRight size={18} className="text-gray-300 mt-2" />
            </div>
          </Card>
        </div>
      ))}
    </div>

    {/* CTA Adicionar Registro */}
    <button className="w-full mt-8 bg-white border-2 border-dashed border-gray-300 rounded-[24px] p-6 flex flex-col items-center gap-2 text-gray-400 hover:border-blue-300 hover:text-blue-500 transition-all">
      <Plus size={24} />
      <span className="font-bold text-sm">Adicionar Exame ou Atividade</span>
    </button>
  </div>
);

// --- Profile Sub-Module: Personal Data ---

const PersonalDataForm = ({ onBack, initialData }) => {
  const [data, setData] = useState({
    bloodType: '',
    allergies: '',
    conditions: '',
    emergencyContact: '',
    emergencyPhone: '',
    ...initialData
  });
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      onBack();
    }, 1200);
  };

  return (
    <div className="absolute inset-0 bg-[#F2F2F7] z-[60] animate-in slide-in-from-right duration-300 overflow-y-auto pb-24">
      <div className="p-6">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={onBack} className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm"><ChevronLeft /></button>
          <h1 className="text-2xl font-bold">Dados Pessoais</h1>
        </div>

        <Card className="mb-6 border-l-4 border-l-blue-500">
          <div className="flex gap-4 items-start">
            <div className="bg-blue-50 p-2 rounded-lg text-blue-600"><AlertTriangle size={20} /></div>
            <p className="text-xs text-gray-500 leading-relaxed font-medium">Estas informações são vitais para sua segurança e ajudam o VIVERCOM a personalizar seus alertas de saúde.</p>
          </div>
        </Card>

        <div className="space-y-2">
          <Input label="Tipo Sanguíneo" placeholder="Ex: O+" icon={Activity} value={data.bloodType} onChange={e => setData({...data, bloodType: e.target.value})} />
          <Input label="Alergias Conhecidas" placeholder="Ex: Penicilina, Corantes..." icon={Shield} value={data.allergies} onChange={e => setData({...data, allergies: e.target.value})} />
          <Input label="Condições Crônicas" placeholder="Ex: Hipertensão, Diabetes..." icon={Heart} value={data.conditions} onChange={e => setData({...data, conditions: e.target.value})} />
          
          <div className="pt-4 mb-2">
            <h3 className="text-gray-400 font-bold text-[10px] uppercase tracking-widest ml-1 mb-4">Contato de Emergência</h3>
            <Input label="Nome do Contato" placeholder="Ex: Maria Silva (Esposa)" icon={User} value={data.emergencyContact} onChange={e => setData({...data, emergencyContact: e.target.value})} />
            <Input label="Telefone de Emergência" placeholder="(00) 00000-0000" icon={Phone} value={data.emergencyPhone} onChange={e => setData({...data, emergencyPhone: e.target.value})} />
          </div>
        </div>

        <div className="mt-8">
          <Button fullWidth loading={saving} onClick={handleSave}>
            <Save size={20} />
            Salvar Dados
          </Button>
        </div>
      </div>
    </div>
  );
};

const ProfileModule = ({ onLogout, userName }) => {
  const [subView, setSubView] = useState(null);

  if (subView === 'personal-data') {
    return <PersonalDataForm onBack={() => setSubView(null)} initialData={{}} />;
  }

  return (
    <div className="p-6 pb-24 animate-in fade-in duration-500">
      <div className="flex flex-col items-center mb-10">
        <div className="w-24 h-24 rounded-[35px] bg-blue-50 flex items-center justify-center text-blue-600 mb-4 shadow-inner border-4 border-white"><User size={48} /></div>
        <h2 className="text-2xl font-bold">{userName}</h2><p className="text-gray-500 font-medium">Perfil Principal</p>
      </div>
      <div className="space-y-3">
        {[
          { id: 'personal-data', label: 'Dados Pessoais', icon: User, color: 'text-blue-500' },
          { id: 'notifications', label: 'Notificações', icon: Bell, color: 'text-orange-500' },
          { id: 'security', label: 'Segurança', icon: Lock, color: 'text-green-500' },
          { id: 'support', label: 'Rede de Apoio', icon: Shield, color: 'text-purple-500' },
        ].map((item, idx) => (
          <button 
            key={idx} 
            onClick={() => item.id === 'personal-data' ? setSubView('personal-data') : null}
            className="w-full bg-white p-5 rounded-[24px] flex items-center gap-4 shadow-sm active:scale-[0.98] transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400"><item.icon size={20} /></div>
            <span className="font-bold flex-1 text-left">{item.label}</span>
            <ChevronRight className="text-gray-300" size={18} />
          </button>
        ))}
        <button onClick={onLogout} className="w-full bg-red-50 text-red-600 p-5 rounded-[24px] flex items-center gap-4 mt-8 active:scale-[0.98] transition-all font-bold"><div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center"><LogOut size={20} /></div><span>Sair do Aplicativo</span></button>
      </div>
    </div>
  );
};

// --- Main App Controller ---

export default function App() {
  const [user, setUser] = useState(null); 
  const [activeTab, setActiveTab] = useState('home');

  const handleOnboardingComplete = (name) => {
    setUser(name || 'João Silveira');
    setActiveTab('home');
  };

  const handleLogout = () => {
    setUser(null);
    setActiveTab('home');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#F2F2F7] max-w-md mx-auto shadow-2xl overflow-hidden font-sans select-none">
        <Onboarding onComplete={handleOnboardingComplete} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F2F2F7] max-w-md mx-auto shadow-2xl relative font-sans overflow-x-hidden">
      <main className="min-h-screen">
        {activeTab === 'home' && <DashboardModule userName={user} />}
        {activeTab === 'agenda' && <AgendaModule />}
        {activeTab === 'saude' && <HistoryModule />}
        {activeTab === 'perfil' && <ProfileModule userName={user} onLogout={handleLogout} />}
      </main>

      {/* Navigation Bar (iOS Style) */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white/90 backdrop-blur-xl border-t border-gray-100 px-8 py-4 flex justify-between items-center z-50 rounded-t-[32px] shadow-2xl">
        {[
          { id: 'home', icon: Home, label: 'Início' },
          { id: 'agenda', icon: Calendar, label: 'Agenda' },
          { id: 'saude', icon: Activity, label: 'Saúde' },
          { id: 'perfil', icon: User, label: 'Perfil' },
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center gap-1.5 transition-all ${activeTab === tab.id ? 'text-blue-600' : 'text-gray-300'}`}
          >
            <tab.icon size={activeTab === tab.id ? 26 : 24} strokeWidth={activeTab === tab.id ? 2.5 : 2} />
            <span className="text-[10px] font-black uppercase tracking-widest">{tab.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

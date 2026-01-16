'use client';

import React, { useState } from 'react';
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
  Activity,
  CheckCircle2,
  MapPin,
  Video,
  Heart,
  ChevronLeft,
  Phone,
  Camera,
  Loader2,
  Check,
  Moon,
  Scale,
  Thermometer,
  ArrowUpRight,
  Filter,
  Smile,
  Meh,
  Frown,
  ZapOff,
  Users,
  Zap,
} from 'lucide-react';

// --- Theme Constants ---
const COLORS = {
  primary: '#007AFF',
  background: '#F2F2F7',
  card: '#FFFFFF',
  text: '#1C1C1E',
  textSecondary: '#8E8E93',
  success: '#34C759',
  border: '#E5E5EA',
};

// --- Mock Data ---
const MOCK_MEDS = [
  { id: 1, name: 'Atorvastatina', dose: '20mg', time: '08:00', taken: true },
  { id: 2, name: 'Losartana', dose: '50mg', time: '12:00', taken: false },
  { id: 3, name: 'Vitamina D', dose: '2000 UI', time: '20:00', taken: false },
];

const MOCK_APPOINTMENTS = [
  {
    id: 1,
    doc: 'Dr. Roberto Silva',
    specialty: 'Cardiologista',
    date: '22 Jan',
    time: '14:30',
    type: 'Presencial',
    location: 'Clínica Vida, Sala 402',
  },
  {
    id: 2,
    doc: 'Dra. Aline Santos',
    specialty: 'Nutricionista',
    date: '25 Jan',
    time: '10:00',
    type: 'Teleconsulta',
    location: 'Link via App',
  },
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
];

// --- Shared Components ---
const Button = ({
  children,
  onClick,
  variant = 'primary',
  fullWidth = false,
  disabled = false,
  loading = false,
  className = '',
}) => {
  const baseStyle =
    'h-14 px-6 rounded-2xl font-bold transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:active:scale-100';

  const variantClass = {
    primary: 'text-white shadow-lg shadow-blue-200',
    secondary: 'bg-white border',
    ghost: 'bg-transparent',
  }[variant];

  const variantStyle =
    variant === 'primary'
      ? { backgroundColor: COLORS.primary }
      : variant === 'secondary'
        ? { color: COLORS.primary, borderColor: COLORS.primary }
        : { color: COLORS.textSecondary };

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseStyle} ${variantClass} ${fullWidth ? 'w-full' : ''} ${className}`}
      style={variantStyle}
      type="button"
    >
      {loading ? <Loader2 className="animate-spin" /> : children}
    </button>
  );
};

const Card = ({ children, className = '' }) => (
  <div className={`bg-white rounded-[28px] p-5 shadow-sm border border-gray-100 ${className}`}>{children}</div>
);

/**
 * ✅ FIX: força cor do texto digitado, placeholder, caret e autofill do Chrome.
 */
const Input = ({ label, type = 'text', placeholder, icon: Icon, value, onChange, error }) => (
  <div className="mb-4 text-left">
    {label && (
      <label className="block text-[10px] font-bold text-gray-400 mb-2 ml-1 uppercase tracking-widest">{label}</label>
    )}

    {/* Estilos locais para autofill (Chrome) */}
    <style jsx>{`
      input:-webkit-autofill,
      input:-webkit-autofill:hover,
      input:-webkit-autofill:focus,
      textarea:-webkit-autofill,
      textarea:-webkit-autofill:hover,
      textarea:-webkit-autofill:focus,
      select:-webkit-autofill,
      select:-webkit-autofill:hover,
      select:-webkit-autofill:focus {
        -webkit-text-fill-color: #111827; /* text-gray-900 */
        transition: background-color 5000s ease-in-out 0s;
        box-shadow: 0 0 0px 1000px #ffffff inset; /* fundo branco */
      }
    `}</style>

    <div className="relative">
      {Icon && <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={[
          'w-full bg-white border-2 rounded-2xl py-4 shadow-sm text-sm font-medium outline-none transition-all',
          'text-gray-900 placeholder:text-gray-400 caret-blue-600',
          Icon ? 'pl-12 pr-4' : 'px-4',
          error ? 'border-red-500' : 'border-transparent',
          'focus:border-blue-500',
        ].join(' ')}
      />
    </div>

    {error && <p className="text-red-500 text-xs mt-1 ml-1 font-medium">{error}</p>}
  </div>
);

// --- Onboarding Flow ---
const Onboarding = ({ onComplete }) => {
  const [step, setStep] = useState('welcome');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    role: '',
    phone: '',
    name: '',
    patientToWatch: '',
  });

  const nextStep = (target) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(target);
    }, 500);
  };

  if (step === 'welcome')
    return (
      <div className="flex flex-col h-screen px-8 pb-12 pt-24">
        <div className="mb-auto">
          <div
            className="w-20 h-20 rounded-[28px] flex items-center justify-center text-white mb-8 shadow-xl rotate-3"
            style={{ backgroundColor: COLORS.primary }}
          >
            <Heart size={40} fill="currentColor" />
          </div>
          <h1 className="text-4xl font-black tracking-tight text-gray-900 leading-tight">
            Bem-vindo ao <br />
            <span style={{ color: COLORS.primary }}>VIVERCOM</span>
          </h1>
          <p className="text-xl text-gray-500 mt-4 leading-relaxed font-medium">
            Tudo o que você precisa para cuidar de quem você ama em um só lugar.
          </p>
        </div>
        <Button fullWidth onClick={() => setStep('role')}>
          Começar
        </Button>
      </div>
    );

  if (step === 'role')
    return (
      <div className="flex flex-col h-screen px-8 pt-16">
        <button
          onClick={() => setStep('welcome')}
          className="mb-8 w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm"
          type="button"
        >
          <ChevronLeft />
        </button>

        <h2 className="text-3xl font-bold mb-2 text-gray-900">Como você usará o app?</h2>
        <p className="text-gray-500 mb-8">Escolha o seu perfil principal para continuarmos.</p>

        <div className="space-y-4">
          <button
            onClick={() => setFormData({ ...formData, role: 'patient' })}
            className={`w-full p-6 rounded-[28px] border-2 transition-all flex items-center gap-4 ${
              formData.role === 'patient'
                ? 'border-blue-500 bg-blue-50 shadow-md'
                : 'border-white bg-white shadow-sm'
            }`}
            type="button"
          >
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                formData.role === 'patient' ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-600'
              }`}
            >
              <User size={28} />
            </div>
            <div className="text-left">
              <h4 className="font-bold text-lg text-gray-900">Sou Paciente</h4>
              <p className="text-xs text-gray-400">Quero gerenciar minha própria saúde.</p>
            </div>
            {formData.role === 'patient' && <CheckCircle2 className="ml-auto text-blue-600" />}
          </button>

          <button
            onClick={() => setFormData({ ...formData, role: 'caregiver' })}
            className={`w-full p-6 rounded-[28px] border-2 transition-all flex items-center gap-4 ${
              formData.role === 'caregiver'
                ? 'border-indigo-500 bg-indigo-50 shadow-md'
                : 'border-white bg-white shadow-sm'
            }`}
            type="button"
          >
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                formData.role === 'caregiver' ? 'bg-indigo-600 text-white' : 'bg-indigo-50 text-indigo-600'
              }`}
            >
              <Users size={28} />
            </div>
            <div className="text-left">
              <h4 className="font-bold text-lg text-gray-900">Rede de Apoio</h4>
              <p className="text-xs text-gray-400">Sou familiar ou cuidador de alguém.</p>
            </div>
            {formData.role === 'caregiver' && <CheckCircle2 className="ml-auto text-indigo-600" />}
          </button>
        </div>

        <div className="mt-auto pb-12">
          <Button fullWidth disabled={!formData.role} onClick={() => nextStep('phone')}>
            Continuar
          </Button>
        </div>
      </div>
    );

  if (step === 'phone')
    return (
      <div className="flex flex-col h-screen px-8 pt-16">
        <button
          onClick={() => setStep('role')}
          className="mb-8 w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm"
          type="button"
        >
          <ChevronLeft />
        </button>
        <h2 className="text-3xl font-bold mb-2 text-gray-900">Seu Telefone</h2>
        <p className="text-gray-500 mb-8">Validaremos seu acesso de forma segura.</p>
        <Input
          label="Celular"
          placeholder="(00) 00000-0000"
          icon={Phone}
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        />
        <Button
          fullWidth
          loading={loading}
          disabled={formData.phone.replace(/\D/g, '').length < 10}
          onClick={() => nextStep('code')}
        >
          Enviar Código
        </Button>
      </div>
    );

  if (step === 'code')
    return (
      <div className="flex flex-col h-screen px-8 pt-16">
        <button
          onClick={() => setStep('phone')}
          className="mb-8 w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm"
          type="button"
        >
          <ChevronLeft />
        </button>
        <h2 className="text-3xl font-bold mb-2 text-gray-900">Validar Acesso</h2>
        <p className="text-gray-500 mb-8 text-sm">Insira o código enviado por SMS para o número informado.</p>

        <div className="grid grid-cols-4 gap-4 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="w-full h-16 bg-white rounded-2xl border-2 border-transparent flex items-center justify-center text-2xl font-bold shadow-sm text-gray-900"
            >
              0
            </div>
          ))}
        </div>

        <Button fullWidth loading={loading} onClick={() => nextStep('profile')}>
          Verificar e Continuar
        </Button>
      </div>
    );

  if (step === 'profile')
    return (
      <div className="flex flex-col h-screen px-8 pt-16 overflow-y-auto pb-12">
        <h2 className="text-3xl font-bold mb-2 text-gray-900">Seus dados</h2>
        <p className="text-gray-500 mb-8">
          Preencha seu perfil de {formData.role === 'patient' ? 'paciente' : 'apoio'}.
        </p>

        <div className="flex justify-center mb-8">
          <div className="relative w-24 h-24 rounded-[32px] bg-gray-100 flex items-center justify-center text-gray-400 border-2 border-dashed border-gray-300">
            <User size={40} />
            <button
              className="absolute -bottom-2 -right-2 text-white p-2 rounded-xl shadow-lg border-4"
              style={{ backgroundColor: COLORS.primary, borderColor: COLORS.background }}
              type="button"
            >
              <Camera size={16} />
            </button>
          </div>
        </div>

        <Input
          label="Seu Nome Completo"
          placeholder="Ex: João da Silva"
          icon={User}
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />

        {formData.role === 'caregiver' && (
          <div className="mt-4">
            <h3 className="text-gray-400 font-bold text-[10px] uppercase tracking-widest ml-1 mb-4">A quem você apoia?</h3>
            <Input
              label="Nome do Paciente"
              placeholder="Ex: Maria Silveira"
              icon={Heart}
              value={formData.patientToWatch}
              onChange={(e) => setFormData({ ...formData, patientToWatch: e.target.value })}
            />
          </div>
        )}

        <div className="mt-8">
          <Button
            fullWidth
            loading={loading}
            disabled={!formData.name || (formData.role === 'caregiver' && !formData.patientToWatch)}
            onClick={() => nextStep('success')}
          >
            Finalizar Cadastro
          </Button>
        </div>
      </div>
    );

  if (step === 'success')
    return (
      <div className="flex flex-col h-screen px-8 items-center justify-center text-center">
        <div className="w-24 h-24 bg-green-100 text-green-600 rounded-[35px] flex items-center justify-center mb-8">
          <Check size={48} strokeWidth={3} />
        </div>
        <h2 className="text-3xl font-black mb-4 text-gray-900">Tudo pronto!</h2>
        <p className="text-gray-500 text-lg mb-10">
          O VIVERCOM está pronto para <br />
          {formData.role === 'patient' ? 'cuidar de você' : `acompanhar ${formData.patientToWatch}`}.
        </p>
        <Button fullWidth onClick={() => onComplete(formData)}>
          Ir para o Início
        </Button>
      </div>
    );

  return null;
};

// --- App Modules ---
const DashboardModule = ({ user }) => {
  const [mood, setMood] = useState(null);
  const isCaregiver = user.role === 'caregiver';

  const moodOptions = [
    { id: 'great', emoji: '🤩', label: 'Excelente', icon: Smile, bg: 'bg-orange-50' },
    { id: 'good', emoji: '😊', label: 'Bom', icon: Smile, bg: 'bg-green-50' },
    { id: 'normal', emoji: '😐', label: 'Normal', icon: Meh, bg: 'bg-blue-50' },
    { id: 'low', emoji: '😔', label: 'Baixo', icon: Frown, bg: 'bg-purple-50' },
    { id: 'tired', emoji: '😴', label: 'Cansado', icon: ZapOff, bg: 'bg-gray-50' },
  ];

  return (
    <div className="p-6 pb-24">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-gray-500 font-medium">Bom dia, {user.name.split(' ')[0]}</p>
          <h1 className="text-2xl font-extrabold text-gray-900">
            {isCaregiver ? `Cuidando de ${user.patientToWatch}` : 'Sua Saúde'}
          </h1>
        </div>
        <div className="relative bg-white p-3 rounded-2xl shadow-sm border border-gray-100">
          <Bell size={24} className="text-gray-700" />
          <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full" />
        </div>
      </div>

      {!isCaregiver && (
        <div className="mb-8">
          <h3 className="text-xl font-bold mb-4 text-gray-900">Como está a sua disposição hoje?</h3>
          <div className="flex justify-between gap-2 overflow-x-auto pb-2">
            {moodOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => setMood(option.id)}
                className={`flex-1 min-w-[70px] flex flex-col items-center gap-2 p-3 rounded-[24px] transition-all duration-300 ${
                  mood === option.id
                    ? `${option.bg} border-2 border-blue-500 scale-105 shadow-md`
                    : 'bg-white border-2 border-transparent shadow-sm'
                }`}
                type="button"
              >
                <span className="text-2xl">{option.emoji}</span>
                <span className={`text-[10px] font-bold uppercase tracking-tight ${mood === option.id ? 'text-blue-600' : 'text-gray-400'}`}>
                  {option.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {isCaregiver && (
        <Card className="mb-8 bg-indigo-50 border-indigo-100">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-2xl">😊</div>
            <div>
              <h4 className="font-bold text-indigo-900">{user.patientToWatch} está se sentindo bem</h4>
              <p className="text-xs text-indigo-600 font-medium">Última atualização: Hoje, 08:30</p>
            </div>
          </div>
        </Card>
      )}

      <Card className="text-white border-none mb-8 shadow-xl shadow-blue-100" style={{ background: 'linear-gradient(135deg, #2563eb 0%, #4338ca 100%)' }}>
        <div className="flex justify-between items-start mb-6">
          <div>
            <p className="opacity-80 text-sm font-bold uppercase tracking-wider mb-1">Aderência Hoje</p>
            <h3 className="text-4xl font-black">92%</h3>
          </div>
          <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md">
            <Activity size={24} />
          </div>
        </div>
        <div className="w-full bg-white/20 h-2.5 rounded-full overflow-hidden">
          <div className="bg-white h-full rounded-full" style={{ width: '92%' }} />
        </div>
      </Card>

      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-900">Medicamentos</h3>
          <button className="font-bold text-sm" style={{ color: COLORS.primary }} type="button">
            Ver todos
          </button>
        </div>

        <div className="space-y-4">
          {MOCK_MEDS.map((med) => (
            <div key={med.id} className="bg-white p-4 rounded-[28px] flex items-center gap-4 shadow-sm border border-gray-50">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${med.taken ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'}`}>
                <Clock size={24} />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-gray-800">{med.name}</h4>
                <p className="text-xs text-gray-500">
                  {med.dose} • {med.time}
                </p>
              </div>
              <button
                className={`p-2 rounded-xl border-2 ${
                  med.taken ? 'bg-green-500 border-green-500 text-white' : 'border-gray-100 text-gray-300'
                }`}
                type="button"
              >
                <Check size={20} strokeWidth={3} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const AgendaModule = () => (
  <div className="p-6 pb-24">
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-3xl font-bold text-gray-900">Agenda</h1>
      <button className="text-white p-3 rounded-2xl shadow-lg shadow-blue-200" style={{ backgroundColor: COLORS.primary }} type="button">
        <Plus size={24} />
      </button>
    </div>

    <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
      {['Seg', 'Ter', 'Qua', 'Qui', 'Sex'].map((dia, i) => (
        <div
          key={dia}
          className={`flex-shrink-0 w-14 py-4 rounded-[20px] flex flex-col items-center gap-1 ${
            i === 2 ? 'bg-blue-600 text-white' : 'bg-white text-gray-400'
          }`}
        >
          <span className="text-[10px] font-bold uppercase">{dia}</span>
          <span className="text-lg font-bold">{16 + i}</span>
        </div>
      ))}
    </div>

    <div className="space-y-4">
      {MOCK_APPOINTMENTS.map((appt) => (
        <Card key={appt.id} className="relative overflow-hidden">
          <div className={`absolute left-0 top-0 h-full w-1.5 ${appt.type === 'Teleconsulta' ? 'bg-indigo-500' : 'bg-blue-500'}`} />
          <div className="flex justify-between mb-3">
            <div>
              <h4 className="font-bold text-lg text-gray-900">{appt.doc}</h4>
              <p className="text-blue-600 text-sm font-semibold">{appt.specialty}</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-gray-900">{appt.date}</p>
              <p className="text-gray-400 text-xs">{appt.time}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl text-xs text-gray-600 mb-4">
            {appt.type === 'Teleconsulta' ? <Video size={14} /> : <MapPin size={14} />}
            <span>{appt.location}</span>
          </div>

          <div className="flex gap-2">
            <Button fullWidth variant="secondary" className="h-10 text-sm">
              Remarcar
            </Button>
            <Button fullWidth className="h-10 text-sm">
              Confirmar
            </Button>
          </div>
        </Card>
      ))}
    </div>
  </div>
);

const HistoryModule = () => (
  <div className="p-6 pb-24 bg-[#F2F2F7]">
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-3xl font-bold text-gray-900">Saúde</h1>
      <button className="bg-white p-2.5 rounded-xl shadow-sm border border-gray-100" type="button">
        <Filter size={20} className="text-gray-500" />
      </button>
    </div>

    <div className="grid grid-cols-2 gap-4 mb-8">
      {MOCK_VITALS.map((vital) => {
        const Icon = vital.icon;
        return (
          <Card key={vital.id} className="p-4 flex flex-col justify-between h-32 relative overflow-hidden group">
            <div className="flex justify-between items-start">
              <div className={`p-2 rounded-xl ${vital.bg} ${vital.color}`}>
                <Icon size={20} />
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
        );
      })}
    </div>

    <div className="space-y-4 relative before:content-[''] before:absolute before:left-6 before:top-2 before:bottom-2 before:w-[2px] before:bg-gray-200">
      {MOCK_HISTORY.map((item) => (
        <div key={item.id} className="relative pl-14">
          <div className="absolute left-3 top-2 w-6 h-6 rounded-full border-4 border-[#F2F2F7] z-10 bg-blue-500" />
          <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[9px] font-black uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md mb-1 inline-block">
                  {item.category}
                </span>
                <h4 className="font-bold text-gray-800 text-base">{item.title}</h4>
                <p className="text-xs text-gray-400 font-medium">{item.date}</p>
              </div>
              <ChevronRight size={18} className="text-gray-300 mt-2" />
            </div>
          </Card>
        </div>
      ))}
    </div>
  </div>
);

const ProfileModule = ({ onLogout, user }) => (
  <div className="p-6 pb-24">
    <div className="flex flex-col items-center mb-10">
      <div className="w-24 h-24 rounded-[35px] bg-blue-50 flex items-center justify-center text-blue-600 mb-4 shadow-inner border-4 border-white">
        <User size={48} />
      </div>
      <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
      <p className="text-gray-500 font-medium">{user.role === 'patient' ? 'Perfil Paciente' : 'Rede de Apoio'}</p>
    </div>

    <div className="space-y-3">
      {['Dados Pessoais', 'Notificações', 'Segurança', 'Rede de Apoio'].map((item, idx) => (
        <button
          key={idx}
          className="w-full bg-white p-5 rounded-[24px] flex items-center gap-4 shadow-sm active:scale-[0.98] transition-all"
          type="button"
        >
          <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400">
            <Settings size={20} />
          </div>
          <span className="font-bold flex-1 text-left text-gray-900">{item}</span>
          <ChevronRight className="text-gray-300" size={18} />
        </button>
      ))}

      <button
        onClick={onLogout}
        className="w-full bg-red-50 text-red-600 p-5 rounded-[24px] flex items-center gap-4 mt-8 active:scale-[0.98] transition-all font-bold"
        type="button"
      >
        <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
          <LogOut size={20} />
        </div>
        <span>Sair do Aplicativo</span>
      </button>
    </div>
  </div>
);

// --- Main App Controller ---
export default function App() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('home');

  const handleOnboardingComplete = (userData) => {
    setUser(userData);
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
        {activeTab === 'home' && <DashboardModule user={user} />}
        {activeTab === 'agenda' && <AgendaModule />}
        {activeTab === 'saude' && <HistoryModule />}
        {activeTab === 'perfil' && <ProfileModule user={user} onLogout={handleLogout} />}
      </main>

      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white/90 backdrop-blur-xl border-t border-gray-100 px-8 py-4 flex justify-between items-center z-50 rounded-t-[32px] shadow-2xl">
        {[
          { id: 'home', icon: Home, label: 'Início' },
          { id: 'agenda', icon: Calendar, label: 'Agenda' },
          { id: 'saude', icon: Activity, label: 'Saúde' },
          { id: 'perfil', icon: User, label: 'Perfil' },
        ].map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center gap-1.5 transition-all ${active ? 'text-blue-600' : 'text-gray-300'}`}
              type="button"
            >
              <Icon size={active ? 26 : 24} strokeWidth={active ? 2.5 : 2} />
              <span className="text-[10px] font-black uppercase tracking-widest">{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}

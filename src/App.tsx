'use client';

import React, { useState } from 'react';
import {
  Bell, Calendar, Clock, User, Home, ChevronRight, Plus, Settings,
  LogOut, Activity, CheckCircle2, MapPin, Heart, ChevronLeft, Phone,
  Loader2, Check, Scale, Users, PlusCircle, Zap, ArrowUpRight, Smile,
  Meh, Frown, Stethoscope, ClipboardList, Pill, Mail, Lock, TrendingUp,
  History, Share2, X, AlertCircle, MessageSquare,
  Thermometer, Droplets, ShieldCheck
} from 'lucide-react';

// -----------------------------
//  GLOBAL + APP SHELL (fix iOS)
// -----------------------------
const GlobalStyles = () => (
  <style
    dangerouslySetInnerHTML={{
      __html: `
      :root { color-scheme: light; }
      html, body {
        height: 100%;
        width: 100%;
        margin: 0;
        padding: 0;
        background: #F2F2F7 !important;
        color: #1e293b !important;
        -webkit-font-smoothing: antialiased;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        overscroll-behavior-y: none;
        -webkit-overflow-scrolling: touch;
      }
      * { box-sizing: border-box; }
      .safe-area-bottom { padding-bottom: env(safe-area-inset-bottom); }
      .safe-area-top { padding-top: env(safe-area-inset-top); }
      .animate-in { animation: fadeIn 0.3s ease-out; }
      @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      .ios-blur { backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); }
      input::placeholder { color: #94a3b8; font-weight: 400; }
      /* Evita zoom do iOS ao focar input (mantém 16px) */
      input, select, textarea { font-size: 16px; }
    `,
    }}
  />
);

function AppShell({ children }) {
  return (
    <div
      className="mx-auto w-full max-w-md bg-[#F2F2F7] shadow-2xl overflow-hidden relative"
      style={{
        height: '100vh',
        minHeight: '100vh',
      }}
    >
      {/* altura real no mobile (resolve Safari) */}
      <div
        className="w-full h-full safe-area-top safe-area-bottom"
        style={{
          height: '100dvh',
          minHeight: '100dvh',
        }}
      >
        {children}
      </div>
    </div>
  );
}

// -----------------------------
//  BASE COMPONENTS
// -----------------------------
const Card = ({ children, className = '', onClick }) => (
  <div
    onClick={onClick}
    className={`bg-white rounded-[28px] p-5 shadow-sm border border-slate-200 transition-all active:scale-[0.98] ${className}`}
  >
    {children}
  </div>
);

const Button = ({ children, onClick, variant = 'primary', fullWidth = false, disabled = false, loading = false, className = '' }) => {
  const baseStyle =
    'h-14 px-6 rounded-2xl font-bold transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 shadow-sm';

  const variants = {
    primary: 'bg-[#007AFF] text-white',
    secondary: 'bg-white text-[#007AFF] border border-slate-200',
    danger: 'bg-red-50 text-red-500 border border-red-100',
    ghost: 'bg-slate-100 text-slate-600',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseStyle} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      type="button"
    >
      {loading ? <Loader2 className="animate-spin" /> : children}
    </button>
  );
};

const Input = ({ label, icon: Icon, type = 'text', placeholder, value, onChange }) => (
  <div className="text-left w-full mb-4">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block px-1">{label}</label>
    <style
      dangerouslySetInnerHTML={{
        __html: `
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus {
          -webkit-text-fill-color: #0f172a;
          transition: background-color 5000s ease-in-out 0s;
          box-shadow: 0 0 0px 1000px #ffffff inset;
        }
      `,
      }}
    />
    <div className="relative">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
        <Icon size={18} />
      </div>
      <input
        type={type}
        className="w-full bg-white border border-slate-200 rounded-2xl p-4 pl-12 font-bold outline-none focus:border-blue-500 transition-colors text-slate-900 caret-blue-600"
        placeholder={placeholder}
        value={value ?? ''}
        onChange={onChange}
      />
    </div>
  </div>
);

// -----------------------------
//  MODAL
// -----------------------------
const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40 animate-in">
      <div className="bg-[#F2F2F7] w-full max-w-md rounded-t-[32px] sm:rounded-[32px] max-h-[90dvh] overflow-y-auto pb-10">
        <div className="sticky top-0 bg-[#F2F2F7]/80 ios-blur p-6 flex justify-between items-center z-10">
          <h3 className="text-xl font-black text-slate-900">{title}</h3>
          <button onClick={onClose} className="bg-white p-2 rounded-full shadow-sm" type="button">
            <X size={20} />
          </button>
        </div>
        <div className="px-6">{children}</div>
      </div>
    </div>
  );
};

// -----------------------------
//  ONBOARDING
// -----------------------------
const OnboardingFlow = ({ onFinish }) => {
  const [step, setStep] = useState('welcome'); // welcome, profile_type, form, optional, first_experience
  const [profileType, setProfileType] = useState(null); // patient, caregiver, professional
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    birthDate: '',
    password: '',
  });

  const nextStep = (next) => setStep(next);

  if (step === 'welcome') {
    return (
      <div className="h-full w-full overflow-y-auto">
        <div className="flex flex-col p-8 animate-in text-center justify-center min-h-full">
          <div className="mb-12 flex justify-center">
            <div className="w-24 h-24 bg-blue-600 rounded-[32px] flex items-center justify-center shadow-2xl shadow-blue-200">
              <Heart size={48} className="text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-black text-slate-900 mb-4 leading-tight">Seu app de autogestão de saúde</h1>
          <p className="text-slate-500 text-lg mb-12">
            Organize seus tratamentos, acompanhe sua saúde e compartilhe informações com quem cuida de você.
          </p>
          <div className="space-y-4">
            <Button fullWidth onClick={() => nextStep('profile_type')}>Criar conta</Button>
            <Button fullWidth variant="secondary" onClick={() => onFinish({ name: 'Carlos Silva', role: 'patient' })}>
              Já tenho conta
            </Button>
          </div>
          <div style={{ height: 32 }} />
        </div>
      </div>
    );
  }

  if (step === 'profile_type') {
    return (
      <div className="h-full w-full overflow-y-auto">
        <div className="p-8 animate-in min-h-full">
          <button onClick={() => setStep('welcome')} className="mb-8 p-2 bg-white rounded-full shadow-sm" type="button">
            <ChevronLeft size={24} />
          </button>

          <h2 className="text-2xl font-black text-slate-900 mb-2">Como você vai usar o app?</h2>
          <p className="text-slate-500 mb-8">Sua escolha define como o app irá funcionar para você.</p>

          <div className="space-y-4">
            {[
              { id: 'patient', title: 'Sou paciente', desc: 'Para gerenciar minha própria saúde.', icon: User },
              { id: 'caregiver', title: 'Sou acompanhante', desc: 'Rede de apoio para familiares.', icon: Users },
              { id: 'professional', title: 'Sou profissional', desc: 'Médico, nutricionista ou cuidador.', icon: Stethoscope },
            ].map((type) => (
              <button
                key={type.id}
                onClick={() => { setProfileType(type.id); nextStep('form'); }}
                className="w-full bg-white p-6 rounded-[28px] border-2 border-transparent hover:border-blue-600 transition-all flex items-center gap-4 text-left shadow-sm active:scale-95"
                type="button"
              >
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                  <type.icon size={24} />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-slate-900">{type.title}</h4>
                  <p className="text-xs text-slate-400">{type.desc}</p>
                </div>
                <ChevronRight className="text-slate-200" />
              </button>
            ))}
          </div>

          <div style={{ height: 32 }} />
        </div>
      </div>
    );
  }

  if (step === 'form') {
    return (
      <div className="h-full w-full overflow-y-auto">
        <div className="p-8 animate-in min-h-full pb-10">
          <button onClick={() => setStep('profile_type')} className="mb-8 p-2 bg-white rounded-full shadow-sm" type="button">
            <ChevronLeft size={24} />
          </button>

          <h2 className="text-2xl font-black text-slate-900 mb-2">Quase lá!</h2>
          <p className="text-slate-500 mb-8">Precisamos de alguns dados básicos para começar.</p>

          <div className="space-y-2">
            <Input
              label="Nome Completo"
              icon={User}
              placeholder="Seu nome aqui"
              value={formData.name}
              onChange={(e) => setFormData((s) => ({ ...s, name: e.target.value }))}
            />
            {profileType === 'professional' && (
              <Input label="Profissão / Registro" icon={Stethoscope} placeholder="Ex: Médico CRM 12345" />
            )}
            <Input
              label="Data de Nascimento"
              icon={Calendar}
              type="date"
              value={formData.birthDate}
              onChange={(e) => setFormData((s) => ({ ...s, birthDate: e.target.value }))}
            />
            <Input
              label="E-mail"
              icon={Mail}
              type="email"
              placeholder="seu@email.com"
              value={formData.email}
              onChange={(e) => setFormData((s) => ({ ...s, email: e.target.value }))}
            />
            <Input
              label="Celular (WhatsApp)"
              icon={Phone}
              type="tel"
              placeholder="(00) 00000-0000"
              value={formData.phone}
              onChange={(e) => setFormData((s) => ({ ...s, phone: e.target.value }))}
            />
            <Input
              label="Senha"
              icon={Lock}
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData((s) => ({ ...s, password: e.target.value }))}
            />

            <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-2xl mb-8">
              <input type="checkbox" className="mt-1 w-5 h-5 rounded-lg" defaultChecked />
              <p className="text-[10px] text-slate-500 leading-relaxed font-medium">
                Aceito os <b>Termos de Uso</b> e a <b>Política de Privacidade</b> do app VIVERCOM.
              </p>
            </div>

            <Button
              fullWidth
              onClick={() => profileType === 'patient' ? nextStep('optional') : onFinish({ name: formData.name || 'Novo Usuário', role: profileType })}
              disabled={!formData.name}
            >
              Criar minha conta
            </Button>
          </div>

          <div style={{ height: 32 }} />
        </div>
      </div>
    );
  }

  if (step === 'optional') {
    return (
      <div className="h-full w-full overflow-y-auto">
        <div className="p-8 animate-in text-center flex flex-col justify-center min-h-full">
          <h2 className="text-2xl font-black text-slate-900 mb-2">Personalize sua experiência</h2>
          <p className="text-slate-500 mb-8">Isso nos ajuda a preparar o app para você.</p>

          <Card className="mb-8 text-left space-y-6">
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">
                Você possui condições crônicas?
              </label>
              <div className="flex flex-wrap gap-2">
                {['Diabetes', 'Hipertensão', 'Obesidade', 'Asma'].map((c) => (
                  <button key={c} className="px-4 py-2 rounded-full border border-slate-200 text-xs font-bold text-slate-600" type="button">
                    {c}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-slate-700">Faz uso de remédios contínuos?</span>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-slate-100 rounded-xl text-xs font-black" type="button">NÃO</button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-black" type="button">SIM</button>
              </div>
            </div>
          </Card>

          <div className="space-y-4">
            <Button fullWidth onClick={() => nextStep('first_experience')}>Continuar</Button>
            <button onClick={() => nextStep('first_experience')} className="text-slate-400 font-bold text-sm" type="button">
              Pular por enquanto
            </button>
          </div>

          <div style={{ height: 32 }} />
        </div>
      </div>
    );
  }

  if (step === 'first_experience') {
    return (
      <div className="h-full w-full overflow-y-auto">
        <div className="p-8 animate-in flex flex-col min-h-full">
          <div className="flex-1 flex flex-col justify-center">
            <h2 className="text-3xl font-black text-slate-900 mb-8">Tudo pronto! 🚀</h2>
            <div className="space-y-4">
              {[
                { icon: Pill, title: 'Cadastre seus medicamentos', desc: 'Nunca mais esqueça uma dose.' },
                { icon: Bell, title: 'Ative lembretes e alertas', desc: 'Notificações direto no seu celular.' },
                { icon: Users, title: 'Convide sua rede de apoio', desc: 'Compartilhe sua jornada com quem ama.' },
              ].map((item, i) => (
                <div key={i} className="flex gap-4 p-5 bg-white rounded-3xl border border-slate-100">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shrink-0">
                    <item.icon size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{item.title}</h4>
                    <p className="text-xs text-slate-400">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Button fullWidth onClick={() => onFinish({ name: formData.name || 'Novo Usuário', role: 'patient' })} className="mt-8">
            Começar agora
          </Button>

          <div style={{ height: 32 }} />
        </div>
      </div>
    );
  }

  return null;
};

// -----------------------------
//  TABS
// -----------------------------
const TabHome = ({ user }) => {
  const [feeling, setFeeling] = useState(null);
  const [isAddMedModalOpen, setIsAddMedModalOpen] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  const simulateNotification = () => {
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 8000);
  };

  return (
    <div className="p-6 animate-in">
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
              <button className="flex-1 bg-blue-600 text-white py-2.5 rounded-xl font-bold text-sm" onClick={() => setShowNotification(false)} type="button">
                Marcar como tomado
              </button>
              <button className="px-4 bg-slate-100 text-slate-600 py-2.5 rounded-xl font-bold text-sm" onClick={() => setShowNotification(false)} type="button">
                Adiar
              </button>
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
          <button onClick={simulateNotification} className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100" type="button">
            <Zap size={20} className="text-yellow-500" />
          </button>
          <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 relative">
            <Bell size={24} className="text-slate-600" />
            <span className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </div>
        </div>
      </header>

      <Card className="mb-6 border-none shadow-md">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 text-left">Sentimento Hoje</p>
        <div className="flex justify-around items-center">
          {[
            { id: 'sad', icon: Frown, label: 'Mal', color: 'text-red-500' },
            { id: 'neutral', icon: Meh, label: 'Bem', color: 'text-yellow-500' },
            { id: 'happy', icon: Smile, label: 'Ótimo', color: 'text-green-500' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setFeeling(item.id)}
              className={`flex flex-col items-center gap-2 p-4 rounded-[22px] transition-all ${feeling === item.id ? 'bg-slate-50 scale-105' : 'opacity-40'}`}
              type="button"
            >
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
            { name: 'Losartana', dose: '50mg', time: '12:00', icon: Pill, status: 'pendente' },
            { name: 'Dr. Roberto Silva', dose: 'Cardiologista', time: '14:30', icon: Stethoscope, status: 'agendado' },
          ].map((item, i) => (
            <div key={i} className="bg-white p-4 rounded-[22px] flex items-center gap-4 shadow-sm border border-slate-100">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${item.status === 'pendente' ? 'bg-blue-50 text-blue-600' : 'bg-slate-50 text-slate-400'}`}>
                <item.icon size={20} />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-slate-800 text-sm">{item.name}</h4>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                  {item.dose} • {item.time}
                </p>
              </div>
              <button className="w-8 h-8 rounded-full border-2 border-slate-100 flex items-center justify-center text-slate-300 active:bg-blue-600 active:text-white transition-colors" type="button">
                <Check size={16} strokeWidth={3} />
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="text-left mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-black text-slate-900 text-lg">Próximas Consultas</h3>
          <button className="text-blue-600 text-xs font-bold" type="button">Ver Calendário</button>
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
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">
                    {appt.specialty} • {appt.time}
                  </p>
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
            <p className="text-xs text-blue-800 font-medium">
              Alertas automáticos via <b>Push</b> e <b>WhatsApp</b> serão ativados.
            </p>
          </div>
          <Button fullWidth className="mt-4" onClick={() => setIsAddMedModalOpen(false)}>Salvar Medicamento</Button>
        </div>
      </Modal>
    </div>
  );
};

const TabAgenda = () => {
  const [selectedDay, setSelectedDay] = useState(16);
  const days = [14, 15, 16, 17, 18, 19, 20];

  return (
    <div className="p-6 text-left animate-in">
      <h1 className="text-2xl font-black text-slate-900 mb-2">Agenda</h1>
      <p className="text-sm text-slate-500 mb-6">Sua programação completa de saúde.</p>

      <div className="flex justify-between mb-8 overflow-x-auto pb-2">
        {days.map((day) => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            className={`flex flex-col items-center gap-1 min-w-[44px] py-3 rounded-2xl transition-all ${
              selectedDay === day ? 'bg-blue-600 text-white shadow-lg' : 'bg-white text-slate-400 border border-slate-100'
            }`}
            type="button"
          >
            <span className="text-[8px] font-black uppercase tracking-tighter opacity-70">Jan</span>
            <span className="text-sm font-black">{day}</span>
          </button>
        ))}
      </div>

      <div className="space-y-6">
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Clock size={16} className="text-blue-600" />
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Cronograma de hoje</h3>
          </div>

          <div className="space-y-4 border-l-2 border-slate-100 ml-2 pl-6 relative">
            {[
              { time: '08:00', title: 'Medicamento', desc: 'Losartana 50mg', icon: Pill, color: 'text-blue-600', bg: 'bg-blue-50' },
              { time: '10:00', title: 'Consulta', desc: 'Dra. Aline (Nutri)', icon: User, color: 'text-indigo-600', bg: 'bg-indigo-50' },
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

      <Button fullWidth variant="secondary" className="mt-8">
        <Plus size={20} /> Adicionar Compromisso
      </Button>
    </div>
  );
};

const TabCompartilhamento = () => {
  const [inviteMode, setInviteMode] = useState(false);

  const shareViaWhatsApp = () => {
    const text = encodeURIComponent(
      'Olá! Estou te convidando para fazer parte da minha rede de apoio no VIVERCOM. Toque no link para aceitar: https://vivercom.app/invite/token123'
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  return (
    <div className="p-6 text-left animate-in">
      <h1 className="text-2xl font-black text-slate-900 mb-2">Compartilhamento</h1>
      <p className="text-sm text-slate-500 mb-8">Gerencie quem pode acompanhar sua saúde.</p>

      {!inviteMode ? (
        <div className="space-y-6">
          <Button fullWidth onClick={() => setInviteMode(true)} variant="secondary">
            <Share2 size={20} /> Convidar nova pessoa
          </Button>

          <section>
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Rede de Apoio (2)</h3>
            <div className="space-y-3">
              {[
                { name: 'Maria Silva', role: 'Esposa', status: 'Aceito' },
                { name: 'João Carlos', role: 'Filho', status: 'Pendente' },
              ].map((p, i) => (
                <div key={i} className="bg-white p-4 rounded-[22px] flex items-center gap-4 border border-slate-100">
                  <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 font-bold">{p.name[0]}</div>
                  <div className="flex-1">
                    <h4 className="font-bold text-slate-800 text-sm">{p.name}</h4>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">{p.role}</p>
                  </div>
                  <span
                    className={`text-[10px] font-black px-2 py-1 rounded-lg uppercase ${
                      p.status === 'Aceito' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                    }`}
                  >
                    {p.status}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Médicos & Profissionais (1)</h3>
            <div className="bg-white p-4 rounded-[22px] flex items-center gap-4 border border-slate-100">
              <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">R</div>
              <div className="flex-1">
                <h4 className="font-bold text-slate-800 text-sm">Dr. Roberto Silva</h4>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Cardiologista</p>
              </div>
              <button className="text-slate-300" type="button"><Settings size={18} /></button>
            </div>
          </section>
        </div>
      ) : (
        <div className="animate-in">
          <button onClick={() => setInviteMode(false)} className="flex items-center gap-2 text-blue-600 font-bold text-sm mb-6" type="button">
            <ChevronLeft size={16} /> Voltar
          </button>

          <Card className="mb-6">
            <h4 className="font-black text-slate-900 mb-4 text-lg text-center">Configurar Permissões</h4>
            <div className="space-y-4">
              {[
                { label: 'Resultados de Exames', desc: 'Permite ver laudos e imagens', default: true },
                { label: 'Agenda de Medicamentos', desc: 'Permite acompanhar se tomou', default: true },
                { label: 'Cadastro de Consultas', desc: 'Pode criar/editar consultas', default: false },
                { label: 'Sinais Vitais', desc: 'Peso, Pressão, Glicemia', default: true },
              ].map((perm, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                  <div className="flex-1 pr-4">
                    <p className="font-bold text-slate-800 text-sm">{perm.label}</p>
                    <p className="text-[10px] text-slate-400 font-medium">{perm.desc}</p>
                  </div>
                  <div className={`w-12 h-6 rounded-full relative p-1 transition-colors ${perm.default ? 'bg-blue-600' : 'bg-slate-200'}`}>
                    <div className={`w-4 h-4 bg-white rounded-full transition-all ${perm.default ? 'ml-6' : 'ml-0'}`}></div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <div className="space-y-3">
            <Button fullWidth onClick={shareViaWhatsApp} className="bg-[#25D366] border-none">
              Enviar Convite via WhatsApp
            </Button>
            <p className="text-[10px] text-center text-slate-400 font-bold uppercase">Ou compartilhe o link direto</p>
            <div className="flex gap-2">
              <div className="flex-1 bg-white border border-slate-200 p-4 rounded-2xl text-[10px] font-mono text-slate-400 truncate">
                vivercom.app/invite/token123...
              </div>
              <button className="bg-slate-200 p-4 rounded-2xl text-slate-600" type="button">
                <ClipboardList size={20} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const TabSaudeHistorico = () => {
  return (
    <div className="p-6 text-left animate-in">
      <header className="mb-8">
        <h1 className="text-2xl font-black text-slate-900 mb-2">Meu Histórico</h1>
        <p className="text-sm text-slate-500">Acompanhamento e evolução da sua saúde.</p>
      </header>

      <Card className="mb-6 overflow-hidden border-none shadow-md bg-gradient-to-br from-white to-slate-50">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Aderência Geral</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900">88%</span>
              <span className="text-[10px] font-bold text-green-500 bg-green-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                <ArrowUpRight size={10} /> +12%
              </span>
            </div>
          </div>
          <div className="bg-blue-100 p-2.5 rounded-2xl text-blue-600">
            <Activity size={20} />
          </div>
        </div>

        <div className="flex items-end justify-between h-16 gap-1 mb-4">
          {[40, 65, 45, 80, 55, 90, 88].map((h, i) => (
            <div
              key={i}
              style={{ height: `${h}%` }}
              className={`flex-1 rounded-t-lg transition-all ${i === 6 ? 'bg-blue-600' : 'bg-blue-100 opacity-60'}`}
            ></div>
          ))}
        </div>

        <div className="flex justify-between text-[8px] font-black text-slate-300 uppercase px-1">
          <span>Seg</span><span>Ter</span><span>Qua</span><span>Qui</span><span>Sex</span><span>Sáb</span><span>Hoje</span>
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white p-5 rounded-[28px] border border-slate-100 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-xl bg-red-50 text-red-500 flex items-center justify-center"><Heart size={16} /></div>
            <span className="text-[9px] font-black text-slate-400 uppercase">Pressão</span>
          </div>
          <p className="text-xl font-black text-slate-900">12/8</p>
          <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">Normal • Há 2h</p>
        </div>

        <div className="bg-white p-5 rounded-[28px] border border-slate-100 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center"><Droplets size={16} /></div>
            <span className="text-[9px] font-black text-slate-400 uppercase">Glicemia</span>
          </div>
          <p className="text-xl font-black text-slate-900">
            94 <small className="text-[10px] opacity-40 uppercase">mg/dL</small>
          </p>
          <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">Em jejum</p>
        </div>

        <div className="bg-white p-5 rounded-[28px] border border-slate-100 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center"><Scale size={16} /></div>
            <span className="text-[9px] font-black text-slate-400 uppercase">Peso</span>
          </div>
          <p className="text-xl font-black text-slate-900">
            72.4 <small className="text-[10px] opacity-40 uppercase">kg</small>
          </p>
          <p className="text-[9px] font-bold text-green-500 mt-1 uppercase tracking-tighter">-0.5kg este mês</p>
        </div>

        <div className="bg-white p-5 rounded-[28px] border border-slate-100 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-500 flex items-center justify-center"><Thermometer size={16} /></div>
            <span className="text-[9px] font-black text-slate-400 uppercase">Temp.</span>
          </div>
          <p className="text-xl font-black text-slate-900">36.6°C</p>
          <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">Estável</p>
        </div>
      </div>

      <section>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-black text-slate-900 text-lg">Últimos Resultados</h3>
          <button className="text-blue-600 text-[10px] font-black uppercase tracking-widest" type="button">Ver Tudo</button>
        </div>
        <div className="space-y-3">
          {[
            { name: 'Hemograma Completo', date: '12 Dez 2024', status: 'Normal', icon: ClipboardList, color: 'text-blue-500' },
            { name: 'Colesterol Total', date: '05 Dez 2024', status: 'Atenção', icon: AlertCircle, color: 'text-orange-500' },
          ].map((item, i) => (
            <div key={i} className="bg-white p-4 rounded-3xl border border-slate-100 flex items-center gap-4 shadow-sm">
              <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center">
                <item.icon size={20} className={item.color} />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-slate-800 text-sm">{item.name}</h4>
                <p className="text-[10px] font-bold text-slate-400 uppercase">{item.date}</p>
              </div>
              <span className={`text-[9px] font-black px-3 py-1.5 rounded-full uppercase ${item.status === 'Normal' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

// -----------------------------
//  APP ROOT (with iOS-safe nav)
// -----------------------------
export default function App() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('home');

  if (!user) {
    return (
      <AppShell>
        <GlobalStyles />
        <OnboardingFlow onFinish={(userData) => setUser(userData)} />
      </AppShell>
    );
  }

  return (
    <AppShell>
      <GlobalStyles />

      {/* Layout interno: scroll do conteúdo + nav ancorada */}
      <div className="relative w-full h-full flex flex-col">
        {/* Área rolável */}
        <div className="flex-1 overflow-y-auto" style={{ WebkitOverflowScrolling: 'touch', paddingBottom: 120 }}>
          {activeTab === 'home' && <TabHome user={user} />}
          {activeTab === 'agenda' && <TabAgenda />}
          {activeTab === 'compartilhar' && <TabCompartilhamento />}
          {activeTab === 'historico' && <TabSaudeHistorico />}
          {activeTab === 'perfil' && (
            <div className="p-6 text-left animate-in">
              <h1 className="text-2xl font-black text-slate-900 mb-8">Meu Perfil</h1>

              <Card className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-blue-100 rounded-[22px] flex items-center justify-center text-blue-600 font-black text-xl">
                  {user.name.split(' ').map((n) => n[0]).join('')}
                </div>
                <div>
                  <h4 className="font-bold text-lg text-slate-900">{user.name}</h4>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    {user.role === 'patient' ? 'Paciente Ativo' : user.role === 'caregiver' ? 'Acompanhante' : 'Profissional'}
                  </p>
                </div>
              </Card>

              <div className="space-y-4">
                <section>
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Dados de Saúde</h3>
                  <div className="space-y-2">
                    <button className="w-full p-5 bg-white rounded-2xl flex items-center justify-between border border-slate-100 font-bold text-slate-700" type="button">
                      <div className="flex items-center gap-3">
                        <ClipboardList size={20} className="text-blue-500" /> Condições & Alergias
                      </div>
                      <ChevronRight size={18} className="text-slate-200" />
                    </button>
                    <button className="w-full p-5 bg-white rounded-2xl flex items-center justify-between border border-slate-100 font-bold text-slate-700" type="button">
                      <div className="flex items-center gap-3">
                        <TrendingUp size={20} className="text-green-500" /> Objetivos no App
                      </div>
                      <ChevronRight size={18} className="text-slate-200" />
                    </button>
                  </div>
                </section>

                <section>
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Configurações</h3>
                  <div className="space-y-2">
                    <button className="w-full p-5 bg-white rounded-2xl flex items-center justify-between border border-slate-100 font-bold text-slate-700" type="button">
                      <div className="flex items-center gap-3">
                        <ShieldCheck size={20} className="text-slate-400" /> Privacidade
                      </div>
                      <ChevronRight size={18} className="text-slate-200" />
                    </button>
                    <button className="w-full p-5 bg-white rounded-2xl flex items-center justify-between border border-slate-100 font-bold text-slate-700" type="button">
                      <div className="flex items-center gap-3">
                        <Bell size={20} className="text-slate-400" /> Notificações
                      </div>
                      <ChevronRight size={18} className="text-slate-200" />
                    </button>
                  </div>
                </section>

                <Button fullWidth variant="danger" className="mt-8" onClick={() => setUser(null)}>
                  Encerrar Sessão
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* NAV: absolute dentro do AppShell (evita “pulo” no iPhone) */}
        <nav className="absolute bottom-0 left-0 right-0 bg-white/90 ios-blur border-t border-slate-100 p-4 px-6 flex justify-around items-center z-[50] rounded-t-[36px] shadow-2xl safe-area-bottom">
          {[
            { id: 'home', icon: Home, label: 'Início' },
            { id: 'agenda', icon: Calendar, label: 'Agenda' },
            { id: 'historico', icon: History, label: 'Saúde' },
            { id: 'compartilhar', icon: Users, label: 'Rede' },
            { id: 'perfil', icon: User, label: 'Perfil' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center gap-1 transition-all ${activeTab === item.id ? 'text-blue-600 scale-110' : 'text-slate-300'}`}
              type="button"
            >
              <item.icon size={22} strokeWidth={activeTab === item.id ? 2.5 : 2} />
              <span className="text-[9px] font-black uppercase tracking-tighter">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </AppShell>
  );
}

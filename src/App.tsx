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

// --- FLUXO DE ONBOARDING / CADASTRO ---

const OnboardingFlow = ({ onFinish, initialStep = 'welcome' }) => {
  const [step, setStep] = useState(initialStep);
  const [profileType, setProfileType] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', birthDate: '', password: '', role: '' });

  const nextStep = (next) => setStep(next);

  if (step === 'welcome') {
    return (
      <div className="flex-1 flex flex-col p-8 animate-in text-center justify-center min-h-screen">
        <div className="mb-12 flex justify-center">
          <div className="w-24 h-24 bg-blue-600 rounded-[32px] flex items-center justify-center shadow-2xl shadow-blue-200">
            <Heart size={48} className="text-white" />
          </div>
        </div>
        <h1 className="text-4xl font-black text-slate-900 mb-4 leading-tight">Seu app de autogestão de saúde</h1>
        <p className="text-slate-500 text-lg mb-12">Organize seus tratamentos, acompanhe sua saúde e compartilhe informações com quem cuida de você.</p>
        <div className="space-y-4">
          <Button fullWidth onClick={() => nextStep('profile_type')}>Criar conta</Button>
          <Button fullWidth variant="secondary" onClick={() => onFinish({ name: 'Carlos Silva', role: 'patient' })}>Já tenho conta</Button>
        </div>
      </div>
    );
  }

  if (step === 'profile_type') {
    return (
      <div className="p-8 animate-in min-h-screen">
        <button onClick={() => setStep('welcome')} className="mb-8 p-2 bg-white rounded-full shadow-sm"><ChevronLeft size={24} /></button>
        <h2 className="text-2xl font-black text-slate-900 mb-2">Como você vai usar o app?</h2>
        <p className="text-slate-500 mb-8">Sua escolha define como o app irá funcionar para você.</p>
        
        <div className="space-y-4">
          {[
            { id: 'patient', title: 'Sou paciente', desc: 'Para gerenciar minha própria saúde.', icon: User },
            { id: 'caregiver', title: 'Sou acompanhante', desc: 'Rede de apoio para familiares.', icon: Users },
            { id: 'professional', title: 'Sou profissional', desc: 'Médico, nutricionista ou cuidador.', icon: Stethoscope }
          ].map((type) => (
            <button 
              key={type.id}
              onClick={() => { setProfileType(type.id); nextStep('form'); }}
              className="w-full bg-white p-6 rounded-[28px] border-2 border-transparent hover:border-blue-600 transition-all flex items-center gap-4 text-left shadow-sm active:scale-95"
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
      </div>
    );
  }

  if (step === 'form') {
    return (
      <div className="p-8 animate-in min-h-screen pb-20">
        <button onClick={() => setStep('profile_type')} className="mb-8 p-2 bg-white rounded-full shadow-sm"><ChevronLeft size={24} /></button>
        <h2 className="text-2xl font-black text-slate-900 mb-2">Quase lá!</h2>
        <p className="text-slate-500 mb-8">Precisamos de alguns dados básicos para começar.</p>
        
        <div className="space-y-2">
          <Input label="Nome Completo" icon={User} placeholder="Seu nome aqui" />
          {profileType === 'professional' && <Input label="Profissão / Registro" icon={Stethoscope} placeholder="Ex: Médico CRM 12345" />}
          <Input label="Data de Nascimento" icon={Calendar} type="date" />
          <Input label="E-mail" icon={Mail} type="email" placeholder="seu@email.com" />
          <Input label="Celular (WhatsApp)" icon={Phone} type="tel" placeholder="(00) 00000-0000" />
          <Input label="Senha" icon={Lock} type="password" placeholder="••••••••" />
          
          <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-2xl mb-8">
            <input type="checkbox" className="mt-1 w-5 h-5 rounded-lg" defaultChecked />
            <p className="text-[10px] text-slate-500 leading-relaxed font-medium">Aceito os <b>Termos de Uso</b> e a <b>Política de Privacidade</b> do app VIVERCOM.</p>
          </div>

          <Button fullWidth onClick={() => profileType === 'patient' ? nextStep('optional') : onFinish({ name: 'Novo Usuário', role: profileType })}>
            Finalizar Cadastro
          </Button>
        </div>
      </div>
    );
  }

  if (step === 'optional') {
    return (
      <div className="p-8 animate-in min-h-screen text-center flex flex-col justify-center">
        <h2 className="text-2xl font-black text-slate-900 mb-2">Personalize sua experiência</h2>
        <p className="text-slate-500 mb-8">Isso nos ajuda a preparar o app para você.</p>
        
        <Card className="mb-8 text-left space-y-6">
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Você possui condições crônicas?</label>
            <div className="flex flex-wrap gap-2">
              {['Diabetes', 'Hipertensão', 'Obesidade', 'Asma'].map(c => (
                <button key={c} className="px-4 py-2 rounded-full border border-slate-200 text-xs font-bold text-slate-600">{c}</button>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-slate-700">Faz uso de remédios contínuos?</span>
            <div className="flex gap-2">
               <button className="px-4 py-2 bg-slate-100 rounded-xl text-xs font-black">NÃO</button>
               <button className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-black">SIM</button>
            </div>
          </div>
        </Card>

        <div className="space-y-4">
          <Button fullWidth onClick={() => nextStep('first_experience')}>Continuar</Button>
          <button onClick={() => nextStep('first_experience')} className="text-slate-400 font-bold text-sm">Pular por enquanto</button>
        </div>
      </div>
    );
  }

  if (step === 'first_experience') {
    return (
      <div className="p-8 animate-in min-h-screen flex flex-col">
        <div className="flex-1 flex flex-col justify-center">
           <h2 className="text-3xl font-black text-slate-900 mb-8">Tudo pronto! 🚀</h2>
           <div className="space-y-4">
             {[
               { icon: Pill, title: 'Cadastre seus medicamentos', desc: 'Nunca mais esqueça uma dose.' },
               { icon: Bell, title: 'Ative lembretes e alertas', desc: 'Notificações direto no seu celular.' },
               { icon: Users, title: 'Convide sua rede de apoio', desc: 'Compartilhe sua jornada com quem ama.' }
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
        <Button fullWidth onClick={() => onFinish({ name: 'Novo Usuário', role: 'patient' })} className="mt-8">Começar agora</Button>
      </div>
    );
  }
};

// --- TELAS DO APP (DASHBOARD) ---

const TabHome = ({ user }) => {
  const [feeling, setFeeling] = useState(null);
  const [isAddMedModalOpen, setIsAddMedModalOpen] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  const simulateNotification = () => {
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 8000);
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
            { name: 'Losartana', dose: '50mg', time: '12:00', icon: Pill, status: 'pendente' },
            { name: 'Dr. Roberto Silva', dose: 'Cardiologista', time: '14:30', icon: Stethoscope, status: 'agendado' },
          ].map((item, i) => (
            <div key={i} className="bg-white p-4 rounded-[22px] flex items-center gap-4 shadow-sm border border-slate-100">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${item.status === 'pendente' ? 'bg-blue-50 text-blue-600' : 'bg-slate-50 text-slate-400'}`}><item.icon size={20} /></div>
              <div className="flex-1">
                <h4 className="font-bold text-slate-800 text-sm">{item.name}</h4>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{item.dose} • {item.time}</p>
              </div>
              <button className="w-8 h-8 rounded-full border-2 border-slate-100 flex items-center justify-center text-slate-300 active:bg-blue-600 active:text-white transition-colors">
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

const TabAgenda = () => {
  const [selectedDay, setSelectedDay] = useState(16);
  const [modalType, setModalType] = useState(null); // 'med', 'appt', 'exam'
  const days = [14, 15, 16, 17, 18, 19, 20];

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

      {/* Botões de Ação Rápida */}
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
            <Input label="Data" icon={Calendar} type="date" />
            <Input label="Hora" icon={Clock} type="time" />
          </div>
          <Input label="Preparo Necessário" icon={Info} placeholder="Ex: Jejum de 8 horas" />
          <Button fullWidth onClick={() => setModalType(null)}>Agendar Exame</Button>
        </div>
      </Modal>
    </div>
  );
};

const TabCompartilhamento = () => {
  const [inviteMode, setInviteMode] = useState(false);
  
  const shareViaWhatsApp = () => {
    const text = encodeURIComponent("Olá! Estou te convidando para fazer parte da minha rede de apoio no VIVERCOM. Toque no link para aceitar: https://vivercom.app/invite/token123");
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  return (
    <div className="p-6 text-left animate-in pb-32">
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
                { name: 'João Carlos', role: 'Filho', status: 'Pendente' }
              ].map((p, i) => (
                <div key={i} className="bg-white p-4 rounded-[22px] flex items-center gap-4 border border-slate-100">
                  <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 font-bold">{p.name[0]}</div>
                  <div className="flex-1">
                    <h4 className="font-bold text-slate-800 text-sm">{p.name}</h4>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">{p.role}</p>
                  </div>
                  <span className={`text-[10px] font-black px-2 py-1 rounded-lg uppercase ${p.status === 'Aceito' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>{p.status}</span>
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
              <button className="text-slate-300"><Settings size={18}/></button>
            </div>
          </section>
        </div>
      ) : (
        <div className="animate-in">
          <button onClick={() => setInviteMode(false)} className="flex items-center gap-2 text-blue-600 font-bold text-sm mb-6"><ChevronLeft size={16}/> Voltar</button>
          
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
                <div className="flex-1 bg-white border border-slate-200 p-4 rounded-2xl text-[10px] font-mono text-slate-400 truncate">vivercom.app/invite/token123...</div>
                <button className="bg-slate-200 p-4 rounded-2xl text-slate-600"><ClipboardList size={20}/></button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

const TabSaudeHistorico = () => {
  return (
    <div className="p-6 text-left animate-in pb-32">
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
          <p className="text-xl font-black text-slate-900">94 <small className="text-[10px] opacity-40 uppercase">mg/dL</small></p>
          <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">Em jejum</p>
        </div>

        <div className="bg-white p-5 rounded-[28px] border border-slate-100 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center"><Scale size={16} /></div>
            <span className="text-[9px] font-black text-slate-400 uppercase">Peso</span>
          </div>
          <p className="text-xl font-black text-slate-900">72.4 <small className="text-[10px] opacity-40 uppercase">kg</small></p>
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
          <button className="text-blue-600 text-[10px] font-black uppercase tracking-widest">Ver Tudo</button>
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

const TabPerfil = ({ user, setUser, onEditProfile }) => {
  const [goals, setGoals] = useState([]);

  // ✅ NOVO: Permissões de acesso (somente aqui no Perfil)
  const [accessPerms, setAccessPerms] = useState({
    exams_all: true,            // Resultados de exames (todos)
    exams_selected: false,      // Resultados de exames (selecionar)
    meds_agenda: true,          // Agenda de medicamentos
    appointments_manage: false, // Cadastro de consultas
    basic_health_share: true,   // Compartilhar dados básicos de saúde
  });
  const [selectedExams, setSelectedExams] = useState(['Hemograma Completo']); // exemplo

  const toggleAccessPerm = (key) => setAccessPerms(prev => ({ ...prev, [key]: !prev[key] }));

  const toggleExamItem = (name) => {
    setSelectedExams(prev => prev.includes(name) ? prev.filter(x => x !== name) : [...prev, name]);
  };
  
  const toggleGoal = (id) => {
    if (goals.includes(id)) setGoals(goals.filter(g => g !== id));
    else setGoals([...goals, id]);
  };

  const isPatient = user.role === 'patient';
  const isCaregiver = user.role === 'caregiver' || user.role === 'professional';

  return (
    <div className="p-6 text-left animate-in pb-32">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-black text-slate-900">Perfil</h1>
        <button onClick={() => setUser(null)} className="text-red-500 p-2 rounded-xl bg-red-50 active:scale-90 transition-all">
          <LogOut size={20} />
        </button>
      </div>
      
      {/* 1. DADOS DO PERFIL */}
      <section className="mb-8 text-center">
        <div className="flex flex-col items-center mb-6">
          <div className="relative mb-4">
            <div className="w-24 h-24 bg-blue-100 rounded-[32px] flex items-center justify-center text-blue-600 font-black text-3xl shadow-inner border-2 border-white">
              {user.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="absolute -bottom-1 -right-1 bg-white p-2 rounded-xl shadow-md border border-slate-100 text-blue-600">
              <ShieldCheck size={16} />
            </div>
          </div>
          <h2 className="text-xl font-black text-slate-900">{user.name}</h2>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{user.role === 'patient' ? 'Paciente' : 'Acompanhante'}</p>
        </div>

        <Button fullWidth onClick={onEditProfile} variant="secondary" className="border-blue-100 text-blue-600 h-16">
          <Edit3 size={18} /> Completar / Editar Cadastro
        </Button>
      </section>

      {/* 2. OBJETIVOS NO APP (Apenas Paciente) */}
      {isPatient && (
        <section className="mb-8">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 px-1">Meus Objetivos</h3>
          <div className="space-y-3">
            {[
              { id: 'meds', label: 'Organizar meus medicamentos', icon: Pill },
              { id: 'exams', label: 'Acompanhar exames e resultados', icon: ClipboardList },
              { id: 'share', label: 'Compartilhar dados com rede de apoio', icon: Users },
              { id: 'pro', label: 'Compartilhar dados com médicos', icon: Stethoscope },
              { id: 'adherence', label: 'Melhorar adesão ao tratamento', icon: Target },
            ].map((goal) => (
              <button 
                key={goal.id}
                onClick={() => toggleGoal(goal.id)}
                className={`w-full p-4 rounded-2xl border flex items-center gap-4 transition-all text-left ${goals.includes(goal.id) ? 'bg-blue-50 border-blue-200' : 'bg-white border-slate-100'}`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${goals.includes(goal.id) ? 'bg-blue-600 text-white' : 'bg-slate-50 text-slate-400'}`}>
                   <goal.icon size={20} />
                </div>
                <span className={`text-sm font-bold ${goals.includes(goal.id) ? 'text-blue-900' : 'text-slate-600'}`}>{goal.label}</span>
                {goals.includes(goal.id) && <Check size={18} className="ml-auto text-blue-600" />}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* ✅ 3. PERMISSÕES DE ACESSO (NOVO - APENAS PERFIL) */}
      <section className="mb-8">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 px-1">Permissões de Acesso</h3>

        <Card className="p-4">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shrink-0">
              <UserCheck size={20} />
            </div>
            <div className="flex-1">
              <p className="font-black text-slate-900 text-sm">Controle o que sua rede pode ver</p>
              <p className="text-[10px] text-slate-400 font-medium">
                Você define o nível de acesso para acompanhantes e profissionais.
              </p>
            </div>
          </div>

          {/* switches (mantendo o mesmo “estilo” do app) */}
          {[
            {
              key: 'exams_all',
              label: 'Resultados de exames',
              desc: 'Visualizar todos os exames',
              lockedBy: 'exams_selected',
            },
            {
              key: 'exams_selected',
              label: 'Resultados de exames',
              desc: 'Selecionar exames específicos',
              lockedBy: 'exams_all',
            },
            {
              key: 'meds_agenda',
              label: 'Agenda de medicamentos',
              desc: 'Ver rotina e marcações de tomada',
            },
            {
              key: 'appointments_manage',
              label: 'Cadastro de consultas',
              desc: 'Criar/editar consultas médicas',
            },
            {
              key: 'basic_health_share',
              label: 'Dados básicos de saúde',
              desc: 'Compartilhar peso, pressão, glicemia e temperatura',
            },
          ].map((perm, i) => {
            const isOn = !!accessPerms[perm.key];
            const isLocked =
              perm.lockedBy && accessPerms[perm.lockedBy] === true;

            return (
              <button
                key={perm.key}
                onClick={() => {
                  if (isLocked) return;

                  // lógica: "todos" vs "selecionar" não podem ficar ambos true ao mesmo tempo
                  if (perm.key === 'exams_all') {
                    setAccessPerms(prev => ({
                      ...prev,
                      exams_all: !prev.exams_all,
                      exams_selected: prev.exams_all ? prev.exams_selected : false,
                    }));
                    return;
                  }

                  if (perm.key === 'exams_selected') {
                    setAccessPerms(prev => ({
                      ...prev,
                      exams_selected: !prev.exams_selected,
                      exams_all: prev.exams_selected ? prev.exams_all : false,
                    }));
                    return;
                  }

                  toggleAccessPerm(perm.key);
                }}
                className="w-full flex items-center justify-between py-3 border-b border-slate-50 last:border-0 text-left active:scale-[0.99] transition-all"
                type="button"
              >
                <div className="flex-1 pr-4">
                  <p className={`font-bold text-sm ${isLocked ? 'text-slate-300' : 'text-slate-800'}`}>{perm.label}</p>
                  <p className={`text-[10px] font-medium ${isLocked ? 'text-slate-200' : 'text-slate-400'}`}>{perm.desc}</p>
                </div>

                <div className={`w-12 h-6 rounded-full relative p-1 transition-colors ${isOn ? 'bg-blue-600' : 'bg-slate-200'} ${isLocked ? 'opacity-40' : ''}`}>
                  <div className={`w-4 h-4 bg-white rounded-full transition-all ${isOn ? 'ml-6' : 'ml-0'}`}></div>
                </div>
              </button>
            );
          })}

          {/* se "selecionar exames" estiver ativo, mostra lista exemplo */}
          {accessPerms.exams_selected && !accessPerms.exams_all && (
            <div className="mt-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Exames liberados</p>
                <span className="text-[10px] font-black text-blue-600 uppercase">{selectedExams.length} selecionado(s)</span>
              </div>

              <div className="space-y-2">
                {[
                  'Hemograma Completo',
                  'Colesterol Total',
                  'Glicemia em jejum',
                  'TSH / T4',
                ].map((exam) => {
                  const active = selectedExams.includes(exam);
                  return (
                    <button
                      key={exam}
                      onClick={() => toggleExamItem(exam)}
                      className={`w-full p-3 rounded-2xl border flex items-center gap-3 transition-all text-left ${active ? 'bg-white border-blue-200' : 'bg-white/70 border-slate-200'}`}
                      type="button"
                    >
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${active ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                        <FileText size={16} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-slate-800">{exam}</p>
                        <p className="text-[10px] font-medium text-slate-400">Exemplo</p>
                      </div>
                      {active && <Check size={18} className="text-blue-600" />}
                    </button>
                  );
                })}
              </div>

              <div className="mt-4 flex items-center gap-3 p-3 bg-blue-50 rounded-2xl border border-blue-100">
                <Info size={16} className="text-blue-600" />
                <p className="text-[10px] text-blue-800 font-medium">
                  Dica: use “Selecionar exames específicos” quando quiser liberar só alguns laudos.
                </p>
              </div>
            </div>
          )}
        </Card>
      </section>

      {/* 3. REDE DE APOIO / PACIENTES */}
      <section className="mb-8">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 px-1">
          {isCaregiver ? 'Pacientes Vinculados' : 'Minha Rede de Apoio'}
        </h3>
        <div className="space-y-3">
           <div className="bg-white p-4 rounded-[22px] flex items-center gap-4 border border-slate-100 shadow-sm">
              <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center font-bold">
                {isCaregiver ? 'C' : 'M'}
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-slate-800 text-sm">{isCaregiver ? 'Carlos Silva' : 'Maria Silva'}</h4>
                <p className="text-[10px] font-black text-blue-600 uppercase">{isCaregiver ? 'Paciente Principal' : 'Esposa'}</p>
              </div>
              <button className="p-2 text-slate-300 active:text-blue-600 transition-colors">
                <Settings size={18} />
              </button>
           </div>
        </div>
      </section>

      <div className="mt-8 p-6 bg-blue-50 rounded-3xl border border-blue-100 text-center">
        <p className="text-[10px] font-black text-blue-800 uppercase tracking-widest mb-1">Dica de Saúde</p>
        <p className="text-xs text-blue-600 font-medium">Mantenha seus dados atualizados para uma melhor experiência com seu médico.</p>
      </div>
    </div>
  );
};

// --- COMPONENTE PRINCIPAL ---

export default function App() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('home');
  const [showEditFlow, setShowEditFlow] = useState(false);

  // Renderiza o fluxo de cadastro se não houver usuário ou se estiver editando perfil
  if (!user || showEditFlow) {
    return (
      <div className="min-h-screen bg-[#F2F2F7] max-w-md mx-auto relative overflow-hidden">
        <GlobalStyles />
        <OnboardingFlow 
          initialStep={showEditFlow ? 'profile_type' : 'welcome'} 
          onFinish={(userData) => {
            setUser(userData);
            setShowEditFlow(false);
            setActiveTab('perfil');
          }} 
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F2F2F7] max-w-md mx-auto relative overflow-hidden flex flex-col">
      <GlobalStyles />
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'home' && <TabHome user={user} />}
        {activeTab === 'agenda' && <TabAgenda />}
        {activeTab === 'historico' && <TabSaudeHistorico />}
        {activeTab === 'compartilhar' && <TabCompartilhamento />}
        {activeTab === 'perfil' && <TabPerfil 
          user={user} 
          setUser={setUser} 
          onEditProfile={() => setShowEditFlow(true)} 
        />}
      </div>

      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/90 backdrop-blur-lg border-t border-slate-100 p-4 px-6 flex justify-around items-center z-[50] rounded-t-[36px] shadow-2xl safe-area-bottom">
        {[
          { id: 'home', icon: Home, label: 'Início' },
          { id: 'agenda', icon: Calendar, label: 'Agenda' },
          { id: 'historico', icon: History, label: 'Saúde' },
          { id: 'compartilhar', icon: Users, label: 'Rede' },
          { id: 'perfil', icon: User, label: 'Perfil' },
        ].map(item => (
          <button 
            key={item.id} 
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center gap-1 transition-all ${activeTab === item.id ? 'text-blue-600 scale-110' : 'text-slate-300'}`}
          >
            <item.icon size={22} strokeWidth={activeTab === item.id ? 2.5 : 2} />
            <span className="text-[9px] font-black uppercase tracking-tighter">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

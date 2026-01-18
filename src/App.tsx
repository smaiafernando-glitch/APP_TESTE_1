import React, { useState, useEffect } from "react";
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
  Heart,
  ChevronLeft,
  Phone,
  Loader2,
  Check,
  Scale,
  Users,
  PlusCircle,
  Zap,
  ArrowUpRight,
  Smile,
  Meh,
  Frown,
  Stethoscope,
  ClipboardList,
  Pill,
  Mail,
  Lock,
  Search,
  TrendingUp,
  History,
  Info,
  Share2,
  X,
  AlertCircle,
  MessageSquare,
  Thermometer,
  Droplets,
  ArrowRight,
  ShieldCheck,
  UserCheck,
  Camera,
  Target,
  FileText,
  Edit3,
} from "lucide-react";

/* =========================================================
   ESTILOS GLOBAIS (mantido)
========================================================= */
const GlobalStyles = () => (
  <style
    dangerouslySetInnerHTML={{
      __html: `
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
  `,
    }}
  />
);

/* =========================================================
   COMPONENTES BASE (mantidos)
========================================================= */
const Card = ({ children, className = "", onClick }) => (
  <div
    onClick={onClick}
    className={`bg-white rounded-[28px] p-5 shadow-sm border border-slate-200 transition-all active:scale-[0.98] ${className}`}
  >
    {children}
  </div>
);

const Button = ({
  children,
  onClick,
  variant = "primary",
  fullWidth = false,
  disabled = false,
  loading = false,
  className = "",
}) => {
  const baseStyle =
    "h-14 px-6 rounded-2xl font-bold transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 shadow-sm";
  const variants = {
    primary: `bg-[#007AFF] text-white`,
    secondary: `bg-white text-[#007AFF] border border-slate-200`,
    danger: `bg-red-50 text-red-500 border border-red-100`,
    ghost: `bg-slate-100 text-slate-600`,
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseStyle} ${variants[variant]} ${
        fullWidth ? "w-full" : ""
      } ${className}`}
    >
      {loading ? <Loader2 className="animate-spin" /> : children}
    </button>
  );
};

const Input = ({ label, icon: Icon, type = "text", placeholder, value, onChange }) => (
  <div className="text-left w-full mb-4">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block px-1">
      {label}
    </label>
    <div className="relative">
      {Icon && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
          <Icon size={18} />
        </div>
      )}
      <input
        type={type}
        className={`w-full bg-white border border-slate-200 rounded-2xl p-4 ${
          Icon ? "pl-12" : "pl-4"
        } font-bold outline-none focus:border-blue-500 transition-colors`}
        placeholder={placeholder}
        value={value ?? ""}
        onChange={onChange}
      />
    </div>
  </div>
);

/* =========================================================
   MODAL (mantido)
========================================================= */
const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40 animate-in">
      <div className="bg-[#F2F2F7] w-full max-w-md rounded-t-[32px] sm:rounded-[32px] max-h-[90vh] overflow-y-auto pb-10">
        <div className="sticky top-0 bg-[#F2F2F7]/80 ios-blur p-6 flex justify-between items-center z-10">
          <h3 className="text-xl font-black text-slate-900">{title}</h3>
          <button
            onClick={onClose}
            className="bg-white p-2 rounded-full shadow-sm"
          >
            <X size={20} />
          </button>
        </div>
        <div className="px-6">{children}</div>
      </div>
    </div>
  );
};

/* =========================================================
   localStorage (adição técnica, sem mudar layout existente)
========================================================= */
const LS_KEYS = {
  treatments: "vivercom_treatments_v1",
  sharedPeople: "vivercom_shared_people_v1",
  cholesterol: "vivercom_cholesterol_v1",
  familyHistory: "vivercom_family_history_v1",
  user: "vivercom_user_v1",
};

const safeJsonParse = (val, fallback) => {
  try {
    return JSON.parse(val);
  } catch {
    return fallback;
  }
};

const todayKey = () => {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
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
  const ys = points.map((p) => Number(p.value || 0));

  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const rangeY = Math.max(1, maxY - minY);

  const scaleX = (x) => pad + (x * (w - pad * 2)) / Math.max(1, xs.length - 1);
  const scaleY = (y) => (h - pad) - ((y - minY) * (h - pad * 2)) / rangeY;

  const d = points
    .map((p, i) => {
      const x = scaleX(i);
      const y = scaleY(Number(p.value || 0));
      return `${i === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4">
      <svg width="100%" viewBox={`0 0 ${w} ${h}`} className="block">
        <path
          d={d}
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          className="text-blue-600"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        {points.map((p, i) => (
          <circle
            key={i}
            cx={scaleX(i)}
            cy={scaleY(Number(p.value || 0))}
            r="4"
            className="text-blue-600"
            fill="currentColor"
          />
        ))}
      </svg>
      <div className="flex justify-between mt-3 text-[9px] font-black text-slate-300 uppercase px-1">
        <span>{points[0]?.date || ""}</span>
        <span>{points[points.length - 1]?.date || ""}</span>
      </div>
    </div>
  );
};

/* =========================================================
   ONBOARDING / CADASTRO (já estava)
========================================================= */
const OnboardingFlow = ({ onFinish, initialStep = "welcome" }) => {
  const [step, setStep] = useState(initialStep);

  const [profileType, setProfileType] = useState("patient");
  const [basic, setBasic] = useState({
    name: "",
    cpf: "",
    birth: "",
    birthPlace: "",
    marital: "",
    address: "",
    phone: "",
    email: "",
    emergency: "",
  });
  const [routine, setRoutine] = useState({
    sex: "",
    height: "",
    weight: "",
    blood: "",
    diseases: "",
    habits: "",
    activity: "",
    work: "",
    independence: "",
    foodType: "",
  });
  const [health, setHealth] = useState({
    antecedentes: "",
    atuais: "",
    tratamento: "",
    meds: "",
    alergias: "",
    psicologia: "",
    nutricao: "",
    histFamiliar: "",
  });
  const [support, setSupport] = useState({
    emergencyContact: "",
    doctor: "",
    doctorPhone: "",
    doctorEmail: "",
    notes: "",
  });

  const next = (s) => setStep(s);
  const back = (s) => setStep(s);

  if (step === "welcome") {
    return (
      <div className="flex-1 flex flex-col p-8 animate-in text-center justify-center min-h-screen">
        <h1 className="text-3xl font-black mb-6">Bem-vindo ao VIVERCOM</h1>
        <Button fullWidth onClick={() => next("profiles")}>Criar conta</Button>
      </div>
    );
  }

  if (step === "profiles") {
    const options = [
      { id: "patient", title: "Paciente", icon: UserCheck, desc: "Gerencie sua rotina e tratamentos." },
      { id: "guardian", title: "Resp. Legal", icon: ShieldCheck, desc: "Acompanhe e apoie uma pessoa." },
      { id: "doctor", title: "Médico", icon: Stethoscope, desc: "Acompanhe pacientes com permissão." },
    ];
    return (
      <div className="p-8 animate-in min-h-screen pb-24 text-left">
        <h2 className="text-xl font-black mb-6">Perfis</h2>

        <div className="space-y-3 mb-8">
          {options.map((o) => (
            <Card
              key={o.id}
              className={`p-4 cursor-pointer ${profileType === o.id ? "border-blue-200" : ""}`}
              onClick={() => setProfileType(o.id)}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <o.icon size={22} />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-slate-900">{o.title}</h4>
                  <p className="text-xs text-slate-500 font-medium">{o.desc}</p>
                </div>
                {profileType === o.id && (
                  <div className="text-blue-600">
                    <CheckCircle2 size={18} />
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>

        <div className="flex gap-3">
          <Button variant="secondary" fullWidth onClick={() => back("welcome")}>Voltar</Button>
          <Button fullWidth onClick={() => next("step1")}>Avançar</Button>
        </div>
      </div>
    );
  }

  if (step === "step1") {
    return (
      <div className="p-8 animate-in min-h-screen pb-24">
        <h2 className="text-xl font-black mb-6">Dados Básicos</h2>

        <Input
          label="Nome Completo"
          icon={User}
          value={basic.name}
          onChange={(e) => setBasic((p) => ({ ...p, name: e.target.value }))}
        />
        <Input
          label="CPF"
          placeholder="000.000.000-00"
          value={basic.cpf}
          onChange={(e) => setBasic((p) => ({ ...p, cpf: e.target.value }))}
        />
        <Input
          label="Data de Nascimento"
          type="date"
          icon={Calendar}
          value={basic.birth}
          onChange={(e) => setBasic((p) => ({ ...p, birth: e.target.value }))}
        />
        <Input
          label="Cidade/Estado de Nascimento"
          placeholder="Ex: Belo Horizonte/MG"
          value={basic.birthPlace}
          onChange={(e) => setBasic((p) => ({ ...p, birthPlace: e.target.value }))}
        />
        <Input
          label="Estado Civil"
          placeholder="Ex: Casado(a)"
          value={basic.marital}
          onChange={(e) => setBasic((p) => ({ ...p, marital: e.target.value }))}
        />
        <Input
          label="Endereço Completo"
          placeholder="Rua, número, cidade, UF"
          value={basic.address}
          onChange={(e) => setBasic((p) => ({ ...p, address: e.target.value }))}
        />
        <Input
          label="Telefone"
          icon={Phone}
          value={basic.phone}
          onChange={(e) => setBasic((p) => ({ ...p, phone: e.target.value }))}
        />
        <Input
          label="E-mail"
          icon={Mail}
          placeholder="seuemail@dominio.com"
          value={basic.email}
          onChange={(e) => setBasic((p) => ({ ...p, email: e.target.value }))}
        />
        <Input
          label="Contato de Emergência"
          placeholder="Nome + telefone"
          value={basic.emergency}
          onChange={(e) => setBasic((p) => ({ ...p, emergency: e.target.value }))}
        />

        <Button fullWidth onClick={() => next("step2")}>Avançar</Button>
      </div>
    );
  }

  if (step === "step2") {
    return (
      <div className="p-8 animate-in min-h-screen pb-24">
        <h2 className="text-xl font-black mb-6">Dados de Rotina</h2>

        <Input
          label="Sexo"
          placeholder="Masculino / Feminino / Outro"
          value={routine.sex}
          onChange={(e) => setRoutine((p) => ({ ...p, sex: e.target.value }))}
        />
        <Input
          label="Altura (cm)"
          value={routine.height}
          onChange={(e) => setRoutine((p) => ({ ...p, height: e.target.value }))}
        />
        <Input
          label="Peso (kg)"
          value={routine.weight}
          onChange={(e) => setRoutine((p) => ({ ...p, weight: e.target.value }))}
        />
        <Input
          label="Grupo Sanguíneo"
          placeholder="Ex: O+, A-"
          value={routine.blood}
          onChange={(e) => setRoutine((p) => ({ ...p, blood: e.target.value }))}
        />
        <Input
          label="Grau de Independência"
          placeholder="Alto / Médio / Baixo"
          value={routine.independence}
          onChange={(e) => setRoutine((p) => ({ ...p, independence: e.target.value }))}
        />
        <Input
          label="Tipo de Alimentação"
          placeholder="Ex: Caseira, industrializada, balanceada"
          value={routine.foodType}
          onChange={(e) => setRoutine((p) => ({ ...p, foodType: e.target.value }))}
        />
        <Input
          label="Doenças Pré-existentes"
          placeholder="Ex: Diabetes, Hipertensão"
          value={routine.diseases}
          onChange={(e) => setRoutine((p) => ({ ...p, diseases: e.target.value }))}
        />
        <Input
          label="Hábitos de Vida"
          placeholder="Ex: Fuma, bebe, sedentário"
          value={routine.habits}
          onChange={(e) => setRoutine((p) => ({ ...p, habits: e.target.value }))}
        />
        <Input
          label="Pratica Atividade Física?"
          placeholder="Ex: Sim, 3x por semana"
          value={routine.activity}
          onChange={(e) => setRoutine((p) => ({ ...p, activity: e.target.value }))}
        />
        <Input
          label="Trabalho / Profissão"
          placeholder="Opcional"
          value={routine.work}
          onChange={(e) => setRoutine((p) => ({ ...p, work: e.target.value }))}
        />

        <div className="flex gap-3">
          <Button variant="secondary" fullWidth onClick={() => back("step1")}>Voltar</Button>
          <Button fullWidth onClick={() => next("step3")}>Avançar</Button>
        </div>
      </div>
    );
  }

  if (step === "step3") {
    return (
      <div className="p-8 animate-in min-h-screen pb-24">
        <h2 className="text-xl font-black mb-6">Dados de Saúde</h2>

        <Input
          label="Antecedentes de Saúde"
          placeholder="Ex: cirurgias, internações"
          value={health.antecedentes}
          onChange={(e) => setHealth((p) => ({ ...p, antecedentes: e.target.value }))}
        />
        <Input
          label="Doenças Atuais"
          value={health.atuais}
          onChange={(e) => setHealth((p) => ({ ...p, atuais: e.target.value }))}
        />
        <Input
          label="Tratamento Atual"
          value={health.tratamento}
          onChange={(e) => setHealth((p) => ({ ...p, tratamento: e.target.value }))}
        />
        <Input
          label="Medicamentos em Uso"
          value={health.meds}
          onChange={(e) => setHealth((p) => ({ ...p, meds: e.target.value }))}
        />
        <Input
          label="Acompanhamento Psicológico"
          placeholder="Ex: Sim (semanal), Não"
          value={health.psicologia}
          onChange={(e) => setHealth((p) => ({ ...p, psicologia: e.target.value }))}
        />
        <Input
          label="Acompanhamento Nutricional"
          placeholder="Ex: Sim, Não"
          value={health.nutricao}
          onChange={(e) => setHealth((p) => ({ ...p, nutricao: e.target.value }))}
        />
        <Input
          label="Possui Alergias?"
          placeholder="Ex: Dipirona, alimentos"
          value={health.alergias}
          onChange={(e) => setHealth((p) => ({ ...p, alergias: e.target.value }))}
        />
        <Input
          label="Histórico Familiar (inicial)"
          placeholder="Detalhado depois"
          value={health.histFamiliar}
          onChange={(e) => setHealth((p) => ({ ...p, histFamiliar: e.target.value }))}
        />

        <div className="flex gap-3">
          <Button variant="secondary" fullWidth onClick={() => back("step2")}>Voltar</Button>
          <Button fullWidth onClick={() => next("step4")}>Avançar</Button>
        </div>
      </div>
    );
  }

  if (step === "step4") {
    return (
      <div className="p-8 animate-in min-h-screen pb-24">
        <h2 className="text-xl font-black mb-6">Rede de Apoio</h2>

        <Input
          label="Contato de Emergência"
          value={support.emergencyContact}
          onChange={(e) => setSupport((p) => ({ ...p, emergencyContact: e.target.value }))}
        />
        <Input
          label="Médico de Referência"
          value={support.doctor}
          onChange={(e) => setSupport((p) => ({ ...p, doctor: e.target.value }))}
        />
        <Input
          label="Telefone do Médico"
          value={support.doctorPhone}
          onChange={(e) => setSupport((p) => ({ ...p, doctorPhone: e.target.value }))}
        />
        <Input
          label="E-mail do Médico"
          value={support.doctorEmail}
          onChange={(e) => setSupport((p) => ({ ...p, doctorEmail: e.target.value }))}
        />
        <Input
          label="Observações"
          placeholder="Opcional"
          value={support.notes}
          onChange={(e) => setSupport((p) => ({ ...p, notes: e.target.value }))}
        />

        <div className="flex gap-3">
          <Button variant="secondary" fullWidth onClick={() => back("step3")}>Voltar</Button>
          <Button
            fullWidth
            onClick={() =>
              onFinish({
                name: basic.name || "Novo Usuário",
                role: profileType,
                basic,
                routine,
                health,
                support,
              })
            }
          >
            Finalizar Cadastro
          </Button>
        </div>
      </div>
    );
  }

  return null;
};

/* =========================================================
   HOME
   ✅ ÚNICA ALTERAÇÃO DESTA RESPOSTA:
   - mover o botão do perfil para ficar IMEDIATAMENTE ao lado direito do sino
========================================================= */
const TabHome = ({ user, treatments, setTreatments, onOpenProfile }) => {
  const [feeling, setFeeling] = useState(null);
  const [isAddMedModalOpen, setIsAddMedModalOpen] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  const simulateNotification = () => {
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 8000);
  };

  const markDoseTaken = (treatmentId) => {
    const dKey = todayKey();
    setTreatments((prev) =>
      prev.map((t) => {
        if (t.id !== treatmentId) return t;
        const expected = Math.max(1, Number(t.dosesPerDay || 1));
        const current = Number(t.takenByDate?.[dKey] || 0);
        const nextVal = Math.min(expected, current + 1);
        return { ...t, takenByDate: { ...(t.takenByDate || {}), [dKey]: nextVal } };
      })
    );
  };

  return (
    <div className="p-6 animate-in pb-32">
      {showNotification && (
        <div className="fixed top-4 left-4 right-4 z-[200] max-w-md mx-auto animate-in">
          <div className="bg-white/95 ios-blur p-4 rounded-[24px] shadow-2xl border border-slate-200 flex flex-col gap-3">
            <div className="flex gap-3">
              <div className="bg-blue-600 p-2 rounded-xl text-white">
                <Pill size={20} />
              </div>
              <div className="flex-1 text-left">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
                  Agora • VIVERCOM
                </p>
                <h4 className="font-bold text-slate-900">Hora do seu medicamento!</h4>
                <p className="text-sm text-slate-600">Losartana 50mg - Dose da tarde.</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                className="flex-1 bg-blue-600 text-white py-2.5 rounded-xl font-bold text-sm"
                onClick={() => setShowNotification(false)}
                type="button"
              >
                Marcar como tomado
              </button>
              <button
                className="px-4 bg-slate-100 text-slate-600 py-2.5 rounded-xl font-bold text-sm"
                onClick={() => setShowNotification(false)}
                type="button"
              >
                Adiar
              </button>
            </div>
          </div>
        </div>
      )}

      <header className="flex items-center justify-between mb-8 text-left">
        <div>
          <p className="text-blue-600 font-bold text-[10px] uppercase tracking-widest">
            Seu app de autogestão de saúde
          </p>
          <h1 className="text-2xl font-black text-slate-900">
            Olá, {user?.name?.split(" ")[0]}!
          </h1>
        </div>

        {/* ✅ Ajuste: perfil fica imediatamente ao lado direito do sino */}
        <div className="flex gap-2">
          <button
            onClick={simulateNotification}
            className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100"
            type="button"
          >
            <Zap size={20} className="text-yellow-500" />
          </button>

          <div className="flex gap-2">
            <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 relative">
              <Bell size={24} className="text-slate-600" />
              <span className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </div>

            <button
              onClick={onOpenProfile}
              className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100"
              type="button"
              aria-label="Abrir perfil"
              title="Perfil"
            >
              <User size={22} className="text-slate-600" />
            </button>
          </div>
        </div>
      </header>

      <Card className="mb-6 border-none shadow-md">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 text-left">
          Sentimento Hoje
        </p>
        <div className="flex justify-around items-center">
          {[
            { id: "sad", icon: Frown, label: "Mal", color: "text-red-500" },
            { id: "neutral", icon: Meh, label: "Bem", color: "text-yellow-500" },
            { id: "happy", icon: Smile, label: "Ótimo", color: "text-green-500" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setFeeling(item.id)}
              className={`flex flex-col items-center gap-2 p-4 rounded-[22px] transition-all ${
                feeling === item.id ? "bg-slate-50 scale-105" : "opacity-40"
              }`}
              type="button"
            >
              <item.icon
                size={32}
                className={feeling === item.id ? item.color : "text-slate-400"}
              />
              <span className="text-[10px] font-bold">{item.label}</span>
            </button>
          ))}
        </div>
      </Card>

      <div className="mb-8">
        <Button
          fullWidth
          onClick={() => setIsAddMedModalOpen(true)}
          className="h-16 shadow-lg shadow-blue-200"
        >
          <PlusCircle size={24} /> Adicionar Medicamento
        </Button>
      </div>

      <section className="text-left mb-8">
        <h3 className="font-black text-slate-900 text-lg mb-4">Rotina do Dia</h3>
        <div className="space-y-3">
          {[
            {
              name: "Losartana",
              dose: "50mg",
              time: "12:00",
              icon: Pill,
              status: "pendente",
              treatmentId: treatments?.[0]?.id,
            },
            {
              name: "Dr. Roberto Silva",
              dose: "Cardiologista",
              time: "14:30",
              icon: Stethoscope,
              status: "agendado",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white p-4 rounded-[22px] flex items-center gap-4 shadow-sm border border-slate-100"
            >
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                  item.status === "pendente"
                    ? "bg-blue-50 text-blue-600"
                    : "bg-slate-50 text-slate-400"
                }`}
              >
                <item.icon size={20} />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-slate-800 text-sm">{item.name}</h4>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                  {item.dose} • {item.time}
                </p>

                {item.treatmentId && (
                  <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-1">
                    Aderência hoje:{" "}
                    {
                      calcAdherence(
                        treatments.find((t) => t.id === item.treatmentId),
                        todayKey()
                      ).pct
                    }
                    %
                  </p>
                )}
              </div>
              <button
                onClick={() => (item.treatmentId ? markDoseTaken(item.treatmentId) : null)}
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
          <button className="text-blue-600 text-xs font-bold" type="button">
            Ver Calendário
          </button>
        </div>
        <div className="space-y-3">
          {[
            {
              doctor: "Dra. Aline Santos",
              specialty: "Nutricionista",
              date: "25 Jan",
              time: "10:00",
              type: "Presencial",
              color: "bg-indigo-50 text-indigo-600",
            },
            {
              doctor: "Dr. Marcos Oliveira",
              specialty: "Dermatologista",
              date: "02 Fev",
              time: "16:45",
              type: "Teleconsulta",
              color: "bg-emerald-50 text-emerald-600",
            },
          ].map((appt, i) => (
            <Card key={i} className="p-4">
              <div className="flex gap-4">
                <div
                  className={`${appt.color} w-14 h-14 rounded-2xl flex flex-col items-center justify-center`}
                >
                  <span className="text-[8px] font-black uppercase">
                    {appt.date.split(" ")[1]}
                  </span>
                  <span className="text-lg font-black">{appt.date.split(" ")[0]}</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-slate-900 text-sm">{appt.doctor}</h4>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">
                    {appt.specialty} • {appt.time}
                  </p>
                  <div className="flex items-center gap-1 mt-2 text-[9px] font-black text-slate-400 uppercase">
                    {appt.type === "Presencial" ? <MapPin size={10} /> : <Activity size={10} />}
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

      <section className="text-left mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-black text-slate-900 text-lg">Tratamentos</h3>
          <button className="text-blue-600 text-xs font-bold" type="button">
            Ver Tudo
          </button>
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
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                        Aderência hoje
                      </span>
                      <span className="text-[10px] font-black text-blue-600 uppercase">
                        {a.pct}%
                      </span>
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

      <Modal
        isOpen={isAddMedModalOpen}
        onClose={() => setIsAddMedModalOpen(false)}
        title="Novo Tratamento"
      >
        <div className="space-y-4 text-left">
          <Input label="Nome do Medicamento" icon={Pill} placeholder="Ex: Atorvastatina" />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Dosagem" icon={Activity} placeholder="10mg" />
            <div className="text-left">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block px-1">
                Frequência
              </label>
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
          <Button fullWidth className="mt-4" onClick={() => setIsAddMedModalOpen(false)}>
            Salvar Medicamento
          </Button>
        </div>
      </Modal>
    </div>
  );
};

/* =========================================================
   RESTANTE DO APP (mantido)
========================================================= */

// --- AGENDA ---
const TabAgenda = ({ treatments, setTreatments, cholesterol, setCholesterol }) => {
  const [selectedDay, setSelectedDay] = useState(16);
  const [modalType, setModalType] = useState(null);
  const days = [14, 15, 16, 17, 18, 19, 20];

  const [treatForm, setTreatForm] = useState({
    name: "",
    dosage: "",
    frequency: "Diário",
    dosesPerDay: "1",
  });

  const addTreatmentFromAgenda = () => {
    const id = `t_${Date.now()}`;
    const newT = {
      id,
      name: treatForm.name || "Novo Tratamento",
      dosage: treatForm.dosage || "—",
      frequency: treatForm.frequency || "Diário",
      dosesPerDay: Number(treatForm.dosesPerDay || 1),
      takenByDate: {},
    };
    setTreatments((prev) => [newT, ...(prev || [])]);
    setTreatForm({ name: "", dosage: "", frequency: "Diário", dosesPerDay: "1" });
    setModalType(null);
  };

  const [examForm, setExamForm] = useState({
    type: "",
    place: "",
    date: "",
    time: "",
    cholTotal: "",
    ldl: "",
    hdl: "",
    trig: "",
  });

  const addExam = () => {
    const hasAnyChol =
      String(examForm.cholTotal || "").trim() ||
      String(examForm.ldl || "").trim() ||
      String(examForm.hdl || "").trim() ||
      String(examForm.trig || "").trim();

    if (hasAnyChol) {
      const d = examForm.date || todayKey();
      const newRow = {
        id: `chol_${Date.now()}`,
        date: d,
        total: examForm.cholTotal ? Number(examForm.cholTotal) : null,
        ldl: examForm.ldl ? Number(examForm.ldl) : null,
        hdl: examForm.hdl ? Number(examForm.hdl) : null,
        trig: examForm.trig ? Number(examForm.trig) : null,
      };
      setCholesterol((prev) => {
        const next = [...(prev || []), newRow].sort((a, b) =>
          String(a.date).localeCompare(String(b.date))
        );
        return next;
      });
    }

    setExamForm({ type: "", place: "", date: "", time: "", cholTotal: "", ldl: "", hdl: "", trig: "" });
    setModalType(null);
  };

  return (
    <div className="p-6 text-left animate-in pb-32">
      <h1 className="text-2xl font-black text-slate-900 mb-2">Agenda</h1>
      <p className="text-sm text-slate-500 mb-6">Sua programação completa de saúde.</p>

      <div className="flex justify-between mb-8 overflow-x-auto pb-2 scrollbar-hide">
        {days.map((day) => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            className={`flex flex-col items-center gap-1 min-w-[50px] py-4 rounded-2xl transition-all ${
              selectedDay === day
                ? "bg-blue-600 text-white shadow-lg scale-105"
                : "bg-white text-slate-400 border border-slate-100"
            }`}
            type="button"
          >
            <span className="text-[8px] font-black uppercase tracking-tighter opacity-70">Jan</span>
            <span className="text-lg font-black">{day}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-3 mb-8">
        <button
          onClick={() => setModalType("med")}
          className="flex flex-col items-center gap-2 p-4 bg-white rounded-3xl border border-slate-100 shadow-sm active:scale-95 transition-all"
          type="button"
        >
          <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
            <Pill size={20} />
          </div>
          <span className="text-[10px] font-black uppercase text-slate-400">Remédio</span>
        </button>
        <button
          onClick={() => setModalType("appt")}
          className="flex flex-col items-center gap-2 p-4 bg-white rounded-3xl border border-slate-100 shadow-sm active:scale-95 transition-all"
          type="button"
        >
          <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
            <Stethoscope size={20} />
          </div>
          <span className="text-[10px] font-black uppercase text-slate-400">Consulta</span>
        </button>
        <button
          onClick={() => setModalType("exam")}
          className="flex flex-col items-center gap-2 p-4 bg-white rounded-3xl border border-slate-100 shadow-sm active:scale-95 transition-all"
          type="button"
        >
          <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
            <ClipboardList size={20} />
          </div>
          <span className="text-[10px] font-black uppercase text-slate-400">Exame</span>
        </button>
      </div>

      <div className="mb-8">
        <button
          onClick={() => setModalType("treat")}
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

      <div className="space-y-6">
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Clock size={16} className="text-blue-600" />
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">
              Cronograma de hoje
            </h3>
          </div>

          <div className="space-y-4 border-l-2 border-slate-100 ml-2 pl-6 relative">
            {[
              { time: "08:00", title: "Medicamento", desc: "Losartana 50mg", icon: Pill, color: "text-blue-600", bg: "bg-blue-50" },
              { time: "10:00", title: "Consulta", desc: "Dra. Aline (Nutri)", icon: Stethoscope, color: "text-indigo-600", bg: "bg-indigo-50" },
              { time: "12:30", title: "Medicamento", desc: "Vitamina D", icon: Pill, color: "text-orange-600", bg: "bg-orange-50" },
              { time: "16:45", title: "Exame", desc: "Coleta de Sangue", icon: Activity, color: "text-purple-600", bg: "bg-purple-50" },
            ].map((item, i) => (
              <div key={i} className="relative">
                <div className="absolute -left-[31px] top-1 w-2.5 h-2.5 rounded-full bg-slate-200 border-2 border-white"></div>
                <div className="flex gap-4">
                  <span className="text-[10px] font-black text-slate-400 w-10 pt-1">{item.time}</span>
                  <div className={`flex-1 ${item.bg} p-4 rounded-2xl border border-slate-50`}>
                    <div className="flex items-center gap-2 mb-1">
                      <item.icon size={14} className={item.color} />
                      <span className={`text-[9px] font-black uppercase tracking-widest ${item.color}`}>
                        {item.title}
                      </span>
                    </div>
                    <p className="text-sm font-bold text-slate-800">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <Modal isOpen={modalType === "med"} onClose={() => setModalType(null)} title="Novo Medicamento">
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

      <Modal isOpen={modalType === "appt"} onClose={() => setModalType(null)} title="Nova Consulta">
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

      <Modal isOpen={modalType === "exam"} onClose={() => setModalType(null)} title="Novo Exame">
        <div className="space-y-4 text-left">
          <Input
            label="Tipo de Exame"
            icon={ClipboardList}
            placeholder="Ex: Ecocardiograma"
            value={examForm.type}
            onChange={(e) => setExamForm((p) => ({ ...p, type: e.target.value }))}
          />
          <Input
            label="Laboratório / Local"
            icon={MapPin}
            placeholder="Nome do laboratório"
            value={examForm.place}
            onChange={(e) => setExamForm((p) => ({ ...p, place: e.target.value }))}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Data"
              icon={Calendar}
              type="date"
              value={examForm.date}
              onChange={(e) => setExamForm((p) => ({ ...p, date: e.target.value }))}
            />
            <Input
              label="Hora"
              icon={Clock}
              type="time"
              value={examForm.time}
              onChange={(e) => setExamForm((p) => ({ ...p, time: e.target.value }))}
            />
          </div>

          <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
            <p className="text-[10px] font-black text-blue-700 uppercase tracking-widest mb-3">
              (Opcional) Colesterol
            </p>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Total (mg/dL)"
                placeholder="Ex: 190"
                value={examForm.cholTotal}
                onChange={(e) => setExamForm((p) => ({ ...p, cholTotal: e.target.value }))}
              />
              <Input
                label="LDL (mg/dL)"
                placeholder="Ex: 110"
                value={examForm.ldl}
                onChange={(e) => setExamForm((p) => ({ ...p, ldl: e.target.value }))}
              />
              <Input
                label="HDL (mg/dL)"
                placeholder="Ex: 55"
                value={examForm.hdl}
                onChange={(e) => setExamForm((p) => ({ ...p, hdl: e.target.value }))}
              />
              <Input
                label="Triglicerídeos (mg/dL)"
                placeholder="Ex: 140"
                value={examForm.trig}
                onChange={(e) => setExamForm((p) => ({ ...p, trig: e.target.value }))}
              />
            </div>
          </div>

          <Button fullWidth onClick={addExam}>Cadastrar Exame</Button>
        </div>
      </Modal>

      <Modal isOpen={modalType === "treat"} onClose={() => setModalType(null)} title="Novo Tratamento">
        <div className="space-y-4 text-left">
          <Input
            label="Nome do Tratamento / Medicamento"
            icon={Pill}
            placeholder="Ex: Atorvastatina"
            value={treatForm.name}
            onChange={(e) => setTreatForm((p) => ({ ...p, name: e.target.value }))}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Dosagem"
              icon={Activity}
              placeholder="10mg"
              value={treatForm.dosage}
              onChange={(e) => setTreatForm((p) => ({ ...p, dosage: e.target.value }))}
            />
            <div className="text-left">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block px-1">
                Frequência
              </label>
              <select
                className="w-full bg-white border border-slate-200 rounded-2xl p-4 font-bold outline-none h-[58px]"
                value={treatForm.frequency}
                onChange={(e) => setTreatForm((p) => ({ ...p, frequency: e.target.value }))}
              >
                <option>Diário</option>
                <option>12 em 12h</option>
                <option>8 em 8h</option>
              </select>
            </div>
          </div>
          <Input
            label="Doses por dia (para aderência)"
            icon={Target}
            placeholder="Ex: 2"
            value={treatForm.dosesPerDay}
            onChange={(e) => setTreatForm((p) => ({ ...p, dosesPerDay: e.target.value }))}
          />
          <Button fullWidth onClick={addTreatmentFromAgenda}>Salvar Tratamento</Button>
        </div>
      </Modal>
    </div>
  );
};

// --- CADASTRO/PERFIL ---
const TabCadastro = ({
  user,
  cholesterol,
  setCholesterol,
  familyHistory,
  setFamilyHistory,
  sharedPeople,
  setSharedPeople,
}) => {
  const [newFamily, setNewFamily] = useState({ disease: "", relation: "" });
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [addPerson, setAddPerson] = useState({ name: "", phone: "", email: "" });

  const cholesterolPoints = (cholesterol || [])
    .filter((r) => r && r.date)
    .map((r) => ({
      date: String(r.date).slice(5),
      value: r.total ?? r.ldl ?? r.hdl ?? r.trig ?? 0,
      raw: r,
    }));

  const addFamilyRow = () => {
    const row = {
      id: `fh_${Date.now()}`,
      disease: newFamily.disease || "—",
      relation: newFamily.relation || "—",
    };
    setFamilyHistory((prev) => [...(prev || []), row]);
    setNewFamily({ disease: "", relation: "" });
  };

  const updateFamilyRow = (id, patch) => {
    setFamilyHistory((prev) => (prev || []).map((r) => (r.id === id ? { ...r, ...patch } : r)));
  };

  const removeFamilyRow = (id) => {
    setFamilyHistory((prev) => (prev || []).filter((r) => r.id !== id));
  };

  const defaultPerms = {
    examsAll: true,
    examsSelected: [],
    medsAgenda: true,
    createAppointments: false,
    shareBasic: true,
  };

  const addSharedPerson = () => {
    const p = {
      id: `sp_${Date.now()}`,
      name: addPerson.name || "Pessoa",
      phone: addPerson.phone || "",
      email: addPerson.email || "",
      perms: { ...defaultPerms },
    };
    setSharedPeople((prev) => [...(prev || []), p]);
    setAddPerson({ name: "", phone: "", email: "" });
  };

  const setPerm = (personId, key, value) => {
    setSharedPeople((prev) =>
      (prev || []).map((p) =>
        p.id === personId ? { ...p, perms: { ...(p.perms || defaultPerms), [key]: value } } : p
      )
    );
  };

  const revokeAll = (personId) => {
    setSharedPeople((prev) => (prev || []).filter((p) => p.id !== personId));
  };

  const toggleSelectedExam = (personId, examKey) => {
    setSharedPeople((prev) =>
      (prev || []).map((p) => {
        if (p.id !== personId) return p;
        const current = Array.isArray(p?.perms?.examsSelected) ? p.perms.examsSelected : [];
        const exists = current.includes(examKey);
        const next = exists ? current.filter((x) => x !== examKey) : [...current, examKey];
        return { ...p, perms: { ...(p.perms || defaultPerms), examsSelected: next } };
      })
    );
  };

  const selectableExams = ["Colesterol", "Glicose", "Hemograma", "TSH", "Vitamina D"];

  return (
    <div className="p-6 animate-in pb-32 text-left">
      <h1 className="text-2xl font-black text-slate-900 mb-2">Cadastro</h1>
      <p className="text-sm text-slate-500 mb-6">Suas informações e histórico.</p>

      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-black text-slate-900 text-lg">Resultados – Colesterol</h3>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Linha do tempo
          </span>
        </div>

        {cholesterolPoints.length ? (
          <div className="space-y-3">
            <MiniLineChart points={cholesterolPoints.slice(-10)} />
            <div className="space-y-2">
              {(cholesterol || [])
                .slice()
                .sort((a, b) => String(b.date).localeCompare(String(a.date)))
                .slice(0, 5)
                .map((r) => (
                  <div
                    key={r.id}
                    className="bg-white p-4 rounded-[22px] flex items-center gap-4 shadow-sm border border-slate-100"
                  >
                    <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                      <TrendingUp size={20} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-800 text-sm">{r.date}</h4>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                        Total: {r.total ?? "—"} • LDL: {r.ldl ?? "—"} • HDL: {r.hdl ?? "—"} • TG:{" "}
                        {r.trig ?? "—"}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ) : (
          <Card className="p-4">
            <div className="flex gap-3 items-center">
              <div className="w-11 h-11 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center">
                <Info size={20} />
              </div>
              <div>
                <p className="font-bold text-slate-800">Sem resultados cadastrados</p>
                <p className="text-xs text-slate-500 font-medium">
                  Cadastre um exame pela Agenda para ver a evolução aqui.
                </p>
              </div>
            </div>
          </Card>
        )}
      </section>

      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-black text-slate-900 text-lg">Histórico Familiar</h3>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Doença + Grau
          </span>
        </div>

        <Card className="p-4 mb-3">
          <Input
            label="Nome da doença"
            placeholder="Ex: Hipertensão"
            value={newFamily.disease}
            onChange={(e) => setNewFamily((p) => ({ ...p, disease: e.target.value }))}
          />
          <Input
            label="Grau de parentesco"
            placeholder="Ex: Pai, Mãe, Irmão, Avô..."
            value={newFamily.relation}
            onChange={(e) => setNewFamily((p) => ({ ...p, relation: e.target.value }))}
          />
          <Button fullWidth onClick={addFamilyRow}>
            <Plus size={18} /> Adicionar
          </Button>
        </Card>

        <div className="space-y-3">
          {(familyHistory || []).map((r) => (
            <Card key={r.id} className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <History size={18} />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Registro
                  </p>
                  <p className="font-bold text-slate-800 text-sm">
                    {r.disease} • {r.relation}
                  </p>
                </div>
                <button
                  className="bg-red-50 text-red-500 border border-red-100 px-3 py-2 rounded-xl font-bold text-xs"
                  onClick={() => removeFamilyRow(r.id)}
                  type="button"
                >
                  Remover
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block px-1">
                    Doença
                  </label>
                  <input
                    className="w-full bg-white border border-slate-200 rounded-2xl p-4 font-bold outline-none focus:border-blue-500 transition-colors"
                    value={r.disease}
                    onChange={(e) => updateFamilyRow(r.id, { disease: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block px-1">
                    Parentesco
                  </label>
                  <input
                    className="w-full bg-white border border-slate-200 rounded-2xl p-4 font-bold outline-none focus:border-blue-500 transition-colors"
                    value={r.relation}
                    onChange={(e) => updateFamilyRow(r.id, { relation: e.target.value })}
                  />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-black text-slate-900 text-lg">Compartilhamento</h3>
          <button
            className="text-blue-600 text-xs font-bold"
            type="button"
            onClick={() => setShareModalOpen(true)}
          >
            Gerenciar
          </button>
        </div>

        <div className="space-y-3">
          {(sharedPeople || []).length ? (
            (sharedPeople || []).map((p) => (
              <Card key={p.id} className="p-4">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <Users size={20} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-slate-800 text-sm">{p.name}</h4>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                      {p.phone || "—"} • {p.email || "—"}
                    </p>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">
                      Acessos permitidos
                    </p>
                    <p className="text-xs text-slate-600 font-medium mt-1">
                      Exames: {p?.perms?.examsAll ? "Todos" : "Selecionados"} • Agenda de medicamentos:{" "}
                      {p?.perms?.medsAgenda ? "Sim" : "Não"} • Cadastrar consultas:{" "}
                      {p?.perms?.createAppointments ? "Sim" : "Não"} • Dados básicos:{" "}
                      {p?.perms?.shareBasic ? "Sim" : "Não"}
                    </p>
                  </div>
                  <ChevronRight size={18} className="text-slate-200" />
                </div>
              </Card>
            ))
          ) : (
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center">
                  <Share2 size={20} />
                </div>
                <div>
                  <p className="font-bold text-slate-800">Nenhuma pessoa adicionada</p>
                  <p className="text-xs text-slate-500 font-medium">
                    Toque em “Gerenciar” para convidar e definir permissões.
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>
      </section>

      <Modal isOpen={shareModalOpen} onClose={() => setShareModalOpen(false)} title="Gestão de Acessos">
        <div className="space-y-6 text-left">
          <Card className="p-4">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
              Adicionar pessoa
            </p>
            <Input
              label="Nome"
              icon={User}
              value={addPerson.name}
              onChange={(e) => setAddPerson((p) => ({ ...p, name: e.target.value }))}
            />
            <Input
              label="Telefone"
              icon={Phone}
              value={addPerson.phone}
              onChange={(e) => setAddPerson((p) => ({ ...p, phone: e.target.value }))}
            />
            <Input
              label="E-mail"
              icon={Mail}
              value={addPerson.email}
              onChange={(e) => setAddPerson((p) => ({ ...p, email: e.target.value }))}
            />
            <Button fullWidth onClick={addSharedPerson}>
              <Plus size={18} /> Adicionar
            </Button>
          </Card>

          {(sharedPeople || []).map((p) => (
            <Card key={p.id} className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Users size={18} />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Pessoa compartilhada
                  </p>
                  <p className="font-bold text-slate-800 text-sm">{p.name}</p>
                </div>

                <button
                  className="bg-red-50 text-red-500 border border-red-100 px-3 py-2 rounded-xl font-bold text-xs"
                  type="button"
                  onClick={() => revokeAll(p.id)}
                >
                  Revogar tudo
                </button>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between bg-white rounded-2xl border border-slate-200 p-4">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Visualizar resultados de exames
                    </p>
                    <p className="text-sm font-bold text-slate-800">
                      {p?.perms?.examsAll ? "Todos" : "Selecionar exames"}
                    </p>
                  </div>
                  <button
                    className="bg-slate-100 text-slate-600 px-3 py-2 rounded-xl font-bold text-xs"
                    type="button"
                    onClick={() => setPerm(p.id, "examsAll", !p?.perms?.examsAll)}
                  >
                    {p?.perms?.examsAll ? "Selecionar" : "Todos"}
                  </button>
                </div>

                {!p?.perms?.examsAll && (
                  <div className="bg-slate-50 rounded-2xl border border-slate-100 p-4">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                      Selecionar exames
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {selectableExams.map((ex) => {
                        const checked = (p?.perms?.examsSelected || []).includes(ex);
                        return (
                          <button
                            key={ex}
                            className={`px-3 py-2 rounded-xl font-bold text-xs border ${
                              checked
                                ? "bg-blue-600 text-white border-blue-600"
                                : "bg-white text-slate-600 border-slate-200"
                            }`}
                            type="button"
                            onClick={() => toggleSelectedExam(p.id, ex)}
                          >
                            {ex}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between bg-white rounded-2xl border border-slate-200 p-4">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Visualizar agenda de medicamentos
                    </p>
                    <p className="text-sm font-bold text-slate-800">
                      {p?.perms?.medsAgenda ? "Permitido" : "Bloqueado"}
                    </p>
                  </div>
                  <button
                    className="bg-slate-100 text-slate-600 px-3 py-2 rounded-xl font-bold text-xs"
                    type="button"
                    onClick={() => setPerm(p.id, "medsAgenda", !p?.perms?.medsAgenda)}
                  >
                    {p?.perms?.medsAgenda ? "Desativar" : "Ativar"}
                  </button>
                </div>

                <div className="flex items-center justify-between bg-white rounded-2xl border border-slate-200 p-4">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Cadastrar consultas médicas
                    </p>
                    <p className="text-sm font-bold text-slate-800">
                      {p?.perms?.createAppointments ? "Permitido" : "Bloqueado"}
                    </p>
                  </div>
                  <button
                    className="bg-slate-100 text-slate-600 px-3 py-2 rounded-xl font-bold text-xs"
                    type="button"
                    onClick={() =>
                      setPerm(p.id, "createAppointments", !p?.perms?.createAppointments)
                    }
                  >
                    {p?.perms?.createAppointments ? "Desativar" : "Ativar"}
                  </button>
                </div>

                <div className="flex items-center justify-between bg-white rounded-2xl border border-slate-200 p-4">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Compartilhar dados básicos de saúde
                    </p>
                    <p className="text-sm font-bold text-slate-800">
                      {p?.perms?.shareBasic ? "Permitido" : "Bloqueado"}
                    </p>
                  </div>
                  <button
                    className="bg-slate-100 text-slate-600 px-3 py-2 rounded-xl font-bold text-xs"
                    type="button"
                    onClick={() => setPerm(p.id, "shareBasic", !p?.perms?.shareBasic)}
                  >
                    {p?.perms?.shareBasic ? "Desativar" : "Ativar"}
                  </button>
                </div>

                <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-2xl border border-blue-100">
                  <Info className="text-blue-600" size={18} />
                  <p className="text-xs text-blue-800 font-medium">
                    Alterações de permissões são aplicadas imediatamente (revogação parcial).
                  </p>
                </div>
              </div>
            </Card>
          ))}

          <Button fullWidth variant="secondary" onClick={() => setShareModalOpen(false)}>
            Fechar
          </Button>
        </div>
      </Modal>
    </div>
  );
};

const BottomNav = ({ tab, setTab }) => {
  const items = [
    { id: "home", label: "Home", icon: Home },
    { id: "agenda", label: "Agenda", icon: Calendar },
    { id: "cadastro", label: "Cadastro", icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[90] safe-area-bottom">
      <div className="max-w-md mx-auto bg-white/85 ios-blur border-t border-slate-200 px-6 py-3 rounded-t-[28px]">
        <div className="flex justify-between">
          {items.map((it) => (
            <button
              key={it.id}
              onClick={() => setTab(it.id)}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-2xl transition-all ${
                tab === it.id ? "text-blue-600" : "text-slate-400"
              }`}
              type="button"
            >
              <it.icon size={22} />
              <span className="text-[10px] font-black uppercase">{it.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [view, setView] = useState("onboarding");
  const [tab, setTab] = useState("home");

  const [user, setUser] = useState(null);

  const [treatments, setTreatments] = useState([]);
  const [sharedPeople, setSharedPeople] = useState([]);
  const [cholesterol, setCholesterol] = useState([]);
  const [familyHistory, setFamilyHistory] = useState([]);

  useEffect(() => {
    const u = safeJsonParse(localStorage.getItem(LS_KEYS.user), null);
    const t = safeJsonParse(localStorage.getItem(LS_KEYS.treatments), []);
    const sp = safeJsonParse(localStorage.getItem(LS_KEYS.sharedPeople), []);
    const ch = safeJsonParse(localStorage.getItem(LS_KEYS.cholesterol), []);
    const fh = safeJsonParse(localStorage.getItem(LS_KEYS.familyHistory), []);

    if (u) {
      setUser(u);
      setView("app");
      setTab("home");
    }

    setTreatments(Array.isArray(t) ? t : []);
    setSharedPeople(Array.isArray(sp) ? sp : []);
    setCholesterol(Array.isArray(ch) ? ch : []);
    setFamilyHistory(Array.isArray(fh) ? fh : []);
  }, []);

  useEffect(() => {
    localStorage.setItem(LS_KEYS.treatments, JSON.stringify(treatments || []));
  }, [treatments]);
  useEffect(() => {
    localStorage.setItem(LS_KEYS.sharedPeople, JSON.stringify(sharedPeople || []));
  }, [sharedPeople]);
  useEffect(() => {
    localStorage.setItem(LS_KEYS.cholesterol, JSON.stringify(cholesterol || []));
  }, [cholesterol]);
  useEffect(() => {
    localStorage.setItem(LS_KEYS.familyHistory, JSON.stringify(familyHistory || []));
  }, [familyHistory]);
  useEffect(() => {
    if (user) localStorage.setItem(LS_KEYS.user, JSON.stringify(user));
  }, [user]);

  const handleFinishOnboarding = (u) => {
    setUser(u);
    setView("app");
    setTab("home");
  };

  const logout = () => {
    localStorage.removeItem(LS_KEYS.user);
    setUser(null);
    setView("onboarding");
    setTab("home");
  };

  return (
    <div className="min-h-screen">
      <GlobalStyles />

      {view === "onboarding" ? (
        <OnboardingFlow onFinish={handleFinishOnboarding} />
      ) : (
        <div className="max-w-md mx-auto min-h-screen">
          {tab === "home" && (
            <TabHome
              user={user}
              treatments={treatments}
              setTreatments={setTreatments}
              onOpenProfile={() => setTab("cadastro")}
            />
          )}

          {tab === "agenda" && (
            <TabAgenda
              treatments={treatments}
              setTreatments={setTreatments}
              cholesterol={cholesterol}
              setCholesterol={setCholesterol}
            />
          )}

          {tab === "cadastro" && (
            <TabCadastro
              user={user}
              cholesterol={cholesterol}
              setCholesterol={setCholesterol}
              familyHistory={familyHistory}
              setFamilyHistory={setFamilyHistory}
              sharedPeople={sharedPeople}
              setSharedPeople={setSharedPeople}
            />
          )}

          <BottomNav tab={tab} setTab={setTab} />

          <div className="fixed top-4 right-4 z-[95] max-w-md mx-auto">
            <button
              onClick={logout}
              className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 text-slate-500"
              type="button"
              title="Sair"
              aria-label="Sair"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

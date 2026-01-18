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
   ONBOARDING / CADASTRO (inclui o que faltava pela imagem)
   - Adição do step PERFIS
   - Step 1: adiciona E-mail + Cidade/Estado de Nascimento
   - Step 2: adiciona Grau de Independência + Tipo de Alimentação
   - Step 3: adiciona Psicologia + Nutrição
   - Ao finalizar: direciona para HOME (requisito)
========================================================= */
const OnboardingFlow = ({ onFinish, initialStep = "welcome" }) => {
  const [step, setStep] = useState(initialStep);

  // (adição) estado simples para cadastro
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

  /* ===========================
     PERFIS (adição conforme imagem)
  =========================== */
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

  /* ===========================
     STEP 1 – DADOS BÁSICOS (completado conforme imagem)
  =========================== */
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

        {/* ✅ Adição conforme imagem */}
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

        {/* ✅ Adição conforme imagem */}
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

  /* ===========================
     STEP 2 – DADOS DE ROTINA (completado conforme imagem)
  =========================== */
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

        {/* ✅ Adição conforme imagem */}
        <Input
          label="Grau de Independência"
          placeholder="Alto / Médio / Baixo"
          value={routine.independence}
          onChange={(e) => setRoutine((p) => ({ ...p, independence: e.target.value }))}
        />

        {/* ✅ Adição conforme imagem */}
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

  /* ===========================
     STEP 3 – DADOS DE SAÚDE (completado conforme imagem)
  =========================== */
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

        {/* ✅ Adições conforme imagem */}
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

  /* ===========================
     STEP 4 – REDE DE APOIO (mantido + estados)
  =========================== */
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
   HOME (mantido + adição do ícone de perfil ao lado do sino)
========================================================= */
const TabHome = ({ user, treatments, setTreatments, onOpenProfile }) => {
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
              >
                Marcar como tomado
              </button>
              <button
                className="px-4 bg-slate-100 text-slate-600 py-2.5 rounded-xl font-bold text-sm"
                onClick={() => setShowNotification(false)}
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

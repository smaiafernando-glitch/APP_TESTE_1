import React, { useMemo, useState } from "react";
import {
  Heart,
  User,
  Layout,
  Calendar,
  History,
  Settings,
  LogOut,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ChevronLeft,
  Plus,
  X,
  Clock,
  MapPin,
  Video,
  Pill,
  CheckCircle,
  MoreHorizontal,
  Info,
  HeartHandshake,
  Stethoscope,
  TrendingUp,
  TrendingDown,
  Minus,
  RefreshCw,
} from "lucide-react";

/**
 * VIVERCOM — Single-file demo app (React)
 * Ajuste pedido: permitir prosseguir (Entrar) sem criar conta/validar credenciais.
 * => Apenas removi o bloqueio do botão "Entrar" e mantive o fluxo de navegação.
 */

// -------------------------
// Utils
// -------------------------
const pad2 = (n: number) => String(n).padStart(2, "0");
const toISODate = (d: Date) =>
  `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
const parseISO = (iso: string) => {
  const [y, m, dd] = iso.split("-").map((x) => parseInt(x, 10));
  return new Date(y, (m || 1) - 1, dd || 1, 12, 0, 0, 0);
};
const daysAgoISO = (daysAgo: number) => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return toISODate(d);
};
const inLastNDays = (isoDate: string, n: number) => {
  const d = parseISO(isoDate);
  const now = new Date();
  const from = new Date();
  from.setDate(now.getDate() - (n - 1));
  from.setHours(0, 0, 0, 0);
  d.setHours(0, 0, 0, 0);
  return d.getTime() >= from.getTime() && d.getTime() <= now.getTime();
};
const prettyBR = (iso: string) => {
  const d = parseISO(iso);
  const dd = pad2(d.getDate());
  const mm = pad2(d.getMonth() + 1);
  const yy = d.getFullYear();
  return `${dd}/${mm}/${yy}`;
};

// -------------------------
// Design Kit (VIVERCOM)
// -------------------------
type ButtonVariant = "primary" | "secondary" | "ghost" | "destructive" | "outline";
const Button = ({
  children,
  variant = "primary",
  icon: Icon,
  onClick,
  className = "",
  loading = false,
  disabled = false,
  type = "button",
}: {
  children: React.ReactNode;
  variant?: ButtonVariant;
  icon?: any;
  onClick?: () => void;
  className?: string;
  loading?: boolean;
  disabled?: boolean;
  type?: "button" | "submit";
}) => {
  const base =
    "flex items-center justify-center font-bold transition-all active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100";
  const sizes = "px-5 py-3 rounded-2xl text-sm";
  const variants: Record<ButtonVariant, string> = {
    primary: "bg-[#007AFF] text-white shadow-sm hover:brightness-110",
    secondary: "bg-white text-slate-800 border border-[#E5E5EA] hover:bg-slate-50",
    ghost: "bg-transparent text-[#007AFF] hover:bg-blue-50",
    destructive: "bg-red-50 text-[#FF3B30] hover:bg-red-100",
    outline: "border-2 border-[#E5E5EA] text-[#1C1C1E] hover:bg-slate-50 bg-white",
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${base} ${sizes} ${variants[variant]} ${className}`}
    >
      {loading ? (
        <RefreshCw className="animate-spin mr-2" size={18} />
      ) : Icon ? (
        <Icon className="mr-2" size={18} />
      ) : null}
      {children}
    </button>
  );
};

const Input = ({
  label,
  placeholder,
  type = "text",
  icon: Icon,
  right,
  value,
  onChange,
  ...props
}: {
  label?: string;
  placeholder?: string;
  type?: string;
  icon?: any;
  right?: React.ReactNode;
  value?: any;
  onChange?: any;
  [k: string]: any;
}) => (
  <div className="space-y-1.5 w-full">
    {label && (
      <label className="text-[11px] font-black text-[#8E8E93] px-1 uppercase tracking-wider">
        {label}
      </label>
    )}
    <div className="relative">
      {Icon && (
        <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C7C7CC]" size={18} />
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`w-full bg-white border border-[#E5E5EA] rounded-2xl ${
          Icon ? "pl-11" : "pl-4"
        } pr-12 py-3.5 text-sm focus:ring-2 focus:ring-blue-100 transition-all outline-none`}
        {...props}
      />
      {right && <div className="absolute right-3 top-1/2 -translate-y-1/2">{right}</div>}
    </div>
  </div>
);

type BadgeVariant = "default" | "success" | "info" | "warning" | "danger";
const Badge = ({ children, variant = "default" }: { children: React.ReactNode; variant?: BadgeVariant }) => {
  const styles: Record<BadgeVariant, string> = {
    default: "bg-slate-100 text-slate-600",
    success: "bg-[#E9F9EE] text-[#34C759]",
    info: "bg-[#EBF5FF] text-[#007AFF]",
    warning: "bg-[#FFF4E5] text-[#FF9500]",
    danger: "bg-[#FFEBEC] text-[#FF3B30]",
  };
  return (
    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black tracking-tight uppercase ${styles[variant]}`}>
      {children}
    </span>
  );
};

type CardColor = "blue" | "green" | "orange" | "indigo" | "slate";
const Card = ({
  children,
  className = "",
  title,
  subtitle,
  icon: Icon,
  color = "blue",
  footer,
}: {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  icon?: any;
  color?: CardColor;
  footer?: React.ReactNode;
}) => {
  const iconWrap: Record<CardColor, string> = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    orange: "bg-orange-50 text-orange-600",
    indigo: "bg-indigo-50 text-indigo-600",
    slate: "bg-slate-100 text-slate-600",
  };
  return (
    <div className={`bg-white rounded-[24px] border border-[#E5E5EA] shadow-sm p-5 ${className}`}>
      {(title || subtitle) && (
        <div className="flex items-start justify-between mb-4">
          <div>
            {title && <h3 className="text-[16px] font-bold text-[#1C1C1E] tracking-tight">{title}</h3>}
            {subtitle && <p className="text-[12px] text-[#8E8E93] font-medium">{subtitle}</p>}
          </div>
          {Icon && (
            <div className={`p-2 rounded-xl ${iconWrap[color]}`}>
              <Icon size={18} />
            </div>
          )}
        </div>
      )}
      <div className="space-y-3">{children}</div>
      {footer && <div className="mt-4 pt-4 border-t border-[#F2F2F7]">{footer}</div>}
    </div>
  );
};

// -------------------------
// Types
// -------------------------
type Role = "paciente" | "medico" | "apoio";
type View = "auth-login" | "auth-forgot" | "auth-register" | "auth-select-profile" | "app";
type Tab = "home" | "calendar" | "history" | "profile";

type Med = {
  id: number;
  name: string;
  dose: string;
  time: string;
  taken: boolean;
  note?: string;
  source?: string;
  date: string;
};

type AppointmentStatus = "Agendada" | "Realizada" | "Cancelada";
type AppointmentType = "Presencial" | "Teleconsulta";
type Appointment = {
  id: number;
  date: string;
  time: string;
  doctor: string;
  spec: string;
  type: AppointmentType;
  place: string;
  status: AppointmentStatus;
  goal?: string;
};

type Mood = { date: string; score: number; text: string };

// -------------------------
// App
// -------------------------
export default function App() {
  const todayISO = useMemo(() => toISODate(new Date()), []);

  const [view, setView] = useState<View>("auth-login");
  const [userRole, setUserRole] = useState<Role | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("home");
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);
  const [periodFilter, setPeriodFilter] = useState<7 | 30>(7);

  // Auth UI states (mock)
  const [authEmail, setAuthEmail] = useState("");
  const [authPass, setAuthPass] = useState("");
  const [passVisible, setPassVisible] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);

  // Add appointment form
  const [showAddAppointment, setShowAddAppointment] = useState(false);
  const [apptForm, setApptForm] = useState({
    date: todayISO,
    time: "09:00",
    doctor: "",
    spec: "",
    type: "Presencial" as AppointmentType,
    place: "",
    goal: "",
  });

  // Mood quick register
  const [moodScore, setMoodScore] = useState<number>(8);
  const [moodText, setMoodText] = useState<string>("");

  // Mock data
  const [meds, setMeds] = useState<Med[]>([
    { id: 1, name: "Losartana", dose: "50mg", time: "08:00", taken: true, note: "Em jejum", source: "Médico", date: daysAgoISO(0) },
    { id: 2, name: "Metformina", dose: "850mg", time: "12:00", taken: false, note: "Após o almoço", source: "Paciente", date: daysAgoISO(0) },
    { id: 3, name: "Losartana", dose: "50mg", time: "08:00", taken: true, note: "Em jejum", source: "Médico", date: daysAgoISO(1) },
    { id: 4, name: "Vitamina D", dose: "2000ui", time: "20:00", taken: true, note: "", source: "Médico", date: daysAgoISO(2) },
    { id: 5, name: "Metformina", dose: "850mg", time: "12:00", taken: true, note: "", source: "Paciente", date: daysAgoISO(2) },
  ]);

  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: 1,
      date: daysAgoISO(-1),
      time: "14:30",
      doctor: "Dr. Alberto Rossi",
      spec: "Cardiologia",
      type: "Presencial",
      place: "Av. Paulista, 1000",
      status: "Agendada",
      goal: "Check-up anual",
    },
    {
      id: 2,
      date: daysAgoISO(2),
      time: "10:00",
      doctor: "Dra. Elena Silva",
      spec: "Nutrição",
      type: "Teleconsulta",
      place: "https://meet.google.com/xxx-xxxx-xxx",
      status: "Realizada",
      goal: "Ajuste de dieta",
    },
    {
      id: 3,
      date: daysAgoISO(6),
      time: "16:00",
      doctor: "Dr. Paulo Mendes",
      spec: "Clínico Geral",
      type: "Presencial",
      place: "Clínica Central",
      status: "Cancelada",
      goal: "Retorno",
    },
  ]);

  const [dailyMoods, setDailyMoods] = useState<Mood[]>([
    { date: daysAgoISO(0), score: 8, text: "Me sentindo bem hoje." },
    { date: daysAgoISO(1), score: 6, text: "Um pouco cansado." },
    { date: daysAgoISO(2), score: 7, text: "Dia produtivo." },
    { date: daysAgoISO(4), score: 5, text: "Sono ruim, mais lento." },
  ]);

  // Filters by period
  const medsInPeriod = useMemo(() => meds.filter((m) => inLastNDays(m.date, periodFilter)), [meds, periodFilter]);
  const appsInPeriod = useMemo(() => appointments.filter((a) => inLastNDays(a.date, periodFilter)), [appointments, periodFilter]);
  const moodsInPeriod = useMemo(() => dailyMoods.filter((m) => inLastNDays(m.date, periodFilter)), [dailyMoods, periodFilter]);

  // KPI calculations (based on selected period)
  const stats = useMemo(() => {
    const totalMeds = medsInPeriod.length;
    const takenMeds = medsInPeriod.filter((m) => m.taken).length;
    const medAdherence = totalMeds > 0 ? Math.round((takenMeds / totalMeds) * 100) : 0;

    const validApps = appsInPeriod.filter((a) => a.status !== "Cancelada");
    const realizedApps = validApps.filter((a) => a.status === "Realizada").length;
    const appAdherence = validApps.length > 0 ? Math.round((realizedApps / validApps.length) * 100) : 0;

    const avgMood =
      moodsInPeriod.length > 0 ? (moodsInPeriod.reduce((acc, curr) => acc + curr.score, 0) / moodsInPeriod.length).toFixed(1) : "0.0";

    return {
      medAdherence,
      appAdherence,
      avgMood,
      totalMeds,
      takenMeds,
      totalApps: appsInPeriod.length,
      realizedApps,
    };
  }, [medsInPeriod, appsInPeriod, moodsInPeriod]);

  // Navigation logic
  const handleLogout = () => {
    setView("auth-login");
    setUserRole(null);
    setSelectedPatient(null);
    setActiveTab("home");
    setAuthPass("");
    setPassVisible(false);
  };

  const handleBack = () => {
    if (view === "auth-forgot" || view === "auth-register" || view === "auth-select-profile") {
      setView("auth-login");
      return;
    }
    if (selectedPatient) {
      setSelectedPatient(null);
      return;
    }
    if (activeTab !== "home") {
      setActiveTab("home");
      return;
    }
    if (window.confirm("Deseja sair da conta?")) handleLogout();
  };

  // Auth handlers (mock)
  const doLogin = async () => {
    setAuthLoading(true);
    setTimeout(() => {
      setAuthLoading(false);
      setView("auth-select-profile");
    }, 450);
  };

  const doRegister = async () => {
    setAuthLoading(true);
    setTimeout(() => {
      setAuthLoading(false);
      setView("auth-login");
      alert("Conta criada (mock). Agora faça login.");
    }, 600);
  };

  const doForgot = async () => {
    setAuthLoading(true);
    setTimeout(() => {
      setAuthLoading(false);
      alert("Se existir uma conta com esse e-mail, enviamos um link de recuperação (mock).");
      setView("auth-login");
    }, 600);
  };

  // App header (single sticky)
  const Header = ({ title }: { title: string }) => (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-[#E5E5EA] px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button onClick={handleBack} className="p-2 -ml-2 hover:bg-slate-50 rounded-full text-[#007AFF]">
          <ChevronLeft size={24} />
        </button>
        <div className="flex flex-col leading-tight">
          <h1 className="text-lg font-black tracking-tight uppercase">{title}</h1>
          <p className="text-[11px] font-bold text-[#8E8E93]">
            {userRole === "paciente" ? "Paciente" : userRole === "medico" ? "Profissional de Saúde" : "Rede de Apoio"}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {userRole === "medico" && <Badge variant="info">MÉDICO</Badge>}
        {userRole === "apoio" && <Badge variant="warning">REDE DE APOIO</Badge>}
        <button
          onClick={() => setActiveTab("profile")}
          className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 overflow-hidden"
          title="Conta"
        >
          <User size={20} />
        </button>
      </div>
    </header>
  );

  // Home — meds first, then consults
  const nextAppointment = useMemo(() => {
    const future = appointments
      .filter((a) => a.status === "Agendada")
      .sort((a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime());
    return future[0] || null;
  }, [appointments]);

  const medsToday = useMemo(() => meds.filter((m) => m.date === todayISO).sort((a, b) => a.time.localeCompare(b.time)), [meds, todayISO]);

  const renderHome = () => (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      {userRole === "apoio" && (
        <div className="bg-orange-50 border border-orange-100 p-4 rounded-2xl flex items-center gap-4">
          <div className="bg-white p-2 rounded-xl text-orange-500">
            <Info size={20} />
          </div>
          <p className="text-xs font-bold text-orange-800">
            Você está visualizando os dados de: <span className="underline">Carlos Alberto (Paciente)</span>
          </p>
        </div>
      )}

      {/* 1) Meds first */}
      <section className="space-y-4">
        <h3 className="text-[10px] font-black text-[#8E8E93] uppercase tracking-widest px-1">
          {userRole === "apoio" ? "Remédios do Paciente (Hoje)" : "Remédios (Hoje)"}
        </h3>

        {medsToday.length === 0 ? (
          <Card title="Sem medicamentos cadastrados para hoje" subtitle="Cadastre via receita/rotina (mock)" icon={Pill} color="slate">
            <p className="text-sm text-slate-500">Nenhum item encontrado para {prettyBR(todayISO)}.</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {medsToday.map((m) => (
              <div
                key={m.id}
                className={`bg-white p-4 rounded-[22px] border transition-all flex items-center justify-between ${
                  m.taken ? "border-[#34C759] bg-green-50/20" : "border-[#E5E5EA]"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${m.taken ? "bg-[#34C759] text-white" : "bg-slate-100 text-slate-400"}`}>
                    <Pill size={24} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className={`font-bold ${m.taken ? "line-through text-slate-400" : ""}`}>{m.name}</p>
                      <span className="text-[10px] font-black bg-blue-50 text-[#007AFF] px-1.5 py-0.5 rounded uppercase">{m.time}</span>
                    </div>
                    <p className="text-xs text-[#8E8E93]">
                      {m.dose} {m.note ? `• ${m.note}` : ""}
                    </p>
                  </div>
                </div>

                {userRole !== "apoio" && (
                  <button
                    onClick={() => setMeds((prev) => prev.map((med) => (med.id === m.id ? { ...med, taken: !med.taken } : med)))}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      m.taken ? "bg-[#34C759] text-white" : "border-2 border-slate-200 text-slate-400"
                    }`}
                    title="Marcar como tomado"
                  >
                    <CheckCircle size={22} />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 2) Appointments */}
      <Card title="Próxima Consulta" subtitle="Agenda de médicos" icon={Calendar} color="blue">
        {nextAppointment ? (
          <div className="flex items-center justify-between pt-2">
            <div>
              <p className="font-bold">{nextAppointment.doctor}</p>
              <p className="text-xs text-slate-500">
                {prettyBR(nextAppointment.date)} às {nextAppointment.time} • {nextAppointment.type}
              </p>
              <p className="text-xs text-slate-400 mt-1">{nextAppointment.spec}</p>
            </div>
            <Button variant="ghost" className="text-xs" onClick={() => setActiveTab("calendar")}>
              Ver Agenda
            </Button>
          </div>
        ) : (
          <div className="flex items-center justify-between pt-2">
            <p className="text-sm text-slate-500">Nenhuma consulta agendada.</p>
            <Button variant="ghost" className="text-xs" onClick={() => setActiveTab("calendar")}>
              Abrir Agenda
            </Button>
          </div>
        )}
      </Card>

      {/* 3) Mood register */}
      {userRole !== "apoio" && (
        <Card title="Como está sua disposição hoje?" subtitle="0 muito indisposto • 10 muito disposto" icon={Info} color="orange">
          <div className="flex items-center justify-between gap-3">
            <div className="flex-1">
              <input
                type="range"
                min={0}
                max={10}
                step={1}
                value={moodScore}
                onChange={(e) => setMoodScore(parseInt(e.target.value, 10))}
                className="w-full accent-[#007AFF]"
              />
              <div className="flex justify-between mt-1 text-[10px] font-black text-[#C7C7CC] uppercase tracking-widest">
                <span>0</span>
                <span>10</span>
              </div>
            </div>
            <div className="w-16 h-16 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center">
              <span className="text-2xl font-black text-orange-600">{moodScore}</span>
            </div>
          </div>

          <div className="mt-2">
            <textarea
              value={moodText}
              onChange={(e) => setMoodText(e.target.value)}
              placeholder="Escreva um pequeno relato (sem termos médicos)."
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm outline-none focus:ring-2 focus:ring-blue-100 min-h-[88px]"
            />
          </div>

          <Button
            variant="secondary"
            className="w-full text-xs"
            onClick={() => {
              const exists = dailyMoods.some((m) => m.date === todayISO);
              const entry = { date: todayISO, score: moodScore, text: moodText.trim() || "Sem relato informado." };
              setDailyMoods((prev) => {
                if (exists) return prev.map((m) => (m.date === todayISO ? entry : m));
                return [entry, ...prev];
              });
              setMoodText("");
              alert("Registrado no Histórico (mock).");
            }}
          >
            Registrar no Histórico
          </Button>
        </Card>
      )}

      {/* 4) Caregiver summary */}
      {userRole === "apoio" && (
        <Card title="Aderência Geral" subtitle="Visão rápida do cuidador" icon={Layout} color="green">
          <div className="flex items-center gap-8 py-4">
            <div className="text-center">
              <p className="text-2xl font-black text-green-600">{stats.medAdherence}%</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase">Medicamentos</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-black text-blue-600">{stats.appAdherence}%</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase">Consultas</p>
            </div>
          </div>
          <Button variant="outline" className="w-full text-xs" onClick={() => setActiveTab("history")}>
            Ver Detalhes
          </Button>
        </Card>
      )}
    </div>
  );

  // Agenda actions
  const addAppointment = () => {
    if (!apptForm.date || !apptForm.time || !apptForm.doctor.trim() || !apptForm.spec.trim() || !apptForm.place.trim()) {
      alert("Preencha data, hora, médico, especialidade e local/link.");
      return;
    }
    const nextId = Math.max(0, ...appointments.map((a) => a.id)) + 1;
    const newA: Appointment = {
      id: nextId,
      date: apptForm.date,
      time: apptForm.time,
      doctor: apptForm.doctor.trim(),
      spec: apptForm.spec.trim(),
      type: apptForm.type,
      place: apptForm.place.trim(),
      status: "Agendada",
      goal: apptForm.goal.trim(),
    };
    setAppointments((prev) => [newA, ...prev]);
    setShowAddAppointment(false);
    setApptForm({ date: todayISO, time: "09:00", doctor: "", spec: "", type: "Presencial", place: "", goal: "" });
  };

  const setAppointmentStatus = (id: number, status: AppointmentStatus) => {
    setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
  };

  const renderAgenda = () => {
    const sorted = [...appointments].sort((a, b) => {
      const da = parseISO(a.date).getTime();
      const db = parseISO(b.date).getTime();
      if (da !== db) return db - da;
      return b.time.localeCompare(a.time);
    });

    return (
      <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
        <div className="flex justify-between items-end px-1">
          <div>
            <h2 className="text-2xl font-black">Agenda</h2>
            <p className="text-sm text-[#8E8E93]">
              {userRole === "apoio" ? "Consultas agendadas do paciente." : "Consultas agendadas e cadastro de futuras."}
            </p>
          </div>
          {userRole !== "apoio" && (
            <Button icon={Plus} onClick={() => setShowAddAppointment(true)} className="rounded-full px-4 h-11">
              Nova
            </Button>
          )}
        </div>

        {showAddAppointment && (
          <Card className="border-[#007AFF] border-2 animate-in zoom-in-95 duration-200" title="Nova Consulta" subtitle="Cadastre consultas futuras">
            <div className="flex justify-end -mt-10">
              <button onClick={() => setShowAddAppointment(false)} className="p-2 rounded-full hover:bg-slate-50">
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="grid grid-cols-2 gap-3">
                <Input label="Data" type="date" value={apptForm.date} onChange={(e) => setApptForm((p) => ({ ...p, date: e.target.value }))} />
                <Input label="Hora" type="time" value={apptForm.time} onChange={(e) => setApptForm((p) => ({ ...p, time: e.target.value }))} />
              </div>

              <Input label="Médico" placeholder="Nome do médico" value={apptForm.doctor} onChange={(e) => setApptForm((p) => ({ ...p, doctor: e.target.value }))} />
              <Input label="Especialidade" placeholder="Ex: Cardiologia" value={apptForm.spec} onChange={(e) => setApptForm((p) => ({ ...p, spec: e.target.value }))} />

              <div className="flex gap-2 p-2 bg-slate-50 rounded-2xl border border-slate-100">
                <button
                  onClick={() => setApptForm((p) => ({ ...p, type: "Presencial" }))}
                  className={`flex-1 flex items-center gap-2 text-xs font-black justify-center py-2 rounded-xl transition-all ${
                    apptForm.type === "Presencial"
                      ? "bg-white border border-[#E5E5EA] shadow-sm text-slate-800"
                      : "text-slate-400 hover:bg-white/60"
                  }`}
                >
                  <MapPin size={14} /> Presencial
                </button>
                <button
                  onClick={() => setApptForm((p) => ({ ...p, type: "Teleconsulta" }))}
                  className={`flex-1 flex items-center gap-2 text-xs font-black justify-center py-2 rounded-xl transition-all ${
                    apptForm.type === "Teleconsulta"
                      ? "bg-white border border-[#E5E5EA] shadow-sm text-slate-800"
                      : "text-slate-400 hover:bg-white/60"
                  }`}
                >
                  <Video size={14} /> Teleconsulta
                </button>
              </div>

              <Input
                label="Local / Link"
                placeholder={apptForm.type === "Teleconsulta" ? "Cole o link (ex: Meet/Zoom)" : "Endereço"}
                value={apptForm.place}
                onChange={(e) => setApptForm((p) => ({ ...p, place: e.target.value }))}
              />
              <Input label="Objetivo (opcional)" placeholder="Ex: Retorno / Check-up / Ajuste" value={apptForm.goal} onChange={(e) => setApptForm((p) => ({ ...p, goal: e.target.value }))} />

              <Button onClick={addAppointment} className="w-full">
                Agendar
              </Button>
            </div>
          </Card>
        )}

        <div className="space-y-4">
          {sorted.map((app) => {
            const statusVariant: BadgeVariant =
              app.status === "Realizada" ? "success" : app.status === "Cancelada" ? "danger" : "info";
            const Icon = app.type === "Teleconsulta" ? Video : Calendar;

            return (
              <div key={app.id} className="bg-white rounded-[24px] border border-[#E5E5EA] overflow-hidden shadow-sm">
                <div className="p-5 flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                        app.status === "Agendada" ? "bg-blue-50 text-[#007AFF]" : "bg-slate-50 text-slate-400"
                      }`}
                    >
                      <Icon size={24} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-black text-[16px]">{app.doctor}</p>
                        <Badge variant={statusVariant}>{app.status}</Badge>
                      </div>
                      <p className="text-xs text-[#8E8E93] font-black uppercase tracking-widest">{app.spec}</p>
                      <div className="flex flex-wrap items-center gap-3 mt-3 text-xs font-medium text-slate-600">
                        <span className="flex items-center gap-1">
                          <Clock size={14} className="text-[#007AFF]" /> {prettyBR(app.date)} às {app.time}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin size={14} className="text-[#007AFF]" /> {app.type}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-2">{app.place}</p>
                      {app.goal ? <p className="text-xs text-slate-500 mt-1">Objetivo: {app.goal}</p> : null}
                    </div>
                  </div>

                  {userRole !== "apoio" && (
                    <button className="p-2 text-slate-300 hover:text-slate-500" title="Opções (mock)">
                      <MoreHorizontal size={20} />
                    </button>
                  )}
                </div>

                {userRole !== "apoio" && (
                  <div className="bg-[#F9F9FB] px-5 py-3 flex gap-3 border-t border-[#E5E5EA]">
                    {app.status !== "Cancelada" ? (
                      <button
                        onClick={() => setAppointmentStatus(app.id, "Cancelada")}
                        className="flex-1 py-2 text-[10px] font-black uppercase text-red-500 hover:bg-red-50 rounded-xl transition-all"
                      >
                        Cancelar
                      </button>
                    ) : (
                      <button
                        onClick={() => setAppointmentStatus(app.id, "Agendada")}
                        className="flex-1 py-2 text-[10px] font-black uppercase text-blue-500 hover:bg-blue-50 rounded-xl transition-all"
                      >
                        Reativar
                      </button>
                    )}

                    <button
                      onClick={() => setAppointmentStatus(app.id, "Agendada")}
                      className="flex-1 py-2 text-[10px] font-black uppercase text-blue-500 hover:bg-blue-50 rounded-xl transition-all"
                    >
                      Agendada
                    </button>

                    <button
                      onClick={() => setAppointmentStatus(app.id, "Realizada")}
                      className="flex-1 py-2 text-[10px] font-black uppercase text-green-600 hover:bg-green-50 rounded-xl transition-all"
                    >
                      Realizada
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // History — KPIs + timeline
  const moodSeries = useMemo(() => [...moodsInPeriod].sort((a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime()), [moodsInPeriod]);
  const timelineDays = useMemo(() => {
    const set = new Set<string>();
    medsInPeriod.forEach((m) => set.add(m.date));
    appsInPeriod.forEach((a) => set.add(a.date));
    moodsInPeriod.forEach((m) => set.add(m.date));
    return Array.from(set).sort((a, b) => parseISO(b).getTime() - parseISO(a).getTime());
  }, [medsInPeriod, appsInPeriod, moodsInPeriod]);

  const renderHistory = () => (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-end px-1">
        <div>
          <h2 className="text-2xl font-black">Histórico</h2>
          <p className="text-sm text-[#8E8E93]">{userRole === "apoio" ? "Monitorando evolução do paciente." : "Indicadores e linha do tempo do período."}</p>
        </div>
        <div className="flex bg-white p-1 rounded-xl border border-[#E5E5EA]">
          <button onClick={() => setPeriodFilter(7)} className={`px-3 py-1 text-[10px] font-black rounded-lg ${periodFilter === 7 ? "bg-blue-50 text-[#007AFF]" : "text-slate-400"}`}>7D</button>
          <button onClick={() => setPeriodFilter(30)} className={`px-3 py-1 text-[10px] font-black rounded-lg ${periodFilter === 30 ? "bg-blue-50 text-[#007AFF]" : "text-slate-400"}`}>30D</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card title="Aderência Med." subtitle="Remédios tomados" icon={Pill} color="green">
          <div className="flex items-end justify-between">
            <span className="text-3xl font-black tracking-tighter">{stats.medAdherence}%</span>
            <div className={`flex items-center text-xs font-bold ${stats.medAdherence >= 70 ? "text-green-500" : "text-red-400"}`}>
              {stats.medAdherence >= 70 ? <TrendingUp size={14} className="mr-1" /> : <TrendingDown size={14} className="mr-1" />}
              {stats.medAdherence >= 70 ? "OK" : "Baixa"}
            </div>
          </div>
          <div className="h-1.5 bg-slate-100 rounded-full mt-2"><div className="h-full bg-green-500 rounded-full" style={{ width: `${stats.medAdherence}%` }} /></div>
          <p className="text-[10px] text-slate-400 mt-2">{stats.takenMeds} de {stats.totalMeds} doses no período</p>
        </Card>

        <Card title="Consultas" subtitle="Aderência" icon={Calendar} color="blue">
          <div className="flex items-end justify-between">
            <span className="text-3xl font-black tracking-tighter">{stats.appAdherence}%</span>
            <div className="flex items-center text-xs font-bold text-slate-400"><Minus size={14} className="mr-1" /> {stats.realizedApps}/{stats.totalApps}</div>
          </div>
          <div className="h-1.5 bg-slate-100 rounded-full mt-2"><div className="h-full bg-blue-500 rounded-full" style={{ width: `${stats.appAdherence}%` }} /></div>
          <p className="text-[10px] text-slate-400 mt-2">Realizadas / registradas no período</p>
        </Card>

        <Card title="Bem-estar" subtitle="Disposição média" icon={Info} color="orange">
          <div className="flex items-end justify-between">
            <span className="text-3xl font-black tracking-tighter">{stats.avgMood}/10</span>
            <div className="flex items-center text-xs font-bold text-slate-400"><Minus size={14} className="mr-1" /> período</div>
          </div>
          <div className="flex items-end gap-1 h-10 mt-3">
            {(moodSeries.length ? moodSeries : [{ date: todayISO, score: 0, text: "" }]).map((m, i) => (
              <div key={`${m.date}-${i}`} className="flex-1 bg-orange-100 rounded-t-sm" style={{ height: `${Math.max(5, m.score * 10)}%` }} title={`${prettyBR(m.date)}: ${m.score}/10`} />
            ))}
          </div>
          <p className="text-[10px] text-slate-400 mt-2">Histórico de disposição</p>
        </Card>
      </div>

      <div className="space-y-8 relative before:absolute before:left-6 before:top-2 before:bottom-0 before:w-0.5 before:bg-[#E5E5EA]">
        {timelineDays.length === 0 ? (
          <Card title="Sem registros no período" subtitle="Inclua relatos, medicamentos e consultas">
            <p className="text-sm text-slate-500">Não há eventos para {periodFilter} dias.</p>
          </Card>
        ) : (
          timelineDays.map((date) => {
            const mood = dailyMoods.find((m) => m.date === date);
            const medsDay = meds.filter((m) => m.date === date).sort((a, b) => a.time.localeCompare(b.time));
            const appsDay = appointments.filter((a) => a.date === date).sort((a, b) => a.time.localeCompare(b.time));

            return (
              <div key={date} className="relative pl-14 space-y-4">
                <div className="absolute left-4 top-1 w-4 h-4 rounded-full bg-white border-2 border-[#007AFF] z-10 shadow-sm" />
                <h3 className="text-[11px] font-black text-[#8E8E93] uppercase tracking-widest bg-white inline-block px-2 -ml-2 rounded">{prettyBR(date)}</h3>

                <div className="space-y-3">
                  {mood && (
                    <div className="bg-white p-4 rounded-2xl border border-[#E5E5EA] shadow-sm">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[10px] font-black text-[#FF9500] uppercase tracking-tighter">RELATO DO DIA</span>
                        <Badge variant="warning">NOTA: {mood.score}/10</Badge>
                      </div>
                      <p className="text-sm font-medium text-slate-700 italic">"{mood.text}"</p>
                    </div>
                  )}

                  {medsDay.length > 0 && (
                    <div className="bg-white p-4 rounded-2xl border border-[#E5E5EA] shadow-sm space-y-2">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">MEDICAÇÕES</p>
                      {medsDay.map((m) => (
                        <div key={m.id} className="flex items-center justify-between py-1 border-b border-slate-50 last:border-0">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${m.taken ? "bg-green-500" : "bg-red-400"}`} />
                            <span className="text-xs font-bold">{m.name} ({m.time})</span>
                          </div>
                          <span className="text-[10px] font-medium text-slate-400">{m.taken ? "Tomado" : "Pendente"}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {appsDay.map((a) => (
                    <div
                      key={a.id}
                      className={`p-4 rounded-2xl border shadow-sm flex items-center justify-between ${
                        a.status === "Realizada"
                          ? "bg-green-50/40 border-green-100"
                          : a.status === "Cancelada"
                          ? "bg-red-50/40 border-red-100"
                          : "bg-blue-50/40 border-blue-100"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Stethoscope size={18} className="text-[#007AFF]" />
                        <div>
                          <p className="text-xs font-bold text-slate-800">Consulta: {a.doctor} • {a.time}</p>
                          <p className="text-[10px] text-slate-600 font-medium">{a.spec} • {a.type} • {a.status}</p>
                        </div>
                      </div>
                      <Badge variant={a.status === "Realizada" ? "success" : a.status === "Cancelada" ? "danger" : "info"}>{a.status}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <Card title="Conta" subtitle="Configurações básicas" icon={Settings} color="slate">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-bold text-slate-800">Sessão ativa</p>
            <p className="text-xs text-slate-500">{authEmail || "email@exemplo.com"} • {userRole}</p>
          </div>
          <Button variant="destructive" icon={LogOut} onClick={handleLogout}>
            Sair
          </Button>
        </div>
      </Card>

      <Card title="Atualização de cadastro" subtitle="Tela mock (placeholder)" icon={User} color="blue">
        <p className="text-sm text-slate-500">
          Aqui entra a tela de atualização de cadastro do paciente / rede de apoio / médico (conforme permissões).
        </p>
        <Button variant="outline" className="w-full" onClick={() => alert("Placeholder de atualização de cadastro (mock).")}>
          Abrir Atualização
        </Button>
      </Card>

      <Card title="Aviso Legal" subtitle="Sem diagnóstico / sem sugestão" icon={Info} color="orange">
        <p className="text-sm text-slate-600">
          O VIVERCOM é uma ferramenta de organização pessoal. O app não realiza diagnósticos, não sugere condutas e não substitui avaliação médica.
        </p>
      </Card>
    </div>
  );

  // AUTH SCREENS

  if (view === "auth-login") {
    return (
      <div className="min-h-screen bg-[#F2F2F7] flex items-center justify-center p-6">
        <div className="max-w-sm w-full space-y-8">
          <div className="text-center space-y-2">
            <div className="inline-flex bg-[#007AFF] p-4 rounded-[22px] shadow-xl shadow-blue-100 mb-2">
              <Heart className="text-white" size={32} fill="currentColor" />
            </div>
            <h1 className="text-3xl font-black text-[#1C1C1E] tracking-tighter italic">VIVERCOM</h1>
            <h2 className="text-xl font-bold">Acesso ao Portal</h2>
          </div>

          <Card>
            <Input label="E-mail" placeholder="seu@email.com" icon={Mail} value={authEmail} onChange={(e) => setAuthEmail(e.target.value)} />
            <Input
              label="Senha"
              type={passVisible ? "text" : "password"}
              placeholder="••••••••"
              icon={Lock}
              value={authPass}
              onChange={(e) => setAuthPass(e.target.value)}
              right={
                <button type="button" onClick={() => setPassVisible((v) => !v)} className="p-2 rounded-full hover:bg-slate-50 text-slate-400">
                  {passVisible ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              }
            />

            <div className="flex items-center justify-between">
              <button className="text-xs font-black text-[#007AFF] hover:underline" onClick={() => setView("auth-forgot")} type="button">
                Esqueci minha senha
              </button>
              <button className="text-xs font-black text-slate-500 hover:underline" onClick={() => setView("auth-register")} type="button">
                Criar conta
              </button>
            </div>

            {/* ✅ ÚNICA MUDANÇA: botão "Entrar" SEM bloqueio por e-mail/senha */}
            <Button onClick={doLogin} className="w-full mt-2" loading={authLoading}>
              Entrar
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  if (view === "auth-forgot") {
    return (
      <div className="min-h-screen bg-[#F2F2F7] flex items-center justify-center p-6">
        <div className="max-w-sm w-full space-y-6">
          <div className="flex items-center gap-3">
            <button onClick={() => setView("auth-login")} className="p-2 rounded-full hover:bg-white text-[#007AFF]">
              <ChevronLeft size={22} />
            </button>
            <div>
              <h1 className="text-xl font-black">Recuperar senha</h1>
              <p className="text-xs font-bold text-[#8E8E93]">Enviaremos um link para seu e-mail.</p>
            </div>
          </div>

          <Card>
            <Input label="E-mail" placeholder="seu@email.com" icon={Mail} value={authEmail} onChange={(e) => setAuthEmail(e.target.value)} />
            <Button onClick={doForgot} className="w-full" loading={authLoading}>
              Enviar link
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  if (view === "auth-register") {
    const [rRole, setRRole] = useState<Role>("paciente");
    const [rName, setRName] = useState("");
    const [rPass, setRPass] = useState("");
    const [rPassVisible, setRPassVisible] = useState(false);

    return (
      <div className="min-h-screen bg-[#F2F2F7] flex items-center justify-center p-6">
        <div className="max-w-sm w-full space-y-6">
          <div className="flex items-center gap-3">
            <button onClick={() => setView("auth-login")} className="p-2 rounded-full hover:bg-white text-[#007AFF]">
              <ChevronLeft size={22} />
            </button>
            <div>
              <h1 className="text-xl font-black">Criar conta</h1>
              <p className="text-xs font-bold text-[#8E8E93]">Fluxo mock para validação de layout.</p>
            </div>
          </div>

          <Card>
            <Input label="Nome" placeholder="Seu nome" icon={User} value={rName} onChange={(e) => setRName(e.target.value)} />
            <Input label="E-mail" placeholder="seu@email.com" icon={Mail} value={authEmail} onChange={(e) => setAuthEmail(e.target.value)} />
            <Input
              label="Senha"
              type={rPassVisible ? "text" : "password"}
              placeholder="••••••••"
              icon={Lock}
              value={rPass}
              onChange={(e) => setRPass(e.target.value)}
              right={
                <button type="button" onClick={() => setRPassVisible((v) => !v)} className="p-2 rounded-full hover:bg-slate-50 text-slate-400">
                  {rPassVisible ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              }
            />

            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3">
              <p className="text-[10px] font-black text-[#8E8E93] uppercase tracking-widest mb-2">Perfil</p>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setRRole("paciente")}
                  className={`px-3 py-2 rounded-xl text-[10px] font-black uppercase ${
                    rRole === "paciente" ? "bg-white border border-[#E5E5EA] shadow-sm text-slate-800" : "text-slate-400 hover:bg-white/60"
                  }`}
                >
                  Paciente
                </button>
                <button
                  type="button"
                  onClick={() => setRRole("apoio")}
                  className={`px-3 py-2 rounded-xl text-[10px] font-black uppercase ${
                    rRole === "apoio" ? "bg-white border border-[#E5E5EA] shadow-sm text-slate-800" : "text-slate-400 hover:bg-white/60"
                  }`}
                >
                  Apoio
                </button>
                <button
                  type="button"
                  onClick={() => setRRole("medico")}
                  className={`px-3 py-2 rounded-xl text-[10px] font-black uppercase ${
                    rRole === "medico" ? "bg-white border border-[#E5E5EA] shadow-sm text-slate-800" : "text-slate-400 hover:bg-white/60"
                  }`}
                >
                  Médico
                </button>
              </div>
            </div>

            <Button onClick={doRegister} className="w-full" loading={authLoading} icon={Plus}>
              Criar conta
            </Button>

            <p className="text-[11px] text-slate-400 font-bold">Obs.: este cadastro é demonstrativo. Integração real com backend fica para o dev.</p>
          </Card>
        </div>
      </div>
    );
  }

  if (view === "auth-select-profile") {
    return (
      <div className="min-h-screen bg-[#F2F2F7] flex items-center justify-center p-6">
        <div className="max-w-sm w-full space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <button onClick={() => setView("auth-login")} className="p-2 rounded-full hover:bg-white text-[#007AFF]">
              <ChevronLeft size={22} />
            </button>
            <div>
              <h2 className="text-xl font-bold text-slate-800 tracking-tight">Selecione seu perfil</h2>
              <p className="text-xs font-bold text-[#8E8E93]">Mesmo login, diferentes permissões.</p>
            </div>
          </div>

          <button
            onClick={() => {
              setUserRole("paciente");
              setView("app");
              setActiveTab("home");
            }}
            className="w-full p-5 bg-white rounded-3xl border border-[#E5E5EA] flex items-center gap-4 hover:border-blue-400 transition-all group"
          >
            <div className="bg-blue-50 p-3 rounded-2xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <User size={24} />
            </div>
            <div className="text-left">
              <p className="font-bold">Paciente</p>
              <p className="text-xs text-slate-500">Minha jornada de saúde</p>
            </div>
          </button>

          <button
            onClick={() => {
              setUserRole("apoio");
              setView("app");
              setActiveTab("home");
            }}
            className="w-full p-5 bg-white rounded-3xl border border-[#E5E5EA] flex items-center gap-4 hover:border-orange-400 transition-all group"
          >
            <div className="bg-orange-50 p-3 rounded-2xl text-orange-600 group-hover:bg-orange-500 group-hover:text-white transition-colors">
              <HeartHandshake size={24} />
            </div>
            <div className="text-left">
              <p className="font-bold">Rede de Apoio</p>
              <p className="text-xs text-slate-500">Cuidar e monitorar</p>
            </div>
          </button>

          <button
            onClick={() => {
              setUserRole("medico");
              setView("app");
              setActiveTab("home");
            }}
            className="w-full p-5 bg-white rounded-3xl border border-[#E5E5EA] flex items-center gap-4 hover:border-indigo-400 transition-all group"
          >
            <div className="bg-indigo-50 p-3 rounded-2xl text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <Stethoscope size={24} />
            </div>
            <div className="text-left">
              <p className="font-bold">Profissional de Saúde</p>
              <p className="text-xs text-slate-500">Gestão clínica e técnica</p>
            </div>
          </button>
        </div>
      </div>
    );
  }

  // APP shell
  if (view === "app") {
    const headerTitle = activeTab === "home" ? "Painel de Saúde" : activeTab === "calendar" ? "Agenda" : activeTab === "history" ? "Histórico" : "Conta";

    return (
      <div className="min-h-screen bg-[#F2F2F7] flex flex-col md:flex-row text-[#1C1C1E]">
        {/* Sidebar Desktop */}
        <aside className="w-72 bg-white border-r border-[#E5E5EA] p-8 hidden md:flex flex-col sticky top-0 h-screen">
          <div className="flex items-center space-x-3 mb-12">
            <div className="bg-[#007AFF] p-1.5 rounded-lg shadow-lg shadow-blue-100">
              <Heart className="text-white" size={16} fill="currentColor" />
            </div>
            <h1 className="text-lg font-black tracking-tighter italic">VIVERCOM</h1>
          </div>

          <nav className="flex-1 space-y-2">
            {[
              { id: "home" as Tab, label: "Início", icon: Layout },
              { id: "calendar" as Tab, label: "Agenda", icon: Calendar },
              { id: "history" as Tab, label: "Histórico", icon: History },
              { id: "profile" as Tab, label: "Conta", icon: Settings },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3.5 rounded-2xl font-bold transition-all ${
                  activeTab === item.id ? "bg-[#007AFF] text-white shadow-xl shadow-blue-200" : "text-[#8E8E93] hover:bg-slate-50"
                }`}
              >
                <item.icon size={20} />
                <span className="text-sm">{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="mt-auto pt-6 border-t border-slate-100">
            <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2 text-red-500 font-bold text-sm">
              <LogOut size={18} /> Sair
            </button>
          </div>
        </aside>

        {/* Main */}
        <div className="flex-1 flex flex-col">
          <Header title={headerTitle} />

          <main className="flex-1 p-6 md:p-12 pb-32 max-w-4xl mx-auto w-full">
            {activeTab === "home" && renderHome()}
            {activeTab === "calendar" && renderAgenda()}
            {activeTab === "history" && renderHistory()}
            {activeTab === "profile" && renderProfile()}
          </main>
        </div>

        {/* Mobile Nav */}
        <nav className="md:hidden fixed bottom-6 left-6 right-6 bg-white/80 backdrop-blur-2xl border border-[#E5E5EA] rounded-[32px] h-20 shadow-2xl flex items-center justify-around px-4 z-50">
          {[
            { id: "home" as Tab, icon: Layout },
            { id: "calendar" as Tab, icon: Calendar },
            { id: "history" as Tab, icon: History },
            { id: "profile" as Tab, icon: Settings },
          ].map((btn) => (
            <button
              key={btn.id}
              onClick={() => setActiveTab(btn.id)}
              className={`p-3 rounded-2xl transition-all ${
                activeTab === btn.id ? "bg-[#007AFF] text-white shadow-lg shadow-blue-200" : "text-[#8E8E93]"
              }`}
              title={btn.id}
            >
              <btn.icon size={24} />
            </button>
          ))}
        </nav>
      </div>
    );
  }

  return null;
}

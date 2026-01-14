import React, { useMemo, useState } from "react";
import {
  Heart,
  User,
  Activity,
  Plus,
  CheckCircle,
  Users,
  ChevronLeft,
  ChevronRight,
  Smile,
  AlertTriangle,
  FileCheck,
  Clock,
  Calendar,
  Settings,
  Shield,
  Stethoscope,
  X,
  Thermometer,
  MapPin,
  Video,
  Search,
  ClipboardList,
  Layout,
  RefreshCw,
  Trash2,
  Info,
  Edit3,
  LogOut,
} from "lucide-react";

/* =========================================================
  1) DESIGN TOKENS (APPLE-LIKE / PREMIUM)
========================================================= */

const Tokens = {
  colors: {
    primary: "#007AFF",
    success: "#34C759",
    warning: "#FF9500",
    danger: "#FF3B30",
    indigo: "#5856D6",
    text: {
      primary: "#1C1C1E",
      secondary: "#8E8E93",
      tertiary: "#C7C7CC",
    },
    background: "#F2F2F7",
    surface: "#FFFFFF",
    border: "#E5E5EA",
    surface2: "#FAFAFC",
  },
  radius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    full: 9999,
  },
  shadow: {
    sm: "0 2px 8px rgba(0,0,0,0.04)",
    md: "0 8px 24px rgba(0,0,0,0.10)",
  },
};

/* =========================================================
  2) BASE COMPONENTS (DESIGN KIT)
========================================================= */

const cx = (...classes) => classes.filter(Boolean).join(" ");

const Surface = ({ children, className = "", style = {} }) => (
  <div
    className={cx("bg-white", className)}
    style={{
      background: Tokens.colors.surface,
      ...style,
    }}
  >
    {children}
  </div>
);

const Card = ({ children, className = "", title, subtitle, footer }) => (
  <div
    className={cx("p-5 md:p-6", className)}
    style={{
      background: Tokens.colors.surface,
      border: `1px solid ${Tokens.colors.border}`,
      borderRadius: Tokens.radius.xl,
      boxShadow: Tokens.shadow.sm,
    }}
  >
    {(title || subtitle) && (
      <div className="mb-4">
        {title && (
          <h3
            className="text-[17px] font-bold tracking-tight"
            style={{ color: Tokens.colors.text.primary }}
          >
            {title}
          </h3>
        )}
        {subtitle && (
          <p
            className="text-[13px] font-medium"
            style={{ color: Tokens.colors.text.secondary }}
          >
            {subtitle}
          </p>
        )}
      </div>
    )}
    <div className="space-y-4">{children}</div>
    {footer && (
      <div
        className="mt-5 pt-4"
        style={{ borderTop: `1px solid ${Tokens.colors.background}` }}
      >
        {footer}
      </div>
    )}
  </div>
);

const Badge = ({ children, variant = "default" }) => {
  const map = {
    default: { bg: "#F1F2F6", fg: "#5C5C60" },
    success: { bg: "#E9F9EE", fg: Tokens.colors.success },
    info: { bg: "#EBF5FF", fg: Tokens.colors.primary },
    warning: { bg: "#FFF4E5", fg: Tokens.colors.warning },
    danger: { bg: "#FFEBEC", fg: Tokens.colors.danger },
    indigo: { bg: "#EEEAFE", fg: Tokens.colors.indigo },
  };
  const s = map[variant] || map.default;
  return (
    <span
      className="px-2.5 py-1 rounded-lg text-[11px] font-bold tracking-tight inline-flex items-center gap-1"
      style={{ background: s.bg, color: s.fg }}
    >
      {children}
    </span>
  );
};

const Button = ({
  children,
  variant = "primary",
  icon: Icon,
  onClick,
  className = "",
  loading = false,
  disabled = false,
  size = "md",
  type = "button",
}) => {
  const sizes = {
    sm: "px-4 py-2.5 text-[12px] rounded-2xl",
    md: "px-5 py-3 text-sm rounded-2xl",
    lg: "px-6 py-3.5 text-sm rounded-[22px]",
  };
  const styles = {
    primary: {
      background: Tokens.colors.primary,
      color: "white",
      border: "1px solid transparent",
    },
    secondary: {
      background: "#F1F2F6",
      color: Tokens.colors.text.primary,
      border: `1px solid ${Tokens.colors.border}`,
    },
    ghost: {
      background: "transparent",
      color: Tokens.colors.primary,
      border: `1px solid ${Tokens.colors.border}`,
    },
    destructive: {
      background: "#FFEBEC",
      color: Tokens.colors.danger,
      border: "1px solid transparent",
    },
  };
  const s = styles[variant] || styles.primary;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={cx(
        "inline-flex items-center justify-center font-semibold transition-all active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100",
        sizes[size],
        className
      )}
      style={{
        ...s,
        boxShadow: variant === "primary" ? "0 6px 18px rgba(0,122,255,0.18)" : "none",
      }}
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

const Input = ({ label, placeholder, type = "text", value, onChange }) => (
  <div className="space-y-1.5 w-full">
    {label && (
      <label
        className="text-[12px] font-bold px-1 uppercase tracking-wider"
        style={{ color: Tokens.colors.text.secondary }}
      >
        {label}
      </label>
    )}
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full border-0 px-4 py-3.5 text-sm focus:ring-2 focus:ring-blue-100 transition-all"
      style={{
        background: Tokens.colors.background,
        borderRadius: Tokens.radius.xl,
        color: Tokens.colors.text.primary,
      }}
    />
  </div>
);

const Textarea = ({ label, placeholder, value, onChange, rows = 5 }) => (
  <div className="space-y-1.5 w-full">
    {label && (
      <label
        className="text-[12px] font-bold px-1 uppercase tracking-wider"
        style={{ color: Tokens.colors.text.secondary }}
      >
        {label}
      </label>
    )}
    <textarea
      rows={rows}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full border-0 px-4 py-3.5 text-sm focus:ring-2 focus:ring-blue-100 transition-all resize-none"
      style={{
        background: Tokens.colors.background,
        borderRadius: Tokens.radius.xl,
        color: Tokens.colors.text.primary,
      }}
    />
  </div>
);

const Modal = ({ open, title, subtitle, children, onClose }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100]">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="absolute inset-x-0 top-10 md:top-16 px-4">
        <div
          className="mx-auto max-w-lg p-5 md:p-6"
          style={{
            background: "rgba(255,255,255,0.92)",
            border: `1px solid ${Tokens.colors.border}`,
            borderRadius: Tokens.radius.xl,
            boxShadow: Tokens.shadow.md,
            backdropFilter: "blur(16px)",
          }}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-[17px] font-black" style={{ color: Tokens.colors.text.primary }}>
                {title}
              </h3>
              {subtitle && (
                <p className="text-[13px] font-medium mt-1" style={{ color: Tokens.colors.text.secondary }}>
                  {subtitle}
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-2xl"
              style={{ color: Tokens.colors.text.secondary }}
              aria-label="Fechar"
            >
              <X size={18} />
            </button>
          </div>
          <div className="mt-4">{children}</div>
        </div>
      </div>
    </div>
  );
};

/* =========================================================
  3) UI PLAYGROUND (INTERNAL DOC)
========================================================= */

const UIPlayground = () => (
  <div className="space-y-8">
    <div>
      <h1 className="text-3xl md:text-4xl font-black tracking-tight" style={{ color: Tokens.colors.text.primary }}>
        Design System
      </h1>
      <p className="text-sm font-medium mt-2" style={{ color: Tokens.colors.text.secondary }}>
        Biblioteca de componentes premium VitaFlow (tokens + componentes base).
      </p>
    </div>

    <Card title="Botões" subtitle="Variações e estados">
      <div className="flex flex-wrap gap-3">
        <Button icon={Plus}>Primary</Button>
        <Button variant="secondary" icon={Settings}>
          Secondary
        </Button>
        <Button variant="ghost" icon={Info}>
          Ghost
        </Button>
        <Button variant="destructive" icon={Trash2}>
          Destructive
        </Button>
        <Button loading icon={RefreshCw}>
          Loading
        </Button>
      </div>
    </Card>

    <Card title="Inputs" subtitle="Campos padrão">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="Nome" placeholder="Ex: Ricardo Souza" value="" onChange={() => {}} />
        <Input label="Telefone" placeholder="(11) 99999-9999" value="" onChange={() => {}} />
      </div>
    </Card>

    <Card title="Badges" subtitle="Estados">
      <div className="flex flex-wrap gap-2">
        <Badge>Default</Badge>
        <Badge variant="info">Info</Badge>
        <Badge variant="success">Sucesso</Badge>
        <Badge variant="warning">Atenção</Badge>
        <Badge variant="danger">Crítico</Badge>
        <Badge variant="indigo">Indigo</Badge>
      </div>
    </Card>
  </div>
);

/* =========================================================
  4) APP
========================================================= */

function startOfMonthISO(d = new Date()) {
  const x = new Date(d.getFullYear(), d.getMonth(), 1);
  return x.toISOString().slice(0, 10);
}

function todayISO(d = new Date()) {
  return d.toISOString().slice(0, 10);
}

function clampInt(n, min, max) {
  const x = parseInt(n, 10);
  if (Number.isNaN(x)) return min;
  return Math.max(min, Math.min(max, x));
}

export default function App() {
  // Views
  const [view, setView] = useState("login"); // login | dashboard
  const [userRole, setUserRole] = useState(null); // paciente | medico | apoio

  // Navigation in dashboard
  const [activeTab, setActiveTab] = useState("home"); // home | calendar | history | playground | profileUpdate
  const [selectedPatientId, setSelectedPatientId] = useState(null);

  // Back/menu behavior
  const [backSheetOpen, setBackSheetOpen] = useState(false);

  // Mock Data (in-memory)
  const [patients] = useState([
    {
      id: "p1",
      name: "Ricardo Souza",
      code: "VF-123",
      birth: "12/05/1985",
      blood: "O+",
      phone: "(11) 98888-7777",
    },
  ]);

  const [patientProfile, setPatientProfile] = useState({
    fullName: "Ricardo Souza",
    phone: "(11) 98888-7777",
    address: "Rua Exemplo, 123 - São Paulo/SP",
    blood: "O+",
    healthPlan: "Plano Vida - 000123",
    referenceDoctors: "Dr. Alberto Rossi",
  });

  // Patient daily report
  const [dailyReport, setDailyReport] = useState("");
  const [disposition, setDisposition] = useState(8);

  // Medication schedule + adherence log
  const [medications, setMedications] = useState([
    { id: "m1", name: "Losartana", dose: "50mg", time: "08:00", instructions: "Em jejum" },
    { id: "m2", name: "Anlodipino", dose: "5mg", time: "20:00", instructions: "" },
  ]);

  // log entries: { dateISO, medicationId, taken(true/false), timeActual }
  const [medLog, setMedLog] = useState([
    { dateISO: "2026-01-02", medicationId: "m1", taken: true, timeActual: "08:05" },
    { dateISO: "2026-01-02", medicationId: "m2", taken: true, timeActual: "20:10" },
    { dateISO: "2026-01-03", medicationId: "m1", taken: true, timeActual: "08:01" },
    { dateISO: "2026-01-03", medicationId: "m2", taken: false, timeActual: "" },
  ]);

  const [appointments, setAppointments] = useState([
    {
      id: "a1",
      doctor: "Dr. Alberto Rossi",
      specialty: "Cardiologia",
      date: "20 Jan 2026",
      time: "14:30",
      type: "Presencial",
      location: "Clínica Vida, Sala 302",
    },
    {
      id: "a2",
      doctor: "Dra. Beatriz",
      specialty: "Clínico Geral",
      date: "05 Fev 2026",
      time: "10:00",
      type: "Teleconsulta",
      location: "Link via App",
    },
  ]);

  // Doctor profile + linkage
  const [doctorProfile] = useState({
    name: "Dr. Alberto Rossi",
    crm: "123456-SP",
    specialty: "Cardiologia",
    myPatients: ["p1"],
  });

  const [medicalNotes, setMedicalNotes] = useState([
    {
      id: "n1",
      patientId: "p1",
      date: "2026-01-10",
      text: "Paciente apresenta boa adesão ao tratamento inicial.",
      visibleToPatient: true,
      visibleToSupport: false,
    },
  ]);

  const LegalBanner = () => (
    <div
      className="p-4 rounded-2xl flex items-start gap-3"
      style={{
        background: "#FFF4E5",
        border: "1px solid #FFE7C2",
      }}
    >
      <AlertTriangle size={18} style={{ color: Tokens.colors.warning }} className="mt-0.5" />
      <div className="text-[11px] leading-relaxed font-medium" style={{ color: "#7A4B00" }}>
        <div className="font-black uppercase tracking-widest text-[10px]" style={{ color: "#7A4B00" }}>
          Aviso legal obrigatório
        </div>
        Este aplicativo é uma ferramenta de organização pessoal. O app <strong>não realiza diagnósticos</strong> e não
        substitui avaliação médica.
      </div>
    </div>
  );

  const login = (role) => {
    setUserRole(role);
    setView("dashboard");
    setActiveTab("home");
    setSelectedPatientId(null);
  };

  const logout = () => {
    setView("login");
    setUserRole(null);
    setActiveTab("home");
    setSelectedPatientId(null);
    setBackSheetOpen(false);
  };

  // Always-visible top back button rule:
  // - Shows inside dashboard as a sticky top bar.
  // - On press: opens a sheet with options:
  //   - Voltar como Paciente / Médico / Rede de Apoio
  //   - Atualizar cadastro (quando role = paciente)
  //   - Encerrar sessão
  const openBackSheet = () => setBackSheetOpen(true);

  const headerContext = useMemo(() => {
    if (view !== "dashboard") return null;

    if (userRole === "medico") {
      if (selectedPatientId) return { title: "Paciente", subtitle: "Visão clínica" };
      return { title: "Médico", subtitle: `${doctorProfile.specialty} • ${doctorProfile.crm}` };
    }

    if (userRole === "apoio") return { title: "Rede de Apoio", subtitle: "Acompanhamento autorizado" };

    // paciente
    if (activeTab === "profileUpdate") return { title: "Atualização de Cadastro", subtitle: "Revise seus dados" };
    return { title: "Paciente", subtitle: "Organização diária" };
  }, [view, userRole, activeTab, selectedPatientId, doctorProfile]);

  // Adherence calculation for month (simple expected = meds * days from start-of-month to today)
  const adherence = useMemo(() => {
    const start = startOfMonthISO(new Date("2026-01-14T00:00:00")); // mock date base
    const end = todayISO(new Date("2026-01-14T00:00:00")); // mock today
    const days = 14; // keep deterministic for mock Jan/14

    const expected = medications.length * days;
    const taken = medLog.filter((e) => e.dateISO >= start && e.dateISO <= end && e.taken).length;

    const pct = expected ? Math.round((taken / expected) * 100) : 0;
    return { expected, taken, pct, days };
  }, [medications.length, medLog]);

  const todaySchedule = useMemo(() => {
    // For mock: show all meds; in real: filter by day/time.
    return medications.map((m) => {
      const logToday = medLog.find((e) => e.dateISO === "2026-01-14" && e.medicationId === m.id);
      return {
        ...m,
        status: logToday?.taken ? "tomado" : "pendente",
        timeActual: logToday?.timeActual || "",
      };
    });
  }, [medications, medLog]);

  const confirmMedication = (medicationId) => {
    // write today log as taken
    const dateISO = "2026-01-14";
    const now = "08:00"; // mock
    setMedLog((prev) => {
      const idx = prev.findIndex((e) => e.dateISO === dateISO && e.medicationId === medicationId);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], taken: true, timeActual: now };
        return copy;
      }
      return [...prev, { dateISO, medicationId, taken: true, timeActual: now }];
    });
  };

  /* =========================
     Screens
  ========================= */

  const LoginView = () => (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: Tokens.colors.background }}>
      <div className="max-w-sm w-full space-y-8">
        <div className="text-center space-y-2">
          <div
            className="inline-flex p-4 mb-2"
            style={{
              background: Tokens.colors.primary,
              borderRadius: 22,
              boxShadow: "0 18px 28px rgba(0,122,255,0.18)",
            }}
          >
            <Heart className="text-white" size={32} fill="currentColor" />
          </div>
          <h1 className="text-3xl font-black tracking-tighter italic" style={{ color: Tokens.colors.text.primary }}>
            VitaFlow
          </h1>
          <p className="text-sm font-medium" style={{ color: Tokens.colors.text.secondary }}>
            Saúde com experiência premium.
          </p>
        </div>

        <Card>
          <div className="text-center">
            <div
              className="text-[12px] font-black uppercase tracking-widest"
              style={{ color: Tokens.colors.text.secondary }}
            >
              Acessar conta
            </div>
          </div>

          <div className="space-y-3">
            <Button className="w-full" icon={User} onClick={() => login("paciente")}>
              Sou Paciente
            </Button>
            <Button className="w-full" variant="secondary" icon={Stethoscope} onClick={() => login("medico")}>
              Sou Médico
            </Button>
            <Button className="w-full" variant="secondary" icon={Users} onClick={() => login("apoio")}>
              Rede de Apoio
            </Button>
          </div>

          <div className="mt-5">
            <LegalBanner />
          </div>
        </Card>

        <p className="text-center text-[11px] font-medium px-4" style={{ color: Tokens.colors.text.secondary }}>
          Ao entrar, você concorda com nossos termos de privacidade e compartilhamento de dados.
        </p>
      </div>
    </div>
  );

  const StickyTopBar = () => (
    <div className="sticky top-0 z-50 -mx-6 md:-mx-12 px-6 md:px-12 pt-4 pb-3">
      <div
        className="flex items-center justify-between gap-3 px-3 py-2.5"
        style={{
          background: "rgba(255,255,255,0.82)",
          border: `1px solid ${Tokens.colors.border}`,
          borderRadius: Tokens.radius.xl,
          backdropFilter: "blur(18px)",
          boxShadow: Tokens.shadow.sm,
        }}
      >
        <button
          onClick={openBackSheet}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-2xl font-bold"
          style={{ color: Tokens.colors.text.secondary, background: Tokens.colors.background }}
        >
          <ChevronLeft size={18} />
          <span className="text-[12px]">Voltar</span>
        </button>

        <div className="min-w-0 flex-1 text-center">
          <div className="text-[14px] font-black truncate" style={{ color: Tokens.colors.text.primary }}>
            {headerContext?.title || ""}
          </div>
          <div className="text-[11px] font-medium truncate" style={{ color: Tokens.colors.text.secondary }}>
            {headerContext?.subtitle || ""}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {userRole === "paciente" && (
            <button
              onClick={() => setActiveTab("profileUpdate")}
              className="p-2 rounded-2xl"
              style={{ background: Tokens.colors.background, color: Tokens.colors.primary }}
              aria-label="Atualizar cadastro"
              title="Atualizar cadastro"
            >
              <Edit3 size={18} />
            </button>
          )}
          <button
            onClick={() => setActiveTab("playground")}
            className="p-2 rounded-2xl"
            style={{ background: Tokens.colors.background, color: Tokens.colors.text.secondary }}
            aria-label="Design Kit"
            title="Design Kit"
          >
            <Layout size={18} />
          </button>
        </div>
      </div>
    </div>
  );

  const BackSheet = () => (
    <Modal
      open={backSheetOpen}
      title="Para onde você quer voltar?"
      subtitle="Trocar perfil, atualizar cadastro ou encerrar sessão."
      onClose={() => setBackSheetOpen(false)}
    >
      <div className="grid grid-cols-1 gap-2">
        <div
          className="p-3 rounded-2xl"
          style={{ background: Tokens.colors.background, border: `1px solid ${Tokens.colors.border}` }}
        >
          <div className="text-[12px] font-black uppercase tracking-widest" style={{ color: Tokens.colors.text.secondary }}>
            Trocar perfil rapidamente
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-3">
            <Button
              size="sm"
              variant={userRole === "paciente" ? "primary" : "secondary"}
              icon={User}
              onClick={() => {
                setBackSheetOpen(false);
                login("paciente");
              }}
            >
              Paciente
            </Button>
            <Button
              size="sm"
              variant={userRole === "medico" ? "primary" : "secondary"}
              icon={Stethoscope}
              onClick={() => {
                setBackSheetOpen(false);
                login("medico");
              }}
            >
              Médico
            </Button>
            <Button
              size="sm"
              variant={userRole === "apoio" ? "primary" : "secondary"}
              icon={Users}
              onClick={() => {
                setBackSheetOpen(false);
                login("apoio");
              }}
            >
              Apoio
            </Button>
          </div>
        </div>

        {userRole === "paciente" && (
          <Button
            variant="ghost"
            icon={RefreshCw}
            onClick={() => {
              setBackSheetOpen(false);
              setActiveTab("profileUpdate");
            }}
            className="w-full"
          >
            Ir para atualização de cadastro
          </Button>
        )}

        <Button
          variant="destructive"
          icon={LogOut}
          onClick={() => {
            setBackSheetOpen(false);
            logout();
          }}
          className="w-full"
        >
          Encerrar sessão
        </Button>
      </div>
    </Modal>
  );

  const PatientHome = () => (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-4xl font-black tracking-tight" style={{ color: Tokens.colors.text.primary }}>
          Resumo Diário
        </h1>
        <p className="font-medium" style={{ color: Tokens.colors.text.secondary }}>
          Quarta-feira, 14 de Janeiro
        </p>
      </header>

      {/* 1) AGENDA DE REMÉDIOS EM PRIMEIRO */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-[12px] font-black uppercase tracking-widest" style={{ color: Tokens.colors.text.secondary }}>
            Agenda de remédios
          </h2>
          <Badge variant="info">
            Aderência mês: {adherence.pct}% ({adherence.taken}/{adherence.expected})
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {todaySchedule.map((m) => (
            <Card
              key={m.id}
              className="overflow-hidden"
              title={m.name}
              subtitle={`${m.dose} • ${m.time}${m.instructions ? ` • ${m.instructions}` : ""}`}
              footer={
                <div className="flex items-center justify-between gap-3">
                  {m.status === "tomado" ? (
                    <div className="inline-flex items-center gap-2 text-sm font-bold" style={{ color: Tokens.colors.success }}>
                      <CheckCircle size={18} />
                      Tomado {m.timeActual ? `às ${m.timeActual}` : ""}
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-2 text-sm font-bold" style={{ color: Tokens.colors.warning }}>
                      <Clock size={18} />
                      Pendente
                    </div>
                  )}
                  <Button
                    size="sm"
                    icon={CheckCircle}
                    disabled={m.status === "tomado"}
                    onClick={() => confirmMedication(m.id)}
                  >
                    Confirmar
                  </Button>
                </div>
              }
            >
              <div
                className="p-4 rounded-2xl"
                style={{ background: Tokens.colors.surface2, border: `1px solid ${Tokens.colors.border}` }}
              >
                <div className="flex items-center justify-between">
                  <div className="text-[12px] font-bold" style={{ color: Tokens.colors.text.primary }}>
                    Tratamentos ativos
                  </div>
                  <Badge variant={adherence.pct >= 80 ? "success" : adherence.pct >= 50 ? "warning" : "danger"}>
                    {adherence.pct >= 80 ? "Boa aderência" : adherence.pct >= 50 ? "Atenção" : "Baixa aderência"}
                  </Badge>
                </div>

                <div className="mt-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold" style={{ color: Tokens.colors.text.secondary }}>
                      Aderência do mês
                    </span>
                    <span className="text-[11px] font-black" style={{ color: Tokens.colors.primary }}>
                      {adherence.pct}%
                    </span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ background: Tokens.colors.border }}>
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${Math.min(100, Math.max(0, adherence.pct))}%`,
                        background: Tokens.colors.primary,
                        boxShadow: "0 10px 18px rgba(0,122,255,0.20)",
                      }}
                    />
                  </div>
                  <div className="mt-2 text-[11px] font-medium" style={{ color: Tokens.colors.text.secondary }}>
                    Meta sugerida: 85%+ • Base: {adherence.days} dias no mês (mock)
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* 2) AGENDA DE CONSULTAS MÉDICAS */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-[12px] font-black uppercase tracking-widest" style={{ color: Tokens.colors.text.secondary }}>
            Agenda de consultas
          </h2>
          <Button size="sm" variant="ghost" icon={Calendar} onClick={() => setActiveTab("calendar")}>
            Ver agenda
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {appointments.slice(0, 2).map((appt) => (
            <Card
              key={appt.id}
              className="overflow-hidden"
              title={appt.specialty}
              subtitle={`${appt.doctor} • ${appt.date} • ${appt.time}`}
              footer={
                <div className="flex flex-wrap gap-2 justify-between items-center">
                  <Badge variant={appt.type === "Teleconsulta" ? "indigo" : "info"}>
                    {appt.type === "Teleconsulta" ? <Video size={14} /> : <MapPin size={14} />}
                    {appt.type}
                  </Badge>
                  <div className="text-[12px] font-bold" style={{ color: Tokens.colors.text.secondary }}>
                    {appt.location}
                  </div>
                </div>
              }
            >
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-2" style={{ color: Tokens.colors.text.secondary }}>
                  <Clock size={16} />
                  <span className="text-[12px] font-bold">{appt.time}</span>
                </div>
                <Button size="sm" variant="secondary" icon={Info}>
                  Detalhes
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* 3) RELATO + DISPOSIÇÃO */}
      <section className="space-y-3">
        <h2 className="text-[12px] font-black uppercase tracking-widest px-1" style={{ color: Tokens.colors.text.secondary }}>
          Relato e disposição
        </h2>

        <Card
          title="Como está sua disposição hoje?"
          subtitle="0 muito indisposto • 10 muito disposto"
          footer={
            <div className="flex justify-end">
              <Button size="sm" icon={CheckCircle}>
                Salvar
              </Button>
            </div>
          }
        >
          <Textarea
            label="Relato do dia"
            placeholder="Escreva em linguagem simples como você se sentiu hoje..."
            value={dailyReport}
            onChange={(e) => setDailyReport(e.target.value)}
            rows={4}
          />

          <div
            className="p-4 rounded-2xl"
            style={{ background: Tokens.colors.background, border: `1px solid ${Tokens.colors.border}` }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="inline-flex items-center gap-2">
                <Thermometer size={18} style={{ color: Tokens.colors.primary }} />
                <span className="text-[12px] font-black uppercase tracking-widest" style={{ color: Tokens.colors.text.secondary }}>
                  Disposição
                </span>
              </div>
              <span className="text-xl font-black" style={{ color: Tokens.colors.primary }}>
                {disposition}/10
              </span>
            </div>

            <input
              type="range"
              min="0"
              max="10"
              step="1"
              value={disposition}
              onChange={(e) => setDisposition(clampInt(e.target.value, 0, 10))}
              className="w-full accent-blue-600"
            />

            <div className="flex justify-between mt-2 text-[10px] font-bold" style={{ color: Tokens.colors.text.tertiary }}>
              <span>0</span>
              <span>10</span>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );

  const PatientCalendar = () => (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-black tracking-tight" style={{ color: Tokens.colors.text.primary }}>
          Minha agenda
        </h1>
        <p className="text-sm font-medium" style={{ color: Tokens.colors.text.secondary }}>
          Consultas e compromissos médicos.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-4">
        {appointments.map((appt) => (
          <Card
            key={appt.id}
            title={appt.specialty}
            subtitle={`${appt.date} • ${appt.time}`}
            footer={
              <div className="flex items-center justify-between gap-3">
                <Badge variant={appt.type === "Teleconsulta" ? "indigo" : "info"}>
                  {appt.type === "Teleconsulta" ? <Video size={14} /> : <MapPin size={14} />}
                  {appt.type}
                </Badge>
                <div className="text-[12px] font-bold" style={{ color: Tokens.colors.text.secondary }}>
                  {appt.location}
                </div>
              </div>
            }
          >
            <div className="flex items-center justify-between">
              <div className="text-[13px] font-bold" style={{ color: Tokens.colors.text.primary }}>
                {appt.doctor}
              </div>
              <Button size="sm" variant="secondary" icon={CheckCircle}>
                Confirmar
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  const PatientHistory = () => (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-black tracking-tight" style={{ color: Tokens.colors.text.primary }}>
          Histórico
        </h1>
        <p className="text-sm font-medium" style={{ color: Tokens.colors.text.secondary }}>
          Linha do tempo organizacional (mock).
        </p>
      </header>

      <div className="grid grid-cols-1 gap-4">
        {[{ d: "14 Jan 2026", disp: 8, text: "Hoje me senti melhor, sem dor de cabeça." }].map((x, idx) => (
          <Card
            key={idx}
            title={x.d}
            subtitle={`Disposição: ${x.disp}/10`}
            footer={
              <div className="inline-flex items-center gap-2 text-[12px] font-bold" style={{ color: Tokens.colors.success }}>
                <CheckCircle size={16} />
                Registro salvo
              </div>
            }
          >
            <div className="text-sm" style={{ color: Tokens.colors.text.secondary }}>
              “{x.text}”
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  const PatientProfileUpdate = () => (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-black tracking-tight" style={{ color: Tokens.colors.text.primary }}>
          Atualização de cadastro
        </h1>
        <p className="text-sm font-medium" style={{ color: Tokens.colors.text.secondary }}>
          Revise e mantenha seus dados atualizados (mock).
        </p>
      </header>

      <Card
        title="Dados essenciais"
        subtitle="Informações pessoais e contato"
        footer={
          <div className="flex flex-col sm:flex-row gap-3 justify-end">
            <Button variant="secondary" icon={X} onClick={() => setActiveTab("home")}>
              Cancelar
            </Button>
            <Button icon={CheckCircle} onClick={() => setActiveTab("home")}>
              Salvar alterações
            </Button>
          </div>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Nome completo"
            placeholder="Ex: Ricardo Souza"
            value={patientProfile.fullName}
            onChange={(e) => setPatientProfile((p) => ({ ...p, fullName: e.target.value }))}
          />
          <Input
            label="Telefone"
            placeholder="(11) 99999-9999"
            value={patientProfile.phone}
            onChange={(e) => setPatientProfile((p) => ({ ...p, phone: e.target.value }))}
          />
          <Input
            label="Tipo sanguíneo"
            placeholder="Ex: O+"
            value={patientProfile.blood}
            onChange={(e) => setPatientProfile((p) => ({ ...p, blood: e.target.value }))}
          />
          <Input
            label="Plano de saúde"
            placeholder="Nome e número"
            value={patientProfile.healthPlan}
            onChange={(e) => setPatientProfile((p) => ({ ...p, healthPlan: e.target.value }))}
          />
          <div className="md:col-span-2">
            <Input
              label="Endereço"
              placeholder="Rua, número, cidade"
              value={patientProfile.address}
              onChange={(e) => setPatientProfile((p) => ({ ...p, address: e.target.value }))}
            />
          </div>
          <div className="md:col-span-2">
            <Input
              label="Médicos de referência"
              placeholder="Ex: Dr. X, Dra. Y"
              value={patientProfile.referenceDoctors}
              onChange={(e) => setPatientProfile((p) => ({ ...p, referenceDoctors: e.target.value }))}
            />
          </div>
        </div>
      </Card>
    </div>
  );

  const DoctorDashboard = () => {
    const selectedPatient = selectedPatientId ? patients.find((p) => p.id === selectedPatientId) : null;
    const [newNote, setNewNote] = useState("");
    const [visibleToPatient, setVisibleToPatient] = useState(true);
    const [visibleToSupport, setVisibleToSupport] = useState(false);

    const saveNote = () => {
      if (!selectedPatient) return;
      const trimmed = newNote.trim();
      if (!trimmed) return;

      const note = {
        id: `n${Math.random().toString(16).slice(2)}`,
        patientId: selectedPatient.id,
        date: "2026-01-14",
        text: trimmed,
        visibleToPatient,
        visibleToSupport,
      };
      setMedicalNotes((prev) => [note, ...prev]);
      setNewNote("");
      setVisibleToPatient(true);
      setVisibleToSupport(false);
    };

    if (!selectedPatient) {
      return (
        <div className="space-y-6">
          <header className="space-y-2">
            <h1 className="text-4xl font-black tracking-tight" style={{ color: Tokens.colors.text.primary }}>
              Seus pacientes
            </h1>
            <p className="font-medium" style={{ color: Tokens.colors.text.secondary }}>
              Gerencie sua lista de acompanhamento.
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card title="Pacientes ativos" subtitle="Mock">
              <div className="flex items-center gap-3">
                <Users size={28} style={{ color: Tokens.colors.primary }} />
                <div className="text-3xl font-black">{doctorProfile.myPatients.length}</div>
              </div>
            </Card>
            <Card title="Consultas hoje" subtitle="Mock">
              <div className="flex items-center gap-3">
                <Calendar size={28} style={{ color: Tokens.colors.indigo }} />
                <div className="text-3xl font-black">2</div>
              </div>
            </Card>
            <Card title="Alertas" subtitle="Mock">
              <div className="flex items-center gap-3">
                <AlertTriangle size={28} style={{ color: Tokens.colors.warning }} />
                <div className="text-3xl font-black">1</div>
              </div>
            </Card>
          </div>

          <Card
            title="Meus pacientes vinculados"
            subtitle="Toque para abrir"
            footer={
              <Button variant="ghost" icon={Search} className="w-full">
                Vincular novo paciente (mock)
              </Button>
            }
          >
            <div className="space-y-3">
              {patients
                .filter((p) => doctorProfile.myPatients.includes(p.id))
                .map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPatientId(p.id)}
                    className="w-full text-left p-4 rounded-2xl transition-all"
                    style={{
                      background: Tokens.colors.surface2,
                      border: `1px solid ${Tokens.colors.border}`,
                    }}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-12 h-12 rounded-2xl flex items-center justify-center"
                          style={{ background: "#EBF5FF", color: Tokens.colors.primary }}
                        >
                          <User size={20} />
                        </div>
                        <div>
                          <div className="text-[15px] font-black" style={{ color: Tokens.colors.text.primary }}>
                            {p.name}
                          </div>
                          <div className="text-[11px] font-bold" style={{ color: Tokens.colors.text.secondary }}>
                            {p.code} • {p.phone}
                          </div>
                        </div>
                      </div>
                      <ChevronRight size={18} style={{ color: Tokens.colors.text.tertiary }} />
                    </div>
                  </button>
                ))}
            </div>
          </Card>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <header className="space-y-2">
          <h1 className="text-3xl font-black tracking-tight" style={{ color: Tokens.colors.text.primary }}>
            {selectedPatient.name}
          </h1>
          <div className="flex flex-wrap gap-2">
            <Badge variant="info">{selectedPatient.code}</Badge>
            <Badge>{selectedPatient.birth}</Badge>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card title="Cadastro do paciente" subtitle="Dados vitais e contato">
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span style={{ color: Tokens.colors.text.secondary }}>Tipo sanguíneo</span>
                <span className="font-bold" style={{ color: Tokens.colors.text.primary }}>
                  {selectedPatient.blood}
                </span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: Tokens.colors.text.secondary }}>Telefone</span>
                <span className="font-bold" style={{ color: Tokens.colors.text.primary }}>
                  {selectedPatient.phone}
                </span>
              </div>
            </div>
          </Card>

          <Card
            title="Nova nota clínica"
            subtitle="Responsabilidade do profissional"
            footer={
              <div className="flex flex-col sm:flex-row gap-3 justify-end">
                <Button variant="secondary" icon={X} onClick={() => setNewNote("")}>
                  Limpar
                </Button>
                <Button icon={CheckCircle} onClick={saveNote}>
                  Salvar nota
                </Button>
              </div>
            }
          >
            <Textarea
              label="Observações"
              placeholder="Anote observações da consulta..."
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              rows={4}
            />
            <div className="flex flex-wrap gap-3">
              <label className="inline-flex items-center gap-2 text-[12px] font-bold" style={{ color: Tokens.colors.text.secondary }}>
                <input
                  type="checkbox"
                  checked={visibleToPatient}
                  onChange={(e) => setVisibleToPatient(e.target.checked)}
                />
                Visível ao paciente
              </label>
              <label className="inline-flex items-center gap-2 text-[12px] font-bold" style={{ color: Tokens.colors.text.secondary }}>
                <input
                  type="checkbox"
                  checked={visibleToSupport}
                  onChange={(e) => setVisibleToSupport(e.target.checked)}
                />
                Visível à rede
              </label>
            </div>
          </Card>
        </div>

        <Card title="Notas registradas" subtitle="Histórico clínico (mock)">
          <div className="space-y-3">
            {medicalNotes
              .filter((n) => n.patientId === selectedPatient.id)
              .map((n) => (
                <div
                  key={n.id}
                  className="p-4 rounded-2xl"
                  style={{ background: Tokens.colors.surface2, border: `1px solid ${Tokens.colors.border}` }}
                >
                  <div className="flex items-center justify-between gap-3">
                    <Badge variant="default">{n.date}</Badge>
                    <div className="flex gap-2">
                      {n.visibleToPatient && <Badge variant="info">Paciente</Badge>}
                      {n.visibleToSupport && <Badge variant="indigo">Rede</Badge>}
                    </div>
                  </div>
                  <p className="text-sm mt-2" style={{ color: Tokens.colors.text.primary }}>
                    {n.text}
                  </p>
                </div>
              ))}
          </div>
        </Card>

        <Button
          variant="destructive"
          icon={ChevronLeft}
          onClick={() => setSelectedPatientId(null)}
          className="w-full"
        >
          Voltar para lista de pacientes
        </Button>
      </div>
    );
  };

  const SupportDashboard = () => (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-4xl font-black tracking-tight" style={{ color: Tokens.colors.text.primary }}>
          Rede de apoio
        </h1>
        <p className="font-medium" style={{ color: Tokens.colors.text.secondary }}>
          Acompanhamento autorizado (mock).
        </p>
      </header>

      <Card
        title="Visão rápida"
        subtitle="Sem acesso a dados sensíveis por padrão"
        footer={
          <Button variant="ghost" icon={Shield} className="w-full">
            Ajustar permissões (mock)
          </Button>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl" style={{ background: Tokens.colors.surface2, border: `1px solid ${Tokens.colors.border}` }}>
            <div className="text-[12px] font-black uppercase tracking-widest" style={{ color: Tokens.colors.text.secondary }}>
              Alertas
            </div>
            <div className="text-3xl font-black mt-2">1</div>
          </div>
          <div className="p-4 rounded-2xl" style={{ background: Tokens.colors.surface2, border: `1px solid ${Tokens.colors.border}` }}>
            <div className="text-[12px] font-black uppercase tracking-widest" style={{ color: Tokens.colors.text.secondary }}>
              Próxima consulta
            </div>
            <div className="text-[14px] font-black mt-2" style={{ color: Tokens.colors.text.primary }}>
              20 Jan • Cardiologia
            </div>
          </div>
        </div>
      </Card>

      <Card title="Resumo de rotina (mock)" subtitle="Apenas leitura">
        <div className="space-y-2 text-sm" style={{ color: Tokens.colors.text.secondary }}>
          <div className="flex items-center gap-2">
            <CheckCircle size={16} style={{ color: Tokens.colors.success }} />
            Medicação da manhã confirmada
          </div>
          <div className="flex items-center gap-2">
            <Clock size={16} style={{ color: Tokens.colors.warning }} />
            Medicação da noite pendente
          </div>
        </div>
      </Card>
    </div>
  );

  /* =========================
     Layout Shell
  ========================= */

  const DashboardShell = ({ children }) => (
    <div className="min-h-screen flex flex-col md:flex-row" style={{ background: Tokens.colors.background, color: Tokens.colors.text.primary }}>
      {/* Desktop Sidebar */}
      <aside
        className="hidden md:flex w-72 p-8 flex-col sticky top-0 h-screen"
        style={{
          background: "rgba(255,255,255,0.82)",
          borderRight: `1px solid ${Tokens.colors.border}`,
          backdropFilter: "blur(18px)",
        }}
      >
        <div className="flex items-center gap-3 mb-10">
          <div className="p-2 rounded-xl" style={{ background: Tokens.colors.primary }}>
            <Heart size={18} className="text-white" fill="currentColor" />
          </div>
          <div className="font-black italic tracking-tight">VitaFlow</div>
        </div>

        <nav className="space-y-2">
          <button
            onClick={() => {
              setActiveTab("home");
              setSelectedPatientId(null);
            }}
            className={cx("w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold transition-all")}
            style={{
              background: activeTab === "home" ? Tokens.colors.primary : "transparent",
              color: activeTab === "home" ? "white" : Tokens.colors.text.secondary,
              border: activeTab === "home" ? "1px solid transparent" : `1px solid ${Tokens.colors.border}`,
            }}
          >
            <Activity size={18} />
            <span className="text-sm">{userRole === "medico" ? "Pacientes" : "Painel"}</span>
          </button>

          {userRole === "paciente" && (
            <>
              <button
                onClick={() => setActiveTab("calendar")}
                className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold transition-all"
                style={{
                  background: activeTab === "calendar" ? Tokens.colors.primary : "transparent",
                  color: activeTab === "calendar" ? "white" : Tokens.colors.text.secondary,
                  border: activeTab === "calendar" ? "1px solid transparent" : `1px solid ${Tokens.colors.border}`,
                }}
              >
                <Calendar size={18} />
                <span className="text-sm">Agenda</span>
              </button>

              <button
                onClick={() => setActiveTab("history")}
                className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold transition-all"
                style={{
                  background: activeTab === "history" ? Tokens.colors.primary : "transparent",
                  color: activeTab === "history" ? "white" : Tokens.colors.text.secondary,
                  border: activeTab === "history" ? "1px solid transparent" : `1px solid ${Tokens.colors.border}`,
                }}
              >
                <FileCheck size={18} />
                <span className="text-sm">Histórico</span>
              </button>

              <button
                onClick={() => setActiveTab("profileUpdate")}
                className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold transition-all"
                style={{
                  background: activeTab === "profileUpdate" ? Tokens.colors.primary : "transparent",
                  color: activeTab === "profileUpdate" ? "white" : Tokens.colors.text.secondary,
                  border: activeTab === "profileUpdate" ? "1px solid transparent" : `1px solid ${Tokens.colors.border}`,
                }}
              >
                <RefreshCw size={18} />
                <span className="text-sm">Atualizar cadastro</span>
              </button>
            </>
          )}

          <button
            onClick={() => setActiveTab("playground")}
            className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold transition-all"
            style={{
              background: activeTab === "playground" ? Tokens.colors.primary : "transparent",
              color: activeTab === "playground" ? "white" : Tokens.colors.text.secondary,
              border: activeTab === "playground" ? "1px solid transparent" : `1px solid ${Tokens.colors.border}`,
            }}
          >
            <Layout size={18} />
            <span className="text-sm">Design Kit</span>
          </button>
        </nav>

        <div className="mt-auto">
          <Button variant="destructive" icon={LogOut} className="w-full" onClick={logout}>
            Encerrar sessão
          </Button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 px-6 md:px-12 pb-32">
        <StickyTopBar />
        <div className="max-w-5xl mx-auto w-full">{children}</div>
      </main>

      {/* Mobile Nav (floating) */}
      <nav
        className="md:hidden fixed bottom-6 left-6 right-6 h-20 px-4 flex items-center justify-around z-50"
        style={{
          background: "rgba(255,255,255,0.82)",
          border: `1px solid ${Tokens.colors.border}`,
          borderRadius: 32,
          boxShadow: Tokens.shadow.md,
          backdropFilter: "blur(18px)",
        }}
      >
        <button
          onClick={() => {
            setActiveTab("home");
            setSelectedPatientId(null);
          }}
          className="p-3 rounded-2xl"
          style={{
            background: activeTab === "home" ? Tokens.colors.primary : "transparent",
            color: activeTab === "home" ? "white" : Tokens.colors.text.secondary,
          }}
          aria-label="Home"
        >
          <Activity size={24} />
        </button>

        {userRole === "paciente" && (
          <button
            onClick={() => setActiveTab("calendar")}
            className="p-3 rounded-2xl"
            style={{
              background: activeTab === "calendar" ? Tokens.colors.primary : "transparent",
              color: activeTab === "calendar" ? "white" : Tokens.colors.text.secondary,
            }}
            aria-label="Agenda"
          >
            <Calendar size={24} />
          </button>
        )}

        <button
          onClick={() => setActiveTab("playground")}
          className="p-3 rounded-2xl"
          style={{
            background: activeTab === "playground" ? Tokens.colors.primary : "transparent",
            color: activeTab === "playground" ? "white" : Tokens.colors.text.secondary,
          }}
          aria-label="Design Kit"
        >
          <Layout size={24} />
        </button>

        <button
          onClick={openBackSheet}
          className="p-3 rounded-2xl"
          style={{ color: Tokens.colors.danger }}
          aria-label="Voltar / trocar perfil"
        >
          <ChevronLeft size={24} />
        </button>
      </nav>

      <BackSheet />
    </div>
  );

  /* =========================
     Router (simple)
  ========================= */

  if (view === "login") return <LoginView />;

  const content = (() => {
    if (activeTab === "playground") return <UIPlayground />;
    if (userRole === "medico") return <DoctorDashboard />;
    if (userRole === "apoio") return <SupportDashboard />;

    // paciente
    if (activeTab === "calendar") return <PatientCalendar />;
    if (activeTab === "history") return <PatientHistory />;
    if (activeTab === "profileUpdate") return <PatientProfileUpdate />;
    return <PatientHome />;
  })();

  return <DashboardShell>{content}</DashboardShell>;
}

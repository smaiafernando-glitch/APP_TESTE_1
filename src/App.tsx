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
  FileCheck,
  Clock,
  Calendar,
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
  Mail,
  Lock,
  Eye,
  EyeOff,
  KeyRound,
  Pencil,
  LogOut,
} from "lucide-react";

/**
 * VIVERCOM — Single-file demo app
 * - Apple-like design tokens + components
 * - Login with email/senha + selecionar perfil (paciente/médico/rede)
 * - Recuperar senha
 * - Header fixo ÚNICO (sem duplicar ao scroll)
 * - Paciente: Remédios primeiro, Consultas, Disposição (0-10), Aderência do mês, Atualização de cadastro
 * - Médico: lista de pacientes, detalhes, notas e prescrições (mock)
 * - Rede de apoio: visão reduzida (mock)
 */

/* ------------------------------ 1) DESIGN TOKENS ------------------------------ */

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
  },
  radius: {
    sm: "10px",
    md: "14px",
    lg: "18px",
    xl: "24px",
    full: "9999px",
  },
  shadow: {
    sm: "0 2px 10px rgba(0,0,0,0.05)",
    md: "0 6px 22px rgba(0,0,0,0.10)",
  },
};

/* ------------------------------ 2) BASE COMPONENTS ------------------------------ */

const cx = (...parts: Array<string | undefined | false>) => parts.filter(Boolean).join(" ");

const Card: React.FC<{ title?: string; subtitle?: string; className?: string; children: React.ReactNode; footer?: React.ReactNode }> = ({
  title,
  subtitle,
  className = "",
  children,
  footer,
}) => (
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
        {title && <h3 className="text-[17px] font-black tracking-tight" style={{ color: Tokens.colors.text.primary }}>{title}</h3>}
        {subtitle && <p className="text-[13px] font-semibold" style={{ color: Tokens.colors.text.secondary }}>{subtitle}</p>}
      </div>
    )}
    <div className="space-y-4">{children}</div>
    {footer && (
      <div className="mt-5 pt-4" style={{ borderTop: `1px solid ${Tokens.colors.background}` }}>
        {footer}
      </div>
    )}
  </div>
);

const Badge: React.FC<{ variant?: "default" | "info" | "success" | "warning" | "danger"; children: React.ReactNode }> = ({
  variant = "default",
  children,
}) => {
  const map: Record<string, { bg: string; fg: string }> = {
    default: { bg: "#EEF0F4", fg: Tokens.colors.text.secondary },
    info: { bg: "#EBF5FF", fg: Tokens.colors.primary },
    success: { bg: "#E9F9EE", fg: Tokens.colors.success },
    warning: { bg: "#FFF4E5", fg: Tokens.colors.warning },
    danger: { bg: "#FFEBEC", fg: Tokens.colors.danger },
  };
  const s = map[variant];
  return (
    <span
      className="px-2.5 py-1 text-[11px] font-black tracking-tight inline-flex items-center gap-1"
      style={{ background: s.bg, color: s.fg, borderRadius: "10px" }}
    >
      {children}
    </span>
  );
};

const Button: React.FC<{
  variant?: "primary" | "secondary" | "ghost" | "destructive";
  icon?: React.ElementType;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
  children: React.ReactNode;
}> = ({ variant = "primary", icon: Icon, loading, disabled, className = "", onClick, children }) => {
  const base =
    "inline-flex items-center justify-center gap-2 font-black tracking-tight transition-all active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100";
  const size = "px-5 py-3 text-[13px]";
  const styles: Record<string, React.CSSProperties> = {
    primary: { background: Tokens.colors.primary, color: "white" },
    secondary: { background: "#EEF0F4", color: Tokens.colors.text.primary },
    ghost: { background: "transparent", color: Tokens.colors.primary },
    destructive: { background: "#FFEBEC", color: Tokens.colors.danger },
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={cx(base, size, "rounded-2xl", className)}
      style={styles[variant]}
    >
      {loading ? <RefreshCw size={18} className="animate-spin" /> : Icon ? <Icon size={18} /> : null}
      {children}
    </button>
  );
};

const Input: React.FC<{
  label?: string;
  placeholder?: string;
  type?: string;
  value?: string;
  onChange?: (v: string) => void;
  right?: React.ReactNode;
}> = ({ label, placeholder, type = "text", value, onChange, right }) => (
  <div className="space-y-1.5">
    {label && (
      <label className="px-1 text-[11px] font-black uppercase tracking-widest" style={{ color: Tokens.colors.text.secondary }}>
        {label}
      </label>
    )}
    <div className="flex items-center gap-2 px-4 py-3.5 rounded-2xl" style={{ background: Tokens.colors.background }}>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent outline-none text-[14px] placeholder:font-semibold"
        style={{ color: Tokens.colors.text.primary }}
      />
      {right}
    </div>
  </div>
);

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="px-1 text-[11px] font-black uppercase tracking-widest" style={{ color: Tokens.colors.text.secondary }}>
    {children}
  </div>
);

/* ------------------------------ 3) APP TYPES & MOCK DATA ------------------------------ */

type Role = "paciente" | "medico" | "apoio";
type View = "auth" | "forgot" | "dashboard";

type TabPaciente = "home" | "calendar" | "history" | "access" | "profileUpdate";
type TabMedico = "patients" | "calendar";
type TabApoio = "home";

type Patient = {
  id: string;
  name: string;
  code: string;
  birth: string;
  blood: string;
  phone: string;
  adherence: number; // 0..100
  medsToday: Array<{ id: string; name: string; dose: string; time: string; note?: string; taken?: boolean }>;
  appointments: Array<{ id: string; specialty: string; doctor: string; dateLabel: string; day: string; month: string; time: string; type: "Presencial" | "Teleconsulta"; location: string }>;
  dispositionWeekAvg: number; // 0..10
};

const mockPatient: Patient = {
  id: "p1",
  name: "Ricardo Souza",
  code: "VC-123",
  birth: "12/05/1985",
  blood: "O+",
  phone: "(11) 98888-7777",
  adherence: 78,
  medsToday: [
    { id: "m1", name: "Losartana", dose: "50mg", time: "08:00", note: "Em jejum", taken: false },
    { id: "m2", name: "Anlodipino", dose: "5mg", time: "20:00", taken: false },
  ],
  appointments: [
    {
      id: "a1",
      specialty: "Cardiologia",
      doctor: "Dr. Alberto Rossi",
      dateLabel: "20 Jan 2026",
      day: "20",
      month: "JAN",
      time: "14:30",
      type: "Presencial",
      location: "Clínica Vida, Sala 302",
    },
    {
      id: "a2",
      specialty: "Clínico Geral",
      doctor: "Dra. Beatriz",
      dateLabel: "05 Fev 2026",
      day: "05",
      month: "FEV",
      time: "10:00",
      type: "Teleconsulta",
      location: "Link via App",
    },
  ],
  dispositionWeekAvg: 8,
};

/* ------------------------------ 4) APP ------------------------------ */

export default function App() {
  // auth
  const [view, setView] = useState<View>("auth");
  const [role, setRole] = useState<Role>("paciente");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(false);

  // dashboard
  const [patient] = useState<Patient>(mockPatient);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);

  const [tabPaciente, setTabPaciente] = useState<TabPaciente>("home");
  const [tabMedico, setTabMedico] = useState<TabMedico>("patients");
  const [tabApoio, setTabApoio] = useState<TabApoio>("home");

  // back sheet (fixed button behavior)
  const [showBackSheet, setShowBackSheet] = useState(false);

  // patient daily
  const [dailyText, setDailyText] = useState("");
  const [disposition, setDisposition] = useState(8);

  // meds toggle (mock)
  const [meds, setMeds] = useState(patient.medsToday);

  // legal banner
  const [showLegal, setShowLegal] = useState(true);

  const headerContext = useMemo(() => {
    if (view === "auth") {
      return { title: "Acessar conta", subtitle: "Entre com seu e-mail e senha" };
    }
    if (view === "forgot") {
      return { title: "Recuperar senha", subtitle: "Vamos te ajudar a acessar" };
    }
    // dashboard
    if (role === "paciente") {
      const map: Record<TabPaciente, { title: string; subtitle: string }> = {
        home: { title: "Paciente", subtitle: "Organização diária" },
        calendar: { title: "Agenda", subtitle: "Consultas e lembretes" },
        history: { title: "Histórico", subtitle: "Linha do tempo" },
        access: { title: "Médicos e Acessos", subtitle: "Controle de compartilhamento" },
        profileUpdate: { title: "Atualizar cadastro", subtitle: "Dados pessoais e saúde" },
      };
      return map[tabPaciente];
    }
    if (role === "medico") {
      if (selectedPatientId) return { title: "Paciente", subtitle: "Visão clínica (somente organizacional)" };
      return tabMedico === "patients"
        ? { title: "Médico", subtitle: "Pacientes vinculados" }
        : { title: "Agenda médica", subtitle: "Consultas do dia" };
    }
    return { title: "Rede de apoio", subtitle: "Acompanhamento autorizado" };
  }, [view, role, tabPaciente, tabMedico, selectedPatientId]);

  function logout() {
    setView("auth");
    setSelectedPatientId(null);
    setTabPaciente("home");
    setTabMedico("patients");
    setTabApoio("home");
    setEmail("");
    setPassword("");
  }

  function login() {
    setIsAuthLoading(true);
    setTimeout(() => {
      setIsAuthLoading(false);
      setView("dashboard");
    }, 650);
  }

  function openBackSheet() {
    // keep the back button fixed on screen, with choices:
    setShowBackSheet(true);
  }

  function applyBackAction(action: "switchRole" | "toAuth" | "toProfileUpdate") {
    setShowBackSheet(false);

    if (action === "toAuth") {
      logout();
      return;
    }

    if (action === "toProfileUpdate") {
      if (role !== "paciente") {
        setRole("paciente");
      }
      setTabPaciente("profileUpdate");
      return;
    }

    if (action === "switchRole") {
      // go to a simple selector inside auth (keeps app flow)
      setView("auth");
      setPassword("");
      return;
    }
  }

  /* ------------------------------ 5) FIXED HEADER (SINGLE) ------------------------------ */

  const StickyTopBar = () => (
    <div className="sticky top-0 z-50 px-4 md:px-10 pt-4 pb-3">
      <div
        className="flex items-center justify-between gap-3 px-4 py-2.5"
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
          className="inline-flex items-center gap-2 px-3 py-2 rounded-2xl font-black"
          style={{ color: Tokens.colors.text.secondary, background: Tokens.colors.background }}
        >
          <ChevronLeft size={18} />
          <span className="text-[12px]">Voltar</span>
        </button>

        <div className="min-w-0 flex-1 text-center">
          <div className="text-[14px] font-black truncate" style={{ color: Tokens.colors.text.primary }}>
            {headerContext.title}
          </div>
          <div className="text-[11px] truncate font-semibold" style={{ color: Tokens.colors.text.secondary }}>
            {headerContext.subtitle}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {view === "dashboard" && role === "paciente" && tabPaciente !== "profileUpdate" && (
            <button
              onClick={() => setTabPaciente("profileUpdate")}
              className="p-2 rounded-2xl"
              style={{ background: Tokens.colors.background, color: Tokens.colors.primary }}
              title="Atualizar cadastro"
            >
              <Pencil size={18} />
            </button>
          )}

          {view === "dashboard" && (
            <button
              onClick={logout}
              className="p-2 rounded-2xl"
              style={{ background: Tokens.colors.background, color: Tokens.colors.danger }}
              title="Encerrar sessão"
            >
              <LogOut size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );

  /* ------------------------------ 6) SCREENS ------------------------------ */

  const LegalBanner = () =>
    showLegal ? (
      <div className="relative">
        <div
          className="flex items-start gap-3 p-4 rounded-2xl"
          style={{ background: "#FFF4E5", border: "1px solid #FFE1B5" }}
        >
          <Info size={18} style={{ color: Tokens.colors.warning }} />
          <div className="text-[12px] font-semibold leading-relaxed" style={{ color: "#7A4A00" }}>
            <span className="font-black uppercase tracking-widest text-[11px] block mb-1">Aviso legal</span>
            Este aplicativo é uma ferramenta de organização pessoal. O app <strong>não realiza diagnósticos</strong> e não substitui avaliação
            médica.
          </div>
        </div>
        <button
          onClick={() => setShowLegal(false)}
          className="absolute top-2 right-2 p-2 rounded-2xl"
          style={{ color: Tokens.colors.warning, background: "rgba(255,255,255,0.65)" }}
        >
          <X size={14} />
        </button>
      </div>
    ) : null;

  const AuthScreen = () => (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: Tokens.colors.background }}>
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-2">
          <div
            className="inline-flex items-center justify-center p-4"
            style={{
              background: Tokens.colors.primary,
              borderRadius: "22px",
              boxShadow: "0 18px 40px rgba(0,122,255,0.20)",
            }}
          >
            <Heart size={30} className="text-white" fill="currentColor" />
          </div>
          <div className="text-3xl font-black italic tracking-tighter" style={{ color: Tokens.colors.text.primary }}>
            VIVERCOM
          </div>
          <div className="text-[13px] font-semibold" style={{ color: Tokens.colors.text.secondary }}>
            Saúde conectada com experiência premium.
          </div>
        </div>

        <Card>
          <div className="text-center text-[12px] font-black uppercase tracking-widest" style={{ color: Tokens.colors.text.secondary }}>
            Acessar conta
          </div>

          {/* Role selector */}
          <div className="grid grid-cols-3 gap-2">
            {([
              { id: "paciente", label: "Paciente", icon: User },
              { id: "medico", label: "Médico", icon: Stethoscope },
              { id: "apoio", label: "Rede", icon: Users },
            ] as Array<{ id: Role; label: string; icon: React.ElementType }>).map((r) => {
              const active = role === r.id;
              return (
                <button
                  key={r.id}
                  onClick={() => setRole(r.id)}
                  className="px-3 py-3 rounded-2xl flex flex-col items-center gap-1.5 transition-all"
                  style={{
                    background: active ? "#EBF5FF" : Tokens.colors.background,
                    border: `1px solid ${active ? "#BBDFFF" : Tokens.colors.background}`,
                    color: active ? Tokens.colors.primary : Tokens.colors.text.secondary,
                  }}
                >
                  <r.icon size={18} />
                  <span className="text-[11px] font-black tracking-tight">{r.label}</span>
                </button>
              );
            })}
          </div>

          <Input
            label="E-mail"
            placeholder="seu@email.com"
            value={email}
            onChange={setEmail}
            type="email"
            right={<Mail size={18} style={{ color: Tokens.colors.text.tertiary }} />}
          />
          <Input
            label="Senha"
            placeholder="••••••••"
            value={password}
            onChange={setPassword}
            type={showPass ? "text" : "password"}
            right={
              <button
                onClick={() => setShowPass((s) => !s)}
                className="p-2 rounded-xl"
                style={{ color: Tokens.colors.text.tertiary }}
                type="button"
              >
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            }
          />

          <Button className="w-full" icon={Lock} loading={isAuthLoading} onClick={login} disabled={!email || !password}>
            Entrar
          </Button>

          <button
            onClick={() => setView("forgot")}
            className="w-full text-center text-[12px] font-black tracking-tight"
            style={{ color: Tokens.colors.primary }}
          >
            Esqueci minha senha
          </button>
        </Card>

        <LegalBanner />
      </div>
    </div>
  );

  const ForgotScreen = () => {
    const [forgotEmail, setForgotEmail] = useState(email);
    const [sent, setSent] = useState(false);
    const [sending, setSending] = useState(false);

    function send() {
      setSending(true);
      setTimeout(() => {
        setSending(false);
        setSent(true);
      }, 700);
    }

    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ background: Tokens.colors.background }}>
        <div className="w-full max-w-sm space-y-6">
          <div className="text-center space-y-2">
            <div className="text-2xl font-black tracking-tight" style={{ color: Tokens.colors.text.primary }}>
              Recuperar senha
            </div>
            <div className="text-[13px] font-semibold" style={{ color: Tokens.colors.text.secondary }}>
              Enviaremos um link de redefinição.
            </div>
          </div>

          <Card>
            <Input label="E-mail" placeholder="seu@email.com" value={forgotEmail} onChange={setForgotEmail} type="email" />

            {!sent ? (
              <Button className="w-full" icon={KeyRound} loading={sending} onClick={send} disabled={!forgotEmail}>
                Enviar link
              </Button>
            ) : (
              <div className="space-y-3">
                <div
                  className="p-4 rounded-2xl text-[12px] font-semibold"
                  style={{ background: "#E9F9EE", color: Tokens.colors.success }}
                >
                  Link enviado! Verifique seu e-mail.
                </div>
                <Button className="w-full" variant="secondary" onClick={() => setView("auth")}>
                  Voltar para login
                </Button>
              </div>
            )}
          </Card>

          <LegalBanner />
        </div>
      </div>
    );
  };

  /* ------------------------------ 7) DASHBOARDS ------------------------------ */

  const PatientHome = () => (
    <div className="space-y-8">
      {/* 1) Agenda de remédios em primeiro */}
      <section className="space-y-3">
        <SectionTitle>Agenda de remédios</SectionTitle>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {meds.map((m) => (
            <Card key={m.id} className="relative">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl" style={{ background: "#EBF5FF", color: Tokens.colors.primary }}>
                      <Clock size={18} />
                    </div>
                    <div className="text-[11px] font-black uppercase tracking-widest" style={{ color: Tokens.colors.text.secondary }}>
                      {m.time}
                    </div>
                    {m.note ? <Badge variant="warning">{m.note}</Badge> : null}
                  </div>
                  <div className="text-[16px] font-black" style={{ color: Tokens.colors.text.primary }}>
                    {m.name}
                  </div>
                  <div className="text-[13px] font-semibold" style={{ color: Tokens.colors.text.secondary }}>
                    Dose: {m.dose}
                  </div>
                </div>

                <button
                  onClick={() =>
                    setMeds((prev) => prev.map((x) => (x.id === m.id ? { ...x, taken: !x.taken } : x)))
                  }
                  className="w-12 h-12 rounded-2xl inline-flex items-center justify-center transition-all active:scale-[0.98]"
                  style={{
                    background: m.taken ? "#E9F9EE" : Tokens.colors.background,
                    color: m.taken ? Tokens.colors.success : Tokens.colors.text.tertiary,
                    border: `1px solid ${Tokens.colors.border}`,
                  }}
                  title={m.taken ? "Desmarcar" : "Confirmar"}
                >
                  {m.taken ? <CheckCircle size={22} /> : <Plus size={22} />}
                </button>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* 2) Consultas */}
      <section className="space-y-3">
        <SectionTitle>Agenda de consultas</SectionTitle>

        <div className="space-y-4">
          {patient.appointments.map((a) => (
            <Card key={a.id} className="hover:shadow-md transition-all">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-2xl text-center" style={{ background: "#EEF0F4", minWidth: 76 }}>
                    <div className="text-[10px] font-black uppercase" style={{ color: Tokens.colors.text.secondary }}>
                      {a.month}
                    </div>
                    <div className="text-[22px] font-black" style={{ color: Tokens.colors.text.primary }}>
                      {a.day}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant={a.type === "Teleconsulta" ? "info" : "success"}>
                        {a.type === "Teleconsulta" ? (
                          <span className="inline-flex items-center gap-1">
                            <Video size={12} /> Teleconsulta
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1">
                            <MapPin size={12} /> Presencial
                          </span>
                        )}
                      </Badge>
                      <span className="text-[11px] font-black uppercase tracking-widest" style={{ color: Tokens.colors.text.secondary }}>
                        {a.time}
                      </span>
                    </div>
                    <div className="text-[16px] font-black">{a.specialty}</div>
                    <div className="text-[13px] font-semibold" style={{ color: Tokens.colors.text.secondary }}>
                      {a.doctor} • {a.location}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="secondary" icon={Info} className="px-4 py-2">
                    Detalhes
                  </Button>
                  <Button icon={Calendar} className="px-4 py-2">
                    Confirmar
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* 3) Relato + disposição */}
      <section className="space-y-3">
        <SectionTitle>Relato e disposição</SectionTitle>

        <Card title="Relato diário" subtitle="Texto simples. Sem análise clínica automática.">
          <textarea
            value={dailyText}
            onChange={(e) => setDailyText(e.target.value)}
            className="w-full p-4 rounded-2xl border-0 outline-none text-[14px]"
            style={{ background: Tokens.colors.background, color: Tokens.colors.text.primary }}
            placeholder="Como você está se sentindo hoje?"
          />

          <div className="p-4 rounded-2xl" style={{ background: Tokens.colors.background }}>
            <div className="flex items-center justify-between mb-3">
              <div className="inline-flex items-center gap-2 text-[12px] font-black uppercase tracking-widest" style={{ color: Tokens.colors.text.secondary }}>
                <Thermometer size={16} />
                Como está sua disposição hoje
              </div>

              <div className="text-[20px] font-black" style={{ color: Tokens.colors.primary }}>
                {disposition}/10
              </div>
            </div>

            <input
              type="range"
              min={0}
              max={10}
              step={1}
              value={disposition}
              onChange={(e) => setDisposition(parseInt(e.target.value, 10))}
              className="w-full"
              style={{ accentColor: Tokens.colors.primary }}
            />

            <div className="flex justify-between mt-2 text-[11px] font-black" style={{ color: Tokens.colors.text.secondary }}>
              <span>0 muito indisposto</span>
              <span>10 muito disposto</span>
            </div>
          </div>

          <div className="flex justify-end">
            <Button icon={Smile}>Salvar</Button>
          </div>
        </Card>
      </section>

      {/* 4) Aderência do tratamento */}
      <section className="space-y-3">
        <SectionTitle>Aderência do mês</SectionTitle>

        <Card title="Aderência ao tratamento" subtitle="Percentual de execução ao longo do mês (mock).">
          <div className="flex items-center justify-between">
            <div className="text-[13px] font-semibold" style={{ color: Tokens.colors.text.secondary }}>
              Progresso mensal
            </div>
            <Badge variant={patient.adherence >= 80 ? "success" : patient.adherence >= 60 ? "warning" : "danger"}>
              {patient.adherence}%
            </Badge>
          </div>

          <div className="h-3 rounded-full overflow-hidden" style={{ background: "#EEF0F4" }}>
            <div
              className="h-full rounded-full"
              style={{
                width: `${patient.adherence}%`,
                background: patient.adherence >= 80 ? Tokens.colors.success : patient.adherence >= 60 ? Tokens.colors.warning : Tokens.colors.danger,
              }}
            />
          </div>

          <div className="text-[12px] font-semibold" style={{ color: Tokens.colors.text.secondary }}>
            Meta sugerida: 85%
          </div>
        </Card>
      </section>
    </div>
  );

  const PatientCalendar = () => (
    <div className="space-y-8">
      <SectionTitle>Consultas</SectionTitle>
      <div className="space-y-4">
        {patient.appointments.map((a) => (
          <Card key={a.id}>
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant={a.type === "Teleconsulta" ? "info" : "success"}>{a.type}</Badge>
                  <span className="text-[11px] font-black uppercase tracking-widest" style={{ color: Tokens.colors.text.secondary }}>
                    {a.dateLabel} • {a.time}
                  </span>
                </div>
                <div className="text-[16px] font-black">{a.specialty}</div>
                <div className="text-[13px] font-semibold" style={{ color: Tokens.colors.text.secondary }}>
                  {a.doctor} • {a.location}
                </div>
              </div>
              <Button icon={Calendar} className="px-4 py-2">
                Confirmar
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  const PatientHistory = () => (
    <div className="space-y-8">
      <SectionTitle>Linha do tempo</SectionTitle>
      {[1, 2, 3].map((i) => (
        <Card key={i}>
          <div className="flex items-center justify-between">
            <Badge variant="info">14 Jan 2026</Badge>
            <span className="text-[12px] font-black" style={{ color: Tokens.colors.primary }}>
              Disposição: {Math.max(0, Math.min(10, disposition - (i - 1)))} /10
            </span>
          </div>
          <div className="text-[13px] font-semibold" style={{ color: Tokens.colors.text.secondary }}>
            Registro: “{dailyText || "Senti melhora durante o dia e consegui manter a rotina."}”
          </div>
          <div className="flex items-center gap-2 text-[12px] font-semibold" style={{ color: Tokens.colors.text.secondary }}>
            <CheckCircle size={16} style={{ color: Tokens.colors.success }} /> Medicação registrada
          </div>
        </Card>
      ))}
    </div>
  );

  const PatientAccess = () => (
    <div className="space-y-8">
      <SectionTitle>Vínculos</SectionTitle>

      <Card
        title="Seu código de vinculação"
        subtitle="Forneça ao médico para solicitar vínculo."
        footer={
          <Button variant="secondary" icon={ClipboardList} className="w-full">
            Copiar código
          </Button>
        }
      >
        <div className="flex items-center justify-between">
          <div className="text-3xl font-black tracking-tight" style={{ color: Tokens.colors.text.primary }}>
            {patient.code}
          </div>
          <Badge variant="info">Paciente</Badge>
        </div>
      </Card>

      <Card title="Médicos autorizados" subtitle="Controle quem pode ver seus dados.">
        <div className="flex items-center justify-between p-3 rounded-2xl" style={{ background: Tokens.colors.background }}>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl" style={{ background: "#EBF5FF", color: Tokens.colors.primary }}>
              <Stethoscope size={20} />
            </div>
            <div>
              <div className="text-[14px] font-black">Dr. Alberto Rossi</div>
              <div className="text-[12px] font-semibold" style={{ color: Tokens.colors.text.secondary }}>
                Cardiologia • desde Jan/2026
              </div>
            </div>
          </div>

          <Button variant="destructive" icon={Trash2} className="px-4 py-2">
            Revogar
          </Button>
        </div>
      </Card>
    </div>
  );

  const PatientProfileUpdate = () => (
    <div className="space-y-8">
      <SectionTitle>Dados do cadastro</SectionTitle>

      <Card title="Dados pessoais" subtitle="Atualize informações essenciais.">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Nome completo" placeholder="Ex: Ricardo Souza" value={patient.name} onChange={() => {}} />
          <Input label="Telefone" placeholder="(00) 00000-0000" value={patient.phone} onChange={() => {}} />
          <Input label="Data de nascimento" placeholder="DD/MM/AAAA" value={patient.birth} onChange={() => {}} />
          <Input label="Tipo sanguíneo" placeholder="O+" value={patient.blood} onChange={() => {}} />
          <Input label="Endereço" placeholder="Rua, número, bairro" />
          <Input label="Plano de saúde" placeholder="Nome / número" />
        </div>

        <div className="flex gap-3 justify-end">
          <Button variant="secondary">Cancelar</Button>
          <Button icon={RefreshCw}>Salvar alterações</Button>
        </div>
      </Card>

      <Card title="Saúde (declaratório)" subtitle="Texto simples. Sem validação clínica.">
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-1.5">
            <label className="px-1 text-[11px] font-black uppercase tracking-widest" style={{ color: Tokens.colors.text.secondary }}>
              Condições pré-existentes
            </label>
            <textarea
              className="w-full p-4 rounded-2xl border-0 outline-none text-[14px]"
              style={{ background: Tokens.colors.background, color: Tokens.colors.text.primary }}
              placeholder="Ex: hipertensão leve, alergias..."
            />
          </div>
          <div className="space-y-1.5">
            <label className="px-1 text-[11px] font-black uppercase tracking-widest" style={{ color: Tokens.colors.text.secondary }}>
              Medicamentos de uso contínuo
            </label>
            <textarea
              className="w-full p-4 rounded-2xl border-0 outline-none text-[14px]"
              style={{ background: Tokens.colors.background, color: Tokens.colors.text.primary }}
              placeholder="Ex: Losartana 50mg..."
            />
          </div>
        </div>
      </Card>
    </div>
  );

  const DoctorDashboard = () => {
    const patients = [patient];
    const selected = selectedPatientId ? patients.find((p) => p.id === selectedPatientId) : null;

    if (!selected) {
      return (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <div className="text-[12px] font-black uppercase tracking-widest" style={{ color: Tokens.colors.text.secondary }}>
                Pacientes ativos
              </div>
              <div className="text-4xl font-black mt-2">1</div>
            </Card>
            <Card>
              <div className="text-[12px] font-black uppercase tracking-widest" style={{ color: Tokens.colors.text.secondary }}>
                Consultas hoje
              </div>
              <div className="text-4xl font-black mt-2">2</div>
            </Card>
            <Card>
              <div className="text-[12px] font-black uppercase tracking-widest" style={{ color: Tokens.colors.text.secondary }}>
                Alertas
              </div>
              <div className="text-4xl font-black mt-2">0</div>
            </Card>
          </div>

          <Card
            title="Meus pacientes"
            subtitle="Clique para abrir o prontuário organizacional."
            footer={<Button icon={Search} className="w-full">Vincular novo paciente</Button>}
          >
            <div className="space-y-3">
              {patients.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedPatientId(p.id)}
                  className="w-full p-4 rounded-2xl flex items-center justify-between transition-all hover:shadow-sm"
                  style={{ background: Tokens.colors.background }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: "#EBF5FF", color: Tokens.colors.primary }}>
                      <User />
                    </div>
                    <div className="text-left">
                      <div className="text-[15px] font-black">{p.name}</div>
                      <div className="text-[11px] font-black uppercase tracking-widest" style={{ color: Tokens.colors.text.secondary }}>
                        {p.code} • {p.phone}
                      </div>
                    </div>
                  </div>
                  <ChevronRight size={18} style={{ color: Tokens.colors.text.tertiary }} />
                </button>
              ))}
            </div>
          </Card>

          <LegalBanner />
        </div>
      );
    }

    return (
      <div className="space-y-8">
        <Card
          title={selected.name}
          subtitle={`Código ${selected.code} • Nasc. ${selected.birth}`}
          footer={
            <div className="flex gap-2">
              <Button variant="secondary" icon={Trash2} className="w-full">
                Encerrar vínculo
              </Button>
              <Button icon={Plus} className="w-full">
                Nova prescrição
              </Button>
            </div>
          }
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl" style={{ background: Tokens.colors.background }}>
              <div className="text-[12px] font-black uppercase tracking-widest" style={{ color: Tokens.colors.text.secondary }}>
                Dados
              </div>
              <div className="mt-3 space-y-2 text-[13px] font-semibold" style={{ color: Tokens.colors.text.secondary }}>
                <div className="flex justify-between">
                  <span>Tipo sanguíneo</span>
                  <span className="font-black" style={{ color: Tokens.colors.text.primary }}>{selected.blood}</span>
                </div>
                <div className="flex justify-between">
                  <span>Telefone</span>
                  <span className="font-black" style={{ color: Tokens.colors.text.primary }}>{selected.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span>Aderência (mês)</span>
                  <span className="font-black" style={{ color: Tokens.colors.text.primary }}>{selected.adherence}%</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl" style={{ background: Tokens.colors.background }}>
              <div className="text-[12px] font-black uppercase tracking-widest" style={{ color: Tokens.colors.text.secondary }}>
                Relato (somente leitura)
              </div>
              <div className="mt-3 text-[13px] font-semibold" style={{ color: Tokens.colors.text.secondary }}>
                “{dailyText || "Paciente relata evolução estável, sem eventos relevantes hoje."}”
              </div>
              <div className="mt-3">
                <Badge variant="info">Disposição: {disposition}/10</Badge>
              </div>
            </div>
          </div>
        </Card>

        <Card title="Notas clínicas" subtitle="Uso interno. (mock)">
          <textarea
            className="w-full p-4 rounded-2xl border-0 outline-none text-[14px]"
            style={{ background: Tokens.colors.background, color: Tokens.colors.text.primary }}
            placeholder="Digite suas notas aqui..."
          />
          <div className="flex justify-end">
            <Button icon={CheckCircle}>Salvar nota</Button>
          </div>
        </Card>

        <Button variant="ghost" icon={ChevronLeft} onClick={() => setSelectedPatientId(null)} className="w-full">
          Voltar aos pacientes
        </Button>

        <LegalBanner />
      </div>
    );
  };

  const SupportDashboard = () => (
    <div className="space-y-8">
      <Card title="Rede de apoio" subtitle="Acesso limitado (mock).">
        <div className="p-4 rounded-2xl" style={{ background: Tokens.colors.background }}>
          <div className="text-[13px] font-semibold" style={{ color: Tokens.colors.text.secondary }}>
            Você está acompanhando:
          </div>
          <div className="text-[16px] font-black mt-1">{patient.name}</div>
          <div className="text-[12px] font-semibold mt-2" style={{ color: Tokens.colors.text.secondary }}>
            Acesso: agenda de medicamentos e consultas.
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {patient.medsToday.slice(0, 2).map((m) => (
            <Card key={m.id} className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-black uppercase tracking-widest" style={{ color: Tokens.colors.text.secondary }}>
                    {m.time}
                  </div>
                  <div className="text-[15px] font-black">{m.name}</div>
                  <div className="text-[12px] font-semibold" style={{ color: Tokens.colors.text.secondary }}>
                    {m.dose}
                  </div>
                </div>
                <Badge variant={m.taken ? "success" : "warning"}>{m.taken ? "Tomado" : "Pendente"}</Badge>
              </div>
            </Card>
          ))}
        </div>
      </Card>

      <LegalBanner />
    </div>
  );

  const Dashboard = () => {
    const isPaciente = role === "paciente";
    const isMedico = role === "medico";
    const isApoio = role === "apoio";

    // sidebar items per role
    const sideItems = isPaciente
      ? [
          { id: "home", label: "Painel geral", icon: Activity as any },
          { id: "calendar", label: "Agenda", icon: Calendar as any },
          { id: "history", label: "Histórico", icon: FileCheck as any },
          { id: "access", label: "Médicos", icon: Shield as any },
          { id: "profileUpdate", label: "Cadastro", icon: Pencil as any },
        ]
      : isMedico
      ? [
          { id: "patients", label: "Pacientes", icon: ClipboardList as any },
          { id: "calendar", label: "Agenda médica", icon: Calendar as any },
        ]
      : [{ id: "home", label: "Resumo", icon: Activity as any }];

    const currentTabId = isPaciente ? tabPaciente : isMedico ? tabMedico : tabApoio;

    function setTab(id: string) {
      if (isPaciente) setTabPaciente(id as TabPaciente);
      else if (isMedico) setTabMedico(id as TabMedico);
      else setTabApoio(id as TabApoio);

      if (isMedico && id === "patients") setSelectedPatientId(null);
    }

    return (
      <div className="min-h-screen flex" style={{ background: Tokens.colors.background, color: Tokens.colors.text.primary }}>
        {/* Sidebar (desktop) */}
        <aside
          className="hidden md:flex flex-col w-72 p-8 sticky top-0 h-screen"
          style={{ background: "rgba(255,255,255,0.82)", borderRight: `1px solid ${Tokens.colors.border}`, backdropFilter: "blur(18px)" }}
        >
          <div className="flex items-center gap-3 mb-10">
            <div className="p-2 rounded-xl" style={{ background: Tokens.colors.primary }}>
              <Heart size={16} className="text-white" fill="currentColor" />
            </div>
            <div className="text-[16px] font-black italic tracking-tight">VIVERCOM</div>
          </div>

          <nav className="space-y-2 flex-1">
            {sideItems.map((it) => {
              const active = currentTabId === it.id;
              return (
                <button
                  key={it.id}
                  onClick={() => setTab(it.id)}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-black transition-all"
                  style={{
                    background: active ? Tokens.colors.primary : "transparent",
                    color: active ? "white" : Tokens.colors.text.secondary,
                  }}
                >
                  <it.icon size={20} />
                  <span className="text-[13px]">{it.label}</span>
                </button>
              );
            })}
          </nav>

          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-black"
            style={{ color: Tokens.colors.danger }}
          >
            <ChevronLeft size={20} />
            Encerrar sessão
          </button>
        </aside>

        {/* Main */}
        <div className="flex-1">
          <StickyTopBar />

          <main className="px-4 md:px-10 pb-28 md:pb-10 max-w-5xl mx-auto w-full">
            {isPaciente && tabPaciente === "home" && <PatientHome />}
            {isPaciente && tabPaciente === "calendar" && <PatientCalendar />}
            {isPaciente && tabPaciente === "history" && <PatientHistory />}
            {isPaciente && tabPaciente === "access" && <PatientAccess />}
            {isPaciente && tabPaciente === "profileUpdate" && <PatientProfileUpdate />}

            {isMedico && tabMedico === "patients" && <DoctorDashboard />}
            {isMedico && tabMedico === "calendar" && (
              <div className="space-y-8">
                <SectionTitle>Agenda médica</SectionTitle>
                <Card title="Hoje" subtitle="Consultas do dia (mock)">
                  <div className="p-4 rounded-2xl" style={{ background: Tokens.colors.background }}>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-[15px] font-black">Cardiologia — Ricardo Souza</div>
                        <div className="text-[12px] font-semibold" style={{ color: Tokens.colors.text.secondary }}>
                          14:30 • Presencial • Clínica Vida
                        </div>
                      </div>
                      <Badge variant="info">Em breve</Badge>
                    </div>
                  </div>
                </Card>
                <LegalBanner />
              </div>
            )}

            {isApoio && tabApoio === "home" && <SupportDashboard />}
          </main>

          {/* Mobile Bottom Nav */}
          <nav
            className="md:hidden fixed bottom-6 left-6 right-6 h-20 flex items-center justify-around px-4 z-50"
            style={{
              background: "rgba(255,255,255,0.82)",
              border: `1px solid ${Tokens.colors.border}`,
              borderRadius: "32px",
              backdropFilter: "blur(18px)",
              boxShadow: Tokens.shadow.md,
            }}
          >
            {(role === "paciente"
              ? [
                  { id: "home", icon: Activity },
                  { id: "calendar", icon: Calendar },
                  { id: "history", icon: FileCheck },
                  { id: "access", icon: Shield },
                ]
              : role === "medico"
              ? [
                  { id: "patients", icon: ClipboardList },
                  { id: "calendar", icon: Calendar },
                ]
              : [{ id: "home", icon: Activity }]
            ).map((it) => {
              const active = currentTabId === it.id;
              return (
                <button
                  key={it.id}
                  onClick={() => setTab(it.id)}
                  className="p-3 rounded-2xl transition-all"
                  style={{
                    background: active ? Tokens.colors.primary : "transparent",
                    color: active ? "white" : Tokens.colors.text.secondary,
                  }}
                >
                  <it.icon size={24} />
                </button>
              );
            })}
          </nav>

          {/* Back Sheet (fixed back button options) */}
          {showBackSheet && (
            <div className="fixed inset-0 z-[80]">
              <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.28)" }} onClick={() => setShowBackSheet(false)} />
              <div
                className="absolute left-0 right-0 bottom-0 p-6"
                style={{
                  background: "rgba(255,255,255,0.92)",
                  borderTop: `1px solid ${Tokens.colors.border}`,
                  borderTopLeftRadius: "28px",
                  borderTopRightRadius: "28px",
                  backdropFilter: "blur(18px)",
                  boxShadow: Tokens.shadow.md,
                }}
              >
                <div className="max-w-lg mx-auto space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="text-[14px] font-black">Voltar</div>
                    <button
                      onClick={() => setShowBackSheet(false)}
                      className="p-2 rounded-2xl"
                      style={{ background: Tokens.colors.background, color: Tokens.colors.text.secondary }}
                    >
                      <X size={18} />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    <Button variant="secondary" icon={Users} onClick={() => applyBackAction("switchRole")} className="w-full">
                      Voltar e escolher perfil (Paciente / Médico / Rede)
                    </Button>

                    <Button variant="secondary" icon={Pencil} onClick={() => applyBackAction("toProfileUpdate")} className="w-full">
                      Ir para atualização de cadastro
                    </Button>

                    <Button variant="destructive" icon={ChevronLeft} onClick={() => applyBackAction("toAuth")} className="w-full">
                      Voltar para login
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  /* ------------------------------ 8) ROOT RENDER ------------------------------ */

  if (view === "auth") return <AuthScreen />;
  if (view === "forgot") return <ForgotScreen />;
  return <Dashboard />;
}

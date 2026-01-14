import React, { useState } from "react";
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
  Stethoscope,
  X,
  Thermometer,
  MapPin,
  Video,
  Upload,
  Camera,
} from "lucide-react";

/**
 * ✅ Versão “copiar e colar” para Vercel (Vite + React + Tailwind).
 * - Mantém tudo em 1 arquivo (App.tsx / App.jsx).
 * - Corrige classes Tailwind dinâmicas (evita `hover:border-${color}-500` etc).
 * - Inclui: Login com "Acessar conta", Cadastro em 4 passos, Home com Relato + Disposição 0-10,
 *   Tratamentos do dia, Rede de Apoio, Histórico e Agenda de Consultas.
 * - Inclui botão claro para voltar ao Home (desktop e mobile).
 */

// --- UI Auxiliar ---

const Card = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`bg-white rounded-2xl shadow-sm border border-slate-100 p-4 md:p-6 ${className}`}
  >
    {children}
  </div>
);

const Badge = ({
  children,
  variant = "default",
}: {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "info";
}) => {
  const styles: Record<string, string> = {
    default: "bg-blue-50 text-blue-600",
    success: "bg-emerald-50 text-emerald-600",
    warning: "bg-amber-50 text-amber-600",
    danger: "bg-rose-50 text-rose-600",
    info: "bg-purple-50 text-purple-600",
  };
  return (
    <span
      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1 ${styles[variant]}`}
    >
      {children}
    </span>
  );
};

const TabButton = ({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-bold transition-all ${
      active
        ? "bg-blue-600 text-white shadow-md shadow-blue-100"
        : "text-slate-500 hover:bg-slate-50"
    }`}
  >
    {icon}
    <span className="text-sm">{label}</span>
  </button>
);

// --- App ---

type View = "login" | "signup" | "dashboard";
type Role = "paciente" | "apoio" | "medico" | null;
type Tab = "home" | "network" | "history" | "appointments";

export default function App() {
  const [view, setView] = useState<View>("login");
  const [userRole, setUserRole] = useState<Role>(null);
  const [signupStep, setSignupStep] = useState(1);
  const [activeTab, setActiveTab] = useState<Tab>("home");
  const [showLegalNotice, setShowLegalNotice] = useState(true);

  // Relato (nota 0-10)
  const [disposition, setDisposition] = useState(5);

  // Mock de tratamentos
  const [treatments] = useState([
    {
      id: 1,
      name: "Losartana",
      dose: "50mg",
      time: "08:00",
      status: "tomado",
      obs: "Tomar em jejum",
    },
    { id: 2, name: "Anlodipino", dose: "5mg", time: "20:00", status: "pendente", obs: "" },
  ]);

  // Mock de consultas
  const [appointments] = useState([
    {
      id: 1,
      doctor: "Dr. Silva",
      specialty: "Cardiologia",
      date: "20 Jan 2026",
      time: "14:30",
      type: "Presencial",
      location: "Clínica Vida, Sala 302",
    },
    {
      id: 2,
      doctor: "Dra. Beatriz",
      specialty: "Clínico Geral",
      date: "05 Fev 2026",
      time: "10:00",
      type: "Teleconsulta",
      location: "Link via App",
    },
  ]);

  const handleLogout = () => {
    setUserRole(null);
    setView("login");
    setSignupStep(1);
    setActiveTab("home");
    setShowLegalNotice(true);
  };

  const handleLogin = (role: Exclude<Role, null>) => {
    setUserRole(role);
    setView("dashboard");
    setActiveTab("home");
  };

  const LegalBanner = () => (
    <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl flex items-start space-x-3">
      <AlertTriangle className="text-amber-500 flex-shrink-0" size={20} />
      <div className="text-[11px] text-amber-800 leading-relaxed font-medium">
        <p className="font-bold mb-1 uppercase">Aviso Legal Obrigatório:</p>
        Este aplicativo é uma ferramenta de organização pessoal. O app{" "}
        <strong>não realiza diagnósticos</strong> e não substitui avaliação médica.
      </div>
    </div>
  );

  // --- Signup (4 passos) ---

  const renderSignup = () => {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          <button
            onClick={() => {
              setView("login");
              setSignupStep(1);
            }}
            className="mb-4 flex items-center text-sm font-bold text-slate-400 hover:text-blue-600 transition-colors"
          >
            <ChevronLeft size={18} /> Cancelar Cadastro
          </button>

          <Card className="relative overflow-hidden">
            {/* Progress */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-slate-100 flex">
              {[1, 2, 3, 4].map((step) => (
                <div
                  key={step}
                  className={`flex-1 transition-all duration-500 ${
                    signupStep >= step ? "bg-blue-600" : "bg-transparent"
                  }`}
                />
              ))}
            </div>

            <div className="mt-4">
              <p className="text-[10px] font-black text-blue-600 uppercase mb-1">
                Passo {signupStep} de 4
              </p>

              {signupStep === 1 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-bold text-slate-800">
                    Dados Básicos e Essenciais
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Nome Completo"
                      className="w-full p-3 rounded-xl bg-slate-50 text-sm border-0 focus:ring-2 focus:ring-blue-100"
                    />
                    <input
                      type="text"
                      placeholder="CPF ou Documento ID"
                      className="w-full p-3 rounded-xl bg-slate-50 text-sm border-0 focus:ring-2 focus:ring-blue-100"
                    />
                    <input
                      type="date"
                      className="w-full p-3 rounded-xl bg-slate-50 text-sm border-0 focus:ring-2 focus:ring-blue-100"
                    />
                    <input
                      type="tel"
                      placeholder="Telefone"
                      className="w-full p-3 rounded-xl bg-slate-50 text-sm border-0 focus:ring-2 focus:ring-blue-100"
                    />

                    <select className="w-full p-3 rounded-xl bg-slate-50 text-sm border-0 focus:ring-2 focus:ring-blue-100">
                      <option>Tipo Sanguíneo</option>
                      <option>A+</option>
                      <option>A-</option>
                      <option>B+</option>
                      <option>B-</option>
                      <option>AB+</option>
                      <option>AB-</option>
                      <option>O+</option>
                      <option>O-</option>
                    </select>
                    <input
                      type="text"
                      placeholder="Plano de Saúde / Número"
                      className="w-full p-3 rounded-xl bg-slate-50 text-sm border-0 focus:ring-2 focus:ring-blue-100"
                    />

                    <input
                      type="text"
                      placeholder="Endereço Atual"
                      className="w-full p-3 rounded-xl bg-slate-50 text-sm col-span-full border-0 focus:ring-2 focus:ring-blue-100"
                    />
                    <input
                      type="text"
                      placeholder="Médico(s) de Referência"
                      className="w-full p-3 rounded-xl bg-slate-50 text-sm col-span-full border-0 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                </div>
              )}

              {signupStep === 2 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-bold text-slate-800">Dados de Rotina</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Peso (kg)"
                      className="p-3 rounded-xl bg-slate-50 text-sm border-0 focus:ring-2 focus:ring-blue-100"
                    />
                    <input
                      type="text"
                      placeholder="Altura (cm)"
                      className="p-3 rounded-xl bg-slate-50 text-sm border-0 focus:ring-2 focus:ring-blue-100"
                    />
                    <input
                      type="text"
                      placeholder="Profissão"
                      className="col-span-full p-3 rounded-xl bg-slate-50 text-sm border-0 focus:ring-2 focus:ring-blue-100"
                    />
                    <textarea
                      placeholder="Horários habituais (Sono, trabalho...)"
                      className="col-span-full p-3 rounded-xl bg-slate-50 text-sm h-24 border-0 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                </div>
              )}

              {signupStep === 3 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-bold text-slate-800">Informações de Saúde</h2>
                  <textarea
                    placeholder="Condições pré-existentes..."
                    className="w-full p-3 rounded-xl bg-slate-50 text-sm h-24 border-0 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              )}

              {signupStep === 4 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-bold text-slate-800">Rede de Apoio</h2>
                  <textarea
                    placeholder="Nome do contato..."
                    className="w-full p-3 rounded-xl bg-slate-50 text-sm h-24 border-0 focus:ring-2 focus:ring-blue-100"
                  />
                  <input
                    type="email"
                    placeholder="E-mail para convite"
                    className="w-full p-3 rounded-xl bg-slate-50 text-sm border-0 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              )}

              <div className="flex flex-col sm:flex-row justify-between mt-8 gap-3">
                {signupStep > 1 && (
                  <button
                    onClick={() => setSignupStep((s) => s - 1)}
                    className="px-6 py-3 font-bold text-slate-400 text-sm order-2 sm:order-1"
                  >
                    Anterior
                  </button>
                )}
                <div className="hidden sm:block flex-1 order-2" />
                <button
                  onClick={() =>
                    signupStep < 4 ? setSignupStep((s) => s + 1) : handleLogin("paciente")
                  }
                  className="w-full sm:w-auto px-8 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-100 flex items-center justify-center order-1 sm:order-3"
                >
                  {signupStep === 4 ? "Concluir" : "Próximo"}{" "}
                  <ChevronRight size={16} className="ml-1" />
                </button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  };

  // --- HOME (Relato + Disposição + Tratamentos) ---

  const renderHome = () => (
    <div className="space-y-6 md:space-y-8">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-slate-800">Olá, Ricardo</h2>
          <p className="text-slate-500 text-xs md:text-sm italic">Como você está hoje?</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab("appointments")}
            className="flex-1 sm:flex-none bg-white border border-slate-200 px-3 md:px-4 py-2 rounded-xl text-[11px] md:text-xs font-bold flex items-center justify-center text-slate-600"
          >
            <Calendar size={14} className="mr-2" /> Agenda
          </button>
          <button className="flex-1 sm:flex-none bg-blue-600 text-white px-3 md:px-4 py-2 rounded-xl text-[11px] md:text-xs font-bold flex items-center justify-center shadow-lg shadow-blue-100">
            <Plus size={14} className="mr-2" /> Novo Registro
          </button>
        </div>
      </header>

      {/* Relato do Dia + Disposição */}
      <section>
        <Card>
          <h3 className="font-bold text-slate-800 flex items-center mb-4 text-sm md:text-base">
            <Smile size={18} className="mr-2 text-blue-500" /> Meu Relato do Dia
          </h3>

          <textarea
            className="w-full p-4 bg-slate-50 rounded-xl border-0 text-sm min-h-[100px] resize-none focus:ring-2 focus:ring-blue-100 mb-6"
            placeholder="Como se sente hoje?"
          />

          <div className="bg-slate-50 p-4 md:p-6 rounded-2xl border border-slate-100">
            <div className="flex justify-between items-center mb-4">
              <label className="text-[10px] md:text-xs font-bold text-slate-700 uppercase flex items-center">
                <Thermometer size={14} className="mr-1 text-blue-600" /> Como está sua disposição hoje?
              </label>
              <span
                className={`text-lg md:text-xl font-black ${
                  disposition > 7
                    ? "text-emerald-500"
                    : disposition > 4
                    ? "text-blue-500"
                    : "text-amber-500"
                }`}
              >
                {disposition}/10
              </span>
            </div>

            <input
              type="range"
              min={0}
              max={10}
              step={1}
              value={disposition}
              onChange={(e) => setDisposition(parseInt(e.target.value, 10))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />

            <div className="flex justify-between mt-2 px-1">
              <span className="text-[9px] font-bold text-slate-400">0 muito indisposto</span>
              <span className="text-[9px] font-bold text-slate-400">10 muito disposto</span>
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <button className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 text-white text-xs font-bold rounded-xl shadow-md">
              Salvar Relato
            </button>
          </div>
        </Card>
      </section>

      {/* Tratamentos */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-slate-800 text-sm md:text-base">Tratamentos de Hoje</h3>
          <Badge>Organizacional</Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
          {treatments.map((t) => (
            <Card
              key={t.id}
              className={`border-l-4 ${
                t.status === "tomado" ? "border-emerald-500" : "border-amber-500"
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <Clock size={12} className="text-slate-400" />
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">
                      {t.time}
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-800 text-sm">{t.name}</h4>
                  <p className="text-[11px] text-slate-500 font-medium">Dose: {t.dose}</p>

                  {t.obs ? (
                    <p className="text-[10px] bg-slate-50 border border-slate-100 px-2 py-1 rounded-lg inline-flex items-center gap-2 text-slate-600 mt-2">
                      <span>⚠️</span> {t.obs}
                    </p>
                  ) : null}
                </div>

                <button
                  className={`p-2 rounded-full ${
                    t.status === "tomado"
                      ? "bg-emerald-500 text-white"
                      : "bg-slate-50 text-slate-300 border border-slate-100"
                  }`}
                  title={t.status === "tomado" ? "Tomado" : "Marcar como tomado"}
                >
                  {t.status === "tomado" ? <CheckCircle size={18} /> : <Plus size={18} />}
                </button>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );

  // --- NETWORK ---

  const renderNetwork = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-slate-800">Rede de Apoio</h2>
          <p className="text-slate-500 text-xs md:text-sm italic">Pessoas autorizadas por você.</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-xl text-[11px] md:text-xs font-bold shadow-lg shadow-blue-100 flex items-center">
          <Plus size={14} className="mr-2" /> Convidar
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="flex items-center space-x-4">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600">
            MF
          </div>
          <div className="flex-1">
            <p className="font-bold text-slate-800 text-sm">Maria Fernanda</p>
            <p className="text-[10px] text-slate-400">Filha • Acesso Completo</p>
          </div>
          <Settings size={16} className="text-slate-300" />
        </Card>

        <button className="p-6 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-400 hover:border-blue-300 hover:text-blue-500 transition-all">
          <Plus size={20} className="mb-2" />
          <span className="text-xs font-bold">Adicionar Membro</span>
        </button>
      </div>

      <Card className="bg-slate-50 border-slate-100">
        <p className="text-xs font-bold text-slate-600">
          Dica: defina níveis de acesso por perfil (ex.: cuidador vs filho) quando conectar o backend.
        </p>
      </Card>
    </div>
  );

  // --- HISTORY ---

  const renderHistory = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-slate-800">Meu Histórico</h2>
          <p className="text-slate-500 text-xs md:text-sm italic">
            Linha do tempo organizacional de ações e relatos.
          </p>
        </div>

        <button
          onClick={() => setActiveTab("home")}
          className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50"
        >
          <Activity size={14} /> Voltar ao Home
        </button>
      </div>

      {[1, 2].map((i) => (
        <Card key={i} className="border-l-4 border-l-blue-400">
          <p className="text-[10px] font-black text-slate-400 uppercase mb-2">
            1{i} Janeiro 2026
          </p>
          <div className="flex items-center space-x-2 text-xs text-slate-600">
            <CheckCircle size={14} className="text-emerald-500" />
            <span>Medicação tomada com sucesso.</span>
          </div>
        </Card>
      ))}
    </div>
  );

  // --- APPOINTMENTS ---

  const renderAppointments = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="bg-indigo-50 p-2 rounded-lg text-indigo-600">
            <Calendar size={20} />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-slate-800">Agenda de Consultas</h2>
            <p className="text-slate-500 text-xs md:text-sm italic">Consultas presenciais e teleconsultas.</p>
          </div>
        </div>

        <button className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-[10px] md:text-xs font-bold shadow-lg shadow-indigo-100 flex items-center">
          <Plus size={14} className="mr-2" /> Agendar
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {appointments.map((appt) => {
          const parts = appt.date.split(" ");
          const day = parts?.[0] ?? "--";
          const mon = parts?.[1] ?? "--";

          const isTele = appt.type.toLowerCase().includes("tele");

          return (
            <Card key={appt.id} className="hover:border-indigo-200 transition-colors border-l-4 border-l-indigo-500">
              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div className="flex items-start space-x-4">
                  <div className="bg-slate-50 p-3 rounded-xl flex flex-col items-center justify-center min-w-[74px] border border-slate-100">
                    <span className="text-[10px] font-black text-slate-400 uppercase leading-none mb-1">
                      {mon}
                    </span>
                    <span className="text-xl font-black text-slate-800 leading-none">{day}</span>
                  </div>

                  <div className="space-y-1">
                    <Badge variant={isTele ? "info" : "success"}>
                      {isTele ? <Video size={12} /> : <MapPin size={12} />}
                      {appt.type}
                    </Badge>
                    <h4 className="font-bold text-slate-800">{appt.specialty}</h4>
                    <p className="text-sm font-medium text-slate-600">{appt.doctor}</p>

                    <div className="flex flex-wrap items-center text-[11px] text-slate-400 mt-2 gap-x-3 gap-y-1">
                      <span className="inline-flex items-center">
                        <Clock size={12} className="mr-1" /> {appt.time}
                      </span>
                      <span className="inline-flex items-center">
                        <MapPin size={12} className="mr-1" /> {appt.location}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center sm:flex-col sm:justify-center gap-2">
                  <button className="flex-1 sm:flex-none px-4 py-2 bg-slate-50 text-slate-600 rounded-lg text-[10px] font-bold hover:bg-slate-100">
                    Detalhes
                  </button>
                  <button className="flex-1 sm:flex-none px-4 py-2 border border-indigo-100 text-indigo-600 rounded-lg text-[10px] font-bold hover:bg-indigo-50">
                    Confirmar
                  </button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <Card className="border-dashed border-2 border-slate-200 bg-slate-50/50 flex flex-col items-center justify-center p-8 text-center">
        <div className="bg-white p-4 rounded-full shadow-sm mb-4 text-slate-400 border border-slate-100">
          <Camera size={26} />
        </div>
        <p className="font-bold text-slate-700 text-xs mb-1">Receitas / Documentos (Referência)</p>
        <p className="text-[10px] text-slate-400 max-w-xs mb-4 italic">
          Armazene fotos como referência. O app não interpreta documentos.
        </p>
        <button className="px-5 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-bold hover:bg-slate-50 transition-all flex items-center">
          <Upload size={12} className="mr-2" /> Selecionar Arquivo
        </button>
      </Card>
    </div>
  );

  // --- LOGIN ---

  if (view === "login") {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 md:p-6">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center bg-blue-600 p-4 rounded-3xl shadow-xl shadow-blue-200 mb-4">
              <Heart className="text-white" size={32} fill="currentColor" />
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-800 italic tracking-tighter">
              VitaFlow
            </h1>
            <p className="text-slate-500 font-medium text-xs md:text-sm">
              Organização compartilhada de saúde.
            </p>
          </div>

          <Card className="space-y-4">
            {/* ✅ Ajuste solicitado: texto */}
            <h2 className="text-lg md:text-xl font-bold text-center text-slate-800 mb-6 italic underline underline-offset-8 decoration-blue-200">
              Acessar conta
            </h2>

            <div className="space-y-3">
              {/* Paciente */}
              <button
                onClick={() => handleLogin("paciente")}
                className="w-full p-4 border-2 border-slate-50 rounded-2xl flex items-center space-x-4 hover:border-blue-500 transition-all text-left group bg-white"
              >
                <div className="bg-blue-50 p-2 rounded-lg text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <User size={20} />
                </div>
                <div>
                  <span className="font-bold text-slate-800 block text-sm">Sou Paciente</span>
                  <span className="text-[9px] text-slate-400 uppercase font-black">
                    Gerir minha rotina
                  </span>
                </div>
              </button>

              {/* Apoio */}
              <button
                onClick={() => handleLogin("apoio")}
                className="w-full p-4 border-2 border-slate-50 rounded-2xl flex items-center space-x-4 hover:border-purple-500 transition-all text-left group bg-white"
              >
                <div className="bg-purple-50 p-2 rounded-lg text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                  <Users size={20} />
                </div>
                <div>
                  <span className="font-bold text-slate-800 block text-sm">Sou Rede de Apoio</span>
                  <span className="text-[9px] text-slate-400 uppercase font-black">
                    Acompanhar familiar
                  </span>
                </div>
              </button>

              {/* Médico */}
              <button
                onClick={() => handleLogin("medico")}
                className="w-full p-4 border-2 border-slate-50 rounded-2xl flex items-center space-x-4 hover:border-emerald-500 transition-all text-left group bg-white"
              >
                <div className="bg-emerald-50 p-2 rounded-lg text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <Stethoscope size={20} />
                </div>
                <div>
                  <span className="font-bold text-slate-800 block text-sm">Sou Médico</span>
                  <span className="text-[9px] text-slate-400 uppercase font-black">
                    Acesso autorizado
                  </span>
                </div>
              </button>
            </div>

            <button
              onClick={() => setView("signup")}
              className="w-full mt-6 py-4 bg-slate-800 text-white rounded-2xl font-bold text-sm shadow-lg hover:bg-slate-900 transition-all"
            >
              Criar Conta Gratuita
            </button>
          </Card>

          <div className="mt-6">
            <LegalBanner />
          </div>
        </div>
      </div>
    );
  }

  if (view === "signup") return renderSignup();

  // --- DASHBOARD LAYOUT ---

  const renderMainContent = () => {
    if (activeTab === "home") return renderHome();
    if (activeTab === "network") return renderNetwork();
    if (activeTab === "history") return renderHistory();
    return renderAppointments();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans text-slate-900 overflow-x-hidden">
      {/* Sidebar Desktop */}
      <aside className="w-64 bg-white border-r border-slate-100 p-6 hidden md:flex flex-col sticky top-0 h-screen">
        <div className="flex items-center space-x-3 mb-10">
          <div className="bg-blue-600 p-2 rounded-xl">
            <Heart className="text-white" size={20} fill="currentColor" />
          </div>
          <h1 className="text-lg font-black text-slate-800 tracking-tight italic">VitaFlow</h1>
        </div>

        <nav className="flex-1 space-y-1">
          <TabButton
            active={activeTab === "home"}
            onClick={() => setActiveTab("home")}
            icon={<Activity size={20} />}
            label="Painel"
          />
          <TabButton
            active={activeTab === "network"}
            onClick={() => setActiveTab("network")}
            icon={<Users size={20} />}
            label="Rede de Apoio"
          />
          <TabButton
            active={activeTab === "appointments"}
            onClick={() => setActiveTab("appointments")}
            icon={<Calendar size={20} />}
            label="Minha Agenda"
          />
          <TabButton
            active={activeTab === "history"}
            onClick={() => setActiveTab("history")}
            icon={<FileCheck size={20} />}
            label="Histórico"
          />
        </nav>

        <div className="mt-auto pt-6 border-t border-slate-50 space-y-2">
          {/* ✅ Botão Home explícito */}
          <button
            onClick={() => setActiveTab("home")}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-all"
          >
            <Activity size={20} /> <span className="text-sm">Voltar ao Home</span>
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-bold text-rose-500 hover:bg-rose-50 transition-all"
          >
            <ChevronLeft size={20} /> <span className="text-sm">Sair</span>
          </button>
        </div>
      </aside>

      {/* Header Mobile com Home */}
      <div className="md:hidden bg-white border-b border-slate-100 px-4 py-3 flex items-center justify-between sticky top-0 z-50">
        <button
          onClick={() => setActiveTab("home")}
          className="flex items-center gap-2 text-slate-700 font-black text-sm"
        >
          <Heart className="text-blue-600" size={18} fill="currentColor" />
          <span className="italic">VitaFlow</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("home")}
            className="text-blue-600 font-bold text-xs bg-blue-50 px-3 py-2 rounded-xl"
          >
            Home
          </button>
          <button
            onClick={handleLogout}
            className="text-rose-500 font-bold text-xs bg-rose-50 px-3 py-2 rounded-xl"
          >
            Sair
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-10 pb-24 md:pb-10 max-w-5xl mx-auto w-full">
        {showLegalNotice && (
          <div className="relative mb-6">
            <LegalBanner />
            <button
              onClick={() => setShowLegalNotice(false)}
              className="absolute top-2 right-2 p-1 text-amber-400 hover:text-amber-600"
            >
              <X size={14} />
            </button>
          </div>
        )}

        {renderMainContent()}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-slate-100 z-50 px-4 py-3 flex justify-between items-center shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        {[
          { id: "home" as const, icon: <Activity size={22} /> },
          { id: "network" as const, icon: <Users size={22} /> },
          { id: "appointments" as const, icon: <Calendar size={22} /> },
          { id: "history" as const, icon: <FileCheck size={22} /> },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`p-2.5 rounded-2xl transition-all ${
              activeTab === item.id
                ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                : "text-slate-400"
            }`}
            aria-label={item.id}
          >
            {item.icon}
          </button>
        ))}
      </nav>
    </div>
  );
}

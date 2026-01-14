import React, { useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Bell,
  Calendar,
  CheckCircle,
  ChevronLeft,
  ClipboardList,
  FileText,
  Heart,
  History,
  Info,
  Lock,
  LogOut,
  Plus,
  Search,
  ShieldCheck,
  Stethoscope,
  TrendingUp,
  User,
  Users,
} from "lucide-react";

// -------------------- Tipos --------------------

type Role = "paciente" | "medico" | "acompanhante";
type Tab = "dashboard" | "network";

type BadgeVariant = "default" | "success" | "warning" | "danger" | "info";

interface Diagnosis {
  id: number;
  title: string;
  cid: string;
  date: string;
  doctor: string;
}

type MedicationStatus = "tomado" | "pendente";

interface Medication {
  id: number;
  name: string;
  dosage: string;
  schedule: string;
  frequency: string;
  instruction: string;
  status: MedicationStatus;
  lastChecked: string | null;
}

interface PatientData {
  name: string;
  age: number;
  bloodType: string;
  conditions: string[];
  diagnoses: Diagnosis[];
  medications: Medication[];
}

interface SupportMember {
  name: string;
  relation: string;
  level: string;
  status: string;
}

interface DoctorPatient {
  id: number;
  name: string;
  lastVisit: string;
  alert: boolean;
  condition: string;
}

// -------------------- Componentes UI --------------------

const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = "",
}) => (
  <div
    className={`bg-white rounded-2xl shadow-sm border border-slate-100 p-6 ${className}`}
  >
    {children}
  </div>
);

const Badge: React.FC<{
  children: React.ReactNode;
  variant?: BadgeVariant;
}> = ({ children, variant = "default" }) => {
  const styles: Record<BadgeVariant, string> = {
    default: "bg-blue-50 text-blue-600",
    success: "bg-emerald-50 text-emerald-600",
    warning: "bg-amber-50 text-amber-600",
    danger: "bg-rose-50 text-rose-600",
    info: "bg-purple-50 text-purple-600",
  };

  return (
    <span
      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${styles[variant]}`}
    >
      {children}
    </span>
  );
};

// -------------------- App --------------------

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<Role | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole(null);
    setActiveTab("dashboard");
  };

  const handleLogin = (role: Role) => {
    setUserRole(role);
    setIsLoggedIn(true);
    setActiveTab("dashboard");
  };

  // --- Dados Simulados ---

  const patientData: PatientData = useMemo(
    () => ({
      name: "Ricardo Oliveira",
      age: 42,
      bloodType: "O+",
      conditions: ["Hipertensão"],
      diagnoses: [
        {
          id: 1,
          title: "Lombalgia Crônica",
          cid: "M54.5",
          date: "25 Abr 2024",
          doctor: "Dr. Roberto Silva",
        },
        {
          id: 2,
          title: "Hipertensão Essencial",
          cid: "I10",
          date: "10 Jan 2024",
          doctor: "Dr. Carlos Eduardo",
        },
      ],
      medications: [
        {
          id: 1,
          name: "Losartana 50mg",
          dosage: "1 comprimido",
          schedule: "08:00",
          frequency: "1x ao dia",
          instruction: "Tomar em Jejum",
          status: "tomado",
          lastChecked: "Hoje, 08:05",
        },
        {
          id: 2,
          name: "Anlodipino 5mg",
          dosage: "1 comprimido",
          schedule: "20:00",
          frequency: "1x ao dia",
          instruction: "Após o jantar",
          status: "pendente",
          lastChecked: null,
        },
      ],
    }),
    []
  );

  const supportNetwork: SupportMember[] = useMemo(
    () => [
      {
        name: "Maria Oliveira",
        relation: "Esposa",
        level: "Acesso Total",
        status: "Ativo",
      },
      {
        name: "José Santos",
        relation: "Cuidador",
        level: "Restrito (Apenas Agenda)",
        status: "Ativo",
      },
    ],
    []
  );

  const doctorPatients: DoctorPatient[] = useMemo(
    () => [
      { id: 1, name: "Ricardo Oliveira", lastVisit: "15 Mai", alert: true, condition: "Estável" },
      { id: 2, name: "Ana Beatriz", lastVisit: "12 Mai", alert: false, condition: "Recuperação" },
      { id: 3, name: "Marcos Viana", lastVisit: "10 Mai", alert: true, condition: "Alerta Crítico" },
    ],
    []
  );

  // -------------------- Tela de Login --------------------

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center bg-blue-600 p-4 rounded-3xl shadow-xl shadow-blue-200 mb-4">
              <Heart className="text-white" size={40} fill="currentColor" />
            </div>
            <h1 className="text-3xl font-black text-slate-800 italic">VitaFlow</h1>
            <p className="text-slate-500 font-medium">Sua saúde, sua rede, seu controle.</p>
          </div>

          <Card className="space-y-4">
            <h2 className="text-xl font-bold text-center text-slate-800 mb-6">
              Como deseja aceder?
            </h2>

            <button
              onClick={() => handleLogin("paciente")}
              className="w-full p-4 border-2 border-slate-100 rounded-2xl flex items-center space-x-4 hover:border-blue-500 hover:bg-blue-50 transition-all group"
            >
              <div className="bg-blue-100 p-3 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <User size={24} />
              </div>
              <div className="text-left">
                <p className="font-bold text-slate-800">Sou Paciente</p>
                <p className="text-xs text-slate-500">O meu dashboard e agenda de saúde</p>
              </div>
            </button>

            <button
              onClick={() => handleLogin("medico")}
              className="w-full p-4 border-2 border-slate-100 rounded-2xl flex items-center space-x-4 hover:border-emerald-500 hover:bg-emerald-50 transition-all group"
            >
              <div className="bg-emerald-100 p-3 rounded-xl group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <Stethoscope size={24} />
              </div>
              <div className="text-left">
                <p className="font-bold text-slate-800">Sou Profissional</p>
                <p className="text-xs text-slate-500">Gestão de pacientes e prontuários</p>
              </div>
            </button>

            <button
              onClick={() => handleLogin("acompanhante")}
              className="w-full p-4 border-2 border-slate-100 rounded-2xl flex items-center space-x-4 hover:border-purple-500 hover:bg-purple-50 transition-all group"
            >
              <div className="bg-purple-100 p-3 rounded-xl group-hover:bg-purple-600 group-hover:text-white transition-colors">
                <Users size={24} />
              </div>
              <div className="text-left">
                <p className="font-bold text-slate-800">Rede de Apoio</p>
                <p className="text-xs text-slate-500">Cuidadores e Familiares</p>
              </div>
            </button>

            <div className="pt-4 border-t text-center">
              <button className="text-sm font-bold text-blue-600 hover:underline text-center">
                Esqueci-me da palavra-passe
              </button>
            </div>
          </Card>

          <p className="text-center mt-8 text-xs text-slate-400">
            Ao aceder, concorda com os nossos <span className="underline">Termos</span> e{" "}
            <span className="underline">Privacidade</span>.
          </p>
        </div>
      </div>
    );
  }

  // -------------------- Dashboards --------------------

  const renderRoleDashboard = () => {
    switch (userRole) {
      case "medico":
        return (
          <div className="space-y-6">
            <header className="mb-8">
              <h2 className="text-2xl font-bold text-slate-800">Painel do Especialista</h2>
              <p className="text-slate-500">Gestão clínica e alertas de pacientes autorizados.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-emerald-600 text-white border-none">
                <p className="text-emerald-100 text-xs font-bold uppercase mb-1">
                  Pacientes Ativos
                </p>
                <h3 className="text-3xl font-bold">42</h3>
                <div className="mt-4 flex items-center text-xs text-emerald-200">
                  <TrendingUp size={14} className="mr-1" /> +12% este mês
                </div>
              </Card>

              <Card>
                <p className="text-slate-400 text-xs font-bold uppercase mb-1">Alertas Críticos</p>
                <h3 className="text-3xl font-bold text-rose-500">03</h3>
                <p className="text-xs text-slate-400 mt-4">Pacientes com sinais alterados</p>
              </Card>

              <Card>
                <p className="text-slate-400 text-xs font-bold uppercase mb-1">Próxima Consulta</p>
                <h3 className="text-xl font-bold text-slate-800">14:00 - Ricardo O.</h3>
                <p className="text-xs text-blue-600 mt-4 font-bold cursor-pointer">
                  Ver agenda completa
                </p>
              </Card>
            </div>

            <Card>
              <div className="flex justify-between items-center mb-6 gap-4">
                <h3 className="font-bold text-lg">Lista de Pacientes</h3>
                <div className="relative w-full md:w-auto">
                  <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
                  <input
                    type="text"
                    placeholder="Procurar paciente..."
                    className="w-full md:w-72 pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="space-y-3">
                {doctorPatients.map((p) => (
                  <div
                    key={p.id}
                    className="p-4 border rounded-2xl flex items-center justify-between hover:bg-slate-50 transition-all cursor-pointer"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600">
                        {p.name[0]}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">{p.name}</p>
                        <p className="text-xs text-slate-400">Último acesso: {p.lastVisit}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <Badge variant={p.condition === "Alerta Crítico" ? "danger" : "success"}>
                        {p.condition}
                      </Badge>
                      {p.alert && <AlertTriangle size={18} className="text-amber-500" />}
                      <button className="p-2 text-slate-400 hover:text-emerald-600">
                        <ArrowRight size={20} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        );

      case "acompanhante":
        return (
          <div className="space-y-6">
            <header className="mb-8">
              <h2 className="text-2xl font-bold text-slate-800">Painel da Rede de Apoio</h2>
              <p className="text-slate-500">
                A monitorizar: <strong>Ricardo Oliveira</strong> (Vínculo: Esposa)
              </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-l-4 border-l-purple-500">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center">
                  <Bell size={18} className="mr-2 text-purple-600" /> Próximos Alertas
                </h3>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                    <div className="text-xs">
                      <p className="font-bold text-slate-700">Medicação: Anlodipino</p>
                      <p className="text-slate-400">Agendado para 20:00</p>
                    </div>
                    <Badge variant="warning">A aguardar</Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-xl">
                    <div className="text-xs">
                      <p className="font-bold text-emerald-800">Medicação: Losartana</p>
                      <p className="text-emerald-600">Tomado às 08:05</p>
                    </div>
                    <CheckCircle size={16} className="text-emerald-600" />
                  </div>
                </div>
              </Card>

              <Card>
                <h3 className="font-bold text-slate-800 mb-4 flex items-center">
                  <Calendar size={18} className="mr-2 text-blue-600" /> Compromissos
                </h3>

                <div className="p-4 bg-blue-50 rounded-2xl">
                  <p className="text-xs font-bold text-blue-800 mb-1 tracking-tight">EXAME AMANHÃ</p>
                  <p className="text-sm font-bold text-blue-900">
                    Hemograma - Laboratório Central
                  </p>
                  <p className="text-xs text-blue-600 mt-2">O Ricardo precisa de estar em jejum de 8h.</p>
                </div>
              </Card>
            </div>

            <Card>
              <h3 className="font-bold mb-4">O meu Nível de Acesso</h3>
              <div className="flex items-center space-x-3 p-4 bg-purple-50 rounded-2xl border border-purple-100">
                <Lock size={20} className="text-purple-600" />
                <div>
                  <p className="text-sm font-bold text-purple-900">Acesso Total Autorizado</p>
                  <p className="text-xs text-purple-700">
                    Pode visualizar exames, tratamentos e gerir autorizações.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        );

      default:
        return (
          <div className="space-y-6">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">Olá, {patientData.name}</h2>
                <p className="text-slate-500 text-sm">O seu painel de saúde centralizado.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold flex items-center shadow-lg shadow-blue-100">
                  <Plus size={18} className="mr-2" /> Registar Evolução
                </button>
              </div>
            </header>

            <section>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-slate-800">Agenda de Medicamentos</h3>
                <Badge variant="info">Alertas Ativos</Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {patientData.medications.map((m) => (
                  <Card
                    key={m.id}
                    className={`relative overflow-hidden ${m.status === "tomado" ? "bg-emerald-50/30" : ""}`}
                  >
                    <div className="absolute top-0 left-0 right-0 h-1 bg-slate-100">
                      {m.status === "tomado" && <div className="h-full bg-emerald-500 w-full" />}
                    </div>

                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">
                          {m.instruction}
                        </p>
                        <h4 className="font-bold text-slate-800 text-lg">{m.name}</h4>
                        <p className="text-xs text-slate-500">
                          {m.dosage} • {m.frequency}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-xl font-black text-slate-800">{m.schedule}</p>
                        {m.status === "tomado" ? (
                          <span className="text-[10px] font-bold text-emerald-600 flex items-center justify-end">
                            <CheckCircle size={10} className="mr-1" /> TOMADO
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-rose-500">PENDENTE</span>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                          m.status === "tomado" ? "bg-white text-slate-400" : "bg-blue-600 text-white"
                        }`}
                      >
                        {m.status === "tomado" ? "Anular" : "Marcar como Tomado"}
                      </button>

                      <button className="p-2 border border-slate-200 rounded-xl text-slate-400 hover:bg-slate-50">
                        <History size={16} />
                      </button>
                    </div>
                  </Card>
                ))}
              </div>
            </section>

            <section>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-slate-800">Diagnósticos Clínicos</h3>
                <div className="flex items-center space-x-1 text-[10px] text-slate-400 font-bold">
                  <Lock size={12} /> <span>APENAS MÉDICOS EDITAM</span>
                </div>
              </div>

              <div className="space-y-3">
                {patientData.diagnoses.map((d) => (
                  <div
                    key={d.id}
                    className="p-4 bg-white border border-slate-100 rounded-2xl flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-blue-500">
                        <ClipboardList size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">
                          {d.title}{" "}
                          <span className="text-xs font-normal text-slate-400 ml-2">
                            CID {d.cid}
                          </span>
                        </p>
                        <p className="text-[10px] text-slate-400 italic">
                          Validado por {d.doctor} em {d.date}
                        </p>
                      </div>
                    </div>
                    <button className="text-slate-300 hover:text-blue-500 transition-colors">
                      <Info size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </section>
          </div>
        );
    }
  };

  const renderSupportNetwork = () => (
    <div className="space-y-6">
      <header className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800">Rede de Apoio</h2>
        <p className="text-slate-500 text-sm">
          Gira quem pode auxiliar no seu cuidado e o nível de acesso de cada um.
        </p>
      </header>

      <Card>
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-lg">Pessoas Registadas</h3>
          <button className="p-2 bg-blue-600 text-white rounded-xl text-xs font-bold flex items-center">
            <Plus size={16} className="mr-1" /> Convidar Membro
          </button>
        </div>

        <div className="space-y-4">
          {supportNetwork.map((member, i) => (
            <div
              key={i}
              className="p-4 border border-slate-100 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-bold">
                  {member.name[0]}
                </div>
                <div>
                  <p className="font-bold text-slate-800">{member.name}</p>
                  <p className="text-xs text-slate-500">{member.relation}</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Badge variant={member.level.includes("Total") ? "success" : "warning"}>
                  {member.level}
                </Badge>
                <button className="px-3 py-1.5 text-[10px] font-bold text-slate-600 border rounded-lg hover:bg-slate-50">
                  Alterar Acesso
                </button>
                <button className="px-3 py-1.5 text-[10px] font-bold text-rose-500 hover:bg-rose-50 rounded-lg">
                  Remover
                </button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="bg-amber-50 border-amber-100">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="text-amber-500 flex-shrink-0" size={20} />
          <div>
            <p className="text-xs font-bold text-amber-900 mb-1">Dica de Segurança</p>
            <p className="text-[10px] text-amber-700 leading-relaxed">
              Dê preferência ao acesso <strong>"Restrito"</strong> para cuidadores ocasionais. O acesso{" "}
              <strong>"Total"</strong> deve ser reservado a familiares de extrema confiança, pois permite ver diagnósticos e gerir dados sensíveis.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );

  // -------------------- Layout --------------------

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans text-slate-900">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-slate-100 p-6 hidden md:flex flex-col">
        <div className="flex items-center space-x-3 mb-12">
          <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-200">
            <Heart className="text-white" size={24} fill="currentColor" />
          </div>
          <h1 className="text-xl font-black text-slate-800 tracking-tight italic">VitaFlow</h1>
        </div>

        <nav className="flex-1 space-y-1">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-semibold transition-all ${
              activeTab === "dashboard"
                ? "bg-blue-600 text-white shadow-md"
                : "text-slate-500 hover:bg-slate-50"
            }`}
          >
            <Activity size={20} /> <span className="text-sm">Dashboard</span>
          </button>

          {userRole === "paciente" && (
            <button
              onClick={() => setActiveTab("network")}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-semibold transition-all ${
                activeTab === "network"
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-slate-500 hover:bg-slate-50"
              }`}
            >
              <Users size={20} /> <span className="text-sm">Rede de Apoio</span>
            </button>
          )}

          <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-semibold text-slate-500 hover:bg-slate-50">
            <FileText size={20} /> <span className="text-sm">Histórico</span>
          </button>
          <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-semibold text-slate-500 hover:bg-slate-50">
            <ShieldCheck size={20} /> <span className="text-sm">Segurança</span>
          </button>

          <div className="pt-8 mt-8 border-t border-slate-50">
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-bold text-rose-500 hover:bg-rose-50 transition-all"
            >
              <ChevronLeft size={20} /> <span className="text-sm">Voltar ao Início</span>
            </button>
          </div>
        </nav>

        <div className="mt-auto pt-6">
          <div className="flex items-center justify-between p-2 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden border border-white">
                <img
                  src={`https://ui-avatars.com/api/?name=${userRole ?? "user"}&background=random`}
                  alt="User"
                />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase leading-none mb-1">
                  Perfil Ativo
                </p>
                <p className="text-xs font-bold text-slate-800 capitalize leading-none">
                  {userRole}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Sair"
              className="text-slate-400 hover:text-rose-500 transition-colors p-1"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Header Mobile */}
      <div className="md:hidden bg-white border-b border-slate-100 p-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center space-x-2">
          <Heart className="text-blue-600" size={20} fill="currentColor" />
          <span className="font-black italic text-slate-800">VitaFlow</span>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center text-xs font-bold text-rose-500 bg-rose-50 px-3 py-2 rounded-xl"
        >
          <ChevronLeft size={16} className="mr-1" /> Sair
        </button>
      </div>

      {/* Main */}
      <main className="flex-1 p-6 md:p-10 pb-24 md:pb-10 max-w-6xl mx-auto w-full overflow-y-auto">
        {activeTab === "dashboard" ? renderRoleDashboard() : renderSupportNetwork()}
      </main>

      {/* Mobile Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 z-50 px-4 py-3 flex justify-around items-center shadow-lg">
        <button
          onClick={() => setActiveTab("dashboard")}
          className={`p-3 rounded-2xl transition-all ${
            activeTab === "dashboard" ? "bg-blue-600 text-white" : "text-slate-400"
          }`}
        >
          <Activity size={20} />
        </button>

        {userRole === "paciente" && (
          <button
            onClick={() => setActiveTab("network")}
            className={`p-3 rounded-2xl transition-all ${
              activeTab === "network" ? "bg-blue-600 text-white" : "text-slate-400"
            }`}
          >
            <Users size={20} />
          </button>
        )}

        <button className="p-3 text-slate-400">
          <FileText size={20} />
        </button>

        <button onClick={handleLogout} className="p-3 text-rose-400">
          <LogOut size={20} />
        </button>
      </div>
    </div>
  );
}

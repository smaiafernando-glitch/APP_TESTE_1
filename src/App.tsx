import React, { useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Camera,
  CheckCircle,
  ChevronLeft,
  FileCheck,
  Heart,
  History,
  Plus,
  Upload,
  User,
  Users,
} from "lucide-react";

/** -------------------------
 *  Componentes UI simples
 *  ------------------------- */
const Card = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`bg-white rounded-2xl shadow-sm border border-slate-100 p-6 ${className}`}
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
      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
        styles[variant] ?? styles.default
      }`}
    >
      {children}
    </span>
  );
};

/** -------------------------
 *  Gráfico simulado (SVG)
 *  ------------------------- */
const SimpleLineChart = () => {
  const series = useMemo(() => [40, 70, 45, 90, 65, 80, 95], []);
  return (
    <div className="w-full h-32 flex items-end justify-between px-2 pt-4">
      {series.map((height, i) => (
        <div key={i} className="flex flex-col items-center flex-1 group">
          <div
            style={{ height: `${height}%` }}
            className="w-full max-w-[8px] bg-blue-100 rounded-full relative group-hover:bg-blue-500 transition-all duration-300"
          >
            {i === series.length - 1 && (
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-2 h-2 bg-blue-600 rounded-full border-2 border-white" />
            )}
          </div>
          <span className="text-[8px] text-slate-300 mt-2 font-bold uppercase">
            Dia {i + 1}
          </span>
        </div>
      ))}
    </div>
  );
};

/** -------------------------
 *  App
 *  ------------------------- */
type Role = "paciente" | "acompanhante";
type View = "login" | "signup_paciente" | "signup_apoio";
type Tab = "dashboard" | "network";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [view, setView] = useState<View>("login");
  const [userRole, setUserRole] = useState<Role | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole(null);
    setView("login");
    setActiveTab("dashboard");
  };

  const handleLogin = (role: Role) => {
    setUserRole(role);
    setIsLoggedIn(true);
    setActiveTab("dashboard");
  };

  const todayLabel = useMemo(() => {
    try {
      const d = new Date();
      const opt: Intl.DateTimeFormatOptions = { day: "2-digit", month: "short" };
      return d.toLocaleDateString("pt-BR", opt);
    } catch {
      return "Hoje";
    }
  }, []);

  /** -------------------------
   *  Login / Cadastro
   *  ------------------------- */
  if (!isLoggedIn) {
    if (view === "login") {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
          <div className="max-w-md w-full">
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center bg-blue-600 p-4 rounded-3xl shadow-xl shadow-blue-200 mb-4">
                <Heart className="text-white" size={40} fill="currentColor" />
              </div>
              <h1 className="text-3xl font-black text-slate-800 italic">
                VitaFlow
              </h1>
              <p className="text-slate-500 font-medium tracking-tight text-sm">
                Organização e cuidado compartilhado.
              </p>
            </div>

            <Card className="space-y-4">
              <h2 className="text-xl font-bold text-center text-slate-800 mb-6">
                Acessar conta
              </h2>

              <div className="space-y-3">
                <button
                  onClick={() => handleLogin("paciente")}
                  className="w-full p-4 border-2 border-slate-100 rounded-2xl flex items-center space-x-4 hover:border-blue-500 transition-all"
                >
                  <div className="bg-blue-50 p-2 rounded-lg text-blue-600">
                    <User size={20} />
                  </div>
                  <span className="font-bold text-slate-700">
                    Entrar como Paciente
                  </span>
                </button>

                <button
                  onClick={() => handleLogin("acompanhante")}
                  className="w-full p-4 border-2 border-slate-100 rounded-2xl flex items-center space-x-4 hover:border-purple-500 transition-all"
                >
                  <div className="bg-purple-50 p-2 rounded-lg text-purple-600">
                    <Users size={20} />
                  </div>
                  <span className="font-bold text-slate-700">
                    Entrar como Rede de Apoio
                  </span>
                </button>
              </div>

              <div className="relative py-4 flex items-center">
                <div className="flex-grow border-t border-slate-100" />
                <span className="flex-shrink mx-4 text-xs font-bold text-slate-300 uppercase">
                  Ou cadastre-se
                </span>
                <div className="flex-grow border-t border-slate-100" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setView("signup_paciente")}
                  className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-blue-50 transition-all"
                >
                  <Plus size={20} className="mb-2 text-blue-600" />
                  <span className="text-xs font-bold">Novo Paciente</span>
                </button>

                <button
                  onClick={() => setView("signup_apoio")}
                  className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-purple-50 transition-all"
                >
                  <Plus size={20} className="mb-2 text-purple-600" />
                  <span className="text-xs font-bold">Nova Rede de Apoio</span>
                </button>
              </div>
            </Card>
          </div>
        </div>
      );
    }

    // Cadastro
    const isPaciente = view === "signup_paciente";

    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full">
          <button
            onClick={() => setView("login")}
            className="mb-6 flex items-center text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors"
          >
            <ChevronLeft size={18} className="mr-1" /> Voltar ao Login
          </button>

          <Card className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-slate-800">
                Criar Nova Conta
              </h2>
              <p className="text-sm text-slate-400">
                {isPaciente ? "Cadastro para Paciente" : "Cadastro para Rede de Apoio"}
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase ml-1">
                  E-mail
                </label>
                <input
                  type="email"
                  placeholder="seu@email.com"
                  className="w-full p-3 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-500 mt-1"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase ml-1">
                  Senha
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full p-3 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-500 mt-1"
                />
              </div>

              <button
                onClick={() => handleLogin(isPaciente ? "paciente" : "acompanhante")}
                className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all"
              >
                Concluir Cadastro
              </button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  /** -------------------------
   *  Dashboard
   *  ------------------------- */
  const renderDashboard = () => {
    return (
      <div className="space-y-8">
        {/* Banner Legal/Safety */}
        <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl flex items-start space-x-3">
          <AlertTriangle className="text-amber-500 flex-shrink-0" size={20} />
          <p className="text-[11px] text-amber-800 leading-relaxed font-medium">
            <strong>Atenção:</strong> Este aplicativo é uma ferramenta de organização pessoal.
            As informações são registradas por você. O app{" "}
            <strong>não realiza diagnósticos, não interpreta sintomas e não substitui</strong>{" "}
            a orientação do seu médico.
          </p>
        </div>

        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Olá!</h2>
            <p className="text-slate-500 text-sm italic">
              “Como você está se sentindo hoje?”
            </p>
          </div>

          <div className="flex space-x-2">
            <button className="bg-white border border-slate-200 px-4 py-2 rounded-xl text-xs font-bold flex items-center text-slate-600">
              <History size={14} className="mr-2" /> Histórico
            </button>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center shadow-lg shadow-blue-100">
              <Plus size={14} className="mr-2" /> Novo Registro
            </button>
          </div>
        </header>

        {/* Relato do dia */}
        <section>
          <Card className="bg-white border-blue-50 shadow-md">
            <h3 className="font-bold text-slate-800 flex items-center mb-4">
              <span className="inline-flex items-center justify-center mr-2 text-blue-500">
                {/* usando o Heart como ícone pequeno para manter imports simples */}
                <Heart size={18} />
              </span>
              Meu Relato do Dia
            </h3>

            <div className="space-y-4">
              <p className="text-sm text-slate-600 font-medium">
                Escreva como foi o seu dia, em suas palavras (sem termos médicos):
              </p>

              <textarea
                className="w-full p-4 bg-slate-50 rounded-xl border-none text-sm placeholder:text-slate-400 focus:ring-2 focus:ring-blue-100 min-h-[100px] resize-none"
                placeholder="Ex: Hoje senti cansaço à tarde, mas dormi bem…"
              />

              <div className="flex justify-end">
                <button className="px-6 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl shadow-sm hover:bg-blue-700 transition-colors">
                  Salvar Relato
                </button>
              </div>
            </div>
          </Card>
        </section>

        {/* “Gráficos” de evolução (auto-relato visual) */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Meu Bem-estar
                </h4>
                <p className="text-2xl font-black text-slate-800">Ótimo</p>
              </div>
              <Badge variant="success">Tendência ↑</Badge>
            </div>
            <p className="text-[10px] text-slate-400 mb-4 italic">
              Auto-relato dos últimos 7 dias
            </p>
            <SimpleLineChart />
          </Card>

          <Card>
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Frequência de Registro
                </h4>
                <p className="text-2xl font-black text-slate-800">95%</p>
              </div>
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <BarChart3 size={20} />
              </div>
            </div>

            <p className="text-[10px] text-slate-400 mb-4 italic">
              Assiduidade na organização
            </p>

            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-8">
              <div className="bg-blue-500 h-full w-[95%]" />
            </div>

            <div className="flex justify-between mt-2">
              <span className="text-[10px] font-bold text-slate-400">
                Objetivo: 100%
              </span>
              <span className="text-[10px] font-bold text-blue-600">
                Quase lá!
              </span>
            </div>
          </Card>
        </section>

        {/* Medicações */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-slate-800">Agenda de Medicações</h3>
            <span className="text-[10px] font-bold text-slate-400 uppercase">
              Hoje, {todayLabel}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border-l-4 border-l-emerald-500 bg-emerald-50/20">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] font-black text-emerald-600 uppercase">
                    Tomado às 08:05
                  </p>
                  <h4 className="font-bold text-slate-800">Losartana</h4>
                  <p className="text-xs text-slate-500">
                    1 comprimido • 08:00
                  </p>
                </div>
                <div className="p-2 bg-emerald-500 text-white rounded-full">
                  <CheckCircle size={16} />
                </div>
              </div>
            </Card>

            <Card className="border-l-4 border-l-amber-500">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] font-black text-amber-600 uppercase">
                    Agendado
                  </p>
                  <h4 className="font-bold text-slate-800">Anlodipino</h4>
                  <p className="text-xs text-slate-500">
                    1 comprimido • 20:00
                  </p>
                </div>
                <button className="p-2 bg-white border border-slate-100 text-slate-300 rounded-full hover:bg-slate-50">
                  <Plus size={16} />
                </button>
              </div>
            </Card>
          </div>
        </section>

        {/* Receitas (referência) */}
        <section>
          <h3 className="font-bold text-slate-800 mb-4">
            Minhas Receitas (Referência)
          </h3>

          <Card className="border-dashed border-2 border-slate-200 bg-slate-50/50 flex flex-col items-center justify-center p-8">
            <div className="bg-white p-4 rounded-full shadow-sm mb-4 text-slate-400">
              <Camera size={28} />
            </div>

            <p className="font-bold text-slate-700 text-xs">
              Fotografar/Salvar Receita do Médico
            </p>

            <p className="text-[10px] text-slate-400 mt-2 text-center max-w-[280px]">
              Apenas para consulta pessoal. O app não interpreta nem sugere tratamentos.
            </p>

            <button className="mt-4 px-5 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-bold hover:bg-slate-50 transition-all flex items-center">
              <Upload size={12} className="mr-2" /> Carregar Imagem
            </button>
          </Card>
        </section>
      </div>
    );
  };

  /** -------------------------
   *  Layout
   *  ------------------------- */
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans text-slate-900">
      {/* Sidebar Desktop */}
      <aside className="w-full md:w-64 bg-white border-r border-slate-100 p-6 hidden md:flex flex-col">
        <div className="flex items-center space-x-3 mb-12">
          <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-200">
            <Heart className="text-white" size={24} fill="currentColor" />
          </div>
          <h1 className="text-xl font-black text-slate-800 tracking-tight italic">
            VitaFlow
          </h1>
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
            <Activity size={20} /> <span className="text-sm">Painel Principal</span>
          </button>

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

          <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-semibold text-slate-500 hover:bg-slate-50">
            <FileCheck size={20} /> <span className="text-sm">Minhas Receitas</span>
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

        <div className="mt-auto pt-6 border-t border-slate-50 flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-slate-100 border flex items-center justify-center font-bold text-slate-400 text-xs uppercase">
            {userRole?.[0] ?? "U"}
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase leading-none">
              Acesso
            </p>
            <p className="text-xs font-bold text-slate-800 capitalize leading-none">
              {userRole ?? "usuário"}
            </p>
          </div>
        </div>
      </aside>

      {/* Header Mobile */}
      <div className="md:hidden bg-white border-b border-slate-100 p-4 flex justify-between items-center sticky top-0 z-50 shadow-sm">
        <div className="flex items-center space-x-2">
          <Heart className="text-blue-600" size={20} fill="currentColor" />
          <span className="font-black italic text-slate-800">VitaFlow</span>
        </div>
        <button
          onClick={handleLogout}
          className="text-rose-500 font-bold text-xs bg-rose-50 px-3 py-1.5 rounded-xl"
        >
          Sair
        </button>
      </div>

      {/* Conteúdo */}
      <main className="flex-1 p-6 md:p-10 pb-24 md:pb-10 max-w-5xl mx-auto w-full overflow-y-auto">
        {activeTab === "dashboard" ? (
          renderDashboard()
        ) : (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-800">Rede de Apoio</h2>
            <p className="text-sm text-slate-500 italic">
              Cuidadores e familiares autorizados por você.
            </p>

            <Card className="text-center p-12 bg-slate-50 border-dashed border-2">
              <Users className="mx-auto text-slate-200 mb-4" size={48} />
              <p className="font-bold text-slate-700">Ninguém vinculado ainda</p>
              <p className="text-xs text-slate-400 mt-2">
                Compartilhe sua organização com quem você confia.
              </p>
              <button className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold text-sm shadow-lg shadow-blue-100">
                Convidar Acompanhante
              </button>
            </Card>
          </div>
        )}
      </main>

      {/* Nav Mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 z-50 px-4 py-3 flex justify-around items-center shadow-lg">
        <button
          onClick={() => setActiveTab("dashboard")}
          className={`p-3 rounded-2xl ${
            activeTab === "dashboard" ? "bg-blue-600 text-white" : "text-slate-400"
          }`}
        >
          <Activity size={20} />
        </button>

        <button
          onClick={() => setActiveTab("network")}
          className={`p-3 rounded-2xl ${
            activeTab === "network" ? "bg-blue-600 text-white" : "text-slate-400"
          }`}
        >
          <Users size={20} />
        </button>

        <button className="p-3 text-slate-400">
          <FileCheck size={20} />
        </button>
      </div>
    </div>
  );
}

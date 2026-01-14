import React, { useState } from 'react';
import {
  Heart,
  User,
  Activity,
  Plus,
  CheckCircle,
  Users,
  ChevronLeft,
  ChevronRight,
  Camera,
  Upload,
  Smile,
  AlertTriangle,
  FileCheck,
  Clock,
  Calendar,
  Settings,
  Shield,
  Stethoscope,
  Link as LinkIcon,
  X
} from 'lucide-react';

// --- Componentes de UI Auxiliares ---

const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white rounded-2xl shadow-sm border border-slate-100 p-6 ${className}`}>
    {children}
  </div>
);

const Badge = ({
  children,
  variant = "default"
}: {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "info";
}) => {
  const styles: Record<string, string> = {
    default: "bg-blue-50 text-blue-600",
    success: "bg-emerald-50 text-emerald-600",
    warning: "bg-amber-50 text-amber-600",
    danger: "bg-rose-50 text-rose-600",
    info: "bg-purple-50 text-purple-600"
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${styles[variant]}`}>
      {children}
    </span>
  );
};

// --- Gráficos simples (mock) ---

const MiniBars = () => (
  <div className="w-full h-24 flex items-end gap-2">
    {[22, 40, 28, 55, 42, 60, 72].map((h, i) => (
      <div key={i} className="flex-1 flex flex-col items-center">
        <div className="w-full rounded-full bg-blue-100 overflow-hidden h-24 flex items-end">
          <div className="w-full bg-blue-600 rounded-full" style={{ height: `${h}%` }} />
        </div>
        <span className="mt-2 text-[9px] font-black text-slate-300 uppercase">D{i + 1}</span>
      </div>
    ))}
  </div>
);

const ProgressBar = ({ value = 95 }: { value?: number }) => (
  <div className="mt-6">
    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
      <div className="bg-blue-600 h-full" style={{ width: `${value}%` }} />
    </div>
    <div className="flex justify-between mt-2">
      <span className="text-[10px] font-black text-slate-400">Objetivo: 100%</span>
      <span className="text-[10px] font-black text-blue-600">{value}%</span>
    </div>
  </div>
);

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

// --- Aplicação Principal ---

export default function App() {
  const [view, setView] = useState<'login' | 'signup' | 'dashboard'>('login');
  const [userRole, setUserRole] = useState<'paciente' | 'apoio' | 'medico' | null>(null);
  const [signupStep, setSignupStep] = useState(1);
  const [activeTab, setActiveTab] = useState<'home' | 'network' | 'history'>('home');
  const [showLegalNotice, setShowLegalNotice] = useState(true);

  // Disposição (0 a 10)
  const [disposicao, setDisposicao] = useState<number>(7);

  // Mock de Dados de Tratamento
  const [treatments] = useState([
    { id: 1, name: 'Losartana', dose: '50mg', time: '08:00', status: 'tomado', obs: 'Tomar em jejum' },
    { id: 2, name: 'Anlodipino', dose: '5mg', time: '20:00', status: 'pendente', obs: '' },
  ] as const);

  const handleLogout = () => {
    setUserRole(null);
    setView('login');
    setSignupStep(1);
    setActiveTab('home');
    setShowLegalNotice(true);
  };

  const handleLogin = (role: 'paciente' | 'apoio' | 'medico') => {
    setUserRole(role);
    setView('dashboard');
    setActiveTab('home');
  };

  const LegalBanner = () => (
    <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl flex items-start space-x-3">
      <AlertTriangle className="text-amber-500 flex-shrink-0" size={20} />
      <div className="text-[11px] text-amber-800 leading-relaxed font-medium">
        <p className="font-black mb-1 uppercase">Aviso Legal Obrigatório:</p>
        Este aplicativo é uma ferramenta de organização pessoal. As informações são fornecidas pelo próprio usuário.
        O app <strong>não realiza diagnósticos, não substitui avaliação médica</strong> e não deve ser utilizado para decisões clínicas.
      </div>
    </div>
  );

  // --- Fluxo de Cadastro em Etapas ---
  const renderSignup = () => {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-xl w-full">
          <button
            onClick={() => { setView('login'); setSignupStep(1); }}
            className="mb-4 flex items-center text-sm font-black text-slate-400 hover:text-blue-600 transition-colors"
          >
            <ChevronLeft size={18} /> Cancelar Cadastro
          </button>

          <Card className="relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-slate-100 flex">
              {[1, 2, 3, 4].map(step => (
                <div
                  key={step}
                  className={`flex-1 transition-all duration-500 ${signupStep >= step ? 'bg-blue-600' : 'bg-transparent'}`}
                />
              ))}
            </div>

            <div className="mt-4">
              <p className="text-[10px] font-black text-blue-600 uppercase mb-1">Passo {signupStep} de 4</p>

              {signupStep === 1 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-black text-slate-800">Dados Básicos</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="text" placeholder="Nome Completo" className="w-full p-3 rounded-xl bg-slate-50 text-sm" />
                    <input type="text" placeholder="CPF" className="w-full p-3 rounded-xl bg-slate-50 text-sm" />
                    <input type="date" className="w-full p-3 rounded-xl bg-slate-50 text-sm" />
                    <input type="tel" placeholder="Telefone" className="w-full p-3 rounded-xl bg-slate-50 text-sm" />
                    <input type="text" placeholder="Endereço" className="w-full p-3 rounded-xl bg-slate-50 text-sm col-span-full" />
                    <input type="text" placeholder="Contato de Emergência" className="w-full p-3 rounded-xl bg-slate-50 text-sm" />
                    <select className="w-full p-3 rounded-xl bg-slate-50 text-sm">
                      <option>Estado Civil</option>
                      <option>Solteiro(a)</option>
                      <option>Casado(a)</option>
                      <option>Divorciado(a)</option>
                      <option>Viúvo(a)</option>
                    </select>
                  </div>
                </div>
              )}

              {signupStep === 2 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-black text-slate-800">Dados de Rotina</h2>
                  <p className="text-xs text-slate-400">Informações declaratórias para auxílio na organização.</p>
                  <div className="grid grid-cols-2 gap-4">
                    <input type="text" placeholder="Peso (kg)" className="p-3 rounded-xl bg-slate-50 text-sm" />
                    <input type="text" placeholder="Altura (cm)" className="p-3 rounded-xl bg-slate-50 text-sm" />
                    <input type="text" placeholder="Profissão" className="col-span-full p-3 rounded-xl bg-slate-50 text-sm" />
                    <textarea placeholder="Horários habituais (Sono, alimentação, trabalho...)" className="col-span-full p-3 rounded-xl bg-slate-50 text-sm h-24" />
                    <textarea placeholder="Hábitos de vida (Ex: Caminhada 3x na semana)" className="col-span-full p-3 rounded-xl bg-slate-50 text-sm h-20" />
                  </div>
                </div>
              )}

              {signupStep === 3 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-black text-slate-800">Informações de Saúde</h2>
                  <p className="text-[10px] text-amber-600 font-black bg-amber-50 p-2 rounded-lg uppercase">Apenas texto simples • Sem validação clínica</p>
                  <div className="space-y-4">
                    <textarea placeholder="Condições pré-existentes (auto declaradas)" className="w-full p-3 rounded-xl bg-slate-50 text-sm h-24" />
                    <textarea placeholder="Uso contínuo de medicamentos (auto declarado)" className="w-full p-3 rounded-xl bg-slate-50 text-sm h-20" />
                    <input type="text" placeholder="Alergias conhecidas" className="w-full p-3 rounded-xl bg-slate-50 text-sm" />
                  </div>
                </div>
              )}

              {signupStep === 4 && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-black text-slate-800">Rede de Apoio</h2>
                    <span className="text-[10px] font-black text-slate-400 bg-slate-100 px-2 py-1 rounded">Opcional</span>
                  </div>
                  <p className="text-xs text-slate-500">Pessoas que poderão visualizar sua agenda e registros.</p>
                  <div className="space-y-3">
                    <input type="text" placeholder="Nome do contato" className="w-full p-3 rounded-xl bg-slate-50 text-sm" />
                    <select className="w-full p-3 rounded-xl bg-slate-50 text-sm">
                      <option>Grau de Relação</option>
                      <option>Filho(a)</option>
                      <option>Cônjuge</option>
                      <option>Cuidador Profissional</option>
                      <option>Outro Familiar</option>
                    </select>
                    <input type="email" placeholder="E-mail para convite" className="w-full p-3 rounded-xl bg-slate-50 text-sm" />
                  </div>
                </div>
              )}

              <div className="flex justify-between mt-8">
                {signupStep > 1 ? (
                  <button onClick={() => setSignupStep(s => s - 1)} className="px-6 py-3 font-black text-slate-400 text-sm">Anterior</button>
                ) : (
                  <div />
                )}
                <button
                  onClick={() => signupStep < 4 ? setSignupStep(s => s + 1) : handleLogin('paciente')}
                  className="px-8 py-3 bg-blue-600 text-white rounded-xl font-black shadow-lg shadow-blue-100 flex items-center"
                >
                  {signupStep === 4 ? 'Concluir' : 'Próximo'} <ChevronRight size={16} className="ml-1" />
                </button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  };

  // --- Telas de Dashboard ---

  const renderHome = () => (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800">Olá, Ricardo</h2>
          <p className="text-slate-500 text-sm italic">Como você está hoje?</p>
        </div>
        <div className="flex space-x-2">
          <button className="bg-white border border-slate-200 px-4 py-2 rounded-xl text-xs font-black flex items-center text-slate-600">
            <Calendar size={14} className="mr-2" /> Agenda
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-black flex items-center shadow-lg shadow-blue-100">
            <Plus size={14} className="mr-2" /> Novo Registro
          </button>
        </div>
      </header>

      {/* Disposição (0 a 10) */}
      <section>
        <Card className="border-blue-50">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="font-black text-slate-800 text-sm mb-1">Como está sua disposição hoje?</h3>
              <p className="text-[10px] text-slate-400 italic">
                0 = muito indisposto • 10 = muito disposto
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black text-slate-400 uppercase">Nota</p>
              <p className="text-2xl font-black text-blue-600 leading-none">{disposicao}</p>
            </div>
          </div>

          <div className="mt-5">
            <input
              type="range"
              min={0}
              max={10}
              step={1}
              value={disposicao}
              onChange={(e) => setDisposicao(clamp(Number(e.target.value), 0, 10))}
              className="w-full"
            />
            <div className="flex justify-between mt-2">
              <span className="text-[10px] font-black text-slate-300">0</span>
              <span className="text-[10px] font-black text-slate-300">10</span>
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <button className="px-5 py-2 bg-blue-600 text-white text-xs font-black rounded-lg shadow-md">
              Salvar disposição
            </button>
          </div>
        </Card>
      </section>

      {/* Gráficos (mock) */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <div className="flex items-start justify-between mb-2">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Bem-estar (auto-relato)</p>
              <p className="text-2xl font-black text-slate-800">Ótimo</p>
            </div>
            <Badge variant="success">Tendência ↑</Badge>
          </div>
          <p className="text-[10px] text-slate-400 italic mb-4">Últimos 7 dias (exemplo)</p>
          <MiniBars />
        </Card>

        <Card>
          <div className="flex items-start justify-between mb-2">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Frequência de registro</p>
              <p className="text-2xl font-black text-slate-800">95%</p>
            </div>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Activity size={18} />
            </div>
          </div>
          <p className="text-[10px] text-slate-400 italic">Assiduidade na organização (exemplo)</p>
          <ProgressBar value={95} />
        </Card>
      </section>

      {/* Registro de Evolução (Auto Relato) */}
      <section>
        <Card>
          <h3 className="font-black text-slate-800 flex items-center mb-4">
            <Smile size={18} className="mr-2 text-blue-500" /> Meu Relato do Dia
          </h3>
          <p className="text-[10px] text-slate-400 mb-3 italic">Escreva em linguagem simples. Sem análises médicas automáticas.</p>
          <textarea
            className="w-full p-4 bg-slate-50 rounded-xl border-none text-sm min-h-[110px] resize-none focus:ring-2 focus:ring-blue-100"
            placeholder="Ex: Hoje me senti cansado à tarde, mas dormi bem."
          />
          <div className="flex justify-end mt-3">
            <button className="px-5 py-2 bg-blue-600 text-white text-xs font-black rounded-lg shadow-md">Salvar Relato</button>
          </div>
        </Card>
      </section>

      {/* Tratamentos Atuais */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-black text-slate-800">Tratamentos Atuais</h3>
          <Badge>Apenas organizacional</Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {treatments.map(t => (
            <Card key={t.id} className={`border-l-4 ${t.status === 'tomado' ? 'border-emerald-500' : 'border-amber-500'}`}>
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <Clock size={12} className="text-slate-400" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{t.time}</span>
                  </div>
                  <h4 className="font-black text-slate-800">{t.name}</h4>
                  <p className="text-xs text-slate-500 font-medium">Dose: {t.dose}</p>
                  {t.obs && <p className="text-[10px] bg-slate-50 p-1.5 rounded inline-block text-slate-600">⚠️ {t.obs}</p>}
                </div>
                <button className={`p-2 rounded-full ${t.status === 'tomado' ? 'bg-emerald-500 text-white' : 'bg-slate-50 text-slate-300 border border-slate-100'}`}>
                  {t.status === 'tomado' ? <CheckCircle size={18} /> : <Plus size={18} />}
                </button>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Receitas Médicas */}
      <section>
        <h3 className="font-black text-slate-800 mb-4">Minhas Receitas (Referência)</h3>
        <Card className="border-dashed border-2 border-slate-200 bg-slate-50/50 flex flex-col items-center justify-center p-8 text-center">
          <div className="bg-white p-4 rounded-full shadow-sm mb-4 text-slate-400">
            <Camera size={28} />
          </div>
          <p className="font-black text-slate-700 text-xs mb-1">Upload de Foto da Receita</p>
          <p className="text-[10px] text-slate-400 max-w-xs mb-4 italic">O app não interpreta receitas e não substitui orientação profissional.</p>
          <button className="px-5 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black hover:bg-slate-50 transition-all flex items-center">
            <Upload size={12} className="mr-2" /> Selecionar Arquivo
          </button>
        </Card>
      </section>
    </div>
  );

  const renderNetwork = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-slate-800">Rede de Apoio</h2>
          <p className="text-sm text-slate-500 italic">Quem cuida de você.</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-black flex items-center shadow-lg shadow-blue-100">
          <Plus size={14} className="mr-2" /> Convidar
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-black">MF</div>
          <div className="flex-1">
            <h4 className="font-black text-slate-800">Maria Fernanda</h4>
            <p className="text-xs text-slate-400">Filha • Acesso Completo</p>
          </div>
          <button className="text-slate-300"><Settings size={18} /></button>
        </Card>

        <Card className="border-dashed border-2 border-slate-100 flex flex-col items-center justify-center p-6 text-center">
          <LinkIcon size={24} className="text-slate-200 mb-2" />
          <p className="text-xs font-black text-slate-400">Enviar link de convite por WhatsApp</p>
        </Card>
      </div>

      <Card>
        <h3 className="font-black text-slate-800 mb-4 text-sm flex items-center">
          <Shield size={16} className="mr-2 text-blue-500" /> Gestão de Acessos de Rede
        </h3>
        <div className="space-y-4">
          {['Visualizar Agenda', 'Receber Alertas de Atraso', 'Visualizar Relatos Diários', 'Consultar Histórico de Receitas'].map((perm, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
              <span className="text-xs font-medium text-slate-600">{perm}</span>
              <div className="w-10 h-5 bg-blue-100 rounded-full relative flex items-center px-1">
                <div className="w-3.5 h-3.5 bg-blue-600 rounded-full translate-x-4"></div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  // --- Login ---

  if (view === 'login') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center bg-blue-600 p-4 rounded-3xl shadow-xl shadow-blue-200 mb-4">
              <Heart className="text-white" size={40} fill="currentColor" />
            </div>
            <h1 className="text-3xl font-black text-slate-800 italic tracking-tighter">VitaFlow</h1>
            <p className="text-slate-500 font-medium tracking-tight text-sm">Organização declaratória e compartilhada.</p>
          </div>

          <Card className="space-y-4">
            {/* ALTERADO AQUI */}
            <h2 className="text-xl font-black text-center text-slate-800 mb-6">Acessar conta</h2>

            <div className="space-y-3">
              <button onClick={() => handleLogin('paciente')} className="w-full p-4 border-2 border-slate-100 rounded-2xl flex items-center space-x-4 hover:border-blue-500 transition-all text-left">
                <div className="bg-blue-50 p-2 rounded-lg text-blue-600"><User size={20} /></div>
                <div>
                  <span className="font-black text-slate-800 block">Sou Paciente</span>
                  <span className="text-[10px] text-slate-400">Gerir minha rotina e rede de apoio</span>
                </div>
              </button>

              <button onClick={() => handleLogin('apoio')} className="w-full p-4 border-2 border-slate-100 rounded-2xl flex items-center space-x-4 hover:border-purple-500 transition-all text-left">
                <div className="bg-purple-50 p-2 rounded-lg text-purple-600"><Users size={20} /></div>
                <div>
                  <span className="font-black text-slate-800 block">Sou Rede de Apoio</span>
                  <span className="text-[10px] text-slate-400">Acompanhar um familiar ou paciente</span>
                </div>
              </button>

              <button onClick={() => handleLogin('medico')} className="w-full p-4 border-2 border-slate-100 rounded-2xl flex items-center space-x-4 hover:border-emerald-500 transition-all text-left">
                <div className="bg-emerald-50 p-2 rounded-lg text-emerald-600"><Stethoscope size={20} /></div>
                <div>
                  <span className="font-black text-slate-800 block">Sou Médico</span>
                  <span className="text-[10px] text-slate-400">Visualizar informações autorizadas</span>
                </div>
              </button>
            </div>

            <div className="relative py-4 flex items-center">
              <div className="flex-grow border-t border-slate-100"></div>
              <span className="flex-shrink mx-4 text-[10px] font-black text-slate-300 uppercase">Novo por aqui?</span>
              <div className="flex-grow border-t border-slate-100"></div>
            </div>

            <button onClick={() => setView('signup')} className="w-full py-4 bg-slate-800 text-white rounded-2xl font-black shadow-lg shadow-slate-200 hover:bg-slate-900 transition-all">
              Criar Conta de Paciente
            </button>
          </Card>

          <div className="mt-8">
            <LegalBanner />
          </div>
        </div>
      </div>
    );
  }

  if (view === 'signup') return renderSignup();

  // --- Dashboard ---

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans text-slate-900">

      {/* Sidebar Desktop */}
      <aside className="w-full md:w-64 bg-white border-r border-slate-100 p-6 hidden md:flex flex-col">
        <div className="flex items-center space-x-3 mb-12">
          <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-200">
            <Heart className="text-white" size={24} fill="currentColor" />
          </div>
          <h1 className="text-xl font-black text-slate-800 tracking-tight italic">VitaFlow</h1>
        </div>

        <nav className="flex-1 space-y-1">
          <button onClick={() => setActiveTab('home')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-black transition-all ${activeTab === 'home' ? 'bg-blue-600 text-white shadow-md shadow-blue-100' : 'text-slate-500 hover:bg-slate-50'}`}>
            <Activity size={20} /> <span className="text-sm">Home</span>
          </button>

          <button onClick={() => setActiveTab('network')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-black transition-all ${activeTab === 'network' ? 'bg-blue-600 text-white shadow-md shadow-blue-100' : 'text-slate-500 hover:bg-slate-50'}`}>
            <Users size={20} /> <span className="text-sm">Rede de Apoio</span>
          </button>

          <button onClick={() => setActiveTab('history')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-black transition-all ${activeTab === 'history' ? 'bg-blue-600 text-white shadow-md shadow-blue-100' : 'text-slate-500 hover:bg-slate-50'}`}>
            <FileCheck size={20} /> <span className="text-sm">Histórico</span>
          </button>

          <div className="pt-8 mt-8 border-t border-slate-50">
            <button onClick={handleLogout} className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-black text-rose-500 hover:bg-rose-50 transition-all">
              <ChevronLeft size={20} /> <span className="text-sm">Sair</span>
            </button>
          </div>
        </nav>

        <div className="mt-auto pt-6 border-t border-slate-50 flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-slate-100 border flex items-center justify-center font-black text-slate-400 text-xs uppercase">
            {userRole?.[0] ?? 'U'}
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase leading-none">Perfil</p>
            <p className="text-xs font-black text-slate-800 capitalize leading-none">{userRole}</p>
          </div>
        </div>
      </aside>

      {/* Header Mobile com botão Home */}
      <div className="md:hidden bg-white border-b border-slate-100 px-4 py-3 flex items-center justify-between sticky top-0 z-50">
        <button
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-2 text-slate-700 font-black text-sm"
        >
          <Heart className="text-blue-600" size={18} fill="currentColor" />
          <span className="italic">VitaFlow</span>
        </button>

        <button
          onClick={handleLogout}
          className="text-rose-500 font-black text-xs bg-rose-50 px-3 py-2 rounded-xl"
        >
          Sair
        </button>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 pb-24 max-w-5xl mx-auto w-full">
        {showLegalNotice && (
          <div className="mb-8 relative">
            <LegalBanner />
            <button
              onClick={() => setShowLegalNotice(false)}
              className="absolute top-2 right-2 p-1 text-amber-400 hover:text-amber-600"
            >
              <X size={14} />
            </button>
          </div>
        )}

        {activeTab !== 'home' && (
          <button
            onClick={() => setActiveTab('home')}
            className="hidden md:inline-flex items-center gap-2 mb-6 text-sm font-black text-slate-500 hover:text-blue-600"
          >
            <ChevronLeft size={16} />
            Voltar ao Home
          </button>
        )}

        {activeTab === 'home' && renderHome()}
        {activeTab === 'network' && renderNetwork()}
        {activeTab === 'history' && (
          <div className="space-y-4">
            <h2 className="text-2xl font-black text-slate-800">Meu Histórico</h2>
            <p className="text-sm text-slate-500 italic mb-6">Linha do tempo organizacional de relatos e ações.</p>
            {[1, 2, 3].map(day => (
              <Card key={day} className="border-l-4 border-l-slate-200">
                <p className="text-[10px] font-black text-slate-400 uppercase mb-2">1{day} de Janeiro, 2026</p>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 text-xs">
                    <CheckCircle size={14} className="text-emerald-500" />
                    <span className="text-slate-600">Medicação Tomada: Losartana (08:05)</span>
                  </div>
                  <div className="flex items-start space-x-3 text-xs">
                    <Smile size={14} className="text-blue-500 mt-0.5" />
                    <span className="text-slate-500 italic">"Relato: Senti um pouco de tontura ao levantar, mas passou rápido."</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Mobile Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 z-50 px-4 py-3 flex justify-around items-center shadow-lg">
        <button onClick={() => setActiveTab('home')} className={`p-3 rounded-2xl ${activeTab === 'home' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}><Activity size={20} /></button>
        <button onClick={() => setActiveTab('network')} className={`p-3 rounded-2xl ${activeTab === 'network' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}><Users size={20} /></button>
        <button onClick={() => setActiveTab('history')} className={`p-3 rounded-2xl ${activeTab === 'history' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}><FileCheck size={20} /></button>
      </div>
    </div>
  );
}

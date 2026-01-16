// ✅ ALTERAÇÃO ÚNICA: dentro do TabPerfil, na seção "REDE DE APOIO / PACIENTES",
// incluí o bloco "Gestão de permissão de acesso do acompanhante" sem mexer em outras abas/estruturas.

const TabPerfil = ({ user, setUser, onEditProfile }) => {
  const [goals, setGoals] = useState([]);

  const toggleGoal = (id) => {
    if (goals.includes(id)) setGoals(goals.filter(g => g !== id));
    else setGoals([...goals, id]);
  };

  const isPatient = user.role === 'patient';
  const isCaregiver = user.role === 'caregiver' || user.role === 'professional';

  // ✅ NOVO (apenas para gestão de permissão do acompanhante)
  const [caregiverPerms, setCaregiverPerms] = useState({
    exams_all: true,              // Visualização de resultados de exames (todos)
    exams_selected: false,        // Visualização de resultados de exames (selecionar)
    meds_agenda: true,            // Visualizações de agenda de medicamentos
    appointments_manage: false,   // Cadastro de consultas médicas
    basic_health_share: true,     // Compartilhar dados básicos de saúde
  });

  const [selectedExams, setSelectedExams] = useState(['Hemograma Completo']); // exemplo (não apaga exemplos)

  const toggleCaregiverPerm = (key) => {
    // regra: "todos" e "selecionar" não podem ficar true ao mesmo tempo
    if (key === 'exams_all') {
      setCaregiverPerms(prev => ({
        ...prev,
        exams_all: !prev.exams_all,
        exams_selected: prev.exams_all ? prev.exams_selected : false,
      }));
      return;
    }
    if (key === 'exams_selected') {
      setCaregiverPerms(prev => ({
        ...prev,
        exams_selected: !prev.exams_selected,
        exams_all: prev.exams_selected ? prev.exams_all : false,
      }));
      return;
    }
    setCaregiverPerms(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleExamItem = (name) => {
    setSelectedExams(prev => prev.includes(name) ? prev.filter(x => x !== name) : [...prev, name]);
  };

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

          {/* ✅ NOVO: Gestão de permissão de acesso do acompanhante (dentro da Rede de Apoio) */}
          {!isCaregiver && (
            <Card className="p-4">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shrink-0">
                  <ShieldCheck size={20} />
                </div>
                <div className="flex-1">
                  <p className="font-black text-slate-900 text-sm">Gestão de permissão de acesso do acompanhante</p>
                  <p className="text-[10px] text-slate-400 font-medium">
                    Defina exatamente o que <b>Maria Silva</b> pode visualizar e cadastrar.
                  </p>
                </div>
              </div>

              {[
                {
                  key: 'exams_all',
                  title: 'Visualização de resultados de exames',
                  desc: 'Acesso a todos os exames',
                  lockedBy: 'exams_selected',
                },
                {
                  key: 'exams_selected',
                  title: 'Visualização de resultados de exames',
                  desc: 'Selecionar exames específicos',
                  lockedBy: 'exams_all',
                },
                {
                  key: 'meds_agenda',
                  title: 'Visualizações de agenda de medicamentos',
                  desc: 'Acompanha rotina e marcações',
                },
                {
                  key: 'appointments_manage',
                  title: 'Cadastro de consultas médicas',
                  desc: 'Pode criar e editar consultas',
                },
                {
                  key: 'basic_health_share',
                  title: 'Compartilhar dados básicos de saúde',
                  desc: 'Peso, pressão, glicemia, temperatura',
                },
              ].map((perm) => {
                const on = !!caregiverPerms[perm.key];
                const locked = perm.lockedBy && caregiverPerms[perm.lockedBy] === true;

                return (
                  <button
                    key={perm.key}
                    onClick={() => { if (!locked) toggleCaregiverPerm(perm.key); }}
                    className="w-full flex items-center justify-between py-3 border-b border-slate-50 last:border-0 text-left active:scale-[0.99] transition-all"
                    type="button"
                  >
                    <div className="flex-1 pr-4">
                      <p className={`font-bold text-sm ${locked ? 'text-slate-300' : 'text-slate-800'}`}>{perm.title}</p>
                      <p className={`text-[10px] font-medium ${locked ? 'text-slate-200' : 'text-slate-400'}`}>{perm.desc}</p>
                    </div>

                    <div className={`w-12 h-6 rounded-full relative p-1 transition-colors ${on ? 'bg-blue-600' : 'bg-slate-200'} ${locked ? 'opacity-40' : ''}`}>
                      <div className={`w-4 h-4 bg-white rounded-full transition-all ${on ? 'ml-6' : 'ml-0'}`}></div>
                    </div>
                  </button>
                );
              })}

              {/* exemplos (apenas quando selecionar exames específicos estiver ativo) */}
              {caregiverPerms.exams_selected && !caregiverPerms.exams_all && (
                <div className="mt-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Exames liberados</p>
                    <span className="text-[10px] font-black text-blue-600 uppercase">{selectedExams.length} selecionado(s)</span>
                  </div>

                  <div className="space-y-2">
                    {['Hemograma Completo', 'Colesterol Total', 'Glicemia em jejum', 'TSH / T4'].map((exam) => {
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
                </div>
              )}
            </Card>
          )}
        </div>
      </section>

      <div className="mt-8 p-6 bg-blue-50 rounded-3xl border border-blue-100 text-center">
        <p className="text-[10px] font-black text-blue-800 uppercase tracking-widest mb-1">Dica de Saúde</p>
        <p className="text-xs text-blue-600 font-medium">Mantenha seus dados atualizados para uma melhor experiência com seu médico.</p>
      </div>
    </div>
  );
};

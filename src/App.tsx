const OnboardingFlow = ({ onFinish, initialStep = 'welcome' }) => {
  const [step, setStep] = useState(initialStep);

  const next = (s) => setStep(s);
  const back = (s) => setStep(s);

  if (step === 'welcome') {
    return (
      <div className="flex-1 flex flex-col p-8 animate-in text-center justify-center min-h-screen">
        <h1 className="text-3xl font-black mb-6">Bem-vindo ao VIVERCOM</h1>
        <Button fullWidth onClick={() => next('step1')}>Criar conta</Button>
      </div>
    );
  }

  /* ===========================
     STEP 1 – DADOS BÁSICOS
  =========================== */
  if (step === 'step1') {
    return (
      <div className="p-8 animate-in min-h-screen pb-24">
        <h2 className="text-xl font-black mb-6">Dados Básicos</h2>

        <Input label="Nome Completo" icon={User} />
        <Input label="CPF" placeholder="000.000.000-00" />
        <Input label="Data de Nascimento" type="date" icon={Calendar} />
        <Input label="Estado Civil" placeholder="Ex: Casado(a)" />
        <Input label="Endereço Completo" placeholder="Rua, número, cidade, UF" />
        <Input label="Telefone" icon={Phone} />
        <Input label="Contato de Emergência" placeholder="Nome + telefone" />

        <Button fullWidth onClick={() => next('step2')}>Avançar</Button>
      </div>
    );
  }

  /* ===========================
     STEP 2 – DADOS DE ROTINA
  =========================== */
  if (step === 'step2') {
    return (
      <div className="p-8 animate-in min-h-screen pb-24">
        <h2 className="text-xl font-black mb-6">Dados de Rotina</h2>

        <Input label="Sexo" placeholder="Masculino / Feminino / Outro" />
        <Input label="Altura (cm)" />
        <Input label="Peso (kg)" />
        <Input label="Grupo Sanguíneo" placeholder="Ex: O+, A-" />
        <Input label="Doenças Pré-existentes" placeholder="Ex: Diabetes, Hipertensão" />
        <Input label="Hábitos de Vida" placeholder="Ex: Fuma, bebe, sedentário" />
        <Input label="Pratica Atividade Física?" placeholder="Ex: Sim, 3x por semana" />
        <Input label="Trabalho / Profissão" placeholder="Opcional" />

        <div className="flex gap-3">
          <Button variant="secondary" fullWidth onClick={() => back('step1')}>Voltar</Button>
          <Button fullWidth onClick={() => next('step3')}>Avançar</Button>
        </div>
      </div>
    );
  }

  /* ===========================
     STEP 3 – DADOS DE SAÚDE
  =========================== */
  if (step === 'step3') {
    return (
      <div className="p-8 animate-in min-h-screen pb-24">
        <h2 className="text-xl font-black mb-6">Dados de Saúde</h2>

        <Input label="Antecedentes de Saúde" placeholder="Ex: cirurgias, internações" />
        <Input label="Doenças Atuais" />
        <Input label="Tratamento Atual" />
        <Input label="Medicamentos em Uso" />
        <Input label="Possui Alergias?" placeholder="Ex: Dipirona, alimentos" />
        <Input label="Histórico Familiar (inicial)" placeholder="Detalhado depois" />

        <div className="flex gap-3">
          <Button variant="secondary" fullWidth onClick={() => back('step2')}>Voltar</Button>
          <Button fullWidth onClick={() => next('step4')}>Avançar</Button>
        </div>
      </div>
    );
  }

  /* ===========================
     STEP 4 – REDE DE APOIO
  =========================== */
  if (step === 'step4') {
    return (
      <div className="p-8 animate-in min-h-screen pb-24">
        <h2 className="text-xl font-black mb-6">Rede de Apoio</h2>

        <Input label="Contato de Emergência" />
        <Input label="Médico de Referência" />
        <Input label="Telefone do Médico" />
        <Input label="E-mail do Médico" />
        <Input label="Observações" placeholder="Opcional" />

        <div className="flex gap-3">
          <Button variant="secondary" fullWidth onClick={() => back('step3')}>Voltar</Button>
          <Button fullWidth onClick={() => onFinish({ name: 'Novo Usuário', role: 'patient' })}>
            Finalizar Cadastro
          </Button>
        </div>
      </div>
    );
  }
};

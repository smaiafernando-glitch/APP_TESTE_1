import React, { useState } from 'react';
import {
  Heart,
  User,
  Users,
  Plus,
  Activity,
  Smile,
  AlertTriangle,
  Camera,
  Upload,
  FileCheck,
  CheckCircle,
  ChevronLeft
} from 'lucide-react';

/* ---------- Componentes simples ---------- */

const Card = ({ children, className = '' }: any) => (
  <div className={`bg-white rounded-2xl border border-slate-100 p-6 ${className}`}>
    {children}
  </div>
);

/* ---------- App ---------- */

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [view, setView] = useState<'login' | 'signup_paciente' | 'signup_apoio'>('login');
  const [role, setRole] = useState<'paciente' | 'apoio' | null>(null);

  const login = (r: 'paciente' | 'apoio') => {
    setRole(r);
    setIsLoggedIn(true);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setRole(null);
    setView('login');
  };

  /* ---------- LOGIN / CADASTRO ---------- */

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full space-y-6">
          <div className="text-center">
            <div className="inline-flex bg-blue-600 p-4 rounded-3xl mb-4">
              <Heart className="text-white" size={36} fill="currentColor" />
            </div>
            <h1 className="text-3xl font-black italic">VitaFlow</h1>
            <p className="text-slate-500 text-sm">
              Organização e cuidado compartilhado
            </p>
          </div>

          {view === 'login' ? (
            <Card className="space-y-4">
              <button
                onClick={() => login('paciente')}
                className="w-full p-4 rounded-xl border flex items-center gap-3 hover:border-blue-500"
              >
                <User /> Entrar como Paciente
              </button>

              <button
                onClick={() => login('apoio')}
                className="w-full p-4 rounded-xl border flex items-center gap-3 hover:border-purple-500"
              >
                <Users /> Entrar como Rede de Apoio
              </button>

              <div className="grid grid-cols-2 gap-3 pt-4">
                <button
                  onClick={() => setView('signup_paciente')}
                  className="p-3 rounded-xl bg-blue-50 font-bold text-sm"
                >
                  Novo Paciente
                </button>
                <button
                  onClick={() => setView('signup_apoio')}
                  className="p-3 rounded-xl bg-purple-50 font-bold text-sm"
                >
                  Nova Rede de Apoio
                </button>
              </div>
            </Card>
          ) : (
            <Card className="space-y-4">
              <button
                onClick={() => setView('login')}
                className="text-sm flex items-center gap-1 text-slate-500"
              >
                <ChevronLeft size={16} /> Voltar
              </button>

              <h2 className="font-bold text-xl text-center">
                Cadastro {view === 'signup_paciente' ? 'Paciente' : 'Rede de Apoio'}
              </h2>

              <input className="w-full p-3 rounded-xl bg-slate-50" placeholder="E-mail" />
              <input
                type="password"
                className="w-full p-3 rounded-xl bg-slate-50"
                placeholder="Senha"
              />

              <button
                onClick={() =>
                  login(view === 'signup_paciente' ? 'paciente' : 'apoio')
                }
                className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold"
              >
                Concluir Cadastro
              </button>
            </Card>
          )}
        </div>
      </div>
    );
  }

  /* ---------- DASHBOARD ---------- */

  return (
    <div className="min-h-screen bg-slate-50 p-6 max-w-3xl mx-auto space-y-8">
      <header className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Olá 👋</h2>
        <button onClick={logout} className="text-rose-500 font-bold text-sm">
          Sair
        </button>
      </header>

      {/* Aviso Legal */}
      <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex gap-3">
        <AlertTriangle className="text-amber-500" />
        <p className="text-xs text-amber-800">
          Este aplicativo serve apenas para organização pessoal.  
          <strong> Não fornece diagnóstico, não sugere tratamentos e não
          substitui avaliação médica.</strong>
        </p>
      </div>

      {/* Auto-relato */}
      <Card>
        <h3 className="font-bold flex items-center gap-2 mb-2">
          <Smile /> Meu relato do dia
        </h3>
        <p className="text-sm text-slate-600 mb-2">
          Escreva com suas próprias palavras como você se sentiu hoje.
        </p>
        <textarea
          className="w-full p-4 rounded-xl bg-slate-50"
          placeholder="Ex: Hoje me senti mais cansado pela manhã..."
        />
      </Card>

      {/* Medicação (visual) */}
      <Card>
        <h3 className="font-bold mb-3 flex items-center gap-2">
          <Activity /> Medicações
        </h3>

        <div className="flex justify-between items-center border rounded-xl p-4">
          <div>
            <p className="font-bold">Exemplo: Losartana</p>
            <p className="text-xs text-slate-500">1 comprimido • 08:00</p>
          </div>
          <CheckCircle className="text-emerald-500" />
        </div>
      </Card>

      {/* Receita */}
      <Card className="text-center border-dashed">
        <Camera className="mx-auto mb-3 text-slate-400" size={36} />
        <p className="font-bold">Adicionar receita médica</p>
        <p className="text-xs text-slate-400 mb-3">
          Apenas para referência visual. O app não interpreta o conteúdo.
        </p>
        <button className="px-4 py-2 border rounded-xl flex items-center gap-2 mx-auto">
          <Upload size={16} /> Enviar arquivo
        </button>
      </Card>

      {role === 'apoio' && (
        <Card className="bg-purple-50">
          <h3 className="font-bold flex items-center gap-2">
            <Users /> Acesso como Rede de Apoio
          </h3>
          <p className="text-sm text-slate-600 mt-2">
            Você visualiza informações registradas pelo paciente, sem edição
            médica ou diagnóstica.
          </p>
        </Card>
      )}
    </div>
  );
}

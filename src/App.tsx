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
  Home,
  Link as LinkIcon,
} from "lucide-react";

/**
 * ✅ COPIAR E COLAR
 * Onde colar:
 * 1) Vercel (Project > Code) ou GitHub -> arquivo: src/App.jsx
 * 2) Apague tudo e cole este código inteiro
 * 3) Garanta que Tailwind está ativo no projeto (como já estava)
 */

// ---------------- UI helpers ----------------

const Card = ({ children, className = "" }) => (
  <div
    className={`bg-white rounded-2xl shadow-sm border border-slate-100 p-4 md:p-6 ${className}`}
  >
    {children}
  </div>
);

const Badge = ({ children, variant = "default" }) => {
  const styles = {
    default: "bg-blue-50 text-blue-600",
    success: "bg-emerald-50 text-emerald-600",
    warning: "bg-amber-50 text-amber-600",
    danger: "bg-rose-50 text-rose-600",
    info: "bg-purple-50 text-purple-600",
    indigo: "bg-indigo-50 text-indigo-600",
  };
  return (
    <span
      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${styles[variant]}`}
    >
      {children}
    </span>
  );
};

const Modal = ({ open, title, children, onClose }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[999] flex items-end md:items-center justify-center">
      <div
        className="absolute inset-0 bg-slate-900/40"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative w-full md:max-w-xl bg-white rounded-t-3xl md:rounded-3xl shadow-xl border border-slate-100 p-5 md:p-6">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">
              Modal
            </p>
            <h3 className="text-lg font-black text-slate-800">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-50 border border-slate-100 text-slate-400 hover:text-slate-600"
          >
            <X size={16} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

// ---------------- App ----------------

export default function App() {
  // Views
  const [view, setView] = useState("login"); // login | dashboard
  const [userRole, setUserRole] = useState(null); // paciente | medico | apoio
  const [activeTab, setActiveTab] = useState("home"); // home | appointments | access (paciente) | home (medico) ...
  const [showLegalNotice, setShowLegalNotice] = useState(true);

  // Doctor - selected patient
  const [selectedPatientId, setSelectedPatientId] = useState(null); // medico: patient detail
  const selectedPatient = useMemo(
    () => (selectedPatientId ? patientsData.find((p) => p.id === selectedPatientId) : null),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedPatientId]
  );

  // Disposition (patient)
  const [disposition, setDisposition] = useState(7);

  // ---------------- Mock "DB" ----------------

  const [patientsData, setPatientsData] = useState([
    {
      id: "p1",
      name: "Ricardo Souza",
      code: "VF-123",
      birth: "1985-05-12",
      blood: "O+",
      phone: "(11) 98888-7777",
      routine: { weight: "82kg", height: "180cm", profession: "Engenheiro" },
      health: { conditions: "Hipertensão leve", medications: "Losartana 50mg" },
      dispositionHistory: [
        { date: "2026-01-12", value: 7, text: "Dia ok, um pouco cansado no fim." },
        { date: "2026-01-13", value: 9, text: "Acordei bem, rotina tranquila." },
        { date: "2026-01-14", value: 8, text: "Melhor hoje, sem dor de cabeça." },
      ],
      medicationStatus: [
        { name: "Losartana", time: "08:00", status: "tomado" },
        { name: "Anlodipino", time: "20:00", status: "pendente" },
      ],
      doctorsAuthorized: ["d1"],
    },
  ]);

  const [doctorProfile, setDoctorProfile] = useState({
    id: "d1",
    name: "Dr. Alberto Rossi",
    crm: "123456-SP",
    specialty: "Cardiologia",
    myPatients: ["p1"],
  });

  const [appointments, setAppointments] = useState([
    {
      id: "a1",
      patientId: "p1",
      doctor: "Dr. Alberto Rossi",
      specialty: "Cardiologia",
      date: "2026-01-20",
      time: "14:30",
      type: "Presencial",
      location: "Clínica Vida, Sala 302",
      goal: "Rotina",
    },
    {
      id: "a2",
      patientId: "p1",
      doctor: "Dra. Beatriz",
      specialty: "Clínico Geral",
      date: "2026-02-05",
      time: "10:00",
      type: "Teleconsulta",
      location: "Link via App",
      goal: "Acompanhamento",
    },
  ]);

  const [prescriptions, setPrescriptions] = useState([
    {
      id: "rx1",
      patientId: "p1",
      name: "Losartana",
      dose: "50mg",
      freq: "1x/dia",
      time: "08:00",
      instructions: "Jejum",
      start: "2026-01-01",
      end: "",
    },
  ]);

  const [medicalNotes, setMedicalNotes] = useState([
    {
      id: "n1",
      patientId: "p1",
      text: "Paciente apresenta boa adesão ao tratamento inicial.",
      visibleToPatient: true,
      visibleToSupport: false,
      date: "2026-01-10",
    },
  ]);

  // ---------------- Helpers ----------------

  const formatDateBR = (iso) => {
    // iso: YYYY-MM-DD
    const [y, m, d] = iso.split("-");
    return `${d}/${m}/${y}`;
  };

  const initials = (name) => {
    const parts = name.split(" ").filter(Boolean);
    return parts.slice(0, 2).map((p) => p[0].toUpperCase()).join("");
  };

  const genId = (prefix) => `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now()}`;

  // ---------------- Auth / Navigation ----------------

  const handleLogout = () => {
    setUserRole(null);
    setView("login");
    setActiveTab("home");
    setSelectedPatientId(null);
    setShowLegalNotice(true);
  };

  const handleLogin = (role) => {
    setUserRole(role);
    setView("dashboard");
    setActiveTab("home");
    setSelectedPatientId(null);
  };

  const goHome = () => {
    setActiveTab("home");
    setSelectedPatientId(null);
  };

  // ---------------- Legal Banner ----------------

  const LegalBanner = () => (
    <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl flex items-start space-x-3 mb-6">
      <AlertTriangle className="text-amber-500 flex-shrink-0" size={20} />
      <div className="text-[11px] text-amber-800 leading-relaxed font-medium">
        <p className="font-bold mb-1 uppercase text-amber-900">Aviso Legal Obrigatório</p>
        Este aplicativo é uma ferramenta de organização pessoal. O app <strong>não realiza diagnósticos</strong> e
        não substitui avaliação médica. Todo dado inserido é de responsabilidade do usuário e/ou do profissional.
      </div>
    </div>
  );

  // ---------------- Doctor: Link patient modal ----------------

  const [linkModalOpen, setLinkModalOpen] = useState(false);
  const [linkCode, setLinkCode] = useState("");
  const [linkError, setLinkError] = useState("");

  const doctorLinkPatientByCode = () => {
    const code = linkCode.trim().toUpperCase();
    if (!code) {
      setLinkError("Digite um código.");
      return;
    }
    const found = patientsData.find((p) => p.code.toUpperCase() === code);
    if (!found) {
      setLinkError("Código não encontrado.");
      return;
    }
    // Simula regra: só vincula se o paciente autorizou o doctor (MVP)
    if (!found.doctorsAuthorized?.includes(doctorProfile.id)) {
      setLinkError("Paciente ainda não autorizou este médico.");
      return;
    }
    if (doctorProfile.myPatients.includes(found.id)) {
      setLinkError("Paciente já está vinculado.");
      return;
    }

    setDoctorProfile((prev) => ({ ...prev, myPatients: [...prev.myPatients, found.id] }));
    setLinkError("");
    setLinkCode("");
    setLinkModalOpen(false);
  };

  const doctorEndLink = (patientId) => {
    setDoctorProfile((prev) => ({
      ...prev,
      myPatients: prev.myPatients.filter((id) => id !== patientId),
    }));
    setSelectedPatientId(null);
  };

  // ---------------- Doctor: Create Prescription modal ----------------

  const [rxModalOpen, setRxModalOpen] = useState(false);
  const [rxForm, setRxForm] = useState({
    name: "",
    dose: "",
    freq: "1x/dia",
    time: "",
    instructions: "",
    start: "",
    end: "",
  });

  const createPrescription = () => {
    if (!selectedPatientId) return;
    const required = ["name", "dose", "time", "start"];
    const missing = required.filter((k) => !rxForm[k].trim());
    if (missing.length) return;

    const newRx = {
      id: genId("rx"),
      patientId: selectedPatientId,
      name: rxForm.name.trim(),
      dose: rxForm.dose.trim(),
      freq: rxForm.freq.trim(),
      time: rxForm.time.trim(),
      instructions: rxForm.instructions.trim(),
      start: rxForm.start.trim(),
      end: rxForm.end.trim(),
    };

    setPrescriptions((prev) => [newRx, ...prev]);
    setRxForm({ name: "", dose: "", freq: "1x/dia", time: "", instructions: "", start: "", end: "" });
    setRxModalOpen(false);
  };

  // ---------------- Doctor: Create Appointment modal ----------------

  const [apptModalOpen, setApptModalOpen] = useState(false);
  const [apptForm, setApptForm] = useState({
    specialty: "",
    doctor: "",
    date: "",
    time: "",
    type: "Presencial",
    location: "",
    goal: "",
  });

  const createAppointment = () => {
    if (!selectedPatientId) return;

    const required = ["specialty", "doctor", "date", "time", "type", "location"];
    const missing = required.filter((k) => !String(apptForm[k]).trim());
    if (missing.length) return;

    const newA = {
      id: genId("a"),
      patientId: selectedPatientId,
      specialty: apptForm.specialty.trim(),
      doctor: apptForm.doctor.trim(),
      date: apptForm.date.trim(),
      time: apptForm.time.trim(),
      type: apptForm.type,
      location: apptForm.location.trim(),
      goal: apptForm.goal.trim(),
    };

    setAppointments((prev) => [newA, ...prev]);
    setApptForm({
      specialty: "",
      doctor: "",
      date: "",
      time: "",
      type: "Presencial",
      location: "",
      goal: "",
    });
    setApptModalOpen(false);
  };

  // ---------------- Doctor: Create Note modal ----------------

  const [noteText, setNoteText] = useState("");
  const [noteVisibleToPatient, setNoteVisibleToPatient] = useState(true);
  const [noteVisibleToSupport, setNoteVisibleToSupport] = useState(false);

  const createNote = () => {
    if (!selectedPatientId) return;
    const txt = noteText.trim();
    if (!txt) return;

    const now = new Date();
    const iso = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(
      now.getDate()
    ).padStart(2, "0")}`;

    const newN = {
      id: genId("n"),
      patientId: selectedPatientId,
      text: txt,
      visibleToPatient: noteVisibleToPatient,
      visibleToSupport: noteVisibleToSupport,
      date: iso,
    };

    setMedicalNotes((prev) => [newN, ...prev]);
    setNoteText("");
    setNoteVisibleToPatient(true);
    setNoteVisibleToSupport(false);
  };

  // ---------------- Patient: Save daily report ----------------

  const [patientDailyText, setPatientDailyText] = useState("");

  const savePatientDailyReport = () => {
    // MVP: escreve no patient p1
    const patientId = "p1";
    const now = new Date();
    const iso = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(
      now.getDate()
    ).padStart(2, "0")}`;

    setPatientsData((prev) =>
      prev.map((p) => {
        if (p.id !== patientId) return p;
        const history = Array.isArray(p.dispositionHistory) ? p.dispositionHistory : [];
        return {
          ...p,
          dispositionHistory: [
            { date: iso, value: disposition, text: patientDailyText.trim() || "Sem relato." },
            ...history,
          ],
        };
      })
    );

    setPatientDailyText("");
  };

  // ---------------- Components: Doctor patient detail ----------------

  const PatientDetailView = ({ patient }) => {
    const [subTab, setSubTab] = useState("resumo"); // resumo | tratamentos | consultas | historico | notas

    const patientRx = prescriptions.filter((r) => r.patientId === patient.id);
    const patientAppts = appointments.filter((a) => a.patientId === patient.id);
    const patientNotes = medicalNotes.filter((n) => n.patientId === patient.id);

    return (
      <div className="space-y-6">
        {/* TOP ACTIONS */}
        <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedPatientId(null)}
              className="flex items-center text-sm font-bold text-slate-400 hover:text-emerald-600"
            >
              <ChevronLeft size={18} /> Voltar aos Pacientes
            </button>

            {/* ✅ Botão Home pedido */}
            <button
              onClick={goHome}
              className="ml-2 inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100 text-xs font-black uppercase tracking-wider hover:bg-emerald-100"
              title="Voltar ao Home (Pacientes)"
            >
              <Home size={16} /> Home
            </button>
          </div>

          <button
            onClick={() => doctorEndLink(patient.id)}
            className="px-4 py-2 bg-rose-50 text-rose-600 rounded-xl text-xs font-bold border border-rose-100 hover:bg-rose-100 transition-colors"
          >
            Encerrar Vínculo
          </button>
        </div>

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-700 font-black text-xl">
              {initials(patient.name)}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800">{patient.name}</h2>
              <div className="flex flex-wrap gap-2 mt-1">
                <Badge variant="success">Vinculado</Badge>
                <Badge variant="default">Cód: {patient.code}</Badge>
                <Badge variant="info">Nasc: {patient.birth}</Badge>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setRxModalOpen(true)}
              className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-wider shadow-lg shadow-emerald-100"
            >
              + Prescrição
            </button>
            <button
              onClick={() => setApptModalOpen(true)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-wider shadow-lg shadow-indigo-100"
            >
              + Consulta
            </button>
          </div>
        </div>

        {/* SUBTABS */}
        <div className="flex space-x-1 bg-slate-100 p-1 rounded-2xl overflow-x-auto no-scrollbar">
          {[
            { id: "resumo", label: "Resumo" },
            { id: "tratamentos", label: "Tratamentos" },
            { id: "consultas", label: "Consultas" },
            { id: "historico", label: "Histórico" },
            { id: "notas", label: "Notas" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setSubTab(t.id)}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all flex-shrink-0 ${
                subTab === t.id ? "bg-white text-emerald-700 shadow-sm" : "text-slate-500 hover:bg-slate-200"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* SUMMARY */}
        {subTab === "resumo" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <h3 className="font-bold text-slate-800 mb-4 flex items-center">
                <User size={18} className="mr-2 text-emerald-600" /> Dados Cadastrais
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between border-b border-slate-50 pb-1">
                  <span className="text-slate-400">Tipo Sanguíneo</span>
                  <span className="font-bold text-slate-700">{patient.blood}</span>
                </div>
                <div className="flex justify-between border-b border-slate-50 pb-1">
                  <span className="text-slate-400">Telefone</span>
                  <span className="font-bold text-slate-700">{patient.phone}</span>
                </div>
                <div className="flex justify-between border-b border-slate-50 pb-1">
                  <span className="text-slate-400">Peso/Altura</span>
                  <span className="font-bold text-slate-700">
                    {patient.routine.weight} / {patient.routine.height}
                  </span>
                </div>
                <div className="flex justify-between border-b border-slate-50 pb-1">
                  <span className="text-slate-400">Profissão</span>
                  <span className="font-bold text-slate-700">{patient.routine.profession}</span>
                </div>
              </div>
            </Card>

            <Card>
              <h3 className="font-bold text-slate-800 mb-4 flex items-center">
                <Shield size={18} className="mr-2 text-indigo-600" /> Condições (Auto-declarado)
              </h3>
              <div className="p-3 bg-slate-50 rounded-xl text-sm text-slate-600">
                {patient.health.conditions || "Nenhuma informada"}
              </div>

              <div className="mt-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-300 mb-2">
                  Uso contínuo (informado)
                </p>
                <div className="p-3 bg-slate-50 rounded-xl text-sm text-slate-600">
                  {patient.health.medications || "Nenhum informado"}
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* TREATMENTS */}
        {subTab === "tratamentos" && (
          <div className="space-y-4">
            <div className="flex items-end justify-between gap-3">
              <div>
                <h3 className="font-bold text-slate-800">Plano Terapêutico</h3>
                <p className="text-xs text-slate-400">
                  Organização de medicações (sem interpretação automática do app).
                </p>
              </div>
              <button
                onClick={() => setRxModalOpen(true)}
                className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-wider shadow-lg shadow-emerald-100"
              >
                + Nova Prescrição
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {patientRx.length === 0 && (
                <Card className="bg-slate-50/60 border-dashed">
                  <p className="text-sm text-slate-500 font-medium">Sem prescrições registradas ainda.</p>
                </Card>
              )}

              {patientRx.map((p) => (
                <Card key={p.id} className="border-l-4 border-l-emerald-500">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h4 className="font-bold text-slate-800">
                        {p.name} {p.dose}
                      </h4>
                      <p className="text-xs text-slate-500 font-medium">
                        {p.freq} • Horário: <span className="font-black">{p.time}</span>
                      </p>
                      {!!p.instructions && (
                        <p className="text-[10px] bg-slate-50 p-1.5 rounded mt-2 text-slate-500 italic">
                          “{p.instructions}”
                        </p>
                      )}
                      <div className="flex flex-wrap gap-2 mt-3">
                        <Badge variant="default">Início: {p.start ? formatDateBR(p.start) : "-"}</Badge>
                        <Badge variant="info">Fim: {p.end ? formatDateBR(p.end) : "—"}</Badge>
                      </div>
                    </div>
                    <button className="p-2 text-slate-300 hover:text-emerald-600" title="Configurações (MVP)">
                      <Settings size={18} />
                    </button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* APPOINTMENTS */}
        {subTab === "consultas" && (
          <div className="space-y-4">
            <div className="flex items-end justify-between gap-3">
              <div>
                <h3 className="font-bold text-slate-800">Consultas / Retornos</h3>
                <p className="text-xs text-slate-400">Cadastro de consulta para aparecer na agenda do paciente.</p>
              </div>
              <button
                onClick={() => setApptModalOpen(true)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-wider shadow-lg shadow-indigo-100"
              >
                + Agendar
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {patientAppts.length === 0 && (
                <Card className="bg-slate-50/60 border-dashed">
                  <p className="text-sm text-slate-500 font-medium">Sem consultas registradas ainda.</p>
                </Card>
              )}

              {patientAppts.map((appt) => (
                <Card key={appt.id} className="border-l-4 border-l-indigo-500">
                  <div className="flex flex-col sm:flex-row justify-between gap-4">
                    <div className="flex items-start space-x-4">
                      <div className="bg-indigo-50 p-3 rounded-2xl text-center min-w-[70px]">
                        <p className="text-[10px] font-black text-indigo-400 uppercase leading-none">
                          {String(appt.date).split("-")[1] || "MM"}
                        </p>
                        <p className="text-xl font-black text-indigo-600 leading-none mt-1">
                          {String(appt.date).split("-")[2] || "DD"}
                        </p>
                      </div>

                      <div className="space-y-1">
                        <Badge variant="indigo">
                          {appt.type === "Teleconsulta" ? (
                            <span className="inline-flex items-center gap-1">
                              <Video size={10} /> Teleconsulta
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1">
                              <MapPin size={10} /> Presencial
                            </span>
                          )}
                        </Badge>

                        <h4 className="font-bold text-slate-800">{appt.specialty}</h4>
                        <p className="text-sm font-medium text-slate-600">{appt.doctor}</p>

                        <div className="flex flex-wrap items-center text-[11px] text-slate-400 mt-2 gap-x-3 gap-y-1">
                          <span className="inline-flex items-center gap-1">
                            <Clock size={12} /> {appt.time}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <MapPin size={12} /> {appt.location}
                          </span>
                        </div>

                        {!!appt.goal && (
                          <p className="text-[11px] text-slate-500 mt-2">
                            <span className="font-black">Objetivo:</span> {appt.goal}
                          </p>
                        )}
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
              ))}
            </div>
          </div>
        )}

        {/* HISTORY (Read-only) */}
        {subTab === "historico" && (
          <div className="space-y-4">
            <h3 className="font-bold text-slate-800">Relatos do Paciente (Read-only)</h3>

            <div className="space-y-3">
              {(patient.dispositionHistory || []).map((h, idx) => (
                <Card key={`${h.date}_${idx}`} className="bg-slate-50/50">
                  <div className="flex justify-between items-center mb-2 gap-3">
                    <Badge variant="indigo">{formatDateBR(h.date)}</Badge>
                    <span className="text-xs font-black text-indigo-600">Disposição: {h.value}/10</span>
                  </div>
                  <p className="text-sm text-slate-600 italic">“{h.text}”</p>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* NOTES */}
        {subTab === "notas" && (
          <div className="space-y-4">
            <Card>
              <h3 className="font-bold text-slate-800 mb-1">Novo Registro do Médico</h3>
              <p className="text-[11px] text-slate-400 mb-4">
                Apenas registro (sem IA, sem sugestões automáticas).
              </p>

              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                className="w-full p-4 bg-slate-50 rounded-2xl border-0 text-sm h-32 mb-4 focus:ring-2 focus:ring-emerald-100"
                placeholder="Anote observações..."
              />

              <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                <div className="flex flex-wrap gap-4">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={noteVisibleToPatient}
                      onChange={(e) => setNoteVisibleToPatient(e.target.checked)}
                      className="rounded text-emerald-600"
                    />
                    <span className="text-[11px] font-bold text-slate-500">Visível ao Paciente</span>
                  </label>

                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={noteVisibleToSupport}
                      onChange={(e) => setNoteVisibleToSupport(e.target.checked)}
                      className="rounded text-emerald-600"
                    />
                    <span className="text-[11px] font-bold text-slate-500">Visível à Rede</span>
                  </label>
                </div>

                <button
                  onClick={createNote}
                  className="px-6 py-2 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-wider"
                >
                  Salvar Nota
                </button>
              </div>
            </Card>

            <div className="space-y-3">
              {patientNotes.length === 0 && (
                <Card className="bg-slate-50/60 border-dashed">
                  <p className="text-sm text-slate-500 font-medium">Sem notas registradas.</p>
                </Card>
              )}

              {patientNotes.map((n) => (
                <Card key={n.id} className="border-l-4 border-l-slate-200">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap gap-2 mb-2">
                        <Badge variant="default">{formatDateBR(n.date)}</Badge>
                        {n.visibleToPatient ? <Badge variant="success">Visível ao paciente</Badge> : <Badge variant="warning">Privado</Badge>}
                        {n.visibleToSupport ? <Badge variant="info">Visível à rede</Badge> : <Badge variant="default">Rede: não</Badge>}
                      </div>
                      <p className="text-sm text-slate-700">{n.text}</p>
                    </div>
                    <button className="p-2 text-slate-300 hover:text-slate-600" title="Configurações (MVP)">
                      <Settings size={18} />
                    </button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // ---------------- Doctor dashboard ----------------

  const renderDoctorDashboard = () => {
    const myPatients = patientsData.filter((p) => doctorProfile.myPatients.includes(p.id));

    if (selectedPatientId) {
      const p = patientsData.find((x) => x.id === selectedPatientId);
      if (!p) return null;
      return <PatientDetailView patient={p} />;
    }

    return (
      <div className="space-y-8">
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Painel do Médico</h2>
            <p className="text-slate-500 text-sm">
              {doctorProfile.name} • CRM {doctorProfile.crm} • {doctorProfile.specialty}
            </p>
          </div>

          <button
            onClick={() => setLinkModalOpen(true)}
            className="bg-emerald-600 text-white px-6 py-3 rounded-2xl font-black text-sm shadow-xl shadow-emerald-100 flex items-center justify-center"
          >
            <Search size={18} className="mr-2" /> Vincular Paciente
          </button>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-emerald-600 text-white border-0">
            <Users className="mb-4 opacity-60" size={32} />
            <p className="text-3xl font-black">{myPatients.length}</p>
            <p className="text-xs font-bold uppercase tracking-wider opacity-80">Pacientes Vinculados</p>
          </Card>

          <Card>
            <Calendar className="mb-4 text-indigo-600" size={32} />
            <p className="text-3xl font-black text-slate-800">
              {appointments.filter((a) => doctorProfile.myPatients.includes(a.patientId)).length}
            </p>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Consultas Registradas</p>
          </Card>

          <Card>
            <Activity className="mb-4 text-blue-600" size={32} />
            <p className="text-3xl font-black text-slate-800">
              {patientsData.reduce((acc, p) => acc + (p.dispositionHistory?.length || 0), 0)}
            </p>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Registros de Relato</p>
          </Card>
        </section>

        <section>
          <h3 className="font-bold text-slate-800 mb-4 flex items-center">
            <ClipboardList size={20} className="mr-2 text-emerald-600" /> Meus Pacientes
          </h3>

          <div className="grid grid-cols-1 gap-4">
            {myPatients.map((patient) => (
              <button
                key={patient.id}
                onClick={() => setSelectedPatientId(patient.id)}
                className="text-left bg-white border border-slate-100 p-4 rounded-2xl flex items-center justify-between hover:shadow-md transition-all group"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center group-hover:bg-emerald-50 transition-colors">
                    <User className="text-slate-400 group-hover:text-emerald-700" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800">{patient.name}</h4>
                    <p className="text-[10px] text-slate-400 font-black uppercase">
                      {patient.code} • {patient.routine.profession}
                    </p>
                  </div>
                </div>
                <ChevronRight size={20} className="text-slate-300 group-hover:text-emerald-600" />
              </button>
            ))}

            {myPatients.length === 0 && (
              <Card className="bg-slate-50/60 border-dashed">
                <p className="text-sm text-slate-500 font-medium">
                  Você ainda não tem pacientes vinculados. Use “Vincular Paciente”.
                </p>
              </Card>
            )}
          </div>
        </section>

        {/* Link Patient Modal */}
        <Modal
          open={linkModalOpen}
          title="Vincular paciente por código"
          onClose={() => {
            setLinkModalOpen(false);
            setLinkError("");
            setLinkCode("");
          }}
        >
          <div className="space-y-4">
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
              <p className="text-[11px] text-slate-600 font-medium">
                O paciente fornece um código (ex: <span className="font-black">VF-123</span>). O vínculo só ocorre
                se o paciente tiver autorizado este médico (MVP).
              </p>
            </div>

            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-300">
                Código do paciente
              </label>
              <input
                value={linkCode}
                onChange={(e) => setLinkCode(e.target.value)}
                placeholder="VF-123"
                className="mt-1 w-full p-3 rounded-xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-emerald-100 outline-none font-bold tracking-wider"
              />
            </div>

            {linkError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-100 text-rose-700 text-sm font-bold">
                {linkError}
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setLinkModalOpen(false);
                  setLinkError("");
                  setLinkCode("");
                }}
                className="flex-1 px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-600 font-black text-xs uppercase tracking-wider"
              >
                Cancelar
              </button>
              <button
                onClick={doctorLinkPatientByCode}
                className="flex-1 px-4 py-3 rounded-xl bg-emerald-600 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-100"
              >
                Vincular
              </button>
            </div>
          </div>
        </Modal>

        {/* Prescription Modal */}
        <Modal open={rxModalOpen} title="Nova prescrição" onClose={() => setRxModalOpen(false)}>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-300">Medicamento</label>
                <input
                  value={rxForm.name}
                  onChange={(e) => setRxForm((p) => ({ ...p, name: e.target.value }))}
                  className="mt-1 w-full p-3 rounded-xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-emerald-100 outline-none"
                  placeholder="Ex: Losartana"
                />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-300">Dose</label>
                <input
                  value={rxForm.dose}
                  onChange={(e) => setRxForm((p) => ({ ...p, dose: e.target.value }))}
                  className="mt-1 w-full p-3 rounded-xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-emerald-100 outline-none"
                  placeholder="Ex: 50mg"
                />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-300">Frequência</label>
                <input
                  value={rxForm.freq}
                  onChange={(e) => setRxForm((p) => ({ ...p, freq: e.target.value }))}
                  className="mt-1 w-full p-3 rounded-xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-emerald-100 outline-none"
                  placeholder="Ex: 1x/dia"
                />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-300">Horário</label>
                <input
                  value={rxForm.time}
                  onChange={(e) => setRxForm((p) => ({ ...p, time: e.target.value }))}
                  className="mt-1 w-full p-3 rounded-xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-emerald-100 outline-none"
                  placeholder="Ex: 08:00"
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-300">Instruções</label>
                <input
                  value={rxForm.instructions}
                  onChange={(e) => setRxForm((p) => ({ ...p, instructions: e.target.value }))}
                  className="mt-1 w-full p-3 rounded-xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-emerald-100 outline-none"
                  placeholder="Ex: Tomar em jejum"
                />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-300">Início</label>
                <input
                  type="date"
                  value={rxForm.start}
                  onChange={(e) => setRxForm((p) => ({ ...p, start: e.target.value }))}
                  className="mt-1 w-full p-3 rounded-xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-emerald-100 outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-300">Fim (opcional)</label>
                <input
                  type="date"
                  value={rxForm.end}
                  onChange={(e) => setRxForm((p) => ({ ...p, end: e.target.value }))}
                  className="mt-1 w-full p-3 rounded-xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-emerald-100 outline-none"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setRxModalOpen(false)}
                className="flex-1 px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-600 font-black text-xs uppercase tracking-wider"
              >
                Cancelar
              </button>
              <button
                onClick={createPrescription}
                className="flex-1 px-4 py-3 rounded-xl bg-emerald-600 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-100"
              >
                Salvar
              </button>
            </div>

            <p className="text-[10px] text-slate-400">
              MVP: salva localmente (mock). Integração com banco/conta fica para fase 2.
            </p>
          </div>
        </Modal>

        {/* Appointment Modal */}
        <Modal open={apptModalOpen} title="Agendar consulta" onClose={() => setApptModalOpen(false)}>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="md:col-span-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-300">Especialidade</label>
                <input
                  value={apptForm.specialty}
                  onChange={(e) => setApptForm((p) => ({ ...p, specialty: e.target.value }))}
                  className="mt-1 w-full p-3 rounded-xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-indigo-100 outline-none"
                  placeholder="Ex: Cardiologia"
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-300">Médico</label>
                <input
                  value={apptForm.doctor}
                  onChange={(e) => setApptForm((p) => ({ ...p, doctor: e.target.value }))}
                  className="mt-1 w-full p-3 rounded-xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-indigo-100 outline-none"
                  placeholder="Ex: Dr. Alberto Rossi"
                />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-300">Data</label>
                <input
                  type="date"
                  value={apptForm.date}
                  onChange={(e) => setApptForm((p) => ({ ...p, date: e.target.value }))}
                  className="mt-1 w-full p-3 rounded-xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-indigo-100 outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-300">Horário</label>
                <input
                  value={apptForm.time}
                  onChange={(e) => setApptForm((p) => ({ ...p, time: e.target.value }))}
                  className="mt-1 w-full p-3 rounded-xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-indigo-100 outline-none"
                  placeholder="Ex: 14:30"
                />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-300">Tipo</label>
                <select
                  value={apptForm.type}
                  onChange={(e) => setApptForm((p) => ({ ...p, type: e.target.value }))}
                  className="mt-1 w-full p-3 rounded-xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-indigo-100 outline-none"
                >
                  <option>Presencial</option>
                  <option>Teleconsulta</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-300">Local/Link</label>
                <input
                  value={apptForm.location}
                  onChange={(e) => setApptForm((p) => ({ ...p, location: e.target.value }))}
                  className="mt-1 w-full p-3 rounded-xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-indigo-100 outline-none"
                  placeholder="Ex: Clínica X ou Link"
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-300">Objetivo (opcional)</label>
                <input
                  value={apptForm.goal}
                  onChange={(e) => setApptForm((p) => ({ ...p, goal: e.target.value }))}
                  className="mt-1 w-full p-3 rounded-xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-indigo-100 outline-none"
                  placeholder="Ex: Acompanhamento"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setApptModalOpen(false)}
                className="flex-1 px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-600 font-black text-xs uppercase tracking-wider"
              >
                Cancelar
              </button>
              <button
                onClick={createAppointment}
                className="flex-1 px-4 py-3 rounded-xl bg-indigo-600 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-indigo-100"
              >
                Salvar
              </button>
            </div>
          </div>
        </Modal>
      </div>
    );
  };

  // ---------------- Patient dashboard ----------------

  const renderPatientDashboard = () => {
    const patientId = "p1";
    const patient = patientsData.find((p) => p.id === patientId);

    const rx = prescriptions.filter((r) => r.patientId === patientId);
    const appts = appointments.filter((a) => a.patientId === patientId);
    const notesVisible = medicalNotes.filter((n) => n.patientId === patientId && n.visibleToPatient);

    return (
      <div className="space-y-6 md:space-y-8">
        {/* HOME */}
        {activeTab === "home" && (
          <>
            <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">Olá, {patient?.name?.split(" ")?.[0] || "Paciente"}</h2>
                <p className="text-slate-500 text-sm italic">Como você está hoje?</p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setActiveTab("appointments")}
                  className="bg-white border border-slate-200 px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-center text-slate-600 shadow-sm"
                >
                  <Calendar size={14} className="mr-2" /> Agenda
                </button>

                <button
                  onClick={() => setActiveTab("access")}
                  className="bg-white border border-slate-200 px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-center text-slate-600 shadow-sm"
                >
                  <Shield size={14} className="mr-2" /> Meus Médicos
                </button>
              </div>
            </header>

            <Card>
              <h3 className="font-bold text-slate-800 flex items-center mb-4 text-sm md:text-base">
                <Smile size={18} className="mr-2 text-blue-500" /> Relato Diário
              </h3>

              <textarea
                value={patientDailyText}
                onChange={(e) => setPatientDailyText(e.target.value)}
                className="w-full p-4 bg-slate-50 rounded-xl border-0 text-sm min-h-[110px] resize-none focus:ring-2 focus:ring-blue-100 mb-4"
                placeholder="Escreva em linguagem simples como você se sente hoje. (O app não dá diagnóstico.)"
              />

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div className="flex justify-between items-center mb-4">
                  <label className="text-xs font-black text-slate-700 uppercase flex items-center">
                    <Thermometer size={14} className="mr-1 text-blue-600" /> Como está sua disposição hoje?
                  </label>
                  <span className="text-xl font-black text-blue-600">{disposition}/10</span>
                </div>

                <input
                  type="range"
                  min="0"
                  max="10"
                  value={disposition}
                  onChange={(e) => setDisposition(parseInt(e.target.value, 10))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />

                <div className="flex justify-between mt-2 px-1">
                  <span className="text-[9px] font-bold text-slate-400">0 muito indisposto</span>
                  <span className="text-[9px] font-bold text-slate-400">10 muito disposto</span>
                </div>
              </div>

              <div className="flex justify-end mt-4">
                <button
                  onClick={savePatientDailyReport}
                  className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-md shadow-blue-100"
                >
                  Salvar Relato
                </button>
              </div>
            </Card>

            <section>
              <h3 className="font-bold text-slate-800 mb-4">Tratamentos registrados pelo médico</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {rx.map((p) => (
                  <Card key={p.id} className="border-l-4 border-l-blue-500">
                    <div className="flex justify-between items-start gap-3">
                      <div>
                        <h4 className="font-bold text-slate-800">
                          {p.name} {p.dose}
                        </h4>
                        <p className="text-[11px] text-slate-400 font-black uppercase">{p.time} • {p.freq}</p>
                        {!!p.instructions && (
                          <p className="text-[11px] text-slate-500 mt-2 italic">“{p.instructions}”</p>
                        )}
                      </div>

                      <button
                        className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 border border-slate-100"
                        title="MVP: check-in do paciente (ainda sem persistência)"
                      >
                        <Plus size={20} />
                      </button>
                    </div>
                  </Card>
                ))}

                {rx.length === 0 && (
                  <Card className="bg-slate-50/60 border-dashed">
                    <p className="text-sm text-slate-500 font-medium">Sem tratamentos cadastrados por médico.</p>
                  </Card>
                )}
              </div>
            </section>

            <section className="space-y-3">
              <h3 className="font-bold text-slate-800">Notas do médico (visíveis para você)</h3>

              {notesVisible.length === 0 && (
                <Card className="bg-slate-50/60 border-dashed">
                  <p className="text-sm text-slate-500 font-medium">Sem notas visíveis no momento.</p>
                </Card>
              )}

              {notesVisible.map((n) => (
                <Card key={n.id} className="border-l-4 border-l-slate-200">
                  <div className="flex justify-between items-start gap-3">
                    <div>
                      <div className="flex gap-2 mb-2">
                        <Badge variant="default">{formatDateBR(n.date)}</Badge>
                        <Badge variant="success">Médico</Badge>
                      </div>
                      <p className="text-sm text-slate-700">{n.text}</p>
                    </div>
                    <Stethoscope className="text-slate-300" />
                  </div>
                </Card>
              ))}
            </section>
          </>
        )}

        {/* APPOINTMENTS */}
        {activeTab === "appointments" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">Minha Agenda</h2>
                <p className="text-sm text-slate-500">Consultas cadastradas pelo médico (ou por você futuramente).</p>
              </div>

              {/* ✅ Botão Home pedido (também para paciente) */}
              <button
                onClick={() => setActiveTab("home")}
                className="px-3 py-2 rounded-xl bg-blue-50 border border-blue-100 text-blue-700 text-xs font-black uppercase tracking-wider inline-flex items-center gap-2"
              >
                <Home size={16} /> Home
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {appts.map((appt) => (
                <Card key={appt.id} className="border-l-4 border-l-indigo-500">
                  <div className="flex items-start space-x-4">
                    <div className="bg-indigo-50 p-3 rounded-2xl text-center min-w-[70px]">
                      <p className="text-[10px] font-black text-indigo-400 uppercase leading-none">
                        {String(appt.date).split("-")[1]}
                      </p>
                      <p className="text-xl font-black text-indigo-600 leading-none mt-1">
                        {String(appt.date).split("-")[2]}
                      </p>
                    </div>

                    <div className="flex-1">
                      <Badge variant="indigo">
                        {appt.type === "Teleconsulta" ? (
                          <span className="inline-flex items-center gap-1">
                            <Video size={10} /> Teleconsulta
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1">
                            <MapPin size={10} /> Presencial
                          </span>
                        )}
                      </Badge>

                      <h4 className="font-bold text-slate-800 mt-1">{appt.specialty}</h4>
                      <p className="text-xs text-slate-500">{appt.doctor}</p>

                      <div className="flex flex-wrap items-center text-[11px] text-slate-400 mt-2 gap-x-3 gap-y-1">
                        <span className="inline-flex items-center gap-1">
                          <Clock size={12} /> {appt.time}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <MapPin size={12} /> {appt.location}
                        </span>
                      </div>

                      {!!appt.goal && (
                        <p className="text-[11px] text-slate-500 mt-2">
                          <span className="font-black">Objetivo:</span> {appt.goal}
                        </p>
                      )}
                    </div>
                  </div>
                </Card>
              ))}

              {appts.length === 0 && (
                <Card className="bg-slate-50/60 border-dashed">
                  <p className="text-sm text-slate-500 font-medium">Sem consultas na agenda.</p>
                </Card>
              )}
            </div>
          </div>
        )}

        {/* ACCESS */}
        {activeTab === "access" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">Meus Médicos e Acessos</h2>
                <p className="text-sm text-slate-500">Controle quem pode ver seus dados.</p>
              </div>

              {/* ✅ Botão Home pedido */}
              <button
                onClick={() => setActiveTab("home")}
                className="px-3 py-2 rounded-xl bg-blue-50 border border-blue-100 text-blue-700 text-xs font-black uppercase tracking-wider inline-flex items-center gap-2"
              >
                <Home size={16} /> Home
              </button>
            </div>

            <Card className="bg-blue-600 text-white border-0">
              <div className="flex justify-between items-center gap-3">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Seu código de vinculação</p>
                  <p className="text-3xl font-black mt-1">{patient?.code || "VF-000"}</p>
                </div>

                <button className="bg-white/15 p-3 rounded-2xl hover:bg-white/25 transition-all" title="MVP: copiar">
                  <ClipboardList size={24} />
                </button>
              </div>

              <p className="text-[10px] mt-4 opacity-80 italic">
                Forneça este código ao seu médico para ele solicitar o vínculo.
              </p>
            </Card>

            <section className="space-y-4">
              <h3 className="font-bold text-slate-800">Médicos autorizados</h3>

              {doctorProfile && (
                <Card className="flex items-center justify-between gap-3">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-700">
                      <Stethoscope size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800">{doctorProfile.name}</h4>
                      <p className="text-xs text-slate-400">
                        {doctorProfile.specialty} • CRM {doctorProfile.crm}
                      </p>
                    </div>
                  </div>

                  <button className="text-rose-500 font-black text-xs hover:underline">
                    Revogar (MVP)
                  </button>
                </Card>
              )}
            </section>

            <Card className="bg-slate-50/60 border-dashed">
              <p className="text-sm text-slate-500 font-medium">
                MVP: vínculo/consentimento está simulado. Na fase 2, isso vira fluxo real com aceite do paciente.
              </p>
            </Card>
          </div>
        )}
      </div>
    );
  };

  // ---------------- Layout: Login ----------------

  const roleButtons = [
    { role: "paciente", label: "Sou Paciente", sub: "Minha rotina e saúde", icon: User, tone: "blue" },
    { role: "medico", label: "Sou Médico", sub: "Painel clínico e CRM", icon: Stethoscope, tone: "emerald" },
    { role: "apoio", label: "Sou Rede de Apoio", sub: "Acompanhar familiar", icon: Users, tone: "purple" },
  ];

  const toneStyles = {
    blue: {
      borderHover: "hover:border-blue-500",
      iconBox: "bg-blue-50 text-blue-600",
      iconBoxHover: "group-hover:bg-blue-600 group-hover:text-white",
    },
    emerald: {
      borderHover: "hover:border-emerald-500",
      iconBox: "bg-emerald-50 text-emerald-600",
      iconBoxHover: "group-hover:bg-emerald-600 group-hover:text-white",
    },
    purple: {
      borderHover: "hover:border-purple-500",
      iconBox: "bg-purple-50 text-purple-600",
      iconBoxHover: "group-hover:bg-purple-600 group-hover:text-white",
    },
  };

  // ---------------- Layout: Dashboard wrapper ----------------

  const DesktopSidebar = () => {
    const isDoctor = userRole === "medico";
    const isPatient = userRole === "paciente";

    return (
      <aside className="w-64 bg-white border-r border-slate-100 p-6 hidden md:flex flex-col sticky top-0 h-screen">
        <div className="flex items-center space-x-3 mb-10">
          <div className={`p-2 rounded-xl ${isDoctor ? "bg-emerald-600" : "bg-blue-600"}`}>
            <Heart className="text-white" size={20} fill="currentColor" />
          </div>
          <h1 className="text-lg font-black text-slate-800 tracking-tight italic">VitaFlow</h1>
        </div>

        <nav className="flex-1 space-y-1">
          {isPatient && (
            <>
              <button
                onClick={() => setActiveTab("home")}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-black transition-all ${
                  activeTab === "home" ? "bg-blue-600 text-white" : "text-slate-500 hover:bg-slate-50"
                }`}
              >
                <Activity size={20} /> <span className="text-sm">Painel</span>
              </button>

              <button
                onClick={() => setActiveTab("appointments")}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-black transition-all ${
                  activeTab === "appointments" ? "bg-blue-600 text-white" : "text-slate-500 hover:bg-slate-50"
                }`}
              >
                <Calendar size={20} /> <span className="text-sm">Minha Agenda</span>
              </button>

              <button
                onClick={() => setActiveTab("access")}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-black transition-all ${
                  activeTab === "access" ? "bg-blue-600 text-white" : "text-slate-500 hover:bg-slate-50"
                }`}
              >
                <Shield size={20} /> <span className="text-sm">Meus Médicos</span>
              </button>
            </>
          )}

          {isDoctor && (
            <>
              <button
                onClick={() => {
                  setActiveTab("home");
                  setSelectedPatientId(null);
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-black transition-all ${
                  activeTab === "home" ? "bg-emerald-600 text-white" : "text-slate-500 hover:bg-slate-50"
                }`}
              >
                <Users size={20} /> <span className="text-sm">Pacientes</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab("home");
                  setSelectedPatientId(null);
                  setLinkModalOpen(true);
                }}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-black transition-all text-slate-500 hover:bg-slate-50"
              >
                <LinkIcon size={20} /> <span className="text-sm">Vincular</span>
              </button>

              {/* ✅ Home rápido */}
              <button
                onClick={goHome}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-black transition-all text-slate-500 hover:bg-slate-50"
              >
                <Home size={20} /> <span className="text-sm">Home</span>
              </button>
            </>
          )}

          {!isPatient && !isDoctor && (
            <Card className="bg-slate-50/60 border-dashed">
              <p className="text-sm text-slate-500 font-medium">
                MVP: perfil “Rede de Apoio” ainda está como placeholder.
              </p>
            </Card>
          )}
        </nav>

        <div className="mt-auto pt-6 border-t border-slate-50">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-black text-rose-500 hover:bg-rose-50 transition-all"
          >
            <ChevronLeft size={20} /> <span className="text-sm">Sair</span>
          </button>
        </div>
      </aside>
    );
  };

  const MobileNav = () => {
    const isPatient = userRole === "paciente";
    const isDoctor = userRole === "medico";

    const items = isPatient
      ? [
          { id: "home", icon: Activity, onClick: () => setActiveTab("home") },
          { id: "appointments", icon: Calendar, onClick: () => setActiveTab("appointments") },
          { id: "access", icon: Shield, onClick: () => setActiveTab("access") },
        ]
      : isDoctor
      ? [
          { id: "home", icon: Users, onClick: () => goHome() },
          { id: "link", icon: LinkIcon, onClick: () => setLinkModalOpen(true) },
          { id: "home_btn", icon: Home, onClick: () => goHome() },
        ]
      : [{ id: "home", icon: Home, onClick: () => setActiveTab("home") }];

    return (
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-slate-100 z-50 px-4 py-3 flex justify-around items-center">
        {items.map((item) => {
          const Icon = item.icon;
          const active =
            item.id === activeTab ||
            (isDoctor && item.id === "home" && activeTab === "home" && !selectedPatientId);

          return (
            <button
              key={item.id}
              onClick={item.onClick}
              className={`p-3 rounded-2xl transition-all ${
                active ? (isDoctor ? "bg-emerald-600 text-white" : "bg-blue-600 text-white") : "text-slate-400"
              }`}
              title={item.id}
            >
              <Icon size={22} />
            </button>
          );
        })}

        <button onClick={handleLogout} className="p-3 rounded-2xl text-rose-400" title="Sair">
          <ChevronLeft size={22} />
        </button>
      </nav>
    );
  };

  // ---------------- Render ----------------

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans text-slate-900 overflow-x-hidden">
      {/* LOGIN */}
      {view === "login" && (
        <div className="min-h-screen w-full flex items-center justify-center p-4">
          <div className="max-w-md w-full">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center bg-blue-600 p-4 rounded-3xl shadow-xl shadow-blue-200 mb-4">
                <Heart className="text-white" size={32} fill="currentColor" />
              </div>
              <h1 className="text-3xl font-black text-slate-800 italic tracking-tighter">VitaFlow</h1>
              <p className="text-slate-500 font-medium text-sm">A saúde conectada de forma inteligente.</p>
            </div>

            <Card className="space-y-4">
              <h2 className="text-xl font-black text-center text-slate-800 mb-2">Acessar conta</h2>
              <p className="text-xs text-slate-400 text-center mb-4">Escolha seu perfil</p>

              <div className="space-y-3">
                {roleButtons.map((btn) => {
                  const Icon = btn.icon;
                  const ts = toneStyles[btn.tone];
                  return (
                    <button
                      key={btn.role}
                      onClick={() => handleLogin(btn.role)}
                      className={`w-full p-4 border-2 border-slate-50 rounded-2xl flex items-center space-x-4 transition-all text-left group bg-white ${ts.borderHover}`}
                    >
                      <div
                        className={`p-2 rounded-lg transition-colors ${ts.iconBox} ${ts.iconBoxHover}`}
                      >
                        <Icon size={20} />
                      </div>
                      <div>
                        <span className="font-black text-slate-800 block text-sm">{btn.label}</span>
                        <span className="text-[9px] text-slate-400 uppercase font-black">{btn.sub}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </Card>

            <div className="mt-6">
              <LegalBanner />
            </div>
          </div>
        </div>
      )}

      {/* DASHBOARD */}
      {view === "dashboard" && (
        <>
          <DesktopSidebar />

          <main className="flex-1 p-4 md:p-10 pb-24 md:pb-10 max-w-5xl mx-auto w-full">
            {showLegalNotice && (
              <div className="relative">
                <LegalBanner />
                <button
                  onClick={() => setShowLegalNotice(false)}
                  className="absolute top-2 right-2 p-1 text-amber-400 hover:text-amber-600"
                >
                  <X size={14} />
                </button>
              </div>
            )}

            {userRole === "medico" && renderDoctorDashboard()}
            {userRole === "paciente" && renderPatientDashboard()}

            {userRole === "apoio" && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-slate-800">Rede de Apoio (MVP)</h2>
                <Card className="bg-slate-50/60 border-dashed">
                  <p className="text-sm text-slate-600">
                    Perfil “Rede de Apoio” ainda está como placeholder. Próxima etapa: níveis de acesso por permissão.
                  </p>
                </Card>

                <button
                  onClick={goHome}
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white font-black text-xs uppercase tracking-wider inline-flex items-center gap-2"
                >
                  <Home size={16} /> Voltar ao Home
                </button>
              </div>
            )}
          </main>

          <MobileNav />
        </>
      )}
    </div>
  );
}

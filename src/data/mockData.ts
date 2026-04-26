export type Sector = "Projetos" | "Ensino" | "Tesouraria" | "Marketing" | "RH";
export type Role = "Super Admin" | "Admin" | "Usuario" | "Visitante";
export type ProjectStatus = "Em Andamento" | "Concluido" | "Pausado";

export interface Project {
  id: string;
  title: string;
  sector: Sector;
  owner: string;
  ownerInitials: string;
  status: ProjectStatus;
  stage: string;
  progress: number;
  updatedAt: string;
  description?: string;
}

export interface FolderItem {
  id: string;
  name: string;
  category: Sector;
  count: number;
  updatedAt: string;
}

export interface FileItem {
  id: string;
  name: string;
  ext: string;
  size: string;
  uploadedAt: string;
  description?: string;
}

export interface Course {
  id: string;
  title: string;
  category: "Modelagem" | "Impressao" | "Design" | "Administrativo";
  tags: string[];
  level: "Iniciante" | "Intermediario" | "Avancado" | "Fundamentos";
  duration: string;
  sector?: Sector;
  progress: number;
}

export interface ProjectRequest {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  title: string;
  sector: Sector;
  description: string;
  submittedAt: string;
  status: "Pendente" | "Aprovado" | "Rejeitado";
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
  sector: Sector;
  status: "Ativo" | "Inativo";
  createdAt: string;
  initials: string;
  avatarColor?: "teal" | "purple" | "orange" | "pink";
}

export interface Activity {
  id: string;
  title: string;
  subject: string;
  user: string;
  timeAgo: string;
}

export const mockProjects: Project[] = [
  {
    id: "p-1",
    title: "Sistema de Gestao Interna",
    sector: "Projetos",
    owner: "Ana Silva",
    ownerInitials: "AS",
    status: "Em Andamento",
    stage: "Desenvolvimento",
    progress: 65,
    updatedAt: "26/04/2026",
    description:
      "Plataforma interna para acompanhamento de demandas de cada setor com dashboards customizados.",
  },
  {
    id: "p-2",
    title: "Plataforma de Cursos Online",
    sector: "Ensino",
    owner: "Carlos Santos",
    ownerInitials: "CS",
    status: "Em Andamento",
    stage: "Design de Interface",
    progress: 80,
    updatedAt: "25/04/2026",
  },
  {
    id: "p-3",
    title: "Dashboard Financeiro",
    sector: "Tesouraria",
    owner: "Maria Costa",
    ownerInitials: "MC",
    status: "Concluido",
    stage: "Entregue",
    progress: 100,
    updatedAt: "24/04/2026",
  },
  {
    id: "p-4",
    title: "Campanha Digital Q2",
    sector: "Marketing",
    owner: "Roberto Silva",
    ownerInitials: "RS",
    status: "Pausado",
    stage: "Revisao de Conteudo",
    progress: 45,
    updatedAt: "23/04/2026",
  },
  {
    id: "p-5",
    title: "Portal de Recrutamento",
    sector: "RH",
    owner: "Julia Oliveira",
    ownerInitials: "JO",
    status: "Em Andamento",
    stage: "Testes",
    progress: 30,
    updatedAt: "22/04/2026",
  },
  {
    id: "p-6",
    title: "Automacao de Processos",
    sector: "Projetos",
    owner: "Ana Silva",
    ownerInitials: "AS",
    status: "Em Andamento",
    stage: "Implementacao",
    progress: 55,
    updatedAt: "26/04/2026",
  },
  {
    id: "p-7",
    title: "Treinamento de Onboarding",
    sector: "Ensino",
    owner: "Pedro Lima",
    ownerInitials: "PL",
    status: "Pausado",
    stage: "Aguardando aprovacao",
    progress: 25,
    updatedAt: "20/04/2026",
  },
  {
    id: "p-8",
    title: "Relatorio Anual",
    sector: "Tesouraria",
    owner: "Maria Costa",
    ownerInitials: "MC",
    status: "Concluido",
    stage: "Publicado",
    progress: 100,
    updatedAt: "18/04/2026",
  },
  {
    id: "p-9",
    title: "Prototipo de Dispositivo Medico",
    sector: "Projetos",
    owner: "Carlos Henrique Santos",
    ownerInitials: "CS",
    status: "Em Andamento",
    stage: "Em Andamento",
    progress: 60,
    updatedAt: "29/03/2026",
    description:
      "Desenvolvimento de prototipo funcional para dispositivo medico portatil destinado a monitoramento de sinais vitais. O projeto inclui modelagem 3D de componentes estruturais, validacao de encaixe e testes de ergonomia.",
  },
];

export const mockFolders: FolderItem[] = [
  {
    id: "f-1",
    name: "Projetos de Engenharia",
    category: "Projetos",
    count: 12,
    updatedAt: "15/03/2024",
  },
  {
    id: "f-2",
    name: "Material Didatico",
    category: "Ensino",
    count: 8,
    updatedAt: "20/03/2024",
  },
  {
    id: "f-3",
    name: "Documentos Financeiros",
    category: "Tesouraria",
    count: 5,
    updatedAt: "22/03/2024",
  },
  {
    id: "f-4",
    name: "Campanhas de Marketing",
    category: "Marketing",
    count: 15,
    updatedAt: "18/03/2024",
  },
  {
    id: "f-5",
    name: "Recursos Humanos",
    category: "RH",
    count: 7,
    updatedAt: "25/03/2024",
  },
];

export const mockFiles: Record<string, FileItem[]> = {
  "f-1": [
    {
      id: "fi-1",
      name: "estrutura_principal_v3",
      ext: "stl",
      size: "12.4 MB",
      uploadedAt: "28/03/2024",
      description: "Sistema de Gestao Interna",
    },
    {
      id: "fi-2",
      name: "componente_secundario",
      ext: "obj",
      size: "8.7 MB",
      uploadedAt: "27/03/2024",
      description: "Automacao de Processos",
    },
  ],
  "f-2": [
    {
      id: "fi-3",
      name: "apostila_modelagem",
      ext: "pdf",
      size: "3.2 MB",
      uploadedAt: "20/03/2024",
      description: "Curso de Modelagem 3D",
    },
  ],
  "f-3": [],
  "f-4": [],
  "f-5": [],
};

export const mockCourses: Course[] = [
  {
    id: "c-1",
    title: "Introducao a Modelagem 3D",
    category: "Modelagem",
    tags: ["Fundamentos", "Iniciante"],
    level: "Fundamentos",
    duration: "2 horas",
    progress: 40,
  },
  {
    id: "c-2",
    title: "Tecnicas Avancadas de CAD",
    category: "Modelagem",
    tags: ["Engenharia", "Avancado"],
    level: "Avancado",
    duration: "4 horas",
    progress: 70,
  },
  {
    id: "c-3",
    title: "Fundamentos de Impressao FDM",
    category: "Impressao",
    tags: ["Tecnologia", "Iniciante"],
    level: "Iniciante",
    duration: "3 horas",
    progress: 25,
  },
  {
    id: "c-4",
    title: "Masterclass de Impressao em Resina",
    category: "Impressao",
    tags: ["Tecnologia", "Intermediario"],
    level: "Intermediario",
    duration: "5 horas",
    progress: 65,
  },
  {
    id: "c-5",
    title: "Otimizacao de Configuracoes de Impressao",
    category: "Impressao",
    tags: ["Tecnico"],
    level: "Intermediario",
    duration: "2 horas",
    progress: 0,
  },
  {
    id: "c-6",
    title: "Modelagem Organica com ZBrush",
    category: "Modelagem",
    tags: ["Arte"],
    level: "Avancado",
    duration: "6 horas",
    progress: 0,
  },
  {
    id: "c-7",
    title: "Teoria de Cores para Impressoes 3D",
    category: "Design",
    tags: ["Design"],
    level: "Iniciante",
    duration: "1.5 horas",
    progress: 0,
  },
  {
    id: "c-8",
    title: "Tecnicas de Acabamento Superficial",
    category: "Design",
    tags: ["Pos-processamento"],
    level: "Intermediario",
    duration: "2.5 horas",
    progress: 0,
  },
];

export const mockRequests: ProjectRequest[] = [
  {
    id: "r-1",
    name: "Ana Paula Rodrigues",
    email: "ana.rodrigues@email.com",
    title: "Sistema de Gestao Empresarial",
    sector: "Projetos",
    description:
      "Necessito de um sistema customizado para gestao empresarial integrado. O projeto requer desenvolvimento de modulos financeiro, RH e controle de estoque.",
    submittedAt: "26/04/2026",
    status: "Pendente",
  },
  {
    id: "r-2",
    name: "Felipe Martins Costa",
    phone: "(11) 98765-4321",
    title: "Plataforma de E-learning",
    sector: "Ensino",
    description:
      "Projeto de plataforma educacional para ensino a distancia. Preciso de funcionalidades de videoconferencia, gestao de conteudo e avaliacoes online.",
    submittedAt: "25/04/2026",
    status: "Aprovado",
  },
  {
    id: "r-3",
    name: "Juliana Santos Oliveira",
    email: "juliana.oliveira@empresa.com.br",
    title: "Dashboard de Indicadores Financeiros",
    sector: "Tesouraria",
    description:
      "Solicitacao de dashboard executivo para visualizacao de KPIs financeiros em tempo real. Prazo muito apertado de 3 dias.",
    submittedAt: "24/04/2026",
    status: "Rejeitado",
  },
];

export const mockUsers: User[] = [
  {
    id: "u-1",
    name: "Carlos Henrique Santos",
    email: "carlos.santos@inception3d.com",
    password: "carlos123",
    role: "Super Admin",
    sector: "Projetos",
    status: "Ativo",
    createdAt: "15/01/2024",
    initials: "CS",
    avatarColor: "purple",
  },
  {
    id: "u-2",
    name: "Maria Fernanda Costa",
    email: "maria.costa@inception3d.com",
    password: "maria123",
    role: "Admin",
    sector: "Tesouraria",
    status: "Ativo",
    createdAt: "22/02/2024",
    initials: "MC",
    avatarColor: "pink",
  },
  {
    id: "u-3",
    name: "Roberto Almeida Silva",
    email: "roberto.silva@inception3d.com",
    password: "roberto123",
    role: "Usuario",
    sector: "Marketing",
    status: "Ativo",
    createdAt: "10/03/2024",
    initials: "RS",
    avatarColor: "orange",
  },
  {
    id: "u-4",
    name: "Ana Silva",
    email: "ana.silva@inception3d.com",
    password: "ana123",
    role: "Usuario",
    sector: "Projetos",
    status: "Ativo",
    createdAt: "05/01/2024",
    initials: "AS",
    avatarColor: "teal",
  },
  {
    id: "u-5",
    name: "Pedro Santos Visitante",
    email: "pedro.visitante@external.com",
    password: "pedro123",
    role: "Visitante",
    sector: "Ensino",
    status: "Inativo",
    createdAt: "12/04/2026",
    initials: "PV",
  },
];

export function authenticate(email: string, password: string): User | null {
  const user = mockUsers.find(
    (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password,
  );
  return user ?? null;
}

export const mockActivities: Activity[] = [
  {
    id: "a-1",
    title: "Projeto atualizado",
    subject: "Sistema de Gestao Interna",
    user: "Ana Silva",
    timeAgo: "ha 2 horas",
  },
  {
    id: "a-2",
    title: "Novo projeto criado",
    subject: "Automacao de Processos",
    user: "Ana Silva",
    timeAgo: "ha 5 horas",
  },
  {
    id: "a-3",
    title: "Projeto concluido",
    subject: "Dashboard Financeiro",
    user: "Maria Costa",
    timeAgo: "ha 1 dia",
  },
  {
    id: "a-4",
    title: "Status alterado",
    subject: "Campanha Digital Q2",
    user: "Roberto Silva",
    timeAgo: "ha 2 dias",
  },
  {
    id: "a-5",
    title: "Novo membro adicionado",
    subject: "Portal de Recrutamento",
    user: "Julia Oliveira",
    timeAgo: "ha 3 dias",
  },
];

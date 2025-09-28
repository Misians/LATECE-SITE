// ===================================
// AUTH & USER
// ===================================
export interface User {
  id: number;
  username: string;
  email: string;
  passwordHash: string; // Corrigido para camelCase
  fullName: string;
  role: 'user' | 'admin' | 'editor';
  createdAt: string;
}

// ===================================
// NEWS (Notícias)
// ===================================
export interface News {
  id: number;
  title: string;
  content: string;
  excerpt?: string;
  imageUrl?: string;
  category: string;
  status: 'draft' | 'published';
  authorId: number;
  createdAt: string;
  updatedAt: string;
  tags?: string[];
}

// Tipo para o formulário de criação/edição de notícias
export interface NewsFormData {
  title: string;
  content: string;
  excerpt?: string;
  category: string;
  status: 'draft' | 'published';
  image?: File | null;
  tags?: string[]; // Adicionado para corresponder ao formulário
}


// ===================================
// TEAM (Equipe)
// ===================================
export interface TeamMember {
  id: number;
  name: string;
  role: 'Coordenador' | 'Pesquisador' | 'Estudante' | 'Técnico' | 'Colaborador';
  bio?: string;
  photoUrl?: string;
  email?: string;
  lattesUrl?: string;
  createdAt: string;
  updatedAt: string;
}

// Tipo para o formulário de criação/edição de membros da equipe
export interface TeamMemberFormData {
  name: string;
  role: 'Coordenador' | 'Pesquisador' | 'Estudante' | 'Técnico' | 'Colaborador';
  bio?: string;
  email?: string;
  lattesUrl?: string;
  // A foto é um objeto File no formulário
  photo?: File | null;
}


// ===================================
// PUBLICATIONS (Publicações)
// ===================================
export interface Publication {
  id: number;
  title: string;
  authors: string[]; // Salvo como um array de strings
  journalConference: string;
  publicationYear: number;
  doi?: string; // Digital Object Identifier
  abstract: string;
  pdfUrl?: string;
  createdAt: string;
  updatedAt: string;
}

// Tipo para o formulário de criação/edição de publicações
export interface PublicationFormData {
  title: string;
  // No formulário, pode ser mais fácil de editar como uma string separada por vírgulas
  authors: string; 
  journalConference: string;
  publicationYear: number;
  doi?: string;
  abstract: string;
  // O PDF é um objeto File no formulário
  pdfFile?: File | null;
}


// ===================================
// EQUIPMENT (Equipamentos)
// ===================================
export interface Equipment {
  id: number;
  name: string;
  description: string;
  model?: string;
  manufacturer?: string;
  status: 'disponível' | 'em uso' | 'em manutenção';
  imageUrl?: string;
  manualUrl?: string;
  location?: string;
  createdAt: string;
  updatedAt: string;
}

// Tipo para o formulário de criação/edição de equipamentos
export interface EquipmentFormData {
  name: string;
  description: string;
  model?: string;
  manufacturer?: string;
  status: 'disponível' | 'em uso' | 'em manutenção';
  location?: string;
  // A imagem e o manual são objetos File no formulário
  image?: File | null;
  manualFile?: File | null;
}


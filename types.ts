
export type Jenjang = 'SD' | 'SMP' | 'SMA';

export interface Subject {
  id: number;
  name: string;
  jenjang: Jenjang;
  category: 'umum' | 'agama';
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface QuizResult {
  score: number;
  total: number;
  subjectName: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

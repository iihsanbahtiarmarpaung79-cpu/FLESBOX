
import { Subject } from './types';

export const WEBSITE_CONFIG = {
  name: 'FLESBOX',
  description: 'Platform pembelajaran SD, SMP, SMA dengan materi umum dan agama, kuis, AI generator, dan chatbot.',
  admin: {
    email: 'fadelaqram6@gmail.com',
    password: 'fadel.com',
    whatsapp: '+6282277930100'
  }
};

export const SUBJECTS_UMUM: Subject[] = [
  { id: 1, name: "Matematika SD", jenjang: "SD", category: 'umum' },
  { id: 2, name: "Bahasa Indonesia SD", jenjang: "SD", category: 'umum' },
  { id: 3, name: "IPA SD", jenjang: "SD", category: 'umum' },
  { id: 4, name: "IPS SD", jenjang: "SD", category: 'umum' },
  { id: 5, name: "PPKn SD", jenjang: "SD", category: 'umum' },
  { id: 11, name: "Matematika SMP", jenjang: "SMP", category: 'umum' },
  { id: 12, name: "Bahasa Indonesia SMP", jenjang: "SMP", category: 'umum' },
  { id: 13, name: "IPA Terpadu SMP", jenjang: "SMP", category: 'umum' },
  { id: 21, name: "Matematika Wajib", jenjang: "SMA", category: 'umum' },
  { id: 25, name: "Fisika", jenjang: "SMA", category: 'umum' },
  { id: 26, name: "Kimia", jenjang: "SMA", category: 'umum' },
  { id: 27, name: "Biologi", jenjang: "SMA", category: 'umum' },
  { id: 28, name: "Ekonomi", jenjang: "SMA", category: 'umum' }
];

export const SUBJECTS_AGAMA: Subject[] = [
  { id: 1, name: "PAI SD", jenjang: "SD", category: 'agama' },
  { id: 2, name: "Akidah Akhlak SD", jenjang: "SD", category: 'agama' },
  { id: 3, name: "Fiqih Dasar", jenjang: "SD", category: 'agama' },
  { id: 11, name: "PAI SMP", jenjang: "SMP", category: 'agama' },
  { id: 12, name: "Akidah Akhlak SMP", jenjang: "SMP", category: 'agama' },
  { id: 13, name: "Fiqih Ibadah", jenjang: "SMP", category: 'agama' },
  { id: 21, name: "PAI SMA", jenjang: "SMA", category: 'agama' },
  { id: 23, name: "Fiqih Lanjutan", jenjang: "SMA", category: 'agama' },
  { id: 24, name: "Al-Qur'an Tafsir", jenjang: "SMA", category: 'agama' }
];

export const ALL_SUBJECTS = [...SUBJECTS_UMUM, ...SUBJECTS_AGAMA];

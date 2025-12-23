
import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Chatbot } from './components/Chatbot';
import { QuizInterface } from './components/QuizInterface';
import { WEBSITE_CONFIG, ALL_SUBJECTS } from './constants';
import { Jenjang, QuizQuestion } from './types';
import { generateMaterial, generateQuiz } from './services/geminiService';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedJenjang, setSelectedJenjang] = useState<Jenjang | 'Semua'>('Semua');
  const [activeQuiz, setActiveQuiz] = useState<QuizQuestion[] | null>(null);
  const [quizResult, setQuizResult] = useState<{score: number, total: number} | null>(null);
  const [material, setMaterial] = useState<string | null>(null);
  const [currentSubject, setCurrentSubject] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Handle window resizing and orientation
  useEffect(() => {
    const handleResize = () => {
      // Logic for layout adjustments if needed
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleStartQuiz = async (subject: string) => {
    setIsLoading(true);
    setCurrentSubject(subject);
    setCurrentPage('quiz-taking');
    try {
      const questions = await generateQuiz(subject, 5);
      setActiveQuiz(questions);
    } catch (err) {
      alert("Gagal memuat kuis. Silakan coba lagi.");
      setCurrentPage('subjects');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateMaterial = async (subject: string) => {
    setIsLoading(true);
    setCurrentSubject(subject);
    setCurrentPage('material-view');
    try {
      const content = await generateMaterial(subject, "Pendahuluan, Konsep Dasar, dan Contoh Soal");
      setMaterial(content);
    } catch (err) {
      alert("Gagal memuat materi.");
      setCurrentPage('subjects');
    } finally {
      setIsLoading(false);
    }
  };

  const renderContent = () => {
    switch (currentPage) {
      case 'home':
        return (
          <div className="space-y-12 pb-20 animate-in fade-in duration-700">
            {/* Hero Section */}
            <section className="relative pt-10 sm:pt-16 pb-12 overflow-hidden px-4">
              <div className="absolute top-0 right-0 -z-10 w-full sm:w-1/2 h-[70%] sm:h-full bg-indigo-50 rounded-b-[60px] sm:rounded-bl-[120px] sm:rounded-br-none"></div>
              <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
                <div className="md:w-1/2 space-y-6 text-center md:text-left">
                  <span className="inline-block px-4 py-1.5 bg-indigo-100 text-indigo-700 rounded-full text-[10px] font-bold tracking-widest uppercase">
                    Platform Cerdas Pelajar Indonesia
                  </span>
                  <h1 className="text-4xl md:text-7xl font-extrabold text-slate-900 leading-[1.1]">
                    Belajar <span className="text-indigo-600">Lebih Cerdas</span> Dengan AI
                  </h1>
                  <p className="text-base sm:text-lg text-slate-600 max-w-lg mx-auto md:mx-0">
                    Satu aplikasi untuk semua jenjang. Dilengkapi AI yang siap membantu membuat kuis, materi, dan menjawab pertanyaanmu kapan saja.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <button 
                      onClick={() => setCurrentPage('subjects')}
                      className="w-full sm:w-auto bg-indigo-600 text-white px-10 py-5 rounded-[20px] font-bold shadow-2xl shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-1 transition-all active:scale-95"
                    >
                      Mulai Sekarang
                    </button>
                    <button 
                      onClick={() => setCurrentPage('about')}
                      className="w-full sm:w-auto bg-white text-indigo-600 border border-slate-200 px-10 py-5 rounded-[20px] font-bold hover:bg-slate-50 transition-all active:scale-95"
                    >
                      Tentang FLESBOX
                    </button>
                  </div>
                </div>
                <div className="md:w-1/2 w-full max-w-lg md:max-w-none px-4 md:px-0">
                  <div className="relative group">
                    <div className="absolute -inset-4 bg-indigo-500/10 rounded-[50px] blur-2xl group-hover:bg-indigo-500/20 transition-all"></div>
                    <div className="relative bg-white p-3 rounded-[40px] shadow-2xl overflow-hidden">
                      <img 
                        src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800" 
                        alt="E-Learning" 
                        className="rounded-[30px] w-full object-cover aspect-[4/3]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Features Responsive Grid */}
            <section className="max-w-7xl mx-auto px-6 py-12">
              <div className="text-center mb-16">
                <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">Kenapa FLESBOX?</h2>
                <div className="w-16 h-1.5 bg-indigo-600 mx-auto mt-4 rounded-full"></div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {[
                  { title: "Materi Kilat AI", desc: "Dapatkan rangkuman materi lengkap hanya dalam hitungan detik untuk topik apapun.", icon: "⚡", color: "bg-blue-50" },
                  { title: "Kuis Adaptif", desc: "Latihan soal yang dibuat khusus untuk menguji pemahamanmu secara mendalam.", icon: "🎯", color: "bg-emerald-50" },
                  { title: "Tanya Jawab 24/7", desc: "Bingung dengan tugas sekolah? AI Tutor kami siap membantu kapan saja.", icon: "💬", color: "bg-orange-50" }
                ].map((f, i) => (
                  <div key={i} className={`${f.color} p-10 rounded-[35px] border border-white/50 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300`}>
                    <div className="text-5xl mb-6">{f.icon}</div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">{f.title}</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">{f.desc}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        );

      case 'subjects':
        return (
          <div className="max-w-7xl mx-auto px-4 py-8 sm:py-16 animate-in slide-in-from-bottom-8 duration-500">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8">
              <div className="space-y-2">
                <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">Katalog <span className="text-indigo-600">Mapel</span></h2>
                <p className="text-slate-500 font-medium">Temukan materi dari jenjang SD hingga SMA</p>
              </div>
              <div className="flex bg-white/50 backdrop-blur-sm p-1.5 rounded-[22px] border border-slate-200 shadow-sm overflow-x-auto no-scrollbar">
                {['Semua', 'SD', 'SMP', 'SMA'].map((j) => (
                  <button
                    key={j}
                    onClick={() => setSelectedJenjang(j as any)}
                    className={`px-8 py-3 rounded-[18px] text-sm font-bold whitespace-nowrap transition-all ${
                      selectedJenjang === j ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-slate-500 hover:bg-white hover:text-indigo-600'
                    }`}
                  >
                    {j}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {ALL_SUBJECTS
                .filter(s => selectedJenjang === 'Semua' || s.jenjang === selectedJenjang)
                .map((subject) => (
                  <div key={subject.id} className="group bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-2xl hover:border-indigo-100 transition-all duration-300 flex flex-col h-full">
                    <div className="flex justify-between items-center mb-6">
                      <span className={`px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                        subject.category === 'agama' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {subject.category}
                      </span>
                      <span className="bg-slate-50 px-3 py-1 rounded-lg text-slate-400 font-bold text-[10px]">{subject.jenjang}</span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-8 flex-grow leading-tight group-hover:text-indigo-600 transition-colors">
                      {subject.name}
                    </h3>
                    <div className="grid grid-cols-2 gap-3 mt-auto">
                      <button 
                        onClick={() => handleGenerateMaterial(subject.name)}
                        className="bg-slate-50 text-indigo-600 py-3.5 rounded-2xl text-xs font-bold hover:bg-indigo-50 transition-all border border-transparent hover:border-indigo-100 active:scale-95"
                      >
                        Baca Materi
                      </button>
                      <button 
                        onClick={() => handleStartQuiz(subject.name)}
                        className="bg-indigo-600 text-white py-3.5 rounded-2xl text-xs font-bold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100 active:scale-95"
                      >
                        Ikut Kuis
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        );

      case 'material-view':
        return (
          <div className="max-w-4xl mx-auto px-4 py-8 sm:py-16">
            <button 
              onClick={() => setCurrentPage('subjects')}
              className="flex items-center text-indigo-600 font-bold mb-8 hover:translate-x-[-4px] transition-transform group"
            >
              <div className="bg-indigo-50 p-2 rounded-xl mr-3 group-hover:bg-indigo-100 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
              </div>
              Kembali ke Mapel
            </button>
            
            {isLoading ? (
              <div className="flex flex-col items-center justify-center min-h-[400px] space-y-6">
                <div className="relative">
                  <div className="w-20 h-20 border-[6px] border-indigo-100 rounded-full"></div>
                  <div className="w-20 h-20 border-[6px] border-indigo-600 border-t-transparent rounded-full animate-spin absolute top-0"></div>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-slate-800">AI sedang menulis materi...</p>
                  <p className="text-slate-400 mt-1">Hampir selesai, mohon tunggu sebentar.</p>
                </div>
              </div>
            ) : (
              <div className="animate-in fade-in slide-in-from-bottom-10 duration-700">
                <div className="bg-white p-8 sm:p-16 rounded-[48px] shadow-2xl shadow-slate-200/50 border border-slate-50 prose prose-slate max-w-none">
                  <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-8 border-b border-slate-100 pb-8">{currentSubject}</h1>
                  <div className="whitespace-pre-wrap text-slate-700 text-lg leading-[1.8] font-medium">
                    {material}
                  </div>
                </div>
                <div className="mt-12 flex justify-center">
                   <button 
                      onClick={() => handleStartQuiz(currentSubject)}
                      className="bg-indigo-600 text-white px-12 py-5 rounded-[24px] font-bold shadow-2xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95"
                    >
                      Uji Pemahaman Sekarang
                    </button>
                </div>
              </div>
            )}
          </div>
        );

      case 'quiz-taking':
        return isLoading ? (
          <div className="flex flex-col items-center justify-center min-h-[500px] space-y-6">
            <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
            <p className="text-slate-500 font-bold text-lg">Menyusun soal kuis spesial untukmu...</p>
          </div>
        ) : activeQuiz ? (
          <QuizInterface 
            questions={activeQuiz} 
            onCancel={() => setCurrentPage('subjects')}
            onComplete={(score, total) => {
              setQuizResult({ score, total });
              setCurrentPage('quiz-result');
            }}
          />
        ) : null;

      case 'quiz-result':
        return (
          <div className="max-w-lg mx-auto px-4 py-20 text-center animate-in zoom-in-95 duration-500">
            <div className="bg-white p-12 rounded-[50px] shadow-2xl border border-slate-50 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-indigo-600"></div>
              <div className="text-7xl mb-6">🏆</div>
              <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Luar Biasa!</h2>
              <p className="text-slate-500 mb-10 font-medium">Kamu telah menyelesaikan kuis {currentSubject}</p>
              
              <div className="inline-flex items-center justify-center w-40 h-40 rounded-full bg-indigo-50 border-8 border-white shadow-inner mb-10">
                <div>
                  <span className="block text-5xl font-black text-indigo-600">{quizResult?.score}</span>
                  <span className="block text-xs font-bold text-indigo-300 uppercase tracking-widest">Dari {quizResult?.total} Poin</span>
                </div>
              </div>

              <div className="space-y-4">
                <button 
                  onClick={() => handleStartQuiz(currentSubject)}
                  className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 active:scale-95"
                >
                  Ulangi Kuis
                </button>
                <button 
                  onClick={() => setCurrentPage('subjects')}
                  className="w-full bg-slate-50 text-slate-600 py-5 rounded-2xl font-bold hover:bg-slate-100 transition-all active:scale-95"
                >
                  Pilih Mapel Lain
                </button>
              </div>
            </div>
          </div>
        );

      case 'classroom':
        return (
          <div className="max-w-7xl mx-auto px-6 py-20 text-center animate-in fade-in duration-500">
            <div className="max-w-md mx-auto bg-white p-12 rounded-[50px] shadow-2xl">
              <div className="text-7xl mb-8">🧑‍🏫</div>
              <h2 className="text-3xl font-extrabold text-slate-900 leading-tight">Ruang Kelas <span className="text-indigo-600">Virtual</span></h2>
              <p className="text-slate-500 mt-6 leading-relaxed font-medium">
                Kami sedang menyiapkan ekosistem belajar bareng yang seru. Tunggu kehadirannya segera!
              </p>
              <button 
                onClick={() => setCurrentPage('home')}
                className="mt-10 bg-indigo-600 text-white px-10 py-4 rounded-2xl font-bold shadow-lg shadow-indigo-100 active:scale-95"
              >
                Kembali Beranda
              </button>
            </div>
          </div>
        );

      case 'about':
        return (
          <div className="max-w-5xl mx-auto px-6 py-16">
            <h2 className="text-4xl sm:text-5xl font-black text-slate-900 mb-16 text-center tracking-tight">Visi & <span className="text-indigo-600">Misi Kami</span></h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-12 rounded-[45px] shadow-xl border border-slate-50 hover:border-indigo-100 transition-colors">
                <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-indigo-100">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Visi</h3>
                <p className="text-slate-600 text-lg leading-relaxed font-medium">
                  Menjadi jembatan teknologi untuk memajukan kualitas pendidikan pelajar Indonesia melalui AI yang inklusif.
                </p>
              </div>
              <div className="bg-white p-12 rounded-[45px] shadow-xl border border-slate-50 hover:border-emerald-100 transition-colors">
                <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-emerald-100">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Misi</h3>
                <ul className="space-y-4">
                  {['Materi berkualitas tinggi', 'Pemanfaatan AI mutakhir', 'Akses pendidikan yang setara'].map((m, i) => (
                    <li key={i} className="flex items-center text-slate-600 font-medium">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full mr-3"></div>
                      {m}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        );

      case 'admin':
        return (
          <div className="max-w-md mx-auto px-6 py-12 sm:py-24">
            {isAdmin ? (
              <div className="bg-white p-10 rounded-[40px] shadow-2xl border border-indigo-50">
                <div className="flex justify-between items-center mb-10">
                  <h2 className="text-2xl font-extrabold text-slate-900">Admin</h2>
                  <button onClick={() => setIsAdmin(false)} className="bg-red-50 text-red-600 px-4 py-2 rounded-xl text-xs font-bold active:scale-95 transition-all">Keluar</button>
                </div>
                <div className="grid grid-cols-1 gap-4">
                   <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status Sistem</p>
                      <div className="flex items-center text-emerald-600 font-bold">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></div>
                        Berjalan Normal
                      </div>
                   </div>
                   <button className="w-full bg-indigo-600 text-white py-5 rounded-[22px] font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 active:scale-95 transition-all">Kelola Bank Soal</button>
                </div>
              </div>
            ) : (
              <div className="bg-white p-10 rounded-[40px] shadow-2xl border border-slate-100">
                <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Panel Admin</h2>
                <p className="text-slate-400 text-sm mb-10 font-medium">Hanya untuk akses administrator FLESBOX.</p>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const target = e.target as any;
                  if(target.email.value === WEBSITE_CONFIG.admin.email && target.password.value === WEBSITE_CONFIG.admin.password) {
                    setIsAdmin(true);
                  } else {
                    alert("Kredensial salah.");
                  }
                }} className="space-y-5">
                  <div>
                    <input name="email" type="email" required className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all" placeholder="Email Admin" />
                  </div>
                  <div>
                    <input name="password" type="password" required className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all" placeholder="Kata Sandi" />
                  </div>
                  <button type="submit" className="w-full bg-indigo-900 text-white py-5 rounded-[22px] font-bold shadow-xl shadow-indigo-100 mt-6 active:scale-95 transition-all">
                    Masuk Ke Panel
                  </button>
                </form>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar onNavigate={setCurrentPage} currentPage={currentPage} />
      
      <main className="flex-1 safe-pb">
        {renderContent()}
      </main>

      <footer className="bg-white border-t border-slate-100 py-16 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 items-center text-center md:text-left">
          <div>
            <div className="flex items-center justify-center md:justify-start mb-6">
               <div className="bg-indigo-600 h-10 w-10 rounded-xl flex items-center justify-center text-white font-bold text-xl mr-3">F</div>
               <span className="text-2xl font-black text-slate-900 tracking-tighter">{WEBSITE_CONFIG.name}</span>
            </div>
            <p className="text-slate-400 text-sm font-medium leading-relaxed">
              Inovasi teknologi pendidikan masa kini untuk mencetak generasi cerdas dan berintegritas.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            {['Beranda', 'Mapel', 'Kuis', 'Tentang'].map(link => (
              <button key={link} onClick={() => setCurrentPage(link.toLowerCase() === 'beranda' ? 'home' : link.toLowerCase())} className="text-slate-500 hover:text-indigo-600 font-bold transition-colors">
                {link}
              </button>
            ))}
          </div>
          <div className="flex justify-center md:justify-end gap-5">
            {[
              { label: 'WA', url: `https://wa.me/${WEBSITE_CONFIG.admin.whatsapp.replace('+', '')}` },
              { label: 'IG', url: '#' },
              { label: 'TW', url: '#' }
            ].map(social => (
              <a key={social.label} href={social.url} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 font-bold hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all active:scale-90 shadow-sm">
                {social.label}
              </a>
            ))}
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-slate-50 text-center">
           <p className="text-slate-300 text-[10px] font-bold uppercase tracking-[0.2em]">
             &copy; 2024 FLESBOX INDONESIA. Hak Cipta Dilindungi.
           </p>
        </div>
      </footer>

      <Chatbot />
    </div>
  );
};

export default App;

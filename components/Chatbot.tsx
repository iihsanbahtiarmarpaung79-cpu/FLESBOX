
import React, { useState, useRef, useEffect } from 'react';
import { getChatbotResponse } from '../services/geminiService';
import { FileAttachment } from './FileAttachment';

interface Message {
  role: 'user' | 'model';
  text?: string;
  image?: string;
}

export const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Hai! Saya FLESBOX AI Tutor. Mau tanya soal Matematika, IPA, atau Fiqih? Tulis aja atau kirim foto soalnya ya!' }
  ]);
  const [input, setInput] = useState('');
  const [selectedFile, setSelectedFile] = useState<{ data: string; mimeType: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if ((!input.trim() && !selectedFile) || isLoading) return;

    const userMessage: Message = { role: 'user', text: input };
    if (selectedFile) {
        userMessage.image = `data:${selectedFile.mimeType};base64,${selectedFile.data}`;
    }
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    const currentFile = selectedFile;
    setSelectedFile(null);
    setIsLoading(true);

    // Prepare history for API
    const history = messages.map(m => {
        const parts: any[] = [];
        if (m.text) parts.push({ text: m.text });
        if (m.image) {
             // Reconstruct inlineData for previous messages if needed, 
             // but simpler to just send text history for context and full parts for current turn.
             // For this simple implementation, we might not send full image history to save tokens/bandwidth,
             // or we can if strictly needed. Let's simplify and send text history.
        }
        return {
            role: m.role,
            parts: parts.length > 0 ? parts : [{ text: '' }]
        };
    });

    // Current turn
    const currentParts: any[] = [];
    if (input) currentParts.push({ text: input });
    if (currentFile) {
        currentParts.push({
            inlineData: {
                data: currentFile.data,
                mimeType: currentFile.mimeType
            }
        });
    }

    try {
      const response = await getChatbotResponse(history, currentParts);
      setMessages(prev => [...prev, { role: 'model', text: response || 'Maaf, saya tidak dapat memproses permintaan tersebut.' }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'model', text: 'Waduh, koneksi tutor terputus. Coba lagi ya!' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[60] flex flex-col items-end">
      {isOpen && (
        <div className="bg-white w-[calc(100vw-3rem)] sm:w-96 h-[70vh] sm:h-[550px] rounded-[32px] shadow-2xl flex flex-col border border-indigo-50 overflow-hidden animate-in slide-in-from-bottom-10 mb-4 glass-morphism">
          <div className="bg-indigo-600 p-6 text-white flex justify-between items-center shadow-lg">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center text-2xl">🤖</div>
              <div>
                <h3 className="font-extrabold text-sm tracking-tight">FLESBOX AI Tutor</h3>
                <div className="flex items-center text-[10px] opacity-80 font-bold">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1.5 animate-pulse"></div>
                  Online & Siap Bantu
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-indigo-500 p-2 rounded-xl transition-colors active:scale-90">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-slate-50/50">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] flex flex-col gap-2 ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                   {m.image && (
                       <img src={m.image} alt="Uploaded" className="max-w-full w-40 rounded-2xl border border-indigo-100 shadow-sm" />
                   )}
                   {m.text && (
                    <div className={`p-4 rounded-3xl text-sm font-medium leading-relaxed ${
                    m.role === 'user' 
                        ? 'bg-indigo-600 text-white rounded-br-none shadow-md' 
                        : 'bg-white text-slate-700 border border-slate-100 rounded-bl-none shadow-sm'
                    }`}>
                    {m.text}
                    </div>
                   )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white text-indigo-400 p-4 rounded-3xl rounded-bl-none shadow-sm flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:-.3s]"></div>
                  <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:-.5s]"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 bg-white border-t border-slate-100">
             {selectedFile && (
                 <div className="flex items-center gap-2 mb-2 p-2 bg-indigo-50 rounded-xl">
                     <div className="w-10 h-10 rounded-lg overflow-hidden bg-white">
                         <img src={`data:${selectedFile.mimeType};base64,${selectedFile.data}`} className="w-full h-full object-cover" />
                     </div>
                     <span className="text-xs font-bold text-indigo-900 flex-1 truncate">Gambar terpilih</span>
                     <button onClick={() => setSelectedFile(null)} className="text-red-500 hover:bg-red-50 p-1 rounded-full">
                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                     </button>
                 </div>
             )}
             <div className="flex items-center space-x-2">
                <FileAttachment onFileSelect={setSelectedFile} />
                <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder={selectedFile ? "Tambahkan keterangan..." : "Tulis pertanyaanmu..."}
                className="flex-1 bg-slate-50 border-none rounded-2xl px-5 py-4 text-sm font-bold focus:ring-4 focus:ring-indigo-500/10 outline-none placeholder:text-slate-400"
                />
                <button
                onClick={handleSend}
                disabled={isLoading || (!input.trim() && !selectedFile)}
                className="bg-indigo-600 text-white p-4 rounded-2xl hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-lg shadow-indigo-100 active:scale-90"
                >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                </button>
            </div>
          </div>
        </div>
      )}
      
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`bg-indigo-600 text-white p-5 rounded-[22px] shadow-2xl hover:scale-105 transition-all flex items-center justify-center group active:scale-95 ${isOpen ? 'rotate-90 bg-indigo-900' : ''}`}
      >
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
        ) : (
          <div className="flex items-center">
            <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 font-bold whitespace-nowrap text-sm mr-0 group-hover:mr-3">Tanya Tutor</span>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
          </div>
        )}
      </button>
    </div>
  );
};

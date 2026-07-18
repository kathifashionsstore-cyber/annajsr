import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCommentDots, FaPaperPlane, FaTimes, FaRobot, FaExternalLinkAlt, FaWhatsapp, FaEnvelope } from 'react-icons/fa';
import Fuse from 'fuse.js';
import { getChatbotKB, logChatbotMessage, logAnalyticsEvent } from '../services/portfolioService';

const getSessionId = () => {
  let id = sessionStorage.getItem('jsr_chat_session');
  if (!id) {
    id = 'session_' + Math.random().toString(36).substring(2, 9);
    sessionStorage.setItem('jsr_chat_session', id);
  }
  return id;
};

const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [kbData, setKbData] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('jsr_chat_history');
    return saved ? JSON.parse(saved) : [
      { 
        role: 'model', 
        text: "Hello! I am JSR Annamayya's AI Assistant. Ask me anything about his career, projects, Swachh Bharat campaigns, or awards!" 
      }
    ];
  });
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const scrollRef = useRef(null);

  // Load Knowledge Base from service on mount
  useEffect(() => {
    const loadKB = async () => {
      const kbList = await getChatbotKB();
      setKbData(kbList || []);
      
      // Shuffle and pick 3 suggestions to display as chips
      if (kbList && kbList.length > 0) {
        const shuffled = [...kbList].sort(() => 0.5 - Math.random());
        setSuggestions(shuffled.slice(0, 3).map(item => item.question));
      }
    };
    loadKB();
  }, []);

  // Save chat history to localStorage
  useEffect(() => {
    localStorage.setItem('jsr_chat_history', JSON.stringify(messages));
  }, [messages]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const handleLinkNavigate = (anchor) => {
    // Standardise '#journey' to '#experience' if it slips through
    const targetId = anchor === '#journey' ? 'experience' : anchor.replace('#', '');
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsOpen(false); // Close chatbot upon successful navigation
    } else {
      window.location.hash = anchor;
    }
  };

  const handleSend = async (textToSend) => {
    const msgText = textToSend || input;
    if (!msgText.trim()) return;

    // Add user message
    const userMsg = { role: 'user', text: msgText };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate natural response delay (600ms)
    setTimeout(async () => {
      let matchedEntry = null;

      // 1. Fuzzy Search across KB using Fuse.js
      if (kbData.length > 0) {
        const fuse = new Fuse(kbData, {
          keys: [
            { name: 'question', weight: 0.6 },
            { name: 'keywords', weight: 0.4 }
          ],
          threshold: 0.5,
          includeScore: true
        });

        const searchResults = fuse.search(msgText);
        if (searchResults.length > 0 && searchResults[0].score <= 0.6) {
          matchedEntry = searchResults[0].item;
        }
      }

      let botResponseMsg = {};
      const sessionId = getSessionId();

      if (matchedEntry) {
        botResponseMsg = {
          role: 'model',
          text: matchedEntry.answer,
          link: matchedEntry.link
        };
        // Log successful match
        await logChatbotMessage(
          sessionId, 
          msgText, 
          matchedEntry.answer, 
          matchedEntry.question, 
          false
        );
      } else {
        botResponseMsg = {
          role: 'model',
          text: "I'm not sure about that specific detail, but I'd love to help you connect with JSR Annamayya. You can reach out directly via the options below!",
          isFallback: true
        };
        // Log fallback match
        await logChatbotMessage(
          sessionId, 
          msgText, 
          botResponseMsg.text, 
          'None', 
          true
        );
      }

      setMessages(prev => [...prev, botResponseMsg]);
      setIsTyping(false);

      // Increment rollup query counter
      logAnalyticsEvent({ type: 'chatbot_message' });
    }, 600);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const clearHistory = () => {
    const defaultMsg = [
      { 
        role: 'model', 
        text: "Hello! I am JSR Annamayya's AI Assistant. Ask me anything about his career, projects, Swachh Bharat campaigns, or awards!" 
      }
    ];
    setMessages(defaultMsg);
  };

  return (
    <div className="fixed z-50 font-sans">
      
      {/* Floating Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`fixed right-6 bottom-60 md:left-auto md:right-24 md:bottom-8 w-12 h-12 rounded-full bg-charcoal border border-[#E8A33D]/20 text-[#E8A33D] flex items-center justify-center shadow-[0_8px_30px_rgba(0,0,0,0.5)] focus:outline-none z-50 ${
          isOpen ? 'bg-primary border-transparent text-white' : 'hover:border-[#E8A33D]/50'
        }`}
        aria-label="Open AI Assistant"
      >
        {isOpen ? <FaTimes className="w-5 h-5" /> : <FaCommentDots className="w-5 h-5 animate-pulse" />}
      </motion.button>

      {/* Chat Window Popup */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{ type: 'spring', damping: 25, stiffness: 250 }}
            className="fixed left-6 right-6 bottom-44 md:left-auto md:right-24 md:bottom-24 w-auto md:w-96 max-h-[500px] h-[75vh] md:h-[480px] bg-[#1E1B18]/95 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl flex flex-col overflow-hidden z-50"
          >
            
            {/* Header */}
            <div className="bg-[#25221F] border-b border-white/5 px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-secondary/15 flex items-center justify-center text-secondary border border-secondary/35">
                  <FaRobot className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <h4 className="text-sm font-black text-white tracking-tight">JSR Assistant</h4>
                  <span className="text-[9px] font-bold text-green-500 uppercase tracking-widest flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block animate-ping"></span> Online
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={clearHistory} 
                  title="Clear Chat"
                  className="text-white/30 hover:text-white/70 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded border border-white/10 transition-colors"
                >
                  Clear
                </button>
                <button onClick={() => setIsOpen(false)} className="text-white/40 hover:text-white transition-colors">
                  <FaTimes className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4 scrollbar-thin scrollbar-thumb-white/10">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col max-w-[85%] ${msg.role === 'user' ? 'self-end text-right' : 'self-start text-left'}`}
                >
                  <span className="text-[8px] font-bold text-white/30 uppercase tracking-widest mb-1 px-1">
                    {msg.role === 'user' ? 'You' : 'Assistant'}
                  </span>
                  <div
                    className={`p-3.5 rounded-2xl text-xs font-medium leading-relaxed whitespace-pre-line ${
                      msg.role === 'user'
                        ? 'bg-primary text-white rounded-tr-none'
                        : 'bg-[#25221F] text-white/95 rounded-tl-none border border-white/5'
                    }`}
                  >
                    {msg.text}

                    {/* Navigational anchor chip */}
                    {msg.link && (
                      <button
                        onClick={() => handleLinkNavigate(msg.link)}
                        className="mt-2.5 text-[10px] font-black text-secondary hover:text-primary bg-[#2d2824]/90 border border-secondary/25 hover:border-secondary/60 px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-all w-fit shadow-sm"
                      >
                        Explore Details <FaExternalLinkAlt className="w-2.5 h-2.5" />
                      </button>
                    )}

                    {/* Fallback Action Chips */}
                    {msg.isFallback && (
                      <div className="mt-3 flex flex-col gap-2 border-t border-white/5 pt-2.5">
                        <button
                          onClick={() => handleLinkNavigate('#contact')}
                          className="text-[10px] font-black text-secondary hover:text-primary bg-[#2d2824]/90 border border-secondary/25 hover:border-secondary/60 px-3 py-1.5 rounded-full flex items-center gap-2 transition-all w-full text-left"
                        >
                          <FaEnvelope className="w-3 h-3 text-secondary" /> Fill Contact Form
                        </button>
                        <a
                          href="https://wa.me/919908861217"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] font-black text-green-400 hover:text-green-300 bg-[#2d2824]/90 border border-green-500/20 hover:border-green-500/50 px-3 py-1.5 rounded-full flex items-center gap-2 transition-all w-full"
                        >
                          <FaWhatsapp className="w-3 h-3 text-green-400" /> Chat on WhatsApp
                        </a>
                        <a
                          href="mailto:jsr.annamayya@gmail.com"
                          className="text-[10px] font-black text-blue-400 hover:text-blue-300 bg-[#2d2824]/90 border border-blue-500/20 hover:border-blue-500/50 px-3 py-1.5 rounded-full flex items-center gap-2 transition-all w-full"
                        >
                          <FaEnvelope className="w-3 h-3 text-blue-400" /> Send Email
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <div className="self-start flex flex-col max-w-[80%]">
                  <span className="text-[8px] font-bold text-white/30 uppercase tracking-widest mb-1 px-1">Assistant</span>
                  <div className="bg-[#25221F] p-3.5 rounded-2xl rounded-tl-none border border-white/5 flex gap-1.5 items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              )}
              <div ref={scrollRef} />
            </div>

            {/* Suggestions Chips */}
            {suggestions.length > 0 && !isTyping && (
              <div className="px-5 pb-3 flex flex-col gap-1.5 justify-start">
                <span className="text-[8px] font-black text-white/30 uppercase tracking-wider block mb-0.5">Quick Suggestions</span>
                <div className="flex flex-wrap gap-2">
                  {suggestions.map((sug, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(sug)}
                      className="text-[10px] font-bold text-secondary bg-[#2d2824]/80 border border-secondary/25 hover:border-secondary/60 hover:bg-[#2d2824] px-3 py-1.5 rounded-full transition-all text-left"
                    >
                      {sug}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Bar */}
            <div className="bg-[#25221F] border-t border-white/5 p-4 flex gap-2.5 items-center">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ask me something about JSR..."
                className="flex-1 bg-[#1E1B18] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-secondary placeholder-white/30"
              />
              <button
                onClick={() => handleSend()}
                disabled={!input.trim()}
                className="w-9 h-9 rounded-xl bg-primary hover:bg-primary/95 text-white flex items-center justify-center shadow-md disabled:opacity-30 disabled:hover:bg-primary transition-all focus:outline-none shrink-0"
              >
                <FaPaperPlane className="w-3.5 h-3.5" />
              </button>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default ChatbotWidget;
import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCommentDots, FaPaperPlane, FaTimes, FaRobot } from 'react-icons/fa';

const SUGGESTIONS = [
  "Tell me about Swachh Bharat campaigns",
  "What is the YELP climate initiative?",
  "What awards has JSR received?",
  "How to contact JSR Annamayya?"
];

const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'model', text: "Hello! I am JSR Annamayya's AI Assistant. Ask me anything about his career, projects, Swachh Bharat campaigns, or awards!" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const handleSend = async (textToSend) => {
    const msgText = textToSend || input;
    if (!msgText.trim()) return;

    // Add user message
    const userMsg = { role: 'user', text: msgText };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      // Keep only last 6 messages to prevent context overflow in payload
      const historyPayload = messages.slice(-6);

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: msgText,
          history: historyPayload
        })
      });

      const data = await response.json();
      if (data.success) {
        setMessages(prev => [...prev, { role: 'model', text: data.reply }]);
      } else {
        setMessages(prev => [...prev, { role: 'model', text: "I'm sorry, I'm having trouble connecting to my brain right now. Please try again or fill in the contact form below!" }]);
      }
    } catch (e) {
      console.error(e);
      setMessages(prev => [...prev, { role: 'model', text: "Oops! Something went wrong. Please check your internet connection and try again." }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="fixed z-50 font-sans">
      
      {/* Floating Toggle Button */}
      {/* Positioned bottom-left on mobile (bottom-28 left-6) to balance Email/LinkedIn FABs on bottom-right, and bottom-right on desktop (bottom-8 right-24) */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`fixed left-6 bottom-28 md:left-auto md:right-24 md:bottom-8 w-12 h-12 rounded-full bg-charcoal border border-[#E8A33D]/20 text-[#E8A33D] flex items-center justify-center shadow-[0_8px_30px_rgba(0,0,0,0.5)] focus:outline-none z-50 ${
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
              <button onClick={() => setIsOpen(false)} className="text-white/40 hover:text-white transition-colors">
                <FaTimes className="w-4 h-4" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4 scrollbar-thin scrollbar-thumb-white/10">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col max-w-[80%] ${msg.role === 'user' ? 'self-end text-right' : 'self-start text-left'}`}
                >
                  <span className="text-[8px] font-bold text-white/30 uppercase tracking-widest mb-1 px-1">
                    {msg.role === 'user' ? 'You' : 'Assistant'}
                  </span>
                  <div
                    className={`p-3.5 rounded-2xl text-xs font-medium leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-primary text-white rounded-tr-none'
                        : 'bg-[#25221F] text-white/95 rounded-tl-none border border-white/5'
                    }`}
                  >
                    {msg.text}
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
            {messages.length === 1 && !isTyping && (
              <div className="px-5 pb-3 flex flex-wrap gap-2 justify-start">
                {SUGGESTIONS.map((sug, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(sug)}
                    className="text-[10px] font-bold text-secondary bg-[#2d2824]/80 border border-secondary/25 hover:border-secondary/60 hover:bg-[#2d2824] px-3 py-1.5 rounded-full transition-all text-left"
                  >
                    {sug}
                  </button>
                ))}
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
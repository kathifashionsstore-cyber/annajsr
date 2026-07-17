import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { submitContactForm, getContactSettings, logAnalyticsEvent } from '../services/portfolioService';

const Contact = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  // Parallax translation for the big text
  const y = useTransform(scrollYProgress, [0, 1], ["-20%", "30%"]);

  const [adminPhone, setAdminPhone] = useState('7702012010');
  const [submittedData, setSubmittedData] = useState(null);

  useEffect(() => {
    const fetchPhone = async () => {
      try {
        const settings = await getContactSettings();
        if (settings && settings.phone) {
          // Remove spaces/special characters from phone for wa.me link
          const cleanPhone = settings.phone.replace(/[^0-9]/g, '');
          setAdminPhone(cleanPhone.startsWith('91') || cleanPhone.length > 10 ? cleanPhone : '91' + cleanPhone);
        }
      } catch (e) {
        console.warn("Failed to fetch admin phone for whatsapp contact", e);
      }
    };
    fetchPhone();
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organisation: '',
    message: '',
    phone: '', // Added optional visitor phone field
    permission: false
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', text: '' }); // type: 'success' | 'error'

  const handleInputChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: '', text: '' });
    setSubmittedData(null);

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setStatus({ type: 'error', text: 'Please fill in all required fields (Name, Email, and Message).' });
      return;
    }

    if (!formData.permission) {
      setStatus({ type: 'error', text: 'Please grant permission to contact you by ticking the checkbox.' });
      return;
    }

    setLoading(true);
    try {
      await submitContactForm({
        name: formData.name,
        email: formData.email,
        organisation: formData.organisation,
        message: formData.message,
        phone: formData.phone || ''
      });
      
      logAnalyticsEvent({
        type: 'contact_submit',
        label: formData.name
      });

      setStatus({ type: 'success', text: 'Thank you! Your message has been sent successfully.' });
      setSubmittedData({
        name: formData.name,
        email: formData.email,
        organisation: formData.organisation,
        message: formData.message
      });

      setFormData({
        name: '',
        email: '',
        organisation: '',
        message: '',
        phone: '',
        permission: false
      });
    } catch (err) {
      console.error(err);
      setStatus({ type: 'error', text: 'Oops! Failed to send your message. Please try again later.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section ref={ref} id="contact" className="bg-charcoal w-full min-h-screen relative overflow-hidden flex items-end pt-32 pb-0 md:pb-0 border-t border-[#2d2824]">
      {/* Huge Background Text */}
      <motion.div 
        style={{ y }}
        className="absolute top-0 left-0 w-full h-full flex flex-col justify-start items-center overflow-hidden pointer-events-none z-0 pt-16 md:pt-12"
      >
        <h1 
          className="text-[25vw] leading-[0.75] font-black text-white/5 uppercase tracking-tighter select-none scale-y-[1.6] origin-top"
          style={{ fontFamily: "'Impact', 'Arial Black', sans-serif" }}
        >
          Contact
        </h1>
      </motion.div>

      {/* Form Card Overlay */}
      <div className="relative z-10 w-full flex justify-end items-end">
        <div 
          data-aos="fade-up"
          className="bg-primary w-full md:w-[85%] lg:w-[75%] p-8 md:p-16 text-white flex flex-col justify-between"
        >
          <div className="text-xs font-bold tracking-[0.2em] mb-12 md:mb-16 uppercase opacity-90">
            Let's Collaborate
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-10 md:gap-14 w-full">
            <div className="flex flex-col md:flex-row gap-10 md:gap-20 w-full">
              {/* Left Column */}
              <div className="flex-1 flex flex-col gap-8">
                <div className="relative">
                  <input 
                    type="text" 
                    id="name" 
                    placeholder="Full Name" 
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full bg-transparent border-b border-white/40 pb-3 text-lg focus:outline-none focus:border-white transition-colors placeholder-white font-medium rounded-none"
                  />
                </div>
                <div className="relative">
                  <input 
                    type="email" 
                    id="email" 
                    placeholder="Email Address" 
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full bg-transparent border-b border-white/40 pb-3 text-lg focus:outline-none focus:border-white transition-colors placeholder-white font-medium rounded-none"
                  />
                </div>
                <div className="relative">
                  <input 
                    type="text" 
                    id="organisation" 
                    placeholder="Organisation / Institution" 
                    value={formData.organisation}
                    onChange={handleInputChange}
                    className="w-full bg-transparent border-b border-white/40 pb-3 text-lg focus:outline-none focus:border-white transition-colors placeholder-white font-medium rounded-none"
                  />
                </div>
                <div className="relative">
                  <input 
                    type="tel" 
                    id="phone" 
                    placeholder="Phone Number (Optional)" 
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full bg-transparent border-b border-white/40 pb-3 text-lg focus:outline-none focus:border-white transition-colors placeholder-white font-medium rounded-none"
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className="flex-1 flex flex-col">
                <div className="relative h-full flex flex-col justify-end">
                  <textarea 
                    id="message" 
                    placeholder="Type your message here..." 
                    value={formData.message}
                    onChange={handleInputChange}
                    className="w-full h-full min-h-[140px] bg-transparent border-b border-white/40 pb-3 text-lg focus:outline-none focus:border-white transition-colors placeholder-white font-medium resize-none rounded-none"
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Bottom Section */}
            <div className="flex flex-col md:flex-row gap-12 mt-4">
              {/* Left text */}
              <div className="flex-1 flex items-start gap-4 text-sm font-medium text-white/90">
                <input 
                  type="checkbox" 
                  id="permission" 
                  checked={formData.permission}
                  onChange={handleInputChange}
                  className="mt-1 w-4 h-4 rounded-sm border-white/40 bg-transparent text-white focus:ring-white focus:ring-offset-0 focus:ring-offset-transparent cursor-pointer" 
                  style={{ accentColor: "white" }}
                />
                <label htmlFor="permission" className="cursor-pointer max-w-[280px] leading-snug">
                  I give permission to contact me at this email address.
                </label>
              </div>

              {/* Right text & button */}
              <div className="flex-1 flex flex-col gap-8 text-xs text-white/70 font-medium">
                {status.text && (
                  <div className="flex flex-col gap-4">
                    <div className={`p-4 rounded-xl font-bold text-xs ${
                      status.type === 'success' ? 'bg-green-600/25 text-green-200 border border-green-500/30' : 'bg-red-600/25 text-red-200 border border-red-500/30'
                    }`}>
                      {status.text}
                    </div>
                    {status.type === 'success' && submittedData && (
                      <a
                        href={`https://wa.me/${adminPhone}?text=${encodeURIComponent(
                          `Hello JSR Annamayya,\n\nI just submitted a contact form on your website:\n\n*Name:* ${submittedData.name}\n*Email:* ${submittedData.email}\n*Organisation:* ${submittedData.organisation || 'N/A'}\n*Message:* ${submittedData.message}`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-2.5 rounded-full bg-green-600 hover:bg-green-500 text-white font-bold text-xs flex items-center justify-center gap-2 self-start shadow-md transition-all active:scale-95 border-none"
                        style={{ textDecoration: 'none' }}
                      >
                        <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.504-5.713-1.465L0 24zm6.602-4.22c1.682.998 3.486 1.527 5.398 1.528 5.485 0 9.948-4.464 9.95-9.953.001-2.659-1.034-5.159-2.916-7.042C17.209 2.43 14.71 1.393 12.007 1.393 6.525 1.393 2.06 5.857 2.057 11.34c-.001 1.917.501 3.791 1.454 5.437L2.457 21.6l4.202-1.101zM17.92 14.65c-.328-.164-1.94-.959-2.242-1.07-.301-.11-.52-.164-.739.164-.219.329-.848 1.07-1.039 1.29-.192.218-.383.245-.71.081-.328-.164-1.385-.51-2.637-1.63-1.026-.917-1.635-2.055-1.837-2.383-.203-.328-.022-.506.141-.669.147-.147.329-.383.493-.575.163-.191.218-.328.328-.547.11-.219.055-.41-.027-.574-.082-.164-.739-1.777-1.012-2.434-.267-.64-.56-.553-.767-.563-.199-.01-.427-.012-.656-.012-.23 0-.603.086-.918.427-.315.34-1.203 1.176-1.203 2.87 0 1.694 1.231 3.326 1.403 3.555.172.229 2.422 3.699 5.867 5.185.819.353 1.458.564 1.957.722.823.261 1.57.224 2.161.137.66-.099 1.94-.794 2.215-1.56.275-.767.275-1.423.192-1.56-.082-.136-.301-.218-.629-.382z"/>
                        </svg>
                        Send via WhatsApp
                      </a>
                    )}
                  </div>
                )}
                <p className="leading-relaxed max-w-[400px]">
                  This site is protected by reCAPTCHA and the Google Council principles. Privacy Policy and Terms of Service apply.
                </p>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-6">
                  <p className="max-w-[250px] leading-relaxed">
                    We usually respond to collaborations and consultations within 48 hours.
                  </p>
                  
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="px-8 py-3 rounded-full border border-white/40 text-white font-bold flex items-center justify-center gap-3 hover:bg-white hover:text-primary transition-all duration-300 group whitespace-nowrap self-start sm:self-auto disabled:opacity-50"
                  >
                    {loading ? 'Sending...' : 'Send'}
                    <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </form>

        </div>
      </div>
    </section>
  );
};

export default Contact;

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { portfolioData } from '../data/portfolioData';
import { getContactSettings } from '../services/portfolioService';

const Contact = () => {
  const [profile, setProfile] = useState(portfolioData.profile);

  useEffect(() => {
    const loadDynamicData = async () => {
      try {
        const contactSettings = await getContactSettings();
        if (contactSettings) {
          setProfile((prev) => ({
            ...prev,
            email: contactSettings.email || prev.email,
            phone: contactSettings.phone || prev.phone,
            address: contactSettings.address || prev.address,
          }));
        }
      } catch (error) {
        console.warn("Failed to load contact info dynamically", error);
      }
    };
    loadDynamicData();
  }, []);


  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    
    // Simple client side validation
    const tempErrors = {};
    if (!formData.name.trim()) tempErrors.name = 'Full name is required';
    if (!formData.email.trim()) {
      tempErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = 'Please enter a valid email';
    }
    if (!formData.message.trim()) tempErrors.message = 'Message is required';

    if (Object.keys(tempErrors).length > 0) {
      setErrors(tempErrors);
      return;
    }

    // Prefill subject and body text for direct email execution
    const mailtoSubject = encodeURIComponent(formData.subject || `Inquiry from ${formData.name}`);
    const mailtoBody = encodeURIComponent(
      `Name: ${formData.name}\n` +
      `Email: ${formData.email}\n` +
      `Phone: ${formData.phone || 'N/A'}\n\n` +
      `Message:\n${formData.message}`
    );

    // Trigger local client email editor
    window.location.href = `mailto:${profile.email}?subject=${mailtoSubject}&body=${mailtoBody}`;
  };

  return (
    <div className="bg-edi-cream min-h-screen flex flex-col justify-between overflow-x-hidden font-sans antialiased">
      <Navbar />

      <main className="flex-grow w-full">

        {/* 2. LARGE CONTACT HEADING HERO */}
        <section className="bg-edi-cream pt-32 pb-16 px-6 md:px-12 max-w-7xl mx-auto w-full relative z-10 border-b border-[#DDD7CE]/60">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full">
            
            {/* Left Column */}
            <div className="lg:col-span-7 flex flex-col gap-4 text-left">
              <div className="mb-2 text-section-label text-edi-muted">
                <Link to="/" className="hover:text-edi-black transition-colors">Home</Link> / <span className="text-edi-black font-semibold">Contact</span>
              </div>
              <span className="text-section-label text-edi-accent font-bold block">
                JSR ANNAMAYYA
              </span>
              <h1 className="font-serif font-light text-edi-heading text-inner-headline">
                CONTACT
              </h1>
              <p className="text-editorial-body text-edi-body leading-relaxed max-w-xl font-medium mt-2">
                Available for public systems advice, municipal consultations, SWM capacity workshops, and speaking invitations.
              </p>
            </div>

            {/* Right Column (Single Professional Photo) */}
            <div className="lg:col-span-5 relative select-none">
              <div className="aspect-[16/10] w-full overflow-hidden border border-[#DDD7CE] bg-edi-cream relative z-10 rounded-sm shadow-sm">
                <img
                  src={profile.images.contactHero}
                  alt={`${profile.name} Presentation`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-[#111111]/10 pointer-events-none"></div>
              </div>
            </div>

          </div>
        </section>


        {/* 3. CONTACT INFORMATION */}
        <section className="py-24 md:py-32 bg-edi-white border-b border-[#DDD7CE]/60 w-full text-left">
          <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            
            {/* Left side */}
            <div className="lg:col-span-6 flex flex-col gap-4">
              <span className="text-section-label text-edi-accent font-bold block">02 / COORDINATES</span>
              <h2 className="font-serif text-section-headline text-edi-heading mb-4">
                Channels
              </h2>
            </div>

            {/* Right side */}
            <div className="lg:col-span-6 flex flex-col border-t border-[#DDD7CE]/60 w-full font-sans text-sm md:text-base">
              
              {/* Email Row */}
              <div className="py-6 border-b border-[#DDD7CE]/60 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-edi-accent">Email Address</span>
                <a href={`mailto:${profile.email}`} className="font-serif text-xl sm:text-2xl font-semibold text-edi-heading hover:text-edi-accent transition-colors">
                  {profile.email}
                </a>
              </div>

              {/* Phone Row */}
              <div className="py-6 border-b border-[#DDD7CE]/60 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-edi-accent">Phone Contact</span>
                <a href={`tel:+91${profile.phone}`} className="font-serif text-xl sm:text-2xl font-semibold text-edi-heading hover:text-edi-accent transition-colors">
                  +91 {profile.phone}
                </a>
              </div>

              {/* Location Row */}
              <div className="py-6 border-b border-[#DDD7CE]/60 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-edi-accent">Base Location</span>
                <span className="font-serif text-xl sm:text-2xl font-semibold text-edi-heading">
                  {profile.address}
                </span>
              </div>

              {/* Social Channels Row */}
              <div className="py-6 border-b border-[#DDD7CE]/60 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-edi-accent">Social Links</span>
                <div className="flex items-center gap-6">
                  <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-edi-heading hover:text-edi-accent underline">
                    LinkedIn
                  </a>
                  <a href={profile.whatsappUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-edi-heading hover:text-edi-accent underline">
                    WhatsApp Chat
                  </a>
                </div>
              </div>

            </div>

          </div>
        </section>


        {/* 4. MINIMAL FRONTEND FORM */}
        <section className="py-24 md:py-32 bg-edi-cream w-full text-left">
          <div className="max-w-4xl mx-auto px-6 md:px-12 flex flex-col gap-12">
            <div className="flex flex-col gap-3">
              <span className="text-section-label text-edi-accent font-bold block">INQUIRY FORM</span>
              <h2 className="font-serif text-section-headline text-edi-heading leading-tight">
                Send a Message
              </h2>
            </div>

            <form onSubmit={handleFormSubmit} className="flex flex-col gap-8 w-full font-sans">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {/* Name */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="name" className="text-[10px] font-bold uppercase tracking-wider text-edi-heading">Full Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="bg-transparent border-b border-[#DDD7CE] py-3 text-sm text-edi-heading placeholder-edi-muted/50 focus:outline-none focus:border-edi-accent transition-colors"
                    placeholder="Enter your name"
                  />
                  {errors.name && <span className="text-[10px] text-red-600 font-medium">{errors.name}</span>}
                </div>

                {/* Email */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="email" className="text-[10px] font-bold uppercase tracking-wider text-edi-heading">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="bg-transparent border-b border-[#DDD7CE] py-3 text-sm text-edi-heading placeholder-edi-muted/50 focus:outline-none focus:border-edi-accent transition-colors"
                    placeholder="Enter your email address"
                  />
                  {errors.email && <span className="text-[10px] text-red-600 font-medium">{errors.email}</span>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {/* Phone */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="phone" className="text-[10px] font-bold uppercase tracking-wider text-edi-heading">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="bg-transparent border-b border-[#DDD7CE] py-3 text-sm text-edi-heading placeholder-edi-muted/50 focus:outline-none focus:border-edi-accent transition-colors"
                    placeholder="Enter your phone number (optional)"
                  />
                </div>

                {/* Subject */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="subject" className="text-[10px] font-bold uppercase tracking-wider text-edi-heading">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="bg-transparent border-b border-[#DDD7CE] py-3 text-sm text-edi-heading placeholder-edi-muted/50 focus:outline-none focus:border-edi-accent transition-colors"
                    placeholder="Enter message subject"
                  />
                </div>
              </div>

              {/* Message */}
              <div className="flex flex-col gap-2">
                <label htmlFor="message" className="text-[10px] font-bold uppercase tracking-wider text-edi-heading">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  rows="4"
                  value={formData.message}
                  onChange={handleInputChange}
                  className="bg-transparent border-b border-[#DDD7CE] py-3 text-sm text-edi-heading placeholder-edi-muted/50 focus:outline-none focus:border-edi-accent transition-colors resize-none"
                  placeholder="Enter details of your inquiry"
                ></textarea>
                {errors.message && <span className="text-[10px] text-red-600 font-medium">{errors.message}</span>}
              </div>

              {/* Note */}
              <div className="text-[11px] text-edi-muted font-medium italic mt-2">
                * Note: Submitting this form will open your local email application to send the compiled message.
              </div>

              <div className="mt-4">
                <button
                  type="submit"
                  className="px-8 py-4 bg-transparent text-edi-black border border-edi-black text-xs font-semibold uppercase tracking-[0.1em] rounded-[4px] hover:bg-edi-black hover:text-white transition-all duration-300 focus:outline-none"
                >
                  Send Message
                </button>
              </div>

            </form>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
};

export default Contact;

import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import RotatingResumeBadge from '../components/RotatingResumeBadge';
import { portfolioData } from '../data/portfolioData';

const ProfessionalProfile = () => {
  const { profile, education, strengths, caseStudies } = portfolioData;

  // Let's add short descriptions for each strength to render them as detailed rows
  const strengthsDetails = [
    { title: "Government Expertise", desc: "Collaborating with municipal commissioners, environmental engineers, and state-level ministries across Andhra Pradesh and Telangana." },
    { title: "IEC & BCC Strategy", desc: "Formulating Information, Education, and Communication frameworks to drive sustainable citizen segregation habits." },
    { title: "Solid Waste Management (SWM)", desc: "Advising municipal corporations on collection efficiency, street compliance, and national rating evaluation." },
    { title: "Urban Governance", desc: "Restructuring municipal systems coordination, worker protection policies, and garbage-free city benchmarks." },
    { title: "Climate & Sustainability Programs", desc: "Directing public biodiversity panels, environmental workshops, and state advocacy programs." },
    { title: "Stakeholder Engagement", desc: "Bridging institutional objectives with community leadership, CSR partners, and resident welfare groups." },
    { title: "Capacity Building", desc: "Conducting intensive public sector training courses for health staff, volunteers, and officers." },
    { title: "Citizen Mobilisation", desc: "Designing mass citizen drives, cloth bag vending systems, and neighborhood sanitation campaigns." },
    { title: "CSR & Institutional Partnerships", desc: "Aligning private CSR funding with municipal health, menstrual hygiene, and solid waste programs." },
    { title: "Training & Public Speaking", desc: "Presenting policy lessons at BITS Pilani, IIT Indore, and national circular economy summits." }
  ];

  return (
    <div className="bg-edi-cream min-h-screen flex flex-col justify-between overflow-x-hidden font-sans antialiased">
      <Navbar />

      <main className="flex-grow w-full">

        {/* PAGE SECTION 1 — INNER HERO */}
        <section className="bg-edi-cream pt-32 pb-20 px-6 md:px-12 max-w-7xl mx-auto w-full relative z-10 border-b border-edi-border/60">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full">
            
            {/* Left Title block (60% width) */}
            <div className="lg:col-span-7 flex flex-col gap-4 text-left">
              {/* Breadcrumb */}
              <div className="mb-2 text-section-label text-edi-muted">
                <Link to="/" className="hover:text-edi-black transition-colors">Home</Link> / <span className="text-edi-black font-semibold">Professional Profile</span>
              </div>
              <span className="text-section-label text-edi-accent font-bold block">
                {profile.name}
              </span>
              <h1 className="font-serif font-light text-edi-heading text-inner-headline">
                Professional Profile
              </h1>
            </div>

            {/* Right Image (40% width) */}
            <div className="lg:col-span-5 relative select-none">
              <div className="absolute top-4 -left-4 w-full h-full bg-edi-beige/40 rounded-sm z-0"></div>
              <div className="absolute -bottom-6 -right-6 w-36 h-36 rounded-full border border-edi-accent/30 pointer-events-none z-0"></div>
              <div className="aspect-[16/10] w-full overflow-hidden border border-edi-border bg-edi-cream relative z-10 rounded-sm shadow-sm">
                <img
                  src={profile.images.aboutStack}
                  alt={`${profile.name} Presentation`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-edi-black/10 pointer-events-none"></div>
              </div>
            </div>

          </div>
        </section>


        {/* PAGE SECTION 2 — PROFILE IMAGE WITH FULL BIOGRAPHY */}
        <section className="py-24 md:py-32 bg-edi-white border-b border-edi-border/60 w-full">
          <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            
            {/* Left large portrait (40% width) */}
            <div className="lg:col-span-5 relative select-none">
              <div className="aspect-[4/5] w-full overflow-hidden border border-edi-border bg-edi-cream relative z-10 rounded-sm shadow-md">
                <img
                  src={profile.images.profileAlt}
                  alt={profile.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-edi-black/10 pointer-events-none"></div>
              </div>
            </div>

            {/* Right full bio (60% width) */}
            <div className="lg:col-span-7 flex flex-col gap-6 text-left font-sans">
              <h2 className="font-serif text-section-headline text-edi-heading">
                {profile.name}
              </h2>
              <span className="text-section-label text-edi-accent font-bold block">
                {profile.role}
              </span>
              
              <div className="flex flex-col gap-6 text-edi-body font-sans font-medium mt-4">
                <p className="font-serif text-2xl sm:text-3xl italic text-edi-heading leading-relaxed font-light">
                  "{profile.bio.intro}"
                </p>
                <p className="text-editorial-body">{profile.bio.bio1}</p>
                <p className="text-editorial-body">{profile.bio.bio2}</p>
                <p className="text-editorial-body">{profile.bio.bio3}</p>
              </div>

              {/* Two key strengths snippet */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-t border-edi-border/60 pt-6 mt-4">
                <div>
                  <h4 className="text-section-label text-edi-heading font-bold mb-2">01 / PUBLIC SECTOR ADVOCACY</h4>
                  <p className="text-xs text-edi-body font-medium leading-relaxed">
                    Developing large-scale Information, Education and Communication (IEC) strategies across state-level departments and municipal authorities.
                  </p>
                </div>
                <div>
                  <h4 className="text-section-label text-edi-heading font-bold mb-2">02 / CAMPAIGN LOGISTICS</h4>
                  <p className="text-xs text-edi-body font-medium leading-relaxed">
                    Executing waste segregation models, citizen mobilization, SWM surveys, and capacity training for health workers.
                  </p>
                </div>
              </div>

              {/* Social Link Indicators */}
              <div className="flex items-center gap-6 mt-6 border-t border-edi-border/60 pt-6 w-full">
                <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-xs uppercase tracking-wider font-extrabold text-edi-accent hover:text-edi-accent-dark underline">
                  LinkedIn Profile
                </a>
                <a href={profile.whatsappUrl} target="_blank" rel="noopener noreferrer" className="text-xs uppercase tracking-wider font-extrabold text-edi-accent hover:text-edi-accent-dark underline">
                  WhatsApp Chat
                </a>
              </div>
            </div>

          </div>
        </section>


        {/* PAGE SECTION 3 — CORE STRENGTHS */}
        <section className="py-24 md:py-32 bg-edi-cream border-b border-edi-border/60 w-full">
          <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            
            <div className="lg:col-span-4 flex flex-col gap-4">
              <span className="text-section-label text-edi-accent font-bold block">
                02 / CORE CAPABILITIES
              </span>
              <h2 className="font-serif text-section-headline text-edi-heading">
                Core Strengths
              </h2>
            </div>

            <div className="lg:col-span-8 flex flex-col border-t border-edi-border/60 w-full font-sans">
              {strengthsDetails.map((item, idx) => (
                <div 
                  key={idx}
                  className="py-6 border-b border-edi-border/60 grid grid-cols-1 sm:grid-cols-12 gap-4 items-baseline"
                >
                  <div className="sm:col-span-2 text-lg font-serif italic text-edi-accent font-bold">
                    {String(idx + 1).padStart(2, '0')}
                  </div>
                  <div className="sm:col-span-10 flex flex-col gap-1 text-left">
                    <h3 className="font-serif text-card-headline text-edi-heading">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-edi-body leading-relaxed mt-1 font-medium">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>


        {/* PAGE SECTION 4 — PERSONAL PHILOSOPHY */}
        <section className="py-24 md:py-32 bg-edi-black text-edi-cream border-b border-edi-border/10 w-full">
          <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            
            {/* Left text */}
            <div className="lg:col-span-7 flex flex-col gap-6 text-left">
              <span className="text-section-label text-edi-accent font-bold block">
                MISSION STATEMENT
              </span>
              <p className="font-serif text-section-headline italic leading-relaxed text-white font-light">
                "Sustainable public systems are not built merely by policy, but by changing grassroots human habits at scale."
              </p>
              <div className="flex flex-col gap-4 text-xs sm:text-sm text-edi-cream/65 leading-relaxed font-sans font-medium mt-4 max-w-xl">
                <p className="text-editorial-body">
                  JSR Annamayya's career focus has been to design communication bridges between government municipal administration layers and the community citizen bodies, ensuring that waste segregation compliance shifts from arbitrary targets to institutionalized routines.
                </p>
                <p className="text-editorial-body">
                  By integrating solar bag vending systems, chatbot logs, and student education program metrics, he has proven that public environmental sustainability is a designable outcome.
                </p>
              </div>
            </div>

            {/* Right image */}
            <div className="lg:col-span-5 select-none relative">
              <div className="aspect-[4/3] w-full overflow-hidden border border-edi-border/20 bg-edi-cream relative rounded-none shadow-sm">
                <img
                  src={profile.images.heroPortrait}
                  alt={`${profile.name} Philosophy Portrait`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-edi-black/20 pointer-events-none"></div>
              </div>
            </div>

          </div>
        </section>


        {/* PAGE SECTION 5 — EDUCATION */}
        <section className="py-24 md:py-32 bg-edi-white border-b border-edi-border/60 w-full">
          <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            
            <div className="lg:col-span-4">
              <span className="text-section-label text-edi-accent font-bold block">
                03 / CREDENTIALS
              </span>
              <h2 className="font-serif text-section-headline text-edi-heading">
                Education
              </h2>
            </div>

            <div className="lg:col-span-8 flex flex-col border-l border-edi-border/60 ml-2 pl-6 sm:pl-8 py-2 gap-8 font-sans text-left">
              {education.map((edu, idx) => (
                <div key={idx} className="relative">
                  
                  {/* Timeline bullet dot */}
                  <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-3.5 h-3.5 bg-edi-white border border-edi-accent rounded-full"></div>

                  <div className="flex flex-col gap-2">
                    <span className="text-[10px] font-mono tracking-widest text-edi-accent font-bold uppercase">{edu.dateRange}</span>
                    <h3 className="font-serif text-card-headline text-edi-heading leading-tight">
                      {edu.degree}
                    </h3>
                    <h4 className="text-xs uppercase tracking-wider text-edi-accent-dark font-extrabold">
                      {edu.institution}
                    </h4>
                    <p className="text-xs text-edi-muted uppercase tracking-wider font-semibold">
                      {edu.location}
                    </p>
                    <p className="text-editorial-body text-edi-body leading-relaxed mt-2 max-w-2xl font-medium">
                      {edu.details}
                    </p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>


        {/* PAGE SECTION 6 — ONGOING DEVELOPMENT */}
        <section className="py-24 md:py-32 bg-edi-cream border-b border-edi-border/60 w-full">
          <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            
            <div className="lg:col-span-4">
              <span className="text-section-label text-edi-accent font-bold block">
                04 / DEVELOPMENT
              </span>
              <h2 className="font-serif text-section-headline text-edi-heading">
                Ongoing Development
              </h2>
              <p className="text-editorial-body text-edi-body leading-relaxed font-sans mt-4 max-w-xs font-medium">
                National presentation panels, capacity-building workshops, and public sector advisory forums.
              </p>
            </div>

            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-8 font-sans text-left">
              <div className="bg-edi-white p-6 border border-edi-border flex flex-col gap-3">
                <span className="text-[9px] text-edi-accent font-mono font-bold tracking-widest uppercase block">CONFERENCE PRESENTATION</span>
                <h4 className="font-serif text-xl font-bold text-edi-heading">India Circular Economy Forum</h4>
                <p className="text-xs text-edi-body leading-relaxed font-medium">
                  Shared critical municipal solid waste management (SWM) implementation outcomes at the circular economy summit in New Delhi (2024).
                </p>
              </div>
              <div className="bg-edi-white p-6 border border-edi-border flex flex-col gap-3">
                <span className="text-[9px] text-edi-accent font-mono font-bold tracking-widest uppercase block">INVITED LECTURES</span>
                <h4 className="font-serif text-xl font-bold text-edi-heading">Collegiate Outreach Keynotes</h4>
                <p className="text-xs text-edi-body leading-relaxed font-medium">
                  Delivered guest technical presentations on design thinking and environmental SWM frameworks at BITS Pilani, IIT Indore, and Osmania University.
                </p>
              </div>
            </div>

          </div>
        </section>


        {/* PAGE SECTION 7 — FUTURE OUTLOOK */}
        <section className="py-0 bg-edi-white w-full border-b border-edi-border/60 relative select-none">
          <div className="aspect-[21/9] w-full overflow-hidden relative">
            <img
              src={caseStudies[1].image}
              alt="Community Environmental Campaign"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-edi-black/25"></div>
          </div>
          
          {/* Overlapping Content Box */}
          <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 -mt-24 pb-24 text-left">
            <div className="bg-edi-cream border border-edi-border p-8 md:p-12 rounded-none max-w-2xl shadow-lg font-sans">
              <span className="text-[10px] font-mono tracking-widest text-edi-accent font-bold uppercase block mb-3">05 / FUTURE OUTLOOK</span>
              <h3 className="font-serif text-card-headline text-edi-heading mb-4">Focus Areas & Objectives</h3>
              <p className="text-xs sm:text-sm text-edi-body leading-relaxed font-medium mb-6">
                Directing youth-led sustainable networks, expanding solar bag vending deployments to reduce plastic load, and integrating data systems to coordinate sanitation worker compliance records.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-edi-border/60 pt-6">
                <div>
                  <h5 className="text-[9px] font-extrabold text-edi-accent uppercase tracking-wider mb-1">01 / YOUTH ADVOCACY</h5>
                  <p className="text-[10px] text-edi-muted leading-relaxed font-medium">Empowering state student networks as climate champions.</p>
                </div>
                <div>
                  <h5 className="text-[9px] font-extrabold text-edi-accent uppercase tracking-wider mb-1">02 / WASTE TRACKING</h5>
                  <p className="text-[10px] text-edi-muted leading-relaxed font-medium">Standardizing municipal doorstep collection metrics.</p>
                </div>
                <div>
                  <h5 className="text-[9px] font-extrabold text-edi-accent uppercase tracking-wider mb-1">03 / POLICY DESIGNS</h5>
                  <p className="text-[10px] text-edi-muted leading-relaxed font-medium">Publishing eco product advocacy guidelines.</p>
                </div>
              </div>
            </div>
          </div>
        </section>


        {/* PAGE SECTION 8 — CV CTA */}
        <section className="py-24 bg-edi-black text-edi-cream text-center w-full">
          <div className="max-w-3xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12 px-6">
            <div className="text-left max-w-md">
              <span className="text-section-label text-edi-accent font-bold block mb-2">DOWNLOAD DETAILS</span>
              <h3 className="font-serif text-section-headline font-light text-white tracking-tight mb-4">
                Curriculum Vitae
              </h3>
              <p className="text-xs sm:text-sm text-edi-cream/65 leading-relaxed font-sans font-medium">
                Get the complete professional details of JSR Annamayya covering all public awards, guest presentations, and municipal governance details.
              </p>
            </div>
            
            <div className="relative flex justify-center items-center shrink-0">
              <RotatingResumeBadge />
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
};

export default ProfessionalProfile;

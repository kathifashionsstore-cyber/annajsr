import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import TestimonialsSection from '../components/TestimonialsSection';
import { portfolioData } from '../data/portfolioData';
import { getHeroContent, getAboutContent, getDevelopment } from '../services/portfolioService';

const ProfessionalProfile = () => {
  const [profile, setProfile] = useState(portfolioData.profile);
  const { education, caseStudies } = portfolioData;
  const [development, setDevelopment] = useState(portfolioData.development);
  const [aboutData, setAboutData] = useState({
    philosophyStatement: "Sustainable public systems are not built merely by policy, but by changing grassroots human habits at scale.",
    philosophyParagraph1: "JSR Annamayya believes that behavioral alignment is the most cost-effective municipal infrastructure. Rather than relying solely on policing or enforcement, municipal campaigns succeed when they remove friction at the exact point of the habit.",
    philosophyParagraph2: "By creating Solar Bag Vending networks (Any Time Bag) and citizen communication models in Rajamahendravaram and Nellore, he has built the structural templates that turn compliance targets into organic public movements.",
    philosophyImageUrl: "",
    futureOutlookParagraph1: "Expanding youth-led sustainable networks across Telangana and Andhra Pradesh, with a target of training 100,000 community stewards by 2027.",
    futureOutlookParagraph2: "Deploying smart doorstep waste-segregation tracking tools in municipal wards to digitize worker routes, optimize fuel usage, and provide real-time collection metrics for municipal administrators."
  });

  useEffect(() => {
    const loadDynamicData = async () => {
      try {
        const heroData = await getHeroContent();
        const dbAbout = await getAboutContent();
        const devList = await getDevelopment();

        setProfile((prev) => ({
          ...prev,
          designation: heroData.title || prev.designation,
          images: {
            ...prev.images,
            heroPortrait: heroData.imageUrl || prev.images.heroPortrait,
            profileAlt: dbAbout.imageUrl || prev.images.profileAlt,
          },
          bio: {
            ...prev.bio,
            intro: dbAbout.intro || prev.bio.intro,
            bio1: heroData.introText || prev.bio.bio1,
            bio2: dbAbout.eduBio || prev.bio.bio2,
            bio3: dbAbout.corporateBio || prev.bio.bio3,
          },
          strengths: dbAbout.strengths || prev.strengths,
        }));

        if (dbAbout) {
          setAboutData({
            philosophyStatement: dbAbout.philosophyStatement || "Sustainable public systems are not built merely by policy, but by changing grassroots human habits at scale.",
            philosophyParagraph1: dbAbout.philosophyParagraph1 || "JSR Annamayya believes that behavioral alignment is the most cost-effective municipal infrastructure. Rather than relying solely on policing or enforcement, municipal campaigns succeed when they remove friction at the exact point of the habit.",
            philosophyParagraph2: dbAbout.philosophyParagraph2 || "By creating Solar Bag Vending networks (Any Time Bag) and citizen communication models in Rajamahendravaram and Nellore, he has built the structural templates that turn compliance targets into organic public movements.",
            philosophyImageUrl: dbAbout.philosophyImageUrl || "",
            futureOutlookParagraph1: dbAbout.futureOutlookParagraph1 || "Expanding youth-led sustainable networks across Telangana and Andhra Pradesh, with a target of training 100,000 community stewards by 2027.",
            futureOutlookParagraph2: dbAbout.futureOutlookParagraph2 || "Deploying smart doorstep waste-segregation tracking tools in municipal wards to digitize worker routes, optimize fuel usage, and provide real-time collection metrics for municipal administrators."
          });
        }

        if (devList && devList.length > 0) {
          setDevelopment(devList.map(d => ({
            id: d.id,
            year: d.year,
            program: d.program,
            institution: d.institution,
            description: d.description
          })).sort((a, b) => b.order - a.order));
        }
      } catch (error) {
        console.warn("Failed to load profile page dynamic data", error);
      }
    };
    loadDynamicData();
  }, []);


  // 10 Key Strengths
  const strengths = [
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

        {/* 2. INNER-PAGE HERO */}
        <section className="bg-edi-cream pt-32 pb-20 px-6 md:px-12 max-w-7xl mx-auto w-full relative z-10 border-b border-[#DDD7CE]/60">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full">
            
            {/* Left Content (55% width / 7 cols) */}
            <div className="lg:col-span-7 flex flex-col gap-4 text-left">
              {/* Breadcrumb */}
              <div className="mb-2 text-section-label text-edi-muted">
                <Link to="/" className="hover:text-edi-black transition-colors">Home</Link> / <span className="text-edi-black font-semibold">Professional Profile</span>
              </div>
              <span className="text-section-label text-edi-accent font-bold block">
                JSR ANNAMAYYA
              </span>
              <h1 className="font-serif font-light text-edi-heading text-inner-headline">
                PROFESSIONAL PROFILE
              </h1>
            </div>

            {/* Right Image (45% width / 5 cols) */}
            <div className="lg:col-span-5 relative select-none">
              {/* Beige Shape */}
              <div className="absolute top-4 -left-4 w-full h-full bg-[#D8CBBB]/40 rounded-sm z-0"></div>
              {/* Thin Outlined Circle */}
              <div className="absolute -bottom-6 -right-6 w-36 h-36 rounded-full border border-[#A98760]/30 pointer-events-none z-0"></div>
              {/* Small Decorative Line */}
              <div className="absolute top-1/4 -right-8 w-12 h-[1px] bg-[#DDD7CE] pointer-events-none z-0"></div>
              
              <div className="aspect-[16/10] w-full overflow-hidden border border-[#DDD7CE] bg-edi-cream relative z-10 rounded-sm shadow-sm">
                <img
                  src={profile.images.aboutStack}
                  alt={`${profile.name} Presentation`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-[#111111]/10 pointer-events-none"></div>
              </div>
            </div>

          </div>
        </section>


        {/* 3. PROFESSIONAL BIOGRAPHY */}
        <section className="py-24 md:py-32 bg-edi-white border-b border-[#DDD7CE]/60 w-full">
          <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            
            {/* Left Portrait */}
            <div className="lg:col-span-5 relative select-none">
              <div className="aspect-[4/5] w-full overflow-hidden border border-[#DDD7CE] bg-edi-cream relative z-10 rounded-sm shadow-md">
                <img
                  src={profile.images.profileAlt}
                  alt={profile.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-[#111111]/10 pointer-events-none"></div>
              </div>
            </div>

            {/* Right profile details */}
            <div className="lg:col-span-7 flex flex-col gap-6 text-left font-sans">
              <h2 className="font-serif text-section-headline text-edi-heading">
                {profile.name}
              </h2>
              <span className="text-section-label text-edi-accent font-bold block">
                PROFESSIONAL PROFILE
              </span>
              
              <div className="flex flex-col gap-6 text-edi-body font-sans font-medium mt-4">
                <p className="font-serif text-2xl sm:text-3xl italic text-edi-heading leading-relaxed font-light">
                  "{profile.bio.intro}"
                </p>
                <p className="text-editorial-body">{profile.bio.bio1}</p>
                <p className="text-editorial-body">{profile.bio.bio2}</p>
                <p className="text-editorial-body">{profile.bio.bio3}</p>
              </div>

              {/* Strengths */}
              <div className="border-t border-[#DDD7CE]/60 pt-6 mt-4 w-full">
                <h4 className="text-section-label text-edi-heading font-bold mb-4">Core Strengths</h4>
                <div className="flex flex-wrap gap-2.5">
                  {profile.strengths.map((str, idx) => (
                    <span key={idx} className="px-3.5 py-1.5 bg-[#F8F6F1] border border-[#DDD7CE] text-[#806346] font-bold text-[10px] uppercase tracking-wider">
                      {str}
                    </span>
                  ))}
                </div>
              </div>

              {/* Social Links */}
              <div className="flex items-center gap-6 mt-6 border-t border-[#DDD7CE]/60 pt-6 w-full">
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


        {/* 4. PERSONAL PHILOSOPHY */}
        <section className="py-24 md:py-32 bg-edi-cream border-b border-[#DDD7CE]/60 w-full">
          <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            
            {/* Left Column */}
            <div className="lg:col-span-7 flex flex-col gap-6 text-left">
              <span className="text-section-label text-edi-accent font-bold block">
                PERSONAL PHILOSOPHY
              </span>
              <h2 className="font-serif text-section-headline text-edi-heading">
                Operational Philosophy
              </h2>
              <p className="font-serif text-2xl sm:text-3xl italic text-[#806346] leading-relaxed font-light mt-2">
                {aboutData.philosophyStatement}
              </p>
              <div className="flex flex-col gap-4 text-editorial-body text-edi-body font-sans font-medium mt-4">
                <p>{aboutData.philosophyParagraph1}</p>
                {aboutData.philosophyParagraph2 && <p>{aboutData.philosophyParagraph2}</p>}
              </div>
            </div>

            {/* Right Column Image */}
            <div className="lg:col-span-5 select-none relative">
              <div className="aspect-[4/3] w-full overflow-hidden border border-[#DDD7CE] bg-[#F8F6F1] relative rounded-none shadow-sm">
                <img
                  src={aboutData.philosophyImageUrl || profile.images.heroPortrait}
                  alt={`${profile.name} Philosophy portrait`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-[#111111]/15 pointer-events-none"></div>
              </div>
            </div>

          </div>
        </section>


        {/* 5. ONGOING DEVELOPMENT */}
        <section className="py-24 md:py-32 bg-edi-white border-b border-[#DDD7CE]/60 w-full text-left">
          <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            
            <div className="lg:col-span-4 flex flex-col gap-4">
              <span className="text-section-label text-edi-accent font-bold block">
                04 / DEVELOPMENT
              </span>
              <h2 className="font-serif text-section-headline text-edi-heading">
                Ongoing Development
              </h2>
              <p className="text-editorial-body text-edi-body font-sans mt-2 max-w-xs font-medium">
                National panels, capacity-building workshops, and academic keynote presentations.
              </p>
            </div>

            <div className="lg:col-span-8 flex flex-col gap-6 font-sans">
              {development.map((item, idx) => (
                <div key={item.id || idx} className="py-6 border-b border-[#DDD7CE]/60 flex flex-col gap-2">
                  <span className="text-[10px] font-mono tracking-widest text-edi-accent font-bold uppercase">{item.year} &mdash; {item.institution}</span>
                  <h4 className="font-serif text-card-headline text-edi-heading">{item.program}</h4>
                  <p className="text-xs sm:text-sm text-edi-body font-medium leading-relaxed mt-1">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>

          </div>
        </section>


        {/* 6. FUTURE OUTLOOK */}
        <section className="py-24 md:py-32 bg-[#F8F6F1] border-b border-[#DDD7CE]/60 w-full text-left">
          <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            
            {/* Left large heading */}
            <div className="lg:col-span-5 flex flex-col gap-3">
              <span className="text-section-label text-edi-accent font-bold block">05 / OUTLOOK</span>
              <h2 className="font-serif text-section-headline text-edi-heading font-light leading-tight">
                Future Outlook
              </h2>
            </div>

            {/* Right text paragraphs */}
            <div className="lg:col-span-7 flex flex-col gap-6 text-editorial-body text-edi-body font-sans font-medium">
              <p>{aboutData.futureOutlookParagraph1}</p>
              {aboutData.futureOutlookParagraph2 && <p>{aboutData.futureOutlookParagraph2}</p>}
            </div>


          </div>
        </section>


        {/* 7. TESTIMONIALS & RECOGNITION (Reusable Component) */}
        <TestimonialsSection />

      </main>

      <Footer />
    </div>
  );
};

export default ProfessionalProfile;

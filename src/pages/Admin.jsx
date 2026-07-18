import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, NavLink } from 'react-router-dom';
import { 
  getHeroContent, updateHeroContent,
  getHeroSlides, saveHeroSlide, deleteHeroSlide,
  getAboutContent, updateAboutContent,
  getTimelineStops, saveTimelineStop, deleteTimelineStop,
  getStats, saveStat, deleteStat,
  getAwards, saveAward, deleteAward,
  getGalleryImages, saveGalleryImage, deleteGalleryImage,
  getContactMessages, deleteContactMessage,
  getTalks, updateTalks,
  getContactSettings, updateContactSettings,
  getTestimonials, saveTestimonial, deleteTestimonial,
  getPressCoverage, savePressItem, deletePressItem,
  getServices, saveService, deleteService,
  getDepartments, saveDepartment, deleteDepartment,
  getCaseStudies, saveCaseStudy, deleteCaseStudy,
  getHighlights, saveHighlight, deleteHighlight,
  getInnovations, saveInnovation, deleteInnovation,
  getAnalyticsSummary, getRecentActivities, getSystemLogs,
  logSystemActivity,
  getChatbotKB, addChatbotKBEntry, updateChatbotKBEntry, deleteChatbotKBEntry,
  getVisionBlocks, saveVisionBlock, deleteVisionBlock,
  getSkills, saveSkill, deleteSkill,
  getDevelopment, saveDevelopment, deleteDevelopment
} from '../services/portfolioService';
import { uploadToImgBB, validateVideoFile, compressVideo } from '../utils/compressor';
import { 
  FaLock, FaSave, FaPlus, FaTrash, FaEdit, 
  FaSignOutAlt, FaImage, FaVideo, FaAward, FaHistory, 
  FaInfoCircle, FaTrophy, FaChevronRight, FaEnvelope, FaCog,
  FaQuoteLeft, FaNewspaper, FaFilePdf, FaChartBar, FaUserCheck,
  FaMobileAlt, FaDesktop, FaTabletAlt, FaGlobe, FaVolumeMute, FaVolumeUp,
  FaCommentDots, FaBuilding, FaBookOpen, FaStar, FaLightbulb, FaBars, FaTimes, FaFlask,
  FaRobot
} from 'react-icons/fa';
import { auth, storage, db } from '../firebase';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';

const AdminSaveButton = ({ loading, label = "Save", onClick, className = "" }) => {
  return (
    <button
      type="submit"
      disabled={loading}
      onClick={onClick}
      className={`px-6 py-2 rounded-full bg-primary hover:bg-primary/95 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {loading ? (
        <>
          <svg className="animate-spin h-3.5 w-3.5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Saving...</span>
        </>
      ) : (
        <>
          <FaSave className="w-3.5 h-3.5" />
          <span>{label}</span>
        </>
      )}
    </button>
  );
};

const Admin = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const location = useLocation();
  const tabsConfig = [
    { id: 'dashboard', path: 'dashboard', label: 'Dashboard', icon: <FaChartBar /> },
    { id: 'hero', path: 'hero-slides', label: 'Hero Slides', icon: <FaInfoCircle /> },
    { id: 'about', path: 'about-strengths', label: 'About & Strengths', icon: <FaAward /> },
    { id: 'vision', path: 'vision', label: 'Vision & Leadership', icon: <FaLightbulb /> },
    { id: 'skills', path: 'skills', label: 'Skills Graphs', icon: <FaChartBar /> },
    { id: 'development', path: 'development', label: 'Ongoing Development', icon: <FaAward /> },
    { id: 'services', path: 'services', label: 'Services Offered', icon: <FaLightbulb /> },
    { id: 'innovations', path: 'innovations-tech', label: 'Innovations & Tech', icon: <FaFlask /> },
    { id: 'departments', path: 'collaborations', label: 'Collaborations', icon: <FaBuilding /> },
    { id: 'timeline', path: 'career-journey', label: 'Career Journey', icon: <FaHistory /> },
    { id: 'caseStudies', path: 'case-studies', label: 'Case Studies', icon: <FaBookOpen /> },
    { id: 'highlights', path: 'career-highlights', label: 'Career Highlights', icon: <FaStar /> },
    { id: 'testimonials', path: 'testimonials', label: 'Testimonials', icon: <FaQuoteLeft /> },
    { id: 'press', path: 'press-coverage', label: 'Press Coverage', icon: <FaNewspaper /> },
    { id: 'awards', path: 'impact-awards', label: 'Impact & Awards', icon: <FaTrophy /> },
    { id: 'gallery', path: 'photo-gallery', label: 'Photo Gallery', icon: <FaImage /> },
    { id: 'chatbot', path: 'chatbot', label: 'Chatbot FAQ', icon: <FaRobot /> },
    { id: 'settings', path: 'general-footer', label: 'General / Footer', icon: <FaCog /> },
    { id: 'messages', path: 'messages', label: 'Contact Messages', icon: <FaEnvelope /> }
  ];

  const currentSubPath = location.pathname.replace(/^\/admin\/?/, '');
  const matchingTab = tabsConfig.find(t => t.path === currentSubPath) || tabsConfig[0];
  const activeTab = matchingTab.id;

  useEffect(() => {
    if (isAuthenticated && (location.pathname === '/admin' || location.pathname === '/admin/')) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [location.pathname, isAuthenticated, navigate]);

  const [loading, setLoading] = useState(false);
  
  // Mobile & Image Preview States
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [adminToast, setAdminToast] = useState(null); // { text, isError }

  const showAdminToast = (text, isError = false) => {
    setAdminToast({ text, isError });
    setTimeout(() => {
      setAdminToast(null);
    }, 3000);
  };

  const handleLocalPreview = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (imagePreviewUrl) {
      URL.revokeObjectURL(imagePreviewUrl);
    }
    const preview = URL.createObjectURL(file);
    setImagePreviewUrl(preview);
  };

  const clearPreview = () => {
    if (imagePreviewUrl) {
      URL.revokeObjectURL(imagePreviewUrl);
      setImagePreviewUrl(null);
    }
  };

  // Section States
  const [heroData, setHeroData] = useState({ title: '', subtitle: '', introText: '' });
  const [heroSlides, setHeroSlides] = useState([]);
  const [aboutData, setAboutData] = useState({ 
    bio1: '', bio2: '', bio3: '', strengths: [], image: '',
    philosophyStatement: '', philosophyParagraph1: '', philosophyParagraph2: '', philosophyImageUrl: '',
    futureOutlookParagraph1: '', futureOutlookParagraph2: ''
  });
  const [newStrength, setNewStrength] = useState('');
  const [timeline, setTimeline] = useState([]);
  const [services, setServices] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [caseStudies, setCaseStudies] = useState([]);
  const [highlights, setHighlights] = useState([]);
  const [stats, setStats] = useState([]);
  const [awards, setAwards] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [innovations, setInnovations] = useState([]);
  const [chatbotKB, setChatbotKB] = useState([]);
  const [vision, setVision] = useState([]);
  const [skills, setSkills] = useState([]);
  const [development, setDevelopment] = useState([]);

  // Dynamic content extensions
  const [talks, setTalks] = useState([]);
  const [newTalk, setNewTalk] = useState('');
  const [contactSettings, setContactSettings] = useState({ email: '', phone: '', address: '', experienceYears: '', specialties: [] });
  const [newSpecialty, setNewSpecialty] = useState('');
  const [messages, setMessages] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [pressCoverage, setPressCoverage] = useState([]);
  const [resumeUrl, setResumeUrl] = useState('');
  const [analyticsSummary, setAnalyticsSummary] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [systemLogsList, setSystemLogsList] = useState([]);

  // Form States (for adding/editing)
  const [editingItem, setEditingItem] = useState(null); // { type, data }
  const [uploadProgress, setUploadProgress] = useState('');
  const [compressingVideo, setCompressingVideo] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [videoStatusText, setVideoStatusText] = useState('Compressing Video...');
  const [videoSubText, setVideoSubText] = useState('Re-encoding video frames client-side to target under 500KB.');

  // Listen to Firebase Auth state change on mount
  useEffect(() => {
    // Add noindex meta tag to prevent search indexing of admin pages
    let metaTag = document.querySelector('meta[name="robots"]');
    if (!metaTag) {
      metaTag = document.createElement('meta');
      metaTag.name = 'robots';
      document.head.appendChild(metaTag);
    }
    metaTag.content = 'noindex, nofollow';

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
        loadAllData();
      } else {
        setIsAuthenticated(false);
      }
    });

    return () => {
      unsubscribe();
      if (metaTag) {
        metaTag.remove();
      }
    };
  }, []);

  // Cleanup preview URL on edit item changes
  useEffect(() => {
    if (!editingItem && imagePreviewUrl) {
      clearPreview();
    }
  }, [editingItem]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
    };
  }, [imagePreviewUrl]);

  const [unreadCount, setUnreadCount] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Real-time Contacts Listener for Admin Notifications
  useEffect(() => {
    if (!isAuthenticated) return;

    const q = query(collection(db, 'contacts'), orderBy('createdAt', 'desc'));
    let isFirstLoad = true;

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const messagesList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setMessages(messagesList);

        if (snapshot.metadata.hasPendingWrites) return;

        if (!isFirstLoad) {
          snapshot.docChanges().forEach((change) => {
            if (change.type === 'added') {
              const newMsg = change.doc.data();
              setToastMessage(newMsg);
              setShowToast(true);
              setUnreadCount(prev => prev + 1);

              // Play notification sound
              try {
                const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-600.wav');
                audio.volume = 0.4;
                audio.play().catch(() => {});
              } catch (soundErr) {
                console.log("Audio notification blocked or failed", soundErr);
              }

              // Auto-dismiss toast
              setTimeout(() => {
                setShowToast(false);
              }, 6000);
            }
          });
        } else {
          isFirstLoad = false;
        }
      },
      (error) => {
        console.warn("Firestore real-time listener connection dropped or access denied:", error);
      }
    );

    return () => unsubscribe();
  }, [isAuthenticated]);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const h = await getHeroContent();
      const hs = await getHeroSlides();
      const a = await getAboutContent();
      const t = await getTimelineStops();
      const svs = await getServices();
      const dpts = await getDepartments();
      const css = await getCaseStudies();
      const hls = await getHighlights();
      const s = await getStats();
      const aw = await getAwards();
      const g = await getGalleryImages();
      const inn = await getInnovations();
      const tk = await getTalks();
      const cs = await getContactSettings();
      const ms = await getContactMessages();
      const ts = await getTestimonials();
      const pc = await getPressCoverage();
      const cb = await getChatbotKB();
      const summary = await getAnalyticsSummary();
      const recent = await getRecentActivities();
      const logs = await getSystemLogs();
      const vis = await getVisionBlocks();
      const sk = await getSkills();
      const dev = await getDevelopment();

      setHeroData(h);
      setHeroSlides(hs);
      setAboutData(a);
      setTimeline(t);
      setServices(svs);
      setDepartments(dpts);
      setCaseStudies(css);
      setHighlights(hls);
      setStats(s);
      setAwards(aw);
      setGallery(g);
      setInnovations(inn);
      setTalks(tk);
      setContactSettings(cs);
      setMessages(ms);
      setTestimonials(ts);
      setPressCoverage(pc);
      setChatbotKB(cb || []);
      setAnalyticsSummary(summary || []);
      setRecentActivities(recent || []);
      setSystemLogsList(logs || []);
      setVision(vis || []);
      setSkills(sk || []);
      setDevelopment(dev || []);
    } catch (error) {
      console.error("Error loading admin data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleResumeUpload = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const file = e.target.resumeFile.files[0];
      if (!file) {
        showAdminToast('Please select a PDF file first.', true);
        return;
      }
      
      const storageRef = ref(storage, `resumes/jsr_resume_${Date.now()}.pdf`);
      await uploadBytes(storageRef, file);
      const fileUrl = await getDownloadURL(storageRef);
      
      await saveResumeUrl(fileUrl);
      showAdminToast('Resume PDF uploaded and saved successfully!');
      loadAllData();
    } catch (err) {
      console.error(err);
      showAdminToast('Error uploading resume PDF.', true);
    } finally {
      setLoading(false);
    }
  };

  // Firebase Auth Email and Password submission
  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      console.error("Firebase Sign-In Error: ", err);
      // Display user-friendly message based on standard error codes
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setAuthError('Incorrect email or password.');
      } else if (err.code === 'auth/invalid-email') {
        setAuthError('Please enter a valid email address.');
      } else {
        setAuthError(err.message || 'Authentication failed. Please check credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setEmail('');
      setPassword('');
    } catch (err) {
      console.error("Firebase Sign-Out Error: ", err);
    }
  };

  // --- CRUD ACTIONS ---

  // Hero Save
  const handleHeroSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateHeroContent(heroData);
      showAdminToast('Hero section updated successfully!');
    } catch (e) {
      showAdminToast('Error updating Hero content.', true);
    } finally {
      setLoading(false);
    }
  };

  // About Save
  const handleAboutSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData(e.target);
      const data = Object.fromEntries(formData.entries());
      
      const strengthsArray = data.strengths
        ? data.strengths.split(',').map(s => s.trim()).filter(Boolean)
        : [];
      
      const payload = {
        intro: data.intro,
        eduBio: data.eduBio,
        serviceBio: data.serviceBio,
        corporateBio: data.corporateBio,
        strengths: strengthsArray,
        image: aboutData.image || '',
        philosophyStatement: data.philosophyStatement || '',
        philosophyParagraph1: data.philosophyParagraph1 || '',
        philosophyParagraph2: data.philosophyParagraph2 || '',
        philosophyImageUrl: aboutData.philosophyImageUrl || '',
        futureOutlookParagraph1: data.futureOutlookParagraph1 || '',
        futureOutlookParagraph2: data.futureOutlookParagraph2 || ''
      };

      await updateAboutContent(payload);
      setAboutData(payload);
      showAdminToast('About section updated successfully!');
    } catch (err) {
      console.error(err);
      showAdminToast('Error updating About content.', true);
    } finally {
      setLoading(false);
    }
  };

  // Philosophy Image Change
  const handlePhilosophyImageChange = async (e) => {
    handleLocalPreview(e);
    const url = await handleImageUpload(e, 'about');
    if (url) {
      setAboutData(prev => ({ ...prev, philosophyImageUrl: url }));
    }
  };

  // Image Upload Handler (with compression under 500kb)
  const handleImageUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadProgress('Compressing and uploading image...');
    try {
      const url = await uploadToImgBB(file);
      setUploadProgress('Upload complete!');
      setTimeout(() => setUploadProgress(''), 2000);
      return url;
    } catch (err) {
      setUploadProgress('Upload failed. Check console.');
      showAdminToast(err.message || 'Image upload failed. Is ImgBB key configured?', true);
      setTimeout(() => setUploadProgress(''), 3000);
    }
  };

  // Generic Save for lists (Timeline, Videos, Stats, Awards, Gallery)
  const handleSaveItem = async (e, type, saveFunc) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData(e.target);
      const data = Object.fromEntries(formData.entries());
      
      // Remove any raw File objects from database payload
      Object.keys(data).forEach(key => {
        if (data[key] instanceof File || key.endsWith('File')) {
          delete data[key];
        }
      });
      
      // Enforce order indexing
      if (editingItem && editingItem.id) data.id = editingItem.id;
      data.order = data.order ? Number(data.order) : (editingItem?.order || (getListByType(type).length + 1));

      // Handle specific fields
      if (type === 'gallery') {
        const imageFile = e.target.imageFile.files[0];
        if (imageFile) {
          const imgUrl = await handleImageUpload({ target: { files: [imageFile] } }, 'gallery');
          if (!imgUrl) return;
          data.image = imgUrl;
        } else if (editingItem && editingItem.image) {
          data.image = editingItem.image;
        } else {
          showAdminToast('Please select an image.', true);
          return;
        }
      }

      if (type === 'awards') {
        const imageFile = e.target.imageFile.files[0];
        if (imageFile) {
          const imgUrl = await handleImageUpload({ target: { files: [imageFile] } }, 'awards');
          if (!imgUrl) return;
          data.image = imgUrl;
        } else if (editingItem && editingItem.image) {
          data.image = editingItem.image;
        } else {
          data.image = '';
        }
      }

      if (type === 'heroSlides') {
        const imageFile = e.target.imageFile.files[0];
        if (imageFile) {
          const imgUrl = await handleImageUpload({ target: { files: [imageFile] } }, 'heroSlides');
          if (!imgUrl) return;
          data.imageUrl = imgUrl;
        } else if (editingItem && editingItem.imageUrl) {
          data.imageUrl = editingItem.imageUrl;
        } else {
          data.imageUrl = '';
        }
      }

      if (type === 'press') {
        const imageFile = e.target.imageFile.files[0];
        if (imageFile) {
          const imgUrl = await handleImageUpload({ target: { files: [imageFile] } }, 'press');
          if (!imgUrl) return;
          data.image = imgUrl;
        } else if (editingItem && editingItem.image) {
          data.image = editingItem.image;
        } else {
          data.image = '';
        }
      }

      if (type === 'vision') {
        const imageFile = e.target.imageFile.files[0];
        if (imageFile) {
          const imgUrl = await handleImageUpload({ target: { files: [imageFile] } }, 'vision');
          if (!imgUrl) return;
          data.image = imgUrl;
        } else if (editingItem && editingItem.image) {
          data.image = editingItem.image;
        } else {
          data.image = '';
        }
      }

      await saveFunc(data);
      showAdminToast('Item saved successfully!');
      setEditingItem(null);
      clearPreview();
      loadAllData();
    } catch (err) {
      console.error(err);
      showAdminToast('Error saving item.', true);
    } finally {
      setLoading(false);
    }
  };

  // Generic Delete
  const handleDeleteItem = async (id, deleteFunc) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      setLoading(true);
      try {
        await deleteFunc(id);
        showAdminToast('Item deleted successfully!');
        loadAllData();
      } catch (err) {
        showAdminToast('Error deleting item.', true);
      } finally {
        setLoading(false);
      }
    }
  };

  const getListByType = (type) => {
    if (type === 'timeline') return timeline;
    if (type === 'stats') return stats;
    if (type === 'awards') return awards;
    if (type === 'gallery') return gallery;
    if (type === 'heroSlides') return heroSlides;
    if (type === 'testimonials') return testimonials;
    if (type === 'press') return pressCoverage;
    if (type === 'services') return services;
    if (type === 'departments') return departments;
    if (type === 'caseStudies') return caseStudies;
    if (type === 'highlights') return highlights;
    if (type === 'innovations') return innovations;
    if (type === 'chatbot') return chatbotKB;
    if (type === 'vision') return vision;
    if (type === 'skills') return skills;
    if (type === 'development') return development;
    return [];
  };

  const handleSaveItemDirect = async (data, type, saveFunc) => {
    setLoading(true);
    try {
      await saveFunc(data);
      showAdminToast('Item saved successfully!');
      setEditingItem(null);
      loadAllData();
    } catch (err) {
      console.error(err);
      showAdminToast('Error saving item.', true);
    } finally {
      setLoading(false);
    }
  };

  // About profile image change handler
  const handleAboutImageChange = async (e) => {
    handleLocalPreview(e);
    const url = await handleImageUpload(e, 'about');
    if (url) {
      setAboutData(prev => ({ ...prev, image: url }));
    }
  };

  // Talks Save
  const handleTalksSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateTalks(talks);
      showAdminToast('Invited Talks updated successfully!');
    } catch (e) {
      showAdminToast('Error updating Invited Talks.', true);
    } finally {
      setLoading(false);
    }
  };

  // Contact Settings Save
  const handleContactSettingsSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateContactSettings(contactSettings);
      showAdminToast('General settings updated successfully!');
    } catch (e) {
      showAdminToast('Error updating General settings.', true);
    } finally {
      setLoading(false);
    }
  };

  // Message Delete
  const handleDeleteMessage = async (id) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      setLoading(true);
      try {
        await deleteContactMessage(id);
        const ms = await getContactMessages();
        setMessages(ms);
        showAdminToast('Message deleted successfully!');
      } catch (err) {
        showAdminToast('Error deleting message.', true);
      } finally {
        setLoading(false);
      }
    }
  };

  // Video File check, compress, and upload directly to Firebase Storage
  const handleVideoFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const maxSizeBytes = 500 * 1024;
    
    try {
      let finalFile = file;
      
      // 1. Check if compression is needed (exceeds 500KB)
      if (file.size > maxSizeBytes) {
        if (window.confirm(`Video file size is ${(file.size / 1024).toFixed(1)}KB, which exceeds the 500KB limit. Would you like to compress it to under 500KB client-side and upload it?`)) {
          setVideoStatusText('Compressing Video...');
          setVideoSubText('Re-encoding video frames client-side to target under 500KB.');
          setCompressingVideo(true);
          setVideoProgress(0);
          
          finalFile = await compressVideo(file, (progress) => {
            setVideoProgress(progress);
          });
        } else {
          e.target.value = ''; // clear input
          return;
        }
      }
      
      // 2. Upload file (original or compressed) to Firebase Storage
      setVideoStatusText('Uploading Video...');
      setVideoSubText('Uploading video to Firebase Storage...');
      setCompressingVideo(true);
      setVideoProgress(50); // static progress indication for upload start
      
      // Use clean filename (sanitize extension to webm since compression outputs webm)
      const isCompressed = file.size > maxSizeBytes;
      const fileExt = isCompressed ? 'webm' : (file.name.split('.').pop() || 'mp4');
      const cleanName = `${Date.now()}_${file.name.split('.')[0]}.${fileExt}`;
      
      const storageRef = ref(storage, `videos/${cleanName}`);
      await uploadBytes(storageRef, finalFile);
      setVideoProgress(90);
      
      const downloadUrl = await getDownloadURL(storageRef);
      setVideoProgress(100);
      
      // Populate URL field in form
      const urlInput = document.getElementById('videoUrlInput');
      if (urlInput) {
        urlInput.value = downloadUrl;
      }
      
      showAdminToast('Video uploaded successfully! The URL has been filled in the form.');
    } catch (err) {
      console.error(err);
      showAdminToast(err.message || 'Video upload or compression failed.', true);
    } finally {
      setCompressingVideo(false);
      e.target.value = ''; // clear input
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-charcoal flex flex-col justify-center items-center px-6 py-12 text-white font-sans">
        <div className="max-w-md w-full bg-[#25221F] p-10 rounded-[2rem] border border-white/10 shadow-2xl text-center relative overflow-hidden">
          <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(193,68,14,0.4)]">
            <FaLock className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-offwhite tracking-tight mb-2">Admin Panel Gate</h2>
          <p className="text-white/60 text-xs md:text-sm font-medium mb-8">
            This portfolio panel is locked. Please log in with your email and password.
          </p>

          <form onSubmit={handleAuthSubmit} className="flex flex-col gap-4">
            <input 
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Admin Email"
              className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-center text-sm text-white focus:outline-none focus:border-secondary transition-all"
            />
            <input 
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-center text-sm text-white focus:outline-none focus:border-secondary transition-all"
            />
            {authError && <p className="text-primary text-xs font-bold mt-1">{authError}</p>}
            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-3 mt-2 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-sm shadow-md transition-all focus:outline-none disabled:opacity-50"
            >
              {loading ? 'Logging in...' : 'Login as Admin'}
            </button>
          </form>

          {/* Subtext info */}
          <div className="mt-8 pt-6 border-t border-white/5 text-[10px] text-white/40 uppercase tracking-widest font-mono">
            JSR Annamayya Public Systems
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-offwhite flex flex-col md:flex-row text-charcoal font-sans relative">
      
      {/* Video Compression Progress Overlay */}
      {compressingVideo && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[200000] flex flex-col justify-center items-center text-white">
          <div className="bg-[#25221F] p-8 rounded-[2rem] border border-white/10 shadow-2xl max-w-sm w-full text-center">
            <div className="w-16 h-16 rounded-full border-4 border-secondary border-t-transparent animate-spin mx-auto mb-6"></div>
            <h3 className="text-lg font-black tracking-tight text-white mb-2">{videoStatusText}</h3>
            <p className="text-xs text-white/60 mb-6 font-medium">{videoSubText}</p>
            <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden mb-2">
              <div 
                className="bg-primary h-full transition-all duration-300 rounded-full" 
                style={{ width: `${videoProgress}%` }}
              ></div>
            </div>
            <span className="text-sm font-mono font-bold text-secondary">{videoProgress}%</span>
          </div>
        </div>
      )}
      
      {/* Mobile Menu Backdrop */}
      {isMobileMenuOpen && (
        <div 
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
        />
      )}

      {/* Mobile Top Header */}
      <header className="w-full bg-charcoal text-white p-4 flex justify-between items-center border-b border-[#2d2824] md:hidden sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 text-white hover:text-secondary focus:outline-none"
            aria-label="Open navigation menu"
          >
            <FaBars className="w-5 h-5" />
          </button>
          <h1 className="text-base font-black tracking-tight text-offwhite font-sans">
            JSR Admin<span className="text-secondary">.</span>
          </h1>
        </div>
        <button 
          onClick={handleLogout} 
          className="p-2 bg-white/5 hover:bg-primary rounded-lg text-white transition-colors"
          title="Logout"
        >
          <FaSignOutAlt className="w-4 h-4" />
        </button>
      </header>

      {/* Sidebar Nav */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-charcoal text-white flex flex-col justify-between shrink-0 p-6 border-r border-[#2d2824] transition-transform duration-300 md:sticky md:top-0 md:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:flex md:h-screen`}>
        <div>
          <div className="flex justify-between items-center mb-10 pb-4 border-b border-white/10">
            <h1 className="text-lg font-black tracking-tight text-offwhite font-sans">
              JSR Admin<span className="text-secondary">.</span>
            </h1>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setIsMobileMenuOpen(false)} 
                className="md:hidden p-2 hover:bg-white/5 rounded-lg text-white/60 hover:text-white"
                title="Close Menu"
              >
                <FaTimes className="w-3.5 h-3.5" />
              </button>
              <button 
                onClick={handleLogout} 
                className="p-2 bg-white/5 hover:bg-primary rounded-lg text-white hover:text-white transition-colors"
                title="Logout"
              >
                <FaSignOutAlt className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <nav className="flex flex-col gap-1.5 max-h-[70vh] overflow-y-auto pr-1">
            {tabsConfig.map(tab => (
              <NavLink 
                key={tab.id}
                to={`/admin/${tab.path}`}
                onClick={() => { 
                  setEditingItem(null); 
                  if (tab.id === 'messages') setUnreadCount(0); 
                  setIsMobileMenuOpen(false);
                }}
                className={({ isActive }) => 
                  `w-full py-2 px-3.5 rounded-xl font-bold text-[11px] flex items-center gap-2.5 transition-all ${
                    isActive 
                      ? 'bg-primary text-white shadow-md' 
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`
                }
              >
                {tab.icon}
                <span className="flex-1 text-left">{tab.label}</span>
                {tab.id === 'messages' && unreadCount > 0 && (
                  <span className="bg-secondary text-charcoal text-[9px] px-1.5 py-0.5 rounded-full font-black animate-pulse shadow-sm shrink-0">
                    {unreadCount}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="text-[10px] text-white/30 uppercase tracking-widest font-mono mt-10 md:mt-0">
          Database Active (Firestore)
        </div>
      </aside>

      {/* Main Workspace Area */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto max-h-screen">
        {loading && (
          <div className="fixed top-4 right-4 bg-primary text-white font-bold text-xs px-4 py-2 rounded-full shadow-lg z-50 animate-pulse">
            Syncing Firestore...
          </div>
        )}

        {/* Real-time Analytics Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="flex flex-col gap-8 w-full text-left">
            {/* Dashboard Welcome Header */}
            <div className="bg-white p-6 md:p-8 rounded-[1.5rem] border border-gray-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-2xl font-black text-charcoal tracking-tight">Overview & Analytics</h2>
                <p className="text-xs text-neutraltext font-medium mt-1">Real-time visitor telemetry, interactive aggregates, and operational metrics.</p>
              </div>
              <button 
                onClick={loadAllData}
                className="px-4 py-2 border border-gray-200 hover:bg-gray-50 text-charcoal font-bold text-xs rounded-full shadow-sm flex items-center gap-2 transition-colors focus:outline-none"
              >
                Refresh Data
              </button>
            </div>

            {/* Aggregated Numbers Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {/* Card 1: Pageviews */}
              <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                  <FaDesktop className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-neutraltext/60 uppercase tracking-wider block text-left">Total Pageviews</span>
                  <span className="text-2xl font-black text-charcoal block mt-0.5 text-left">
                    {analyticsSummary.reduce((sum, day) => sum + (day.pageviews || 0), 0)}
                  </span>
                </div>
              </div>

              {/* Card 2: Contact Submissions */}
              <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-secondary/15 border border-secondary/35 flex items-center justify-center text-[#E8A33D] shrink-0">
                  <FaEnvelope className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-neutraltext/60 uppercase tracking-wider block text-left">Contacts Received</span>
                  <span className="text-2xl font-black text-charcoal block mt-0.5 text-left">
                    {analyticsSummary.reduce((sum, day) => sum + (day.contactSubmissions || 0), 0)}
                  </span>
                </div>
              </div>

              {/* Card 3: Chatbot Messages */}
              <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-green-50 border border-green-200 flex items-center justify-center text-green-600 shrink-0">
                  <FaCommentDots className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-neutraltext/60 uppercase tracking-wider block text-left">Chatbot Queries</span>
                  <span className="text-2xl font-black text-charcoal block mt-0.5 text-left">
                    {analyticsSummary.reduce((sum, day) => sum + (day.chatbotMessages || 0), 0)}
                  </span>
                </div>
              </div>
            </div>

            {/* Row 1: Trends SVG Graph and Most Viewed Gallery Photo */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Daily Visitor Trends SVG Graph */}
              <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-gray-200 shadow-sm flex flex-col justify-between lg:col-span-2">
                <div>
                  <h3 className="text-base font-black text-charcoal text-left">Visitor Trends (Last 7 Days)</h3>
                  <p className="text-xs text-neutraltext/60 mt-0.5 text-left">Timeline of daily pageviews and user engagement.</p>
                </div>
                <div className="my-6 min-h-[160px] w-full flex items-center justify-center">
                  {analyticsSummary.length === 0 ? (
                    <p className="text-xs text-neutraltext/60 font-medium">No visitor telemetry logged yet.</p>
                  ) : (
                    (() => {
                      const sortedRollups = [...analyticsSummary]
                        .sort((a, b) => a.date.localeCompare(b.date))
                        .slice(-7);
                      if (sortedRollups.length === 0) {
                        return <p className="text-xs text-neutraltext/60 font-medium">No visitor telemetry logged yet.</p>;
                      }
                      const maxViews = Math.max(...sortedRollups.map(d => d.pageviews || 0), 1);
                      return (
                        <svg className="w-full h-full max-h-[140px]" viewBox="0 0 500 160" preserveAspectRatio="none">
                          <defs>
                            <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#C1440E" />
                              <stop offset="100%" stopColor="#E8A33D" stopOpacity="0.2" />
                            </linearGradient>
                          </defs>
                          {sortedRollups.map((day, idx) => {
                            const x = 30 + idx * 65;
                            const barHeight = ((day.pageviews || 0) / maxViews) * 95;
                            const y = 120 - barHeight;
                            return (
                              <g key={idx}>
                                <rect 
                                  x={x} 
                                  y={y} 
                                  width="38" 
                                  height={Math.max(barHeight, 4)} 
                                  rx="4" 
                                  fill="url(#barGrad)" 
                                />
                                <text 
                                  x={x + 19} 
                                  y={y - 8} 
                                  textAnchor="middle" 
                                  className="text-[9px] font-mono font-black fill-charcoal"
                                >
                                  {day.pageviews || 0}
                                </text>
                                <text 
                                  x={x + 19} 
                                  y="140" 
                                  textAnchor="middle" 
                                  className="text-[8px] font-mono font-bold fill-neutraltext/60"
                                >
                                  {day.date.split('-').slice(1).join('/')}
                                </text>
                              </g>
                            );
                          })}
                          <line x1="10" y1="124" x2="490" y2="124" stroke="#e2e8f0" strokeWidth="1.5" />
                        </svg>
                      );
                    })()
                  )}
                </div>
                <div className="text-[10px] font-bold text-neutraltext/40 text-left">Visualized from daily aggregated analytics documents</div>
              </div>

              {/* Most Viewed Gallery Image Card */}
              <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-gray-200 shadow-sm flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-black text-charcoal text-left">Most Viewed Photo</h3>
                  <p className="text-xs text-neutraltext/60 mt-0.5 text-left">Dynamically calculated from click events in photo lightbox.</p>
                </div>
                <div className="my-6 bg-offwhite/50 p-6 rounded-2xl border border-gray-100 flex flex-col items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                    <FaImage className="w-6 h-6" />
                  </div>
                  <div className="text-center">
                    <h4 className="text-xs font-black text-charcoal leading-snug">{(() => {
                      const topItem = (() => {
                        const counts = {};
                        analyticsSummary.forEach(day => {
                          Object.keys(day).forEach(key => {
                            if (key.startsWith('gallery_')) {
                              counts[key] = (counts[key] || 0) + day[key];
                            }
                          });
                        });
                        let maxKey = '';
                        let maxVal = 0;
                        Object.keys(counts).forEach(key => {
                          if (counts[key] > maxVal) {
                            maxVal = counts[key];
                            maxKey = key;
                          }
                        });
                        if (!maxKey) return { caption: 'None yet', views: 0 };
                        return { caption: maxKey.replace('gallery_', '').replace(/_/g, ' '), views: maxVal };
                      })();
                      return topItem.caption;
                    })()}</h4>
                    <span className="text-[9px] font-bold text-neutraltext/60 mt-1 block">
                      Total views: {(() => {
                        const topItem = (() => {
                          const counts = {};
                          analyticsSummary.forEach(day => {
                            Object.keys(day).forEach(key => {
                              if (key.startsWith('gallery_')) {
                                counts[key] = (counts[key] || 0) + day[key];
                              }
                            });
                          });
                          let maxKey = '';
                          let maxVal = 0;
                          Object.keys(counts).forEach(key => {
                            if (counts[key] > maxVal) {
                              maxVal = counts[key];
                              maxKey = key;
                            }
                          });
                          if (!maxKey) return { caption: 'None yet', views: 0 };
                          return { caption: maxKey.replace('gallery_', '').replace(/_/g, ' '), views: maxVal };
                        })();
                        return topItem.views;
                      })()}
                    </span>
                  </div>
                </div>
                <div className="text-[10px] font-bold text-neutraltext/40 text-left">Aggregated from consolidated rollups</div>
              </div>
            </div>

            {/* Row 2: Device, Browser, and OS telemetry breakdowns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Device Telemetry Card */}
              <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-gray-200 shadow-sm flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-black text-charcoal text-left">Device Breakdown</h3>
                  <p className="text-xs text-neutraltext/60 mt-0.5 text-left">Distribution of platform types accessing the portfolio.</p>
                </div>
                
                <div className="my-6 flex flex-col gap-3.5">
                  {(() => {
                    const devices = { Desktop: 0, Mobile: 0, Tablet: 0 };
                    analyticsSummary.forEach(day => {
                      devices.Desktop += day.device_Desktop || 0;
                      devices.Mobile += day.device_Mobile || 0;
                      devices.Tablet += day.device_Tablet || 0;
                    });
                    const total = devices.Desktop + devices.Mobile + devices.Tablet || 1;
                    const pctDesktop = Math.round((devices.Desktop / total) * 100);
                    const pctMobile = Math.round((devices.Mobile / total) * 100);
                    const pctTablet = Math.round((devices.Tablet / total) * 100);

                    return (
                      <>
                        <div className="flex flex-col gap-1 text-left">
                          <div className="flex justify-between text-xs font-bold">
                            <span className="flex items-center gap-1.5"><FaDesktop className="w-3 h-3 text-neutraltext/60" /> Desktop ({devices.Desktop})</span>
                            <span>{pctDesktop}%</span>
                          </div>
                          <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                            <div className="bg-primary h-full rounded-full transition-all" style={{ width: `${pctDesktop}%` }} />
                          </div>
                        </div>
                        <div className="flex flex-col gap-1 text-left">
                          <div className="flex justify-between text-xs font-bold">
                            <span className="flex items-center gap-1.5"><FaMobileAlt className="w-3 h-3 text-neutraltext/60" /> Mobile ({devices.Mobile})</span>
                            <span>{pctMobile}%</span>
                          </div>
                          <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                            <div className="bg-[#E8A33D] h-full rounded-full transition-all" style={{ width: `${pctMobile}%` }} />
                          </div>
                        </div>
                        <div className="flex flex-col gap-1 text-left">
                          <div className="flex justify-between text-xs font-bold">
                            <span className="flex items-center gap-1.5"><FaTabletAlt className="w-3 h-3 text-neutraltext/60" /> Tablet ({devices.Tablet})</span>
                            <span>{pctTablet}%</span>
                          </div>
                          <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                            <div className="bg-green-500 h-full rounded-full transition-all" style={{ width: `${pctTablet}%` }} />
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </div>
                <div className="text-[10px] font-bold text-neutraltext/40 text-left">Aggregated from consolidated rollups</div>
              </div>

              {/* Browser Breakdown Card */}
              <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-gray-200 shadow-sm flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-black text-charcoal text-left">Browser Breakdown</h3>
                  <p className="text-xs text-neutraltext/60 mt-0.5 text-left">Distribution of web browsers used by visitors.</p>
                </div>
                
                <div className="my-6 flex flex-col gap-3.5">
                  {(() => {
                    const browsers = { Chrome: 0, Safari: 0, Firefox: 0, Edge: 0, Others: 0 };
                    analyticsSummary.forEach(day => {
                      browsers.Chrome += day.browser_Chrome || 0;
                      browsers.Safari += day.browser_Safari || 0;
                      browsers.Firefox += day.browser_Firefox || 0;
                      browsers.Edge += day.browser_Edge || 0;
                      
                      Object.keys(day).forEach(key => {
                        if (key.startsWith('browser_') && !['browser_Chrome', 'browser_Safari', 'browser_Firefox', 'browser_Edge'].includes(key)) {
                          browsers.Others += day[key] || 0;
                        }
                      });
                    });
                    const total = browsers.Chrome + browsers.Safari + browsers.Firefox + browsers.Edge + browsers.Others || 1;
                    const pctChrome = Math.round((browsers.Chrome / total) * 100);
                    const pctSafari = Math.round((browsers.Safari / total) * 100);
                    const pctFirefox = Math.round((browsers.Firefox / total) * 100);
                    const pctEdge = Math.round((browsers.Edge / total) * 100);
                    const pctOthers = Math.round((browsers.Others / total) * 100);

                    return (
                      <div className="flex flex-col gap-2 max-h-[180px] overflow-y-auto pr-1">
                        <div className="flex flex-col gap-0.5 text-left">
                          <div className="flex justify-between text-[11px] font-bold">
                            <span>Chrome ({browsers.Chrome})</span>
                            <span>{pctChrome}%</span>
                          </div>
                          <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                            <div className="bg-primary h-full rounded-full" style={{ width: `${pctChrome}%` }} />
                          </div>
                        </div>
                        <div className="flex flex-col gap-0.5 text-left">
                          <div className="flex justify-between text-[11px] font-bold">
                            <span>Safari ({browsers.Safari})</span>
                            <span>{pctSafari}%</span>
                          </div>
                          <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                            <div className="bg-blue-500 h-full rounded-full" style={{ width: `${pctSafari}%` }} />
                          </div>
                        </div>
                        <div className="flex flex-col gap-0.5 text-left">
                          <div className="flex justify-between text-[11px] font-bold">
                            <span>Firefox ({browsers.Firefox})</span>
                            <span>{pctFirefox}%</span>
                          </div>
                          <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                            <div className="bg-orange-500 h-full rounded-full" style={{ width: `${pctFirefox}%` }} />
                          </div>
                        </div>
                        <div className="flex flex-col gap-0.5 text-left">
                          <div className="flex justify-between text-[11px] font-bold">
                            <span>Edge ({browsers.Edge})</span>
                            <span>{pctEdge}%</span>
                          </div>
                          <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                            <div className="bg-teal-500 h-full rounded-full" style={{ width: `${pctEdge}%` }} />
                          </div>
                        </div>
                        <div className="flex flex-col gap-0.5 text-left">
                          <div className="flex justify-between text-[11px] font-bold">
                            <span>Others ({browsers.Others})</span>
                            <span>{pctOthers}%</span>
                          </div>
                          <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                            <div className="bg-gray-400 h-full rounded-full" style={{ width: `${pctOthers}%` }} />
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
                <div className="text-[10px] font-bold text-neutraltext/40 text-left">Aggregated from consolidated rollups</div>
              </div>

              {/* OS Breakdown Card */}
              <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-gray-200 shadow-sm flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-black text-charcoal text-left">OS Breakdown</h3>
                  <p className="text-xs text-neutraltext/60 mt-0.5 text-left">Distribution of client operating systems.</p>
                </div>
                
                <div className="my-6 flex flex-col gap-3.5">
                  {(() => {
                    const osList = { Windows: 0, MacOS: 0, iOS: 0, Android: 0, Linux: 0, Others: 0 };
                    analyticsSummary.forEach(day => {
                      Object.keys(day).forEach(key => {
                        if (key.startsWith('os_')) {
                          const osName = key.replace('os_', '');
                          const resolvedOs = osName === 'MacOS' ? 'MacOS' : (osName === 'Windows' ? 'Windows' : (osName === 'iOS' ? 'iOS' : (osName === 'Android' ? 'Android' : (osName === 'Linux' ? 'Linux' : 'Others'))));
                          osList[resolvedOs] = (osList[resolvedOs] || 0) + day[key];
                        }
                      });
                    });
                    const total = osList.Windows + osList.MacOS + osList.iOS + osList.Android + osList.Linux + osList.Others || 1;
                    const pctWin = Math.round((osList.Windows / total) * 100);
                    const pctMac = Math.round((osList.MacOS / total) * 100);
                    const pctIos = Math.round((osList.iOS / total) * 100);
                    const pctAnd = Math.round((osList.Android / total) * 100);
                    const pctLin = Math.round((osList.Linux / total) * 100);

                    return (
                      <div className="flex flex-col gap-2 max-h-[180px] overflow-y-auto pr-1">
                        <div className="flex flex-col gap-0.5 text-left">
                          <div className="flex justify-between text-[11px] font-bold">
                            <span>Windows ({osList.Windows})</span>
                            <span>{pctWin}%</span>
                          </div>
                          <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                            <div className="bg-blue-600 h-full rounded-full" style={{ width: `${pctWin}%` }} />
                          </div>
                        </div>
                        <div className="flex flex-col gap-0.5 text-left">
                          <div className="flex justify-between text-[11px] font-bold">
                            <span>MacOS ({osList.MacOS})</span>
                            <span>{pctMac}%</span>
                          </div>
                          <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                            <div className="bg-purple-500 h-full rounded-full" style={{ width: `${pctMac}%` }} />
                          </div>
                        </div>
                        <div className="flex flex-col gap-0.5 text-left">
                          <div className="flex justify-between text-[11px] font-bold">
                            <span>iOS ({osList.iOS})</span>
                            <span>{pctIos}%</span>
                          </div>
                          <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                            <div className="bg-pink-500 h-full rounded-full" style={{ width: `${pctIos}%` }} />
                          </div>
                        </div>
                        <div className="flex flex-col gap-0.5 text-left">
                          <div className="flex justify-between text-[11px] font-bold">
                            <span>Android ({osList.Android})</span>
                            <span>{pctAnd}%</span>
                          </div>
                          <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                            <div className="bg-green-500 h-full rounded-full" style={{ width: `${pctAnd}%` }} />
                          </div>
                        </div>
                        <div className="flex flex-col gap-0.5 text-left">
                          <div className="flex justify-between text-[11px] font-bold">
                            <span>Linux/Others ({osList.Linux + osList.Others})</span>
                            <span>{100 - pctWin - pctMac - pctIos - pctAnd}%</span>
                          </div>
                          <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                            <div className="bg-gray-500 h-full rounded-full" style={{ width: `${100 - pctWin - pctMac - pctIos - pctAnd}%` }} />
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
                <div className="text-[10px] font-bold text-neutraltext/40 text-left">Aggregated from consolidated rollups</div>
              </div>
            </div>

            {/* Split Row: Recent Activities & System Logs */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activity List */}
              <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-gray-200 shadow-sm text-left">
                <h3 className="text-base font-black text-charcoal mb-4">Recent User Interactions</h3>
                <div className="flex flex-col gap-2.5 max-h-[300px] overflow-y-auto">
                  {recentActivities.length === 0 ? (
                    <p className="text-xs text-neutraltext/60">No user activity logged yet.</p>
                  ) : (
                    recentActivities.slice(0, 8).map((act, idx) => (
                      <div key={act.id || idx} className="bg-offwhite/50 border border-gray-100 p-3 rounded-xl flex justify-between items-center text-xs">
                        <div className="text-left">
                          <span className="font-bold text-charcoal">{act.type.toUpperCase()}</span>
                          {act.label && <span className="text-neutraltext/70 block mt-0.5">{act.label}</span>}
                          {act.city && <span className="text-[9px] text-neutraltext/50 block mt-0.5">{act.city}, {act.country}</span>}
                        </div>
                        <span className="text-[9px] text-neutraltext/50 font-mono">
                          {new Date(act.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Administrative Audit Logs */}
              <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-gray-200 shadow-sm text-left">
                <h3 className="text-base font-black text-charcoal mb-4">Admin Audit Logs</h3>
                <div className="flex flex-col gap-2.5 max-h-[300px] overflow-y-auto">
                  {systemLogsList.length === 0 ? (
                    <p className="text-xs text-neutraltext/60">No audit logs recorded yet.</p>
                  ) : (
                    systemLogsList.slice(0, 8).map((logItem, idx) => (
                      <div key={logItem.id || idx} className="bg-offwhite/50 border border-gray-100 p-3 rounded-xl flex flex-col text-xs text-left">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-primary">{logItem.action.toUpperCase()}</span>
                          <span className="text-[9px] text-neutraltext/50 font-mono">
                            {new Date(logItem.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="text-neutraltext/80 mt-1 leading-snug">{logItem.details}</p>
                        <span className="text-[8px] font-bold text-neutraltext/45 mt-1">User: {logItem.user || 'admin'}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

          </div>
        )}

        {/* Tab content rendering */}
        {activeTab === 'hero' && (
          <div className="flex flex-col gap-8 w-full">
            <div className="flex justify-between items-center bg-white p-6 rounded-[1.5rem] border border-gray-200 shadow-sm">
              <div>
                <h2 className="text-xl font-black text-charcoal">Hero Carousel Slides</h2>
                <p className="text-xs text-neutraltext font-medium mt-1">Manage slides shown in the top split slider section.</p>
              </div>
              <button 
                onClick={() => setEditingItem({ type: 'heroSlides', data: { headline: '', subtext: '', imageUrl: '', order: heroSlides.length + 1 } })}
                className="px-4 py-2 bg-primary hover:bg-primary/90 text-white font-bold text-xs rounded-full shadow-md flex items-center gap-2"
              >
                <FaPlus /> Add Slide
              </button>
            </div>

            {/* Editing Form */}
            {editingItem && editingItem.type === 'heroSlides' && (
              <div className="bg-white p-8 rounded-[2rem] border border-secondary/30 shadow-md">
                <h3 className="text-lg font-black mb-6">{editingItem.id ? 'Edit Hero Slide' : 'Create Hero Slide'}</h3>
                <form onSubmit={(e) => handleSaveItem(e, 'heroSlides', saveHeroSlide)} className="flex flex-col gap-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-neutraltext">Slide Headline *</label>
                      <textarea 
                        required 
                        name="headline" 
                        rows="2" 
                        defaultValue={editingItem.headline} 
                        placeholder="Headline text (use \n for line breaks)"
                        className="bg-offwhite/50 border border-gray-200 rounded-xl p-3 text-xs focus:outline-none focus:border-primary resize-none"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-neutraltext">Slide Subtext *</label>
                      <textarea 
                        required 
                        name="subtext" 
                        rows="2" 
                        defaultValue={editingItem.subtext} 
                        placeholder="Subtext description"
                        className="bg-offwhite/50 border border-gray-200 rounded-xl p-3 text-xs focus:outline-none focus:border-primary resize-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-neutraltext font-sans">Slide Photo (Image compressor target: under 300KB + ImgBB)</label>
                      <input 
                        type="file" 
                        accept="image/*" 
                        name="imageFile"
                        onChange={handleLocalPreview}
                        className="bg-offwhite/50 border border-gray-200 rounded-xl p-2 text-xs focus:outline-none"
                      />
                      {uploadProgress && (
                        <div className="flex items-center gap-2 mt-2 bg-primary/5 border border-primary/10 rounded-xl p-2 max-w-xs animate-pulse">
                          <svg className="animate-spin h-3.5 w-3.5 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span className="text-[10px] font-bold text-primary uppercase tracking-wider">{uploadProgress}</span>
                        </div>
                      )}
                      {(imagePreviewUrl || editingItem.imageUrl) && (
                        <div className="w-16 h-12 rounded-lg overflow-hidden border border-gray-200 mt-2">
                          <img src={imagePreviewUrl || editingItem.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-neutraltext">Display Order *</label>
                      <input 
                        type="number" 
                        required 
                        name="order" 
                        defaultValue={editingItem.order} 
                        className="bg-offwhite/50 border border-gray-200 rounded-xl p-3 text-xs focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 mt-4">
                    <button type="button" disabled={loading} onClick={() => setEditingItem(null)} className="px-5 py-2 rounded-full border border-gray-200 text-xs font-bold disabled:opacity-50">Cancel</button>
                    <AdminSaveButton loading={loading} label="Save Slide" />
                  </div>
                </form>
              </div>
            )}

            {/* Slide List */}
            <div className="grid grid-cols-1 gap-4">
              {heroSlides.map((slide, idx) => (
                <div key={slide.id || idx} className="bg-white p-6 rounded-2xl border border-gray-200 flex justify-between items-center shadow-sm gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-20 h-16 rounded-xl overflow-hidden border border-gray-100 shrink-0 shadow-sm bg-[#25221F] flex items-center justify-center">
                      <img 
                        src={slide.imageUrl || 'https://placehold.co/600x400/1e1b18/e8a33d?text=Hero+Slide'} 
                        alt="Slide Preview" 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    <div className="text-left">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold bg-primary/5 text-primary px-3 py-0.5 rounded-full">Slide #{slide.order || idx + 1}</span>
                        {slide.id === 'default' && <span className="text-[9px] font-bold bg-amber-500/10 text-amber-600 px-2 py-0.5 rounded-full">Static Default</span>}
                      </div>
                      <h3 className="text-base font-black text-charcoal mt-2 whitespace-pre-line leading-snug">{slide.headline}</h3>
                      <p className="text-xs text-neutraltext font-medium mt-1 leading-relaxed">{slide.subtext}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button onClick={() => setEditingItem({ type: 'heroSlides', ...slide })} className="p-2 bg-gray-100 hover:bg-secondary rounded-lg transition-colors text-charcoal" title="Edit Slide"><FaEdit className="w-3.5 h-3.5" /></button>
                    <button onClick={() => handleDeleteItem(slide.id, deleteHeroSlide)} disabled={slide.id === 'default'} className="p-2 bg-gray-100 hover:bg-primary hover:text-white rounded-lg transition-colors text-charcoal disabled:opacity-30" title="Delete Slide"><FaTrash className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'about' && (
          <div className="max-w-2xl bg-white p-8 md:p-10 rounded-[2rem] border border-gray-200 shadow-sm">
            <h2 className="text-2xl font-black mb-6 border-b pb-3">Edit About & Core Strengths</h2>
            <form onSubmit={handleAboutSave} className="flex flex-col gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-neutraltext">Intro Tagline *</label>
                <textarea 
                  required name="intro" rows="2" defaultValue={aboutData.intro}
                  className="w-full bg-offwhite/50 border border-gray-200 rounded-xl p-3 text-xs focus:outline-none focus:border-primary"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-neutraltext">Educational & Early Career Excellence Bio *</label>
                <textarea 
                  required name="eduBio" rows="4" defaultValue={aboutData.eduBio}
                  className="w-full bg-offwhite/50 border border-gray-200 rounded-xl p-3 text-xs focus:outline-none focus:border-primary"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-neutraltext">Public Service & Environmental Advocacy Bio *</label>
                <textarea 
                  required name="serviceBio" rows="4" defaultValue={aboutData.serviceBio}
                  className="w-full bg-offwhite/50 border border-gray-200 rounded-xl p-3 text-xs focus:outline-none focus:border-primary"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-neutraltext">Corporate & Strategic Leadership Bio *</label>
                <textarea 
                  required name="corporateBio" rows="4" defaultValue={aboutData.corporateBio}
                  className="w-full bg-offwhite/50 border border-gray-200 rounded-xl p-3 text-xs focus:outline-none focus:border-primary"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-neutraltext">Core Strengths (comma-separated) *</label>
                <input 
                  type="text" required name="strengths" defaultValue={(aboutData.strengths || []).join(', ')}
                  className="bg-offwhite/50 border border-gray-200 rounded-xl p-3 text-xs focus:outline-none focus:border-primary"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-neutraltext">Profile Photo (compressed target: under 300KB + ImgBB)</label>
                <input 
                  type="file" accept="image/*" onChange={handleAboutImageChange}
                  className="bg-offwhite/50 border border-gray-200 rounded-xl p-2 text-xs focus:outline-none"
                />
                {uploadProgress && (
                        <div className="flex items-center gap-2 mt-2 bg-primary/5 border border-primary/10 rounded-xl p-2 max-w-xs animate-pulse">
                          <svg className="animate-spin h-3.5 w-3.5 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span className="text-[10px] font-bold text-primary uppercase tracking-wider">{uploadProgress}</span>
                        </div>
                      )}
                {(imagePreviewUrl || aboutData.image) && (
                  <div className="w-24 h-24 rounded-lg overflow-hidden border border-gray-200 mt-2">
                    <img src={imagePreviewUrl || aboutData.image} alt="Profile Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              {/* Operational Philosophy */}
              <h3 className="text-sm font-bold uppercase tracking-wider text-neutraltext border-t pt-4 mt-2">Operational Philosophy</h3>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-neutraltext font-mono">Philosophy Quote/Statement *</label>
                <textarea 
                  required name="philosophyStatement" rows="2" defaultValue={aboutData.philosophyStatement}
                  className="w-full bg-offwhite/50 border border-gray-200 rounded-xl p-3 text-xs focus:outline-none focus:border-primary"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-neutraltext font-mono">Philosophy Paragraph 1 *</label>
                <textarea 
                  required name="philosophyParagraph1" rows="3" defaultValue={aboutData.philosophyParagraph1}
                  className="w-full bg-offwhite/50 border border-gray-200 rounded-xl p-3 text-xs focus:outline-none focus:border-primary"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-neutraltext font-mono">Philosophy Paragraph 2</label>
                <textarea 
                  name="philosophyParagraph2" rows="3" defaultValue={aboutData.philosophyParagraph2}
                  className="w-full bg-offwhite/50 border border-gray-200 rounded-xl p-3 text-xs focus:outline-none focus:border-primary"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-neutraltext font-mono">Philosophy Portrait Image</label>
                <input 
                  type="file" accept="image/*" onChange={handlePhilosophyImageChange}
                  className="bg-offwhite/50 border border-gray-200 rounded-xl p-2 text-xs focus:outline-none"
                />
                {aboutData.philosophyImageUrl && (
                  <div className="w-24 h-24 rounded-lg overflow-hidden border border-gray-200 mt-2">
                    <img src={aboutData.philosophyImageUrl} alt="Philosophy Portrait Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              {/* Future Outlook */}
              <h3 className="text-sm font-bold uppercase tracking-wider text-neutraltext border-t pt-4 mt-2">Future Outlook</h3>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-neutraltext font-mono">Outlook Paragraph 1 *</label>
                <textarea 
                  required name="futureOutlookParagraph1" rows="3" defaultValue={aboutData.futureOutlookParagraph1}
                  className="w-full bg-offwhite/50 border border-gray-200 rounded-xl p-3 text-xs focus:outline-none focus:border-primary"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-neutraltext font-mono">Outlook Paragraph 2</label>
                <textarea 
                  name="futureOutlookParagraph2" rows="3" defaultValue={aboutData.futureOutlookParagraph2}
                  className="w-full bg-offwhite/50 border border-gray-200 rounded-xl p-3 text-xs focus:outline-none focus:border-primary"
                />
              </div>

              <AdminSaveButton loading={loading} label="Save About Changes" className="py-3" />
            </form>
          </div>
        )}

        {/* Career Timeline Management */}
        {activeTab === 'timeline' && (
          <div className="flex flex-col gap-8">
            <div className="flex justify-between items-center bg-white p-6 rounded-[1.5rem] border border-gray-200 shadow-sm">
              <div>
                <h2 className="text-xl font-black text-charcoal">Career Timeline Stops</h2>
                <p className="text-xs text-neutraltext font-medium mt-1">Manage career timeline cards with custom ordering (oldest to newest).</p>
              </div>
              <button 
                onClick={() => setEditingItem({ type: 'timeline', number: '', title: '', subtitle: '', text: '', order: timeline.length + 1 })}
                className="px-4 py-2 bg-primary hover:bg-primary/90 text-white font-bold text-xs rounded-full shadow-md flex items-center gap-2"
              >
                <FaPlus /> Add Timeline Stop
              </button>
            </div>

            {/* Editing Form */}
            {editingItem && editingItem.type === 'timeline' && (
              <div className="bg-white p-8 rounded-[2rem] border border-secondary/30 shadow-md">
                <h3 className="text-lg font-black mb-6">{editingItem.id ? 'Edit Stop' : 'Create Timeline Stop'}</h3>
                <form onSubmit={(e) => handleSaveItem(e, 'timeline', saveTimelineStop)} className="flex flex-col gap-4">
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-neutraltext">Date Range *</label>
                      <input 
                        type="text" required name="number" defaultValue={editingItem.number} placeholder="e.g. May 2024 – Feb 2026"
                        className="bg-offwhite/50 border border-gray-200 rounded-xl p-3 text-xs focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-neutraltext">Organization *</label>
                      <input 
                        type="text" required name="title" defaultValue={editingItem.title} placeholder="e.g. Council for Green Revolution"
                        className="bg-offwhite/50 border border-gray-200 rounded-xl p-3 text-xs focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-neutraltext">Role/Title *</label>
                      <input 
                        type="text" required name="subtitle" defaultValue={editingItem.subtitle} placeholder="e.g. Assistant Director"
                        className="bg-offwhite/50 border border-gray-200 rounded-xl p-3 text-xs focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-neutraltext">Order *</label>
                      <input 
                        type="number" required name="order" defaultValue={editingItem.order ?? (timeline.length + 1)} placeholder="e.g. 1"
                        className="bg-offwhite/50 border border-gray-200 rounded-xl p-3 text-xs focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-neutraltext">Role Description *</label>
                    <textarea 
                      required name="text" rows="3" defaultValue={editingItem.text} placeholder="Briefly describe key tasks, projects (e.g. YELP), and achievements."
                      className="w-full bg-offwhite/50 border border-gray-200 rounded-xl p-3 text-xs focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div className="flex justify-end gap-3 mt-4">
                    <button type="button" onClick={() => setEditingItem(null)} className="px-5 py-2 rounded-full border border-gray-200 text-xs font-bold">Cancel</button>
                    <AdminSaveButton loading={loading} label="Save Stop" />
                  </div>
                </form>
              </div>
            )}

            {/* List */}
            <div className="grid grid-cols-1 gap-4">
              {timeline.map((stop, idx) => (
                <div key={stop.id || idx} className="bg-white p-6 rounded-2xl border border-gray-200 flex justify-between items-center shadow-sm">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold font-mono text-primary bg-primary/5 px-3 py-1 rounded-full uppercase tracking-wider">{stop.number}</span>
                      <span className="text-[10px] font-mono text-neutraltext">Order: {stop.order ?? idx + 1}</span>
                    </div>
                    <h3 className="text-base font-black text-charcoal mt-2">{stop.title}</h3>
                    <h4 className="text-xs font-bold text-secondary uppercase tracking-wide">{stop.subtitle}</h4>
                    <p className="text-xs text-neutraltext font-medium mt-2 max-w-2xl leading-relaxed">{stop.text}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button onClick={() => setEditingItem({ type: 'timeline', ...stop })} className="p-2 bg-gray-100 hover:bg-secondary rounded-lg transition-colors text-charcoal"><FaEdit className="w-3.5 h-3.5" /></button>
                    <button onClick={() => handleDeleteItem(stop.id, deleteTimelineStop)} className="p-2 bg-gray-100 hover:bg-primary hover:text-white rounded-lg transition-colors text-charcoal"><FaTrash className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Services Offered Management */}
        {activeTab === 'services' && (
          <div className="flex flex-col gap-8">
            <div className="flex justify-between items-center bg-white p-6 rounded-[1.5rem] border border-gray-200 shadow-sm">
              <div>
                <h2 className="text-xl font-black text-charcoal">Services Offered</h2>
                <p className="text-xs text-neutraltext font-medium mt-1">Manage core services offered by JSR Annamayya.</p>
              </div>
              <button 
                onClick={() => setEditingItem({ type: 'services', data: { title: '', description: '', icon: 'FaLightbulb', order: services.length + 1 } })}
                className="px-4 py-2 bg-primary hover:bg-primary/90 text-white font-bold text-xs rounded-full shadow-md flex items-center gap-2"
              >
                <FaPlus /> Add Service
              </button>
            </div>

            {/* Editing Form */}
            {editingItem && editingItem.type === 'services' && (
              <div className="bg-white p-8 rounded-[2rem] border border-secondary/30 shadow-md">
                <h3 className="text-lg font-black mb-6">{editingItem.id ? 'Edit Service' : 'Create Service'}</h3>
                <form onSubmit={(e) => handleSaveItem(e, 'services', saveService)} className="flex flex-col gap-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-neutraltext">Title *</label>
                      <input 
                        type="text" required name="title" defaultValue={editingItem.title} placeholder="e.g. IEC Campaign Design"
                        className="bg-offwhite/50 border border-gray-200 rounded-xl p-3 text-xs focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-neutraltext">Icon String Name *</label>
                      <input 
                        type="text" required name="icon" defaultValue={editingItem.icon || 'FaLightbulb'} placeholder="e.g. FaLightbulb, FaAward, FaRecycle"
                        className="bg-offwhite/50 border border-gray-200 rounded-xl p-3 text-xs focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-neutraltext">Order *</label>
                      <input 
                        type="number" required name="order" defaultValue={editingItem.order || 1}
                        className="bg-offwhite/50 border border-gray-200 rounded-xl p-3 text-xs focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-neutraltext">Description *</label>
                    <textarea 
                      required name="description" rows="3" defaultValue={editingItem.description} placeholder="Service specialties description..."
                      className="w-full bg-offwhite/50 border border-gray-200 rounded-xl p-3 text-xs focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div className="flex justify-end gap-3 mt-4">
                    <button type="button" onClick={() => setEditingItem(null)} className="px-5 py-2 rounded-full border border-gray-200 text-xs font-bold">Cancel</button>
                    <AdminSaveButton loading={loading} label="Save Service" />
                  </div>
                </form>
              </div>
            )}

            {/* List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((svc, idx) => (
                <div key={svc.id || idx} className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm flex flex-col justify-between p-6">
                  <div>
                    <span className="text-[10px] font-black text-secondary bg-primary/5 border border-primary/20 px-3 py-1 rounded-full uppercase tracking-wider">{svc.icon}</span>
                    <h3 className="text-lg font-black text-charcoal mt-3">{svc.title}</h3>
                    <p className="text-xs text-neutraltext font-medium mt-2 leading-relaxed">{svc.description}</p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                    <span className="text-[10px] font-mono text-neutraltext">Order: {svc.order}</span>
                    <div className="flex items-center gap-2">
                      <button onClick={() => setEditingItem({ type: 'services', ...svc })} className="p-2 bg-white hover:bg-secondary rounded-lg transition-colors text-charcoal border border-gray-200"><FaEdit className="w-3.5 h-3.5" /></button>
                      <button onClick={() => handleDeleteItem(svc.id, deleteService)} className="p-2 bg-white hover:bg-primary hover:text-white rounded-lg transition-colors text-charcoal border border-gray-200"><FaTrash className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Innovations & Technological Solutions Management */}
        {activeTab === 'innovations' && (
          <div className="flex flex-col gap-8">
            <div className="flex justify-between items-center bg-white p-6 rounded-[1.5rem] border border-gray-200 shadow-sm">
              <div>
                <h2 className="text-xl font-black text-charcoal">Innovations & Tech Solutions</h2>
                <p className="text-xs text-neutraltext font-medium mt-1">Manage Innovations & Tech Solutions displayed in the About section.</p>
              </div>
              <button 
                onClick={() => setEditingItem({ type: 'innovations', order: innovations.length + 1 })}
                className="px-4 py-2 bg-primary hover:bg-primary/90 text-white font-bold text-xs rounded-full shadow-md flex items-center gap-2"
              >
                <FaPlus /> Add Innovation
              </button>
            </div>

            {/* Editing Form */}
            {editingItem && editingItem.type === 'innovations' && (
              <div className="bg-white p-8 rounded-[2rem] border border-secondary/30 shadow-md">
                <h3 className="text-lg font-black mb-6">{editingItem.id ? 'Edit Innovation' : 'Create Innovation'}</h3>
                <form onSubmit={(e) => handleSaveItem(e, 'innovations', saveInnovation)} className="flex flex-col gap-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-neutraltext">Title *</label>
                      <input 
                        type="text" required name="title" defaultValue={editingItem.title} placeholder="e.g. Solar Cloth Bag Vending Machine"
                        className="bg-offwhite/50 border border-gray-200 rounded-xl p-3 text-xs focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-neutraltext">Order *</label>
                      <input 
                        type="number" required name="order" defaultValue={editingItem.order || 1}
                        className="bg-offwhite/50 border border-gray-200 rounded-xl p-3 text-xs focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-neutraltext">Description *</label>
                    <textarea 
                      required name="description" rows="3" defaultValue={editingItem.description} placeholder="Innovation details..."
                      className="w-full bg-offwhite/50 border border-gray-200 rounded-xl p-3 text-xs focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div className="flex justify-end gap-3 mt-4">
                    <button type="button" onClick={() => setEditingItem(null)} className="px-5 py-2 rounded-full border border-gray-200 text-xs font-bold">Cancel</button>
                    <AdminSaveButton loading={loading} label="Save Innovation" />
                  </div>
                </form>
              </div>
            )}

            {/* List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {innovations.map((inn, idx) => (
                <div key={inn.id || idx} className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm flex flex-col justify-between p-6">
                  <div>
                    <h3 className="text-lg font-black text-charcoal">{inn.title}</h3>
                    <p className="text-xs text-neutraltext font-medium mt-2 leading-relaxed">{inn.description}</p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                    <span className="text-[10px] font-mono text-neutraltext">Order: {inn.order}</span>
                    <div className="flex items-center gap-2">
                      <button onClick={() => setEditingItem({ type: 'innovations', ...inn })} className="p-2 bg-white hover:bg-secondary rounded-lg transition-colors text-charcoal border border-gray-200"><FaEdit className="w-3.5 h-3.5" /></button>
                      <button onClick={() => handleDeleteItem(inn.id, deleteInnovation)} className="p-2 bg-white hover:bg-primary hover:text-white rounded-lg transition-colors text-charcoal border border-gray-200"><FaTrash className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Collaborations (Departments) Management */}
        {activeTab === 'departments' && (
          <div className="flex flex-col gap-8">
            <div className="flex justify-between items-center bg-white p-6 rounded-[1.5rem] border border-gray-200 shadow-sm">
              <div>
                <h2 className="text-xl font-black text-charcoal">Government Collaborations</h2>
                <p className="text-xs text-neutraltext font-medium mt-1">Manage collaborations with municipal corporations and departments.</p>
              </div>
              <button 
                onClick={() => setEditingItem({ type: 'departments', data: { name: '', logo: '', order: departments.length + 1 } })}
                className="px-4 py-2 bg-primary hover:bg-primary/90 text-white font-bold text-xs rounded-full shadow-md flex items-center gap-2"
              >
                <FaPlus /> Add Collaboration
              </button>
            </div>

            {/* Editing Form */}
            {editingItem && editingItem.type === 'departments' && (
              <div className="bg-white p-8 rounded-[2rem] border border-secondary/30 shadow-md">
                <h3 className="text-lg font-black mb-6">{editingItem.id ? 'Edit Collaboration' : 'Create Collaboration'}</h3>
                <form onSubmit={(e) => handleSaveItem(e, 'departments', saveDepartment)} className="flex flex-col gap-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-neutraltext">Department Name *</label>
                      <input 
                        type="text" required name="name" defaultValue={editingItem.name} placeholder="e.g. Government of Telangana"
                        className="bg-offwhite/50 border border-gray-200 rounded-xl p-3 text-xs focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-neutraltext">Logo Image URL (Optional)</label>
                      <input 
                        type="text" name="logo" defaultValue={editingItem.logo} placeholder="e.g. https://imgbb..."
                        className="bg-offwhite/50 border border-gray-200 rounded-xl p-3 text-xs focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-neutraltext">Order *</label>
                      <input 
                        type="number" required name="order" defaultValue={editingItem.order || 1}
                        className="bg-offwhite/50 border border-gray-200 rounded-xl p-3 text-xs focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-3 mt-4">
                    <button type="button" onClick={() => setEditingItem(null)} className="px-5 py-2 rounded-full border border-gray-200 text-xs font-bold">Cancel</button>
                    <AdminSaveButton loading={loading} label="Save Collaboration" />
                  </div>
                </form>
              </div>
            )}

            {/* List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {departments.map((dept, idx) => (
                <div key={dept.id || idx} className="bg-white rounded-3xl border border-gray-200 p-6 flex flex-col justify-between shadow-sm text-center">
                  <div className="flex flex-col items-center gap-4">
                    {dept.logo ? (
                      <img src={dept.logo} alt={dept.name} className="h-12 w-auto object-contain" />
                    ) : (
                      <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400"><FaBuilding className="w-6 h-6" /></div>
                    )}
                    <h4 className="text-xs font-black uppercase text-charcoal">{dept.name}</h4>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                    <span className="text-[10px] font-mono text-neutraltext">Order: {dept.order}</span>
                    <div className="flex items-center gap-2">
                      <button onClick={() => setEditingItem({ type: 'departments', ...dept })} className="p-1.5 bg-white hover:bg-secondary rounded-lg transition-colors text-charcoal border border-gray-200"><FaEdit className="w-3 h-3" /></button>
                      <button onClick={() => handleDeleteItem(dept.id, deleteDepartment)} className="p-1.5 bg-white hover:bg-primary hover:text-white rounded-lg transition-colors text-charcoal border border-gray-200"><FaTrash className="w-3 h-3" /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Awards & Stats Management */}
        {activeTab === 'awards' && (
          <div className="flex flex-col gap-12">
            
            {/* 1. STATS */}
            <div className="flex flex-col gap-6">
              <div className="flex justify-between items-center bg-white p-6 rounded-[1.5rem] border border-gray-200 shadow-sm">
                <div>
                  <h2 className="text-xl font-black text-charcoal">Capacity Building Stats</h2>
                  <p className="text-xs text-neutraltext font-medium mt-1">Manage training milestone counters (e.g. 15,000+ volunteers).</p>
                </div>
                <button 
                  onClick={() => setEditingItem({ type: 'stats', data: { value: '', label: '' } })}
                  className="px-4 py-2 bg-primary hover:bg-primary/90 text-white font-bold text-xs rounded-full shadow-md flex items-center gap-2"
                >
                  <FaPlus /> Add Stat Counter
                </button>
              </div>

              {editingItem && editingItem.type === 'stats' && (
                <div className="bg-white p-8 rounded-[2rem] border border-secondary/30 shadow-md">
                  <h3 className="text-lg font-black mb-6">{editingItem.id ? 'Edit Stat' : 'Create Stat'}</h3>
                  <form onSubmit={(e) => handleSaveItem(e, 'stats', saveStat)} className="flex flex-col gap-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-neutraltext">Stat Value *</label>
                        <input 
                          type="text" required name="value" defaultValue={editingItem.value} placeholder="e.g. 15,000+"
                          className="bg-offwhite/50 border border-gray-200 rounded-xl p-3 text-xs focus:outline-none focus:border-primary"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-neutraltext">Stat Label *</label>
                        <input 
                          type="text" required name="label" defaultValue={editingItem.label} placeholder="e.g. Ward Volunteers Trained"
                          className="bg-offwhite/50 border border-gray-200 rounded-xl p-3 text-xs focus:outline-none focus:border-primary"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-3 mt-4">
                      <button type="button" onClick={() => setEditingItem(null)} className="px-5 py-2 rounded-full border border-gray-200 text-xs font-bold">Cancel</button>
                      <AdminSaveButton loading={loading} label="Save Stat" />
                    </div>
                  </form>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
                {stats.map((st, idx) => (
                  <div key={st.id || idx} className="bg-white p-5 rounded-2xl border border-gray-200 text-center relative group shadow-sm">
                    <h3 className="text-2xl font-black text-primary">{st.value}</h3>
                    <p className="text-[10px] font-bold text-charcoal mt-1 leading-snug">{st.label}</p>
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 flex gap-1 transition-opacity">
                      <button onClick={() => setEditingItem({ type: 'stats', ...st })} className="p-1 bg-gray-100 hover:bg-secondary rounded text-[9px]"><FaEdit /></button>
                      <button onClick={() => handleDeleteItem(st.id, deleteStat)} className="p-1 bg-gray-100 hover:bg-primary hover:text-white rounded text-[9px]"><FaTrash /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. AWARDS */}
            <div className="flex flex-col gap-6">
              <div className="flex justify-between items-center bg-white p-6 rounded-[1.5rem] border border-gray-200 shadow-sm">
                <div>
                  <h2 className="text-xl font-black text-charcoal">Major Awards & Honours</h2>
                  <p className="text-xs text-neutraltext font-medium mt-1">Manage recognitions (e.g. Vande Bharat Puraskar).</p>
                </div>
                <button 
                  onClick={() => setEditingItem({ type: 'awards', data: { title: '', year: '', issuer: '', desc: '' } })}
                  className="px-4 py-2 bg-primary hover:bg-primary/90 text-white font-bold text-xs rounded-full shadow-md flex items-center gap-2"
                >
                  <FaPlus /> Add Award
                </button>
              </div>

              {editingItem && editingItem.type === 'awards' && (
                <div className="bg-white p-8 rounded-[2rem] border border-secondary/30 shadow-md">
                  <h3 className="text-lg font-black mb-6">{editingItem.id ? 'Edit Award' : 'Create Award'}</h3>
                  <form onSubmit={(e) => handleSaveItem(e, 'awards', saveAward)} className="flex flex-col gap-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-neutraltext">Award Title *</label>
                        <input 
                          type="text" required name="title" defaultValue={editingItem.title} placeholder="e.g. Vande Bharat Puraskar"
                          className="bg-offwhite/50 border border-gray-200 rounded-xl p-3 text-xs focus:outline-none focus:border-primary"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-neutraltext">Award Year *</label>
                        <input 
                          type="text" required name="year" defaultValue={editingItem.year} placeholder="e.g. 2023"
                          className="bg-offwhite/50 border border-gray-200 rounded-xl p-3 text-xs focus:outline-none focus:border-primary"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-neutraltext">Issuer *</label>
                        <input 
                          type="text" required name="issuer" defaultValue={editingItem.issuer} placeholder="e.g. Govt. of Telangana"
                          className="bg-offwhite/50 border border-gray-200 rounded-xl p-3 text-xs focus:outline-none focus:border-primary"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-neutraltext">Description *</label>
                        <textarea 
                          required name="desc" rows="3" defaultValue={editingItem.desc} placeholder="Detailed explanation of the recognition."
                          className="w-full bg-offwhite/50 border border-gray-200 rounded-xl p-3 text-xs focus:outline-none focus:border-primary h-[90px] resize-none"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-neutraltext">Award Photo / Certificate (under 500KB + ImgBB)</label>
                        <input 
                          type="file" accept="image/*" name="imageFile"
                          onChange={handleLocalPreview}
                          className="bg-offwhite/50 border border-gray-200 rounded-xl p-2 text-xs focus:outline-none"
                        />
                        {uploadProgress && (
                        <div className="flex items-center gap-2 mt-2 bg-primary/5 border border-primary/10 rounded-xl p-2 max-w-xs animate-pulse">
                          <svg className="animate-spin h-3.5 w-3.5 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span className="text-[10px] font-bold text-primary uppercase tracking-wider">{uploadProgress}</span>
                        </div>
                      )}
                        {(imagePreviewUrl || editingItem.image) && (
                          <div className="w-12 h-12 rounded-lg overflow-hidden border border-gray-200 mt-1">
                            <img src={imagePreviewUrl || editingItem.image} alt="Preview" className="w-full h-full object-cover" />
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex justify-end gap-3 mt-4">
                      <button type="button" disabled={loading} onClick={() => setEditingItem(null)} className="px-5 py-2 rounded-full border border-gray-200 text-xs font-bold disabled:opacity-50">Cancel</button>
                      <AdminSaveButton loading={loading} label="Save Award" />
                    </div>
                  </form>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {awards.map((aw, idx) => (
                  <div key={aw.id || idx} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex justify-between items-center gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      {aw.image && (
                        <div className="w-14 h-14 rounded-xl overflow-hidden border border-gray-100 shrink-0 shadow-sm">
                          <img src={aw.image} alt={aw.title} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold bg-primary/5 text-primary px-3 py-1 rounded-full">{aw.year}</span>
                          <span className="text-xs font-bold text-neutraltext">{aw.issuer}</span>
                        </div>
                        <h3 className="text-base font-black text-charcoal mt-2">{aw.title}</h3>
                        <p className="text-xs text-neutraltext font-medium mt-1 leading-relaxed">{aw.desc}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button onClick={() => setEditingItem({ type: 'awards', ...aw })} className="p-2 bg-gray-100 hover:bg-secondary rounded-lg transition-colors text-charcoal"><FaEdit className="w-3.5 h-3.5" /></button>
                      <button onClick={() => handleDeleteItem(aw.id, deleteAward)} className="p-2 bg-gray-100 hover:bg-primary hover:text-white rounded-lg transition-colors text-charcoal"><FaTrash className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. INVITED TALKS */}
            <div className="flex flex-col gap-6 border-t pt-8 mt-4">
              <div className="bg-white p-6 rounded-[1.5rem] border border-gray-200 shadow-sm">
                <h2 className="text-xl font-black text-charcoal">Invited Talks & Engagements</h2>
                <p className="text-xs text-neutraltext font-medium mt-1">Manage public speaking locations and guest lecture invites.</p>
                
                <form onSubmit={handleTalksSave} className="flex flex-col gap-4 mt-6">
                  <div className="flex flex-wrap gap-2 mb-3 bg-offwhite/40 p-4 rounded-xl border border-gray-100">
                    {talks.map((talk, idx) => (
                      <span 
                        key={idx}
                        className="px-3 py-1.5 bg-charcoal text-white text-[10px] font-bold rounded-full flex items-center gap-2"
                      >
                        {talk}
                        <button 
                          type="button" 
                          onClick={() => {
                            const updated = talks.filter((_, i) => i !== idx);
                            setTalks(updated);
                          }}
                          className="text-primary hover:text-white"
                        >
                          &times;
                        </button>
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={newTalk}
                      onChange={(e) => setNewTalk(e.target.value)}
                      placeholder="Add new speaking event or institution..."
                      className="flex-1 bg-offwhite/50 border border-gray-200 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-primary"
                    />
                    <button 
                      type="button" 
                      onClick={() => {
                        if (newTalk.trim()) {
                          setTalks([...talks, newTalk.trim()]);
                          setNewTalk('');
                        }
                      }}
                      className="px-4 py-2 bg-secondary text-charcoal font-bold text-xs rounded-xl flex items-center gap-1 hover:bg-secondary/90 shadow-sm"
                    >
                      <FaPlus /> Add Talk
                    </button>
                  </div>

                  <AdminSaveButton loading={loading} label="Save Talks List" />
                </form>
              </div>
            </div>

          </div>
        )}

        {/* Gallery Section Management */}
        {activeTab === 'gallery' && (
          <div className="flex flex-col gap-8">
            <div className="flex justify-between items-center bg-white p-6 rounded-[1.5rem] border border-gray-200 shadow-sm">
              <div>
                <h2 className="text-xl font-black text-charcoal">Achievements Photo Gallery</h2>
                <p className="text-xs text-neutraltext font-medium mt-1">Upload and manage images shown in the gallery section.</p>
              </div>
              <button 
                onClick={() => setEditingItem({ type: 'gallery', data: { image: '', caption: '' } })}
                className="px-4 py-2 bg-primary hover:bg-primary/90 text-white font-bold text-xs rounded-full shadow-md flex items-center gap-2"
              >
                <FaPlus /> Add Gallery Photo
              </button>
            </div>

            {/* Editing Form */}
            {editingItem && editingItem.type === 'gallery' && (
              <div className="bg-white p-8 rounded-[2rem] border border-secondary/30 shadow-md">
                <h3 className="text-lg font-black mb-6">{editingItem.id ? 'Edit Image Info' : 'Upload Gallery Photo'}</h3>
                <form onSubmit={(e) => handleSaveItem(e, 'gallery', saveGalleryImage)} className="flex flex-col gap-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-neutraltext">Caption *</label>
                      <input 
                        type="text" required name="caption" defaultValue={editingItem.caption} placeholder="e.g. Vande Bharat Puraskar award Govt of Telangana"
                        className="bg-offwhite/50 border border-gray-200 rounded-xl p-3 text-xs focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-neutraltext">Image File (Image compressor: under 500KB + ImgBB upload)</label>
                      <input 
                        type="file" accept="image/*" name="imageFile"
                        onChange={handleLocalPreview}
                        className="bg-offwhite/50 border border-gray-200 rounded-xl p-2 text-xs focus:outline-none"
                      />
                      {uploadProgress && (
                        <div className="flex items-center gap-2 mt-2 bg-primary/5 border border-primary/10 rounded-xl p-2 max-w-xs animate-pulse">
                          <svg className="animate-spin h-3.5 w-3.5 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span className="text-[10px] font-bold text-primary uppercase tracking-wider">{uploadProgress}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  {(imagePreviewUrl || editingItem.image) && (
                    <div className="w-24 h-24 rounded-lg overflow-hidden border border-gray-200 mt-2">
                      <img src={imagePreviewUrl || editingItem.image} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="flex justify-end gap-3 mt-4">
                    <button type="button" disabled={loading} onClick={() => setEditingItem(null)} className="px-5 py-2 rounded-full border border-gray-200 text-xs font-bold disabled:opacity-50">Cancel</button>
                    <AdminSaveButton loading={loading} label="Save Image" />
                  </div>
                </form>
              </div>
            )}

            {/* List */}
            <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {gallery.map((img, idx) => (
                <div key={img.id || idx} className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm relative group flex flex-col justify-between">
                  <div className="aspect-square bg-gray-50 overflow-hidden relative">
                    <img src={img.image} alt={img.caption} className="w-full h-full object-cover" />
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 flex gap-1 transition-opacity">
                      <button onClick={() => setEditingItem({ type: 'gallery', ...img })} className="p-1.5 bg-white hover:bg-secondary rounded-lg border border-gray-200 text-xs shadow-sm"><FaEdit /></button>
                      <button onClick={() => handleDeleteItem(img.id, deleteGalleryImage)} className="p-1.5 bg-white hover:bg-primary hover:text-white rounded-lg border border-gray-200 text-xs shadow-sm"><FaTrash /></button>
                    </div>
                  </div>
                  <div className="p-3 border-t border-gray-100 bg-gray-50">
                    <p className="text-[10px] font-bold text-charcoal leading-snug line-clamp-2" title={img.caption}>{img.caption}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Testimonials Management */}
        {activeTab === 'testimonials' && (
          <div className="flex flex-col gap-8 w-full">
            <div className="flex justify-between items-center bg-white p-6 rounded-[1.5rem] border border-gray-200 shadow-sm">
              <div>
                <h2 className="text-xl font-black text-charcoal">Testimonials & Endorsements</h2>
                <p className="text-xs text-neutraltext font-medium mt-1">Manage feedback and recommendations from public commissioners and partners.</p>
              </div>
              <button 
                onClick={() => setEditingItem({ type: 'testimonials', data: { name: '', role: '', organisation: '', quote: '', order: testimonials.length + 1 } })}
                className="px-4 py-2 bg-primary hover:bg-primary/90 text-white font-bold text-xs rounded-full shadow-md flex items-center gap-2"
              >
                <FaPlus /> Add Testimonial
              </button>
            </div>

            {/* Editing Form */}
            {editingItem && editingItem.type === 'testimonials' && (
              <div className="bg-white p-8 rounded-[2rem] border border-secondary/30 shadow-md">
                <h3 className="text-lg font-black mb-6">{editingItem.id ? 'Edit Testimonial' : 'Add Testimonial'}</h3>
                <form onSubmit={(e) => handleSaveItem(e, 'testimonials', saveTestimonial)} className="flex flex-col gap-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-neutraltext">Author Name *</label>
                      <input 
                        type="text" required name="name" defaultValue={editingItem.name} placeholder="e.g. Dr. K. Srinivas Rao, IAS"
                        className="bg-offwhite/50 border border-gray-200 rounded-xl p-3 text-xs focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-neutraltext">Author Role / Title *</label>
                      <input 
                        type="text" required name="role" defaultValue={editingItem.role} placeholder="e.g. Municipal Commissioner, Joint Director"
                        className="bg-offwhite/50 border border-gray-200 rounded-xl p-3 text-xs focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-neutraltext">Organisation / Department</label>
                      <input 
                        type="text" name="organisation" defaultValue={editingItem.organisation} placeholder="e.g. Nellore Municipal Corporation"
                        className="bg-offwhite/50 border border-gray-200 rounded-xl p-3 text-xs focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-neutraltext">Display Order</label>
                      <input 
                        type="number" name="order" defaultValue={editingItem.order}
                        className="bg-offwhite/50 border border-gray-200 rounded-xl p-3 text-xs focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-neutraltext">Quote / Endorsement *</label>
                    <textarea 
                      required name="quote" rows="4" defaultValue={editingItem.quote || editingItem.text} placeholder="Paste the endorsement text here..."
                      className="bg-offwhite/50 border border-gray-200 rounded-xl p-3 text-xs focus:outline-none focus:border-primary resize-none"
                    />
                  </div>

                  <div className="flex justify-end gap-3 mt-4">
                    <button type="button" onClick={() => setEditingItem(null)} className="px-5 py-2 rounded-full border border-gray-200 text-xs font-bold">Cancel</button>
                    <AdminSaveButton loading={loading} label="Save Testimonial" />
                  </div>
                </form>
              </div>
            )}

            {/* List */}
            <div className="grid grid-cols-1 gap-4">
              {testimonials.map((item, idx) => (
                <div key={item.id || idx} className="bg-white p-6 rounded-2xl border border-gray-200 flex justify-between items-center shadow-sm gap-4">
                  <div className="text-left flex-1">
                    <span className="text-[10px] font-bold bg-[#C1440E]/10 text-primary px-3 py-0.5 rounded-full">Testimonial #{item.order || idx + 1}</span>
                    <h3 className="text-base font-black text-charcoal mt-2 leading-snug">{item.name}</h3>
                    <p className="text-[10px] font-bold text-neutraltext/75 uppercase tracking-wider mt-0.5">{item.role} {item.organisation ? `| ${item.organisation}` : ''}</p>
                    <p className="text-xs text-neutraltext font-medium italic mt-3 leading-relaxed bg-offwhite/50 p-4 rounded-xl border border-gray-100">"{item.quote || item.text}"</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 self-start">
                    <button onClick={() => setEditingItem({ type: 'testimonials', ...item })} className="p-2 bg-gray-100 hover:bg-secondary rounded-lg transition-colors text-charcoal" title="Edit Testimonial"><FaEdit className="w-3.5 h-3.5" /></button>
                    <button onClick={() => handleDeleteItem(item.id, deleteTestimonial)} className="p-2 bg-gray-100 hover:bg-primary hover:text-white rounded-lg transition-colors text-charcoal" title="Delete Testimonial"><FaTrash className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Press Coverage Management */}
        {activeTab === 'press' && (
          <div className="flex flex-col gap-8 w-full">
            <div className="flex justify-between items-center bg-white p-6 rounded-[1.5rem] border border-gray-200 shadow-sm">
              <div>
                <h2 className="text-xl font-black text-charcoal">Press Coverage & News</h2>
                <p className="text-xs text-neutraltext font-medium mt-1">Manage articles, clippings, and mentions in the media.</p>
              </div>
              <button 
                onClick={() => setEditingItem({ type: 'press', data: { title: '', source: '', date: '', link: '', image: '', desc: '', order: pressCoverage.length + 1 } })}
                className="px-4 py-2 bg-primary hover:bg-primary/90 text-white font-bold text-xs rounded-full shadow-md flex items-center gap-2"
              >
                <FaPlus /> Add Press Mention
              </button>
            </div>

            {/* Editing Form */}
            {editingItem && editingItem.type === 'press' && (
              <div className="bg-white p-8 rounded-[2rem] border border-secondary/30 shadow-md">
                <h3 className="text-lg font-black mb-6">{editingItem.id ? 'Edit Press Mention' : 'Add Press Mention'}</h3>
                <form onSubmit={(e) => handleSaveItem(e, 'press', savePressItem)} className="flex flex-col gap-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-neutraltext">Article Title *</label>
                      <input 
                        type="text" required name="title" defaultValue={editingItem.title} placeholder="e.g. Swachh Bharat awards presentation Nellore"
                        className="bg-offwhite/50 border border-gray-200 rounded-xl p-3 text-xs focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-neutraltext">Media Source / Newspaper *</label>
                      <input 
                        type="text" required name="source" defaultValue={editingItem.source} placeholder="e.g. Times of India, Eenadu"
                        className="bg-offwhite/50 border border-gray-200 rounded-xl p-3 text-xs focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-neutraltext">Date *</label>
                      <input 
                        type="text" required name="date" defaultValue={editingItem.date} placeholder="e.g. Oct 2024, 2024-05-15"
                        className="bg-offwhite/50 border border-gray-200 rounded-xl p-3 text-xs focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-neutraltext">Article Link / URL</label>
                      <input 
                        type="url" name="link" defaultValue={editingItem.link} placeholder="e.g. https://timesofindia.indiatimes.com/..."
                        className="bg-offwhite/50 border border-gray-200 rounded-xl p-3 text-xs focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-neutraltext">Display Order</label>
                      <input 
                        type="number" name="order" defaultValue={editingItem.order}
                        className="bg-offwhite/50 border border-gray-200 rounded-xl p-3 text-xs focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-neutraltext font-sans">Clipping / Thumbnail Photo (Optional, compressed under 300KB)</label>
                    <input 
                      type="file" accept="image/*" name="imageFile"
                      onChange={handleLocalPreview}
                      className="bg-offwhite/50 border border-gray-200 rounded-xl p-2 text-xs focus:outline-none"
                    />
                    {uploadProgress && (
                        <div className="flex items-center gap-2 mt-2 bg-primary/5 border border-primary/10 rounded-xl p-2 max-w-xs animate-pulse">
                          <svg className="animate-spin h-3.5 w-3.5 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span className="text-[10px] font-bold text-primary uppercase tracking-wider">{uploadProgress}</span>
                        </div>
                      )}
                    {(imagePreviewUrl || editingItem.image) && (
                      <div className="w-24 h-16 rounded-lg overflow-hidden border border-gray-200 mt-2">
                        <img src={imagePreviewUrl || editingItem.image} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-neutraltext">Short Description / Snippet</label>
                    <textarea 
                      name="desc" rows="3" defaultValue={editingItem.desc} placeholder="Write a short summary of the press coverage..."
                      className="bg-offwhite/50 border border-gray-200 rounded-xl p-3 text-xs focus:outline-none focus:border-primary resize-none"
                    />
                  </div>

                  <div className="flex justify-end gap-3 mt-4">
                    <button type="button" disabled={loading} onClick={() => setEditingItem(null)} className="px-5 py-2 rounded-full border border-gray-200 text-xs font-bold disabled:opacity-50">Cancel</button>
                    <AdminSaveButton loading={loading} label="Save Mention" />
                  </div>
                </form>
              </div>
            )}

            {/* List */}
            <div className="grid grid-cols-1 gap-4">
              {pressCoverage.map((item, idx) => (
                <div key={item.id || idx} className="bg-white p-6 rounded-2xl border border-gray-200 flex justify-between items-center shadow-sm gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-20 h-16 rounded-xl overflow-hidden border border-gray-100 shrink-0 shadow-sm bg-[#25221F] flex items-center justify-center">
                      <img 
                        src={item.image || 'https://placehold.co/600x400/1e1b18/e8a33d?text=Press'} 
                        alt="Press Preview" 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    <div className="text-left">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold bg-[#E8A33D]/10 text-[#C1440E] px-2.5 py-0.5 rounded-full">{item.source}</span>
                        <span className="text-[9px] font-bold text-neutraltext/60">{item.date}</span>
                      </div>
                      <h3 className="text-base font-black text-charcoal mt-2 leading-snug">{item.title}</h3>
                      {item.desc && <p className="text-xs text-neutraltext font-medium mt-1 leading-relaxed">{item.desc}</p>}
                      {item.link && (
                        <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-[10px] font-bold text-primary underline mt-2 block hover:text-secondary">Read Article &rarr;</a>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button onClick={() => setEditingItem({ type: 'press', ...item })} className="p-2 bg-gray-100 hover:bg-secondary rounded-lg transition-colors text-charcoal" title="Edit Press"><FaEdit className="w-3.5 h-3.5" /></button>
                    <button onClick={() => handleDeleteItem(item.id, deletePressItem)} className="p-2 bg-gray-100 hover:bg-primary hover:text-white rounded-lg transition-colors text-charcoal" title="Delete Press"><FaTrash className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Case Studies Management */}
        {activeTab === 'caseStudies' && (
          <div className="flex flex-col gap-8">
            <div className="flex justify-between items-center bg-white p-6 rounded-[1.5rem] border border-gray-200 shadow-sm">
              <div>
                <h2 className="text-xl font-black text-charcoal">Case Studies</h2>
                <p className="text-xs text-neutraltext font-medium mt-1">Manage structured governance case studies.</p>
              </div>
              <button 
                onClick={() => setEditingItem({ 
                  type: 'caseStudies', 
                  data: { title: '', organisation: '', dateRange: '', coverImage: '', tags: [], problem: '', objective: '', strategy: '', implementation: '', results: '', lessons: '', order: caseStudies.length + 1 } 
                })}
                className="px-4 py-2 bg-primary hover:bg-primary/90 text-white font-bold text-xs rounded-full shadow-md flex items-center gap-2"
              >
                <FaPlus /> Add Case Study
              </button>
            </div>

            {/* Editing Form */}
            {editingItem && editingItem.type === 'caseStudies' && (
              <div className="bg-white p-8 rounded-[2rem] border border-secondary/30 shadow-md">
                <h3 className="text-lg font-black mb-6">{editingItem.id ? 'Edit Case Study' : 'Create Case Study'}</h3>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.target;
                  const tagsVal = form.tags.value.split(',').map(t => t.trim()).filter(Boolean);
                  const payload = {
                    title: form.title.value,
                    organisation: form.organisation.value,
                    dateRange: form.dateRange.value,
                    coverImage: form.coverImage.value,
                    tags: tagsVal,
                    problem: form.problem.value,
                    objective: form.objective.value,
                    strategy: form.strategy.value,
                    implementation: form.implementation.value,
                    results: form.results.value,
                    lessons: form.lessons.value,
                    order: Number(form.order.value)
                  };
                  if (editingItem.id) payload.id = editingItem.id;
                  handleSaveItemDirect(payload, 'caseStudies', saveCaseStudy);
                }} className="flex flex-col gap-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-neutraltext">Title *</label>
                      <input type="text" required name="title" defaultValue={editingItem.title} className="bg-offwhite/50 border border-gray-200 rounded-xl p-3 text-xs focus:outline-none focus:border-primary" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-neutraltext">Organisation/Location *</label>
                      <input type="text" required name="organisation" defaultValue={editingItem.organisation} className="bg-offwhite/50 border border-gray-200 rounded-xl p-3 text-xs focus:outline-none focus:border-primary" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-neutraltext">Date Range (e.g. 2020 - 2021) *</label>
                      <input type="text" required name="dateRange" defaultValue={editingItem.dateRange} className="bg-offwhite/50 border border-gray-200 rounded-xl p-3 text-xs focus:outline-none focus:border-primary" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-neutraltext">Cover Image URL</label>
                      <input type="text" name="coverImage" defaultValue={editingItem.coverImage} className="bg-offwhite/50 border border-gray-200 rounded-xl p-3 text-xs focus:outline-none focus:border-primary" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-neutraltext">Tags (comma-separated, e.g. SWM, IEC) *</label>
                      <input type="text" required name="tags" defaultValue={editingItem.tags?.join(', ')} className="bg-offwhite/50 border border-gray-200 rounded-xl p-3 text-xs focus:outline-none focus:border-primary" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-neutraltext">Sort Order *</label>
                      <input type="number" required name="order" defaultValue={editingItem.order || 1} className="bg-offwhite/50 border border-gray-200 rounded-xl p-3 text-xs focus:outline-none focus:border-primary" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-neutraltext">Problem *</label>
                      <textarea required name="problem" rows="3" defaultValue={editingItem.problem} className="bg-offwhite/50 border border-gray-200 rounded-xl p-3 text-xs focus:outline-none focus:border-primary" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-neutraltext">Objective *</label>
                      <textarea required name="objective" rows="3" defaultValue={editingItem.objective} className="bg-offwhite/50 border border-gray-200 rounded-xl p-3 text-xs focus:outline-none focus:border-primary" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-neutraltext">Strategy *</label>
                      <textarea required name="strategy" rows="3" defaultValue={editingItem.strategy} className="bg-offwhite/50 border border-gray-200 rounded-xl p-3 text-xs focus:outline-none focus:border-primary" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-neutraltext">Implementation *</label>
                      <textarea required name="implementation" rows="3" defaultValue={editingItem.implementation} className="bg-offwhite/50 border border-gray-200 rounded-xl p-3 text-xs focus:outline-none focus:border-primary" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-neutraltext">Results *</label>
                      <textarea required name="results" rows="3" defaultValue={editingItem.results} className="bg-offwhite/50 border border-gray-200 rounded-xl p-3 text-xs focus:outline-none focus:border-primary" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-neutraltext">Lessons Learned *</label>
                      <textarea required name="lessons" rows="3" defaultValue={editingItem.lessons} className="bg-offwhite/50 border border-gray-200 rounded-xl p-3 text-xs focus:outline-none focus:border-primary" />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 mt-4">
                    <button type="button" onClick={() => setEditingItem(null)} className="px-5 py-2 rounded-full border border-gray-200 text-xs font-bold">Cancel</button>
                    <AdminSaveButton loading={loading} label="Save Case Study" />
                  </div>
                </form>
              </div>
            )}

            {/* List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {caseStudies.map((cs, idx) => (
                <div key={cs.id || idx} className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm flex flex-col justify-between p-6">
                  <div>
                    <div className="flex gap-1.5 flex-wrap">
                      {cs.tags?.map((t, i) => (
                        <span key={i} className="text-[8px] font-black text-secondary bg-primary/5 px-2 py-0.5 rounded-full uppercase">{t}</span>
                      ))}
                    </div>
                    <h3 className="text-lg font-black text-charcoal mt-3">{cs.title}</h3>
                    <p className="text-xs text-neutraltext font-medium mt-1">{cs.organisation} ({cs.dateRange})</p>
                    <p className="text-xs text-neutraltext/70 font-medium mt-2 line-clamp-3">{cs.problem}</p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                    <span className="text-[10px] font-mono text-neutraltext">Order: {cs.order}</span>
                    <div className="flex items-center gap-2">
                      <button onClick={() => setEditingItem({ type: 'caseStudies', ...cs })} className="p-2 bg-white hover:bg-secondary rounded-lg transition-colors text-charcoal border border-gray-200"><FaEdit className="w-3.5 h-3.5" /></button>
                      <button onClick={() => handleDeleteItem(cs.id, deleteCaseStudy)} className="p-2 bg-white hover:bg-primary hover:text-white rounded-lg transition-colors text-charcoal border border-gray-200"><FaTrash className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Career Highlights Management */}
        {activeTab === 'highlights' && (
          <div className="flex flex-col gap-8">
            <div className="flex justify-between items-center bg-white p-6 rounded-[1.5rem] border border-gray-200 shadow-sm">
              <div>
                <h2 className="text-xl font-black text-charcoal">Career Highlights</h2>
                <p className="text-xs text-neutraltext font-medium mt-1">Manage milestone highlight highlights (e.g. National Award Winner).</p>
              </div>
              <button 
                onClick={() => setEditingItem({ type: 'highlights', data: { headline: '', year: '', icon: 'FaTrophy', order: highlights.length + 1 } })}
                className="px-4 py-2 bg-primary hover:bg-primary/90 text-white font-bold text-xs rounded-full shadow-md flex items-center gap-2"
              >
                <FaPlus /> Add Highlight
              </button>
            </div>

            {/* Editing Form */}
            {editingItem && editingItem.type === 'highlights' && (
              <div className="bg-white p-8 rounded-[2rem] border border-secondary/30 shadow-md">
                <h3 className="text-lg font-black mb-6">{editingItem.id ? 'Edit Highlight' : 'Create Highlight'}</h3>
                <form onSubmit={(e) => handleSaveItem(e, 'highlights', saveHighlight)} className="flex flex-col gap-4">
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div className="flex flex-col gap-1 sm:col-span-2">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-neutraltext">Milestone Headline *</label>
                      <input 
                        type="text" required name="headline" defaultValue={editingItem.headline} placeholder="e.g. National Award Winner"
                        className="bg-offwhite/50 border border-gray-200 rounded-xl p-3 text-xs focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-neutraltext">Year (Optional)</label>
                      <input 
                        type="text" name="year" defaultValue={editingItem.year} placeholder="e.g. 2023"
                        className="bg-offwhite/50 border border-gray-200 rounded-xl p-3 text-xs focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-neutraltext">Icon String Name *</label>
                      <input 
                        type="text" required name="icon" defaultValue={editingItem.icon || 'FaTrophy'} placeholder="e.g. FaTrophy, FaAward, FaBuilding"
                        className="bg-offwhite/50 border border-gray-200 rounded-xl p-3 text-xs focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-neutraltext">Order *</label>
                      <input 
                        type="number" required name="order" defaultValue={editingItem.order || 1}
                        className="bg-offwhite/50 border border-gray-200 rounded-xl p-3 text-xs focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-3 mt-4">
                    <button type="button" onClick={() => setEditingItem(null)} className="px-5 py-2 rounded-full border border-gray-200 text-xs font-bold">Cancel</button>
                    <AdminSaveButton loading={loading} label="Save Highlight" />
                  </div>
                </form>
              </div>
            )}

            {/* List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {highlights.map((hl, idx) => (
                <div key={hl.id || idx} className="bg-white rounded-3xl border border-gray-200 p-6 flex flex-col justify-between shadow-sm">
                  <div>
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-black text-secondary bg-primary/5 px-3 py-1 rounded-full uppercase tracking-wider">{hl.icon}</span>
                      {hl.year && <span className="text-[9px] font-mono text-neutraltext font-bold">{hl.year}</span>}
                    </div>
                    <h3 className="text-base font-black text-charcoal mt-3">{hl.headline}</h3>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                    <span className="text-[10px] font-mono text-neutraltext">Order: {hl.order}</span>
                    <div className="flex items-center gap-2">
                      <button onClick={() => setEditingItem({ type: 'highlights', ...hl })} className="p-2 bg-white hover:bg-secondary rounded-lg transition-colors text-charcoal border border-gray-200"><FaEdit className="w-3 h-3" /></button>
                      <button onClick={() => handleDeleteItem(hl.id, deleteHighlight)} className="p-2 bg-white hover:bg-primary hover:text-white rounded-lg transition-colors text-charcoal border border-gray-200"><FaTrash className="w-3 h-3" /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* General Settings Management */}
        {activeTab === 'settings' && (
          <div className="max-w-2xl bg-white p-8 md:p-10 rounded-[2rem] border border-gray-200 shadow-sm">
            <h2 className="text-2xl font-black mb-6 border-b pb-3">General & Footer Settings</h2>
            <form onSubmit={handleContactSettingsSave} className="flex flex-col gap-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-neutraltext">Email Address *</label>
                  <input 
                    type="email" required
                    value={contactSettings.email}
                    onChange={(e) => setContactSettings({ ...contactSettings, email: e.target.value })}
                    className="w-full bg-offwhite/50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary transition-all"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-neutraltext">Phone Number *</label>
                  <input 
                    type="text" required
                    value={contactSettings.phone}
                    onChange={(e) => setContactSettings({ ...contactSettings, phone: e.target.value })}
                    className="w-full bg-offwhite/50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary transition-all"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-neutraltext">Office Address *</label>
                  <input 
                    type="text" required
                    value={contactSettings.address}
                    onChange={(e) => setContactSettings({ ...contactSettings, address: e.target.value })}
                    className="w-full bg-offwhite/50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary transition-all"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-neutraltext">Experience Text *</label>
                  <input 
                    type="text" required
                    value={contactSettings.experienceYears}
                    onChange={(e) => setContactSettings({ ...contactSettings, experienceYears: e.target.value })}
                    className="w-full bg-offwhite/50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary transition-all"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3 border-t pt-4">
                <label className="text-xs font-bold uppercase tracking-wider text-neutraltext">SWM / IEC Specialties (Shown in Footer)</label>
                <div className="flex flex-wrap gap-2 mb-3 bg-offwhite/40 p-4 rounded-xl border border-gray-100">
                  {contactSettings.specialties && contactSettings.specialties.map((spec, idx) => (
                    <span 
                      key={idx}
                      className="px-3 py-1 bg-charcoal text-white text-[10px] font-bold rounded-full flex items-center gap-2"
                    >
                      {spec}
                      <button 
                        type="button" 
                        onClick={() => {
                          const updated = contactSettings.specialties.filter((_, i) => i !== idx);
                          setContactSettings({ ...contactSettings, specialties: updated });
                        }}
                        className="text-primary hover:text-white"
                      >
                        &times;
                      </button>
                    </span>
                  ))}
                </div>
                
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={newSpecialty}
                    onChange={(e) => setNewSpecialty(e.target.value)}
                    placeholder="Add new specialty chip..."
                    className="flex-1 bg-offwhite/50 border border-gray-200 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-primary"
                  />
                  <button 
                    type="button" 
                    onClick={() => {
                      if (newSpecialty.trim()) {
                        setContactSettings({ ...contactSettings, specialties: [...(contactSettings.specialties || []), newSpecialty.trim()] });
                        setNewSpecialty('');
                      }
                    }}
                    className="px-4 py-2 bg-secondary text-charcoal font-bold text-xs rounded-xl flex items-center gap-1 hover:bg-secondary/90 shadow-sm"
                  >
                    <FaPlus /> Add
                  </button>
                </div>
              </div>

              <AdminSaveButton loading={loading} label="Save Settings Changes" className="py-3 mt-4" />
            </form>
          </div>
        )}

        {/* Contact Messages Management */}
        {activeTab === 'messages' && (
          <div className="flex flex-col gap-8 w-full">
            <div className="flex justify-between items-center bg-white p-6 rounded-[1.5rem] border border-gray-200 shadow-sm">
              <div>
                <h2 className="text-xl font-black text-charcoal">Contact Messages</h2>
                <p className="text-xs text-neutraltext font-medium mt-1">Review contact form submissions received from the website.</p>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              {messages.length === 0 ? (
                <div className="bg-white p-12 rounded-[2rem] border border-gray-200 text-center text-sm text-neutraltext font-medium shadow-sm">
                  No messages received yet.
                </div>
              ) : (
                messages.map((msg) => (
                  <div key={msg.id} className="bg-white p-6 md:p-8 rounded-[2rem] border border-gray-200 shadow-sm flex flex-col sm:flex-row justify-between items-start gap-4">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="text-sm font-black text-charcoal">{msg.name}</span>
                        {msg.organisation && (
                          <span className="text-[10px] font-bold bg-charcoal/5 border border-charcoal/10 text-neutraltext px-2 py-0.5 rounded-full">
                            {msg.organisation}
                          </span>
                        )}
                        <span className="text-[9px] font-mono text-neutraltext/60 ml-auto sm:ml-0">
                          {new Date(msg.createdAt).toLocaleString()}
                        </span>
                      </div>
                      
                      <div className="text-xs font-bold text-primary mb-3 flex flex-wrap gap-4 text-left">
                        <span>Email: <a href={`mailto:${msg.email}`} className="underline hover:text-secondary">{msg.email}</a></span>
                        {msg.phone && <span>Phone: <a href={`tel:${msg.phone}`} className="underline hover:text-secondary">{msg.phone}</a></span>}
                      </div>
                      
                      <p className="text-xs md:text-sm text-neutraltext font-medium leading-relaxed bg-offwhite/50 p-4 rounded-xl border border-gray-100 whitespace-pre-line text-left">
                        {msg.message}
                      </p>
                    </div>
                    
                    <div className="flex sm:flex-col gap-2 shrink-0 self-end sm:self-start">
                      {msg.phone && (
                        <a 
                          href={`https://wa.me/${msg.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${msg.name}, thank you for reaching out via my portfolio. `)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2.5 bg-green-50 hover:bg-green-600 hover:text-white rounded-xl transition-all duration-300 text-green-600 border border-green-200 flex items-center justify-center"
                          title="Reply on WhatsApp"
                        >
                          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.504-5.713-1.465L0 24zm6.602-4.22c1.682.998 3.486 1.527 5.398 1.528 5.485 0 9.948-4.464 9.95-9.953.001-2.659-1.034-5.159-2.916-7.042C17.209 2.43 14.71 1.393 12.007 1.393 6.525 1.393 2.06 5.857 2.057 11.34c-.001 1.917.501 3.791 1.454 5.437L2.457 21.6l4.202-1.101zM17.92 14.65c-.328-.164-1.94-.959-2.242-1.07-.301-.11-.52-.164-.739.164-.219.329-.848 1.07-1.039 1.29-.192.218-.383.245-.71.081-.328-.164-1.385-.51-2.637-1.63-1.026-.917-1.635-2.055-1.837-2.383-.203-.328-.022-.506.141-.669.147-.147.329-.383.493-.575.163-.191.218-.328.328-.547.11-.219.055-.41-.027-.574-.082-.164-.739-1.777-1.012-2.434-.267-.64-.56-.553-.767-.563-.199-.01-.427-.012-.656-.012-.23 0-.603.086-.918.427-.315.34-1.203 1.176-1.203 2.87 0 1.694 1.231 3.326 1.403 3.555.172.229 2.422 3.699 5.867 5.185.819.353 1.458.564 1.957.722.823.261 1.57.224 2.161.137.66-.099 1.94-.794 2.215-1.56.275-.767.275-1.423.192-1.56-.082-.136-.301-.218-.629-.382z"/>
                          </svg>
                        </a>
                      )}
                      <button 
                        onClick={() => handleDeleteMessage(msg.id)}
                        className="p-2.5 bg-gray-50 hover:bg-primary hover:text-white rounded-xl transition-colors text-charcoal border border-gray-200 flex items-center justify-center border-none"
                        title="Delete Message"
                      >
                        <FaTrash className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Chatbot Knowledge Base Management */}
        {activeTab === 'chatbot' && (
          <div className="flex flex-col gap-8 w-full">
            <div className="flex justify-between items-center bg-white p-6 md:p-8 rounded-[1.5rem] border border-gray-200 shadow-sm flex-wrap gap-4">
              <div>
                <h2 className="text-xl font-black text-charcoal flex items-center gap-2">
                  <FaRobot className="text-secondary" /> Chatbot Knowledge Base (FAQ)
                </h2>
                <p className="text-xs text-neutraltext font-medium mt-1">
                  Manage the questions, keywords, and answers that the JSR Assistant uses to match user queries locally.
                </p>
              </div>
              <button
                onClick={() => setEditingItem({ type: 'chatbot', data: { question: '', keywords: '', answer: '', link: '' } })}
                className="px-5 py-2.5 bg-primary hover:bg-primary/95 text-white font-bold text-xs rounded-full shadow-md flex items-center gap-2 transition-all"
              >
                <FaPlus /> Add New FAQ
              </button>
            </div>

            {editingItem && editingItem.type === 'chatbot' && (
              <div className="bg-white p-8 rounded-[2rem] border border-secondary/35 shadow-md">
                <h3 className="text-lg font-black mb-6">{editingItem.data.id ? 'Edit FAQ Entry' : 'Create FAQ Entry'}</h3>
                <form 
                  onSubmit={(e) => handleSaveItem(e, 'chatbot', editingItem.data.id ? (data) => updateChatbotKBEntry(editingItem.data.id, data) : addChatbotKBEntry)} 
                  className="flex flex-col gap-5"
                >
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-neutraltext">Primary Question *</label>
                    <input 
                      type="text" required name="question" defaultValue={editingItem.data.question} placeholder="e.g. What does JSR Annamayya do?"
                      className="bg-offwhite/50 border border-gray-200 rounded-xl p-3.5 text-xs focus:outline-none focus:border-primary font-medium"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-neutraltext">Keywords (Comma Separated) *</label>
                    <input 
                      type="text" required name="keywords" defaultValue={editingItem.data.keywords} placeholder="e.g. who is he, what does he do, role, profession"
                      className="bg-offwhite/50 border border-gray-200 rounded-xl p-3.5 text-xs focus:outline-none focus:border-primary font-medium"
                    />
                    <p className="text-[9px] text-neutraltext font-medium mt-1">Fuzzy search matches these words/phrases to trigger this answer.</p>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-neutraltext">Answer Content *</label>
                    <textarea 
                      required name="answer" defaultValue={editingItem.data.answer} rows={4} placeholder="Write the answer that the chatbot will display..."
                      className="bg-offwhite/50 border border-gray-200 rounded-xl p-3.5 text-xs focus:outline-none focus:border-primary leading-relaxed font-medium"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-neutraltext">Optional Section Anchor Link</label>
                    <select 
                      name="link" defaultValue={editingItem.data.link || ''}
                      className="bg-offwhite/50 border border-gray-200 rounded-xl p-3.5 text-xs focus:outline-none focus:border-primary font-bold text-neutraltext"
                    >
                      <option value="">None</option>
                      <option value="#about">About (#about)</option>
                      <option value="#experience">Career Journey (#experience)</option>
                      <option value="#impact">Impact & Awards (#impact)</option>
                      <option value="#case-studies">Case Studies (#case-studies)</option>
                      <option value="#services">Services Offered (#services)</option>
                      <option value="#collaborations">Collaborations (#collaborations)</option>
                      <option value="#highlights">Highlights (#highlights)</option>
                      <option value="#contact">Contact (#contact)</option>
                    </select>
                    <p className="text-[9px] text-neutraltext font-medium mt-1">Surfaces a call-to-action button in the chat bubbles to scroll the user to this page anchor.</p>
                  </div>

                  <div className="flex justify-end gap-3 mt-4">
                    <button type="button" onClick={() => setEditingItem(null)} className="px-5 py-2.5 rounded-full border border-gray-200 text-xs font-bold transition-all">Cancel</button>
                    <AdminSaveButton loading={loading} label="Save FAQ Entry" />
                  </div>
                </form>
              </div>
            )}

            <div className="bg-white rounded-[2rem] border border-gray-200 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 text-left text-xs font-sans">
                  <thead className="bg-gray-50 text-neutraltext font-black uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-4">Question</th>
                      <th className="px-6 py-4">Keywords</th>
                      <th className="px-6 py-4">Answer</th>
                      <th className="px-6 py-4">Link</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white">
                    {chatbotKB.map((entry) => (
                      <tr key={entry.id} className="hover:bg-gray-50/50">
                        <td className="px-6 py-4 font-black text-charcoal max-w-[200px] truncate">{entry.question}</td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1">
                            {entry.keywords && entry.keywords.map((kw, i) => (
                              <span key={i} className="px-2 py-0.5 bg-secondary/15 text-secondary border border-secondary/30 font-bold rounded text-[9px] uppercase tracking-wider">{kw}</span>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-neutraltext max-w-[300px] truncate leading-relaxed">{entry.answer}</td>
                        <td className="px-6 py-4 font-bold text-[#E8A33D]">{entry.link || 'None'}</td>
                        <td className="px-6 py-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setEditingItem({ type: 'chatbot', data: { ...entry, keywords: Array.isArray(entry.keywords) ? entry.keywords.join(', ') : entry.keywords } })}
                              className="p-2.5 bg-gray-50 hover:bg-[#E8A33D]/10 text-charcoal hover:text-[#E8A33D] rounded-xl transition-colors border border-gray-100"
                              title="Edit FAQ"
                            >
                              <FaEdit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteItem(entry.id, deleteChatbotKBEntry)}
                              className="p-2.5 bg-gray-50 hover:bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-xl transition-all border border-gray-100"
                              title="Delete FAQ"
                            >
                              <FaTrash className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Vision & Leadership Management */}
        {activeTab === 'vision' && (
          <div className="flex flex-col gap-8 w-full">
            <div className="flex justify-between items-center bg-white p-6 rounded-[1.5rem] border border-gray-200 shadow-sm flex-wrap gap-4">
              <div>
                <h2 className="text-xl font-black text-charcoal">Vision & Leadership Blocks</h2>
                <p className="text-xs text-neutraltext font-medium mt-1">Manage the 4 editorial blocks featured on the Homepage direction section.</p>
              </div>
              <button 
                onClick={() => setEditingItem({ type: 'vision', number: `0${vision.length + 1}`, title: '', paragraph: '', image: '', order: vision.length + 1 })}
                className="px-4 py-2 bg-primary hover:bg-primary/90 text-white font-bold text-xs rounded-full shadow-md flex items-center gap-2"
              >
                <FaPlus /> Add Block
              </button>
            </div>

            {editingItem && editingItem.type === 'vision' && (
              <div className="bg-white p-8 rounded-[2rem] border border-secondary/35 shadow-md max-w-2xl text-left">
                <h3 className="text-lg font-black mb-6">{editingItem.id ? 'Edit Vision Block' : 'Create Vision Block'}</h3>
                <form onSubmit={(e) => handleSaveItem(e, 'vision', saveVisionBlock)} className="flex flex-col gap-5">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-neutraltext font-mono">Block Number *</label>
                      <input 
                        type="text" required name="number" defaultValue={editingItem.number} placeholder="e.g. 01"
                        className="bg-offwhite/50 border border-gray-200 rounded-xl p-3 text-xs focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5 col-span-2">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-neutraltext font-mono">Title *</label>
                      <input 
                        type="text" required name="title" defaultValue={editingItem.title} placeholder="e.g. Behaviour Change"
                        className="bg-offwhite/50 border border-gray-200 rounded-xl p-3 text-xs focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-neutraltext font-mono">Paragraph Description *</label>
                    <textarea 
                      required name="paragraph" rows="3" defaultValue={editingItem.paragraph} placeholder="Enter block explanation paragraph..."
                      className="w-full bg-offwhite/50 border border-gray-200 rounded-xl p-3 text-xs focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-neutraltext font-mono">Block Illustration Image</label>
                    <input 
                      type="file" name="imageFile" accept="image/*"
                      className="bg-offwhite/50 border border-gray-200 rounded-xl p-2 text-xs focus:outline-none"
                    />
                    {editingItem.image && (
                      <div className="w-32 aspect-[16/10] rounded-lg overflow-hidden border border-gray-200 mt-2">
                        <img src={editingItem.image} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end gap-3 mt-4">
                    <button type="button" onClick={() => setEditingItem(null)} className="px-5 py-2.5 rounded-full border border-gray-200 text-xs font-bold">Cancel</button>
                    <AdminSaveButton loading={loading} label="Save Vision Block" />
                  </div>
                </form>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {vision.map((v, idx) => (
                <div key={v.id || idx} className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm flex flex-col justify-between p-6 text-left">
                  <div>
                    {v.image && (
                      <div className="w-full aspect-[16/10] rounded-2xl overflow-hidden border mb-4 bg-gray-50">
                        <img src={v.image} alt={v.title} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <span className="text-[10px] font-black text-secondary bg-primary/5 border border-primary/20 px-3 py-1 rounded-full uppercase tracking-wider">{v.number}</span>
                    <h3 className="text-lg font-black text-charcoal mt-3">{v.title}</h3>
                    <p className="text-xs text-neutraltext font-medium mt-2 leading-relaxed">{v.paragraph}</p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                    <span className="text-[10px] font-mono text-neutraltext">Order: {v.order || idx + 1}</span>
                    <div className="flex items-center gap-2">
                      <button onClick={() => setEditingItem({ type: 'vision', ...v })} className="p-2.5 bg-gray-50 hover:bg-[#E8A33D]/10 text-charcoal hover:text-[#E8A33D] rounded-xl border border-gray-100"><FaEdit className="w-3.5 h-3.5" /></button>
                      <button onClick={() => handleDeleteItem(v.id, deleteVisionBlock)} className="p-2.5 bg-gray-50 hover:bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-xl border border-gray-100"><FaTrash className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills Graphs Management */}
        {activeTab === 'skills' && (
          <div className="flex flex-col gap-8 w-full">
            <div className="flex justify-between items-center bg-white p-6 rounded-[1.5rem] border border-gray-200 shadow-sm flex-wrap gap-4">
              <div>
                <h2 className="text-xl font-black text-charcoal">Skills Graphs</h2>
                <p className="text-xs text-neutraltext font-medium mt-1">Configure competencies names and progress metrics (%) displayed on the Homepage and Projects page.</p>
              </div>
              <button 
                onClick={() => setEditingItem({ type: 'skills', label: '', targetPercentage: 100, order: skills.length + 1 })}
                className="px-4 py-2 bg-primary hover:bg-primary/90 text-white font-bold text-xs rounded-full shadow-md flex items-center gap-2"
              >
                <FaPlus /> Add Skill
              </button>
            </div>

            {editingItem && editingItem.type === 'skills' && (
              <div className="bg-white p-8 rounded-[2rem] border border-secondary/35 shadow-md max-w-xl text-left">
                <h3 className="text-lg font-black mb-6">{editingItem.id ? 'Edit Skill' : 'Create Skill'}</h3>
                <form onSubmit={(e) => handleSaveItem(e, 'skills', saveSkill)} className="flex flex-col gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-neutraltext font-mono">Skill Name *</label>
                    <input 
                      type="text" required name="label" defaultValue={editingItem.label} placeholder="e.g. Behaviour Change Communication"
                      className="bg-offwhite/50 border border-gray-200 rounded-xl p-3 text-xs focus:outline-none focus:border-primary"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-neutraltext font-mono">Progress Percentage (0-100) *</label>
                      <input 
                        type="number" required min="0" max="100" name="targetPercentage" defaultValue={editingItem.targetPercentage}
                        className="bg-offwhite/50 border border-gray-200 rounded-xl p-3 text-xs focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-neutraltext font-mono">Order Index *</label>
                      <input 
                        type="number" required name="order" defaultValue={editingItem.order || 1}
                        className="bg-offwhite/50 border border-gray-200 rounded-xl p-3 text-xs focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 mt-4">
                    <button type="button" onClick={() => setEditingItem(null)} className="px-5 py-2.5 rounded-full border border-gray-200 text-xs font-bold">Cancel</button>
                    <AdminSaveButton loading={loading} label="Save Skill" />
                  </div>
                </form>
              </div>
            )}

            <div className="bg-white rounded-[2rem] border border-gray-200 overflow-hidden shadow-sm text-left font-sans">
              <div className="p-6 border-b">
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutraltext">Active Circular Skills Progress</span>
              </div>
              <div className="divide-y divide-gray-100">
                {skills.map((s, idx) => (
                  <div key={s.id || idx} className="flex justify-between items-center p-5 hover:bg-gray-50/50">
                    <div className="flex flex-col gap-1">
                      <h4 className="text-sm font-black text-charcoal">{s.label}</h4>
                      <span className="text-[10px] text-neutraltext font-mono">Order: {s.order || idx + 1}</span>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-secondary" style={{ width: `${s.targetPercentage || s.target || 100}%` }}></div>
                        </div>
                        <span className="text-xs font-bold text-charcoal">{s.targetPercentage || s.target || 100}%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => setEditingItem({ type: 'skills', targetPercentage: s.targetPercentage || s.target || 100, ...s })} className="p-2 bg-gray-50 hover:bg-[#E8A33D]/10 text-charcoal hover:text-[#E8A33D] rounded-lg border border-gray-100"><FaEdit className="w-3.5 h-3.5" /></button>
                        <button onClick={() => handleDeleteItem(s.id, deleteSkill)} className="p-2 bg-gray-50 hover:bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-lg border border-gray-100"><FaTrash className="w-3.5 h-3.5" /></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Ongoing Development Management */}
        {activeTab === 'development' && (
          <div className="flex flex-col gap-8 w-full">
            <div className="flex justify-between items-center bg-white p-6 rounded-[1.5rem] border border-gray-200 shadow-sm flex-wrap gap-4">
              <div>
                <h2 className="text-xl font-black text-charcoal">Ongoing Development & Lectures</h2>
                <p className="text-xs text-neutraltext font-medium mt-1">Manage invited lectures, circular economy forums, and state panels displayed on the Professional Profile page.</p>
              </div>
              <button 
                onClick={() => setEditingItem({ type: 'development', year: '', program: '', institution: '', description: '', order: development.length + 1 })}
                className="px-4 py-2 bg-primary hover:bg-primary/90 text-white font-bold text-xs rounded-full shadow-md flex items-center gap-2"
              >
                <FaPlus /> Add Lecture/Forum
              </button>
            </div>

            {editingItem && editingItem.type === 'development' && (
              <div className="bg-white p-8 rounded-[2rem] border border-secondary/35 shadow-md max-w-2xl text-left">
                <h3 className="text-lg font-black mb-6">{editingItem.id ? 'Edit Lecture / Forum' : 'Create Lecture / Forum'}</h3>
                <form onSubmit={(e) => handleSaveItem(e, 'development', saveDevelopment)} className="flex flex-col gap-5">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-neutraltext font-mono">Year *</label>
                      <input 
                        type="text" required name="year" defaultValue={editingItem.year} placeholder="e.g. 2024 or ONGOING"
                        className="bg-offwhite/50 border border-gray-200 rounded-xl p-3 text-xs focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5 col-span-2">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-neutraltext font-mono">Forum/Program Title *</label>
                      <input 
                        type="text" required name="program" defaultValue={editingItem.program} placeholder="e.g. India Circular Economy Forum"
                        className="bg-offwhite/50 border border-gray-200 rounded-xl p-3 text-xs focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-neutraltext font-mono">Location/Institution *</label>
                      <input 
                        type="text" required name="institution" defaultValue={editingItem.institution} placeholder="e.g. New Delhi"
                        className="bg-offwhite/50 border border-gray-200 rounded-xl p-3 text-xs focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-neutraltext font-mono">Order Index *</label>
                      <input 
                        type="number" required name="order" defaultValue={editingItem.order || 1}
                        className="bg-offwhite/50 border border-gray-200 rounded-xl p-3 text-xs focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-neutraltext font-mono">Description *</label>
                    <textarea 
                      required name="description" rows="3" defaultValue={editingItem.description} placeholder="Enter details of your presentation or guest lecture..."
                      className="w-full bg-offwhite/50 border border-gray-200 rounded-xl p-3 text-xs focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div className="flex justify-end gap-3 mt-4">
                    <button type="button" onClick={() => setEditingItem(null)} className="px-5 py-2.5 rounded-full border border-gray-200 text-xs font-bold">Cancel</button>
                    <AdminSaveButton loading={loading} label="Save Item" />
                  </div>
                </form>
              </div>
            )}

            <div className="bg-white rounded-[2rem] border border-gray-200 overflow-hidden shadow-sm text-left">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 text-xs font-sans">
                  <thead className="bg-gray-50 text-neutraltext font-black uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-4">Year</th>
                      <th className="px-6 py-4">Program / Lecture</th>
                      <th className="px-6 py-4">Institution / Location</th>
                      <th className="px-6 py-4">Description</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white">
                    {development.map((item, idx) => (
                      <tr key={item.id || idx} className="hover:bg-gray-50/50">
                        <td className="px-6 py-4 font-bold text-secondary font-mono">{item.year}</td>
                        <td className="px-6 py-4 font-black text-charcoal">{item.program}</td>
                        <td className="px-6 py-4 font-semibold text-neutraltext">{item.institution}</td>
                        <td className="px-6 py-4 text-neutraltext max-w-xs truncate leading-relaxed">{item.description}</td>
                        <td className="px-6 py-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => setEditingItem({ type: 'development', ...item })} className="p-2.5 bg-gray-50 hover:bg-[#E8A33D]/10 text-charcoal hover:text-[#E8A33D] rounded-xl border border-gray-100"><FaEdit className="w-3.5 h-3.5" /></button>
                            <button onClick={() => handleDeleteItem(item.id, deleteDevelopment)} className="p-2.5 bg-gray-50 hover:bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-xl border border-gray-100"><FaTrash className="w-3.5 h-3.5" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Real-time Notification Toast Overlay */}
      {showToast && toastMessage && (
        <div className="fixed bottom-6 right-6 z-[100000] bg-[#25221F] border border-white/10 text-white rounded-2xl p-5 shadow-2xl max-w-sm w-full animate-slide-in flex flex-col gap-3">
          <div className="flex justify-between items-center border-b border-white/5 pb-2">
            <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">New message received</span>
            <button onClick={() => setShowToast(false)} className="text-white/40 hover:text-white text-xs font-bold">&times;</button>
          </div>
          <div className="text-left">
            <h4 className="text-sm font-black text-white">{toastMessage.name}</h4>
            {toastMessage.organisation && <span className="text-[9px] font-bold text-white/50">{toastMessage.organisation}</span>}
            <p className="text-xs text-white/70 mt-2 line-clamp-2 leading-relaxed bg-white/5 p-2.5 rounded-lg">{toastMessage.message}</p>
          </div>
          <button 
            onClick={() => { navigate('/admin/messages'); setUnreadCount(0); setShowToast(false); }}
            className="w-full py-2 bg-primary hover:bg-primary/95 text-white font-bold text-xs rounded-xl shadow-md transition-all uppercase tracking-wider"
          >
            View in Messages
          </button>
        </div>
      )}
      {/* Admin Operations Toast */}
      {adminToast && (
        <div className={`fixed bottom-6 right-6 z-[100000] text-white rounded-2xl p-4 shadow-2xl max-w-sm flex items-center justify-between gap-3 border transition-all duration-300 ${adminToast.isError ? 'bg-red-600 border-red-500' : 'bg-green-600 border-green-500'}`}>
          <div className="flex items-center gap-2 text-left">
            <span className="text-xs font-bold font-sans">{adminToast.text}</span>
          </div>
          <button onClick={() => setAdminToast(null)} className="text-white/60 hover:text-white text-sm font-bold">&times;</button>
        </div>
      )}
    </div>
  );
};

export default Admin;

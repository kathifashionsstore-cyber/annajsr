import React, { useEffect, useRef, useState } from 'react';
import { FaVolumeMute, FaVolumeUp } from 'react-icons/fa';
import { logAnalyticsEvent } from '../services/portfolioService';

const REELS = [
  { id: 'reel-1', src: '/videos/reel-1.mp4', title: 'Solid Waste Awareness', desc: 'Door-to-door SWM campaigns.' },
  { id: 'reel-2', src: '/videos/reel-2.mp4', title: 'Youth Earth Leadership', desc: 'State-wide climate action workshops.' },
  { id: 'reel-3', src: '/videos/reel-3.mp4', title: 'Safai Mitra Engagement', desc: 'Worker safety training in Nellore.' },
  { id: 'reel-4', src: '/videos/reel-4.mp4', title: 'ATB Cloth Bag Vending', desc: 'UNDP plastic reduction showcase.' }
];

const ReelCard = ({ reel }) => {
  const videoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const handlePlayState = () => {
      const isMobile = window.innerWidth < 768;
      if (!isMobile) {
        if (videoRef.current) {
          videoRef.current.play()
            .then(() => setIsPlaying(true))
            .catch(() => setIsPlaying(false));
        }
        return;
      }

      // Mobile: IntersectionObserver to autoplay only when 60% in view
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (videoRef.current) {
            if (entry.isIntersecting) {
              videoRef.current.play()
                .then(() => setIsPlaying(true))
                .catch(() => setIsPlaying(false));
            } else {
              videoRef.current.pause();
              setIsPlaying(false);
            }
          }
        },
        { threshold: 0.6 }
      );

      if (videoRef.current) {
        observer.observe(videoRef.current);
      }

      return () => {
        if (videoRef.current) {
          observer.unobserve(videoRef.current);
        }
      };
    };

    handlePlayState();
    window.addEventListener('resize', handlePlayState);
    return () => window.removeEventListener('resize', handlePlayState);
  }, []);

  const toggleMute = (e) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
      logAnalyticsEvent({
        type: 'video_reel_mute_toggle',
        reelId: reel.id,
        muted: videoRef.current.muted
      });
    }
  };

  const handleVideoClick = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play()
          .then(() => setIsPlaying(true))
          .catch(() => setIsPlaying(false));
      }
    }
  };

  return (
    <div 
      className="relative flex-none w-[260px] sm:w-[280px] md:w-full aspect-[9/16] rounded-3xl overflow-hidden bg-charcoal/50 border border-white/5 shadow-2xl group cursor-pointer snap-center"
      onClick={handleVideoClick}
    >
      {hasError ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-charcoal/90 text-white">
          <FaVolumeMute className="w-12 h-12 text-white/20 mb-4" />
          <h4 className="text-sm font-bold text-white">{reel.title}</h4>
          <p className="text-[11px] text-white/40 mt-1">{reel.desc}</p>
        </div>
      ) : (
        <video
          ref={videoRef}
          src={reel.src}
          className="w-full h-full object-cover"
          loop
          muted
          playsInline
          onError={() => setHasError(true)}
        />
      )}

      {/* Vignette Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/30 pointer-events-none" />

      {/* Control Actions Overlay */}
      {!hasError && (
        <button
          onClick={toggleMute}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-secondary hover:text-white transition-all shadow-md"
        >
          {isMuted ? <FaVolumeMute className="w-3.5 h-3.5" /> : <FaVolumeUp className="w-3.5 h-3.5" />}
        </button>
      )}

      {/* Bottom text info */}
      <div className="absolute bottom-6 left-6 right-6 z-10 pointer-events-none">
        <span className="px-2.5 py-1 bg-secondary text-white text-[9px] font-black tracking-wider uppercase rounded-full">
          Campaign Reel
        </span>
        <h4 className="text-white font-black text-base mt-2.5 tracking-tight">{reel.title}</h4>
        <p className="text-white/60 text-xs mt-1 font-medium leading-snug">{reel.desc}</p>
      </div>
    </div>
  );
};

const VideoReels = () => {
  return (
    <section id="campaigns-reels" className="py-20 bg-charcoal relative overflow-hidden border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="text-center max-w-3xl mx-auto mb-16" data-aos="fade-up">
          <span className="text-secondary text-xs font-black tracking-widest uppercase">
            SWM & IEC in Action
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-white mt-3 tracking-tight">
            Journey Video Reels
          </h2>
          <p className="text-white/60 text-sm mt-4 font-medium leading-relaxed">
            Watch real-time documentation of field campaigns, plastic reduction actions, and student environment programs.
          </p>
        </div>

        {/* Reels Horizontal/Grid Carousel */}
        <div 
          className="flex md:grid md:grid-cols-4 gap-6 overflow-x-auto md:overflow-x-visible snap-x snap-mandatory pb-8 md:pb-0 scrollbar-none"
          data-aos="fade-up"
        >
          {REELS.map((reel) => (
            <ReelCard key={reel.id} reel={reel} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default VideoReels;

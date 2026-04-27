import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Play, Pause, Volume2, VolumeX, Maximize } from "lucide-react";

const VideoGrid = ({ videos = [] }) => {
  if (!videos || videos.length === 0) {
    return null;
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {videos.map((item) => (
          <HoverVideoCard key={item.id || item.item_uuid} item={item} />
        ))}
      </div>
    </div>
  );
};

const HoverVideoCard = ({ item }) => {
  const videoRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [showThumbnail, setShowThumbnail] = useState(true);

  const videoUrl = 
    (typeof item.video === 'string' ? item.video : null) ||
    item.video?.video_url ||
    item.media?.[0]?.video?.video_url ||
    item.media?.[0]?.video?.video ||
    (item.media?.[0]?.media_type === 'video' ? item.media?.[0]?.url : null);

  const thumbnailUrl = 
    item.thumbnail ||
    item.media?.[0]?.thumbnail ||
    item.image ||
    item.media?.[0]?.image ||
    (item.media?.[1]?.media_type === 'image' ? item.media?.[1]?.image : null) ||
    (item.media?.find(m => m.media_type === 'image')?.image);

  const link = 
    item.media?.[0]?.link || 
    item.link || 
    (item.media?.[1]?.link) ||
    "#";

  const title = item.title || item.name || "";

  if (!videoUrl) return null;

  const handleMouseEnter = () => {
    setIsHovered(true);
    setShowThumbnail(false);
    if (videoRef.current) {
      videoRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(err => {
          console.log("Autoplay failed:", err);
          setShowThumbnail(true);
        });
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setShowThumbnail(true);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  const togglePlay = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!videoRef.current) return;
    
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
      setShowThumbnail(true);
    } else {
      setShowThumbnail(false);
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  const handleFullscreen = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  const handleVideoLoaded = () => {
    setIsVideoLoaded(true);
    if (videoRef.current && !isHovered) {
      videoRef.current.currentTime = 0;
    }
  };

  const handleVideoError = () => {
    console.log("Video failed to load, showing thumbnail");
    setShowThumbnail(true);
  };

  const isClickable = link && link !== "#";

  return (
    <div
      className={`relative w-full h-[200px] sm:h-[300px] lg:h-[450px] bg-black overflow-hidden rounded-lg group ${
        isClickable ? 'cursor-pointer' : 'cursor-default'
      }`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {!isVideoLoaded && showThumbnail && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
          <div className="w-10 h-10 border-4 border-gray-600 border-t-white rounded-full animate-spin"></div>
        </div>
      )}

      {thumbnailUrl && showThumbnail && (
        <img
          src={thumbnailUrl}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      <video
        ref={videoRef}
        src={videoUrl}
        muted
        loop
        playsInline
        preload="metadata"
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
          !showThumbnail && isVideoLoaded ? "opacity-100" : "opacity-0"
        }`}
        onLoadedData={handleVideoLoaded}
        onError={handleVideoError}
        onEnded={() => setIsPlaying(false)}
      />

      {isHovered && (
        <button
          onClick={togglePlay}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-3 transition-all z-10 hover:scale-110"
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? <Pause size={24} /> : <Play size={24} />}
        </button>
      )}

      {isHovered && !showThumbnail && (
        <div className="video-controls absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-3">
              <button 
                onClick={togglePlay}
                className="hover:text-gray-300 transition hover:scale-110"
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? <Pause size={20} /> : <Play size={20} />}
              </button>
              <button 
                onClick={toggleMute}
                className="hover:text-gray-300 transition hover:scale-110"
                aria-label={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </button>
            </div>
            <button 
              onClick={handleFullscreen}
              className="hover:text-gray-300 transition hover:scale-110"
              aria-label="Fullscreen"
            >
              <Maximize size={20} />
            </button>
          </div>
        </div>
      )}

      {link && link !== "#" && (
        <Link
          to={link}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-6 py-2 rounded-full transition-all shadow-lg hover:shadow-xl z-30 hover:scale-105"
          onClick={(e) => e.stopPropagation()}
        >
          Shop Now
        </Link>
      )}

      {isClickable && !isHovered && (
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 pointer-events-none" />
      )}
    </div>
  );
};

export const VideoGridSection = ({ sections = [] }) => {
  const videoGridSection = sections.find(
    section => section.title?.toLowerCase() === 'video grid' ||
               section.title?.toLowerCase().includes('video')
  );

  if (!videoGridSection?.items || videoGridSection.items.length === 0) {
    return null;
  }

  const transformedVideos = videoGridSection.items.map(item => {
    const videoMedia = item.media?.find(m => m.media_type === 'video');
    const imageMedia = item.media?.find(m => m.media_type === 'image');
    
    return {
      id: item.item_uuid,
      title: item.title,
      name: item.title,
      subtitle: item.subtitle,
      video: videoMedia?.video?.video_url || 
             videoMedia?.video?.video ||
             videoMedia?.url,
      thumbnail: imageMedia?.image || imageMedia?.thumbnail,
      image: imageMedia?.image,
      link: videoMedia?.link || imageMedia?.link || item.link,
      media: item.media
    };
  }).filter(v => v.video);

  return <VideoGrid videos={transformedVideos} />;
};

export default VideoGrid;
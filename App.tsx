import React, { useState } from 'react';
import { Menu, Settings } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import InputPanel from './components/InputPanel';
import ResultPanel from './components/ResultPanel';
import FillPanel from './components/FillPanel';
import EditPanel from './components/EditPanel';
import RestorePanel from './components/RestorePanel';
import IdolPanel from './components/IdolPanel';
import RemoveBgPanel from './components/RemoveBgPanel';
import ProductPanel from './components/ProductPanel';
import ProductModelPanel from './components/ProductModelPanel';
import FashionPanel from './components/FashionPanel';
import MockupPanel from './components/MockupPanel';
import BannerPanel from './components/BannerPanel';
import POVHandPanel from './components/POVHandPanel';
import WeddingPanel from './components/WeddingPanel';
import ModelPanel from './components/ModelPanel';
import ChangePosePanel from './components/ChangePosePanel';
import UGCPanel from './components/UGCPanel';
import ChatPanel from './components/ChatPanel';
import VideoPromptModal from './components/VideoPromptModal';
import { AppMode, AspectRatio, GeneratedImage, UploadedImage } from './types';
import { 
  generateTryOnImage, 
  analyzeProductFeatures, 
  generateUGCModel, 
  generateUGCPose, 
  generateCustomUGCPose,
  generateImageToVideoPrompt,
  generateExpandedImage,
  generateMergedImage,
  generateRestoredImage,
  generateProductImage,
  generateProductModelImage,
  generateFashionImage,
  generateMockupImage,
  generateBannerImage,
  generateModelImage,
  generatePoseImage,
  generatePOVHandImage,
  generateWeddingImage,
  generateIdolImage,
  generateRemoveBgImage
} from './services/geminiService';

function App() {
  const [currentMode, setCurrentMode] = useState<AppMode>(AppMode.DASHBOARD);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [results, setResults] = useState<GeneratedImage[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Video Prompt Modal State
  const [videoPromptModalOpen, setVideoPromptModalOpen] = useState(false);
  const [videoPromptLoading, setVideoPromptLoading] = useState(false);
  const [videoPromptText, setVideoPromptText] = useState('');

  // Fusion State
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>(AspectRatio.SQUARE);

  // Restore State
  const [restoreImage, setRestoreImage] = useState<UploadedImage | null>(null);

  // Idol State
  const [idolImage, setIdolImage] = useState<UploadedImage | null>(null); // Foto User
  const [idolTargetImage, setIdolTargetImage] = useState<UploadedImage | null>(null); // Foto Artis

  // RemoveBg State
  const [removeBgImage, setRemoveBgImage] = useState<UploadedImage | null>(null);

  // Product State
  const [productImage, setProductImage] = useState<UploadedImage | null>(null);
  const [lighting, setLighting] = useState<any>('light');
  const [ambience, setAmbience] = useState<any>('clean');
  const [crowdType, setCrowdType] = useState<any>('indoor');

  // Product Model State
  const [pmModelImage, setPmModelImage] = useState<UploadedImage | null>(null);
  const [pmProductImage, setPmProductImage] = useState<UploadedImage | null>(null);

  // Fashion State
  const [fashionProduct, setFashionProduct] = useState<UploadedImage | null>(null);
  const [fashionLogo, setFashionLogo] = useState<UploadedImage | null>(null);
  const [modelType, setModelType] = useState<any>('human');
  const [genderContext, setGenderContext] = useState<any>('female');
  const [ageGroup, setAgeGroup] = useState<any>('adult');
  const [customAge, setCustomAge] = useState('');
  const [visualStyle, setVisualStyle] = useState<any>('minimalist');
  const [customStyle, setCustomStyle] = useState('');

  // Mockup State
  const [mockupDesign, setMockupDesign] = useState<UploadedImage | null>(null);
  const [mockupCategory, setMockupCategory] = useState<any>('product');
  const [mockupItem, setMockupItem] = useState('');

  // Banner State
  const [bannerImage, setBannerImage] = useState<UploadedImage | null>(null);
  const [bannerText, setBannerText] = useState('');
  const [bannerStyle, setBannerStyle] = useState('');

  // POV Hand State
  const [povImage, setPovImage] = useState<UploadedImage | null>(null);
  const [povDescription, setPovDescription] = useState('');

  // Wedding State
  const [groomImage, setGroomImage] = useState<UploadedImage | null>(null);
  const [brideImage, setBrideImage] = useState<UploadedImage | null>(null);
  const [weddingRef, setWeddingRef] = useState<UploadedImage | null>(null);
  const [eventType, setEventType] = useState('Wedding');
  const [shotType, setShotType] = useState('Medium Shot');
  const [weddingStyle, setWeddingStyle] = useState('Klasik B&W');
  const [location, setLocation] = useState('Pantai');
  const [watermark, setWatermark] = useState('');

  // Realistic Model State
  const [bgType, setBgType] = useState<any>('flat');
  const [modelDesc, setModelDesc] = useState('');

  // Change Pose State
  const [poseImage, setPoseImage] = useState<UploadedImage | null>(null);
  const [poseType, setPoseType] = useState('Berdiri');
  const [customPose, setCustomPose] = useState('');

  // UGC State
  const [ugcActiveTab, setUgcActiveTab] = useState<any>('model');
  const [ugcModelImage, setUgcModelImage] = useState<UploadedImage | null>(null);
  const [ugcModelPrompt, setUgcModelPrompt] = useState('');
  const [ugcModelRatio, setUgcModelRatio] = useState<AspectRatio>(AspectRatio.PORTRAIT);
  
  const [ugcTryOnProductImage, setUgcTryOnProductImage] = useState<UploadedImage | null>(null);
  const [ugcTryOnModelImage, setUgcTryOnModelImage] = useState<UploadedImage | null>(null);
  const [ugcTryOnDescription, setUgcTryOnDescription] = useState('');
  const [ugcTryOnMode, setUgcTryOnMode] = useState<any>('wear');
  const [isAnalyzingProduct, setIsAnalyzingProduct] = useState(false);
  const [ugcResults, setUgcResults] = useState<GeneratedImage[]>([]);

  const [ugcPoseSource, setUgcPoseSource] = useState<UploadedImage | null>(null);
  const [ugcPoseType, setUgcPoseType] = useState<any>('fashion');
  const [ugcPoseTypeCategory, setUgcPoseCategory] = useState<any>('body');
  const [ugcBgType, setUgcBgType] = useState<any>('default');
  const [ugcCustomBgPrompt, setUgcCustomBgPrompt] = useState('');
  const [ugcCustomBgImage, setUgcCustomBgImage] = useState<UploadedImage | null>(null);

  const [ugcCustomImage, setUgcCustomImage] = useState<UploadedImage | null>(null);
  const [ugcCustomPrompt, setUgcCustomPrompt] = useState('');

  // User and Google Apps Script states
  const [userEmail, setUserEmail] = useState<string>(() => {
    try {
      return localStorage.getItem('japri_user_email') || '';
    } catch (e) {
      return '';
    }
  });

  const [appsScriptUrl, setAppsScriptUrl] = useState<string>(() => {
    try {
      const newUrl = 'https://script.google.com/macros/s/AKfycbwa5LEvFi7lMIsh75qpeB4FUjmOQHgpAzW7ar-29B0rL4NoEhVxHU93c4SNEEW70ESn/exec';
      const outdatedDefaults = [
        'https://script.google.com/macros/s/AKfycbwzxQmTVWoQ96jYooQNS9q-JDjFCaAfUHlmO-hx9pnYJ8riycA26V52nYsMrigO8AnU/exec',
        'https://script.google.com/macros/s/AKfycbwqhgQI9uwB8zlixWTGGqWHqGpzwgXMeH-ml7Jv6RCXIphtjPQLifb7_TaB23_lwm5v/exec',
        'https://script.google.com/macros/s/AKfycbyMp0mz2I9DKAfmoH8zkeqfJv4uZWOuqSd3oBKN_FMDlBhHB7iX00_i7KZXqrHdJSjd/exec',
        'https://script.google.com/macros/s/AKfycbwcq7HaM6Cu65jtMYqScgiNt4YX7SlYcOv4_I7VG4DEcnEsvyGZOCvwjyoBNGHUYUHo/exec'
      ];
      let stored = localStorage.getItem('japri_apps_script_url') || '';
      
      // Jika url tersimpan adalah url sistem bawaan yang lama, update ke url yang baru
      if (stored && outdatedDefaults.some(old => stored === old || stored.trim() === old)) {
        localStorage.setItem('japri_apps_script_url', newUrl);
        stored = newUrl;
      }
      return stored || import.meta.env.VITE_APPS_SCRIPT_URL || newUrl;
    } catch (e) {
      return 'https://script.google.com/macros/s/AKfycbwa5LEvFi7lMIsh75qpeB4FUjmOQHgpAzW7ar-29B0rL4NoEhVxHU93c4SNEEW70ESn/exec';
    }
  });

  // Daily limit state dependent on the logged in user's email
  const [generationCount, setGenerationCount] = useState<number>(0);
  const [generationLimit, setGenerationLimit] = useState<number>(10);

  const fetchQuotaStatus = async (email: string) => {
    if (!email || !appsScriptUrl) return;
    try {
      const response = await fetch(`${appsScriptUrl}?email=${encodeURIComponent(email)}`);
      const data = await response.json();
      if (data.status === 'sukses') {
        const emailLower = email.toLowerCase().trim();
        
        const usedVal = data.used !== undefined && data.used !== null ? parseInt(data.used.toString(), 10) : NaN;
        if (!isNaN(usedVal)) {
          setGenerationCount(usedVal);
          localStorage.setItem(`gen_count_${emailLower}`, usedVal.toString());
        }
        
        const limitVal = data.limit !== undefined && data.limit !== null ? parseInt(data.limit.toString(), 10) : NaN;
        if (!isNaN(limitVal)) {
          setGenerationLimit(limitVal);
          localStorage.setItem(`gen_limit_${emailLower}`, limitVal.toString());
        }
      }
    } catch (e) {
      console.warn('Gagal memuat kuota langsung dari Apps Script, menggunakan cache lokal:', e);
    }
  };

  React.useEffect(() => {
    if (!userEmail) {
      setGenerationCount(0);
      setGenerationLimit(10);
      return;
    }
    try {
      const today = new Date().toDateString();
      const emailLower = userEmail.toLowerCase().trim();
      const storedDate = localStorage.getItem(`gen_date_${emailLower}`);
      const storedLimit = localStorage.getItem(`gen_limit_${emailLower}`);
      
      if (storedLimit) {
        setGenerationLimit(parseInt(storedLimit, 10));
      } else {
        setGenerationLimit(10);
      }

      if (storedDate !== today) {
        localStorage.setItem(`gen_date_${emailLower}`, today);
        localStorage.setItem(`gen_count_${emailLower}`, '0');
        setGenerationCount(0);
      } else {
        const val = localStorage.getItem(`gen_count_${emailLower}`);
        setGenerationCount(val ? parseInt(val, 10) : 0);
      }
    } catch (e) {
      // Ignore
    }

    // Ambil data terbaru langsung dari Google Sheet via Apps Script
    fetchQuotaStatus(userEmail);
  }, [userEmail, appsScriptUrl]);

  const isWithinLimit = (): boolean => {
    if (!userEmail) {
      alert("Harap login terlebih dahulu.");
      return false;
    }
    if (generationCount >= generationLimit) {
      alert(`⚠️ Kuota Harian Tercapai!\nSobat Japri telah menggunakan batas maksimum ${generationLimit} generate gambar per hari. Silahkan hubungi admin di 081321910880 untuk penambahan kuota harian!`);
      return false;
    }
    return true;
  };

  const incrementGeneration = async (count = 1) => {
    if (!userEmail) return;
    const emailLower = userEmail.toLowerCase().trim();
    
    // Desentralisasikan peningkatan local state untuk kenyamanan instan user
    const targetCount = generationCount + count;
    setGenerationCount(targetCount);
    try {
      const today = new Date().toDateString();
      localStorage.setItem(`gen_date_${emailLower}`, today);
      localStorage.setItem(`gen_count_${emailLower}`, targetCount.toString());
    } catch (e) {
      // Ignored
    }

    // Post/Update ke Google Sheet via Apps Script secara asynchronous
    if (appsScriptUrl) {
      try {
        const response = await fetch(`${appsScriptUrl}?action=inc&email=${encodeURIComponent(emailLower)}`);
        const data = await response.json();
        if (data.status === 'sukses') {
          const usedVal = data.used !== undefined && data.used !== null ? parseInt(data.used.toString(), 10) : NaN;
          if (!isNaN(usedVal)) {
            setGenerationCount(usedVal);
            localStorage.setItem(`gen_count_${emailLower}`, usedVal.toString());
          }
          const limitVal = data.limit !== undefined && data.limit !== null ? parseInt(data.limit.toString(), 10) : NaN;
          if (!isNaN(limitVal)) {
            setGenerationLimit(limitVal);
            localStorage.setItem(`gen_limit_${emailLower}`, limitVal.toString());
          }
        }
      } catch (e) {
        console.error('Gagal memperbarui kuota ke Google Sheet:', e);
      }
    }
  };

  const resetQuota = async () => {
    if (!userEmail) return;
    const emailLower = userEmail.toLowerCase().trim();
    try {
      const today = new Date().toDateString();
      localStorage.setItem(`gen_date_${emailLower}`, today);
      localStorage.setItem(`gen_count_${emailLower}`, '0');
      setGenerationCount(0);
    } catch (e) {
      // Ignored
    }
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const handleUpload = (files: File[], setter: React.Dispatch<React.SetStateAction<UploadedImage[]>>) => {
    const newImages = files.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      previewUrl: URL.createObjectURL(file)
    }));
    setter(prev => [...prev, ...newImages]);
  };

  const handleSingleUpload = (file: File, setter: React.Dispatch<React.SetStateAction<UploadedImage | null>>) => {
    setter({
      id: Math.random().toString(36).substr(2, 9),
      file,
      previewUrl: URL.createObjectURL(file)
    });
  };

  const handleAnalyzeTryOnProduct = async () => {
    if (!ugcTryOnProductImage) return;
    setIsAnalyzingProduct(true);
    try {
        const description = await analyzeProductFeatures(ugcTryOnProductImage);
        setUgcTryOnDescription(description);
    } catch (e) {
        console.error(e);
        alert("Gagal menganalisa produk.");
    } finally {
        setIsAnalyzingProduct(false);
    }
  };

  const handleExpandGenerate = async (canvasBase64: string) => {
    if (!isWithinLimit()) return;
    setIsGenerating(true);
    setResults([]);
    try {
      const base64Images = await generateExpandedImage(canvasBase64, prompt);
      const newResults = base64Images.map(url => ({ id: Math.random().toString(36), url }));
      setResults(newResults);
      incrementGeneration();
    } catch (e) {
      alert("Gagal memperluas foto.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerate = async () => {
    if (!isWithinLimit()) {
      return;
    }
    setIsGenerating(true);
    setResults([]);
    
    // Mode Penggabungan (Merge)
    if (currentMode === AppMode.MERGE) {
      if (uploadedImages.length === 0 || !prompt.trim()) {
        setIsGenerating(false);
        return;
      }
      try {
        const base64Images = await generateMergedImage(uploadedImages, prompt, aspectRatio);
        const newResults = base64Images.map(url => ({ id: Math.random().toString(36), url }));
        setResults(newResults);
        incrementGeneration();
      } catch (e) {
        alert("Gagal menggabungkan foto.");
      } finally {
        setIsGenerating(false);
      }
      return;
    }

    // Mode Restorasi Foto
    if (currentMode === AppMode.RESTORE) {
      if (!restoreImage) {
        setIsGenerating(false);
        return;
      }
      try {
        const base64Images = await generateRestoredImage(restoreImage, aspectRatio, prompt);
        const newResults = base64Images.map(url => ({ id: Math.random().toString(36), url }));
        setResults(newResults);
        incrementGeneration();
      } catch (e) {
        alert("Gagal merestorasi foto.");
      } finally {
        setIsGenerating(false);
      }
      return;
    }

    // Mode Photo Produk
    if (currentMode === AppMode.PRODUCT) {
      if (!productImage) {
        setIsGenerating(false);
        return;
      }
      try {
        const base64Images = await generateProductImage(
          productImage,
          lighting,
          ambience,
          crowdType,
          aspectRatio,
          prompt
        );
        const newResults = base64Images.map(url => ({ id: Math.random().toString(36), url }));
        setResults(newResults);
        incrementGeneration();
      } catch (e) {
        alert("Gagal membuat foto produk.");
      } finally {
        setIsGenerating(false);
      }
      return;
    }

    // Mode Produk + Model
    if (currentMode === AppMode.PRODUCT_MODEL) {
      if (!pmModelImage || !pmProductImage) {
        setIsGenerating(false);
        return;
      }
      try {
        const base64Images = await generateProductModelImage(
          pmModelImage,
          pmProductImage,
          aspectRatio,
          prompt
        );
        const newResults = base64Images.map(url => ({ id: Math.random().toString(36), url }));
        setResults(newResults);
        incrementGeneration();
      } catch (e) {
        alert("Gagal membuat foto produk + model.");
      } finally {
        setIsGenerating(false);
      }
      return;
    }

    // Mode Fashion AI
    if (currentMode === AppMode.FASHION) {
      if (!fashionProduct) {
        setIsGenerating(false);
        return;
      }
      try {
        const base64Images = await generateFashionImage(
          fashionProduct,
          fashionLogo,
          modelType,
          genderContext,
          ageGroup,
          customAge,
          visualStyle,
          customStyle,
          aspectRatio,
          prompt
        );
        const newResults = base64Images.map(url => ({ id: Math.random().toString(36), url }));
        setResults(newResults);
        incrementGeneration();
      } catch (e) {
        alert("Gagal membuat foto fashion.");
      } finally {
        setIsGenerating(false);
      }
      return;
    }

    // Mode Mockup Generator
    if (currentMode === AppMode.MOCKUP) {
      if (!mockupDesign) {
        setIsGenerating(false);
        return;
      }
      try {
        const base64Images = await generateMockupImage(
          mockupDesign,
          mockupCategory,
          mockupItem,
          aspectRatio,
          prompt
        );
        const newResults = base64Images.map(url => ({ id: Math.random().toString(36), url }));
        setResults(newResults);
        incrementGeneration();
      } catch (e) {
        alert("Gagal membuat mockup.");
      } finally {
        setIsGenerating(false);
      }
      return;
    }

    // Mode Buat Banner
    if (currentMode === AppMode.BANNER) {
      if (!bannerImage || !bannerText) {
        setIsGenerating(false);
        return;
      }
      try {
        const base64Images = await generateBannerImage(
          bannerImage,
          bannerText,
          bannerStyle,
          aspectRatio,
          prompt
        );
        const newResults = base64Images.map(url => ({ id: Math.random().toString(36), url }));
        setResults(newResults);
        incrementGeneration();
      } catch (e) {
        alert("Gagal membuat banner.");
      } finally {
        setIsGenerating(false);
      }
      return;
    }

    // Mode Model Generator
    if (currentMode === AppMode.REALISTIC_MODEL) {
      if (!modelDesc.trim()) {
        setIsGenerating(false);
        return;
      }
      try {
        const base64Images = await generateModelImage(
          modelDesc,
          bgType,
          aspectRatio,
          prompt
        );
        const newResults = base64Images.map(url => ({ id: Math.random().toString(36), url }));
        setResults(newResults);
        incrementGeneration();
      } catch (e) {
        alert("Gagal membuat model.");
      } finally {
        setIsGenerating(false);
      }
      return;
    }

    // Mode Ubah Pose Model
    if (currentMode === AppMode.CHANGE_POSE) {
      if (!poseImage) {
        setIsGenerating(false);
        return;
      }
      try {
        const base64Images = await generatePoseImage(
          poseImage,
          poseType,
          customPose,
          aspectRatio,
          prompt
        );
        const newResults = base64Images.map(url => ({ id: Math.random().toString(36), url }));
        setResults(newResults);
        incrementGeneration();
      } catch (e) {
        alert("Gagal mengubah pose.");
      } finally {
        setIsGenerating(false);
      }
      return;
    }

    // Mode POV Tangan
    if (currentMode === AppMode.POV_HAND) {
      if (!povImage || !povDescription) {
        setIsGenerating(false);
        return;
      }
      try {
        const base64Images = await generatePOVHandImage(
          povImage,
          povDescription,
          prompt,
          aspectRatio
        );
        const newResults = base64Images.map(url => ({ id: Math.random().toString(36), url }));
        setResults(newResults);
        incrementGeneration();
      } catch (e) {
        alert("Gagal membuat POV Tangan.");
      } finally {
        setIsGenerating(false);
      }
      return;
    }

    // Mode Wedding AI
    if (currentMode === AppMode.WEDDING) {
      if (!groomImage || !brideImage) {
        setIsGenerating(false);
        return;
      }
      try {
        const base64Images = await generateWeddingImage(
          groomImage,
          brideImage,
          weddingRef,
          eventType,
          shotType,
          weddingStyle,
          location,
          watermark,
          aspectRatio,
          prompt
        );
        const newResults = base64Images.map(url => ({ id: Math.random().toString(36), url }));
        setResults(newResults);
        incrementGeneration();
      } catch (e) {
        alert("Gagal membuat foto wedding.");
      } finally {
        setIsGenerating(false);
      }
      return;
    }

    // Mode Photo Bareng Idola
    if (currentMode === AppMode.IDOL) {
      if (!idolImage || !idolTargetImage) {
        setIsGenerating(false);
        return;
      }
      try {
        const base64Images = await generateIdolImage(
          idolImage,
          idolTargetImage,
          aspectRatio,
          prompt
        );
        const newResults = base64Images.map(url => ({ id: Math.random().toString(36), url }));
        setResults(newResults);
        incrementGeneration();
      } catch (e) {
        alert("Gagal membuat foto bersama idola.");
      } finally {
        setIsGenerating(false);
      }
      return;
    }

    if (currentMode === AppMode.REMOVE_BG) {
        if (!removeBgImage) {
            setIsGenerating(false);
            return;
        }
        try {
            const base64Images = await generateRemoveBgImage(removeBgImage, prompt);
            const newResults = base64Images.map(url => ({ id: Math.random().toString(36), url }));
            setResults(newResults);
            incrementGeneration();
        } catch (e) {
            alert("Gagal menghapus background.");
        } finally {
            setIsGenerating(false);
        }
        return;
    }

    if (currentMode === AppMode.UGC) {
        setUgcResults([]);
        if (ugcActiveTab === 'try-on') {
            if (!ugcTryOnProductImage || !ugcTryOnModelImage || !ugcTryOnDescription) { setIsGenerating(false); return; }
            try {
                const base64Images = await generateTryOnImage(
                    ugcTryOnProductImage, 
                    ugcTryOnModelImage, 
                    ugcTryOnDescription,
                    ugcTryOnMode,
                    AspectRatio.PORTRAIT,
                    prompt
                );
                const newResults = base64Images.map(url => ({ id: Math.random().toString(36), url }));
                setUgcResults(newResults);
                setResults(newResults);
                incrementGeneration();
            } catch (e) { alert("Gagal membuat Try On."); } finally { setIsGenerating(false); }
        } else if (ugcActiveTab === 'model') {
            if (!ugcModelImage || !ugcModelPrompt) { setIsGenerating(false); return; }
            try {
                const base64Images = await generateUGCModel(ugcModelImage, ugcModelPrompt, ugcModelRatio, prompt);
                const newResults = base64Images.map(url => ({ id: Math.random().toString(36), url }));
                setUgcResults(newResults);
                setResults(newResults);
                incrementGeneration();
            } catch (e) { alert("Gagal membuat Model UGC."); } finally { setIsGenerating(false); }
        } else if (ugcActiveTab === 'pose') {
            if (!ugcPoseSource) { setIsGenerating(false); return; }
            try {
                const base64Images = await generateUGCPose(ugcPoseSource, ugcPoseType, ugcPoseTypeCategory, ugcBgType, ugcCustomBgPrompt, ugcCustomBgImage, prompt);
                const newResults = base64Images.map(url => ({ id: Math.random().toString(36), url }));
                setUgcResults(newResults);
                setResults(newResults);
                incrementGeneration();
            } catch (e) { alert("Gagal membuat Pose UGC."); } finally { setIsGenerating(false); }
        } else if (ugcActiveTab === 'custom') {
            if (!ugcCustomImage || !ugcCustomPrompt) { setIsGenerating(false); return; }
            try {
                const base64Images = await generateCustomUGCPose(ugcCustomImage, ugcCustomPrompt, prompt);
                const newResults = base64Images.map(url => ({ id: Math.random().toString(36), url }));
                setUgcResults(newResults);
                setResults(newResults);
                incrementGeneration();
            } catch (e) { alert("Gagal membuat Custom Pose."); } finally { setIsGenerating(false); }
        }
        return;
    }

    // Default placeholder for other modes
    setTimeout(() => {
        setIsGenerating(false);
    }, 2000);
  };

  const handleUseInPose = (img: GeneratedImage) => {
    fetch(img.url)
      .then(res => res.blob())
      .then(blob => {
        const file = new File([blob], "ugc_result.png", { type: "image/png" });
        const uploadedImg: UploadedImage = {
          id: img.id,
          file: file,
          previewUrl: img.url
        };
        setUgcPoseSource(uploadedImg);
        setUgcActiveTab('pose');
      });
  };

  const handleVideoPromptGeneration = async (img: GeneratedImage) => {
     setVideoPromptModalOpen(true);
     setVideoPromptLoading(true);
     setVideoPromptText('');
     try {
         const resultPrompt = await generateImageToVideoPrompt(img.url, prompt);
         setVideoPromptText(resultPrompt);
     } catch (e) { 
         setVideoPromptText("Maaf, gagal membuat prompt video. Silahkan coba lagi atau ganti gambar."); 
     } finally {
         setVideoPromptLoading(false);
     }
  };

  const handleSwitchMode = (mode: AppMode) => {
    setCurrentMode(mode);
    setIsSidebarOpen(false); // Auto close on mobile after selection
  };

  const renderPanel = () => {
    switch (currentMode) {
      case AppMode.DASHBOARD: return <Dashboard onSelectMode={handleSwitchMode} />;
      case AppMode.MERGE: return <InputPanel uploadedImages={uploadedImages} onUpload={(files) => handleUpload(files, setUploadedImages)} onRemoveImage={(id) => setUploadedImages(prev => prev.filter(img => img.id !== id))} prompt={prompt} setPrompt={setPrompt} aspectRatio={aspectRatio} setAspectRatio={setAspectRatio} onGenerate={handleGenerate} isGenerating={isGenerating} />;
      case AppMode.EXPAND: return <FillPanel onGenerate={handleExpandGenerate} isGenerating={isGenerating} prompt={prompt} setPrompt={setPrompt} />;
      case AppMode.EDIT: return <EditPanel />;
      case AppMode.RESTORE: return <RestorePanel image={restoreImage} onUpload={(f) => handleSingleUpload(f, setRestoreImage)} onRemove={() => setRestoreImage(null)} aspectRatio={aspectRatio} setAspectRatio={setAspectRatio} prompt={prompt} setPrompt={setPrompt} onGenerate={handleGenerate} isGenerating={isGenerating} />;
      case AppMode.IDOL: return <IdolPanel userImage={idolImage} onUploadUser={(f) => handleSingleUpload(f, setIdolImage)} onRemoveUser={() => setIdolImage(null)} idolImage={idolTargetImage} onUploadIdol={(f) => handleSingleUpload(f, setIdolTargetImage)} onRemoveIdol={() => setIdolTargetImage(null)} aspectRatio={aspectRatio} setAspectRatio={setAspectRatio} prompt={prompt} setPrompt={setPrompt} onGenerate={handleGenerate} isGenerating={isGenerating} />;
      case AppMode.REMOVE_BG: return <RemoveBgPanel image={removeBgImage} onUpload={(f) => handleSingleUpload(f, setRemoveBgImage)} onRemove={() => setRemoveBgImage(null)} onGenerate={handleGenerate} isGenerating={isGenerating} prompt={prompt} setPrompt={setPrompt} />;
      case AppMode.PRODUCT: return <ProductPanel image={productImage} onUpload={(f) => handleSingleUpload(f, setProductImage)} onRemove={() => setProductImage(null)} lighting={lighting} setLighting={setLighting} ambience={ambience} setAmbience={setAmbience} crowdType={crowdType} setCrowdType={setCrowdType} aspectRatio={aspectRatio} setAspectRatio={setAspectRatio} prompt={prompt} setPrompt={setPrompt} onGenerate={handleGenerate} isGenerating={isGenerating} />;
      case AppMode.PRODUCT_MODEL: return <ProductModelPanel modelImage={pmModelImage} productImage={pmProductImage} onUpload={(t, f) => t === 'model' ? handleSingleUpload(f, setPmModelImage) : handleSingleUpload(f, setPmProductImage)} onRemove={(t) => t === 'model' ? setPmModelImage(null) : setPmProductImage(null)} aspectRatio={aspectRatio} setAspectRatio={setAspectRatio} prompt={prompt} setPrompt={setPrompt} onGenerate={handleGenerate} isGenerating={isGenerating} />;
      case AppMode.FASHION: return <FashionPanel productImage={fashionProduct} logoImage={fashionLogo} onUpload={(t, f) => t === 'product' ? handleSingleUpload(f, setFashionProduct) : handleSingleUpload(f, setFashionLogo)} onRemove={(t) => t === 'product' ? setFashionProduct(null) : setFashionLogo(null)} modelType={modelType} setModelType={setModelType} genderContext={genderContext} setGenderContext={setGenderContext} ageGroup={ageGroup} setAgeGroup={setAgeGroup} customAge={customAge} setCustomAge={setCustomAge} visualStyle={visualStyle} setVisualStyle={setVisualStyle} customStyle={customStyle} setCustomStyle={setCustomStyle} aspectRatio={aspectRatio} setAspectRatio={setAspectRatio} prompt={prompt} setPrompt={setPrompt} onGenerate={handleGenerate} isGenerating={isGenerating} />;
      case AppMode.MOCKUP: return <MockupPanel designImage={mockupDesign} onUpload={(f) => handleSingleUpload(f, setMockupDesign)} onRemove={() => setMockupDesign(null)} category={mockupCategory} setCategory={setMockupCategory} item={mockupItem} setItem={setMockupItem} aspectRatio={aspectRatio} setAspectRatio={setAspectRatio} prompt={prompt} setPrompt={setPrompt} onGenerate={handleGenerate} isGenerating={isGenerating} />;
      case AppMode.BANNER: return <BannerPanel image={bannerImage} onUpload={(f) => handleSingleUpload(f, setBannerImage)} onRemove={() => setBannerImage(null)} text={bannerText} setText={setBannerText} style={bannerStyle} setStyle={setBannerStyle} aspectRatio={aspectRatio} setAspectRatio={setAspectRatio} prompt={prompt} setPrompt={setPrompt} onGenerate={handleGenerate} isGenerating={isGenerating} />;
      case AppMode.POV_HAND: return <POVHandPanel image={povImage} onUpload={(f) => handleSingleUpload(f, setPovImage)} onRemove={() => setPovImage(null)} description={povDescription} setDescription={setPovDescription} prompt={prompt} setPrompt={setPrompt} aspectRatio={aspectRatio} setAspectRatio={setAspectRatio} onGenerate={handleGenerate} isGenerating={isGenerating} />;
      case AppMode.WEDDING: return <WeddingPanel groomImage={groomImage} brideImage={brideImage} refImage={weddingRef} onUpload={(t, f) => t === 'groom' ? handleSingleUpload(f, setGroomImage) : t === 'bride' ? handleSingleUpload(f, setBrideImage) : handleSingleUpload(f, setWeddingRef)} onRemove={(t) => t === 'groom' ? setGroomImage(null) : t === 'bride' ? setBrideImage(null) : setWeddingRef(null)} eventType={eventType} setEventType={setEventType} shotType={shotType} setShotType={setShotType} style={weddingStyle} setStyle={setWeddingStyle} location={location} setLocation={setLocation} watermark={watermark} setWatermark={setWatermark} aspectRatio={aspectRatio} setAspectRatio={setAspectRatio} prompt={prompt} setPrompt={setPrompt} onGenerate={handleGenerate} isGenerating={isGenerating} />;
      case AppMode.REALISTIC_MODEL: return <ModelPanel backgroundType={bgType} setBackgroundType={setBgType} description={modelDesc} setDescription={setModelDesc} aspectRatio={aspectRatio} setAspectRatio={setAspectRatio} prompt={prompt} setPrompt={setPrompt} onGenerate={handleGenerate} isGenerating={isGenerating} />;
      case AppMode.CHANGE_POSE: return <ChangePosePanel image={poseImage} onUpload={(f) => handleSingleUpload(f, setPoseImage)} onRemove={() => setPoseImage(null)} poseType={poseType} setPoseType={setPoseType} customPose={customPose} setCustomPose={setCustomPose} aspectRatio={aspectRatio} setAspectRatio={setAspectRatio} prompt={prompt} setPrompt={setPrompt} onGenerate={handleGenerate} isGenerating={isGenerating} />;
      case AppMode.CHAT: return <ChatPanel />; // Add ChatPanel here
      // Corrected state variables for UGC custom image
      case AppMode.UGC: return <UGCPanel activeTab={ugcActiveTab} setActiveTab={setUgcActiveTab} modelImage={ugcModelImage} onUploadModelImage={(f) => handleSingleUpload(f, setUgcModelImage)} onRemoveModelImage={() => setUgcModelImage(null)} modelPrompt={ugcModelPrompt} setModelPrompt={setUgcModelPrompt} modelRatio={ugcModelRatio} setModelRatio={setUgcModelRatio} tryOnProductImage={ugcTryOnProductImage} onUploadTryOnProduct={(f) => handleSingleUpload(f, setUgcTryOnProductImage)} onRemoveTryOnProduct={() => setUgcTryOnProductImage(null)} tryOnModelImage={ugcTryOnModelImage} onUploadTryOnModel={(f) => handleSingleUpload(f, setUgcTryOnModelImage)} onRemoveTryOnModel={() => setUgcTryOnModelImage(null)} tryOnDescription={ugcTryOnDescription} setTryOnDescription={setUgcTryOnDescription} tryOnMode={ugcTryOnMode} setTryOnMode={setUgcTryOnMode} onAnalyzeProduct={handleAnalyzeTryOnProduct} isAnalyzingProduct={isAnalyzingProduct} poseSourceImage={ugcPoseSource} onUploadPoseSource={(f) => handleSingleUpload(f, setUgcPoseSource)} onRemovePoseSource={() => setUgcPoseSource(null)} poseType={ugcPoseType} setPoseType={setUgcPoseType} poseCategory={ugcPoseTypeCategory} setPoseCategory={setUgcPoseCategory} bgType={ugcBgType} setBgType={setUgcBgType} customBgPrompt={ugcCustomBgPrompt} setCustomBgPrompt={setUgcCustomBgPrompt} customBgImage={ugcCustomBgImage} onUploadBgImage={(f) => handleSingleUpload(f, setUgcCustomBgImage)} onRemoveBgImage={() => setUgcCustomBgImage(null)} customImage={ugcCustomImage} onUploadCustomImage={(f) => handleSingleUpload(f, setUgcCustomImage)} onRemoveCustomImage={() => setUgcCustomImage(null)} customPrompt={ugcCustomPrompt} setCustomPrompt={setUgcCustomPrompt} prompt={prompt} setPrompt={setPrompt} onGenerate={handleGenerate} isGenerating={isGenerating} results={ugcResults} onUseInPose={handleUseInPose} onGenerateVideoPrompt={handleVideoPromptGeneration} />;
      default: return <div>Mode not found</div>;
    }
  };

  const showSharedResultPanel = currentMode !== AppMode.UGC && currentMode !== AppMode.DASHBOARD && currentMode !== AppMode.EDIT && currentMode !== AppMode.CHAT; // Hide ResultPanel for Chat

  // Handle Apps Script login verification
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [showConfig, setShowConfig] = useState(false);

  const handleLogin = async (emailToLogin: string) => {
    const trimmedEmail = emailToLogin.trim();
    if (!trimmedEmail) {
      setLoginError('Harap masukkan alamat email.');
      return;
    }
    
    // Check if AppScript URL is configured
    if (!appsScriptUrl) {
      setLoginError('');
      try {
        localStorage.setItem('japri_user_email', trimmedEmail);
        setUserEmail(trimmedEmail);
        alert(`ℹ️ Demo Mode: Berhasil masuk sebagai ${trimmedEmail}.\n\n(Anda belum mengisi URL Google Apps Script. Di lingkungan demo, email apapun diperbolehkan. Pasang URL Apps Script di tombol pengaturan di bawah jika ingin membatasi sesuai data Google Sheet!)`);
      } catch (e) {
        // block error
      }
      return;
    }

    setLoginLoading(true);
    setLoginError('');
    try {
      const cleanUrl = appsScriptUrl.trim();
      // Ensure the URL is correctly set up as a standard doGet query
      const targetQuery = `${cleanUrl}${cleanUrl.includes('?') ? '&' : '?'}email=${encodeURIComponent(trimmedEmail)}`;
      
      const response = await fetch(targetQuery);
      if (!response.ok) {
        throw new Error(`Koneksi HTTP Error ${response.status}: ${response.statusText}`);
      }
      
      const rawText = await response.text();
      let data;
      try {
        data = JSON.parse(rawText);
      } catch (jsonErr) {
        console.warn('Parsing error:', jsonErr, 'Raw respond was:', rawText);
        // Look for typical Google Apps Script exceptions inside HTML responses
        if (rawText.includes('<!DOCTYPE html>') || rawText.includes('<html') || rawText.includes('Exception:')) {
          const exceptionMatch = rawText.match(/Exception:[^<]+/);
          if (exceptionMatch) {
            throw new Error(`Google Apps Script Error: "${exceptionMatch[0]}"`);
          } else if (rawText.includes('Script fungsi tidak ditemukan') || rawText.includes('Script function not found') || rawText.includes('doGet')) {
            throw new Error(`Fungsi doGet(e) tidak ditemukan di kode script Anda. Pastikan Anda menulis function doGet(e) { ... } di script.`);
          } else {
            // strip HTML tags to get human-readable error if small
            const cleanText = rawText.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
            const sliceText = cleanText.length > 180 ? `${cleanText.substring(0, 180)}...` : cleanText;
            throw new Error(`Apps Script Mengalami Error Internal: "${sliceText}"`);
          }
        }
        throw new Error(`Sistem Apps Script memberi balasan teks biasa dan bukan JSON: "${rawText.substring(0, 120)}..."`);
      }
      
      if (data && data.status === 'sukses') {
        const emailLower = trimmedEmail.toLowerCase().trim();
        localStorage.setItem('japri_user_email', trimmedEmail);
        
        const usedVal = data.used !== undefined && data.used !== null ? parseInt(data.used.toString(), 10) : NaN;
        if (!isNaN(usedVal)) {
          setGenerationCount(usedVal);
          localStorage.setItem(`gen_count_${emailLower}`, usedVal.toString());
        }
        
        const limitVal = data.limit !== undefined && data.limit !== null ? parseInt(data.limit.toString(), 10) : NaN;
        if (!isNaN(limitVal)) {
          setGenerationLimit(limitVal);
          localStorage.setItem(`gen_limit_${emailLower}`, limitVal.toString());
        }
        setUserEmail(trimmedEmail);
      } else {
        // Email not found or access denied inside sheet database
        const errMsg = data?.pesan || data?.message || 'Alamat email Anda belum terdaftar di database Japri Studio.';
        setLoginError(`Akses Ditolak: ${errMsg}`);
      }
    } catch (e: any) {
      console.error('Login failed with error:', e);
      const errMessage = e?.message || String(e);
      let solutionTip = 'Pastikan URL sudah benar. Klik tombol roda gigi pengaturan ⚙️ di kanan atas panel masuk untuk memeriksa kembali URL Anda.';
      
      if (errMessage.includes('Failed to fetch') || errMessage.includes('NetworkError') || errMessage.includes('TypeError')) {
        solutionTip = 'Pastikan Anda telah men-deploy ulang script Anda di Google Apps Script editor dengan memilih "Deploy -> New Deployment", isi deskripsi bebas, lalu pastikan "Who has access" diset ke "Anyone", lalu salin URL Web App yang baru tersebut ke pengaturan aplikasi ini.';
      } else if (errMessage.includes('Google Apps Script Error') || errMessage.includes('Error Internal')) {
        solutionTip = 'Error ini berasal dari dalam kode Google Apps Script Anda (misalnya: ID Spreadsheet salah, atau Sheet bernama "Data" / "Sheet1" tidak ditemukan). Silahkan buka Editor Apps Script Anda dan cek log eksekusi/Execution Logs.';
      }
      
      setLoginError(
        `Gagal Terkoneksi!\n\n` +
        `• URL Terhubung: ${appsScriptUrl}\n\n` +
        `• Pesan Error: ${errMessage}\n\n` +
        `💡 Solusi: ${solutionTip}`
      );
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem('japri_user_email');
      setUserEmail('');
    } catch (e) {
      // Ignore
    }
  };

  const handleSaveAndTestUrl = (url: string) => {
    try {
      const cleanUrl = url.trim();
      localStorage.setItem('japri_apps_script_url', cleanUrl);
      setAppsScriptUrl(cleanUrl);
      alert('URL Google Apps Script berhasil disimpan!');
    } catch (e) {
      // Ignore
    }
  };

  if (!userEmail) {
    return (
      <div className="flex min-h-screen w-screen items-center justify-center bg-gray-50 dark:bg-slate-950 px-4 transition-colors duration-300">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center space-y-2">
            {/* Logo Group */}
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-neon text-white font-black text-2xl shadow-lg shadow-neon/20 mb-2 transform hover:scale-105 transition-transform">
              JS
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Japri Studio
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              AI Image Creator by Japri AI
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl shadow-slate-100 dark:shadow-none space-y-6">
            <div className="flex justify-between items-start gap-3">
              <div className="space-y-1.5 flex-1">
                <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">
                  Silahkan Masuk
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-sans">
                  Untuk bantuan hubungi admin di 081321910880
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowConfig(!showConfig)}
                title="Google Apps Script Settings"
                className={`p-2 rounded-xl border transition-all shrink-0 ${
                  showConfig 
                    ? 'bg-neon/10 text-neon border-neon/20' 
                    : 'border-slate-100 dark:border-slate-800 text-slate-400 hover:text-neon hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
              >
                <Settings size={18} className={`transition-transform duration-300 ${showConfig ? 'rotate-90' : ''}`} />
              </button>
            </div>

            {showConfig && (
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 text-left space-y-3 antialiased">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Konfigurasi Web App URL
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      localStorage.removeItem('japri_apps_script_url');
                      setAppsScriptUrl('https://script.google.com/macros/s/AKfycbwa5LEvFi7lMIsh75qpeB4FUjmOQHgpAzW7ar-29B0rL4NoEhVxHU93c4SNEEW70ESn/exec');
                      alert('Mengembalikan ke Web App bawaan sistem!');
                    }}
                    className="text-[10px] text-red-500 hover:underline font-semibold"
                  >
                    Reset Bawaan
                  </button>
                </div>
                
                <div className="space-y-1.5">
                  <p className="text-[10px] text-slate-500 leading-normal">
                    Jika Anda deploy script baru ke Google Apps Script, tempel alamat URL Web App Anda (diakhiri /exec) di bawah ini:
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="https://script.google.com/macros/s/..."
                      defaultValue={appsScriptUrl}
                      id="custom_apps_script_url"
                      className="flex-1 px-3 py-2 text-xs rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-neon font-sans"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const val = (document.getElementById('custom_apps_script_url') as HTMLInputElement)?.value;
                        if (val) {
                          handleSaveAndTestUrl(val);
                        }
                      }}
                      className="px-3 py-2 text-xs font-bold rounded-xl bg-neon hover:bg-neon-hover text-white transition-all shadow-sm shrink-0"
                    >
                      Simpan
                    </button>
                  </div>
                </div>
                
                <div className="p-2 border border-blue-100/50 dark:border-blue-900/20 bg-blue-50/20 dark:bg-blue-950/10 rounded-xl">
                  <p className="text-[9px] text-blue-600 dark:text-blue-400 font-medium leading-relaxed">
                    💡 <strong>PENTING:</strong> Pastikan script Anda memiliki fungsi <code>doGet(e)</code>, di-deploy sebagai <strong>"Web App"</strong>, <strong>"Execute as: Me"</strong>, dan <strong>"Who has access: Anyone"</strong> agar tidak terhalang CORS.
                  </p>
                </div>
              </div>
            )}

            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const emailValue = formData.get('email') as string;
              handleLogin(emailValue);
            }} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                  Alamat Email (Terdaftar)
                </label>
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="masukkan@email.com"
                  className="w-full p-3.5 rounded-xl border border-gray-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-neon bg-gray-50 dark:bg-slate-800/50 text-slate-800 dark:text-slate-200 font-sans"
                />
              </div>

              {loginError && (
                <div className="p-4 text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 rounded-xl leading-relaxed font-medium whitespace-pre-wrap select-text text-left">
                  {loginError}
                </div>
              )}

              <button
                type="submit"
                disabled={loginLoading}
                className="w-full py-3.5 px-4 rounded-xl bg-neon hover:bg-neon-hover text-white font-bold text-sm shadow-md shadow-neon/10 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loginLoading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Memverifikasi...
                  </>
                ) : (
                  'Masuk ke Studio'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-white dark:bg-slate-950 text-slate-900 dark:text-white transition-colors">
      <Sidebar 
        currentMode={currentMode} 
        onSwitchMode={handleSwitchMode} 
        isDarkMode={isDarkMode} 
        onToggleTheme={toggleTheme} 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        generationCount={generationCount}
        generationLimit={generationLimit}
        onResetQuota={resetQuota}
        userEmail={userEmail}
        onLogout={handleLogout}
      />
      
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Mobile Top Header */}
        <header className="lg:hidden h-14 bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between px-4 shrink-0 z-30">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 -ml-2 text-slate-600 dark:text-slate-300 hover:text-neon transition-colors"
            >
              <Menu size={24} />
            </button>
            <div className="flex items-center gap-1.5">
               <div className="w-7 h-7 bg-neon rounded-lg flex items-center justify-center text-white">
                <span className="font-bold text-[10px] leading-none">JS</span>
               </div>
               <span className="font-bold text-sm tracking-tight">Japri Studio</span>
            </div>
          </div>
        </header>

        <div className="flex-1 flex flex-col lg:flex-row h-full overflow-hidden">
          {/* Main Content Area */}
          <div className="flex-1 h-full overflow-y-auto no-scrollbar bg-white dark:bg-slate-900">
             {/* Mobile: Input and Result are stacked in the same scroll container */}
             <div className="flex flex-col min-h-full">
                <div className="flex-1 shrink-0">
                  {renderPanel()}
                </div>
                
                {/* Result Panel (Mobile Only - Inside Scroll) */}
                {showSharedResultPanel && (
                  <div className="lg:hidden w-full border-t border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-950 shrink-0">
                    <ResultPanel results={results} isGenerating={isGenerating} />
                  </div>
                )}
             </div>
          </div>

          {/* Result Panel Sidebar (Desktop Only) */}
          {showSharedResultPanel && (
              <div className="hidden lg:block w-[400px] xl:w-[450px] border-l border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-950 h-full overflow-hidden shrink-0">
                <ResultPanel results={results} isGenerating={isGenerating} />
              </div>
          )}
        </div>
      </div>

      <VideoPromptModal isOpen={videoPromptModalOpen} onClose={() => setVideoPromptModalOpen(false)} isLoading={videoPromptLoading} promptText={videoPromptText} />
    </div>
  );
}

export default App;
import React, { useState } from 'react';
import { Download, Eye, Maximize2, X, Video } from 'lucide-react';
import { GeneratedImage } from '../types';

interface ResultPanelProps {
  results: GeneratedImage[];
  isGenerating: boolean;
  onCustomAction?: (img: GeneratedImage) => void;
  customActionLabel?: string;
  customActionIcon?: React.ReactNode;
  onGenerateVideoPrompt?: (img: GeneratedImage) => void;
}

const ResultPanel: React.FC<ResultPanelProps> = ({ 
  results, 
  isGenerating,
  onCustomAction,
  customActionLabel,
  customActionIcon,
  onGenerateVideoPrompt
}) => {
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null);

  const handleDownload = (e: React.MouseEvent, img: GeneratedImage) => {
    e.stopPropagation();
    const link = document.createElement('a');
    link.href = img.url;
    link.download = `fusion-lens-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const checkerboardStyle = {
    backgroundImage: `
      linear-gradient(45deg, #e5e7eb 25%, transparent 25%), 
      linear-gradient(-45deg, #e5e7eb 25%, transparent 25%), 
      linear-gradient(45deg, transparent 75%, #e5e7eb 75%), 
      linear-gradient(-45deg, transparent 75%, #e5e7eb 75%)
    `,
    backgroundSize: '20px 20px',
    backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
  };

  const darkCheckerboardStyle = {
    backgroundImage: `
      linear-gradient(45deg, #1e293b 25%, transparent 25%), 
      linear-gradient(-45deg, #1e293b 25%, transparent 25%), 
      linear-gradient(45deg, transparent 75%, #1e293b 75%), 
      linear-gradient(-45deg, transparent 75%, #1e293b 75%)
    `,
    backgroundSize: '20px 20px',
    backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
  };

  return (
    <div className="flex-1 h-full bg-gray-50 dark:bg-slate-950 flex flex-col relative transition-colors">
      <div className="h-14 lg:h-16 flex items-center px-4 lg:px-6 border-b border-gray-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm shrink-0 lg:static">
        <h2 className="font-semibold text-lg text-slate-800 dark:text-white">Hasil Preview</h2>
      </div>

      <div className="flex-1 p-4 lg:p-6 no-scrollbar lg:overflow-y-auto">
        {results.length === 0 && !isGenerating ? (
          <div className="py-12 lg:h-full flex flex-col items-center justify-center text-slate-400 dark:text-slate-600">
            <div className="w-20 h-20 bg-white dark:bg-slate-900 rounded-full flex items-center justify-center mb-4 shadow-sm border border-gray-100 dark:border-slate-800">
              <Eye size={32} className="text-gray-300 dark:text-slate-700" />
            </div>
            <p className="text-lg font-medium">Belum ada hasil</p>
            <p className="text-sm mt-2 max-w-xs text-center">
              Lengkapi form dan klik tombol Generate untuk melihat hasil.
            </p>
          </div>
        ) : isGenerating ? (
          <div className="grid grid-cols-2 gap-3 lg:gap-4">
             {[1, 2, 3, 4].map((i) => (
               <div key={i} className="aspect-square rounded-2xl bg-white dark:bg-slate-900 animate-pulse flex items-center justify-center border border-gray-200 dark:border-slate-800">
                 <div className="w-8 h-8 lg:w-10 lg:h-10 border-4 border-neon/30 border-t-neon rounded-full animate-spin"></div>
               </div>
             ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 lg:gap-4 pb-8">
            {results.map((img) => (
              <div 
                key={img.id} 
                className="group relative aspect-square rounded-2xl overflow-hidden border border-gray-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all cursor-pointer bg-white dark:bg-slate-900"
                style={document.documentElement.classList.contains('dark') ? darkCheckerboardStyle : checkerboardStyle}
                onClick={() => setSelectedImage(img)}
              >
                <img 
                  src={img.url} 
                  alt="Generated result" 
                  className="w-full h-full object-contain" 
                />
                
                <div className="absolute inset-0 bg-black/40 opacity-0 lg:group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3">
                  <div className="hidden lg:flex items-center gap-3">
                    <button 
                        onClick={(e) => { e.stopPropagation(); setSelectedImage(img); }}
                        className="p-2 bg-white dark:bg-slate-800 rounded-full text-slate-800 dark:text-white hover:text-neon transition-colors transform hover:scale-105"
                    >
                        <Maximize2 size={18} />
                    </button>
                    <button 
                        onClick={(e) => handleDownload(e, img)}
                        className="p-2 bg-white dark:bg-slate-800 rounded-full text-slate-800 dark:text-white hover:text-neon transition-colors transform hover:scale-105"
                    >
                        <Download size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedImage && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="relative max-w-4xl w-full max-h-[90vh] flex flex-col items-center">
            <button 
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 p-2 text-white/80 hover:text-white transition-colors"
            >
              <X size={32} />
            </button>
            
            <div className="rounded-lg shadow-2xl overflow-hidden bg-white dark:bg-slate-900 w-auto h-auto max-w-full" 
                 style={document.documentElement.classList.contains('dark') ? darkCheckerboardStyle : checkerboardStyle}>
              <img 
                src={selectedImage.url} 
                alt="Full view" 
                className="max-w-full max-h-[70vh] lg:max-h-[80vh] object-contain block" 
              />
            </div>
            
            <div className="mt-6 flex flex-wrap justify-center gap-4">
               <button 
                onClick={(e) => handleDownload(e, selectedImage)}
                className="px-6 py-3 bg-neon text-white rounded-full font-semibold hover:bg-neon-hover transition-colors flex items-center gap-2 shadow-lg shadow-neon/30 active:scale-95"
              >
                <Download size={20} />
                Download HD
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultPanel;
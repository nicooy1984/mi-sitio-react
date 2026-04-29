import React, { useState } from 'react';
import { Image as ImageIcon, Loader2, UploadCloud, X } from 'lucide-react';
import { uploadImageToCloudinary } from '../utils/cloudinary';

export default function ImageUploader({
  label = 'Subir imagen',
  value = '',
  onChange,
  folder = 'general',
  previewClassName = 'w-full h-48',
}) {
  const [uploading, setUploading] = useState(false);
  const [localPreview, setLocalPreview] = useState('');

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLocalPreview(URL.createObjectURL(file));
    setUploading(true);

    try {
      const imageUrl = await uploadImageToCloudinary(file, folder);
      onChange?.(imageUrl);
    } catch (error) {
      console.error('Error al subir imagen:', error);
      alert('No se pudo subir la imagen. Intenta nuevamente.');
    } finally {
      setUploading(false);
    }
  };

  const clearImage = () => {
    setLocalPreview('');
    onChange?.('');
  };

  const previewUrl = localPreview || value;

  return (
    <div className="space-y-3">
      <label className="block text-[11px] font-black uppercase tracking-[0.25em] text-slate-500">
        {label}
      </label>

      {previewUrl ? (
        <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
          <img
            src={previewUrl}
            alt="Vista previa"
            className={`${previewClassName} object-cover`}
          />

          <button
            type="button"
            onClick={clearImage}
            className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-red-600 transition-all"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <label className="block cursor-pointer rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-6 hover:border-green-600 hover:bg-green-50 transition-all">
          <div className="flex flex-col items-center text-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-slate-400">
              {uploading ? <Loader2 className="animate-spin" size={26} /> : <UploadCloud size={28} />}
            </div>

            <div>
              <p className="text-sm font-black text-slate-700 uppercase">
                Seleccionar imagen
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Se subirá automáticamente a Cloudinary
              </p>
            </div>
          </div>

          <input
            type="file"
            accept="image/*"
            className="hidden"
            disabled={uploading}
            onChange={handleFileChange}
          />
        </label>
      )}

      {uploading && (
        <p className="text-[11px] font-bold text-green-700">
          Subiendo imagen...
        </p>
      )}
    </div>
  );
}
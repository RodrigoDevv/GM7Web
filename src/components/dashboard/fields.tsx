import React, { useRef, useState } from 'react';
import { ImagePlus, Link2, Loader2, X } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { proxiedImageUrl } from '../../lib/media';

export function controlClass(isDark: boolean) {
  return `w-full rounded-xl border px-3 py-2.5 text-sm outline-none transition focus:border-[#FFBE0D] focus:ring-2 focus:ring-[#FFBE0D]/20 ${
    isDark
      ? 'border-neutral-700 bg-neutral-900 text-white placeholder:text-neutral-500'
      : 'border-neutral-300 bg-white text-neutral-900 placeholder:text-neutral-400'
  }`;
}

export const Field: React.FC<{
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}> = ({ label, hint, required, children, className = '' }) => {
  const { isDark } = useTheme();
  return (
    <label className={`block text-xs font-semibold ${className}`}>
      <span className="flex items-center gap-1">
        {label}
        {required && <span className="text-[#FFBE0D]">*</span>}
      </span>
      {hint && <span className={`mt-0.5 block text-[11px] font-normal ${isDark ? 'text-neutral-500' : 'text-neutral-500'}`}>{hint}</span>}
      <div className="mt-1.5">{children}</div>
    </label>
  );
};

export const TextInput: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({ className = '', ...props }) => {
  const { isDark } = useTheme();
  return <input {...props} className={`${controlClass(isDark)} ${className}`} />;
};

export const TextArea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = ({ className = '', ...props }) => {
  const { isDark } = useTheme();
  return <textarea {...props} className={`${controlClass(isDark)} min-h-[88px] resize-y ${className}`} />;
};

export const SelectInput: React.FC<React.SelectHTMLAttributes<HTMLSelectElement>> = ({ className = '', children, ...props }) => {
  const { isDark } = useTheme();
  return (
    <select {...props} className={`${controlClass(isDark)} ${className}`}>
      {children}
    </select>
  );
};

export const ImageField: React.FC<{
  value: string;
  onChange: (value: string) => void;
  label?: string;
  hint?: string;
}> = ({ value, onChange, label = 'Cover image', hint = 'Paste an image URL or upload a file.' }) => {
  const { isDark } = useTheme();
  const fileInput = useRef<HTMLInputElement>(null);
  const [error, setError] = useState('');
  const [reading, setReading] = useState(false);

  const handleFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please choose an image file.');
      return;
    }
    if (file.size > 1.5 * 1024 * 1024) {
      setError('Image is over 1.5 MB — use an image URL instead.');
      return;
    }
    setError('');
    setReading(true);
    const reader = new FileReader();
    reader.onload = () => {
      onChange(typeof reader.result === 'string' ? reader.result : '');
      setReading(false);
    };
    reader.onerror = () => {
      setError('Could not read that image.');
      setReading(false);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <Field label={label} hint={hint}>
        <div className="flex items-center gap-2">
          <div className={`flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border ${isDark ? 'border-neutral-700 bg-neutral-900' : 'border-neutral-300 bg-neutral-100'}`}>
            {value ? (
              <img src={proxiedImageUrl(value)} alt="" className="h-full w-full object-cover" />
            ) : (
              <ImagePlus className={`h-4 w-4 ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`} />
            )}
          </div>
          <div className="relative flex-1">
            <Link2 className={`pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`} />
            <input
              value={value.startsWith('data:') ? '' : value}
              onChange={(event) => onChange(event.target.value)}
              placeholder={value.startsWith('data:') ? 'Uploaded image' : 'https://…'}
              className={`${controlClass(isDark)} pl-9`}
            />
          </div>
          <button
            type="button"
            onClick={() => fileInput.current?.click()}
            disabled={reading}
            className={`inline-flex h-[42px] shrink-0 items-center gap-1.5 rounded-xl border px-3 text-xs font-bold transition-colors disabled:opacity-60 ${isDark ? 'border-neutral-700 bg-neutral-900 text-neutral-300 hover:border-[#FFBE0D]/60' : 'border-neutral-300 bg-white text-neutral-700 hover:border-orange-400'}`}
          >
            {reading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ImagePlus className="h-3.5 w-3.5" />}
            Upload
          </button>
          <input ref={fileInput} type="file" accept="image/*" className="hidden" onChange={handleFile} />
        </div>
        {error && <p className="mt-1.5 text-[11px] font-medium text-red-400">{error}</p>}
      </Field>
    </div>
  );
};

export const AdminButton: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit';
  variant?: 'primary' | 'ghost' | 'danger';
  disabled?: boolean;
  className?: string;
}> = ({ children, onClick, type = 'button', variant = 'primary', disabled, className = '' }) => {
  const { isDark } = useTheme();
  const base = 'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-xs font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-60';
  const styles =
    variant === 'primary'
      ? 'bg-[#FFBE0D] text-black hover:bg-[#e7ad00]'
      : variant === 'danger'
        ? isDark
          ? 'border border-red-500/40 bg-red-500/10 text-red-300 hover:bg-red-500/20'
          : 'border border-red-300 bg-red-50 text-red-700 hover:bg-red-100'
        : isDark
          ? 'border border-neutral-700 bg-neutral-900 text-neutral-300 hover:border-[#FFBE0D]/50 hover:text-white'
          : 'border border-neutral-300 bg-white text-neutral-700 hover:border-orange-400';
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`${base} ${styles} ${className}`}>
      {children}
    </button>
  );
};

export const EmptyHint: React.FC<{ title: string; hint?: string }> = ({ title, hint }) => {
  const { isDark } = useTheme();
  return (
    <div className={`rounded-2xl border border-dashed p-8 text-center ${isDark ? 'border-neutral-700 bg-neutral-900/40' : 'border-neutral-300 bg-white'}`}>
      <p className="text-sm font-bold">{title}</p>
      {hint && <p className={`mt-1 text-xs ${isDark ? 'text-neutral-500' : 'text-neutral-500'}`}>{hint}</p>}
    </div>
  );
};

export const CloseButton: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  const { isDark } = useTheme();
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Cancel"
      className={`inline-flex h-9 w-9 items-center justify-center rounded-lg border ${isDark ? 'border-neutral-700 text-neutral-400 hover:bg-neutral-800' : 'border-neutral-300 text-neutral-500 hover:bg-neutral-100'}`}
    >
      <X className="h-4 w-4" />
    </button>
  );
};

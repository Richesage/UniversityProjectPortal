import React, { useState } from 'react';
import { Eye, EyeOff, KeyRound } from 'lucide-react';

interface PasswordInputProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
}

export function PasswordInput({
  id = 'password',
  value,
  onChange,
  placeholder = 'Enter password',
  required,
  className = '',
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className={`relative ${className}`}>
      <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
      <input
        id={id}
        type={visible ? 'text' : 'password'}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="block w-full pl-9 pr-10 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#312DC4] focus:border-[#312DC4]"
        placeholder={placeholder}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-[#312DC4] rounded-md hover:bg-[#EEEDFB] transition-colors"
        aria-label={visible ? 'Hide password' : 'Show password'}
      >
        {visible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </button>
    </div>
  );
}

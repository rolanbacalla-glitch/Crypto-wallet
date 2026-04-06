import React from 'react';
import { TokenSymbol } from '../../types/types';

interface AmountInputProps {
  value: string;
  onChange: (value: string) => void;
  token?: TokenSymbol;
  placeholder?: string;
  disabled?: boolean;
}

const AmountInput: React.FC<AmountInputProps> = ({ 
  value, 
  onChange, 
  token = 'ETH', 
  placeholder = '0.00',
  disabled = false
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = e.target.value;
    
    // Basic validation to prevent negative amounts
    if (newVal === '' || (parseFloat(newVal) >= 0 && !newVal.includes('-'))) {
      onChange(newVal);
    }
  };

  return (
    <div className="relative w-full group">
      <input
        type="number"
        value={value}
        onChange={handleInputChange}
        placeholder={placeholder}
        disabled={disabled}
        min="0"
        step="0.01"
        className={`
          w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-3xl font-black 
          placeholder:text-text-muted text-white outline-none focus:border-primary/50 
          focus:bg-white/10 transition-all [appearance:textfield] 
          [&::-webkit-outer-spin-button]:appearance-none 
          [&::-webkit-inner-spin-button]:appearance-none
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      />
      <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-2">
        <span className="text-xs font-black tracking-widest text-text-dim uppercase">
          {token}
        </span>
      </div>
    </div>
  );
};

export default AmountInput;

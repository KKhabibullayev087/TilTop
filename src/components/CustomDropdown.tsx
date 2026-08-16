import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export interface CustomDropdownOption<T = string> {
  value: T;
  label: string;
  sublabel?: string;
  icon?: React.ReactNode;
  badge?: string;
  badgeColor?: string;
}

interface CustomDropdownProps<T = string> {
  id?: string;
  options: CustomDropdownOption<T>[];
  value: T;
  onChange: (value: T) => void;
  label?: string;
  placeholder?: string;
  className?: string;
  buttonClassName?: string;
  menuClassName?: string;
  allowCustomInput?: boolean;
  onCustomInputSubmit?: (customVal: string) => void;
  /** Localized copy for the custom-input row; passed in so this stays i18n-agnostic. */
  customInputLabel?: string;
  customInputPlaceholder?: string;
}

export function CustomDropdown<T extends string = string>({
  id,
  options,
  value,
  onChange,
  label,
  placeholder = "Tanlang...",
  className = "",
  buttonClassName = "",
  menuClassName = "",
  allowCustomInput = false,
  onCustomInputSubmit,
  customInputLabel = "Boshqa tilni qo'lda kiriting:",
  customInputPlaceholder = 'Masalan: Yaponcha, Ispancha...',
}: CustomDropdownProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [customText, setCustomText] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (val: T) => {
    onChange(val);
    setIsOpen(false);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customText.trim() && onCustomInputSubmit) {
      onCustomInputSubmit(customText.trim());
      setCustomText('');
      setIsOpen(false);
    }
  };

  return (
    <div id={id} ref={dropdownRef} className={`relative inline-block text-left ${className}`}>
      {label && (
        <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1.5">
          {label}
        </label>
      )}

      {/* Custom Dropdown Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between gap-2.5 px-3.5 py-2.5 rounded-lg bg-surface hover:bg-surface-sunken border border-line text-ink text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
          isOpen ? 'border-accent-500' : ''
        } ${buttonClassName}`}
      >
        <div className="flex items-center gap-2 truncate">
          {selectedOption?.icon && <span>{selectedOption.icon}</span>}
          <span className="truncate">
            {selectedOption ? selectedOption.label : (typeof value === 'string' && value) || placeholder}
          </span>
          {selectedOption?.badge && (
            <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${selectedOption.badgeColor || 'bg-surface-sunken text-ink-muted'}`}>
              {selectedOption.badge}
            </span>
          )}
        </div>
        <ChevronDown className={`w-4 h-4 text-ink-subtle flex-shrink-0 transition-transform duration-150 ${isOpen ? 'rotate-180 text-accent-600' : ''}`} />
      </button>

      {/* Dropdown Menu Popover */}
      {isOpen && (
        <div 
          className={`absolute left-0 mt-1.5 w-full min-w-[220px] max-h-72 overflow-y-auto bg-surface rounded-xl shadow-lg border border-line p-1.5 z-50 animate-fade-up ${menuClassName}`}
        >
          {/* Optional Custom Manual Input */}
          {allowCustomInput && (
            <form onSubmit={handleCustomSubmit} className="p-2 border-b border-line mb-1">
              <p className="text-[10px] font-bold uppercase text-ink-subtle mb-1">
                {customInputLabel}
              </p>
              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  placeholder={customInputPlaceholder}
                  className="flex-1 px-2.5 py-1.5 text-xs bg-surface-muted border border-line rounded-lg text-ink focus:outline-none focus:border-accent-500"
                />
                <button
                  type="submit"
                  disabled={!customText.trim()}
                  className="px-2.5 py-1.5 bg-accent-500 hover:bg-accent-600 text-white rounded-lg text-xs font-semibold transition-colors disabled:opacity-40"
                >
                  OK
                </button>
              </div>
            </form>
          )}

          <div className="space-y-0.5">
            {options.map((option) => {
              const isSelected = option.value === value;
              return (
                <button
                  key={String(option.value)}
                  type="button"
                  onClick={() => handleSelect(option.value)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs sm:text-sm font-medium flex items-center justify-between gap-2 transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-accent-50 text-accent-700 font-semibold'
                      : 'hover:bg-surface-sunken text-ink-muted'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    {option.icon && <span className="text-base">{option.icon}</span>}
                    <div className="truncate">
                      <p className="truncate">{option.label}</p>
                      {option.sublabel && (
                        <p className="text-[10px] text-ink-subtle font-normal">{option.sublabel}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    {option.badge && (
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${option.badgeColor || 'bg-surface-sunken text-ink-muted'}`}>
                        {option.badge}
                      </span>
                    )}
                    {isSelected && <Check className="w-4 h-4 text-accent-600" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

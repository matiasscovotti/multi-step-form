'use client';

import Image from 'next/image';
import { forwardRef, useState, useRef, useEffect, useCallback, type FocusEvent } from 'react';
import PhoneInputWithCountry, { getCountries, getCountryCallingCode } from 'react-phone-number-input';
import type { E164Number } from 'libphonenumber-js/core';
import { CaretDownIcon, MagnifyingGlassIcon } from '@radix-ui/react-icons';
import en from 'react-phone-number-input/locale/en';

import 'react-phone-number-input/style.css';

const FLAG_OVERRIDES: Record<string, string> = {
  AC: 'sh',
  TA: 'sh'
};

const getFlagSrc = (countryCode?: string) => {
  if (!countryCode) return null;
  const override = FLAG_OVERRIDES[countryCode.toUpperCase()];
  const code = (override ?? countryCode).toLowerCase();
  return `https://flagcdn.com/24x18/${code}.png`;
};

interface PhoneInputProps {
  id?: string;
  value?: string;
  onChange?: (value?: string) => void;
  placeholder?: string;
  hasError?: boolean;
  name?: string;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  countryValue?: string;
  onCountryChange?: (countryCode: string) => void;
}

export const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(function PhoneInput(
  { id, value, onChange, placeholder, hasError = false, name, onBlur, countryValue, onCountryChange },
  ref
) {
  const [selectedCountry, setSelectedCountry] = useState<string>(countryValue ?? 'AR');
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const numberInputRef = useRef<HTMLInputElement | null>(null);

  const countries = getCountries();
  
  const filteredCountries = countries.filter((country) => {
    const countryName = en[country]?.toLowerCase() || '';
    const callingCode = getCountryCallingCode(country);
    return (
      countryName.includes(searchTerm.toLowerCase()) ||
      callingCode.includes(searchTerm) ||
      country.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
        setSearchTerm('');
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const input = numberInputRef.current;
    if (!input) return;

    if (!input.value.startsWith('+')) {
      input.value = `+${input.value}`;
    }
  }, [value]);

  useEffect(() => {
    const next = countryValue && countryValue.length ? countryValue : 'AR';
    if (next !== selectedCountry) {
      setSelectedCountry(next);
    }
  }, [countryValue, selectedCountry]);

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      const input = searchInputRef.current;
      const length = input.value.length;
      input.setSelectionRange(length, length);
    }
  }, [isOpen, searchTerm]);

  const keepSearchFocused = useCallback(() => {
    if (searchInputRef.current) {
      const input = searchInputRef.current;
      if (input !== document.activeElement) {
        input.focus();
      }
    }
  }, []);

  const ensureLeadingPlus = useCallback((nextValue: string) => {
    if (!nextValue) return '+';
    return nextValue.startsWith('+') ? nextValue : `+${nextValue}`;
  }, []);

  const handleCountryChange = useCallback(
    (country?: string) => {
      const next = country && country.length ? country : 'AR';
      setSelectedCountry(next);
      onCountryChange?.(next);
    },
    [onCountryChange]
  );

  const handleValueChange = (newValue?: E164Number) => {
    if (typeof newValue === 'string') {
      onChange?.(ensureLeadingPlus(newValue));
      return;
    }

    onChange?.(newValue ?? undefined);
  };

  return (
    <div className="relative">
      <PhoneInputWithCountry
        international
        countryCallingCodeEditable={false}
        country={selectedCountry as any}
        onCountryChange={handleCountryChange as any}
        id={id}
        name={name}
        value={value}
        onChange={handleValueChange}
        onBlur={onBlur}
        placeholder={placeholder}
        className={`w-full px-4 py-2.5 rounded-lg border text-sm sm:text-base text-denim placeholder:text-grey focus:outline-none focus:ring-2 focus:ring-secondary ${
          hasError ? 'border-red' : 'border-border-grey'
        }`}
        numberInputProps={{
          ref: (input: HTMLInputElement | null) => {
            numberInputRef.current = input;
            if (typeof ref === 'function') {
              ref(input);
            } else if (ref) {
              (ref as React.MutableRefObject<HTMLInputElement | null>).current = input;
            }
          },
          className: 'flex-1 outline-none',
          inputMode: 'tel',
          placeholder: '+',
          onBlur: (event: FocusEvent<HTMLInputElement>) => {
            const input = event.currentTarget;
            if (!input.value.startsWith('+')) {
              input.value = `+${input.value}`;
            }
          }
        }}
        countrySelectComponent={({ value, onChange: onCountryChange, options, ...rest }) => (
          <div ref={dropdownRef} className="relative inline-flex mr-2">
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-100 transition-colors"
              aria-haspopup="listbox"
              aria-expanded={isOpen}
            >
              {getFlagSrc(value) ? (
                <Image
                  src={getFlagSrc(value) as string}
                  alt={value ? `${en[value as keyof typeof en] ?? value} flag` : 'Globe icon'}
                  width={24}
                  height={18}
                  className="h-4 w-6 rounded object-cover"
                />
              ) : (
                <span className="text-lg">🌍</span>
              )}
              <CaretDownIcon className={`h-3 w-3 text-grey transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
              <div className="absolute left-0 top-full mt-1 w-80 bg-white border border-border-grey rounded-lg shadow-lg z-50 max-h-96 overflow-hidden flex flex-col">
                <div className="p-3 border-b border-border-grey">
                  <div className="relative">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-grey" />
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search country..."
                      onKeyDown={(event) => {
                        keepSearchFocused();
                        event.stopPropagation();
                      }}
                      onBlur={() => {
                        // Prevent focus loss while dropdown is open
                        if (isOpen) {
                          requestAnimationFrame(keepSearchFocused);
                        }
                      }}
                      className="w-full pl-9 pr-3 py-2 text-sm border border-border-grey rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                    />
                  </div>
                </div>
                
                <ul className="overflow-y-auto flex-1">
                  {filteredCountries.map((country) => {
                    const isSelected = country === selectedCountry;
                    const flagSrc = getFlagSrc(country);
                    const callingCode = getCountryCallingCode(country);
                    const countryName = en[country as keyof typeof en] || country;

                    return (
                      <li key={country}>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedCountry(country);
                            onCountryChange?.(country as any);
                            setIsOpen(false);
                            setSearchTerm('');
                          }}
                          className={`w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors hover:bg-bg ${
                            isSelected ? 'bg-primary/10 text-primary font-semibold' : 'text-denim'
                          }`}
                        >
                          {flagSrc ? (
                            <Image
                              src={flagSrc}
                              alt={`${countryName} flag`}
                              width={24}
                              height={18}
                              className="h-4 w-6 rounded object-cover"
                            />
                          ) : (
                            <span className="text-xs font-semibold uppercase">{country}</span>
                          )}
                          <span className="flex-1">{countryName}</span>
                          <span className="text-grey text-xs">+{callingCode}</span>
                        </button>
                      </li>
                    );
                  })}
                  {filteredCountries.length === 0 && (
                    <li className="px-4 py-8 text-center text-grey text-sm">
                      No countries found
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>
        )}
      />
    </div>
  );
});

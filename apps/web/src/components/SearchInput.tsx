import { useRef, useState } from 'react';
import { Input } from '@/components/ui/input';

interface SearchInputProps {
  onSearch: (value: string) => void;
  placeholder?: string;
  delay?: number;
  className?: string;
}

export function SearchInput({ onSearch, placeholder, delay = 300, className }: SearchInputProps) {
  const [value, setValue] = useState('');
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const next = e.target.value;
    setValue(next);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => onSearch(next), delay);
  }

  return (
    <Input value={value} onChange={handleChange} placeholder={placeholder} className={className} />
  );
}

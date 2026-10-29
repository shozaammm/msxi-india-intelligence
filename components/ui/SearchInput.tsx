import * as React from 'react'
import { Search, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onClear?: () => void
}

export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, onClear, value, ...props }, ref) => {
    return (
      <div className={cn('relative flex items-center w-full', className)}>
        <Search className="absolute left-3 h-4 w-4 text-[#EDE9DF]/40" />
        <input
          ref={ref}
          value={value}
          className="h-10 w-full rounded-md border border-white/[0.08] bg-white/[0.03] pl-9 pr-10 text-sm text-[#EDE9DF] outline-none transition-colors focus:border-[#C5A880]/50 placeholder:text-[#EDE9DF]/30"
          {...props}
        />
        {value && onClear && (
          <button
            onClick={onClear}
            className="absolute right-3 flex h-4 w-4 items-center justify-center rounded-full text-[#EDE9DF]/40 hover:bg-white/[0.05] hover:text-[#EDE9DF]"
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </div>
    )
  }
)
SearchInput.displayName = 'SearchInput'

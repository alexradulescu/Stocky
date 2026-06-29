import { forwardRef } from 'react';

interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'none';
}

const gapMap = { none: 'gap-0', xs: 'gap-1', sm: 'gap-2', md: 'gap-3', lg: 'gap-4', xl: 'gap-6' };

export const Stack = forwardRef<HTMLDivElement, StackProps>(
  ({ gap = 'md', className = '', children, ...props }, ref) => (
    <div ref={ref} className={`flex flex-col ${gapMap[gap]} ${className}`} {...props}>
      {children}
    </div>
  )
);

Stack.displayName = 'Stack';

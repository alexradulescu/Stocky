import { forwardRef } from 'react';

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg';
}

const sizeMap = { sm: 'max-w-xl', md: 'max-w-3xl', lg: 'max-w-5xl' };

export const Container = forwardRef<HTMLDivElement, ContainerProps>(
  ({ size = 'md', className = '', children, ...props }, ref) => (
    <div ref={ref} className={`${sizeMap[size]} mx-auto px-4 ${className}`} {...props}>
      {children}
    </div>
  )
);

Container.displayName = 'Container';

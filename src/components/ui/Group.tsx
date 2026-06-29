import { forwardRef } from 'react';

interface GroupProps extends React.HTMLAttributes<HTMLDivElement> {
  gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'none';
  justify?: 'start' | 'center' | 'end' | 'space-between';
  align?: 'start' | 'center' | 'end' | 'stretch' | 'flex-start';
  grow?: boolean;
  wrap?: boolean;
}

const gapMap = { none: 'gap-0', xs: 'gap-1', sm: 'gap-2', md: 'gap-3', lg: 'gap-4', xl: 'gap-6' };
const justifyMap: Record<string, string> = { start: 'justify-start', center: 'justify-center', end: 'justify-end', 'space-between': 'justify-between' };
const alignMap: Record<string, string> = { start: 'items-start', center: 'items-center', end: 'items-end', stretch: 'items-stretch', 'flex-start': 'items-start' };

export const Group = forwardRef<HTMLDivElement, GroupProps>(
  ({ gap = 'md', justify = 'start', align = 'center', grow, wrap, className = '', children, ...props }, ref) => (
    <div
      ref={ref}
      className={`flex ${gapMap[gap]} ${justifyMap[justify] || ''} ${alignMap[align] || ''} ${grow ? '[&>*]:flex-1' : ''} ${wrap ? 'flex-wrap' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
);

Group.displayName = 'Group';

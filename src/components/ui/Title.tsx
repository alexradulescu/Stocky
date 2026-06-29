import { forwardRef } from 'react';

interface TitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  order?: 1 | 2 | 3 | 4 | 5 | 6;
}

export const Title = forwardRef<HTMLHeadingElement, TitleProps>(
  ({ order = 3, className = '', children, style, ...props }, ref) => {
    const Tag = `h${order}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
    return <Tag ref={ref} className={`font-serif font-semibold leading-tight ${className}`} style={style} {...props}>{children}</Tag>;
  }
);

Title.displayName = 'Title';

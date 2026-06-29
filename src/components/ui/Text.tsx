import { forwardRef } from 'react';

interface TextProps extends React.HTMLAttributes<HTMLElement> {
  size?: '10px' | 'xs' | 'sm' | 'md' | 'lg' | '11px';
  fw?: number;
  ta?: 'left' | 'center' | 'right';
  tt?: 'uppercase' | 'lowercase' | 'capitalize';
  as?: 'span' | 'p' | 'div';
  mb?: string | number;
}

const sizeMap: Record<string, string> = { '10px': 'text-[10px]', '11px': 'text-[11px]', xs: 'text-xs', sm: 'text-sm', md: 'text-base', lg: 'text-lg' };
const weightMap: Record<number, string> = { 400: 'font-normal', 500: 'font-medium', 600: 'font-semibold', 700: 'font-bold' };
const alignMap: Record<string, string> = { left: 'text-left', center: 'text-center', right: 'text-right' };
const transformMap: Record<string, string> = { uppercase: 'uppercase', lowercase: 'lowercase', capitalize: 'capitalize' };

export const Text = forwardRef<HTMLElement, TextProps>(
  ({ size = 'sm', fw, ta, tt, as: Component = 'span', className = '', style, children, mb, ...props }, ref) => {
    const classes = [
      sizeMap[size] || '',
      fw ? (weightMap[fw] || '') : '',
      ta ? (alignMap[ta] || '') : '',
      tt ? (transformMap[tt] || '') : '',
      className,
    ].filter(Boolean).join(' ');

    const finalStyle = {
      ...(mb ? { marginBottom: typeof mb === 'number' ? `${mb}px` : mb } : {}),
      ...style,
    };

    return <Component ref={ref as any} className={classes} style={finalStyle} {...props}>{children}</Component>;
  }
);

Text.displayName = 'Text';

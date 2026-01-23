import { createTheme, MantineColorsTuple, rem } from '@mantine/core';

// Custom gold/amber palette for premium financial aesthetic
const gold: MantineColorsTuple = [
  '#fefbf3',
  '#faf4e1',
  '#f5e8bd',
  '#f0da94',
  '#ebce72',
  '#e8c65b',
  '#e6c24e',
  '#ccab3f',
  '#b69835',
  '#9d8327',
];

// Deep slate palette for sophisticated backgrounds
const slate: MantineColorsTuple = [
  '#f8f9fa',
  '#f1f3f5',
  '#e9ecef',
  '#dee2e6',
  '#ced4da',
  '#adb5bd',
  '#868e96',
  '#495057',
  '#343a40',
  '#212529',
];

// Rich emerald for success states
const emerald: MantineColorsTuple = [
  '#f0fdf4',
  '#dcfce7',
  '#bbf7d0',
  '#86efac',
  '#4ade80',
  '#22c55e',
  '#16a34a',
  '#15803d',
  '#166534',
  '#14532d',
];

export const theme = createTheme({
  // Premium color palette
  primaryColor: 'gold',
  colors: {
    gold,
    slate,
    emerald,
  },

  // Distinctive typography - Source Serif Pro for elegance, DM Sans for clarity
  fontFamily: '"DM Sans", -apple-system, BlinkMacSystemFont, sans-serif',
  headings: {
    fontFamily: '"Source Serif 4", Georgia, serif',
    fontWeight: '600',
  },

  // Refined spacing scale
  spacing: {
    xs: rem(8),
    sm: rem(12),
    md: rem(20),
    lg: rem(28),
    xl: rem(40),
  },

  // Elegant radius - slightly softer than default
  radius: {
    xs: rem(4),
    sm: rem(8),
    md: rem(12),
    lg: rem(20),
    xl: rem(32),
  },

  // Premium shadows for depth
  shadows: {
    xs: '0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.1)',
    sm: '0 4px 6px -1px rgba(0, 0, 0, 0.07), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    md: '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    lg: '0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    xl: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
  },

  // Default radius for components
  defaultRadius: 'md',

  // Component-specific overrides for premium feel
  components: {
    // Ensure inputs have 16px font to prevent iOS zoom - with premium styling
    TextInput: {
      styles: {
        input: {
          fontSize: '16px',
          backgroundColor: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          transition: 'all 0.2s ease',
          '&:focus': {
            borderColor: 'var(--mantine-color-gold-5)',
            boxShadow: '0 0 0 3px rgba(230, 194, 78, 0.15)',
          },
        },
        label: {
          fontWeight: 500,
          marginBottom: rem(6),
          fontSize: rem(13),
          letterSpacing: '0.02em',
          textTransform: 'uppercase' as const,
          color: 'var(--mantine-color-slate-5)',
        },
      },
    },
    NumberInput: {
      styles: {
        input: {
          fontSize: '16px',
          backgroundColor: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          transition: 'all 0.2s ease',
          '&:focus': {
            borderColor: 'var(--mantine-color-gold-5)',
            boxShadow: '0 0 0 3px rgba(230, 194, 78, 0.15)',
          },
        },
        label: {
          fontWeight: 500,
          marginBottom: rem(6),
          fontSize: rem(13),
          letterSpacing: '0.02em',
          textTransform: 'uppercase' as const,
          color: 'var(--mantine-color-slate-5)',
        },
      },
    },
    DateInput: {
      styles: {
        input: {
          fontSize: '16px',
          backgroundColor: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          transition: 'all 0.2s ease',
          '&:focus': {
            borderColor: 'var(--mantine-color-gold-5)',
            boxShadow: '0 0 0 3px rgba(230, 194, 78, 0.15)',
          },
        },
        label: {
          fontWeight: 500,
          marginBottom: rem(6),
          fontSize: rem(13),
          letterSpacing: '0.02em',
          textTransform: 'uppercase' as const,
          color: 'var(--mantine-color-slate-5)',
        },
      },
    },
    Button: {
      styles: {
        root: {
          fontWeight: 600,
          letterSpacing: '0.02em',
          transition: 'all 0.2s ease',
        },
      },
    },
    Card: {
      styles: {
        root: {
          backgroundColor: 'rgba(255, 255, 255, 0.02)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.06)',
        },
      },
    },
    Modal: {
      styles: {
        content: {
          backgroundColor: 'var(--mantine-color-slate-9)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
        },
        header: {
          backgroundColor: 'transparent',
        },
        title: {
          fontFamily: '"Source Serif 4", Georgia, serif',
          fontWeight: 600,
        },
      },
    },
    Table: {
      styles: {
        table: {
          backgroundColor: 'transparent',
        },
        th: {
          fontSize: rem(11),
          fontWeight: 600,
          letterSpacing: '0.08em',
          textTransform: 'uppercase' as const,
          color: 'var(--mantine-color-slate-5)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          padding: `${rem(14)} ${rem(16)}`,
        },
        td: {
          borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
          padding: `${rem(16)} ${rem(16)}`,
        },
      },
    },
    Progress: {
      styles: {
        root: {
          backgroundColor: 'rgba(255, 255, 255, 0.06)',
        },
      },
    },
  },
});

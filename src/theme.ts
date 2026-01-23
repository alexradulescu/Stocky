import { createTheme } from '@mantine/core';

export const theme = createTheme({
  primaryColor: 'blue',
  fontFamily: 'system-ui, -apple-system, sans-serif',
  components: {
    // Ensure inputs have 16px font to prevent iOS zoom
    TextInput: {
      styles: { input: { fontSize: '16px' } }
    },
    NumberInput: {
      styles: { input: { fontSize: '16px' } }
    },
    DateInput: {
      styles: { input: { fontSize: '16px' } }
    }
  }
});

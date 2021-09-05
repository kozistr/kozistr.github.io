export default {
  initialColorModeName: 'light',
  fonts: {
    body: 'system-ui, sans-serif',
    heading: '"Avenir Next", sans-serif',
    monospace: 'Menlo, monospace',
  },
  colors: {
    text: '#24292e',
    background: '#fff',
    primary: '#07c',
    accent: '#333',
    muted: '#a8a8a8',
    modes: {
      dark: {
        text: '#fff',
        background: '#222222',
        secondary: '#fff',
        muted: '#f6f6f6',
      },
      tomato: {
        text: '#565656',
        background: 'tomato',
        primary: 'tomato',
      },
      deep: {
        text: 'hsl(210, 50%, 96%)',
        background: 'hsl(230, 25%, 18%)',
        primary: 'hsl(260, 100%, 80%)',
      },
    },
  },
};

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
    modes: {
      dark: {
        text: '#e4e4e4',
        background: '#141414',
        primary: '#0cf',
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

import Typography from 'typography';

const typography = new Typography({
  baseFontSize: '16px',
  baseLineHeight: 1.666,
  headerFontFamily: ['Nanum Gothic'],
  bodyFontFamily: ['Nanum Gothic'],
});

const googleFonts: { name: string; bold?: number[] }[] = [
  {
    name: 'BlinkMacSystemFont',
    bold: [400, 700],
  },
  {
    name: 'Segoe UI',
    bold: [400, 700],
  },
  {
    name: 'Roboto',
    bold: [300, 400, 700],
  },
  { name: 'Oxygen-Sans' },
  { name: 'Ubuntu' },
  { name: 'Cantarell' },
];

const googleFont = googleFonts
  .map(v => {
    if (v.bold) {
      return `${v.name.replace(/ /gi, '+')}:${v.bold.toString()}`;
    } else {
      return `${v.name.replace(/ /gi, '+')}`;
    }
  })
  .join('%7C')
  .toString();

export { googleFont, typography as default };

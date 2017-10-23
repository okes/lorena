module.exports = {
  host: process.env.NODE_HOST || 'localhost', // Define your host from 'package.json'
  port: process.env.PORT,
  app: {
    htmlAttributes: { lang: 'es' },
    title: 'Tio Manolo Control',
    titleTemplate: 'Tio Manolo Control - %s',
    meta: [
      {
        name: 'description',
        content: 'Tio Manolo Control, administrador de finanzas, stock y personal.',
      },
    ],
  },
};

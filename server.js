const express = require('express');
const { epcss } = require('@tycrek/express-postcss');
const path = require('path');
const tailwindcss = require('tailwindcss');
const autoprefixer = require('autoprefixer');
const app = express();

app.set('view engine', 'pug');

// Load the JSON data
const data = require('./data.json');

// Use express-postcss middleware
app.use(
  '/css',
  epcss({
    cssPath: path.join('tailwind.css'),
    plugins: [
      tailwindcss(),
      autoprefixer()
    ],
    errorHandler(err, req, res, next) {
      console.log('PostCSS', err.toString());
      next(err);
    }
  })
);

app.get('/', (req, res) => {
  // Pass the data to the Pug template
  res.render('index', { data: data });
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});

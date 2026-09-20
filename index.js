const express = require('express');
const path = require('path');
const { getGitInfo } = require('./getVersion');
const fs = require('fs');

const app = express();
const port = 2514;

const safeRegex = /^[0-9]+$/;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use((req, res, next) => {
  res.locals.canonicalUrl = `https://zskathon.vercel.app${req.path}`;
  next();
});

app.get('/robots.txt', (req, res) => {
  res.type('text/plain');
  res.send(`
# hi :3
# no secrets here yet
User-agent: *
Allow: /
Sitemap: https://zskathon.vercel.app/sitemap.xml
`);
});

app.get('/sitemap.xml', (req, res) => {
  const urls = ['/'];
  
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls.map(path => `
    <url>
      <loc>https://zskathon.vercel.app${path}</loc>
      <changefreq>daily</changefreq>
      <priority>0.8</priority>
    </url>`).join('')}
</urlset>`;

  res.header('Content-Type', 'text/xml');
  res.send(xml);
});

const siteDir = __dirname;

app.get('/api/version', (req, res) => {
  res.json({ version: getGitInfo(), year: new Date().getFullYear() });
});

app.get('/', function(req, res){
  res.sendFile(path.join(siteDir, 'app', `index.html`));
});

/* 
Yes, if you know about the source code, and know where to look, you can find this. 
However this isn't supposed to be accessible to the public yet, therefore it is hidden.
*/

app.get('/upcoming', function(req, res){
  res.sendFile(path.join(siteDir, 'new', `index.html`));
});

app.get('/help', function(req, res){
  res.sendFile(path.join(siteDir, `infografika.html`));
});

app.get('/archive', function(req, res){
    res.sendFile(path.join(siteDir, `archive.html`));
});

app.get('/zgody', function(req, res){
    res.sendFile(path.join(siteDir, `zgody.html`));
});

app.get('/mapa', function(req, res){
    res.sendFile(path.join(siteDir, `mapa.pdf`));
});

app.get('/:id', function(req, res){
  const {id} = req.params;

  if (!safeRegex.test(id)) {
    return res.status(400).sendFile(siteDir + '/400.html');
  }

  const targetPath = path.join(siteDir, 'archives', `${id}`, 'index.html');

  if (fs.existsSync(targetPath)) res.sendFile(targetPath);
  else return res.status(404).sendFile(siteDir + '/404.html');
});

/*app.get('*', function(req,res){
  res.send('Not Found');
});*/

app.use( (req,res,next)=>{
  res.sendFile(siteDir + '/404.html');
})

app.listen(port, () => {
  console.log(`everything works! yippee :3 http://localhost:${port} <~ hosted here`);
  console.log(`current commit: ${getGitInfo()}`);
  console.log(`datetime started: ${new Date().toISOString()}`);
  console.log(`testing new site locally here: http://localhost:${port}/upcoming?time=true`);
});

module.exports = app;
const express = require('express');
const path = require('path');
const { getGitInfo } = require('./getVersion');
const fs = require('fs');

const app = express();
const port = 666;

const safeRegex = /^[0-9]+$/;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

const siteDir = __dirname;

app.get('/api/version', (req, res) => {
  res.json({ version: getGitInfo(), year: new Date().getFullYear() });
});

app.get('/', function(req, res){
  res.sendFile(path.join(siteDir, 'app', `index.html`));
});

app.get('/unofficial', function(req, res){
  res.sendFile(path.join(siteDir, 'new', `index.html`));
});

app.get('/archive', function(req, res){
    res.sendFile(path.join(siteDir, `archive.html`));
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
});

module.exports = app;
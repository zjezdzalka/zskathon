const express = require('express');
const path = require('path');
const { getGitInfo } = require('./getVersion');
const fs = require('fs');

const app = express();
const port = 3000;

const safeRegex = /^[0-9]+$/;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

const siteDir = __dirname + '/sites';

app.get('/api/version', (req, res) => {
  res.json({ version: getGitInfo() });
});

app.get('/', function(req, res){
  res.sendFile(path.join(siteDir, 'app', `index.html`));
});

app.get('/archives/:id', function(req, res){
  const {id} = req.params;

  if (!safeRegex.test(id)) {
    return res.status(400).send('no dir traversing 4 u :3');
  }

  const targetPath = path.join(siteDir, 'archives', `${id}`, 'index.html');

  if (fs.existsSync(targetPath)) res.sendFile(targetPath);
  else return res.status(404).send('no file found :((');
});

/*app.get('*', function(req,res){
  res.send('Not Found');
});*/

app.use( (req,res,next)=>{
  res.sendFile(siteDir + '/404.html');
})

app.listen(port, () => {
  console.log(`everything works! yippee :3 http://localhost:${port} <~ hosted here`);
});

module.exports = app;
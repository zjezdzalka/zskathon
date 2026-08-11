import fs from 'fs';
import path from 'path';

function getGitInfo() {
  try {
    const gitDir = path.resolve('.git');
    
    const headContent = fs.readFileSync(path.join(gitDir, 'HEAD'), 'utf-8').trim();
    
    if (headContent.startsWith('ref:')) {
      const branchPath = headContent.replace('ref: ', '');
      const branch = branchPath.split('/').pop();
      
      const commit = fs.readFileSync(path.join(gitDir, branchPath), 'utf-8').trim().substring(0, 7);
      
      return `${branch=="master"?"main":branch}@${commit}`;
    } else {
      return `detached@${headContent.substring(0, 7)}`;
    }
  } catch (error) {
    console.error('FS Git read failed:', error.message);
    return 'null@null';
  }
}

export { getGitInfo };
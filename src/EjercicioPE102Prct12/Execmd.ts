import * as express from 'express';
import {Execmd} from './execCommand';

const app = express();

app.get('/pexecmd', (req, res) => {
  if (!req.query.cmd || !req.query.args) {
    res.send({
      error: 'A command and his arguments have to be provided',
    });
  } else {
    Execmd.promiseExecCommand(req.query.cmd + ' ' + req.query.args).then((output) => {
      res.send({'output': output});
    }).catch((error) => {
      res.send({'error': error});
    });
  }
});

app.get('/execmd', (req, res) => {
  if (!req.query.cmd || !req.query.args) {
    res.send({
      error: 'A command and his arguments have to be provided',
    });
  } else {
    Execmd.execCommand(req.query.cmd + ' ' + req.query.args, (err, data) => {
      if (err) {
        res.send({'error': err});
      } else {
        res.send({'output': data});
      }
    });
  }
});

app.get('*', (req, res) => {
  res.send('<h1>404</h1>');
});

app.listen(3000, () => {
  console.log('Server is up on port 3000');
});
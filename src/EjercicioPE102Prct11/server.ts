import {spawn} from 'child_process';
import * as net from 'net';


net.createServer({allowHalfOpen: true}, (connection) => {
  console.log('A client has connected.');
  connection.write(JSON.stringify({'type': 'connected'}));
  let petition: string = '';
  connection.on('data', (data) => {
    petition = data.toString();
  });
  connection.on('end', () => {
    console.log(`Command to execute: ${petition}`);
    const command = spawn(petition, {shell: true});
    command.stdout.on('data', (dataChunk) => {
      connection.write(JSON.stringify({'type': 'success', 'msg': dataChunk.toString()}));
      connection.end();
    });
    command.stderr.on('data', (error) => {
      connection.write(JSON.stringify({'type': 'stderr', 'msg': error.toString()}));
      connection.end();
    });
  });
  connection.on('close', () => {
    console.log('A client has disconnected.');
  });
}).listen(60300, () => {
  console.log('Waiting for clients to connect.');
});
import * as net from 'net';
import {NoteManager} from './NoteManager';
import {RequestType} from './types';

net.createServer({allowHalfOpen: true}, (connection) => {
  console.log('A client has connected.');
  connection.write(JSON.stringify({type: 'connected'}));

  let request: RequestType;
  connection.on('data', (data) => {
    request = JSON.parse(data.toString());
    console.log(`Request type: ${request.type}`);
    switch (request.type) {
      case 'add':
        if (request.title && request.body && request.color) {
          const manager: NoteManager = new NoteManager();
          manager.addNote(request.user, request.title, request.body, request.color, (err, data) => {
            if (err) {
              connection.write(JSON.stringify({type: 'add', success: false, message: err}));
              connection.end();
            } else if (data) {
              connection.write(JSON.stringify({type: 'add', success: true, message: data}));
              connection.end();
            }
          });
        }
        break;
      case 'update':
        if (request.title && request.body && request.color) {
          const manager: NoteManager = new NoteManager();
          manager.editNote(request.user, request.title, request.body, request.color, (err, data) => {
            if (err) {
              connection.write(JSON.stringify({type: 'update', success: false, message: err}));
              connection.end();
            } else if (data) {
              connection.write(JSON.stringify({type: 'update', success: true, message: data}));
              connection.end();
            }
          }, request.newTitle);
        }
        break;/*
      case 'remove':
        if (request.title) {
          NoteManager.removeNote(request.user, request.title);
          connection.end();
        }
        break;
      case 'read':
        if (request.title) {
          NoteManager.readNote(request.user, request.title);
          connection.end();
        }
        break;
      case 'list':
        NoteManager.listNotes(request.user);
        connection.end();
        break;*/
      default:
        connection.write('Invalid request type');
        connection.end();
    }
  });

  connection.on('close', () => {
    console.log('A client has disconnected.');
  });
}).listen(60300, () => {
  console.log('Waiting for clients to connect.');
});
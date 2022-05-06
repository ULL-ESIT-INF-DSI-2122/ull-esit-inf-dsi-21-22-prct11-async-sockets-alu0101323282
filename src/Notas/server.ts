import * as net from 'net';
import {NoteManager} from './NoteManager';
import {RequestType} from './types';

export class NoteServer {
  constructor() {
    net.createServer({allowHalfOpen: true}, (connection) => {
      console.log('A client has connected.');

      connection.on('data', (data) => {
        let request: RequestType;
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
            break;
          case 'remove':
            if (request.title) {
              const manager: NoteManager = new NoteManager();
              manager.removeNote(request.user, request.title, (err, data) => {
                if (err) {
                  connection.write(JSON.stringify({type: 'remove', success: false, message: err}));
                  connection.end();
                } else if (data) {
                  connection.write(JSON.stringify({type: 'remove', success: true, message: data}));
                  connection.end();
                }
              });
            }
            break;
          case 'read':
            if (request.title) {
              const manager: NoteManager = new NoteManager();
              manager.readNote(request.user, request.title, (err, data) => {
                if (err) {
                  connection.write(JSON.stringify({type: 'read', success: false, message: err}));
                  connection.end();
                } else if (data) {
                  connection.write(JSON.stringify({type: 'read', success: true, message: data}));
                  connection.end();
                }
              });
            }
            break;
          case 'list':
            const manager: NoteManager = new NoteManager();
            manager.listNotes(request.user, (err, data) => {
              if (err) {
                connection.write(JSON.stringify({type: 'list', success: false, message: err}));
                connection.end();
              } else if (data) {
                connection.write(JSON.stringify({type: 'list', success: true, message: 'Your notes', notes: data}));
                connection.end();
              }
            });
            break;
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
  }
}

new NoteServer();
# __Práctica 11 - Cliente y servidor para una aplicación de procesamiento de notas de texto__

## Marc Carbonell González de Chaves

[![Tests](https://github.com/ULL-ESIT-INF-DSI-2122/ull-esit-inf-dsi-21-22-prct11-async-sockets-alu0101323282/actions/workflows/tests.yml/badge.svg)](https://github.com/ULL-ESIT-INF-DSI-2122/ull-esit-inf-dsi-21-22-prct11-async-sockets-alu0101323282/actions/workflows/tests.yml)
[![Coverage Status](https://coveralls.io/repos/github/ULL-ESIT-INF-DSI-2122/ull-esit-inf-dsi-21-22-prct11-async-sockets-alu0101323282/badge.svg?branch=main)](https://coveralls.io/github/ULL-ESIT-INF-DSI-2122/ull-esit-inf-dsi-21-22-prct11-async-sockets-alu0101323282?branch=main)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=ULL-ESIT-INF-DSI-2122_ull-esit-inf-dsi-21-22-prct11-async-sockets-alu0101323282&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=ULL-ESIT-INF-DSI-2122_ull-esit-inf-dsi-21-22-prct11-async-sockets-alu0101323282)

## __Tareas previas__
- Acepté la [asignación de GitHub Classroom](https://classroom.github.com/a/GJHRHQX0) asociada a esta práctica.
- Me familiaricé con el [módulo](https://nodejs.org/dist/latest-v18.x/docs/api/net.html) `net` de [Node.js](https://nodejs.org/dist/latest-v18.x/docs/api/net.html).
- Me familiaricé con la clase `EventEmitter` [del módulo](https://nodejs.org/dist/latest-v18.x/docs/api/events.html#events_class_eventemitter) `Events` de [Node.js](https://nodejs.org/dist/latest-v18.x/docs/api/net.html).
- Instalé las versiones de los paquetes [yargs](https://www.npmjs.com/package/yargs) y [chalk](https://www.npmjs.com/package/chalk) indicadas en el guión de la Práctica 9.

## __Planteamiento__
Para el desarrollo práctica he creado un total de 7 ficheros:
 - server.ts: contiene la clase `NoteServer` en cuyo constructor se crea el servidor de la aplicación de procesamiento de notas.
 - client.ts: contiene el manejo de argumentos pasados por línea de comandos mediante [yargs](https://www.npmjs.com/package/yargs). En el manejador de cada comando se envía la petición correspondiente al servidor.
 - NoteClient.ts: contiene la clase `NoteClient` que sirve para conectarse como cliente al servidor de la aplicación y que contiene dos métodos para enviar una petición `sendRequest()` y para procesar la respuesta del servidor `processResponse()`.
 - ClientResponseEmitter.ts: contiene la clase `ClientResponseEmitter` que emite un evento `response` cuando recibe una respuesta del servidor.
 - types.ts: contiene los tipos personalizados `RequestType` y `ResponseType` para las peticiones y las respuestas, y el enumerador `Colors` para los colores de las notas.
 - Note.ts: contiene la clase `Note` para representar una nota (Práctica 9)
 - NoteManager.ts: contiene la clase `NoteManager` con los métodos para la creación, modificación, borrado, lectura y listado de notas.

### __Servidor__
El servidor se encuentra en el fichero `server.ts`, donde el contructor de la clase `NoteServer` hace lo siguiente:
- Crea el servidor mediante la función `net.createServer()`
- Con un manejador para el evento `data` recibe una petición enviada desde el cliente y emite un evento `request` con dicha petición parseada.
- Con un manejador para el evento `request` procesa la petición del cliente, llamando al método correspondiente de la clase `NoteManager`. En la llamda a dicho método se envía la respuesta al cliente y se cierra parcialmente el socket con `end()`.
- Con un manejador para el evento `close` muestra un mensaje informando de que un cliente se ha desconectado.

``` typescript
export class NoteServer {
  constructor() {
    net.createServer({allowHalfOpen: true}, (connection) => {
      console.log('A client has connected.');

      connection.on('data', (data) => {
        let request: RequestType;
        request = JSON.parse(data.toString());
        connection.emit('request', request);
      });

      connection.on('request', (request) => {
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
```

### __Cliente__
El cliente se encuentra en el fichero `client.ts` y utiliza la clase `NoteClient`. Mediante el paquete [yargs](https://www.npmjs.com/package/yargs) se gestiona el paso de argumentos desde línea de comandos, de esta manera para cada comando se tiene su propio manejador que realiza lo siguiente:
- Crea un nuevo objeto `NoteClient`
- Crea una petición, es decir un objeto de tipo `RequestType`. 
- Se envía dicha petición mediante el método `sendRequest()` de `NoteClient`.
- Se procesa la respuesta del servidor mediante el método `processResponse()` de `NoteClient`.

``` typescript
yargs.command({
  command: 'add',
  describe: 'Add a new note',
  builder: {
    user: {
      describe: 'User name',
      demandOption: true,
      type: 'string',
    },
    title: {
      describe: 'Note title',
      demandOption: true,
      type: 'string',
    },
    body: {
      describe: 'Note body',
      demandOption: true,
      type: 'string',
    },
    color: {
      describe: 'Note color',
      demandOption: true,
      type: 'string',
      choices: ['red', 'blue', 'yellow', 'green'],
    },
  },
  handler(argv) {
    if (typeof argv.user === 'string' && typeof argv.title === 'string' && typeof argv.body === 'string' && typeof argv.color === 'string') {
      const noteClient = new NoteClient();
      const request: RequestType = {
        type: 'add',
        user: argv.user,
        title: argv.title,
        body: argv.body,
        color: argv.color,
      };
      noteClient.sendRequest(request);
      noteClient.processResponse();
    }
  },
}).command({
  command: 'edit',
  describe: 'Edit a note',
  builder: {
    user: {
      describe: 'User name',
      demandOption: true,
      type: 'string',
    },
    title: {
      describe: 'Note title',
      demandOption: true,
      type: 'string',
    },
    newTitle: {
      describe: 'New note title',
      demandOption: false,
      type: 'string',
    },
    body: {
      describe: 'Note body',
      demandOption: true,
      type: 'string',
    },
    color: {
      describe: 'Note color',
      demandOption: true,
      type: 'string',
      choices: ['red', 'blue', 'yellow', 'green'],
    },
  },
  handler(argv) {
    if (typeof argv.user === 'string' && typeof argv.title === 'string' && typeof argv.body === 'string' && typeof argv.color === 'string') {
      const noteClient = new NoteClient();
      let request: RequestType;
      if (typeof argv.newTitle === 'string') {
        request = {
          type: 'update',
          user: argv.user,
          title: argv.title,
          newTitle: argv.newTitle,
          body: argv.body,
          color: argv.color,
        };
      } else {
        request = {
          type: 'update',
          user: argv.user,
          title: argv.title,
          body: argv.body,
          color: argv.color,
        };
      }
      noteClient.sendRequest(request);
      noteClient.processResponse();
    }
  },
}).command({
  command: 'remove',
  describe: 'Remove a note',
  builder: {
    user: {
      describe: 'User name',
      demandOption: true,
      type: 'string',
    },
    title: {
      describe: 'Note title',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.user === 'string' && typeof argv.title === 'string') {
      const noteClient = new NoteClient();
      const request: RequestType = {
        type: 'remove',
        user: argv.user,
        title: argv.title,
      };
      noteClient.sendRequest(request);
      noteClient.processResponse();
    }
  },
}).command({
  command: 'read',
  describe: 'Read a note',
  builder: {
    user: {
      describe: 'User name',
      demandOption: true,
      type: 'string',
    },
    title: {
      describe: 'Note title',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.user === 'string' && typeof argv.title === 'string') {
      const noteClient = new NoteClient();
      const request: RequestType = {
        type: 'read',
        user: argv.user,
        title: argv.title,
      };
      noteClient.sendRequest(request);
      noteClient.processResponse();
    }
  },
}).command({
  command: 'list',
  describe: 'List user notes',
  builder: {
    user: {
      describe: 'User name',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.user === 'string') {
      const noteClient = new NoteClient();
      const request: RequestType = {
        type: 'list',
        user: argv.user,
      };
      noteClient.sendRequest(request);
      noteClient.processResponse();
    }
  },
}).parse();
```

### __NoteClient__



### __NoteManager__

Para esta práctica utilicé como base la aplicación de procesamiento de notas de la Práctica 9, por lo que los métodos para la creación, modificación, borrado, lectura y listado de notas son los mismos, estos solo se han adaptado para que cumplan con el patrón callback. Así pues, la clase `NoteManager` queda ahora de esta forma:

``` typescript
export class NoteManager {
  addNote = (user: string, title: string, body: string, color: string, cb: (
    err: string | undefined, data: string | undefined) => void) => {
    readdir(`src/Notas/${user}`, (err, files) => {
      if (err) {
        mkdir(`src/Notas/${user}`, {recursive: true}, (err) => {
          if (err) cb(err.message, undefined);
        });
        writeFile(`src/Notas/${user}/${title}.json`, JSON.stringify(new Note(user, title, body, color)), (err) => {
          if (err) {
            cb('Something went wrong when writing your file', undefined);
          } else {
            cb(undefined, `Note created!`);
          }
        });
      } else {
        let alreadyExists: boolean = false;
        files.forEach((file) => {
          if (file === title + '.json') {
            alreadyExists = true;
          }
        });
        if (alreadyExists) {
          cb('There is already a note with that name', undefined);
          alreadyExists = false;
        } else {
          writeFile(`src/Notas/${user}/${title}.json`, JSON.stringify(new Note(user, title, body, color)), (err) => {
            if (err) {
              cb('Something went wrong when writing your file', undefined);
            } else {
              cb(undefined, `Note created!`);
            }
          });
        }
      }
    });
  };
  editNote = (user: string, title: string, body: string, color: string, cb: (
    err: string | undefined, data: string | undefined) => void, newTitle?: string) => {
    if (existsSync(`src/Notas/${user}/${title}.json`)) {
      if (newTitle) {
        readdir(`src/Notas/${user}`, (err, files) => {
          if (err) {
            cb('Error reading notes directory', undefined);
          } else {
            let alreadyExists: boolean = false;
            files.forEach((file) => {
              if (file === newTitle + '.json') {
                alreadyExists = true;// //////////////77
              }
            });
            if (alreadyExists) {
              cb('There is already a note with that name', undefined);
            } else {
              rename(`src/Notas/${user}/${title}.json`, `src/Notas/${user}/${newTitle}.json`, (err) => {
                if (err) cb('Error renaming the note', undefined);
              });
              writeFile(`src/Notas/${user}/${newTitle}.json`, JSON.stringify(new Note(user, newTitle, body, color)), (err) => {
                if (err) {
                  cb('Something went wrong when writing your file', undefined);
                } else {
                  cb(undefined, `Note edited!`);
                }
              });
            }
          }
        });
      } else {
        writeFile(`src/Notas/${user}/${title}.json`, JSON.stringify(new Note(user, title, body, color)), (err) => {
          if (err) {
            cb('Something went wrong when writing your file', undefined);
          } else {
            cb(undefined, `Note edited!`);
          }
        });
      }
    } else {
      cb('Note not found', undefined);
    }
  };
  removeNote = (user: string, title: string, cb: (
    err: string | undefined, data: string | undefined) => void) => {
    if (existsSync(`src/Notas/${user}/${title}.json`)) {
      rm(`src/Notas/${user}/${title}.json`, (err) => {
        if (err) {
          cb('Error removing the note', undefined);
        } else {
          cb(undefined, 'Note removed!');
        }
      });
    } else {
      cb('Note not found', undefined);
    }
  };
  readNote = (user: string, title: string, cb: (
    err: string | undefined, data: string | undefined) => void) => {
    if (existsSync(`src/Notas/${user}/${title}.json`)) {
      readFile(`src/Notas/${user}/${title}.json`, (err, data) => {
        if (err) {
          cb('There must be a problem with the file you are trying to read', undefined);
        } else {
          cb(undefined, data.toString());
        }
      });
    } else {
      cb('Note not found', undefined);
    }
  };
  listNotes = (user: string, cb: (
    err: string | undefined, data: string[] | undefined) => void) => {
    readdir(`src/Notas/${user}`, (err, files) => {
      if (err) {
        cb('Error reading notes directory', undefined);
      } else if (files.length === 0) {
        cb('The notes directory is empty', undefined);
      } else {
        let notes: string[] = [];
        files.forEach((file) => {
          readFile(`src/Notas/${user}/${file}`, (err, data) => {
            if (err) {
              cb('Error reading note file', undefined);
            } else {
              notes.push(data.toString());
              if (notes.length === files.length) {
                cb(undefined, notes);
              }
            }
          });
        });
      }
    });
  };
}
```

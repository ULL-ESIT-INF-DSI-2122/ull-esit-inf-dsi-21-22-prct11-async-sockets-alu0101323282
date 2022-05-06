import * as yargs from 'yargs';
import {NoteManager} from './NoteManager';
import * as net from 'net';
import {ClientRequestEmitter} from './ClientRequestEmitter';
import {RequestType, ResponseType} from './types';
import chalk = require('chalk');

function connectClient(client: ClientRequestEmitter): void {
  client.on('response', (data) => {
    const response: ResponseType = data;
    if (response.type === 'connected') {
      console.log(`Connection established`);
    } else {
      if (response.success) {
        console.log(chalk.green(response.message));
      } else {
        console.log(chalk.red(response.message));
      }
    }
  });
}

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
    },
  },
  handler(argv) {
    if (typeof argv.user === 'string' && typeof argv.title === 'string' && typeof argv.body === 'string' && typeof argv.color === 'string') {
      const socket = net.connect({port: 60300});
      const client = new ClientRequestEmitter(socket);
      connectClient(client);
      const request: RequestType = {
        type: 'add',
        user: argv.user,
        title: argv.title,
        body: argv.body,
        color: argv.color,
      };
      socket.write(JSON.stringify(request));
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
    },
  },
  handler(argv) {
    if (typeof argv.user === 'string' && typeof argv.title === 'string' && typeof argv.body === 'string' && typeof argv.color === 'string') {
      const socket = net.connect({port: 60300});
      const client = new ClientRequestEmitter(socket);
      connectClient(client);
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
      socket.write(JSON.stringify(request));
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
      NoteManager.removeNote(argv.user, argv.title);
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
      NoteManager.readNote(argv.user, argv.title);
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
      NoteManager.listNotes(argv.user);
    }
  },
}).parse();
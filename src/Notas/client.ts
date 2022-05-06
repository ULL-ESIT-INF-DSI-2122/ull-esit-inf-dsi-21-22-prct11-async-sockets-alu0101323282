import * as yargs from 'yargs';
import {NoteClient} from './NoteClient';
import {RequestType} from './types';

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
import * as net from 'net';
import {Color, RequestType, ResponseType} from './types';
import chalk = require('chalk');
import {Note} from './Note';
import EventEmitter = require('events');
import {ClientResponseEmitter} from './ClientResponseEmitter';

/**
 * Class to manage client session in the note-app
 */
export class NoteClient {
  /**
   * Socket
   */
  private readonly socket: net.Socket;
  /**
   * Client response emitter
   */
  private readonly client: EventEmitter;
  /**
   * Constructor
   */
  constructor() {
    this.socket = net.connect({port: 60300});
    this.client = new ClientResponseEmitter(this.socket);
  }
  /**
   * Sends a request to the server
   * @param request Request to send
   */
  sendRequest(request: RequestType): void {
    this.socket.write(JSON.stringify(request));
  }

  /**
   * Process server response
   */
  processResponse(): void {
    this.client.on('response', (data) => {
      const response: ResponseType = data;
      if (response.success) {
        if (response.type === 'read') {
          const note: Note = Note.deserialize(JSON.parse(response.message));
          switch (note.getColor()) {
            case Color.RED:
              console.log(chalk.red(note.getTitle()));
              console.log(chalk.red(note.getBody()));
              break;
            case Color.GREEN:
              console.log(chalk.green(note.getTitle()));
              console.log(chalk.green(note.getBody()));
              break;
            case Color.YELLOW:
              console.log(chalk.yellow(note.getTitle()));
              console.log(chalk.yellow(note.getBody()));
              break;
            case Color.BLUE:
              console.log(chalk.blue(note.getTitle()));
              console.log(chalk.blue(note.getBody()));
              break;
          }
        } else if (response.type === 'list') {
          console.log(chalk.green(response.message));
          if (response.notes) {
            response.notes.forEach((userNote) => {
              const note: Note = Note.deserialize(JSON.parse(userNote));
              switch (note.getColor()) {
                case Color.RED:
                  console.log(chalk.red(note.getTitle()));
                  break;
                case Color.GREEN:
                  console.log(chalk.green(note.getTitle()));
                  break;
                case Color.YELLOW:
                  console.log(chalk.yellow(note.getTitle()));
                  break;
                case Color.BLUE:
                  console.log(chalk.blue(note.getTitle()));
                  break;
              }
            });
          }
        } else {
          console.log(chalk.green(response.message));
        }
      } else {
        console.log(chalk.red(response.message));
      }
    });
  }
}
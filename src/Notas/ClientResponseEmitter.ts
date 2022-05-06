import {EventEmitter} from 'events';

/**
 * Class that extends from EventEmitter
 */
export class ClientResponseEmitter extends EventEmitter {
  /**
   * Constructor
   * @param connection Socket
   */
  constructor(connection: EventEmitter) {
    super();
    connection.on('data', (data) => {
      const message = JSON.parse(data);
      this.emit('response', message);
    });
  }
}
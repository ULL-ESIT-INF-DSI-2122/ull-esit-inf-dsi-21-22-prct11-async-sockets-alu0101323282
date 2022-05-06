import {EventEmitter} from 'events';

/**
 * Class that extends from EventEmitter
 */
export class ClientRequestEmitter extends EventEmitter {
  /**
   * Constructor
   * @param connection Socket
   */
  constructor(connection: EventEmitter) {
    super();
    connection.on('data', (data) => {
      const response = JSON.parse(data);
      this.emit('response', response);
    });
  }
}
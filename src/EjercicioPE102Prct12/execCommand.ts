import {spawn} from 'child_process';

/**
 * Class to execute a command
 */
export abstract class Execmd {
  /**
  * Executes a command
  * @param cmd Command to execute
  * @param cb Callback
  */
  public static execCommand = (cmd: string,
      cb: (err: string | undefined, res: string | undefined) => void) => {
    console.log(`Command to execute: ${cmd}`);
    const command = spawn(cmd, {shell: true});
    let succes: string = '';
    let error: string = '';
    command.stdout.on('data', (dataChunk) => {
      succes += dataChunk.toString();
    });
    command.stderr.on('data', (err) => {
      error += err;
    });
    command.on('error', (err) => {
      error += err;
    });
    command.on('close', () => {
      if (succes !== '') {
        cb(undefined, succes);
      } else {
        cb(error, undefined);
      }
    });
  };

  /**
   * Executes a command using a promise
   * @param cmd Command to execute
   * @returns Returns a promise
   */
  public static promiseExecCommand = (cmd: string) => {
    return new Promise<string>((resolve, reject) => {
      console.log(`Command to execute: ${cmd}`);
      const command = spawn(cmd, {shell: true});
      let succes: string = '';
      let error: string = '';
      command.stdout.on('data', (dataChunk) => {
        succes += dataChunk.toString();
      });
      command.stderr.on('data', (err) => {
        error += err;
      });
      command.on('error', (err) => {
        error += err;
      });
      command.on('close', () => {
        if (succes !== '') {
          resolve(succes);
        } else {
          reject(error);
        }
      });
    });
  };
}
import {existsSync, mkdir, readdir, readFile, rename, rm, writeFile} from 'fs';
import {Note} from './Note';
import * as chalk from 'chalk';


/**
 * Class to manage notes.
 */
export class NoteManager {
  /**
   * Adds a new note.
   * @param user User
   * @param title Title
   * @param body Body
   * @param color Color
   */
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

  /**
   * Edits a note.
   * @param user User
   * @param title Title
   * @param body Body
   * @param color Color
   * @param newTitle New Title
   */
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
                alreadyExists = true;
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

  /**
   * Removes a note.
   * @param user User
   * @param title Title
   */
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

  /**
   * Reads a note
   * @param user User
   * @param title Title
   */
  readNote = (user: string, title: string, cb: (
    err: string | undefined, data: string | undefined) => void) => {
    if (existsSync(`src/Notas/${user}/${title}.json`)) {
      readFile(`src/Notas/${user}/${title}.json`, (err, data) => {
        if (err) {
          cb('There must be a problem with the file you are trying to read', undefined);
          console.log(chalk.red('There must be a problem with the file you are trying to read'));
        } else {
          cb(undefined, data.toString());
        }
      });
    } else {
      cb('Note not found', undefined);
    }
  };

  /**
   * List notes
   * @param user User
   */
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
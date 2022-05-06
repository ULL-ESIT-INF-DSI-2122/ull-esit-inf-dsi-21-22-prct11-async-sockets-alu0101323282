import 'mocha';
import {expect} from 'chai';
import {NoteManager} from '../../src/Notas/NoteManager';

describe('Pruebas clase NoteManager', () => {
  let manager: NoteManager;
  before(function() {
    manager = new NoteManager();
  });
  it('addNote() Success', (done) => {
    manager.addNote('User', 'Test note', 'Note for testing', 'red', (_, data) => {
      expect(data).to.be.equal('Note created!');
      done();
    });
  });
  it('addNote() Error', (done) => {
    manager.addNote('User', 'Test note', 'Note for testing', 'red', (err, _) => {
      expect(err).to.be.equal('There is already a note with that name');
      done();
    });
  });
  it('removeNote() Succes', (done) => {
    manager.removeNote('User', 'Test note', (_, data) => {
      expect(data).to.be.equal('Note removed!');
      done();
    });
  });
  it('removeNote() Error', (done) => {
    manager.removeNote('User', 'Test note', (err, _) => {
      expect(err).to.be.equal('Note not found');
      done();
    });
  });
});
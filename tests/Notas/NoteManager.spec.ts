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
  it('editNote() Success', (done) => {
    manager.editNote('User', 'Test note', 'Testing edit', 'green', (_, data) => {
      expect(data).to.be.equal('Note edited!');
      done();
    });
  });
  it('editNote() Success with new title', (done) => {
    manager.editNote('User', 'Test note', 'Note for testing', 'red', (_, data) => {
      expect(data).to.be.equal('Note edited!');
      done();
    }, 'Testing note');
  });
  it('editNote() Error', (done) => {
    manager.editNote('User', 'Test note', 'Testing edit', 'green', (err, _) => {
      expect(err).to.be.equal('Note not found');
      done();
    });
  });
  it('editNote() Error', (done) => {
    manager.editNote('User', 'Testing note', 'Note for testing', 'red', (err, _) => {
      expect(err).to.be.equal('There is already a note with that name');
      done();
    }, 'Testing note');
  });
  it('readNote() Success', (done) => {
    manager.readNote('User', 'Testing note', (_, data) => {
      expect(data).to.be.eql('{"user":"User","title":"Testing note","body":"Note for testing","color":"red"}');
      done();
    });
  });
  it('readNote() Error', (done) => {
    manager.readNote('User', 'w', (err, _) => {
      expect(err).to.be.equal('Note not found');
      done();
    });
  });
  it('listNotes() Success', (done) => {
    manager.listNotes('User', (_, data) => {
      expect(data).to.be.eql(['{"user":"User","title":"Testing note","body":"Note for testing","color":"red"}']);
      done();
    });
  });
  it('listNotes() Error', (done) => {
    manager.listNotes('User2', (err, _) => {
      expect(err).to.be.equal('Error reading notes directory');
      done();
    });
  });
  it('removeNote() Succes', (done) => {
    manager.removeNote('User', 'Testing note', (_, data) => {
      expect(data).to.be.equal('Note removed!');
      done();
    });
  });
  it('removeNote() Error', (done) => {
    manager.removeNote('User', 'Testing note', (err, _) => {
      expect(err).to.be.equal('Note not found');
      done();
    });
  });
  it('listNotes() Error', (done) => {
    manager.listNotes('User', (err, _) => {
      expect(err).to.be.equal('The notes directory is empty');
      done();
    });
  });
});
import 'mocha';
import {expect} from 'chai';
import {Note} from '../../src/Notas/Note';

describe('Pruebas clase Note', () => {
  let note: Note;
  before(function() {
    note = new Note('User', 'TestNote', 'Note for testing', 'red');
  });
  it(`new Note('User', 'TestNote', 'Note for testing', 'red') is not equal null`, () => {
    expect(new Note('User', 'TestNote', 'Note for testing', 'red')).not.to.be.equal(null);
  });
  it(`note.getUser() returns 'User'`, () => {
    expect(note.getUser()).to.be.equal('User');
  });
  it(`note.getTitle() returns 'TestNote'`, () => {
    expect(note.getTitle()).to.be.equal('TestNote');
  });
  it(`note.getBody() returns 'Note for testing'`, () => {
    expect(note.getBody()).to.be.equal('Note for testing');
  });
  it(`note.getColor() returns 'red'`, () => {
    expect(note.getColor()).to.be.equal('red');
  });
  it(`Note.deserialize() returns 'red'`, () => {
    expect(Note.deserialize({'user': 'User', 'title': 'TestNote', 'body': 'Note for testing', 'color': 'red'})).to.be.eql(note);
  });
});
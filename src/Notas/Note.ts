/**
 * Class to represent a note.
 */
export class Note {
  /**
   * Constructor
   * @param user User name
   * @param title Title
   * @param body Body
   * @param color Color
   */
  constructor(private readonly user: string, private readonly title: string,
        private readonly body: string, private readonly color: string) {}

  /**
  * Getter for the propiety `user`
  * @returns Returns th value of `user`
  */
  getUser(): string {
    return this.user;
  }
  /**
  * Getter for the propiety `title`
  * @returns Returns th value of `title`
  */
  getTitle(): string {
    return this.title;
  }
  /**
  * Getter for the propiety `body`
  * @returns Returns th value of `body`
  */
  getBody(): string {
    return this.body;
  }
  /**
  * Getter for the propiety `color`
  * @returns Returns th value of `color`
  */
  getColor(): string {
    return this.color;
  }
  /**
   * Deserializes a note in json format.
   * @param note Note in json format.
   * @returns A new Note object.
   */
  public static deserialize(note: NoteInterface): Note {
    return new Note(note.user, note.title, note.body, note.color);
  }
}

/**
 * Note interface
 */
export interface NoteInterface {
    user: string,
    title: string,
    body: string,
    color: string
}
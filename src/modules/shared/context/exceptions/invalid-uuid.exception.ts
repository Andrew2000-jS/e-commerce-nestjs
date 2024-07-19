export class InvalidUuidException extends Error {
  constructor() {
    super(
      'The provided UUID is invalid. Please ensure it follows the standard UUID format.',
    );
    this.name = InvalidUuidException.name;
  }
}

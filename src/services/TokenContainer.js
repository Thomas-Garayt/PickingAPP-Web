// @Flow

var _token = null;
export default {
  set: (token: string): void => _token = token,
  get: (): string => _token
}

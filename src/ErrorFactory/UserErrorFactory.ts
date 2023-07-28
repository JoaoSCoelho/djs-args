import { ApplicationCommandUserOption, OptionsError, UserMatchBy } from '..'
import ErrorFactory from '.'

export type UserErrorMatchBy =
  | Exclude<UserMatchBy, 'USERNAME' | 'NICKNAME' | 'TAG'>
  | 'USERNAME-NICKNAME-TAG'

export default class UserErrorFactory extends ErrorFactory<'USER'> {
  constructor(
    readonly userInput: string,
    readonly errorOption: Required<
      Omit<ApplicationCommandUserOption, 'value'>
    > & {
      position: number
      value?: ApplicationCommandUserOption['value']
    }
  ) {
    super()
  }

  public userNotFoundByMention() {
    return this.userNotFound('MENTION', '017')
  }

  public userNotFoundById() {
    return this.userNotFound('ID', '018')
  }

  public userNotFoundByUsernameAndNicknameAndTag() {
    return this.userNotFound('USERNAME-NICKNAME-TAG', '019')
  }

  public userIsNotAGuildMember() {
    return new OptionsError(
      'User is not a guild member',
      '020',
      this.userInput,
      this.errorOption
    )
  }

  public userWasNotProvided() {
    return new OptionsError(
      'The user was not provided',
      '021',
      this.userInput,
      this.errorOption
    )
  }

  public userNotFoundBy(by: UserErrorMatchBy) {
    if (by === 'MENTION') return this.userNotFoundByMention()
    if (by === 'ID') return this.userNotFoundById()
    if (by === 'USERNAME-NICKNAME-TAG') {
      return this.userNotFoundByUsernameAndNicknameAndTag()
    }
  }

  private userNotFound(by: UserErrorMatchBy, code: `${number}`) {
    return new OptionsError(
      `User not found by ${by}`,
      code,
      this.userInput,
      this.errorOption
    )
  }
}

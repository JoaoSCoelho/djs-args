import { User } from 'discord.js'
import CheckIndividualOption from '../..'
import UserErrorFactory, {
  UserErrorMatchBy,
} from '../../../ErrorFactory/UserErrorFactory'
import byId from './byId'
import byMention from './byMention'

export default class Finders {
  constructor(
    protected readonly checkIndividualOption: CheckIndividualOption<'USER'> & {
      option: Required<Omit<CheckIndividualOption<'USER'>['option'], 'value'>> &
        Pick<CheckIndividualOption<'USER'>['option'], 'value'>
    },
    protected readonly errorFactory: UserErrorFactory
  ) {}

  protected commomVerification(matchMethod: UserErrorMatchBy, user?: User) {
    if (!user) {
      return this.errorFactory.userNotFoundBy(matchMethod)
    }

    if (
      this.checkIndividualOption.option.onlyThisGuild &&
      !this.checkIndividualOption.message.guild?.members.cache.get(user.id)
    ) {
      return this.errorFactory.userIsNotAGuildMember()
    }
  }

  byId = byId.bind(this)

  byMention = byMention.bind(this)

  byTag = byTag.bind(this)

  byNickname = byNickname.bind(this)

  byUsername = byUsername.bind(this)
}

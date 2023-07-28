import CheckIndividualOption, { CheckIndividualOptionFunc } from '..'
import { OptionsError } from '../..'
import ErrorFactory from '../../ErrorFactory'
import Finders from './Finders'

const checkUserOption: CheckIndividualOptionFunc<'USER'> = function (
  this: CheckIndividualOption<'USER'>
) {
  const {
    optionIndex,
    userInput,
    option: {
      matchBy = ['USERNAME', 'NICKNAME', 'TAG', 'ID', 'MENTION'],
      onlyThisGuild = false,
      fetch = false,
      caseSensitive = false,
      matchIncluding = false,
      required = false,
    },
    option,
  } = this

  const errorOption = {
    caseSensitive,
    matchBy,
    fetch,
    matchIncluding,
    onlyThisGuild,
    required,
    ...option,
    position: optionIndex,
  }

  const errorFactory = new ErrorFactory.User(userInput, errorOption)
  const finders = new Finders(
    { ...this, option: errorOption, check: this.check },
    errorFactory
  )

  return new Promise(
    (resolve, reject: (reason: OptionsError<'USER'>) => void) => {
      const isMention =
        matchBy.includes('MENTION') && /^<@!?\d{17,19}>$/g.test(userInput)
      const isId = matchBy.includes('ID') && /^\d{17,19}$/g.test(userInput)

      if (isMention) {
        const byMentionError = finders.byMention()

        if (byMentionError) return reject(byMentionError)
      } else if (isId) {
        finders.byId().then((byIdError) => {
          if (byIdError) return reject(byIdError)
        })
      } else if (matchBy.includes('USERNAME') && userInput) {
        const usersWithThisUsername = client.users.cache.filter((user) =>
          option.caseSensitive
            ? user.username === value
            : user.username.toLowerCase() === value.toLowerCase()
        )

        const usersWithThisTag =
          !option.matchBy || option.matchBy.includes('TAG')
            ? client.users.cache.filter((user) =>
                option.caseSensitive
                  ? user.tag === value
                  : user.tag.toLowerCase() === value.toLowerCase()
              )
            : undefined
        const usersWithThisNickname =
          !option.matchBy || option.matchBy.includes('NICKNAME')
            ? message.guild?.members.cache
                .filter((member) =>
                  option.caseSensitive
                    ? member.nickname === value
                    : member.nickname?.toLowerCase() === value.toLowerCase()
                )
                .mapValues((member) => member.user)
            : undefined
        const userIncludesThisUsername =
          !option.matchBy || option.matchBy.includes('USERNAME')
            ? option.matchIncluding
              ? client.users.cache.filter((user) =>
                  option.caseSensitive
                    ? user.username.includes(value)
                    : user.username.toLowerCase().includes(value.toLowerCase())
                )
              : undefined
            : undefined
        const userIncludesThisTag =
          !option.matchBy || option.matchBy.includes('TAG')
            ? option.matchIncluding
              ? client.users.cache.filter((user) =>
                  option.caseSensitive
                    ? user.tag.includes(value)
                    : user.tag.toLowerCase().includes(value.toLowerCase())
                )
              : undefined
            : undefined
        const userIncludesThisNickname =
          !option.matchBy || option.matchBy.includes('NICKNAME')
            ? option.matchIncluding
              ? message.guild?.members.cache
                  .filter((member) =>
                    option.caseSensitive
                      ? member.nickname?.includes(value) || false
                      : member.nickname
                          ?.toLowerCase()
                          .includes(value.toLowerCase()) || false
                  )
                  .mapValues((member) => member.user)
              : undefined
            : undefined

        if (
          !usersWithThisUsername?.size &&
          !usersWithThisTag?.size &&
          !usersWithThisNickname?.size &&
          !userIncludesThisUsername?.size &&
          !userIncludesThisTag?.size &&
          userIncludesThisNickname?.size === 1 &&
          (!option.onlyThisGuild ||
            (option.onlyThisGuild &&
              message.guild?.members.cache.get(
                userIncludesThisNickname.first()!.id
              )))
        ) {
          this.formattedArgs[index] = userIncludesThisNickname.first()!
        } else if (
          !usersWithThisUsername?.size &&
          !usersWithThisTag?.size &&
          !usersWithThisNickname?.size &&
          !userIncludesThisUsername?.size &&
          userIncludesThisTag?.size === 1 &&
          (!option.onlyThisGuild ||
            (option.onlyThisGuild &&
              message.guild?.members.cache.get(
                userIncludesThisTag.first()!.id
              )))
        ) {
          this.formattedArgs[index] = userIncludesThisTag.first()!
        } else if (
          !usersWithThisUsername?.size &&
          !usersWithThisTag?.size &&
          !usersWithThisNickname?.size &&
          userIncludesThisUsername?.size === 1 &&
          (!option.onlyThisGuild ||
            (option.onlyThisGuild &&
              message.guild?.members.cache.get(
                userIncludesThisUsername.first()!.id
              )))
        ) {
          this.formattedArgs[index] = userIncludesThisUsername.first()!
        } else if (
          !usersWithThisUsername?.size &&
          !usersWithThisTag?.size &&
          usersWithThisNickname?.size === 1 &&
          (!option.onlyThisGuild ||
            (option.onlyThisGuild &&
              message.guild?.members.cache.get(
                usersWithThisNickname.first()!.id
              )))
        ) {
          this.formattedArgs[index] = usersWithThisNickname.first()!
        } else if (
          !usersWithThisUsername?.size &&
          usersWithThisTag?.size === 1 &&
          (!option.onlyThisGuild ||
            (option.onlyThisGuild &&
              message.guild?.members.cache.get(usersWithThisTag.first()!.id)))
        ) {
          this.formattedArgs[index] = usersWithThisTag.first()!
        } else if (
          usersWithThisUsername?.size === 1 &&
          (!option.onlyThisGuild ||
            (option.onlyThisGuild &&
              message.guild?.members.cache.get(
                usersWithThisUsername.first()!.id
              )))
        ) {
          this.formattedArgs[index] = usersWithThisUsername.first()!
        } else if (
          option.matchBy &&
          !option.matchBy.includes('USERNAME') &&
          !option.matchBy.includes('TAG') &&
          !option.matchBy.includes('NICKNAME')
        ) {
          this.reply(
            `> <:x_:${x_}> O ${index + 1}º parâmetro (${
              option.name
            }) deve ser um canal!`
          )
          return false
        } else if (
          [
            usersWithThisUsername,
            usersWithThisTag,
            usersWithThisNickname,
            userIncludesThisUsername,
            userIncludesThisTag,
            userIncludesThisNickname,
          ].some((users) => users!.size > 1)
        ) {
          this.reply(
            `> <:x_:${x_}> Foi encontrado mais de um usuário que corresponde a **${value}**, tente mencioná-lo ou usar seu ID!`
          )
          return false
        } else {
          this.reply(
            `> <:x_:${x_}> Não foi encontrado nenhum usuário que corresponde a **${value}**, tente mencioná-lo ou usar seu ID!`
          )
          return false
        }
      } else if (!userInput && required) {
        return reject(errorFactory.userWasNotProvided())
      }

      return true
    }
  )
}

export default checkUserOption

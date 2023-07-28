import {
  ApplicationCommandChannelOption,
  ApplicationCommandOptionChoice,
  BaseApplicationCommandOptionsData,
  Channel,
  Client,
  Message,
  User,
  Role,
  GuildMember,
} from 'discord.js'
import CheckIndividualOption from './CheckIndividualOption'

export interface BaseApplicationCommandOptionsDataNew
  extends Omit<BaseApplicationCommandOptionsData, 'autocomplete'> {}

export interface ApplicationCommandTypeValue {
  BOOLEAN: boolean
  USER: User
  ROLE: Role
  CHANNEL: Channel
  STRING: string
  NUMBER: number
  INTEGER: number
  MENTIONABLE: User | Role | GuildMember
}

export interface ApplicationCommandBooleanOption
  extends BaseApplicationCommandOptionsDataNew {
  type: 'BOOLEAN'
  /** Alternatives that will be considered as true */
  truthyAliases?: string[]
  /** Alternatives that will be considered false */
  falsyAliases?: string[]
  caseSensitive?: boolean
  /** By setting a value, you define a default value for if the user leaves it blank. (Does not work if required: true) */
  value?: ApplicationCommandTypeValue['BOOLEAN']
}

export type UserMatchBy = 'MENTION' | 'USERNAME' | 'ID' | 'NICKNAME' | 'TAG'

export interface ApplicationCommandUserOption
  extends BaseApplicationCommandOptionsDataNew {
  type: 'USER'
  /** Defines whether, in case the user sends an ID, it will fetch the entire Discord or fetch only the bot users */
  fetch?: boolean
  /** Defines which methods the user should be searched for */
  matchBy?: UserMatchBy[]
  /** Defines whether to fetch a user that includes user input. (Only applied to username, nickname and tag) */
  matchIncluding?: boolean
  caseSensitive?: boolean
  /** Defines whether the user should be searched only in the current guild */
  onlyThisGuild?: boolean
  /** By setting a value, you define a default value for if the user leaves it blank. (Does not work if required: true) */
  value?: ApplicationCommandTypeValue['USER']
}

export type ChannelMatchBy = 'MENTION' | 'NAME' | 'ID'

export interface ApplicationCommandChannelOptionNew
  extends Omit<ApplicationCommandChannelOption, 'autocomplete'> {
  caseSensitive?: boolean
  /** Defines whether to search for a channel that includes user input. (Only applied to name of the channel) */
  matchIncluding?: boolean
  /** Defines which methods the channel should be searched for */
  matchBy?: ChannelMatchBy[]
  /** Defines whether the channel should be searched only in the current guild */
  onlyThisGuild?: boolean
  /** By setting a value, you define a default value for if the user leaves it blank. (Does not work if required: true) */
  value?: ApplicationCommandTypeValue['CHANNEL']
}

export interface ApplicationCommandOptionStringChoice
  extends ApplicationCommandOptionChoice {
  value: string
}

export interface ApplicationCommandResolverOption
  extends BaseApplicationCommandOptionsDataNew {
  type: 'NUMBER' | 'INTEGER' | 'STRING'
  resolver?(value: string | number): any
}

export interface ApplicationCommandOptionNumeralChoice
  extends ApplicationCommandOptionChoice {
  value: number
}

export interface ApplicationCommandNumeralOption
  extends ApplicationCommandResolverOption {
  type: 'NUMBER' | 'INTEGER'
  /** Function to resolve the value entered by the user */
  resolver?(value: number): any
  /** By setting a value, you define a default value for if the user leaves it blank. (Does not work if required: true) */
  value?:
    | ApplicationCommandTypeValue['NUMBER']
    | ApplicationCommandTypeValue['INTEGER']
}

export interface ApplicationCommandNumeralChoiceOption
  extends ApplicationCommandNumeralOption {
  /** Define choices the user can make */
  choices: ApplicationCommandOptionNumeralChoice[]
  caseSensitive?: boolean
}

export interface ApplicationCommandNumeralNonChoiceOption
  extends ApplicationCommandNumeralOption {
  choices?: undefined
  caseSensitive?: undefined
}

export interface ApplicationCommandStringOption
  extends ApplicationCommandResolverOption {
  type: 'STRING'
  /** Function to resolve the value entered by the user */
  resolver?(value: string): any
  /** By setting a value, you define a default value for if the user leaves it blank. (Does not work if required: true) */
  value?: ApplicationCommandTypeValue['STRING']
}

export interface ApplicationCommandStringChoiceOption
  extends ApplicationCommandStringOption {
  /** Define choices the user can make */
  choices: ApplicationCommandOptionStringChoice[]
  caseSensitive?: boolean
}

export interface ApplicationCommandStringNonChoiceOption
  extends ApplicationCommandStringOption {
  choices?: undefined
  caseSensitive?: undefined
}

export type MentionableCanBe = typeof User | typeof Role | typeof GuildMember

export interface ApplicationCommandMentionableOption
  extends BaseApplicationCommandOptionsDataNew {
  type: 'MENTIONABLE'
  /** Array with the classes/types that will be accepted: User, GuildMember or Role */
  canBe?: MentionableCanBe[]
  /** By setting a value, you define a default value for if the user leaves it blank. (Does not work if required: true) */
  value?: ApplicationCommandTypeValue['MENTIONABLE']
}

export type RoleMatchBy = 'MENTION' | 'NAME' | 'ID'
export interface ApplicationCommandRoleOption
  extends BaseApplicationCommandOptionsDataNew {
  type: 'ROLE'
  caseSensitive?: boolean
  /** Defines whether to search for a role that includes user input. (Only applied to name of the role) */
  matchIncluding?: boolean
  /** Defines which methods the role should be searched for */
  matchBy?: RoleMatchBy[]
  /** By setting a value, you define a default value for if the user leaves it blank. (Does not work if required: true) */
  value?: ApplicationCommandTypeValue['ROLE']
}

export type ApplicationCommandOptionNew =
  | ApplicationCommandBooleanOption
  | ApplicationCommandUserOption
  | ApplicationCommandChannelOptionNew
  | ApplicationCommandNumeralChoiceOption
  | ApplicationCommandNumeralNonChoiceOption
  | ApplicationCommandMentionableOption
  | ApplicationCommandRoleOption
  | ApplicationCommandStringChoiceOption
  | ApplicationCommandStringNonChoiceOption

export interface OptionsCommandProps {
  readonly options?: ApplicationCommandOptionNew[]
  /**
   * Arguments divider by default is "/ +/g" (no quotes), which means that all user message content after the prefix and command name will be separated by each one or more spaces.
   * Ex: message.content = '!avatar josh sacary';
   * The array of options values will look like this:
   * ['josh', 'sacary']
   * You can change this value or make it null if you don't want to separate (in which case your command may only require one option)
   */
  readonly optionsSplit?: string | RegExp | null
}

export interface CheckOptionsProps {
  message: Message
  client: Client<true>
  usedCommand: string
  prefix: string
}

export type OptionTypeBase = ApplicationCommandOptionNew['type']

export class OptionsError<OptionTypeBase> extends Error {
  constructor(
    message: string,
    public code: `${number}`,
    public usedArg: string,
    public option: ApplicationCommandOptionNew & {
      type: OptionTypeBase
      position: number
    }
  ) {
    super(message)
    this.name = 'OptionsError'
  }
}

export { User, Role, GuildMember } from 'discord.js'

export default class OptionsCommand {
  readonly options!: ApplicationCommandOptionNew[]
  readonly optionsSplit!: string | RegExp | null

  static defaultTruthyAliases = [
    'true',
    't',
    '1',
    'y',
    'yes',
    'sim',
    's',
    'verdadeiro',
  ]

  static defaultFalsyAliases = [
    'false',
    'f',
    '0',
    'n',
    'no',
    'nao',
    'não',
    'falso',
  ]

  formattedOptions: (
    | Channel
    | User
    | Role
    | GuildMember
    | boolean
    | string
    | number
    | undefined
  )[] = []

  constructor({ options, optionsSplit }: OptionsCommandProps) {
    this.options = options || []
    this.optionsSplit = optionsSplit === undefined ? / +/g : optionsSplit
  }

  checkOptions({ message, client, prefix, usedCommand }: CheckOptionsProps) {
    return new Promise((resolve, reject) => {
      if (!this.options) return resolve(undefined)

      Promise.all(
        this.options.map(async (option, optionIndex) => {
          const messageArgContent = message.content
            .slice(prefix.length)
            .trimStart()
            .slice(usedCommand.length)
            .trimStart()

          const args =
            this.optionsSplit === null
              ? [messageArgContent]
              : messageArgContent.split(this.optionsSplit)

          const userInput = args[optionIndex]

          const checkIndividualOption = new CheckIndividualOption(
            this,
            option,
            userInput,
            optionIndex,
            message,
            client
          )

          function onCatch(err: OptionsError<typeof option.type>) {
            reject(err)
            return null
          }

          return await checkIndividualOption.check().catch(onCatch)
          /* switch (option.type) {
            case 'BOOLEAN':
              return await checkIndividualOption.boolean().catch(onCatch)
            case 'CHANNEL':
              return await checkIndividualOption.channel().catch(onCatch)
            case 'INTEGER': {
              
            }
            case 'MENTIONABLE': {
              const member = message.mentions.members?.get(
                value.replace(/<@[&!]?/g, '').replace(/>/g, '')
              )
              const user = message.mentions.users?.get(
                value.replace(/<@[&!]?/g, '').replace(/>/g, '')
              )
              const role = message.mentions.roles?.get(
                value.replace(/<@[&!]?/g, '').replace(/>/g, '')
              )

              if (
                !/^<@[&!]?\d{17,19}>$/g.test(value) ||
                (!user && !role && !member)
              ) {
                if (option.required || value) {
                  this.reply(
                    `> <:x_:${x_}> O ${index + 1}º parâmetro (${
                      option.name
                    }) deve ser uma menção a um usuário/membro ou cargo!`
                  )

                  return false
                } else {
                  this.formattedArgs[index] = undefined
                  return true
                }
              }

              if (option.canBe) {
                if (
                  !option.canBe.some(
                    (instanceType) =>
                      member instanceof instanceType ||
                      user instanceof instanceType ||
                      role instanceof instanceType
                  )
                ) {
                  this.reply(
                    `> <:x_:${x_}> O ${index + 1}º parâmetro (${
                      option.name
                    }) deve ser uma menção a um ${option.canBe
                      .map((instanceType) => `\`${instanceType.name}\``)
                      .join(' ou ')}!`
                  )

                  return false
                }

                this.formattedArgs[index] = [member, user, role].find((value) =>
                  option.canBe?.some(
                    (instanceType) => value instanceof instanceType
                  )
                )
                return true
              }

              this.formattedArgs[index] = member || user || role
              return true
            }
            case 'NUMBER': {
              
            }
            case 'ROLE': {
              if (
                (!option.matchBy || option.matchBy.includes('MENTION')) &&
                /^<@&\d{17,19}>$/g.test(value)
              ) {
                const role = message.mentions.roles.get(
                  value.replace(/<@&/g, '').replace(/>/g, '')
                )

                if (!role) {
                  this.reply(`> <:x_:${x_}> Cargo não encontrado!`)
                  return false
                }

                this.formattedArgs[index] = role
              } else if (
                (!option.matchBy || option.matchBy.includes('ID')) &&
                /^\d{17,19}$/g.test(value)
              ) {
                const role = message.guild?.roles.cache.get(value)

                if (!role) {
                  this.reply(`> <:x_:${x_}> Cargo não encontrado!`)
                  return false
                }

                this.formattedArgs[index] = role
              } else {
                if (!value && option.required) {
                  this.reply(
                    `> <:x_:${x_}> O ${index + 1}º parâmetro (${
                      option.name
                    }) deve ser um cargo!`
                  )
                  return false
                }
                if (!value && !option.required) {
                  this.formattedArgs[index] = undefined
                  return true
                }

                const rolesWithThisName = message.guild?.roles.cache.filter(
                  (role) =>
                    option.caseSensitive
                      ? role.name === value
                      : role.name.toLowerCase() === value.toLowerCase()
                )
                const roleIncludesThisName = option.matchIncluding
                  ? message.guild?.roles.cache.filter((role) =>
                      option.caseSensitive
                        ? role.name.includes(value)
                        : role.name.toLowerCase().includes(value.toLowerCase())
                    )
                  : undefined

                if (
                  (!option.matchBy || option.matchBy.includes('NAME')) &&
                  !rolesWithThisName?.size &&
                  roleIncludesThisName?.size === 1
                ) {
                  this.formattedArgs[index] = roleIncludesThisName.first()!
                } else if (
                  (!option.matchBy || option.matchBy.includes('NAME')) &&
                  rolesWithThisName?.size === 1
                ) {
                  this.formattedArgs[index] = rolesWithThisName.first()!
                } else if (option.matchBy && !option.matchBy.includes('NAME')) {
                  this.reply(
                    `> <:x_:${x_}> O ${index + 1}º parâmetro (${
                      option.name
                    }) deve ser um cargo!`
                  )
                  return false
                } else if (
                  [rolesWithThisName, roleIncludesThisName].some(
                    (roles) => roles!.size > 1
                  )
                ) {
                  this.reply(
                    `> <:x_:${x_}> Foi encontrado mais de um cargo com o nome **${value}** neste servidor, tente marcá-lo ou usar seu ID!`
                  )
                  return false
                } else {
                  this.reply(
                    `> <:x_:${x_}> Não foi encontrado nenhum cargo com o nome **${value}** neste servidor, tente marcá-lo ou usar seu ID!`
                  )
                  return false
                }
              }

              return true
            }
            case 'STRING': {
              
            }
            case 'USER': {
              
            }
          } */
        })
      ).then(
        (results) =>
          results.every((result) => result === null) &&
          resolve(results.filter((result) => result !== null))
      )
    })
  }
}

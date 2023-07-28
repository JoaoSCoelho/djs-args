import CheckIndividualOption, { CheckIndividualOptionFunc } from '..'
import OptionsCommand, { OptionsError } from '../..'
import ErrorFactory from '../../ErrorFactory'

const checkBooleanOption: CheckIndividualOptionFunc<'BOOLEAN'> = function (
  this: CheckIndividualOption<'BOOLEAN'>
) {
  const {
    optionIndex,
    option: {
      truthyAliases = OptionsCommand.defaultTruthyAliases,
      falsyAliases = OptionsCommand.defaultFalsyAliases,
      required = false,
      caseSensitive = false,
    },
    option,
    userInput,
  } = this

  const errorOption = {
    caseSensitive: false,
    required: false,
    truthyAliases: truthyAliases,
    falsyAliases: falsyAliases,
    ...option,
    position: optionIndex,
  }

  const errorFactory = new ErrorFactory.Boolean(userInput, errorOption)

  return new Promise(
    (resolve, reject: (reason: OptionsError<'BOOLEAN'>) => void) => {
      const allAliases = [...truthyAliases, ...falsyAliases]

      if (
        !allAliases
          .map((alias) => (caseSensitive ? alias : alias.toLowerCase()))
          .includes(caseSensitive ? userInput : userInput.toLowerCase())
      ) {
        if (!required && !userInput) return resolve(undefined)
        else return reject(errorFactory.invalidValue())
      }

      if (truthyAliases.includes(userInput)) {
        this.optionsCommand.options[optionIndex].value = true
      } else if (falsyAliases.includes(userInput)) {
        this.optionsCommand.options[optionIndex].value = false
      }

      return resolve(this.optionsCommand.options[optionIndex].value as boolean)
    }
  )
}

export default checkBooleanOption

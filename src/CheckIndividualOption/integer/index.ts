import CheckIndividualOption, { CheckIndividualOptionFunc } from '..'
import { OptionsError } from '../..'
import ErrorFactory from '../../ErrorFactory'

const checkIntegerOption: CheckIndividualOptionFunc<'INTEGER'> = function (
  this: CheckIndividualOption<'INTEGER'>
) {
  const {
    optionIndex,
    userInput,
    option: {
      choices,
      required = false,
      caseSensitive = false,
      resolver = (value) => value,
    },
    option,
  } = this

  const errorOption = {
    caseSensitive,
    required,
    choices,
    resolver,
    ...option,
    position: optionIndex,
  }

  const errorFactory = new ErrorFactory.Integer(userInput, errorOption)

  return new Promise(
    (resolve, reject: (reason: OptionsError<'INTEGER'>) => void) => {
      if (choices) {
        const selectedChoice = choices.find(
          (choice) =>
            (caseSensitive
              ? choice.name === userInput
              : choice.name.toLowerCase() === userInput) ||
            choice.value.toString() === userInput
        )

        if (!selectedChoice) {
          return reject(errorFactory.argumentDoesNotMatchAnyOfTheChoices())
        } else {
          this.optionsCommand.options[optionIndex].value = resolver(
            selectedChoice.value
          )
        }
      }

      if (required) {
        if (!userInput) {
          return reject(errorFactory.integerWasNotProvided())
        }

        if (!/^-?\d{1,15}$/g.test(userInput)) {
          return reject(errorFactory.valueIsNotAInteger())
        }
      }

      const formattedValue = parseInt(userInput)

      this.optionsCommand.options[optionIndex].value = resolver(formattedValue)
      return resolve(this.optionsCommand.options[optionIndex].value as number)
    }
  )
}

export default checkIntegerOption

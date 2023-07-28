import CheckIndividualOption, { CheckIndividualOptionFunc } from '..'
import { OptionsError } from '../..'
import ErrorFactory from '../../ErrorFactory'

const checkNumberOption: CheckIndividualOptionFunc<'NUMBER'> = function (
  this: CheckIndividualOption<'NUMBER'>
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

  const errorFactory = new ErrorFactory.Number(userInput, errorOption)

  return new Promise(
    (resolve, reject: (reason: OptionsError<'NUMBER'>) => void) => {
      if (choices) {
        const selectedChoice = choices.find(
          (choice) =>
            (caseSensitive
              ? choice.name === userInput
              : choice.name.toLowerCase() === userInput) ||
            choice.value.toString() === userInput.replace(',', '.')
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
          return reject(errorFactory.numberWasNotProvided())
        }

        if (!/^-?\d{1,10}([.,]\d{1,5})?$/g.test(userInput)) {
          return reject(errorFactory.valueIsNotANumber())
        }
      }

      const formattedValue = Number(userInput.replace(',', '.'))

      this.optionsCommand.options[optionIndex].value = resolver(formattedValue)
      return resolve(this.optionsCommand.options[optionIndex].value as number)
    }
  )
}

export default checkNumberOption

import { ApplicationCommandOptionNew } from './src'

class OptCmd {
  readonly options: ApplicationCommandOptionNew[] = [
    {
      description: 'anything',
      name: 'anything',
      type: 'NUMBER',
    },
  ]

  method() {
    const other = new Classe(this)

    other.func()
  }
}

class Classe {
  constructor(private readonly privateProp: OptCmd) {}

  func() {
    return externalFunc.bind(this)()
  }
}

// This func in other file
const externalFunc = function () {
  //  I want to type it              ^^^^^ how the this of Other, not only Other

  console.log(this, this.privateProp) // Other { optCmd: OptCmd { options: [ [Object] ] } }
}

const optCmd = new OptCmd()

console.log(optCmd)

optCmd.method()

console.log(optCmd)

/* eslint-disable prettier/prettier */
class MyClass {
  constructor(protected readonly privateProp: string) {}

  foo() {
    return externalFunction.bind(this)()
  }
}

const externalFunction = function (this: MyClass) {
  console.log(this, this.privateProp) // MyClass { privateProp: 'qualquer coisa' } qualquer coisa
                    //   ^^^^^^^^^^^ Agora consigo acessar privateProp sem problemas aqui
}

const myClass = new MyClass('qualquer coisa')
myClass.foo() // OK
myClass.privateProp // Error: Property 'privateProp' is protected and only accessible within class 'MyClass' and its subclasses


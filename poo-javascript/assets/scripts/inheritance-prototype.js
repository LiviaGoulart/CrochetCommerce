// =====================================================
// 8.5 — Herança por Meio de Protótipo
// (Object.create, prototype chain, property shadowing)
// =====================================================
// Domínio: Product → DigitalProduct → OnlineCourse
//
// NOTA: Em projetos reais, prefira composição (mixins) a cadeias
// de herança muito profundas. Veja os exemplos de mixins no final.
// Object.hasOwn(obj, prop) (ES2022) é mais seguro que obj.hasOwnProperty().
// =====================================================

// ----- Cadeia de protótipos no domínio do projeto -----
// Modelo: Product → DigitalProduct → OnlineCourse

// Nível 1 — "Classe base": Product
const Product = {
    init(id, name, price) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.active = true;
        return this;
    },
    getInfo() {
        return `${this.name} — R$ ${this.price.toFixed(2)}`;
    },
    deactivate() {
        this.active = false;
        return this;
    }
};

// Nível 2 — "Herda" de Product: DigitalProduct
const DigitalProduct = Object.create(Product);
DigitalProduct.init = function (id, name, price, fileSizeMB) {
    Product.init.call(this, id, name, price);
    this.fileSizeMB = fileSizeMB;
    this.downloadable = true;
    return this;
};
DigitalProduct.getDownloadInfo = function () {
    return `${this.name} (${this.fileSizeMB} MB) — Download imediato`;
};

// Nível 3 — "Herda" de DigitalProduct: OnlineCourse
const OnlineCourse = Object.create(DigitalProduct);
OnlineCourse.init = function (id, name, price, fileSizeMB, instructor, durationHours) {
    DigitalProduct.init.call(this, id, name, price, fileSizeMB);
    this.instructor = instructor;
    this.durationHours = durationHours;
    this.studentsEnrolled = 0;
    return this;
};
OnlineCourse.enroll = function () {
    this.studentsEnrolled++;
    console.log(`Aluno matriculado! Total: ${this.studentsEnrolled}`);
};

// ----- USO -----
console.group("Uso da cadeia de herança");
const jsCourse = Object.create(OnlineCourse).init(
    101, "JavaScript Avançado", 199.90, 4500, "Prof. Rafael", 40
);

console.log(`getInfo(): ${jsCourse.getInfo()}`);            // herdado de Product
console.log(`getDownloadInfo(): ${jsCourse.getDownloadInfo()}`); // herdado de DigitalProduct
console.log(`instructor: ${jsCourse.instructor}`);           // próprio
jsCourse.enroll();                                           // próprio
console.groupEnd();

// ----- Verificando a cadeia (prototype chain) -----
console.group("Verificação da cadeia");
console.log(`jsCourse → OnlineCourse: ${Object.getPrototypeOf(jsCourse) === OnlineCourse}`);
console.log(`OnlineCourse → DigitalProduct: ${Object.getPrototypeOf(OnlineCourse) === DigitalProduct}`);
console.log(`DigitalProduct → Product: ${Object.getPrototypeOf(DigitalProduct) === Product}`);
console.log(`Product → Object.prototype: ${Object.getPrototypeOf(Product) === Object.prototype}`);
console.log(`Fim da cadeia: ${Object.getPrototypeOf(Object.prototype)}`); // null
console.groupEnd();

// ----- Property shadowing (sombreamento) -----
console.group("Property shadowing");
const item = Object.create(Product);
item.name = "Nome local"; // sombreia qualquer name que existisse no protótipo

// ES2022: Object.hasOwn() é mais seguro que hasOwnProperty()
console.log(`name é própria? (Object.hasOwn): ${Object.hasOwn(item, "name")}`);
console.log(`getInfo é própria? (Object.hasOwn): ${Object.hasOwn(item, "getInfo")}`);
console.groupEnd();

// =====================================================
// COMPOSIÇÃO / MIXINS — Alternativa moderna à herança
// =====================================================

console.group("Composição / Mixins (alternativa à herança profunda)");

const canLog = {
    log() {
        console.log(`[LOG] ${JSON.stringify(this)}`);
        return this;
    }
};

const canSerialize = {
    toJSON() {
        return { id: this.id, name: this.name, price: this.price };
    }
};

const canDiscount = {
    applyDiscount(percentage) {
        this.price = this.price * (1 - percentage / 100);
        return this;
    }
};

// Compondo um objeto com múltiplos comportamentos
const smartProduct = Object.assign(
    Object.create(Product),
    canLog,
    canSerialize,
    canDiscount
).init(200, "Fone Bluetooth", 349.90);

smartProduct.log().applyDiscount(10).log();
console.log(`JSON: ${JSON.stringify(smartProduct.toJSON())}`);
console.groupEnd();

// =====================================================
// 🏋️ EXERCÍCIOS — Semana 5
// =====================================================

// 1. Crie uma cadeia: Animal → Mammal → Dog → myPet.
//    Cada nível adiciona propriedades/métodos.
//    Use Object.getPrototypeOf() e isPrototypeOf() para navegar/validar.

// 2. Crie `employee` que herda de `person`. Adicione `introduce()`
//    no filho que COMPLEMENTA (não substitui) o do pai.
//    Use Object.getPrototypeOf(this).introduce().

// 3. Crie vários objetos herdando de `Vehicle`. Adicione `start()`
//    ao protótipo DEPOIS que os objetos foram criados.
//    Demonstre que todos passam a ter o método.

// 4. Implemente `isVehicleType(object)` que retorna `true` se o objeto
//    herda (direta ou indiretamente) de um protótipo `Vehicle`.
//    Use isPrototypeOf() ou Object.getPrototypeOf().

// 5. (Extra) Use mixins para compor um objeto `smartDevice` com
//    comportamentos `canConnect`, `canUpdate`, `canReset` sem usar herança.



//1-
const Animal = {
    init(name) {
        this.name = name;
        return this;
    },
    eat(){
        return `${this.name} está comendo.`;
    }
}


const Mammal = Object.create(Animal);
Mammal.init = function(name, species){
    Animal.init.call(this, name);
    this.species = species;
    return this;
};

Mammal.feedBaby = function(){
    return `${this.name} está alimentando filhotes.`;
};

const Dog = Object.create(Mammal);
Dog.init = function(name, breed){
    Mammal.init.call(this, name, "Canino");
    this.breed = breed;
    return this;
};

Dog.bark = function(){
    return `${this.name} está latindo: Au au!`;
};


const myPet = Object.create(Dog).init("Bob", "Golden Retrivier");


console.group("Resultados do Exercício 1");
console.log(myPet.eat());          // Método herdado de Animal
console.log(myPet.feedBaby());     // Método herdado de Mammal
console.log(myPet.bark());         // Método próprio de Dog

// Validações com protótipos
console.log(`myPet herda diretamente de Dog? ${Object.getPrototypeOf(myPet) === Dog}`);
console.log(`Dog está na cadeia de myPet? ${Dog.isPrototypeOf(myPet)}`);
console.log(`Animal está na cadeia de myPet? ${Animal.isPrototypeOf(myPet)}`);
console.groupEnd();



//2-
const Person = {
    init(name, age){
        this.name = name,
        this.age = age;
        return this
    },
    introduce() {
        return `Meu nome é ${this.name} e tenho ${this.age} anos.`;
    }
}

const employee = Object.create(Person);
employee.init = function(name, age, position){
    Person.init.call(this, name, age);
    this.position = position;
    return this;
}

employee.introduce = function() {
    const baseMessage = Object.getPrototypeOf(employee).introduce.call(this);

    return `${baseMessage} Trabalho como ${this.position}.`;
};

console.group("Exercício 2 - Complementando Métodos");

const dev = Object.create(employee).init("Ana", 24, "Desenvolvedora frontend");
console.log(dev.introduce());

console.groupEnd();

//3-
const Vehicle = {
    init(brand, model){
        this.brand = brand;
        this.model = model;
        return this;
    }
};

const car1 = Object.create(Vehicle).init("Toyota", "Corolla");
const car2 = Object.create(Vehicle).init("Honda", "Civic");

Vehicle.start = function() {
    return `O veículo ${this.brand} ${this.model} deu a partida!`;
}
console.group("Exercício 3 - Atualização Dinâmica do Protótipo");

console.log(car1.start());
console.log(car2.start());

console.groupEnd();

//4-
const Vehiicle = {
    init(type){
        this.type = type;
        return this;
    }
};

const Car = Object.create(Vehiicle);

const EletricCar = Object.create(Car);

const Food = { name: "Maçã"};

function isVehycleObject(object) {
    if (!object || typeof object !== "object") return false;
    return Vehiicle.isPrototypeOf(object);
}

console.group("Exercício 4 - Validação de Protótipo");

const myTesla = Object.create(EletricCar).init("Elétrico");
const myApple = Object.create(Food);

console.log(`myTesla herda de Vehiicle? ${isVehycleObject(myTesla)}`);
console.log(`myApple herda de Vehiicle? ${isVehycleObject(myApple)}`);

console.groupEnd();

//5-
//criação dos mixins

const canConnect = {
    connect(networkName) {
        this.isConnected = true;
        this.network = networkName;
        console.log(`${this.name} conectado à rede ${networkName}.`);
        return this;
    }
};

const canUpdate = {
    updateSoftware(version) {
        this.firmwareVersion = version;
        console.log(`${this.name} atualizado com sucesso para a versão ${version}.`);
        return this;
    }
};

const canReset = {
    reset() {
        this.isConnected = false;
        this.network = null;
        console.log(`${this.name} foi restaurado para as configurações da fábrica.`);
        return this;
    }
};



const SmartDevice = {
    init(id, name, firmwareVersion = "1.0.0") {
        this.id = id;
        this.name = name;
        this.firmwareVersion = firmwareVersion;
        this.isConnected = false;
        this.network = null;
        return this;
    }
};


const smartDeviceFactory = (id, name, firmware) => {
    // Cria um novo objeto que herda de SmartDevice e insere os mixins
    const baseDevice = Object.create(SmartDevice);
    
    // Copia as funções dos mixins diretamente para o objeto
    const composedDevice = Object.assign(
        baseDevice,
        canConnect,
        canUpdate,
        canReset
    );

    return composedDevice.init(id, name, firmware);
};


console.group("Exercício 5 - Composição com Mixins");

// Criando um dispositivo inteligente composto
const smartTv = smartDeviceFactory(1, "Smart TV 55'", "v2.1.0");

// Demonstrando os comportamentos combinados
smartTv.connect("Wi-Fi_Casa")
       .updateSoftware("v2.2.0")
       .reset();

console.log("\nEstado final do objeto:", smartTv);

console.groupEnd();
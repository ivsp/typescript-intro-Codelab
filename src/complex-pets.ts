/* Vamos a hacer que la clase Animal ofrezca un método para conocer las necesidades 
alimenticias de nuestra mascota. Cada animal puede tener más o menos requrimientos alimenticios, 
por lo que vamos a hacer que el método getFoodNeeds() pueda retornar un objeto parcial de FoodNeeds */
type FoodNeeds = {
  amount?: number;
  brand?: string;
  frequency?: number;
};

type Vaccines = {
  rabies: boolean;
  leptospirosis: boolean;
};

/* Agreguemos un método hasVaccines() que indique qué vacunas tiene nuestra mascota. 
Como cada animal tiene diferentes requerimientos de vacunas, vamos a hacer que el método 
hasVaccines() en la interfaz base retorne un Partial<Vaccines> */
interface Animal {
  eat(): void;
  getFoodNeeds(): FoodNeeds;
  hasVaccines(): Partial<Vaccines>;
}
/* Los gatos tienen necesidades muy específicas en cuanto 
al alimento que pueden consumir, por lo que su método 
getFoodNeeds() retorna un objeto completo de FoodNeeds */
interface Cat extends Animal {
  meow(): string;
  getFoodNeeds(): Required<FoodNeeds>;
  hasVaccines(): Omit<Vaccines, "leptospirosis">;
}
/* Por el otro lado, los perros son más flexibles en cuanto a su alimentación, 
por lo que su método getFoodNeeds() retorna un objeto parcial de FoodNeeds en el que 
sólo se especifica la cantidad de alimento que deben comer por día */

interface Dog extends Animal {
  bark(): string;
  getFoodNeeds(): Pick<FoodNeeds, "amount">;
  hasVaccines(): Omit<Vaccines, "leptospirosis">;
}

// Nuestras clases Cat y Dog siguen teniendo el método eat(), ya que como extienden de Animal, lo heredan

class PersianCat implements Cat {
  eat(): void {
    console.log("Eating");
  }
  meow(): string {
    return "Meow";
  }
  getFoodNeeds(): Required<FoodNeeds> {
    return {
      amount: 100,
      brand: "not-Whiskas",
      frequency: 3,
    };
  }
  hasVaccines(): Omit<Vaccines, "leptospirosis"> {
    return {
      rabies: false,
    };
  }
}

class BeagleDog implements Dog {
  eat(): void {
    console.log("Eating");
  }
  bark(): string {
    return "Woof";
  }
  getFoodNeeds(): Pick<FoodNeeds, "amount"> {
    return {
      amount: 100,
    };
  }
  hasVaccines(): Omit<Vaccines, "leptospirosis"> {
    return {
      rabies: true,
    };
  }
}
type Pet = Cat | Dog;

/* Declaramos la interfaz Petshop cuyo método sellPet() puede retornar tanto un Cat como un Dog. 
  Hacemos un union type con el operador | que une los tipos Cat y Dog */
interface PetShop {
  sellPet(): Pet;
}

/* Nuestra clase PawPetShop implementa la interfaz PetShop y su método sellPet() retorna un Cat o un Dog de manera aleatoria */
class PawPetShop implements PetShop {
  sellPet(): Pet {
    return Math.random() > 0.5 ? new PersianCat() : new BeagleDog();
  }
}
function makePetNoise(pet: Pet) {
  if (pet instanceof PersianCat) {
    return pet.meow();
  }

  if (pet instanceof BeagleDog) {
    return pet.bark();
  }
}

// Generemos tipados para controlar el almacenamiento de comida de animales de nuestro PetShop.

// Esta es la información que todo alimento debe tener
interface FoodInfo {
  amount: number;
  brand: string;
}

// Estos son los tipos de comida que actualmente tiene nuestro PetShop.
type FoodType = "dogFood" | "catFood";

/* El objeto que representa el almacenamiento de comida tendrá una key
 por cada tipo de comida y el valor de cada una será un array de FoodInfo */
type FoodStorage = Record<FoodType, FoodInfo[]>;

const animalFoodStorage: FoodStorage = {
  catFood: [
    { amount: 10, brand: "Whiskas" },
    { amount: 5, brand: "Purina" },
  ],
  dogFood: [{ amount: 5, brand: "Pedigree" }],
};

// Definimos el tipo Owner que representa al dueño de un animal.
type Owner = {
  name: string;
  surname: string;
};

// Si establecemos que los datos del dueño no pueden modificarse, debemos usar el operador Readonly
const michifusOwner: Readonly<Owner> = {
  name: "John",
  surname: "Doe",
};

// Si intentamos modificar el nombre del dueño, TypeScript nos mostrará un error
//   michifusOwner.name = "Jane"; // Error: Cannot assign to 'name' because it is a read-only property

const myNewPet = new PawPetShop().sellPet();

myNewPet.eat(); // Eating
makePetNoise(myNewPet);

type UserExample<T> = {
  username: string;
  country: string;
  isPremium: boolean;
  metadata: T;
};

type UserAdminMetadata = {
  role: "admin" | "superadmin";
  permissions: string[];
};

type UserAdmin = UserExample<UserAdminMetadata>;

type PremiumUserMetadata = {
  subscriptionDate: Date;
  paymentMethod: string;
};

type PremiumUser = UserExample<PremiumUserMetadata>;

/* Nuestra función se declara con un genérico T. El parámetro list será 
un array de T y el valor retornado será de tipo T */
function findMax<T extends number | string>(
  listOfElements: T[]
): T | undefined {
  if (listOfElements.length === 0) return undefined;
  return listOfElements.reduce((maxElement, currentElement) =>
    currentElement > maxElement ? currentElement : maxElement
  );
}

const numbers = [10, 5, 20, 15];
const maxNumber = findMax<number>(numbers); // Output: 20

const fruits = ["apple", "banana", "cherry"]; // Output: "cherry"
const maxFruit = findMax<string>(fruits);

class TreasureChest<Element> {
  #items: Element[] = [];

  addItem(item: Element) {
    this.#items.push(item);
  }

  getItems(): Element[] {
    return this.#items;
  }
}

type Jewel = {
  value: number;
  material: string;
};

/* Creamos un cofre para guardar joyas. Sabemos que el método addItem de myJewelsChest necesita 
  un objeto de tipo Jewel como argumento y que el método getItems retornará un array de Jewel */
const myJewelsChest = new TreasureChest<Jewel>();

type Coin = {
  value: number;
  currency: string;
};

/* Creamos un cofre para guardar monedas. Sabemos que el método addItem de myCoinsChest necesita 
  un objeto de tipo Coin como argumento y que el método getItems retornará un array de Coin */

const myCoinsChest = new TreasureChest<Coin>();

type BaseShape = {
  x: number;
  y: number;
};

interface Board {
  draw<Shape extends BaseShape>(shape: Shape): Shape;
  erase(): void;
  write(text: string): string;
}

class WhiteBoard implements Board {
  draw<Shape>(shape: Shape): Shape {
    // Drawing operations
    return shape;
  }
  erase(): void {
    console.log("Erasing");
  }
  write(text: string): string {
    // Writing operations
    return text;
  }
}

const classroomBoard = new WhiteBoard();

/*
Quizás te haya llamado la atención el uso del operador ‘&' en la definición del type Triangle.
 Se usa para formar tipos de intersección, es decir la combinación de dos o más tipos en uno. 
 El tipo resultante de combinar tres tipos con ‘&' tendrá las propiedades de los tres tipos. 
 En nuestro caso, en el type Triangle estará compuesto por las propiedades de BaseShape y 
 la propiedad triangleType.*/
type Triangle = BaseShape & { triangleType: string };

const triangleCreated = classroomBoard.draw<Triangle>({
  x: 10,
  y: 10,
  triangleType: "equilateral",
}); // triangleCreated es de tipo Triangle

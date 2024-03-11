interface Entity {
  id: string;
  name: string;
}

interface DetailedUserEntity extends Entity {
  // Detalles específicos de la entidad usuario
  surname: string;
  email?: string;
  identityNumber: string;
  age: number;
  phone: string;
}

interface DetailedProductEntity extends Entity {
  // Detalles específicos de la entidad producto
  description: string;
  price: number;
  stock: number;
}

interface EntityRepository<DetailedEntity extends Entity> {
  getAll(): Promise<DetailedEntity[]>;
  getById(id: string): Promise<DetailedEntity>;
  create(entity: Omit<DetailedEntity, "id">): Promise<DetailedEntity>;
  update(entity: Partial<DetailedEntity>): Promise<DetailedEntity>;
  replace(entity: Omit<DetailedEntity, "id">): Promise<DetailedEntity>;
  delete(id: Pick<DetailedEntity, "id">): Promise<DetailedEntity>;
}

class UserRepository implements EntityRepository<DetailedUserEntity> {
  private apiUrl: string;

  constructor(apiUrl: string) {
    this.apiUrl = apiUrl;
  }
  async getAll(): Promise<DetailedUserEntity[]> {
    return await fetch(`${this.apiUrl}/users/getall`).then((response) =>
      response.json()
    );
  }
  async getById(id: string): Promise<DetailedUserEntity> {
    return await fetch(`${this.apiUrl}/users/get/${id}`).then((response) =>
      response.json()
    );
  }
  async create(user: Omit<DetailedUserEntity, "id">) {
    const res = await fetch(`${this.apiUrl}/users/create`, {
      method: "POST",
      body: JSON.stringify(user),
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) throw new Error("Error creating user");
    return (await res.json()) as DetailedUserEntity;
  }
  async update(user: Partial<DetailedUserEntity>): Promise<DetailedUserEntity> {
    return await fetch(`${this.apiUrl}/users/update/${user.id}`, {
      method: "PATCH",
      body: JSON.stringify(user),
      headers: { "Content-Type": "application/json" },
    }).then((response) => response.json());
  }
  async replace(
    user: Omit<DetailedUserEntity, "id">
  ): Promise<DetailedUserEntity> {
    return await fetch(`${this.apiUrl}/users/replace/${user.identityNumber}`, {
      method: "PUT",
      body: JSON.stringify(user),
      headers: { "Content-Type": "application/json" },
    }).then((response) => response.json());
  }
  async delete(
    user: Pick<DetailedUserEntity, "id">
  ): Promise<DetailedUserEntity> {
    return await fetch(`${this.apiUrl}/users/delete/${user.id}`, {
      method: "DELETED",
      headers: { "Content-Type": "application/json" },
    }).then((response) => response.json());
  }
}

class ProductRepository implements EntityRepository<DetailedProductEntity> {
  private apiUrl: string;

  constructor(apiUrl: string) {
    this.apiUrl = apiUrl;
  }
  async getAll(): Promise<DetailedProductEntity[]> {
    return await fetch(`${this.apiUrl}/products/getall`).then((response) =>
      response.json()
    );
  }
  async getById(id: string): Promise<DetailedProductEntity> {
    return await fetch(`${this.apiUrl}/products/get/${id}`).then((response) =>
      response.json()
    );
  }
  async create(product: Omit<DetailedProductEntity, "id">) {
    const res = await fetch(`${this.apiUrl}/products/create`, {
      method: "POST",
      body: JSON.stringify(product),
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) throw new Error("Error creating product");
    return (await res.json()) as DetailedProductEntity;
  }
  async update(
    product: Partial<DetailedProductEntity>
  ): Promise<DetailedProductEntity> {
    return await fetch(`${this.apiUrl}/products/update/${product.id}`, {
      method: "PATCH",
      body: JSON.stringify(product),
      headers: { "Content-Type": "application/json" },
    }).then((response) => response.json());
  }
  async replace(
    product: Omit<DetailedProductEntity, "id">
  ): Promise<DetailedProductEntity> {
    return await fetch(`${this.apiUrl}/products/replace/${product.name}`, {
      method: "PUT",
      body: JSON.stringify(product),
      headers: { "Content-Type": "application/json" },
    }).then((response) => response.json());
  }
  async delete(
    product: Pick<DetailedProductEntity, "id">
  ): Promise<DetailedProductEntity> {
    return await fetch(`${this.apiUrl}/products/delete/${product.id}`, {
      method: "DELETED",
      headers: { "Content-Type": "application/json" },
    }).then((response) => response.json());
  }
}

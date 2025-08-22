
export class Message {
    constructor(
      public readonly id: string,
      public readonly content: string,
      public readonly sender: string,
      public readonly status: 'created',
      public readonly createdAt: string,
      public readonly updatedAt: string,
    ) {}
}
  

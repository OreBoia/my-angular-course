import { Injectable } from '@angular/core';

export interface User {
  id: string;
  name: string;
  email: string;
  bio: string;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private users: User[] = [
    { id: '1', name: 'Alice Rossi',   email: 'alice@example.com',  bio: 'Frontend developer' },
    { id: '2', name: 'Marco Bianchi', email: 'marco@example.com',  bio: 'UX designer' },
    { id: '3', name: 'Sara Verdi',    email: 'sara@example.com',   bio: 'Full-stack engineer' },
  ];

  //Asincrono
  async getUser(id: string): Promise<User | undefined> {
    // Simula una chiamata HTTP
    return this.users.find(u => u.id === id);
  }

  //Sincrono
  /*getUser(id: string): User | undefined {
    return this.users.find(u => u.id === id);
  }*/
}

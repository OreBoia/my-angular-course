import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  private logged = false;

  
  login() 
  {
    this.logged = true;
  }

  logout()
  {
    this.logged = false;
  }

  isAuthenticated(): boolean
  {
    return this.logged;
  }
}

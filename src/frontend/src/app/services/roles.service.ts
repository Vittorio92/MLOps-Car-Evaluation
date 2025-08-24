import { Injectable } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class RolesService {
  private ns = 'https://api.example.com';
  roles = this.auth.idTokenClaims$.pipe(
    map(claims => claims?.[`${this.ns}/roles`] as string[] || [])
  );

  isAdmin = this.roles.pipe(
    map(roles => roles.includes('Admin'))
  );

  constructor(private auth: AuthService) {}
}

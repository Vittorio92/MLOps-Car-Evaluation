import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthGuard{

    private NS = 'https://api.example.com';
    
    constructor(private auth: AuthService, private router: Router) {}
    
    canActivate(): Observable<boolean> {
        return this.auth.idTokenClaims$.pipe(
            map(claims => {
                const roles = (claims?.[`${this.NS}/roles`] as string[]) ?? [];
                if (roles.includes('Admin')){
                    return true
                } else {
                    this.router.navigate(['/error'])
                    return false
                }
            })
        );
    }

}

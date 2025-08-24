import { Component, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { RolesService } from './services/roles.service';
import { PredictionService } from './services/prediction.service';
import { environment } from 'src/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit{
  loggedInUser: any;
  email: string = '';
  name: string = '';

  constructor(public auth: AuthService, public role: RolesService, private pred: PredictionService){}

  ngOnInit(): void{
    if(this.auth.user$){
      this.auth.user$.subscribe((data) => {
        this.loggedInUser = data
        this.email = this.loggedInUser.email;
        this.name = this.loggedInUser.name;
        this.pred.addUser(this.email, this.name).subscribe();
      });
    }
  } 

  login(){
    this.auth.loginWithRedirect();
  }

  logout(){
    this.auth.logout({ logoutParams: { returnTo: environment.auth.redirectUri } });
    this.loggedInUser = null;
    this.email = '';
    this.name = '';
  }
}

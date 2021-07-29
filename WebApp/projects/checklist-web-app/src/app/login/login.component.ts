import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SocialAuthService, GoogleLoginProvider, SocialUser } from 'angularx-social-login';
import { ScriptService } from './script-load.service';


@Component({
  selector: 'app-login-component',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm : FormGroup;
  socialUser : SocialUser;
  isLoggedIn : boolean

  constructor(private formBuilder : FormBuilder,
              private socialAuthService : SocialAuthService) { 
                // this.scriptService.load('google-sign-in')
              }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email:['',Validators.required],
      password:['',Validators.required]
    });

    this.socialAuthService.authState.subscribe((user)=>{
      this.socialUser = user;
      this.isLoggedIn = (user != null);
      console.log(this.socialUser)
    });
  }

  loginWithGoogle(): void {
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }


  // logOut(){
  //   this.socialAuthService.signOut();
  // }
}

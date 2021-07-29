import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SocialAuthService, GoogleLoginProvider, SocialUser } from 'angularx-social-login';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons'
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  googleIcon = faGoogle
  title = 'ChecklistWebApp';
  
  loginForm : FormGroup;
  socialUser : SocialUser;
  isLoggedIn : boolean

  constructor(private formBuilder : FormBuilder,
              private socialAuthService : SocialAuthService) { }

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

  logOut(){
    this.socialAuthService.signOut();
  }
}

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { GoogleLoginProvider, SocialAuthService } from 'angularx-social-login';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [{
    provide:'SocialAuthServiceConfig',
    useValue:{
      autoLogin:true,
      providers:[
        {
          id:GoogleLoginProvider.PROVIDER_ID,
          provider : new GoogleLoginProvider('331665416413-6afhkod22d9d68uno88ebpvopsvohfb9.apps.googleusercontent.com')
        }
      ]
    }
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }

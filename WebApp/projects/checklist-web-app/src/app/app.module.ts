import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { GoogleLoginProvider, SocialAuthService, SocialAuthServiceConfig, SocialLoginModule } from 'angularx-social-login';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DashboardComponent } from './dashboard/dashboard.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    SocialLoginModule,
    FontAwesomeModule
  ],
  providers: [{
    provide:'SocialAuthServiceConfig',
    useValue:{
      autoLogin:true,
      providers:[
        {
          id:GoogleLoginProvider.PROVIDER_ID,
          provider : new GoogleLoginProvider(
            '331665416413-6afhkod22d9d68uno88ebpvopsvohfb9.apps.googleusercontent.com',
            {}
          )
        }
      ]
    } as SocialAuthServiceConfig
  }
],
  bootstrap: [AppComponent]
})
export class AppModule { }

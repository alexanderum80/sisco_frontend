import { Apollo } from 'apollo-angular';
import { PrimeMenubarModule } from './shared/ui/prime-ng/menubar/menubar.module';
import { PrimeButtonModule } from './shared/ui/prime-ng/button/button.module';
import { NavigationModule } from './navigation/navigation.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './usuarios/login/login.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { StartComponent } from './shared/ui/start/start.component';
import { GraphQLModule } from './graphql.module';
import { ErrorInterceptor } from './shared/helpers/error.interceptor';
import { JwtInterceptor } from './shared/helpers/jwt.interceptor';
import { PrimeCardModule } from './shared/ui/prime-ng/card/card.module';
import { PrimeInputTextModule } from './shared/ui/prime-ng/input-text/input-text.module';
import { PrimePasswordModule } from './shared/ui/prime-ng/password/password.module';
import { DialogService } from 'primeng/dynamicdialog';

@NgModule({
  declarations: [AppComponent, StartComponent, LoginComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,

    // Prime NG
    // PrimeNgModule,
    PrimeCardModule,
    PrimeInputTextModule,
    PrimePasswordModule,
    PrimeButtonModule,
    PrimeMenubarModule,

    // Apollo
    HttpClientModule, // provides HttpClient for HttpLink

    // App modules
    NavigationModule,
    GraphQLModule,
    NavigationModule,
  ],
  providers: [
    DialogService,
    Apollo,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor() {
    // tslint:disable-next-line: no-string-literal
    // window['_rollupMoment__default'] = null;
  }
}

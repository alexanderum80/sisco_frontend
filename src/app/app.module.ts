import { AngularMaterialComponentsModule } from './angular-material/angular-material.module';
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
import { PrimeNgModule } from './shared/ui/prime-ng/prime-ng.module';
import { JwtInterceptor } from './shared/helpers/jwt.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    StartComponent,
    LoginComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,

    // Angular Material
    AngularMaterialComponentsModule,

    // Prime NG
    PrimeNgModule,

    // Apollo
    HttpClientModule, // provides HttpClient for HttpLink

    // App modules
    NavigationModule,
    GraphQLModule,
  ],
  providers: [
    // AgGridService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

  constructor() {

    // tslint:disable-next-line: no-string-literal
    // window['_rollupMoment__default'] = null;
  }
}

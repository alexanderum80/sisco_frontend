import { HTTPResponseInterceptor } from './shared/interceptors/response.interceptor';
import { ToastrModule } from 'ngx-toastr';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';
import { PrimeCheckboxModule } from './shared/ui/prime-ng/checkbox/checkbox.module';
import { Apollo } from 'apollo-angular';
import { PrimeMenubarModule } from './shared/ui/prime-ng/menubar/menubar.module';
import { PrimeButtonModule } from './shared/ui/prime-ng/button/button.module';
import { NavigationModule } from './navigation/navigation.module';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './usuarios/login/login.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { StartComponent } from './shared/ui/start/start.component';
import { GraphQLModule } from './graphql.module';
import { HttpErrorInterceptorService } from './shared/interceptors/http-error.interceptor';
import { JwtInterceptor } from './shared/interceptors/jwt.interceptor';
import { PrimeCardModule } from './shared/ui/prime-ng/card/card.module';
import { PrimeInputTextModule } from './shared/ui/prime-ng/input-text/input-text.module';
import { PrimePasswordModule } from './shared/ui/prime-ng/password/password.module';
import { DialogService } from 'primeng/dynamicdialog';
import { GlobalErrorHandler } from './shared/interceptors/global-error.handler';

@NgModule({
  declarations: [
    AppComponent,
    StartComponent,
    LoginComponent,
    UnauthorizedComponent,
  ],
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
    PrimeCheckboxModule,

    // Apollo
    HttpClientModule, // provides HttpClient for HttpLink

    // ToastrModule added
    ToastrModule.forRoot({
      closeButton: true,
    }),

    // App modules
    NavigationModule,
    GraphQLModule,
    NavigationModule,
  ],
  providers: [
    DialogService,
    Apollo,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptorService,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HTTPResponseInterceptor,
      multi: true,
    },
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandler,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor() {
    // tslint:disable-next-line: no-string-literal
    // window['_rollupMoment__default'] = null;
  }
}

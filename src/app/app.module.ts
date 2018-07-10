import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppConfig } from './_shared/models/app-config.model';
import { environment } from '../environments/environment';
import { AppConfigLoader } from './_shared/services/app-config-loader.service';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from './_shared/services/auth.service';
import { CallbackComponent } from './callback/callback.component';
import { HomeComponent } from './home/home.component';
import { ContractComponent } from './contract/contract.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SsnNumberService } from './_shared/services/ssn-number.service';
import { ContractService } from './_shared/services/contract.service';

@NgModule({
    declarations: [
        AppComponent,
        CallbackComponent,
        HomeComponent,
        ContractComponent,
        NavBarComponent
    ],
    imports: [
        NgbModule.forRoot(),
        BrowserModule,
        ReactiveFormsModule,
        AppRoutingModule,
        HttpClientModule
    ],
    providers: [
        AuthService,
        SsnNumberService,
        ContractService,
        AppConfigLoader,
        AppConfig,
        {
            provide: APP_INITIALIZER,
            useFactory: (configService) => () => configService.load(environment.configFile),
            deps: [AppConfigLoader],
            multi: true
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }

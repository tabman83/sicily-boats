import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';

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

@NgModule({
    declarations: [
        AppComponent,
        CallbackComponent,
        HomeComponent,
        ContractComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule
    ],
    providers: [
        AuthService,
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

import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppConfig } from './_shared/models/app-config.model';
import { environment } from '../environments/environment';
import { AppConfigLoader } from './_shared/services/app-config-loader.service';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule
    ],
    providers: [
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

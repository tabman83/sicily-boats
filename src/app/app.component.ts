import { AppConfig } from './_shared/models/app-config.model';
import { AuthService } from './_shared/services/auth.service';
import { Component } from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    title = 'Sicily Boats';

    constructor(
        public auth: AuthService
    ) {
        auth.handleAuthentication();
    }
}

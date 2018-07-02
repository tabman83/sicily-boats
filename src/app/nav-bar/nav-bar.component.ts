import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_shared/services/auth.service';

@Component({
    selector: 'app-nav-bar',
    templateUrl: './nav-bar.component.html',
    styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {

    public profile: any;

    constructor(public auth: AuthService) { }

    ngOnInit() {
        if (this.auth.userProfile) {
            this.profile = this.auth.userProfile;
        } else if (this.auth.isAuthenticated()) {
            this.auth.getProfile((err, profile) => {
                this.profile = profile;
            });
        }
    }

}

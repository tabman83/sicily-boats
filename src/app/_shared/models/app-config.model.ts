import { Injectable } from '@angular/core';
import { Boat } from './boat.model';

@Injectable()
export class AppConfig {
    domain: string = undefined;
    clientId: string = undefined;
    rentalName: string = undefined;
    rentalDescription: string = undefined;
    boats: Boat[] = undefined;
}

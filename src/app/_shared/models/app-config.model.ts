import { Injectable } from '@angular/core';
import { Boat } from './boat.model';

@Injectable()
export class AppConfig {
    domain: string = undefined;
    clientId: string = undefined;
    rentalDescription: string = undefined;
    conditions: string = undefined;
    boats: Boat[] = undefined;
}

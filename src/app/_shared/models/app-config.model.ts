import { Injectable } from '@angular/core';
import { Boat } from './boat.model';

@Injectable()
export class AppConfig {
    domain: string = undefined;
    clientId: string = undefined;
    rentalName: string = undefined;
    idTypes: string[] = undefined;
    rentalDescription: string = undefined;
    rentalEmail: string = undefined;
    emergencyContacts: string = undefined;
    boats: Boat[] = undefined;
}

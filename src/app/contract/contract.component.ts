import { AppConfig } from './../_shared/models/app-config.model';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Boat } from '../_shared/models/boat.model';

@Component({
    selector: 'app-contract',
    templateUrl: './contract.component.html',
    styleUrls: ['./contract.component.css']
})
export class ContractComponent implements OnInit {

    public contractForm: FormGroup;
    public boats: Boat[];

    constructor(
        private formBuilder: FormBuilder,
        private appConfig: AppConfig
    ) {
        this.createForm();
    }

    createForm() {
        const dp = new DatePipe(navigator.language);
        const p = 'y-MM-dd'; // YYYY-MM-DD
        const dtr = dp.transform(new Date(), p);

        this.boats = this.appConfig.boats.slice();
        const otherBoat = new Boat();
        otherBoat.name = 'Altro';
        this.boats.push(otherBoat);

        this.contractForm = this.formBuilder.group({
            date: dtr,
            rentalDescription: this.appConfig.rentalDescription,
            boatName: null,
            boatType: '',
            boatVin: '',
            engine: '',
            engineVin: '',
            registrationNumber: '',
            tankSize: 0,
            renterName: '',
            birthPlace: '',
            birthDate: '',
            homeTown: '',
            homeAddress: '',
            ssn: '',
            phone: '',
            email: '',
            idType: '',
            idNumber: '',
            idIssuer: '',
            idIssueDate: '',
            startDate: '',
            startTime: '',
            endDate: '',
            endTime: '',
            startFuel: '',
            endFuel: '',
            fuelCost: '',
            totalFuelCost: '',
            rentPrice: '',
            securityDeposit: '',
            deposit: '',
            balance: ''
        });
        this.contractForm.get('boatName').valueChanges.subscribe(x => this.changeBoat(x));

        this.contractForm.patchValue({
            boatName: this.appConfig.boats[0]
        });
    }
    changeBoat(boat: Boat) {
        this.contractForm.patchValue({
            boatType: boat.boatType,
            boatVin: boat.boatVin,
            engine: boat.engine,
            engineVin: boat.engineVin,
            registrationNumber: boat.registrationNumber,
            tankSize: boat.tankSize
        });
    }
    ngOnInit() {
    }

}

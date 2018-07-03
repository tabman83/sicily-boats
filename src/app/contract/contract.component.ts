import { AppConfig } from './../_shared/models/app-config.model';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
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
            date: [dtr, Validators.required],
            rentalDescription: [this.appConfig.rentalDescription, Validators.required],
            boatName: null,
            boat: this.formBuilder.group({
                boatType: ['', Validators.required],
                boatVin: ['', Validators.required],
                engine: ['', Validators.required],
                engineVin: ['', Validators.required],
                registrationNumber: ['', Validators.required],
                tankSize: [0, Validators.required],
            }),
            renterName: ['', Validators.required],
            birthPlace: ['', Validators.required],
            birthDate: ['', Validators.required],
            homeTown: ['', Validators.required],
            homeAddress: ['', Validators.required],
            ssn: ['', Validators.required],
            phone: ['', Validators.required],
            email: ['', Validators.required],
            idType: ['', Validators.required],
            idNumber: ['', Validators.required],
            idIssuer: ['', Validators.required],
            idIssueDate: ['', Validators.required],
            startDate: ['', Validators.required],
            startTime: ['', Validators.required],
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
            boatName: this.boats[0]
        });
    }
    changeBoat(boat: Boat) {
        // if (boat.name === 'Altro') {

        // }
        this.contractForm.get('boat').patchValue(boat);
    }
    ngOnInit() {
    }

}

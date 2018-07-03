import { AppConfig } from './../_shared/models/app-config.model';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Boat } from '../_shared/models/boat.model';
import { SsnNumberService } from '../_shared/services/ssn-number.service';
import { environment } from '../../environments/environment';

@Component({
    selector: 'app-contract',
    templateUrl: './contract.component.html',
    styleUrls: ['./contract.component.css']
})
export class ContractComponent implements OnInit {

    public contractForm: FormGroup;
    public boats: Boat[];
    public firstStep = true;

    private readonly datePipe = new DatePipe(navigator.language);

    constructor(
        private formBuilder: FormBuilder,
        private appConfig: AppConfig,
        private ssnNumberService: SsnNumberService
    ) {
        this.createForm();
    }

    createForm() {
        const todayDate = this.datePipe.transform(new Date(), 'y-MM-dd');
        this.boats = this.appConfig.boats.slice();

        this.contractForm = this.formBuilder.group({
            date: [todayDate, Validators.required],
            boatName: null,
            boat: this.formBuilder.group({
                boatType: ['', Validators.required],
                boatVin: ['', Validators.required],
                engine: ['', Validators.required],
                engineVin: ['', Validators.required],
                registrationNumber: ['', Validators.required],
                tankSize: [0, Validators.required],
            }),
            renterName: [environment.contract.renterName, Validators.required],
            sex: [environment.contract.sex, Validators.required],
            birthPlace: [environment.contract.birthPlace, Validators.required],
            birthDate: [environment.contract.birthDate, Validators.required],
            homeTown: [environment.contract.homeTown, Validators.required],
            homeAddress: [environment.contract.homeAddress, Validators.required],
            ssn: [environment.contract.ssn, Validators.required],
            phone: [environment.contract.phone, Validators.required],
            email: [environment.contract.email, Validators.required],
            idType: [environment.contract.idType, Validators.required],
            idNumber: [environment.contract.idNumber, Validators.required],
            idIssuer: [environment.contract.idIssuer, Validators.required],
            idIssueDate: [environment.contract.idIssueDate, Validators.required],
            startDate: [environment.contract.startDate, Validators.required],
            startTime: [environment.contract.startTime, Validators.required],
            endDate: environment.contract.endDate,
            endTime: environment.contract.endTime,
            startFuel: environment.contract.startFuel,
            endFuel: environment.contract.endFuel,
            fuelCost: environment.contract.fuelCost,
            totalFuelCost: environment.contract.totalFuelCost,
            rentPrice: environment.contract.rentPrice,
            securityDeposit: environment.contract.securityDeposit,
            deposit: environment.contract.deposit,
            balance: environment.contract.balance
        });
        this.contractForm.get('boatName').valueChanges.subscribe(x => this.changeBoat(x));

        this.contractForm.patchValue({
            boatName: this.boats[0]
        });
    }

    changeBoat(boat: Boat) {
        this.contractForm.get('boat').patchValue(boat);
        if (boat.name === 'Altro') {
            this.contractForm.get('boat').enable();
        } else {
            this.contractForm.get('boat').disable();
        }
    }

    getSsn() {
        const renterName = this.contractForm.get('renterName').value;
        const renterNameParts = renterName.split(' ');
        const firstName = renterNameParts[0];
        const lastName = renterNameParts[1];
        const birthPlace = this.contractForm.get('birthPlace').value;
        const birthDateValue = this.contractForm.get('birthDate').value;
        const birthDate = this.datePipe.transform(birthDateValue, 'dd/MM/yyyy');
        const sex = this.contractForm.get('sex').value;

        this.ssnNumberService.get(firstName, lastName, birthPlace, birthDate, sex).subscribe(x => this.contractForm.patchValue({ ssn: x }));
    }

    submit() {
        this.firstStep = false;
    }

    back() {
        this.firstStep = true;
    }

    ngOnInit() {
    }

}

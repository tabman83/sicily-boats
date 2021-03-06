import { AppConfig } from './../_shared/models/app-config.model';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Boat } from '../_shared/models/boat.model';
import { SsnNumberService } from '../_shared/services/ssn-number.service';
import { environment } from '../../environments/environment';
import { ContractService } from '../_shared/services/contract.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'app-contract',
    templateUrl: './contract.component.html',
    styleUrls: ['./contract.component.css']
})
export class ContractComponent implements OnInit {

    public contractForm: FormGroup;
    public boats: Boat[];
    public idTypes: string[];
    public downloadUrl: any;
    public submitting = false;
    public submitted = false;
    public contractFileName: string;

    private readonly datePipe = new DatePipe('en-US'); // navigator.language
    private contract: any = {};

    constructor(
        private formBuilder: FormBuilder,
        private appConfig: AppConfig,
        private ssnNumberService: SsnNumberService,
        private contractService: ContractService,
        private domSanitizer: DomSanitizer
    ) {
        this.createForm();
    }

    createForm() {
        const todayDate = this.datePipe.transform(new Date(), 'y-MM-dd');
        this.boats = this.appConfig.boats;
        this.idTypes = this.appConfig.idTypes;

        this.contractForm = this.formBuilder.group({
            registryNumber: [environment.contract.registryNumber],
            date: [todayDate, Validators.required],
            language: [environment.contract.language, Validators.required],
            boat: this.boats[0],
            renterName: [environment.contract.renterName, Validators.required],
            sex: [environment.contract.sex, Validators.required],
            boatLicense: [environment.contract.boatLicense, Validators.required],
            boatLicenseDetails: environment.contract.boatLicenseDetails,
            birthPlace: [environment.contract.birthPlace, Validators.required],
            birthState: [environment.contract.birthState, Validators.required],
            birthDate: [environment.contract.birthDate, Validators.required],
            homeTown: [environment.contract.homeTown, Validators.required],
            homeState: [environment.contract.homeState, Validators.required],
            homeAddress: [environment.contract.homeAddress, Validators.required],
            ssn: [environment.contract.ssn, Validators.required],
            phone: [environment.contract.phone, Validators.required],
            email: [environment.contract.email],
            idType: [environment.contract.idType, Validators.required],
            idNumber: [environment.contract.idNumber, Validators.required],
            idIssuer: [environment.contract.idIssuer, Validators.required],
            idIssueDate: [environment.contract.idIssueDate, Validators.required],
            startDate: [environment.contract.startDate, Validators.required],
            startTime: [environment.contract.startTime, Validators.required],
            endTime: [environment.contract.endTime, Validators.required],
            startFuel: [environment.contract.startFuel, Validators.required],
            fuelCost: [environment.contract.fuelCost, Validators.required],
            rentPrice: [environment.contract.rentPrice, Validators.required],
            securityDeposit: [environment.contract.securityDeposit, Validators.required]
        });

        this.contractForm.get('boatLicense').valueChanges.subscribe(x => {
            console.log(x);
        });
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
        this.submitted = true;
        if (this.contractForm.valid) {
            this.submitting = true;
            this.mergeData();
            this.contractFileName = `Contratto_${this.contract.renterName.replace(' ', '_')}_${this.contract.date}.pdf`;
            this.contractService.get(this.contract).subscribe(result => {
                const byteCharacters = atob(result.content);
                const byteNumbers = new Array(byteCharacters.length);
                for (let i = 0; i < byteCharacters.length; i++) {
                    byteNumbers[i] = byteCharacters.charCodeAt(i);
                }
                const byteArray = new Uint8Array(byteNumbers);
                const blob = new Blob([byteArray], { type: 'application/pdf' });
                const blobUrl = URL.createObjectURL(blob);
                this.downloadUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(blobUrl);
                this.submitting = false;
            });
        } else {
            window.scrollTo(0, 0);
        }
    }

    isFieldValid(field: string) {
        return this.contractForm.get(field).invalid && (this.submitted || this.contractForm.get(field).touched);
    }

    mergeData() {
        this.contract = Object.assign({
            rentalName: this.appConfig.rentalName,
            rentalDescription: this.appConfig.rentalDescription,
            rentalEmail: this.appConfig.rentalEmail,
            rentalAddresses: this.appConfig.rentalAddresses,
            emergencyContacts: this.appConfig.emergencyContacts,
            deposit: this.contractForm.value.rentPrice + this.contractForm.value.securityDeposit,
            endDate: this.contractForm.value.startDate
        }, this.contractForm.value);
    }

    ngOnInit() {
    }

}

// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
    production: false,
    configFile: '/api/config',
    contract: {
        registryNumber: '',
        renterName: '',
        sex: 'M',
        language: 'it',
        boatLicense: false,
        boatLicenseDetails: '',
        birthPlace: '',
        birthState: '',
        birthDate: '',
        homeTown: '',
        homeState: '',
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
        startFuel: '',
        fuelCost: 1.8,
        rentPrice: null,
        securityDeposit: 100
    }
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.

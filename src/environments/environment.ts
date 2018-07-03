// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
    production: false,
    configFile: 'appconfig.json',
    contract: {
        renterName: 'Antonino Parisi',
        sex: 'M',
        birthPlace: 'Albenga (SV)',
        birthDate: '31/01/1983',
        homeTown: 'Noto',
        homeAddress: 'Via Alessio Di Giovanni 22',
        ssn: 'PRSNNN83A31A145R',
        phone: '00353 83 1620370',
        email: 'tabman83@gmail.com',
        idType: 'Carta di identita',
        idNumber: 'AR1115961',
        idIssuer: 'Comune di Noto',
        idIssueDate: '15/06/2008',
        startDate: '04/08/2018',
        startTime: '09:20',
        endDate: '04/08/2018',
        endTime: '15:10',
        startFuel: '30',
        endFuel: '15',
        fuelCost: 1.8,
        totalFuelCost: 40,
        rentPrice: 150,
        securityDeposit: 50,
        deposit: 50,
        balance: 100
    }
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.

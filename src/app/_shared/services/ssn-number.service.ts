import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class SsnNumberService {

    private readonly webserviceUrl = 'http://webservices.dotnethell.it';
    public readonly apiUrl = '/codicefiscale.asmx/CalcolaCodiceFiscale';
    constructor(private httpClient: HttpClient) { }

    public get(firstName: string, lastName: string, birthPlace: string, birthDate: string, sex: string): Observable<string> {
        // tslint:disable-next-line:max-line-length
        const url = `${this.webserviceUrl}${this.apiUrl}?Nome=${firstName}&Cognome=${lastName}&ComuneNascita=${birthPlace}&DataNascita=${birthDate}&Sesso=${sex}`;
        return this.httpClient.get(url, { responseType: 'text' }).pipe(map(x => {
            const matches = x.match(/CodiceFiscale">(.*)<\/string>/);
            if (matches.length > 1) {
                return matches[1];
            } else {
                return null;
            }
        }));
    }
}


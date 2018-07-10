import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ContractService {

    constructor(private httpClient: HttpClient) { }

    public get(data: any) {
        return this.httpClient.post('/api/contract', data);
    }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfig } from '../models/app-config.model';

@Injectable()
export class AppConfigLoader {

    constructor(
        private httpClient: HttpClient,
        private appConfig: AppConfig
    ) { }

    validate(config): string[] {
        const result: string[] = [];
        const propertyNames = Object.getOwnPropertyNames(new AppConfig);
        for (const propertyName of propertyNames) {
            if (config[propertyName] && config[propertyName].length > 0) {
                this.appConfig[propertyName] = config[propertyName];
            } else {
                result.push(`${propertyName} is invalid or missing`);
            }
        }

        return result;
    }

    load(url: string) {
        return new Promise((resolve, error) => {
            this.httpClient.get(url).subscribe((content) => {

                const validationResult = this.validate(content);
                if (validationResult.length === 0) {
                    Object.assign(this.appConfig, content);
                    resolve(content);
                } else {
                    error(`Config file error:\r\n - ${validationResult.join('\r\n - ')}`);
                }

            }, reason => {
                if (reason.status === 404) {
                    error('Config file error: cannot find appconfig.json');
                } else {
                    error(reason.message);
                }
            });
        });
    }
}

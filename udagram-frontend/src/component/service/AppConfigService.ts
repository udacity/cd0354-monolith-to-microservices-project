import { Injectable } from '@angular/core';
import {AppConfig} from './AppConfig';
import { HttpClient} from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class AppConfigService {
    private config: AppConfig;
    constructor(private http: HttpClient) {}
    loadConfig(): Promise<void> {
        return this.http
            .get<AppConfig>('/assets/app.config.json')
            .toPromise()
            .then(data => {
                this.config = data;
            });
    }
    
    getConfig(): AppConfig {
        return this.config;
    }
}

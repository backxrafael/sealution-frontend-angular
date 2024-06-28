import { Component } from "@angular/core";
import { Registration } from "./registration";
import { RegistrationService } from "./registration-service.service";
import { NgFor, NgIf } from "@angular/common";
import { DatabaseService } from "../database-service.service";
import { environment } from "../../environments/environment";

@Component({
    selector: 'registrations',
    standalone: true,
    imports: [NgFor, NgIf],
    templateUrl: './registration.component.html',
    styleUrl: './registration.component.css',
})
export class RegistrationComponent {
    title = 'registration-component';
    registrations : Registration[] = [];
    constructor(private registrationService: RegistrationService, private databaseService: DatabaseService){}

    async getRegistrations() {
        (await this.registrationService.getRegistrations()).subscribe(result => {
            this.registrations = result;
        });
    }

    async createDatabase(name: string) {
        this.databaseService.createDatabase(name).subscribe(result => {
            //TODO: Show errors etc if result is false or status code != 200
            console.log(result);
        })
    }

    async acceptRegistration(registration: Registration) {
        // Accept the registration and update the registrations by fetching the list 
        // of registrations again
        (await this.registrationService.acceptRegistration(registration)).subscribe(_result => {
            this.getRegistrations();
        })
    }

    async denyRegistration(registration: Registration) {
        // Deny the registration and update the registrations by fetching the list 
        // of registrations again
        (await this.registrationService.denyRegistration(registration)).subscribe(_result => {
            this.getRegistrations();
        })
    }
}
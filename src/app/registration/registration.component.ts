import { Component, EventEmitter, Input, Output } from "@angular/core";
import { Registration } from "./registration";
import { RegistrationService } from "../services/registration-service.service";
import { NgFor, NgIf } from "@angular/common";
import { DatabaseService } from "../services/database-service.service";
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'registration',
    standalone: true,
    imports: [NgFor, NgIf, FormsModule],
    templateUrl: './registration.component.html',
    styleUrl: './registration.component.css',
})
export class RegistrationComponent {
    @Input() registration! : Registration;
    @Output() updateRegistrationsEvent = new EventEmitter<boolean>();
    title = 'registration-component';
    constructor(private registrationService: RegistrationService, private databaseService: DatabaseService){}

    async createDatabase(name: string, bucketName: string, userName: string) {
        this.databaseService.createInfluxDBOrganization(name,bucketName, userName).subscribe(result => {
            //TODO: Show errors etc if result is false or status code != 200
            console.log(result);
        })
    }

    async acceptRegistration(registration: Registration) {
        // Accept the registration and update the registrations by fetching the list 
        // of registrations again
        (await this.registrationService.acceptRegistration(registration)).subscribe(_result => {
            this.updateRegistrationsEvent.emit(true);
        })
        await this.createDatabase(registration.clientName, `${registration.clientName}-bucket`, registration.shipName)
    }

    async denyRegistration(registration: Registration) {
        // Deny the registration and update the registrations by fetching the list 
        // of registrations again
        (await this.registrationService.denyRegistration(registration)).subscribe(_result => {
            this.updateRegistrationsEvent.emit(true);
        })
    }
}
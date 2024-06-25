import { Component } from "@angular/core";
import { Registration } from "./registration";
import { RegistrationService } from "./registration-service.service";
import { NgFor, NgIf } from "@angular/common";

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
    constructor(private registrationService: RegistrationService){}

    getRegistrations() {
        this.registrationService.getRegistrations().subscribe(result => {
            this.registrations = result;
        });
    }

    acceptRegistration(registration: Registration) {
        // Accept the registration and update the registrations by fetching the list 
        // of registrations again
        this.registrationService.acceptRegistration(registration).subscribe(_result => {
            this.getRegistrations();
        })
    }

    denyRegistration(registration: Registration) {
        // Deny the registration and update the registrations by fetching the list 
        // of registrations again
        this.registrationService.denyRegistration(registration).subscribe(_result => {
            this.getRegistrations();
        })
    }
}
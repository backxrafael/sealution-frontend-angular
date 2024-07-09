import { Component } from "@angular/core";
import { Registration } from "../registration/registration";
import { NgFor, NgIf } from "@angular/common";
import { RegistrationService } from "../services/registration-service.service";
import { RegistrationComponent } from "../registration/registration.component";

@Component({
    selector: 'registrations',
    standalone: true,
    imports: [NgFor, NgIf, RegistrationComponent],
    templateUrl: './registrations.component.html',
    styleUrl: './registrations.component.css',
})
export class RegistrationsComponent {
    constructor(private registrationService: RegistrationService) {}
    registrations : Registration[] = [];

    async getRegistrations() {
        console.log("updating registrations");
        (await this.registrationService.getRegistrations()).subscribe(result => {
            this.registrations = result;
        });
    }
}
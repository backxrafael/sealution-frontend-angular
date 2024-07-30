import { Component } from "@angular/core";
import { Registration } from "../../types/registration";
import { NgFor, NgIf } from "@angular/common";
import { BackendService } from "../services/backend-service.service";
import { RegistrationComponent } from "../registration/registration.component";

@Component({
    selector: 'registrations',
    standalone: true,
    imports: [NgFor, NgIf, RegistrationComponent],
    templateUrl: './registrations.component.html',
    styleUrl: './registrations.component.css',
})
export class RegistrationsComponent {
    constructor(private backendService: BackendService) {}
    registrations : Registration[] = [];

    async getRegistrations() {
        console.log("updating registrations");
        (await this.backendService.getRegistrations()).subscribe(result => {
            this.registrations = result;
        });
    }
}
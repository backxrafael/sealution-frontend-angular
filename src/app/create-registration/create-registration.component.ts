import { Component, Input } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CreateRegistration } from "./create-registration";
import { RegistrationService } from "../services/registration-service.service";

@Component({
    selector: 'create-registration',
    standalone: true,
    imports: [FormsModule],
    templateUrl: './create-registration.component.html',
    styleUrl: './create-registration.component.css',
})
export class CreateRegistrationComponent {
    constructor(private registrationService: RegistrationService) {}
    @Input() createRegistration: CreateRegistration = {
        shipId: ''
    };

    async createAuthenticationRegistration() {
        (await this.registrationService.createRegistrationRequest(this.createRegistration)).subscribe(result => {
            console.log(result)
        })
    }

    async pollAuthenticationRegistration() {
        (await this.registrationService.getRegistrationStatus(this.createRegistration.shipId)).subscribe(result => {
            console.log(result)
        })
    }
}
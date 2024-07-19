import { Component, Input } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CreateRegistration } from "./create-registration";
import { BackendService } from "../services/backend-service.service";

@Component({
    selector: 'create-registration',
    standalone: true,
    imports: [FormsModule],
    templateUrl: './create-registration.component.html',
    styleUrl: './create-registration.component.css',
})
export class CreateRegistrationComponent {
    constructor(private backendService: BackendService) {}
    @Input() createRegistration: CreateRegistration = {
        shipId: ''
    };

    async createAuthenticationRegistration() {
        (await this.backendService.createRegistrationRequest(this.createRegistration)).subscribe(result => {
            console.log(result)
        })
    }

    downloadFile(content: string, name: string) {
        const newBlob = new Blob([content], { type: "text/csv" });
        const data = window.URL.createObjectURL(newBlob);
        const link = document.createElement("a");
        link.href = data;
        link.download = name; // set a name for the file
        link.click();
    }

    async pollAuthenticationRegistration() {
        (await this.backendService.getRegistrationStatus(this.createRegistration.shipId)).subscribe(result => {
            console.log(result);
            if (result.certificate) {
                this.downloadFile(result.certificate, `${result.shipInformation?.clientName}-${result.shipInformation?.shipName}-certificate.crt`)
            }
            if (result.PrivateKey) {
                this.downloadFile(result.PrivateKey, `${result.shipInformation?.clientName}-${result.shipInformation?.shipName}-key.key`)
            }
        })
    }
}
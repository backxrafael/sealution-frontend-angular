export interface Registration {
    id: number;
    shipId: string;
    certificateARN: string;
    status: string;
    // added by the frontend
    shipName: string;
    clientName: string;
    certificate?: string;
    PrivateKey?: string;
    PublicKey?: string;
    shipInformation?: ShipInformation
}

export interface ShipInformation {
    id: number;
    shipId: string;
    shipName: string;
    clientName: string;
    createdDate: Date;
    updatedDate: Date;
}
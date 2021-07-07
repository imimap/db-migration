export class CompanyAddress {
    companyId: number;
    street: string;
    zip: string;
    city: string;
    country: string;
    phone: string;
    fax: string;
    latitude: number;
    longitude: number;
    createdAt: Date;
    updatedAt: Date;

    constructor(companyId: number, street: string, zip: string, city: string, country: string, phone: string, fax: string, latitude: number, longitude: number, createdAt: Date, updatedAt: Date) {
        this.companyId = companyId;
        this.street = street;
        this.zip = zip;
        this.city = city;
        this.country = country;
        this.phone = phone;
        this.fax = fax;
        this.latitude = latitude;
        this.longitude = longitude;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}

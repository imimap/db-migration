export class Company {
    name: string;
    numberEmployees: number | null;
    industry: string;
    website: string;
    createdAt: Date;
    updatedAt: Date;
    mainLanguage: string;
    excludedFromSearch: boolean;
    comment: string;

    constructor(name: string, numberEmployees: number | null, industry: string, website: string, createdAt: Date, updatedAt: Date, mainLanguage: string, excludedFromSearch: boolean, comment: string) {
        this.name = name;
        this.numberEmployees = numberEmployees;
        this.industry = industry;
        this.website = website;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.mainLanguage = mainLanguage;
        this.excludedFromSearch = excludedFromSearch;
        this.comment = comment;
    }
}

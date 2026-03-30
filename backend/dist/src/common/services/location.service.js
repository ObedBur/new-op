"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var LocationService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocationService = void 0;
const common_1 = require("@nestjs/common");
let LocationService = LocationService_1 = class LocationService {
    constructor() {
        this.logger = new common_1.Logger(LocationService_1.name);
        this.provinces = [];
        this.provinces = this.getProvincesData();
        this.logger.log(` ${this.provinces.length} provinces charges en mmoire`);
    }
    getProvincesData() {
        return [
            { name: 'Bas-Uele', code: 'BU', communes: ['Buta', 'Aketi', 'Bondo'] },
            { name: 'quateur', code: 'EQ', communes: ['Mbandaka', 'Bolomba', 'Bomongo'] },
            { name: 'Haut-Katanga', code: 'HK', communes: ['Lubumbashi', 'Likasi', 'Kipushi'] },
            { name: 'Haut-Lomami', code: 'HL', communes: ['Kamina', 'Bukama'] },
            { name: 'Haut-Uele', code: 'HU', communes: ['Isiro', 'Watsa', 'Dungu'] },
            { name: 'Ituri', code: 'IT', communes: ['Bunia', 'Aru', 'Mahagi', 'Djugu'] },
            { name: 'Kasa', code: 'KS', communes: ['Tshikapa', 'Mweka'] },
            { name: 'Kasa-Central', code: 'KC', communes: ['Kananga', 'Kazumba'] },
            { name: 'Kasa-Oriental', code: 'KO', communes: ['Mbuji-Mayi', 'Miabi'] },
            { name: 'Kinshasa', code: 'KN', communes: ['Gombe', 'Lingwala', 'Kasa-Vubu', 'Ngaliema', 'Lemba', 'Limete', 'Matete', 'Ndjili', 'Masina', 'Kimbanseke', 'Mont-Ngafula', 'Kintambo', 'Bandalungwa', 'Selembao', 'Bumbu', 'Makala', 'Ngaba', 'Kalamu', 'Barumbu', 'Kinshasa', 'Maluku', 'Nsele'] },
            { name: 'Kongo-Central', code: 'KGC', communes: ['Matadi', 'Boma', 'Mbanza-Ngungu'] },
            { name: 'Kwango', code: 'KW', communes: ['Kenge', 'Popokabaka'] },
            { name: 'Kwilu', code: 'KL', communes: ['Bandundu', 'Kikwit', 'Bulungu'] },
            { name: 'Lomami', code: 'LO', communes: ['Kabinda', 'Mwene-Ditu'] },
            { name: 'Lualaba', code: 'LU', communes: ['Kolwezi', 'Dilolo', 'Sandoa'] },
            { name: 'Mai-Ndombe', code: 'MN', communes: ['Inongo', 'Kutu'] },
            { name: 'Maniema', code: 'MA', communes: ['Kindu', 'Kasongo'] },
            { name: 'Mongala', code: 'MO', communes: ['Lisala', 'Bumba'] },
            { name: 'Nord-Kivu', code: 'NK', communes: ['Goma', 'Beni', 'Butembo', 'Lubero', 'Masisi', 'Rutshuru', 'Walikale'] },
            { name: 'Nord-Ubangi', code: 'NU', communes: ['Gbadolite', 'Bosobolo'] },
            { name: 'Sankuru', code: 'SA', communes: ['Lusambo', 'Lodja'] },
            { name: 'Sud-Kivu', code: 'SK', communes: ['Bukavu', 'Uvira', 'Baraka', 'Fizi', 'Kabare', 'Kalehe', 'Mwenga', 'Shabunda', 'Walungu'] },
            { name: 'Sud-Ubangi', code: 'SU', communes: ['Gemena', 'Budjala'] },
            { name: 'Tanganyika', code: 'TA', communes: ['Kalemie', 'Kongolo'] },
            { name: 'Tshopo', code: 'TS', communes: ['Kisangani', 'Isangi'] },
            { name: 'Tshuapa', code: 'TU', communes: ['Boende', 'Bokungu'] },
            { name: 'Autre', code: 'OT', communes: ['Centre-ville', 'Autre'] }
        ];
    }
    getAllProvinces() {
        return this.provinces.map(p => p.name);
    }
    getCommunes(provinceName) {
        const province = this.provinces.find(p => p.name.toLowerCase() === provinceName.toLowerCase());
        return province ? province.communes : ['Centre-ville'];
    }
    isValidProvince(provinceName) {
        if (!provinceName)
            return false;
        const exists = this.provinces.some(p => p.name.toLowerCase() === provinceName.toLowerCase());
        return true;
    }
    isValidCommune(provinceName, communeName) {
        if (!provinceName || !communeName)
            return false;
        const province = this.provinces.find(p => p.name.toLowerCase() === provinceName.toLowerCase());
        if (province) {
            return province.communes.some(c => c.toLowerCase() === communeName.toLowerCase());
        }
        return true;
    }
};
exports.LocationService = LocationService;
exports.LocationService = LocationService = LocationService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], LocationService);
//# sourceMappingURL=location.service.js.map
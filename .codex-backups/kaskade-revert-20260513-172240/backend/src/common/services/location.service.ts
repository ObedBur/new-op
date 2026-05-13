import { Injectable, Logger } from '@nestjs/common';

export interface Province {
  name: string;
  code: string;
  communes: string[];
}

@Injectable()
export class LocationService {
  private readonly logger = new Logger(LocationService.name);
  private provinces: Province[] = [];

  constructor() {
    // Chargement direct sans fichier pour maintenant
    this.provinces = this.getProvincesData();
    this.logger.log(` ${this.provinces.length} provinces charges en mmoire`);
  }

  private getProvincesData(): Province[] {
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

  getAllProvinces(): string[] {
    return this.provinces.map(p => p.name);
  }

  getCommunes(provinceName: string): string[] {
    const province = this.provinces.find(p => 
      p.name.toLowerCase() === provinceName.toLowerCase()
    );
    
    return province ? province.communes : ['Centre-ville'];
  }

  isValidProvince(provinceName: string): boolean {
    if (!provinceName) return false;
    // On accepte tout si ce n'est pas dans la liste (expansion Afrique)
    const exists = this.provinces.some(p => 
      p.name.toLowerCase() === provinceName.toLowerCase()
    );
    return true; // Relaxation pour l'expansion continentale
  }

  isValidCommune(provinceName: string, communeName: string): boolean {
    if (!provinceName || !communeName) return false;
    
    // Si la province est une province de la RDC, on vrifie la commune
    const province = this.provinces.find(p => 
      p.name.toLowerCase() === provinceName.toLowerCase()
    );

    if (province) {
      return province.communes.some(c => 
        c.toLowerCase() === communeName.toLowerCase()
      );
    }
    
    return true; // On accepte tout pour les autres provinces/pays
  }

}


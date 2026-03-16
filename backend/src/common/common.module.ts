import { Module, Global } from '@nestjs/common';
import { LocationService } from './services/location.service';
import { IsValidProvinceConstraint } from './validators/is-valid-province.validator';
import { IsValidCommuneConstraint } from './validators/is-valid-commune.validator';
import { IsValidPhoneNumberConstraint } from './validators/is-valid-phone.validator';
import { IsBoutiqueRequiredForVendorConstraint } from './validators/is-boutique-required.validator';

@Global()
@Module({
  providers: [
    LocationService,
    IsValidProvinceConstraint,
    IsValidCommuneConstraint,
    IsValidPhoneNumberConstraint,
    IsBoutiqueRequiredForVendorConstraint,
  ],
  exports: [
    LocationService,
    IsValidProvinceConstraint,
    IsValidCommuneConstraint,
    IsValidPhoneNumberConstraint,
    IsBoutiqueRequiredForVendorConstraint,
  ],
})
export class CommonModule {}


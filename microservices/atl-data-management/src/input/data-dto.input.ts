import { ResolutionCodeType } from 'src/entities/country.entity';

export class DataDto {
  timestamp: string;
  country_data: Array<{
    country_id: string;
    resolution_code: ResolutionCodeType;
    entries: Array<{ timestamp: string; value: string }>;
  }>;
}

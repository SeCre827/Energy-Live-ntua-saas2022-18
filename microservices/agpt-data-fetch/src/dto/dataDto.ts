export class DataDto {
  timestamp: string;
  countries_data: Array<{
    country_ID: string;
    production_type: string;
    timestamp: string;
    value: string;
  }>;
}

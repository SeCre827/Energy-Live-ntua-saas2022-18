export class DataDto {
  timestamp: string;
  country_data: Array<{
    country_id: string;
    resolution_code: string;
    entries: Array<{ timestamp: string; value: string }>;
  }>;
}

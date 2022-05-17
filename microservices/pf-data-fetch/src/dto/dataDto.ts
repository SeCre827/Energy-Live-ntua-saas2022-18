export class DataDto {
  timestamp: string;
  countries_pairs_data: Array<{
    countries_pair: string;
    timestamp: string;
    value: string;
  }>;
}

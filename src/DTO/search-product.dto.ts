// src/search/dto/search-query.dto.ts
import { IsOptional, IsString, IsArray, IsNumber, IsInt } from 'class-validator';

export class SearchQueryDto {
  @IsOptional()
  @IsString()
  query: string;

  @IsOptional()
  @IsString()
  category: string;

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  priceRange: [number, number];
}

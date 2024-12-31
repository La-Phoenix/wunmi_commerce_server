import { IsString, IsNumber, IsOptional, IsUrl, IsNotEmpty } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  price: number;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsUrl()
  @IsOptional() // Optional, if imageUrl is not always required
  imageUrl: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}

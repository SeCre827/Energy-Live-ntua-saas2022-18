import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { DataDto } from 'src/input/data-dto.input';

@Injectable()
export class ExtractJsonPipe implements PipeTransform {
  transform(file: Express.Multer.File): DataDto {
    try {
      return JSON.parse(file.buffer.toString());
    } catch (e) {
      if (e instanceof SyntaxError) {
        throw new BadRequestException();
      } else {
        throw e;
      }
    }
  }
}

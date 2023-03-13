import { Injectable } from '@nestjs/common';

//ENUMS
import { FILE_TYPE } from 'src/constants/file/file.constant';

@Injectable()
export class UtilsService {
  getFileType(filename: string) {
    const extension = filename.split('.').pop().toLowerCase();
    switch (extension) {
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'bmp':
      case 'svg':
        return FILE_TYPE.Image;
      case 'mp3':
      case 'wav':
      case 'flac':
      case 'aac':
        return FILE_TYPE.Audio;
      case 'mp4':
      case 'avi':
      case 'mov':
      case 'wmv':
      case 'mkv':
      case 'webm':
        return FILE_TYPE.Video;
      case 'pdf':
      case 'doc':
      case 'docx':
      case 'txt':
      case 'rtf':
      case 'ppt':
      case 'pptx':
      case 'xls':
      case 'xlsx':
      case 'csv':
        return FILE_TYPE.Document;
      default:
        return FILE_TYPE.Unknown;
    }
  }
}

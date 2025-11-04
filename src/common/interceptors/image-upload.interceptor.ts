import { FilesInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { ERROR_MESSAGES } from 'src/common/constants/error-messages';
import { HttpExceptionWrapper } from 'src/common/helpers/http-exception-wrapper';

export function ImageUploadInterceptor(fieldName = 'images') {
  return FilesInterceptor(fieldName, undefined, {
    storage: memoryStorage(),
    fileFilter: (req, file, callback) => {
      if (!file.mimetype.match(/^image\/(jpeg|png|jpg|gif|webp)$/)) {
        return callback(
          new HttpExceptionWrapper(ERROR_MESSAGES.INVALID_FILE_TYPE),
          false,
        );
      }
      callback(null, true);
    },
  });
}

import { HttpException, HttpStatus } from '@nestjs/common';
import { extname } from 'path';
import SubEntity from 'src/entities/sub/sub.entity';

export const imageFileFilter = async (req, file, callback) => {
  const user = req.user;
  const sub = await SubEntity.findOneOrFail({
    where: { name: req.params.name },
  });

  if (sub.username !== user.username) {
    return callback(
      new HttpException(`You dont own this sub`, HttpStatus.BAD_REQUEST),
      false,
    );
  }
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return callback(
      new HttpException(
        `Unsupported file type ${extname(file.originalname)}`,
        HttpStatus.BAD_REQUEST,
      ),
      false,
    );
  }
  callback(null, true);
};

export const editFileName = (req, file, callback) => {
  const name = file.originalname.split('.')[0];
  const fileExtName = extname(file.originalname);
  const randomName = Array(4)
    .fill(null)
    .map(() => Math.round(Math.random() * 16).toString(16))
    .join('');
  callback(null, `${name}-${randomName}${fileExtName}`);
};

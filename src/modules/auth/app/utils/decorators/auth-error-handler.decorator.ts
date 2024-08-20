import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import {
  AuthIncorrectPasswordException,
  AuthNotFoundException,
} from '../../../context/domain/exceptions';

export function AuthErrorHanlder() {
  return (
    target: any,
    propertyKey: string,
    propertyDescriptor: PropertyDescriptor,
  ) => {
    const orginalMethod = propertyDescriptor.value;
    propertyDescriptor.value = async function (...args: any[]) {
      try {
        return await orginalMethod.apply(this, args);
      } catch (error) {
        if (AuthIncorrectPasswordException)
          throw new BadRequestException(error.message);

        if (error instanceof AuthNotFoundException)
          throw new NotFoundException('User not found');

        throw new InternalServerErrorException(error.message);
      }
    };

    return propertyDescriptor;
  };
}

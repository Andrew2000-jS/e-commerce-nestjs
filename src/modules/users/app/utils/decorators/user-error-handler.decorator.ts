import {
  UserAlreadyExistException,
  UserNotFoundException,
} from '@/modules/users/context/domain/exceptions';
import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

export function UserErrorHanlder() {
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
        if (error instanceof UserNotFoundException)
          throw new NotFoundException('User not found');
        if (error instanceof UserAlreadyExistException)
          throw new BadRequestException('User Already Exist');

        throw new InternalServerErrorException();
      }
    };

    return propertyDescriptor;
  };
}

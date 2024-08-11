import {
  UserAlreadyExistException,
  UserEmailNotValidException,
  UserNameNotValidException,
  UserNotFoundException,
  UserPasswordNotValidException,
} from '@/modules/users/context/domain/exceptions';
import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

const errorTypes = [
  UserAlreadyExistException,
  UserEmailNotValidException,
  UserNameNotValidException,
  UserPasswordNotValidException,
];

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
        const errorHanlder = errorTypes.some(
          (errorType) => error instanceof errorType,
        );

        if (errorHanlder) throw new BadRequestException(error.message);

        if (error instanceof UserNotFoundException)
          throw new NotFoundException('User not found');

        throw new InternalServerErrorException(error.message);
      }
    };

    return propertyDescriptor;
  };
}

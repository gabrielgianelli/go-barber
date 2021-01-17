import AppError from '@shared/errors/AppError';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUserRepository from '../repositories/fakes/FakeUserRepository';
import CreateUserService from './CreateUserService';

describe('CreateUser', () => {
  it('should be able to create a new user', async () => {
    const fakeUserRepository = new FakeUserRepository();
    const fakeHashProvider = new FakeHashProvider();
    const createUserService = new CreateUserService(
      fakeUserRepository,
      fakeHashProvider,
    );

    const name = 'John Doe';
    const email = 'john.doe@email.com';
    const password = '123456';

    const user = await createUserService.execute({ name, email, password });

    expect(user).toHaveProperty('id');
  });
});

describe('CreateUser', () => {
  it('should not be able to create two users with the same email', async () => {
    const fakeUserRepository = new FakeUserRepository();
    const fakeHashProvider = new FakeHashProvider();
    const createUserService = new CreateUserService(
      fakeUserRepository,
      fakeHashProvider,
    );

    const name = 'John Doe';
    const email = 'john.doe@email.com';
    const password = '123456';

    await createUserService.execute({ name, email, password });

    await expect(
      createUserService.execute({ name, email, password }),
    ).rejects.toBeInstanceOf(AppError);
  });
});

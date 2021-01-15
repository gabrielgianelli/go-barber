import AppError from '@shared/errors/AppError';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUserRepository from '../repositories/fakes/FakeUserRepository';
import AuthenticateUserService from './AuthenticateUserService';
import CreateUserService from './CreateUserService';

describe('AuthenticateUser', () => {
  it('should be able to authenticate user', async () => {
    const fakeUserRepository = new FakeUserRepository();
    const fakeHashProvider = new FakeHashProvider();
    const createUserService = new CreateUserService(
      fakeUserRepository,
      fakeHashProvider,
    );
    const authenticateUserService = new AuthenticateUserService(
      fakeUserRepository,
      fakeHashProvider,
    );

    const name = 'John Doe';
    const email = 'john.doe@email.com';
    const password = '123456';

    const user = await createUserService.execute({ name, email, password });

    const response = await authenticateUserService.execute({ email, password });

    expect(response).toHaveProperty('token');
    expect(response.user).toEqual(user);
  });
});

describe('AuthenticateUser', () => {
  // eslint-disable-next-line require-await
  it('should not be able to authenticate with non existing user', async () => {
    const fakeUserRepository = new FakeUserRepository();
    const fakeHashProvider = new FakeHashProvider();

    const authenticateUserService = new AuthenticateUserService(
      fakeUserRepository,
      fakeHashProvider,
    );

    const email = 'john.doe@email.com';
    const password = '123456';

    expect(
      authenticateUserService.execute({ email, password }),
    ).rejects.toBeInstanceOf(AppError);
  });
});

describe('AuthenticateUser', () => {
  it('should not be able to authenticate with wrong password', async () => {
    const fakeUserRepository = new FakeUserRepository();
    const fakeHashProvider = new FakeHashProvider();
    const createUserService = new CreateUserService(
      fakeUserRepository,
      fakeHashProvider,
    );
    const authenticateUserService = new AuthenticateUserService(
      fakeUserRepository,
      fakeHashProvider,
    );

    const name = 'John Doe';
    const email = 'john.doe@email.com';
    const password = '123456';
    const wrongPassword = '654321';

    await createUserService.execute({ name, email, password: wrongPassword });

    expect(
      authenticateUserService.execute({ email, password }),
    ).rejects.toBeInstanceOf(AppError);
  });
});

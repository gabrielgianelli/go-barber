import AppError from '@shared/errors/AppError';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUserRepository from '../repositories/fakes/FakeUserRepository';
import CreateUserService from './CreateUserService';

let fakeUserRepository: FakeUserRepository;
let fakeHashProvider: FakeHashProvider;
let createUserService: CreateUserService;
let name: string;
let email: string;
let password: string;

describe('CreateUser', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUserRepository();
    fakeHashProvider = new FakeHashProvider();
    createUserService = new CreateUserService(
      fakeUserRepository,
      fakeHashProvider,
    );

    name = 'John Doe';
    email = 'john.doe@email.com';
    password = '123456';
  });

  it('should be able to create a new user', async () => {
    const user = await createUserService.execute({ name, email, password });

    expect(user).toHaveProperty('id');
  });

  it('should not be able to create two users with the same email', async () => {
    await createUserService.execute({ name, email, password });

    await expect(
      createUserService.execute({ name, email, password }),
    ).rejects.toBeInstanceOf(AppError);
  });
});

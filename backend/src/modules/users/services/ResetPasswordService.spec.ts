import AppError from '@shared/errors/AppError';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';
import ResetPasswordService from './ResetPasswordService';

let fakeUsersRepository: FakeUsersRepository;
let fakeUserTokensRepository: FakeUserTokensRepository;
let fakeHashProvider: FakeHashProvider;

let resetPassword: ResetPasswordService;

let name: string;
let email: string;
let password: string;
let newPassword: string;
let nonExistentToken: string;
let nonExistentUser: string;

describe('ResetPassword', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeUserTokensRepository = new FakeUserTokensRepository();
    fakeHashProvider = new FakeHashProvider();

    resetPassword = new ResetPasswordService(
      fakeUsersRepository,
      fakeUserTokensRepository,
      fakeHashProvider,
    );

    name = 'John Doe';
    email = 'john.doe@email.com';
    password = '123456';
    newPassword = '123123';
    nonExistentToken = 'non-existent-token';
    nonExistentUser = 'non-existent-user';
  });

  it('should be able to reset the password', async () => {
    const user = await fakeUsersRepository.create({ name, email, password });

    const { token } = await fakeUserTokensRepository.generate(user.id);

    const generateHash = jest.spyOn(fakeHashProvider, 'generateHash');

    await resetPassword.execute({ token, password: newPassword });

    const updatedUser = await fakeUsersRepository.findById(user.id);

    expect(generateHash).toHaveBeenCalledWith(newPassword);
    expect(updatedUser?.password).toBe(newPassword);
  });

  it('should not be able to reset the password with non-existent token', async () => {
    await expect(
      resetPassword.execute({ token: nonExistentToken, password }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to reset the password with non-existent user', async () => {
    const { token } = await fakeUserTokensRepository.generate(nonExistentUser);

    await expect(
      resetPassword.execute({ token, password }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to reset password if passed more then 2 hours', async () => {
    const user = await fakeUsersRepository.create({ name, email, password });

    const { token } = await fakeUserTokensRepository.generate(user.id);

    jest.spyOn(Date, 'now').mockImplementation(() => {
      const customDate = new Date();

      return customDate.setHours(customDate.getHours() + 3);
    });

    await expect(
      resetPassword.execute({ token, password: newPassword }),
    ).rejects.toBeInstanceOf(AppError);
  });
});

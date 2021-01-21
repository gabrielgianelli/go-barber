import AppError from '@shared/errors/AppError';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateProfileService from './UpdateProfileService';

let userRepository: FakeUsersRepository;
let hashProvider: FakeHashProvider;

let updateProfile: UpdateProfileService;

let name: string;
let email: string;
let password: string;
let name2: string;
let email2: string;
let password2: string;

describe('UpdateProfile', () => {
  beforeEach(() => {
    userRepository = new FakeUsersRepository();
    hashProvider = new FakeHashProvider();

    updateProfile = new UpdateProfileService(userRepository, hashProvider);

    name = 'John Doe';
    email = 'john.doe@email.com';
    password = '123456';
    name2 = 'Jane Doe';
    email2 = 'jane.doe@email.com';
    password2 = '654321';
  });

  it('should be able to update profile', async () => {
    const user = await userRepository.create({ name, email, password });

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: name2,
      email: email2,
    });

    expect(updatedUser.name).toBe(name2);
    expect(updatedUser.email).toBe(email2);
  });

  it('should not be able to change to another user email', async () => {
    const user = await userRepository.create({ name, email, password });

    await userRepository.create({
      name: name2,
      email: email2,
      password,
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name,
        email: email2,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update the password', async () => {
    const user = await userRepository.create({ name, email, password });

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name,
      email,
      password: password2,
      old_password: password,
    });

    expect(updatedUser.password).toBe(password2);
  });

  it('should not be able to update the password without the old password', async () => {
    const user = await userRepository.create({ name, email, password });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name,
        email,
        password: password2,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update the password with wrong old password', async () => {
    const user = await userRepository.create({ name, email, password });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name,
        email,
        password: password2,
        old_password: password2,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update the profile of a non-existent user', async () => {
    await expect(
      updateProfile.execute({ user_id: 'non-existent', name, email }),
    ).rejects.toBeInstanceOf(AppError);
  });
});

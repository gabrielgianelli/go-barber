import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import AppError from '@shared/errors/AppError';
import FakeUserRepository from '../repositories/fakes/FakeUserRepository';
import UpdateUserAvatarService from './UpdateUserAvatarService';

let fakeUserRepository: FakeUserRepository;
let fakeStorageProvider: FakeStorageProvider;
let updateUserAvatar: UpdateUserAvatarService;
let name: string;
let email: string;
let password: string;
let avatarFileName: string;
let oldAvatarFileName: string;
let newAvatarFileName: string;

describe('UpdateUserAvatar', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUserRepository();
    fakeStorageProvider = new FakeStorageProvider();

    updateUserAvatar = new UpdateUserAvatarService(
      fakeUserRepository,
      fakeStorageProvider,
    );

    name = 'John Doe';
    email = 'john.doe@email.com';
    password = '123456';
    avatarFileName = 'avatar.jpg';
    oldAvatarFileName = 'avatar.jpg';
    newAvatarFileName = 'avatar2.jpg';
  });

  it('should be able to update user avatar', async () => {
    const user = await fakeUserRepository.create({ name, email, password });

    await updateUserAvatar.execute({ user_id: user.id, avatarFileName });

    expect(user.avatar).toBe(avatarFileName);
  });

  it('should not be able to update avatar from non existing user', async () => {
    await expect(
      updateUserAvatar.execute({
        user_id: 'non existing user',
        avatarFileName: 'avatar.jpeg',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to delete old avatar when updating new one', async () => {
    const user = await fakeUserRepository.create({ name, email, password });

    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFileName: oldAvatarFileName,
    });

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFileName: newAvatarFileName,
    });

    expect(deleteFile).toHaveBeenCalledWith(oldAvatarFileName);
    expect(user.avatar).toBe(newAvatarFileName);
  });
});

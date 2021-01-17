import AppError from '@shared/errors/AppError';
import FakeStorageProvider from '@shared/providers/fakes/FakeStorageProvider';
import FakeUserRepository from '../repositories/fakes/FakeUserRepository';
import UpdateUserAvatarService from './UpdateUserAvatarService';

describe('UpdateUserAvatar', () => {
  it('should be able to update user avatar', async () => {
    const fakeUserRepository = new FakeUserRepository();
    const fakeStorageProvider = new FakeStorageProvider();

    const updateUserAvatar = new UpdateUserAvatarService(
      fakeUserRepository,
      fakeStorageProvider,
    );

    const name = 'John Doe';
    const email = 'john.doe@email.com';
    const password = '123456';
    const avatarFileName = 'avatar.jpg';

    const user = await fakeUserRepository.create({ name, email, password });

    await updateUserAvatar.execute({ user_id: user.id, avatarFileName });

    expect(user.avatar).toBe(avatarFileName);
  });
});

describe('UpdateUserAvatar', () => {
  it('should not be able to update avatar from non existing user', async () => {
    const fakeUserRepository = new FakeUserRepository();
    const fakeStorageProvider = new FakeStorageProvider();

    const updateUserAvatar = new UpdateUserAvatarService(
      fakeUserRepository,
      fakeStorageProvider,
    );

    expect(
      updateUserAvatar.execute({
        user_id: 'non existing user',
        avatarFileName: 'avatar.jpeg',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});

describe('UpdateUserAvatar', () => {
  it('should be able to delete old avatar when updating new one', async () => {
    const fakeUserRepository = new FakeUserRepository();
    const fakeStorageProvider = new FakeStorageProvider();

    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    const updateUserAvatar = new UpdateUserAvatarService(
      fakeUserRepository,
      fakeStorageProvider,
    );

    const name = 'John Doe';
    const email = 'john.doe@email.com';
    const password = '123456';
    const oldAvatarFileName = 'avatar.jpg';
    const newAvatarFileName = 'avatar2.jpg';

    const user = await fakeUserRepository.create({ name, email, password });

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

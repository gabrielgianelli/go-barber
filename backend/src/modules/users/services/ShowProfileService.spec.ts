import AppError from '@shared/errors/AppError';
import FakeUserRepository from '../repositories/fakes/FakeUserRepository';
import ShowProfileService from './ShowProfileService';

let userRepository: FakeUserRepository;
let showProfile: ShowProfileService;

let name: string;
let email: string;
let password: string;

describe('ShowProfile', () => {
  beforeEach(() => {
    userRepository = new FakeUserRepository();
    showProfile = new ShowProfileService(userRepository);

    name = 'John Doe';
    email = 'john.doe@email.com';
    password = '123456';
  });

  it('should be able to show the profile', async () => {
    const user = await userRepository.create({ name, email, password });

    const profile = await showProfile.execute({ user_id: user.id });

    expect(profile.name).toBe(name);
    expect(profile.email).toBe(email);
  });

  it('should not be able to show the profile of a non-existent user', async () => {
    await expect(
      showProfile.execute({ user_id: 'non-existent' }),
    ).rejects.toBeInstanceOf(AppError);
  });
});

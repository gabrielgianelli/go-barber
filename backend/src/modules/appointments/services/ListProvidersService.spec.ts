import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import ListProvidersService from './ListProvidersService';

let usersRepository: FakeUsersRepository;
let fakeCacheProvider: FakeCacheProvider;
let listProviders: ListProvidersService;

let name1: string;
let email1: string;
let password1: string;
let name2: string;
let email2: string;
let password2: string;
let nameUser: string;
let emailUser: string;
let passwordUser: string;

describe('ListProviders', () => {
  beforeEach(() => {
    usersRepository = new FakeUsersRepository();
    fakeCacheProvider = new FakeCacheProvider();
    listProviders = new ListProvidersService(
      usersRepository,
      fakeCacheProvider,
    );

    name1 = 'John Doe';
    email1 = 'john.doe@email.com';
    password1 = '123456';
    name2 = 'Jane Doe';
    email2 = 'jane.doe@email.com';
    password2 = '654321';
    nameUser = 'Myself';
    emailUser = 'myself@email.com';
    passwordUser = 'mememe';
  });

  it('should be able to list the providers', async () => {
    const user1 = await usersRepository.create({
      name: name1,
      email: email1,
      password: password1,
    });

    const user2 = await usersRepository.create({
      name: name2,
      email: email2,
      password: password2,
    });

    const loggedUser = await usersRepository.create({
      name: nameUser,
      email: emailUser,
      password: passwordUser,
    });

    const providers = await listProviders.execute({ user_id: loggedUser.id });

    expect(providers).toEqual([user1, user2]);
  });

  it('should be able to list the providers using cache', async () => {
    const user1 = await usersRepository.create({
      name: name1,
      email: email1,
      password: password1,
    });

    const user2 = await usersRepository.create({
      name: name2,
      email: email2,
      password: password2,
    });

    const loggedUser = await usersRepository.create({
      name: nameUser,
      email: emailUser,
      password: passwordUser,
    });

    let providers = await listProviders.execute({ user_id: loggedUser.id });
    providers = await listProviders.execute({ user_id: loggedUser.id });

    expect(providers).toEqual([user1, user2]);
  });
});

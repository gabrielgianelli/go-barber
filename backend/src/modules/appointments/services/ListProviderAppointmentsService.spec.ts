import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import { getYear } from 'date-fns';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import ListProviderAppointmentsService from './ListProviderAppointmentsService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let fakeCacheProvider: FakeCacheProvider;
let listProviderAppointments: ListProviderAppointmentsService;

let year: number;
let month: number;
let day: number;

let provider_id: string;
let user_id: string;
let date1: Date;
let date2: Date;

describe('ListProviderAppointments', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    fakeCacheProvider = new FakeCacheProvider();
    listProviderAppointments = new ListProviderAppointmentsService(
      fakeAppointmentsRepository,
      fakeCacheProvider,
    );

    year = getYear(new Date()) + 1;
    month = 4;
    day = 25;

    provider_id = 'provider';
    user_id = 'user';
    date1 = new Date(year, month, day, 11);
    date2 = new Date(year, month, day, 14);
  });

  it('should be able to list the appointments on a specific day', async () => {
    const appointment1 = await fakeAppointmentsRepository.create({
      provider_id,
      user_id,
      date: date1,
    });
    const appointment2 = await fakeAppointmentsRepository.create({
      provider_id,
      user_id,
      date: date2,
    });

    const appointments = await listProviderAppointments.execute({
      provider_id,
      year,
      month: month + 1,
      day,
    });

    expect(appointments).toEqual([appointment1, appointment2]);
  });
});

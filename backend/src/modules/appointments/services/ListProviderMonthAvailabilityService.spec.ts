import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import ListProviderMonthAvailabilityService from './ListProviderMonthAvailabilityService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderMonthAvailability: ListProviderMonthAvailabilityService;

let provider_id: string;
let year: number;
let month: number;
let day: number;

describe('ListProviderMonthAvaiability', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    listProviderMonthAvailability = new ListProviderMonthAvailabilityService(
      fakeAppointmentsRepository,
    );

    provider_id = 'user';
    year = 2021;
    month = 4;
    day = 25;
  });

  it('should be able to list the month availability from provider', async () => {
    await fakeAppointmentsRepository.create({
      provider_id,
      date: new Date(year, month, day, 8, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id,
      date: new Date(year, month, day, 9, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id,
      date: new Date(year, month, day, 10, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id,
      date: new Date(year, month, day, 11, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id,
      date: new Date(year, month, day, 12, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id,
      date: new Date(year, month, day, 13, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id,
      date: new Date(year, month, day, 14, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id,
      date: new Date(year, month, day, 15, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id,
      date: new Date(year, month, day, 16, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id,
      date: new Date(year, month, day, 17, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id,
      date: new Date(year, month, day + 1, 10, 0, 0),
    });

    const availability = await listProviderMonthAvailability.execute({
      provider_id,
      year,
      month: month + 1,
    });

    expect(availability).toEqual(
      expect.arrayContaining([
        { day: day - 1, available: true },
        { day, available: false },
        { day: day + 1, available: true },
      ]),
    );
  });
});

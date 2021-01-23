import { getYear } from 'date-fns';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import ListProviderDayAvailabilityService from './ListProviderDayAvailabilityService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderDayAvailability: ListProviderDayAvailabilityService;

let year: number;
let month: number;
let day: number;
let appointmentHour: number;
let currentHour: number;
let provider_id: string;
let user_id: string;

describe('ListProviderDayAvailability', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    listProviderDayAvailability = new ListProviderDayAvailabilityService(
      fakeAppointmentsRepository,
    );

    year = getYear(new Date()) + 1;
    month = 4;
    day = 25;
    appointmentHour = 14;
    currentHour = 11;
    provider_id = 'provider';
    user_id = 'user';
  });

  it('should be able to list the day availability from provider', async () => {
    await fakeAppointmentsRepository.create({
      provider_id,
      user_id,
      date: new Date(year, month, day, appointmentHour),
    });

    jest.spyOn(Date, 'now').mockImplementation(() => {
      return new Date(year, month, day, currentHour).getTime();
    });

    const availability = await listProviderDayAvailability.execute({
      provider_id,
      year,
      month: month + 1,
      day,
    });

    expect(availability).toEqual(
      expect.arrayContaining([
        { hour: 8, available: false },
        { hour: 9, available: false },
        { hour: 10, available: false },
        { hour: 11, available: false },
        { hour: appointmentHour - 1, available: true },
        { hour: appointmentHour, available: false },
        { hour: appointmentHour + 1, available: true },
      ]),
    );
  });
});

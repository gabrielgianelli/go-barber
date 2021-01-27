import FakeNotificationsRepository from '@modules/notifications/repositories/fakes/FakeNotificationsRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import AppError from '@shared/errors/AppError';
import { getYear } from 'date-fns';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let fakeNotificationsRepository: FakeNotificationsRepository;
let fakeCacheProvider: FakeCacheProvider;
let createAppointmentService: CreateAppointmentService;

let provider_id: string;
let user_id: string;
let nextYear: number;
let passedYear: number;
let date: Date;
let passedDate: Date;
let firstHour: number;
let lastHour: number;

describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    fakeNotificationsRepository = new FakeNotificationsRepository();
    fakeCacheProvider = new FakeCacheProvider();

    createAppointmentService = new CreateAppointmentService(
      fakeAppointmentsRepository,
      fakeNotificationsRepository,
      fakeCacheProvider,
    );

    provider_id = 'provider';
    user_id = 'user';
    nextYear = getYear(new Date()) + 1;
    passedYear = getYear(new Date()) - 1;
    date = new Date(nextYear, 4, 25, 10);
    passedDate = new Date(passedYear, 4, 25, 10);
    firstHour = 8;
    lastHour = 17;
  });

  it('should be able to create a new appointment', async () => {
    const appointment = await createAppointmentService.execute({
      provider_id,
      user_id,
      date,
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment).toHaveProperty('date');
    expect(appointment.provider_id).toBe(provider_id);
  });

  it('should not be able to create two appointments on the same time', async () => {
    await createAppointmentService.execute({
      provider_id,
      user_id,
      date,
    });

    await expect(
      createAppointmentService.execute({
        provider_id,
        user_id,
        date,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment on a past date', async () => {
    jest.spyOn(Date, 'now').mockImplementation(() => {
      return date.getTime();
    });

    await expect(
      createAppointmentService.execute({
        provider_id,
        user_id,
        date: passedDate,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment with same user as provider', async () => {
    await expect(
      createAppointmentService.execute({
        provider_id: user_id,
        user_id,
        date,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment before 7am and after 5pm', async () => {
    date.setHours(firstHour - 1);

    await expect(
      createAppointmentService.execute({
        provider_id,
        user_id,
        date,
      }),
    ).rejects.toBeInstanceOf(AppError);

    date.setHours(lastHour + 1);

    await expect(
      createAppointmentService.execute({
        provider_id,
        user_id,
        date,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});

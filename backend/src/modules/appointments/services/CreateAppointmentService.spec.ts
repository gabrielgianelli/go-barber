import AppError from '@shared/errors/AppError';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentService';

describe('CreateAppointment', () => {
  it('should be able to create a new appointment', async () => {
    const fakeAppointmentsRepository = new FakeAppointmentsRepository();
    const createAppointmentService = new CreateAppointmentService(
      fakeAppointmentsRepository,
    );

    const provider_id = '42';
    const date = new Date(2001, 4, 25);
    const appointment = await createAppointmentService.execute({
      provider_id,
      date,
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment).toHaveProperty('date');
    expect(appointment.provider_id).toBe(provider_id);
    // expect(appointment.date).toBe(date);
  });
});

describe('CreateAppointment', () => {
  it('should not be able to create two appointments on the same time', async () => {
    const fakeAppointmentsRepository = new FakeAppointmentsRepository();
    const createAppointmentService = new CreateAppointmentService(
      fakeAppointmentsRepository,
    );

    const provider_id = '42';
    const date = new Date(2001, 4, 25);

    await createAppointmentService.execute({
      provider_id,
      date,
    });

    await expect(
      createAppointmentService.execute({
        provider_id,
        date,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});

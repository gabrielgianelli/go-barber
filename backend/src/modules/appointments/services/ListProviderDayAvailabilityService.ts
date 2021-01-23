import { getHours, isAfter } from 'date-fns';
import { inject, injectable } from 'tsyringe';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface IRequest {
  provider_id: string;
  year: number;
  month: number;
  day: number;
}

type IResponse = Array<{
  hour: number;
  available: boolean;
}>;

@injectable()
export default class ListProviderDayAvailabilityService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) {}

  public async execute({
    provider_id,
    year,
    month,
    day,
  }: IRequest): Promise<IResponse> {
    const appointments = await this.appointmentsRepository.findAllInDayFromProvider(
      {
        provider_id,
        year,
        month,
        day,
      },
    );

    const hourStart = 8;

    const eachHourArray = Array.from(
      { length: 10 },
      (value, index) => index + hourStart,
    );

    const availability = eachHourArray.map(hour => {
      const hasAppointment = appointments.find(
        appointment => getHours(appointment.date) === hour,
      );

      const currentDate = new Date(Date.now());
      const iterationDate = new Date(year, month - 1, day, hour);

      return {
        hour,
        available: !hasAppointment && isAfter(iterationDate, currentDate),
      };
    });

    return availability;
  }
}

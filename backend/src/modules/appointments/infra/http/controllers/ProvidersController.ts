import ListProvidersService from '@modules/appointments/services/ListProvidersService';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

export default class ProvidersController {
  public async index(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;

    const listProvider = container.resolve(ListProvidersService);

    const providers = await listProvider.execute({ user_id });

    return response.json(providers);
  }
}

import IMailTemplateProviderDTO from '../dtos/IMailTemplateProviderDTO';

export default interface IMailTemplateProvider {
  parse(data: IMailTemplateProviderDTO): Promise<string>;
}

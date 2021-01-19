import IMailTemplateProviderDTO from '../../MailTemplateProvider/dtos/IMailTemplateProviderDTO';

interface IMailContact {
  name: string;
  email: string;
}

export default interface ISendMailDTO {
  to: IMailContact;
  from?: IMailContact;
  subject: string;
  templateData: IMailTemplateProviderDTO;
}

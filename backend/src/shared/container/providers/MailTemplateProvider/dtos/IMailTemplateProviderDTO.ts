interface ITemplateVariables {
  [key: string]: string | number;
}

export default interface IMailTemplateProviderDTO {
  file: string;
  variables: ITemplateVariables;
}

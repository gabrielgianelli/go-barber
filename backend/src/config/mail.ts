interface IMailConfig {
  driver: 'ethereal' | 'ses';

  defaults: {
    from: {
      email: string;
      name: string;
    };
  };
}

export default {
  driver: process.env.MAIL_DRIVER,
  defaults: {
    from: {
      email: 'gabrielgianelli@gmail.com',
      name: 'Gabriel Gianelli',
    },
  },
} as IMailConfig;

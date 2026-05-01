import { faker } from '@faker-js/faker';

export const generateTenantData = () => ({
  fullName: faker.person.fullName().replace(/[^A-Za-z ]/g, ''),
  email: faker.internet.email(),
  mobile: faker.helpers.fromRegExp(/[6-9]{1}[0-9]{9}/),
  password: 'Password@123',
});

export const generatePropertyData = () => ({
  title: faker.commerce.productName() + ' Apartment',
  type: 'Apartment',
  rent: faker.number.int({ min: 10000, max: 100000 }),
  advance: faker.number.int({ min: 50000, max: 500000 }),
  area: faker.location.city(),
  description: faker.lorem.paragraph(),
});

export const generateAgentData = () => ({
  fullName: faker.person.fullName(),
  email: faker.internet.email(),
  mobile: faker.string.numeric(10),
  businessName: faker.company.name(),
  reraNumber: 'RERA-' + faker.string.alphanumeric(8).toUpperCase(),
});

import { EuroCurrencyPipe } from './euro-currency.pipe';

describe('EuroCurrencyPipe', () => {
  it('create an instance', () => {
    const pipe = new EuroCurrencyPipe();
    expect(pipe).toBeTruthy();
  });
});

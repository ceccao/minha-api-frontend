import { CurrencyPipe, DatePipe } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { appConfig } from './app.config';

describe('appConfig (idioma pt-BR)', () => {
  beforeEach(() => TestBed.configureTestingModule({ providers: appConfig.providers }));

  it('formata moeda no padrao brasileiro', () => {
    const pipe = TestBed.runInInjectionContext(() => new CurrencyPipe('pt-BR'));

    // O Angular usa espaco sem quebra (U+00A0) entre o simbolo e o valor.
    expect(pipe.transform(450.5, 'BRL')?.replace(/ /g, ' ')).toBe('R$ 450,50');
    expect(pipe.transform(1200, 'BRL')?.replace(/ /g, ' ')).toBe('R$ 1.200,00');
  });

  it('formata data no padrao brasileiro', () => {
    const pipe = new DatePipe('pt-BR');

    expect(pipe.transform(new Date(2026, 9, 28), 'shortDate')).toBe('28/10/2026');
  });
});

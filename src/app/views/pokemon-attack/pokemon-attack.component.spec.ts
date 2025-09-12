/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PokemonAttackComponent } from './pokemon-attack.component';

describe('PokemonAttackComponent', () => {
  let component: PokemonAttackComponent;
  let fixture: ComponentFixture<PokemonAttackComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ PokemonAttackComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PokemonAttackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

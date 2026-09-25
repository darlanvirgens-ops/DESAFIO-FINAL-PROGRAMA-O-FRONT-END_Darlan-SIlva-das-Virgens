import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router'

import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should start with the demonstrative credentials', () => {
    expect(component.email).toBe('nome@empresa.com');
    expect(component.senha).toBe('123456');
  });

  it('should show an error when email and password are empty', () => {
    component.email = '';
    component.senha = '';

    component.onSubmit();

    expect(component.showConfirmModal).toBe(false);
    expect(component.errorMessage).toBe(
      'Por favor, preencha o e-mail e a senha.'
    );
  });

  it('should open the confirmation modal when credentials are filled', () => {
    component.email = 'nome@empresa.com';
    component.senha = '123456';

    component.onSubmit();

    expect(component.errorMessage).toBe('');
    expect(component.showConfirmModal).toBe(true);
  });

  it('should close the confirmation modal when access is cancelled', () => {
    component.showConfirmModal = true;

    component.cancelLogin();

    expect(component.showConfirmModal).toBe(false);
  });
});

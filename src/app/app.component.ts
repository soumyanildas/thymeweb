import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthResponse, AuthService } from './services/auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'thymeweb';

  constructor(
    public authService: AuthService
  ) { }

  ngOnInit(): void {
    this._getToken();
  }

  private _getToken(): void {
    this.authService.getAuthToken({
      username: environment.username,
      stationId: 'string',
      password: environment.password,
      rememberMe: true
    }).subscribe((response: AuthResponse) => {
      this.authService.setToken(response.id_token);
    });
  }

}

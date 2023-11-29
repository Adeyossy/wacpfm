import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './auth.service';
import { FirebaseOptions } from 'firebase/app';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'wacpfm';
  config = new Observable<FirebaseOptions>();

  constructor(private authService: AuthService) {
    // this.authService.getFirebaseConfig$()
  }

  ngOnInit(): void {
    this.config = this.authService.getFirebaseConfig$();
  }
}

import { Injectable } from '@angular/core';
import { Observable, concatMap, from, map } from 'rxjs';
import { User, Auth, getAuth, createUserWithEmailAndPassword, UserCredential } from 'firebase/auth';
import { initializeApp, FirebaseOptions, FirebaseApp } from 'firebase/app'
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // firebaseAuth$: Observable<
  // firebaseUser$: Observable<User>

  constructor(private httpClient: HttpClient) { }

  getFirebaseConfig$(): Observable<FirebaseOptions> {
    return this.httpClient.get('');
  }

  getFirebaseApp$(): Observable<FirebaseApp> {
    return this.getFirebaseConfig$().pipe(map(config => initializeApp(config)));
  }

  getFirebaseAuth$(): Observable<Auth> {
    return this.getFirebaseApp$().pipe(map(app => getAuth(app)));
  }

  getFirebaseUser$(): Observable<User | null> {
    return this.getFirebaseAuth$().pipe(
      concatMap(auth => new Observable<User | null>((observer) => {
        return auth.onAuthStateChanged(
          user => observer.next(user),
          error => observer.error(error),
          () => observer.complete()
        )
      }))
    );
  }

  signUp(email: string, password: string): Observable<UserCredential> {
    return this.getFirebaseAuth$().pipe(
      concatMap(auth => from(createUserWithEmailAndPassword(auth, email, password)))
    );
  }
}

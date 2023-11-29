import { Injectable } from '@angular/core';
import { AsyncSubject, Observable, concatMap, from, map, of } from 'rxjs';
import { User, Auth, getAuth, createUserWithEmailAndPassword, UserCredential, signInWithEmailAndPassword, sendEmailVerification, AuthErrorCodes, sendPasswordResetEmail, signOut } from 'firebase/auth';
import { initializeApp, FirebaseOptions, FirebaseApp } from 'firebase/app'
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // firebaseAuth$: Observable<
  // firebaseUser$: Observable<User>
  backendUrl = "/.netlify/functions";
  asyncSubject = new AsyncSubject<FirebaseOptions>();

  constructor(private httpClient: HttpClient) {
    this.httpClient.get(`${this.backendUrl}/index`).subscribe(this.asyncSubject);
  }

  getFirebaseConfig$(): AsyncSubject<FirebaseOptions> {    
    return this.asyncSubject;
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

  login(email: string, password: string): Observable<UserCredential> {
    return this.getFirebaseAuth$().pipe(
      concatMap(auth => signInWithEmailAndPassword(auth, email, password))
    );
  }

  verifyEmail() {
    return this.getFirebaseUser$().pipe(
      concatMap(user => {
        if(user) {
          return from(sendEmailVerification(user))
        } else throw AuthErrorCodes.INVALID_EMAIL
      })
    )
  }

  resetPassword(email: string) {
    return this.getFirebaseAuth$().pipe(
      concatMap(auth => from(sendPasswordResetEmail(auth, email)))
    )
  }

  signOut() {
    return this.getFirebaseAuth$().pipe(
      concatMap(auth => from(signOut(auth)))
    );
  }
}

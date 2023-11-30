import { Injectable } from '@angular/core';
import { AsyncSubject, Observable, concatMap, from, map, of } from 'rxjs';
import { User, Auth, getAuth, createUserWithEmailAndPassword, UserCredential, signInWithEmailAndPassword, sendEmailVerification, AuthErrorCodes, sendPasswordResetEmail, signOut } from 'firebase/auth';
import { initializeApp, FirebaseOptions, FirebaseApp } from 'firebase/app';
import { Firestore, addDoc, collection, getFirestore } from 'firebase/firestore';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // firebaseAuth$: Observable<
  // firebaseUser$: Observable<User>
  usersCollection = "users";
  updateCourseCollection = "update_courses";
  updateCourseRecordsCollection = "update_course_records";
  paymentsCollection = "payments";
  backendUrl = "/.netlify/functions";
  asyncSubject = new AsyncSubject<FirebaseOptions>();

  constructor(private httpClient: HttpClient) {
    this.httpClient.get(`${this.backendUrl}/index`).subscribe(this.asyncSubject);
  }

  getFirebaseConfig$(): AsyncSubject<FirebaseOptions> {
    if (this.asyncSubject.closed)
      this.httpClient.get(`${this.backendUrl}/index`).subscribe(this.asyncSubject);
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

  getFirestore$(): Observable<Firestore> {
    return this.getFirebaseApp$().pipe(
      map(app => getFirestore(app))
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
    // sendEmailVerification is missing actionCodeSettings
    // users should be able to enter a code to be verified
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

  addDocToCollection(doc: any, collectionName: string) {
    return this.getFirestore$().pipe(
      concatMap(db => addDoc(collection(db, collectionName), doc))
    )
  }
}

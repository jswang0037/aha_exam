import { Injectable } from '@angular/core';

import { Auth, getAuth, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, FacebookAuthProvider, signInWithPopup} from '@firebase/auth';
import { getFirestore, addDoc, collection, getDocs } from '@firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(
  ) { }
  
  auth = getAuth(); 

  getauth(){
    return this.auth; 
  }
  signout(){
    signOut(this.auth).then(() => {
      console.log('Sign-out successful.'); 
    }).catch((error) => {
      console.log(error); 
    }); 
  }
  signin(username: string, password: string){
    return signInWithEmailAndPassword(this.auth, username, password); 
  }
  signup(username: string, password: string){
    return createUserWithEmailAndPassword(this.auth, username, password); 
  }
  singinGoogle(){
    const provider = new GoogleAuthProvider(); 
    return signInWithPopup(this.auth, provider); 
  }
  singinFacebook(){
    const provider = new FacebookAuthProvider(); 
    return signInWithPopup(this.auth, provider); 
  }

  db = getFirestore();  
  addData(username: string, action: string){    
    try {
      addDoc(collection(this.db, "data"), {
        username: username, 
        action: action,
        timestamp: new Date().getTime(),
      });
      //console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }
  async readData(){
    try{
      const data = await getDocs(collection(this.db, "data")); 
      return data
    }catch (e) {
      console.error("Error adding document: ", e);
      return []
    }
  }

}

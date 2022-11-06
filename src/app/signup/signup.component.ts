import { Component, OnInit } from '@angular/core';

//++
import { FirebaseService } from '../services/firebase.service';
import { sendEmailVerification  } from '@firebase/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  constructor(
    private fireservice: FirebaseService, 
    private router: Router
  ) { }

  username: string = ''; 
  password: string = ''; 
  password2: string = ''; 
  info: string = ''; 
  validation: string = ''; 
  valid: boolean = false; 

  check(){
    this.validation = ''; 
    this.valid = true; 
    if(this.username===''){
      this.validation += '\nEmail cannot be empty! '; 
      this.valid = false; 
    }
    if(this.password.length<8){
      this.validation += '\nPassword must contains at least 8 character! '; 
      this.valid = false; 
    }
    if(!RegExp(/[a-z]/).test(this.password)){
      this.validation += '\nPassword must contains at least one lower character! '; 
      this.valid = false; 
    }
    if(!RegExp(/[A-Z]/).test(this.password)){
      this.validation += '\nPassword must contains at least one upper character! '; 
      this.valid = false; 
    }
    if(!RegExp(/[0-9]/).test(this.password)){
      this.validation += '\nPassword must contains at least one digit character! '; 
      this.valid = false; 
    }
    if(!RegExp(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/).test(this.password)){
      this.validation += '\nPassword must contains at least one special character! '; 
      this.valid = false; 
    }
    if(this.password!==this.password2){
      this.validation += '\nPassword not match! '; 
      this.valid = false; 
    }
  }
  mailsignup(){
    this.fireservice.signup(this.username, this.password).then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
      this.info = 'Sign Up Completed! Please check the verification mail. ' + user.email; 
      const actionCodeSettings = {
        url: 'https://app03-jswang.firebaseapp.com/login'
      };
      sendEmailVerification(user, actionCodeSettings); 

      // Log Singup History
      console.log(user, user.email); 
      if(user!=null&&user.email!=null){
        this.fireservice.addData(user.email, "signup"); 
      }

      this.fireservice.signout(); 
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      this.info = 'Error! ' + errorMessage; 
    }); 
  }
  signinGoogle(){
    this.fireservice.singinGoogle().then((userCredential) => {
      const user = userCredential.user;  

      // Log Singup History
      console.log(user, user.email); 
      if(user!=null&&user.email!=null){
        this.fireservice.addData(user.email, "signup"); 
      }
      
      this.redirect(); 
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      this.info = 'Error! ' + errorMessage; 
    }); 
  }
  signinFacebook(){    
    this.fireservice.singinFacebook().then((userCredential) => {
      const user = userCredential.user;

      // Log Singup History
      console.log(user, user.email); 
      if(user!=null&&user.email!=null){
        this.fireservice.addData(user.email, "signup"); 
      }

      this.redirect(); 
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      this.info = 'Error! ' + errorMessage; 
    }); 
  }
  redirect(){    
    const auth = this.fireservice.getauth(); 
    const user = auth.currentUser; 
    if(user==null){
      console.log('not login, stay in current. '); 
    }else if(user.emailVerified){
      console.log('already login, redirect to login page. ');    
      this.router.navigate(['/login']); 
    }else{
      this.router.navigate(['/welcome'])
    }
  }
  ngOnInit(): void {    
    const timeout = 500; 

    setTimeout(() => {      
      this.redirect(); 
    }, timeout);
  }

}

import { Component, OnInit } from '@angular/core';

//++
import { FirebaseService } from '../services/firebase.service';
import { Router } from '@angular/router';
import { sendEmailVerification } from '@angular/fire/auth';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {

  constructor(
    public fireservice: FirebaseService, 
    private router: Router
  ) { }

  username: string = ''; 
  password: string = ''; 
  info: string = ''; 


  signinMail(){
    this.fireservice.signin(this.username, this.password).then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
      if(user.emailVerified){
        // Log Singup History
        console.log(user, user.email); 
        if(user!=null&&user.email!=null){
          this.fireservice.addData(user.email, "signin"); 
        }
        
        this.redirect(); 
      }else{
        this.info = "Please check the varication mail first! "; 
        this.fireservice.signout(); 
      }
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
        this.fireservice.addData(user.email, "signin"); 
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
        this.fireservice.addData(user.email, "signin"); 
      }

      this.redirect(); 
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      this.info = 'Error! ' + errorMessage; 
    }); 
  }
  sendVerificationMail(){
    this.fireservice.signin(this.username, this.password).then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
      const actionCodeSettings = {
        url: 'https://app03-jswang.firebaseapp.com/login'
      };
      sendEmailVerification(user, actionCodeSettings); 
      this.info = "Verificatino mail sent! "; 
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
    }else{
      console.log('already login, redirect to login page. ');  
      this.router.navigate(['/login']); 
    }
  }

  ngOnInit(): void {
    const timeout = 500; 

    setTimeout(() => {      
      this.redirect(); 
    }, timeout);
  }

}

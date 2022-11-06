import { Component, OnInit } from '@angular/core';

//++
import { FirebaseService } from '../services/firebase.service';
import { Router } from '@angular/router';
import { updateProfile, updatePassword } from '@angular/fire/auth';
import { QuerySnapshot } from '@angular/fire/firestore';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(
    private fireservice: FirebaseService, 
    private router: Router
  ) { }

  displayName: string|null = ''; 
  info: string = ''; 
  newDisplayName: string = ''; 
  validation: string = ''; 
  valid: boolean = false; 
  oldPassword: string = ''; 
  newPassword: string = ''; 
  newPassword2: string = ''; 

  userSignup: number = 0; 
  userToday: number = 0; 
  userWeek: number = 0; 

  signup: string = ''; 
  signupTimestamp: number = 0; 
  lastSession: string = ''; 
  lastSessionTimestamp: number = 0; 
  logNumber: number = 0; 

  
  signout(){
    this.fireservice.signout(); 
    this.router.navigate(['/welcome']); 
  }

  redirect(){    
    const auth = this.fireservice.getauth(); 
    const user = auth.currentUser; 
    if(user==null){
      console.log('not login, redirect to welcome page. ')
      this.router.navigate(['/welcome']); 
    }else if(user.emailVerified||(user.photoURL?.includes('facebook'))||(user.photoURL?.includes('google'))){
      this.displayName = user.displayName; 
    }else{
      alert("Please check the verification mail first! "); 
      this.fireservice.signout(); 
      this.router.navigate(['/welcome']); 
    }
  }

  updateDisplayName(){
    const auth = this.fireservice.getauth(); 
    const user = auth.currentUser; 
    const config = {
      displayName: this.newDisplayName
    }; 
    if(user!=null){
      updateProfile(user, config).then(() =>{
        // Profile updated!
        this.router.navigate(['/welcome']); 
      }).catch(()=>{
        // An error occurred
      }); 
    }
  }

  check(){
    this.validation = ''; 
    this.valid = true; 
    if(this.newPassword.length<8){
      this.validation += '\nPassword must contains at least 8 character! '; 
      this.valid = false; 
    }
    if(!RegExp(/[a-z]/).test(this.newPassword)){
      this.validation += '\nPassword must contains at least one lower character! '; 
      this.valid = false; 
    }
    if(!RegExp(/[A-Z]/).test(this.newPassword)){
      this.validation += '\nPassword must contains at least one upper character! '; 
      this.valid = false; 
    }
    if(!RegExp(/[0-9]/).test(this.newPassword)){
      this.validation += '\nPassword must contains at least one digit character! '; 
      this.valid = false; 
    }
    if(!RegExp(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/).test(this.newPassword)){
      this.validation += '\nPassword must contains at least one special character! '; 
      this.valid = false; 
    }
    if(this.newPassword!==this.newPassword2){
      this.validation += '\nPassword not match! '; 
      this.valid = false; 
    }
    const auth = this.fireservice.getauth(); 
    const user = auth.currentUser; 
  }
  updatePassword(){
    const auth = this.fireservice.getauth(); 
    const user = auth.currentUser; 
    if(user!=null){
      if(user.email!=null){
        this.fireservice.signin(user.email, this.oldPassword).then((userCredential) => {         
          updatePassword(userCredential.user, this.newPassword).then(() =>{
            // Profile updated!
            alert("Signin with new password next time! "); 
          }).catch((error)=>{
            // An error occurred
            console.log(error.message); 
          }); 
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          this.validation = 'Error! Old password is not correct! '
        });
      }
    }
  }
  async updateUserData(){    
    const auth = this.fireservice.getauth(); 
    const user = auth.currentUser; 

    const data = await this.fireservice.readData(); 
    this.signupTimestamp = 0; 
    this.logNumber = 0; 
    this.lastSessionTimestamp = 0; 
    const userSignupList: string[] = []; 
    const userTodayList: string[] = []; 
    const userWeekList: string[] = []; 

    data.forEach(element => {
      // User Statistic
      if(!userSignupList.includes(element.data()['username'])){
        userSignupList.push(element.data()['username']); 
        
      }
      if(element.data()['timestamp'] > (new Date().getTime()-86400*1000) && !userTodayList.includes(element.data()['username'])){
        userTodayList.push(element.data()['username']);         
      }
      if(element.data()['timestamp'] > (new Date().getTime()-86400*1000*7) && !userWeekList.includes(element.data()['username'])){
        userWeekList.push(element.data()['username']);         
      }
      
      this.userSignup = userSignupList.length; 
      this.userToday = userTodayList.length; 
      this.userWeek = userWeekList.length; 



      // User Database Dashboard
      if(element.data()['username']===user?.email){        
        if(element.data()['action']==='signup'){
          this.signupTimestamp = element.data()['timestamp']; 
        }
        this.logNumber += 1; 
        this.lastSessionTimestamp = Math.max(this.lastSessionTimestamp, element.data()['timestamp']); 
      }
      this.signup = this.signupTimestamp.toString() + ' (' + new Date(this.signupTimestamp) +  ')'; 
      this.lastSession = this.lastSessionTimestamp.toString() + ' (' + new Date(this.lastSessionTimestamp) +  ')'; 
    });
  }

  ngOnInit(): void {
    const timeout = 500; 

    setTimeout(() => {      
      this.redirect(); 
      this.updateUserData(); 
    }, timeout);    
    
    this.updateUserData(); 
  }

}

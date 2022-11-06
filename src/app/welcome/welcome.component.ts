import { Component, OnInit } from '@angular/core';

//++
import { FirebaseService } from '../services/firebase.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {

  constructor(
    private fireservice: FirebaseService, 
    private router: Router
    ) { }

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

import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NotificationService } from '../../shared/notification.service';
import { CommonService } from 'src/services/common.service';
import { faUser, faKey } from '@fortawesome/free-solid-svg-icons';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { IS_CHANGE_PASS } from 'src/app/auth/changepass.guard';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginform:FormGroup;
  submitted:boolean=false;
  faUser = faUser;
  faKey = faKey;
  @Output() isloggedin=new EventEmitter<any>();

  constructor(private commonservice:CommonService,private formbuilder : FormBuilder,public notification :NotificationService,private cookie:CookieService,private router: Router) { }

  ngOnInit() {
    this.loginform=this.formbuilder.group({
      username:['',Validators.required],
      password:['',Validators.required],
    })
    // this.commonservice.putmethod().subscribe(data=>{
    //   console.log(data)
    // })
  }
  get f() { return this.loginform.controls; }
  onSubmit(){
    this.submitted = true;
    // stop here if form is invalid
    if (this.loginform.invalid) {
      this.notification.error('Please Fill the Credentials');
      return;
    }
    this.commonservice.login(this.loginform.value).subscribe(
      data => {
        // console.log(data)
        if(data.description.status=="Success"){
          // this.loginform.reset();
          this.cookie.set( 'charlie', data.response.AuthToken );
          // this.notification.success(data.description.result);
          this.isloggedin.emit(true);
          localStorage.setItem(IS_CHANGE_PASS, data.isChangePwd);
          if(data.isChangePwd==1){ 
            this.setDefaultstake();
            this.router.navigateByUrl("/changepassword");
          }else{
            this.router.navigateByUrl("/home");
          }
        }else{
          this.notification.error(data.description.result);
        }
      }
    );
  }
  tokencheck(){
    var value=this.cookie.get('charlie');
  }
  setDefaultstake(){
    let stakedaata={
          "stake1":50,
          "stake2":100,
          "stake3":500,
          "stake4":1000,
          "stake5":2000,
          "stake6":5000,
          "stake7":7000,
          "stake8":10000,
        }
    this.commonservice.SaveBetStakeSetting(stakedaata).subscribe(resp=>{
      if(resp.status){
        this.notification.success(resp.result);
      }else{
        this.notification.error(resp.result);
      }
    })
}

}

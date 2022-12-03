import { Component , OnInit, ElementRef} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { fromEvent,  takeUntil,skipUntil } from 'rxjs';
// import custom validator to validate that password and confirm password fields match
import {MustMatch}  from './_helpers/must-match.validator';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
  
})
export class AppComponent  implements OnInit{
  title = 'automatic-captcha';
  constructor(private formBuilder: FormBuilder,private _el: ElementRef) { }
  isDisabled=true;
  submitted = false;
  public registerForm: FormGroup;
  mousedown$: any;
  mousehold$: any;
  lastx: number;
  lasty: number;
  x: number;
  y: number;
  numOfClicks: number;
  sub: any;
  box: any;
    ngOnInit() {

      this.numOfClicks= 0;
        this.registerForm = this.formBuilder.group({
            title: ['', Validators.required],
            firstName: ['test', Validators.required],
            lastName: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]],
            confirmPassword: ['', Validators.required],
            acceptTerms: [false, Validators.requiredTrue]
        }, {
            validator: MustMatch('password', 'confirmPassword')
        });
        
        this.mousedown$ = fromEvent(this._el.nativeElement, 'mousedown');
        this.mousedown$.subscribe((e) => {
          this.x = e.x;
          this.y = e.y;
          console.log('clicked');
          console.log(this.x,this.y);
          
          if(this.lastx!=this.x||this.lasty!=this.y){
            this.numOfClicks++;
          }
          if(this.numOfClicks>6){
            this.isDisabled=false;
          }
          this.lastx=e.x;
          this.lasty=e.y;
          console.log(this.numOfClicks);
        })
        
        
       
       
    }

    // convenience getter for easy access to form fields
    get f() { return this.registerForm.controls; }
    unsub() {
      if(this.sub) {
        this.sub.unsubscribe();
      }
    }
    onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.registerForm.invalid) {
            return;
        }

        // display form values on success
        alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.registerForm.value, null, 4));
    }

    onReset() {
        this.submitted = false;
        this.registerForm.reset();
    }
    
}

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {

  details = {
    address: 'Home: 123Abc St, Toronto',
    phone: '4124445678',
    email: 'somebody@gmail.com'
  }
  constructor() { }

  ngOnInit() {
  }

}

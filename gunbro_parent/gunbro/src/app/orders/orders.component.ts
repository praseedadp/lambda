import { Component, OnInit } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import { JwtHelper } from 'angular2-jwt/angular2-jwt';
import { DemoService } from '../demo-component/demo.service';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import * as constant from '../shared/config';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  orderDetails: any;
  results: any;
  selectedOrder : any;
  showOrderDetails : boolean = false;
  check : any;
  
  constructor(public demoService: DemoService, private http: Http, private router: Router) {}

  ngOnInit() {
      this.listOrders().subscribe((response) => {
              console.log("response : " + JSON.stringify(response));
          },
          (err) => console.error(err)
      );
  }

  //Method for listing Order list
  listOrders(): Observable < any > {
      return Observable.create(observer => {
          return this.demoService.getSessionToken().subscribe((response) => {
              if (response.getIdToken().getJwtToken()) {
                  const jwt = response.getIdToken().getJwtToken();
                  let headers = new Headers({ 'Authorization': jwt });
                  let options = new RequestOptions({ headers: headers });
                  let req_body = {
                      "BuyerID": "1"
                  };
                  const url = 'https://api.appcohesion.io/orderList';
                  this.http.post(url, req_body, options).subscribe(data => {
                    this.demoService.loading = false;
                      this.results = data.json();
                      if(this.results && this.results.statusCode){
                          if (this.results.statusCode == 2000) {
                          this.orderDetails = this.results.data;
                          } else if (this.results.statusCode == constant.statusCode.empty_code) {
                          this.orderDetails = [];
                          }
                      }
                      observer.next(this.orderDetails);
                      observer.complete();
                  });
              }
          });
      }, err => {
          console.log("error on order", err)
      })
   }

   viewOrderDetails($event: any){
     this.showOrderDetails = true;
     this.selectedOrder = {};
    for(var i = 0; i < this.orderDetails.length; i++){
        if(this.orderDetails[i].OrderID == $event){
            this.selectedOrder.OrderID = this.orderDetails[i].OrderID ? this.orderDetails[i].OrderID:'';
            this.selectedOrder.CustomerPrice = this.orderDetails[i].CustomerPrice ? this.orderDetails[i].CustomerPrice : '';
            this.selectedOrder.Phone = this.orderDetails[i].Phone ? this.orderDetails[i].Phone : '';
            this.selectedOrder.FFL =  this.orderDetails[i].FFL ? this.orderDetails[i].FFL : '';
            this.selectedOrder.order_status = this.orderDetails[i].order_status ? this.orderDetails[i].order_status : '';
            this.selectedOrder.ConsumerName = this.orderDetails[i].ConsumerName ? this.orderDetails[i].ConsumerName : '';
            this.selectedOrder.address = this.orderDetails[i].ShipToCity + ',' + this.orderDetails[i].ShipToState + ',' + this.orderDetails[i].ShipToPostalCode;
            this.selectedOrder.Quantity = this.orderDetails[i].Quandity ? this.orderDetails[i].Quandity : 0;
            this.selectedOrder.OrderPlacedDate = this.orderDetails[i].OrderPlacedDate ? this.orderDetails[i].OrderPlacedDate : '';
            this.selectedOrder.tracking = this.orderDetails[i].tracking ? this.orderDetails[i].tracking : '';
            this.selectedOrder.service = this.orderDetails[i].service ? this.orderDetails[i].service : '';

            this.selectedOrder.arrival = this.orderDetails[i].arrival ? this.orderDetails[i].arrival : '';
            this.selectedOrder.ProductName = this.orderDetails[i].ProductName && this.orderDetails[i].ProductName!='null' ? this.orderDetails[i].ProductName : '';
            this.selectedOrder.msrp = this.orderDetails[i].msrp ? this.orderDetails[i].msrp : '';
            this.selectedOrder.manufacturer = this.orderDetails[i].manufacturer ? this.orderDetails[i].manufacturer : '';
            this.selectedOrder.part = this.orderDetails[i].part ? this.orderDetails[i].part : '';
            this.selectedOrder.email = this.orderDetails[i].email ? this.orderDetails[i].email : '';
        }
     }
   }

   closeOrderList(){
       console.log("inside close order");
    this.showOrderDetails = false;
   }
}
import { Component, OnInit } from '@angular/core';
import { DashboardComponentComponent } from '../dashboard-component/dashboard-component.component';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { DemoService } from '../demo-component/demo.service';

@Component({
  selector: 'app-product-search',
  templateUrl: './product-search.component.html',
  styleUrls: ['./product-search.component.css']
})

export class ProductSearchComponent implements OnInit {
	public details: any;
	public resultssearch :any;
	public sub :any;
	public page :any;
  	constructor(public dashboardComponent: DashboardComponentComponent,private route: ActivatedRoute,private router: Router, public demoService: DemoService) { 
  		this.resultssearch = this.details;
  	} 	
  	ngOnInit() {
		let param1 = this.route.snapshot.queryParams["wildcard"];
		if(param1)	
			return this.demoService.getSessionToken().subscribe((response) => {
			  if (response.getIdToken().getJwtToken()) {
				const jwt = response.getIdToken().getJwtToken();
				this.demoService.productSearchfromService("wildcard", param1, jwt, "");	
			  }
			}, (err) => {
			  console.log(err);
			});		  
  	} 	
  	productDetail(detail) {
  		this.demoService.setProductDetails(detail);
		  this.resultssearch = detail;
		  console.log(this.resultssearch);
		  //this.router.navigate(['/dashboard/productdetail']);
		  this.router.navigate(['/dashboard/productdetail'], {
			queryParams: detail
		});
		  
  	}
}

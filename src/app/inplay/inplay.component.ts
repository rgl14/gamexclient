import { Component, OnInit, OnDestroy } from '@angular/core';
import { SharedataService } from '../sharedata.service';
import { DataFormatService } from '../data-format.service';
import { Subscription } from 'rxjs';
import { CommonService } from 'src/services/common.service';
import { Router } from '@angular/router';
import { NotificationService } from '../shared/notification.service';
import { GridOptions } from 'ag-grid-community';


@Component({
  selector: 'app-inplay',
  templateUrl: './inplay.component.html',
  styleUrls: ['./inplay.component.scss']
})


export class InplayComponent implements OnInit,OnDestroy {
  
  datahighlightwise: any;
  inplayData: any=[];
  upcomingEvents: any=[];
  inplaydatanavigation: Subscription;

  // swipe
  selectedIndex = 0;
  tabs = 3; 
  date: Date;
  fromdate: string;
  todate: string;
  pnlData: any=[];

  betsTable: any;

  showRecentList: boolean = true;
  totalPNL: any;
  constructor(
    private commonservice:CommonService,
    private sharedata:SharedataService,
    private dataformat:DataFormatService,
    public notification :NotificationService,
    private router: Router) { 
      this.betsTable = {};
    }

  ngOnInit() {
    this.sharedata.userdatasource.subscribe(resp=>{
      if(resp!=null){
        // console.log(resp)
        // this.datahighlightwise=this.dataformat.NavigationFormat(resp.sportsData);
        // this.inplayData=this.dataformat.inplaylistwise(this.datahighlightwise,0)
        // this.upcomingEvents=this.dataformat.inplaylistwise(this.datahighlightwise,1)
        // console.log(this.inplayData)
      }
    })

    this.inplaydatanavigation=this.dataformat.navigationSource.subscribe(resp=>{
      if (resp) {
        this.inplayData=this.dataformat.inplaylistwise(resp,0);
        this.upcomingEvents=this.dataformat.inplaylistwise(resp,1);
      }
    })

        var days = 7;
        var date = new Date();
        var last = new Date(date.getTime() - (days * 24 * 60 * 60 * 1000));
        this.date = last
        this.fromdate = this.date.getFullYear() + "-" + (this.date.getMonth() + 1) + "-" + (this.date.getDate()) + " 00:00:00";
        this.todate = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " 23:59:00";
        let pnldates={
          "fromdate":this.fromdate,
          "todate":this.todate
        }
    this.commonservice.marketprofitloss(pnldates).subscribe(resp =>{
      this.pnlData=resp.data;
      // console.log(this.pnlData)
    })
  }
  appcharge(SportbfId,TourbfId,matchId,marketId,mtBfId,bfId){
    this.router.navigateByUrl('/fullmarket/'+SportbfId+'/'+TourbfId+'/'+matchId+'/'+marketId+'/'+mtBfId+'/'+bfId);
    // this.commonservice.AppCharges(matchId).subscribe(resp=>{
    //   console.log(resp);
    //   if(resp.status=="Success"){
    //     this.router.navigateByUrl('/fullmarket/'+SportbfId+'/'+TourbfId+'/'+matchId+'/'+marketId+'/'+mtBfId+'/'+bfId);
    //   }else{
    //     this.notification.error(resp.result);
    //   }
    // })
  }
  onSwipe($event) {}
  tabChange($event) {}
  identify(index,item){
    //do what ever logic you need to come up with the unique identifier of your item in loop, I will just return the object id.
    return item.marketId;
   }
   Index(index,item){
    //do what ever logic you need to come up with the unique identifier of your item in loop, I will just return the object id.
    return index;
   }

  showBetsTable(pnlData) {
    this.showRecentList = !this.showRecentList;
    this.betsTable = pnlData;
    this.betsTable.matchName = pnlData.market.split('>')[1];
    this.totalPNL=this.betsTable.pnl;
    // console.log(pnlData);
    
  }

  filterSport(sport: string, pnlData) {
    return pnlData.market.split('>')[0].trim().toLowerCase() === sport;
  }

  getStatus(pnl) {
    return parseInt(pnl) >= 0? 'Profit': 'Loss';
  }

  trackById(index, item) {
    return item.id;
  }

  goToOrbitX(event) {
    window.open("http://newclient.duoexchange.com", "_blank");
  }

  ngOnDestroy(){
    this.inplaydatanavigation.unsubscribe();
  }

}

import { AfterViewChecked, Component, OnInit } from '@angular/core';
declare let gsap: any;
@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit, AfterViewChecked {
  scriptElem!: HTMLScriptElement;
  constructor() {
    this.scriptElem = document.createElement('script');
    this.scriptElem.src = "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.3/TextPlugin.min.js";
    document.body.appendChild(this.scriptElem);
  }
  ngOnInit(): void {
  }
  ngAfterViewChecked(): void {
    gsap.to(".init", { duration: 0.5, text: "" });
    gsap.to(".urban", { duration: 0.5, text: "Urban" }, "+=0.2");
    gsap.to(".exchange", { duration: 0.5, text: "Exchange" }, "+=0.2");
    gsap.to(".uex", { rotation: 720, x: 420, duration: 0.5 }, "+=0.2");
    gsap.to(".caption", { duration: 0.25, text: "Your P2P Marketplace" }, "+=0.2");
  }
}

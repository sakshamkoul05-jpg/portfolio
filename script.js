const websites = [
  {name:"Pahad Organics", url:"https://pahadorganics.vercel.app", desc:"Himalayan organic store — 32 products, online ordering + payments", emoji:"🏔️", badge:"live"},
  {name:"MV Homes", url:"https://mvhomes.in", desc:"South Delhi real-estate — property listings", emoji:"🏠", badge:"live"},
  {name:"Stepping Stones ELC", url:"https://steppingstoneselc.com.au", desc:"Sydney childcare centres — also our Meta & Google Ads client", emoji:"🧸", badge:"live"},
  {name:"Doodhvale Farms Shop", url:"https://shop.doodhvalefarms.com", desc:"Dairy e-commerce store", emoji:"🥛", badge:"team"},
  {name:"Guleri", url:"https://guleri.com", desc:"Ethnic wear brand store", emoji:"👗", badge:"live"},
  {name:"GARUDA_SS", url:"https://garuda-ss.com", desc:"Fashion label", emoji:"🦅", badge:"live"},
  {name:"PROUT Journal", url:"https://proutjournal.com", desc:"Journal / publication platform", emoji:"📰", badge:"live"},
  {name:"The Vedara", url:"https://vedara-f-tau.vercel.app", desc:"Retreat stay in Jibhi, Himachal", emoji:"🌲", badge:"live"},
  {name:"PAHAD Trust", url:"https://pahadtrust.org", desc:"NGO / trust website", emoji:"🤝", badge:"live"},
  {name:"Dashmesh Traders", url:"https://dashmeshtraders.com", desc:"Punjab agriculture trading", emoji:"🌾", badge:"live"},
  {name:"Jibhi Adventure", url:"https://jibhiadventure.com", desc:"Adventure travel, Jibhi valley", emoji:"⛰️", badge:"live"},
  {name:"LAWFIC", url:"https://lawfic.pro", desc:"Legal services platform for businesses", emoji:"⚖️", badge:"live"},
  {name:"Kashmir Cultural", url:"https://kashmircultural.in", desc:"Kashmir Cultural Trust — shipped project", emoji:"🎭", badge:"shipped"},
  {name:"Kora House", url:"https://korahouse.in", desc:"Boutique homestay, McLeodganj", emoji:"🏡", badge:"live"}
];
const apps = [
  {name:"Doodhvale", url:"https://play.google.com/store/apps/details?id=com.technologies.subtlelabs.doodhvale", desc:"Dairy delivery app, live on Google Play", emoji:"🥛", badge:"team"},
  {name:"Krishna Ayurveda", url:"https://play.google.com/store/apps/details?id=app.krishnaayurveda.android", desc:"Ayurveda products app, live on Google Play", emoji:"🌿", badge:"play"},
  {name:"Cafe Desire", url:"https://play.google.com/store/apps/details?id=co.shopney.cafedesireonlinecom", desc:"Café ordering app, live on Google Play", emoji:"☕", badge:"play"},
  {name:"Solihull SAP", url:"https://play.google.com/store/apps/details?id=co.shopney.solihullsapp", desc:"Business app, live on Google Play", emoji:"💼", badge:"play"}
];
const badgeMap = {
  live:'<span class="badge badge-live">● Live</span>',
  team:'<span class="badge badge-team">Team project</span>',
  play:'<span class="badge badge-play">Google Play</span>',
  shipped:'<span class="badge badge-team">Shipped</span>'
};
function render(list, el){
  document.getElementById(el).innerHTML = list.map(p => `
    <a class="card tilt reveal" href="${p.url}" target="_blank" rel="noopener">
      ${badgeMap[p.badge] || ""}
      <span class="emoji">${p.emoji}</span>
      <h3>${p.name}</h3>
      <p>${p.desc}</p>
      <span class="visit">Visit →</span>
    </a>`).join("");
}
render(websites, "websiteGrid");
render(apps, "appGrid");

/* Cursor glow (desktop only) */
const glow = document.getElementById("cursorGlow");
if (window.matchMedia("(hover:hover) and (min-width:769px)").matches){
  window.addEventListener("pointermove", e => { glow.style.left = e.clientX + "px"; glow.style.top = e.clientY + "px"; });
} else { glow.style.display = "none"; }

/* Card spotlight + tilt */
document.querySelectorAll(".card").forEach(card => {
  card.addEventListener("pointermove", e => {
    const r = card.getBoundingClientRect();
    const x = e.clientX - r.left, y = e.clientY - r.top;
    card.style.setProperty("--mx", (x / r.width * 100) + "%");
    card.style.setProperty("--my", (y / r.height * 100) + "%");
    if (window.matchMedia("(hover:hover)").matches){
      const rx = ((y / r.height) - .5) * -7, ry = ((x / r.width) - .5) * 7;
      card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
    }
  });
  card.addEventListener("pointerleave", () => { card.style.transform = ""; });
});

/* GSAP reveals + counters, with graceful fallback */
function showAll(){ document.querySelectorAll(".reveal").forEach(el => el.style.opacity = 1); }
if (window.gsap && window.ScrollTrigger){
  gsap.registerPlugin(ScrollTrigger);
  gsap.utils.toArray(".reveal").forEach((el, i) => {
    gsap.fromTo(el, {y: 44, opacity: 0}, {
      y: 0, opacity: 1, duration: .9, ease: "power3.out",
      delay: (i % 4) * 0.06,
      scrollTrigger: {trigger: el, start: "top 88%", once: true}
    });
  });
  document.querySelectorAll(".counter").forEach(c => {
    const target = +c.dataset.target;
    ScrollTrigger.create({
      trigger: c, start: "top 92%", once: true,
      onEnter: () => gsap.fromTo(c, {innerText: 0}, {innerText: target, duration: 1.6, snap: {innerText: 1}, ease: "power2.out"})
    });
  });
} else {
  showAll();
  document.querySelectorAll(".counter").forEach(c => c.textContent = c.dataset.target);
}

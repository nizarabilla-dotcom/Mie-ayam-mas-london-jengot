window.__londoOK = true;   // penanda: script.js berhasil dimuat
/* ===== 1. PENGATURAN ===== */
const WA_NUMBER = "62881023110921";   // ganti dengan nomor WhatsApp warung (format 62...)
const FOTO_UTAMA = "img/hero.jpg";   // foto besar di bagian atas (opsional)
const ONGKIR = 10000;                // biaya antar (isi 0 jika ongkir ditanggung resto)

/* metode pembayaran. untuk = tersedia saat "antar" dan/atau "ambil". {total} diganti total pesanan.
   Nomor rekening dan e-wallet di bawah hanya contoh, ganti dengan milik resto. */
const PEMBAYARAN = [
  {id:"cod", nama:"Bayar di tempat (COD)", untuk:["antar"], info:"Bayar tunai ke kurir saat pesanan tiba. Siapkan uang sejumlah {total}."},
  {id:"transfer", nama:"Transfer bank", untuk:["antar","ambil"], info:"BCA 1234567890 a.n. Mie Ayam Mas Londo Jenggot. Kirim bukti transfer lewat WhatsApp. Total: {total}."},
  {id:"qris", nama:"QRIS", untuk:["antar","ambil"], info:"Kode QRIS dikirim admin lewat WhatsApp setelah pesanan dikonfirmasi. Total: {total}."},
  {id:"ewallet", nama:"E-wallet (GoPay, OVO, DANA)", untuk:["antar","ambil"], info:"Kirim ke nomor 0812-3456-7890 a.n. Mie Ayam Mas Londo Jenggot. Total: {total}."},
  {id:"kasir", nama:"Bayar di resto", untuk:["ambil"], info:"Bayar tunai atau QRIS di kasir saat mengambil pesanan. Total: {total}."}
];
let bayar = "cod";   // metode yang sedang dipilih

/* ulasan pelanggan (contoh). Ganti dengan ulasan asli, bintang 1 sampai 5. */
const TESTI = [
  {nama:"Rina", area:"Batununggal", menu:"Mie Ayam Komplit", bintang:5, teks:"Mie-nya kenyal dan porsinya pas. Bakso di mie ayam komplit juga enak. Pesan lewat WhatsApp gampang."},
  {nama:"Dimas", area:"Lengkong", menu:"Mie Ayam Bakso", bintang:5, teks:"Pesan COD jadi tenang, bayar saat mie sampai. Pengantarannya cepat dan mie masih hangat."},
  {nama:"Sari", area:"Kiaracondong", menu:"Pangsit Goreng", bintang:4, teks:"Pangsit gorengnya renyah, cocok jadi teman makan mie. Sambalnya pas."},
  {nama:"Bagas", area:"Antapani", menu:"Es Kopi Susu Gula Aren", bintang:5, teks:"Es kopi susunya segar dan tidak terlalu manis. Cocok diminum setelah makan mie."},
  {nama:"Bu Yanti", area:"Buahbatu", menu:"Mie Ayam Original", bintang:5, teks:"Porsinya pas untuk makan bareng keluarga. Semua pesanan lengkap dan rapi."},
  {nama:"Fikri", area:"Cicendo", menu:"Bakso Kuah", bintang:4, teks:"Kuah baksonya hangat dan bumbunya terasa. Admin ramah dan cepat membalas."}
];

/* ===== ULASAN: contoh TESTI + ulasan baru yang ditulis pengunjung (tersimpan di browser mereka) ===== */
let ULASAN = [];
try { ULASAN = JSON.parse(localStorage.getItem("ulasan-londo") || "[]"); } catch(e){}
function esc(s){ return String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c])); }
function simpanUlasan(){ try { localStorage.setItem("ulasan-londo", JSON.stringify(ULASAN)); return true; } catch(e){ return false; } }
function semuaUlasan(){ return TESTI.concat(ULASAN); }

/* ===== 2. DATA MENU: tambah atau ubah menu di sini ===== */
const MENU = [
  /* foto = lokasi file foto di folder img/. Ganti file dengan nama yang sama untuk mengganti foto. */
  {id:1, name:"Mie Ayam Original", cat:"Mie Ayam", price:15000, desc:"Mie kenyal, ayam cincang berbumbu, sawi, dan bawang goreng.", foto:"img/mie-ayam-original.jpg"},
  {id:2, name:"Mie Ayam Bakso", cat:"Mie Ayam", price:20000, desc:"Mie ayam dengan tiga bakso sapi.", badge:"Terlaris", foto:"img/mie-ayam-bakso.jpg"},
  {id:3, name:"Mie Ayam Pangsit", cat:"Mie Ayam", price:20000, desc:"Mie ayam dengan pangsit goreng yang renyah.", foto:"img/mie-ayam-pangsit.jpg"},
  {id:4, name:"Mie Ayam Jamur", cat:"Mie Ayam", price:19000, desc:"Mie ayam dengan tumisan jamur berbumbu kecap.", foto:"img/mie-ayam-jamur.jpg"},
  {id:5, name:"Mie Ayam Komplit", cat:"Mie Ayam", price:25000, desc:"Mie ayam dengan bakso dan pangsit goreng sekaligus.", badge:"Favorit", foto:"img/mie-ayam-komplit.jpg"},
  {id:6, name:"Bakso Kuah", cat:"Mie Ayam", price:18000, desc:"Bakso sapi, mie, dan sayuran dalam kuah kaldu hangat.", foto:"img/bakso-kuah.jpg"},
  {id:7, name:"Pangsit Goreng", cat:"Camilan", price:12000, desc:"Pangsit isi ayam, digoreng renyah dengan saus sambal.", foto:"img/pangsit-goreng.jpg"},
  {id:8, name:"Tahu Crispy", cat:"Camilan", price:10000, desc:"Tahu goreng tepung, disajikan dengan sambal kacang.", foto:"img/tahu-crispy.jpg"},
  {id:9, name:"Siomay Ayam", cat:"Camilan", price:14000, desc:"Siomay ayam kukus dengan bumbu kacang.", foto:"img/siomay-ayam.jpg"},
  {id:10, name:"Kerupuk Pangsit", cat:"Camilan", price:8000, desc:"Kerupuk pangsit renyah, cocok untuk pendamping mie.", foto:"img/kerupuk-pangsit.jpg"},
  {id:11, name:"Es Teh Manis", cat:"Minuman", price:6000, desc:"Teh melati diseduh segar, gula bisa dikurangi.", foto:"img/es-teh-manis.jpg"},
  {id:12, name:"Es Jeruk Peras", cat:"Minuman", price:12000, desc:"Jeruk peras asli tanpa pewarna.", badge:"Segar", foto:"img/es-jeruk-peras.jpg"},
  {id:13, name:"Es Kopi Susu Gula Aren", cat:"Minuman", price:18000, desc:"Kopi, susu segar, dan gula aren cair.", badge:"Baru", foto:"img/es-kopi-susu.jpg"},
  {id:14, name:"Es Cendol", cat:"Minuman", price:15000, desc:"Cendol pandan, santan, dan gula merah.", foto:"img/es-cendol.jpg"},
  {id:15, name:"Teh Jahe Hangat", cat:"Minuman", price:9000, desc:"Teh hangat dengan jahe bakar dan gula aren.", foto:"img/teh-jahe-hangat.jpg"}
];
const $ = s => document.querySelector(s);
const rupiah = n => "Rp" + n.toLocaleString("id-ID");

/* ===== 3. FOTO MENU: file gambar di folder img/ ===== */
/* Nama file tiap menu ada di daftar MENU (field foto). Simpan atau ganti file di folder img/ dengan nama yang sama.
   Jika file belum ada, kotak "Foto belum ditambahkan" yang tampil. */
const picHTML = m => `<span class="kosong">Foto belum ditambahkan</span><img src="${m.foto}" alt="${m.name}" loading="lazy" onerror="this.remove()">`;
function renderHero(){   // bagian atas: kartu info; jika file img/hero.jpg ada, diganti foto
  $("#heroSide").innerHTML = `<div class="info-card"><h2>Buka hari ini</h2><p class="jam">08.00–21.00 WIB</p><p>Jl. Laswi No.182, Samoja, Batununggal, Bandung</p><ul><li>COD tersedia untuk pesanan diantar</li></ul></div>`;
  const im = new Image();
  im.onload = () => { $("#heroSide").innerHTML = `<div class="hero-photo"><img src="${FOTO_UTAMA}" alt="Mie Ayam Mas Londo Jenggot"></div>`; };
  im.src = FOTO_UTAMA;
}

/* ===== 4. KERANJANG: {idMenu: jumlah}, disimpan di browser ===== */
let cart = {};
try { cart = JSON.parse(localStorage.getItem("cart-londo") || "{}"); } catch(e){}
const save = () => { try { localStorage.setItem("cart-londo", JSON.stringify(cart)); } catch(e){} };
const find = id => MENU.find(m => m.id === +id);
function change(id, d){
  cart[id] = Math.max(0, (cart[id] || 0) + d);
  if (!cart[id]) delete cart[id];
  save(); updateRow(id); renderCart();
}
const entries = () => Object.keys(cart).map(id => ({item: find(id), qty: cart[id]})).filter(e => e.item);
const subtotal = () => entries().reduce((s, e) => s + e.item.price * e.qty, 0);
const total = () => subtotal() + ongkir();
const mode = () => document.querySelector("input[name=mode]:checked").value;
const ongkir = () => (mode() === "antar" && subtotal() > 0) ? ONGKIR : 0;

/* ===== 4. TAMPILAN MENU ===== */
let cat = "Mie Ayam", q = "";
function renderTabs(){
  const cats = [...new Set(MENU.map(m => m.cat))];
  $("#tabs").innerHTML = cats.map(c => `<button class="tab" type="button" data-cat="${c}" aria-pressed="${c === cat && !q}">${c}</button>`).join("");
}
const ctlHTML = (m, n) => n
  ? `<span class="qty new"><button type="button" data-dec="${m.id}" aria-label="Kurangi ${m.name}">−</button><output>${n}</output><button type="button" data-inc="${m.id}" aria-label="Tambah ${m.name}">+</button></span>`
  : `<button class="add" type="button" data-inc="${m.id}">Tambah</button>`;
function updateRow(id){   // ubah satu kartu saja, tanpa menggambar ulang semua kartu
  const card = document.querySelector(`.item[data-id="${id}"]`); if (!card) return;
  const n = cart[id] || 0, box = card.querySelector(".ctl"), out = box.querySelector("output");
  if (n && out){ out.textContent = n; out.classList.remove("tick"); void out.offsetWidth; out.classList.add("tick"); }
  else box.innerHTML = ctlHTML(find(id), n);
}
function renderMenu(){
  const key = q.trim().toLowerCase();
  const list = MENU.filter(m => key ? (m.name + " " + m.desc).toLowerCase().includes(key) : m.cat === cat);
  $("#grid").innerHTML = list.length ? list.map((m, i) => `<article class="item" data-id="${m.id}" style="--i:${i}">${m.badge ? `<span class="tag">${m.badge}</span>` : ""}
      <div class="pic">${picHTML(m)}</div><h3>${m.name}</h3><p class="desc">${m.desc}</p>
      <div class="row"><span class="price">${rupiah(m.price)}</span><span class="ctl">${ctlHTML(m, cart[m.id] || 0)}</span></div></article>`).join("")
    : `<p class="empty">Menu tidak ditemukan. Coba kata lain.</p>`;
}
function enterGrid(){   // jalankan animasi kartu muncul bergantian
  const g = $("#grid"); g.classList.remove("enter"); void g.offsetWidth; g.classList.add("enter");
  clearTimeout(enterGrid.t); enterGrid.t = setTimeout(() => g.classList.remove("enter"), 900);
}
$("#q").addEventListener("input", e => { q = e.target.value; renderTabs(); renderMenu(); enterGrid(); });
$("#tabs").addEventListener("click", e => { const b = e.target.closest("[data-cat]"); if (b){ cat = b.dataset.cat; q = ""; $("#q").value = ""; renderTabs(); renderMenu(); enterGrid(); }});
$("#grid").addEventListener("click", e => {
  const i = e.target.closest("[data-inc]"), d = e.target.closest("[data-dec]");
  if (i){ fly(i); change(i.dataset.inc, 1); } if (d) change(d.dataset.dec, -1);
});

/* ===== 5. TAMPILAN PESANAN (drawer) ===== */
let prevN = 0;
function renderCart(){
  const list = entries(), n = list.reduce((s, e) => s + e.qty, 0);
  $("#badge").textContent = n;
  if (n > prevN){ const b = $("#badge"); b.classList.remove("bump"); void b.offsetWidth; b.classList.add("bump"); }
  prevN = n;
  $("#empty").hidden = n > 0;
  $("#lines").innerHTML = list.map(e => `<li><div>${e.item.name}<small>${rupiah(e.item.price)} × ${e.qty}</small></div>
    <div class="qty"><button type="button" data-dec="${e.item.id}" aria-label="Kurangi ${e.item.name}">−</button><output>${e.qty}</output><button type="button" data-inc="${e.item.id}" aria-label="Tambah ${e.item.name}">+</button></div></li>`).join("");
  $("#sub").textContent = rupiah(subtotal());
  $("#ongkir").textContent = rupiah(ongkir());
  $("#total").textContent = rupiah(subtotal() + ongkir());
  $("#alamatBox").hidden = mode() === "ambil";
  renderBayar();
  $("#fab").hidden = n === 0;
  $("#fab").textContent = `Lihat pesanan · ${n} item · ${rupiah(subtotal() + ongkir())}`;
}
$("#lines").addEventListener("click", e => {
  const i = e.target.closest("[data-inc]"), d = e.target.closest("[data-dec]");
  if (i) change(i.dataset.inc, 1); if (d) change(d.dataset.dec, -1);
});
document.querySelectorAll("input[name=mode]").forEach(r => r.addEventListener("change", renderCart));

function toggle(open){
  $("#drawer").classList.toggle("open", open);
  $("#drawer").setAttribute("aria-hidden", !open);
  $("#overlay").hidden = !open;
  if (open) $("#closeCart").focus(); else $("#openCart").focus();
}
$("#openCart").addEventListener("click", () => toggle(true));
$("#closeCart").addEventListener("click", () => toggle(false));
$("#overlay").addEventListener("click", () => toggle(false));
document.addEventListener("keydown", e => { if (e.key === "Escape") toggle(false); });

/* ===== 6. KIRIM PESANAN: validasi lalu buka WhatsApp ===== */
$("#form").addEventListener("submit", e => {
  e.preventDefault();
  const nama = $("#nama").value.trim(), hp = $("#hp").value.replace(/[\s-]/g, ""), alamat = $("#alamat").value.trim();
  const antar = mode() === "antar", list = entries();
  const err = {
    nama: nama.length < 2 ? "Isi nama minimal 2 huruf." : "",
    hp: /^(\+?62|0)8\d{7,12}$/.test(hp) ? "" : "Masukkan nomor HP yang valid, contoh: 081234567890.",
    alamat: antar && alamat.length < 10 ? "Tulis alamat lengkap (jalan, nomor, RT/RW)." : ""
  };
  Object.keys(err).forEach(k => $("#e-" + k).textContent = err[k]);
  if (!list.length){ $("#empty").textContent = "Pilih minimal satu menu sebelum mengirim pesanan."; $("#empty").hidden = false; return; }
  if (Object.values(err).some(Boolean)) return;

  const baris = list.map(e => `- ${e.item.name} x${e.qty} = ${rupiah(e.item.price * e.qty)}`).join("\n");
  const catatan = $("#catatan").value.trim();
  const pesan = `Halo Mie Ayam Mas Londo Jenggot, saya ingin memesan:\n${baris}\n\nSubtotal: ${rupiah(subtotal())}\nOngkir: ${rupiah(ongkir())}\nTotal: ${rupiah(subtotal() + ongkir())}\n\n` +
    `Pembayaran: ${PEMBAYARAN.find(p => p.id === bayar).nama}\nNama: ${nama}\nHP: ${hp}\n${antar ? "Diantar ke: " + alamat : "Ambil di resto"}${catatan ? "\nCatatan: " + catatan : ""}`;
  window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(pesan)}`, "_blank", "noopener");
});

/* ===== MULAI ===== */
$("#bayarRingkas").textContent = PEMBAYARAN.map(p => p.nama).join(", ");
$("#waFoot").href = `https://wa.me/${WA_NUMBER}`;
$("#year").textContent = new Date().getFullYear();
renderHero();
$("#fab").addEventListener("click", () => toggle(true));
renderTesti(); isiMenuUlasan(); renderFaq();
renderTabs(); renderMenu(); renderCart(); enterGrid();

/* ===== 8. ANIMASI MUNCUL SAAT DIGULIR ===== */
if ("IntersectionObserver" in window){
  const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting){ en.target.classList.add("in"); io.unobserve(en.target); } }), {threshold: .15});
  document.querySelectorAll(".facts li, #info > div, #menu h2, .toolbar, #testi h2, #faq h2, .quote").forEach(el => { el.classList.add("reveal"); io.observe(el); });
}

/* ===== 9. ANIMASI KLIK ===== */
const noMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
// riak air di tombol yang diklik
document.addEventListener("click", e => {
  const b = e.target.closest(".btn,.add,.tab,.qty button,.cart-btn,.fab,.x");
  if (!b || noMotion) return;
  const rc = b.getBoundingClientRect(), d = Math.max(rc.width, rc.height) * 2, rp = document.createElement("i");
  rp.className = "ripple";
  rp.style.cssText = `width:${d}px;height:${d}px;left:${e.clientX - rc.left - d / 2}px;top:${e.clientY - rc.top - d / 2}px`;
  b.classList.add("rp-host"); b.appendChild(rp);
  rp.addEventListener("animationend", () => rp.remove());
});
// gambar menu terbang ke tombol Pesanan saat ditambahkan
function fly(btn){
  const src = btn.closest(".item") && btn.closest(".item").querySelector(".pic");
  if (!src || noMotion) return;
  const s = src.getBoundingClientRect(), t = $("#openCart").getBoundingClientRect(), el = document.createElement("div");
  const im = src.querySelector("img"); el.className = "fly"; el.innerHTML = im ? im.outerHTML : "+1";
  el.style.cssText = `left:${s.left + s.width / 2 - 32}px;top:${s.top + s.height / 2 - 32}px`;
  document.body.appendChild(el);
  const dx = t.left + t.width / 2 - (s.left + s.width / 2), dy = t.top + t.height / 2 - (s.top + s.height / 2);
  el.animate([
    {transform: "translate(0,0) scale(1)", opacity: 1},
    {transform: `translate(${dx * .5}px,${dy * .5 - 60}px) scale(.85)`, opacity: 1, offset: .45},
    {transform: `translate(${dx}px,${dy}px) scale(.15)`, opacity: .4}
  ], {duration: 750, easing: "cubic-bezier(.5,0,.75,.4)"}).onfinish = () => el.remove();
}

/* ===== 11. PEMBAYARAN DAN ULASAN ===== */
function bayarOpsi(){ return PEMBAYARAN.filter(p => p.untuk.includes(mode())); }
function infoBayar(){ return PEMBAYARAN.find(p => p.id === bayar).info.replace("{total}", rupiah(total())); }
function renderBayar(){   // daftar metode menyesuaikan cara terima pesanan (antar atau ambil)
  const opsi = bayarOpsi();
  if (!opsi.some(p => p.id === bayar)) bayar = opsi[0].id;
  $("#bayarList").innerHTML = opsi.map(p => `<label class="pay"><input type="radio" name="bayar" value="${p.id}"${p.id === bayar ? " checked" : ""}><span>${p.nama}</span></label>`).join("");
  $("#bayarInfo").textContent = infoBayar();
}
$("#bayarList").addEventListener("change", e => { bayar = e.target.value; $("#bayarInfo").textContent = infoBayar(); });

function renderTesti(){
  const list = semuaUlasan();
  $("#testiGrid").innerHTML = list.length ? list.map(t => `<blockquote class="quote"><div class="stars" role="img" aria-label="${t.bintang} dari 5 bintang">${"★".repeat(t.bintang)}${"☆".repeat(5 - t.bintang)}</div><p>${esc(t.teks)}</p>
    <div class="who"><span class="avatar">${esc(t.nama.charAt(0).toUpperCase())}</span><div><strong>${esc(t.nama)}</strong>${esc([t.area, t.menu].filter(Boolean).join(" · "))}${t.baru ? `<em class="baru">Ulasan Anda, belum diverifikasi</em>` : ""}</div></div></blockquote>`).join("") : `<p class="empty">Belum ada ulasan. Jadilah yang pertama menulis.</p>`;
  const n = list.length, rata = n ? list.reduce((s, t) => s + t.bintang, 0) / n : 0;
  $("#ringkasUlasan").textContent = n ? `★ ${rata.toFixed(1).replace(".", ",")} dari 5 · ${n} ulasan` : "";
}
function isiMenuUlasan(){ $("#rMenu").innerHTML = '<option value="">Menu yang dipesan (opsional)</option>' + MENU.map(m => `<option>${m.name}</option>`).join(""); }
function faqData(){ return [
  {q:"Apakah pesanan bisa diantar?", a:`Bisa. Area antar Bandung dan sekitarnya, maksimal 8 km. Ongkir ${rupiah(ONGKIR)} per pesanan.`},
  {q:"Apakah ada COD (bayar di tempat)?", a:"Ada. Pilih “Bayar di tempat (COD)” di panel Pesanan. Metode ini khusus pesanan yang diantar."},
  {q:"Metode pembayaran apa saja yang tersedia?", a:PEMBAYARAN.map(p => p.nama).join(", ") + "."},
  {q:"Berapa lama pesanan sampai?", a:"Estimasi 30–45 menit di sekitar Batununggal. Saat jam ramai bisa lebih lama, admin akan memberi kabar."},
  {q:"Bisa pesan banyak untuk acara?", a:"Bisa. Hubungi admin lewat WhatsApp minimal satu hari sebelumnya agar stok dan waktu pengantaran bisa diatur."},
  {q:"Pesanan saya salah atau kurang, bagaimana?", a:"Hubungi admin lewat WhatsApp segera dengan foto pesanan. Kami bantu ganti atau kembalikan selisihnya."},
  {q:"Boleh request tanpa pedas atau tanpa sayur?", a:"Boleh. Tulis di kolom Catatan saat memesan."}
]; }
function renderFaq(){
  $("#faqList").innerHTML = faqData().map((f, i) => `<details class="qa"${i === 0 ? " open" : ""}><summary>${f.q}</summary><p>${f.a}</p></details>`).join("");
}

/* ===== 12. FORM ULASAN DAN PERTANYAAN ===== */
$("#reviewForm").addEventListener("submit", e => {
  e.preventDefault();
  const nama = $("#rNama").value.trim(), teks = $("#rTeks").value.trim(), menu = $("#rMenu").value;
  const b = document.querySelector("input[name=bintang]:checked");
  $("#e-rNama").textContent = nama.length < 2 ? "Isi nama minimal 2 huruf." : "";
  $("#e-rBintang").textContent = b ? "" : "Pilih jumlah bintang.";
  $("#e-rTeks").textContent = teks.length < 10 ? "Tulis ulasan minimal 10 karakter." : "";
  if (nama.length < 2 || !b || teks.length < 10) return;
  ULASAN.push({nama, menu, bintang: +b.value, teks, baru: true});
  const ok = simpanUlasan();
  renderTesti(); e.target.reset();
  const wa = `https://wa.me/${WA_NUMBER}?text=` + encodeURIComponent(`Halo Mie Ayam Mas Londo Jenggot, saya ingin mengirim ulasan:\nNama: ${nama}\nMenu: ${menu || "-"}\nNilai: ${b.value}/5\n${teks}`);
  $("#rNote").innerHTML = `Terima kasih! Ulasan Anda tampil di perangkat ini${ok ? "" : " (penyimpanan penuh)"}. Agar tampil untuk semua pelanggan, <a href="${wa}" target="_blank" rel="noopener">kirim juga ke admin lewat WhatsApp</a>.`;
});
$("#askForm").addEventListener("submit", e => {
  e.preventDefault();
  const t = $("#askQ").value.trim();
  if (t.length < 5){ $("#askQ").focus(); return; }
  window.open(`https://wa.me/${WA_NUMBER}?text=` + encodeURIComponent("Halo Mie Ayam Mas Londo Jenggot, saya ingin bertanya: " + t), "_blank", "noopener");
});
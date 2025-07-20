document
  .getElementById("registerForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();                // Sayfa yenilenmesin

    // Form alanlarını oku
    const ad           = document.getElementById("ad").value.trim();
    const soyad        = document.getElementById("soyad").value.trim();
    const email        = document.getElementById("email").value.trim();
    const sifre        = document.getElementById("sifre").value;
    const sifreTekrar  = document.getElementById("sifreTekrar").value;

    if (sifre !== sifreTekrar) {
      return alert("Şifreler uyuşmuyor!");
    }

    try {
      // ‼️ BACKEND API ÇAĞRISI
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: ad + "_" + soyad,      // örnek kullanıcı adı
          email,
          password: sifre
        })
      });

      const data = await res.json();

      if (res.ok) {
        alert("✅ Kayıt başarılı!");
        // İstersen data.token varsa localStorage'a kaydedip giriş sayfasına gidebilirsin
        window.location.href = "index.html";
      } else {
        alert("❌ Hata: " + (data.message || "Kayıt olmadı"));
      }
    } catch (err) {
      console.error(err);
      alert("Sunucuya bağlanılamadı!");
    }
  });

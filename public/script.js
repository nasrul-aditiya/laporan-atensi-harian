function formatTanggal(tgl) {
  const hari = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

  const bulan = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  const d = new Date(tgl);

  return `${hari[d.getDay()]}, ${d.getDate()} ${
    bulan[d.getMonth()]
  } ${d.getFullYear()}`;
}

function copyLaporan() {
  const textarea = document.getElementById("hasil");

  // validasi
  if (!textarea.value.trim()) {
    Swal.fire({
      icon: "warning",
      title: "Peringatan",
      text: "Belum ada laporan untuk disalin",
    });
    return;
  }

  // METHOD MODERN
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard
      .writeText(textarea.value)
      .then(() => {
        Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: "Laporan berhasil disalin",
          timer: 2000,
          showConfirmButton: false,
        });
      })
      .catch(() => {
        fallbackCopy(textarea);
      });
  } else {
    // fallback browser lama / non HTTPS
    fallbackCopy(textarea);
  }
}

// FALLBACK COPY
function fallbackCopy(textarea) {
  textarea.select();
  textarea.setSelectionRange(0, 99999);

  try {
    document.execCommand("copy");

    // hilangkan block/select
    window.getSelection().removeAllRanges();
    textarea.blur();

    Swal.fire({
      icon: "success",
      title: "Berhasil",
      text: "Laporan berhasil disalin",
      timer: 2000,
      showConfirmButton: false,
    });
  } catch (err) {
    Swal.fire({
      icon: "error",
      title: "Gagal",
      text: "Browser tidak mendukung copy otomatis",
    });
  }
}

function toggleInput(medsos, index) {
  const checkbox = document.getElementById(medsos + index);

  // Membuat ID input otomatis
  const inputId =
    "link" + medsos.charAt(0).toUpperCase() + medsos.slice(1) + index;

  const input = document.getElementById(inputId);

  if (checkbox.checked) {
    input.disabled = false;
    input.style.background = "#ffffff";
    input.style.cursor = "text";
    input.style.opacity = "1";
    input.focus();
  } else {
    input.disabled = true;
    input.value = "";
    input.style.background = "#f1f3f5";
    input.style.cursor = "not-allowed";
    input.style.opacity = "0.7";
  }
}

function buatInputPostingan() {
  const jumlah = document.getElementById("jumlah").value;
  const container = document.getElementById("postingContainer");

  container.innerHTML = "";

  for (let i = 1; i <= jumlah; i++) {
    container.innerHTML += `
      <div class="posting-card">

        <div class="posting-header">
          <i class="fa-solid fa-file-lines"></i>
          Postingan ${i}
        </div>

        <div class="form-group">
          <label>Judul Konten</label>

          <div class="input-box">
            <i class="fa-solid fa-pen"></i>

            <input
              type="text"
              id="judul${i}"
              placeholder="Masukkan judul konten"
            />
          </div>
        </div>

        <div class="platform-grid">

          <div class="platform-item">
            <label>
              <input
                type="checkbox"
                id="ig${i}"
                checked
                onchange="toggleInput('ig',${i})"
              />
              Instagram
            </label>

            <input
              type="text"
              id="linkIg${i}"
              placeholder="Link Instagram"
            />
          </div>

          <div class="platform-item">
            <label>
              <input
                type="checkbox"
                id="fb${i}"
                checked
                onchange="toggleInput('fb',${i})"
              />
              Facebook
            </label>

            <input
              type="text"
              id="linkFb${i}"
              placeholder="Link Facebook"
            />
          </div>

          <div class="platform-item">
            <label>
              <input
                type="checkbox"
                id="x${i}"
                checked
                onchange="toggleInput('x',${i})"
              />
              X / Twitter
            </label>

            <input
              type="text"
              id="linkX${i}"
              placeholder="Link X / Twitter"
            />
          </div>

          <div class="platform-item">
            <label>
              <input
                type="checkbox"
                id="tt${i}"
                checked
                onchange="toggleInput('tt',${i})"
              />
              TikTok
            </label>

            <input
              type="text"
              id="linkTt${i}"
              placeholder="Link TikTok"
            />
          </div>

        </div>
      </div>
    `;
    // Sinkron status checkbox saat pertama load
    toggleInput("ig", i);
    toggleInput("fb", i);
    toggleInput("x", i);
    toggleInput("tt", i);
  }
}

buatInputPostingan();

function buatLaporan() {
  const tanggalInput = document.getElementById("tanggal").value;
  const jumlah = document.getElementById("jumlah").value;

  if (!tanggalInput) {
    Swal.fire({
      icon: "warning",
      title: "Peringatan",
      text: "Tanggal kegiatan wajib diisi",
    });
    return;
  }

  let uraian = "";

  for (let i = 1; i <= jumlah; i++) {
    const judul = document.getElementById(`judul${i}`).value.trim();

    if (!judul) {
      Swal.fire({
        icon: "warning",
        title: "Data Belum Lengkap",
        text: `Judul konten pada Postingan ${i} wajib diisi`,
        didClose: () => {
          document.getElementById(`judul${i}`).focus();
        },
      });
      return;
    }

    uraian += `${i}. Konten Informatif "${judul}"\n \n`;

    if (document.getElementById(`ig${i}`).checked) {
      const link = document.getElementById(`linkIg${i}`).value.trim();

      if (!link) {
        Swal.fire({
          icon: "warning",
          title: "Data Belum Lengkap",
          text: `Link Instagram pada Postingan ${i} wajib diisi`,
          didClose: () => {
            document.getElementById(`linkIg${i}`).focus();
          },
        });
        return;
      }
      uraian += `Instagram : ${link}\n \n`;
    }

    if (document.getElementById(`fb${i}`).checked) {
      const link = document.getElementById(`linkFb${i}`).value.trim();

      if (!link) {
        Swal.fire({
          icon: "warning",
          title: "Data Belum Lengkap",
          text: `Link Facebook pada Postingan ${i} wajib diisi`,
          didClose: () => {
            document.getElementById(`linkFb${i}`).focus();
          },
        });
        return;
      }
      uraian += `Facebook  : ${link}\n \n`;
    }

    if (document.getElementById(`x${i}`).checked) {
      const link = document.getElementById(`linkX${i}`).value.trim();

      if (!link) {
        Swal.fire({
          icon: "warning",
          title: "Data Belum Lengkap",
          text: `Link X / Twitter pada Postingan ${i} wajib diisi`,
          didClose: () => {
            document.getElementById(`linkX${i}`).focus();
          },
        });
        return;
      }
      uraian += `X/Twitter : ${link}\n \n`;
    }

    if (document.getElementById(`tt${i}`).checked) {
      const link = document.getElementById(`linkTt${i}`).value.trim();

      if (!link) {
        Swal.fire({
          icon: "warning",
          title: "Data Belum Lengkap",
          text: `Link TikTok pada Postingan ${i} wajib diisi`,
          didClose: () => {
            document.getElementById(`linkTt${i}`).focus();
          },
        });
        return;
      }
      uraian += `TikTok    : ${link}\n \n`;
    }
  }

  const tanggal = formatTanggal(tanggalInput);

  const laporan = `LAPORAN ATENSI PIMPINAN

Assalamu’alaikum Wr. Wb. Kepada Yth :
1. Plt. Direktur Jenderal Imigrasi;
2. Sekretaris Direktorat Jenderal Imigrasi;
3. Para Direktur di lingkungan Direktorat Jenderal Imigrasi;
4. Kepala Kantor Wilayah Direktorat Jenderal Imigrasi Kalimantan Barat;

I. KEGIATAN
Kegiatan Kinerja Harian, ${tanggal}

II. WAKTU DAN TEMPAT
Waktu  : ${tanggal}
Pukul  : 14.00 - 15.00 WIB
Tempat : Kanim Sambas

III. URAIAN KEGIATAN
${uraian}Demikian Laporan Kegiatan ini kami sampaikan, atas perhatiannya kami ucapkan terima kasih.

Salam Hormat
Kepala Kantor Imigrasi Kelas II TPI Sambas`;

  document.getElementById("hasil").value = laporan;
}

function simpanLaporan() {
  const tanggal = document.getElementById("tanggal").value;
  const jumlah = document.getElementById("jumlah").value;
  const hasil = document.getElementById("hasil").value;

  // ✅ VALIDASI 1: tanggal
  if (!tanggal) {
    Swal.fire("Peringatan", "Tanggal wajib diisi", "warning");
    return;
  }

  // ✅ VALIDASI 2: laporan sudah dibuat
  if (!hasil || hasil.trim() === "") {
    Swal.fire("Peringatan", "Klik 'Buat Laporan' terlebih dahulu", "warning");
    return;
  }

  let dataPostingan = [];

  for (let i = 1; i <= jumlah; i++) {
    const judul = document.getElementById(`judul${i}`).value.trim();

    // ✅ VALIDASI 3: judul wajib
    if (!judul) {
      Swal.fire("Peringatan", `Judul Postingan ${i} wajib diisi`, "warning");
      document.getElementById(`judul${i}`).focus();
      return;
    }

    let posting = {
      judul: judul,
      platform: [],
    };

    // ===== IG =====
    if (document.getElementById(`ig${i}`).checked) {
      const link = document.getElementById(`linkIg${i}`).value.trim();

      if (!link) {
        Swal.fire(
          "Peringatan",
          `Link Instagram Postingan ${i} wajib diisi`,
          "warning",
        );
        document.getElementById(`linkIg${i}`).focus();
        return;
      }

      posting.platform.push({
        jenis: "ig",
        link: link,
      });
    }

    // ===== FB =====
    if (document.getElementById(`fb${i}`).checked) {
      const link = document.getElementById(`linkFb${i}`).value.trim();

      if (!link) {
        Swal.fire(
          "Peringatan",
          `Link Facebook Postingan ${i} wajib diisi`,
          "warning",
        );
        document.getElementById(`linkFb${i}`).focus();
        return;
      }

      posting.platform.push({
        jenis: "fb",
        link: link,
      });
    }

    // ===== X =====
    if (document.getElementById(`x${i}`).checked) {
      const link = document.getElementById(`linkX${i}`).value.trim();

      if (!link) {
        Swal.fire(
          "Peringatan",
          `Link X/Twitter Postingan ${i} wajib diisi`,
          "warning",
        );
        document.getElementById(`linkX${i}`).focus();
        return;
      }

      posting.platform.push({
        jenis: "x",
        link: link,
      });
    }

    // ===== TIKTOK =====
    if (document.getElementById(`tt${i}`).checked) {
      const link = document.getElementById(`linkTt${i}`).value.trim();

      if (!link) {
        Swal.fire(
          "Peringatan",
          `Link TikTok Postingan ${i} wajib diisi`,
          "warning",
        );
        document.getElementById(`linkTt${i}`).focus();
        return;
      }

      posting.platform.push({
        jenis: "tt",
        link: link,
      });
    }

    dataPostingan.push(posting);
  }

  // ✅ VALIDASI 4: konfirmasi
  Swal.fire({
    title: "Simpan Laporan?",
    text: "Pastikan semua data sudah benar",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Ya, Simpan",
    cancelButtonText: "Batal",
  }).then((result) => {
    if (result.isConfirmed) {
      fetch("/api/laporan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
        body: JSON.stringify({
          tanggal: tanggal,
          postingan: dataPostingan,
        }),
      })
        .then((res) => {
          if (!res.ok) throw new Error();
          return res.json();
        })
        .then(() => {
          Swal.fire({
            icon: "success",
            title: "Berhasil",
            text: "Laporan berhasil disimpan",
          });

          // reset form (optional)
          document.getElementById("hasil").value = "";
        })
        .catch(() => {
          Swal.fire("Error", "Gagal simpan data", "error");
        });
    }
  });
}

// cek login
async function cekLogin() {
  const token = localStorage.getItem("token");

  if (!token) {
    window.location.href = "login.html";
    return;
  }

  try {
    const res = await fetch("/api/cek-token", {
      headers: {
        Authorization: token,
      },
    });

    if (!res.ok) {
      localStorage.clear();

      Swal.fire({
        icon: "warning",
        title: "Sesi Berakhir",
        text: "Silakan login kembali",
      }).then(() => {
        window.location.href = "login.html";
      });

      return;
    }
  } catch (err) {
    console.error(err);
  }
}

cekLogin();

// logout
function logout() {
  Swal.fire({
    title: "Yakin ingin keluar?",
    text: "Anda akan keluar dari sistem",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Ya, Logout",
    cancelButtonText: "Batal",
    confirmButtonColor: "#e74c3c",
    cancelButtonColor: "#7f8c8d",
  }).then((result) => {
    if (result.isConfirmed) {
      localStorage.removeItem("token");
      localStorage.removeItem("role");

      Swal.fire({
        icon: "success",
        title: "Berhasil Logout",
        timer: 1200,
        showConfirmButton: false,
      });

      setTimeout(() => {
        window.location.href = "login.html";
      }, 1200);
    }
  });
}

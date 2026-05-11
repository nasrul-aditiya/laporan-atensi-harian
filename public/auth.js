// cek login
function cekLogin() {
  const token = localStorage.getItem("token");

  if (!token) {
    window.location.href = "login.html";
  }
}

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
